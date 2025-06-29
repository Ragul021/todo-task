import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';

export const Dashboard: React.FC = () => {
  const { tasks } = useTaskStore();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => 
      t.due_date && 
      new Date(t.due_date) < new Date() && 
      t.status !== 'completed'
    ).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
          </div>
          
          {stat.title === 'Total Tasks' && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-medium text-gray-900">{completionRate}%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};