import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Circle, 
  PlayCircle,
  AlertCircle,
  Star,
  User
} from 'lucide-react';
import { Task } from '../types';
import { useTaskStore } from '../stores/taskStore';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTaskStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const statusIcons = {
    pending: Circle,
    in_progress: PlayCircle,
    completed: CheckCircle
  };

  const priorityColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100'
  };

  const statusColors = {
    pending: 'text-gray-600 bg-gray-100',
    in_progress: 'text-blue-600 bg-blue-100',
    completed: 'text-green-600 bg-green-100'
  };

  const StatusIcon = statusIcons[task.status];

  const handleStatusChange = async () => {
    const statusFlow = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending'
    } as const;

    try {
      await updateTask(task.id, { status: statusFlow[task.status] });
      toast.success('Task status updated!');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      setIsDeleting(false);
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 ${
        isDeleting ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleStatusChange}
            className="mt-1 hover:scale-110 transition-transform"
          >
            <StatusIcon 
              size={20} 
              className={`${statusColors[task.status].split(' ')[0]} ${
                task.status === 'completed' ? 'fill-current' : ''
              }`}
            />
          </button>
          
          <div className="flex-1">
            <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${
              task.status === 'completed' ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 text-sm mb-3">{task.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            <Star size={12} className="inline mr-1" />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
            {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
          </span>

          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {task.category}
          </span>
        </div>

        {task.due_date && (
          <div className={`flex items-center space-x-1 text-xs ${
            isOverdue ? 'text-red-600' : 'text-gray-500'
          }`}>
            {isOverdue && <AlertCircle size={12} />}
            <Calendar size={12} />
            <span>{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Created {format(new Date(task.created_at), 'MMM dd, yyyy')}</span>
          {task.updated_at !== task.created_at && (
            <span>Updated {format(new Date(task.updated_at), 'MMM dd, yyyy')}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};