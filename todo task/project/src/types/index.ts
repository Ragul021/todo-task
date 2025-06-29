export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  shared_with?: string[];
  assignee_id?: string;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  due_date?: string;
}