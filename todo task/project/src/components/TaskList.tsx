import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ListTodo } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { useTaskStore } from '../stores/taskStore';
import { Task } from '../types';

export const TaskList: React.FC = () => {
  const { getFilteredTasks, loading } = useTaskStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = getFilteredTasks();

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <ListTodo className="h-6 w-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Tasks ({filteredTasks.length})
          </h2>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateTask}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
        >
          <Plus size={20} />
          <span>Add Task</span>
        </motion.button>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-200">
              <ListTodo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">
                Create your first task to get started with organizing your work.
              </p>
              <button
                onClick={handleCreateTask}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Create Task
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
      />
    </>
  );
};