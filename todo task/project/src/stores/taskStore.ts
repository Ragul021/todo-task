import { create } from 'zustand';
import { Task, TaskFilters, CreateTaskData } from '../types';
import { supabase } from '../lib/supabase';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  filters: TaskFilters;
  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskData) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  filters: {},
  
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ tasks: data || [] });
    } catch (error) {
      console.error('Fetch tasks error:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  createTask: async (taskData) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, status: 'pending' }])
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({ tasks: [data, ...state.tasks] }));
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },
  
  updateTask: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? data : task))
      }));
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },
  
  deleteTask: async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id)
      }));
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },
  
  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },
  
  getFilteredTasks: () => {
    const { tasks, filters } = get();
    
    return tasks.filter((task) => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.category && task.category !== filters.category) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }
}));