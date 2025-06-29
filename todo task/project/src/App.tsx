import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { useAuthStore } from './stores/authStore';
import { useTaskStore } from './stores/taskStore';

function App() {
  const { user, loading, initialize } = useAuthStore();
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {user ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-lg text-gray-600">
              Here's an overview of your tasks and productivity.
            </p>
          </div>
          
          <Dashboard />
          <TaskFilters />
          
          <div className="mt-8">
            <TaskList />
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-gray-200 max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Welcome to TaskFlow
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                The ultimate task management solution that helps you organize, prioritize, and collaborate on tasks with your team. Sign in to get started and boost your productivity.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Organize Tasks</h3>
                  <p className="text-gray-600">Create, categorize, and prioritize your tasks with ease.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🤝</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborate</h3>
                  <p className="text-gray-600">Share tasks and work together with your team members.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
                  <p className="text-gray-600">Monitor your productivity and task completion rates.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;