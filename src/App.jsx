import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Table from './components/Table';
import AddTaskButton from './components/AddTaskButton';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Task List</h2>
            <AddTaskButton onTaskAdded={handleTaskAdded} />
          </div>
          <Table key={refreshTrigger} refreshTrigger={refreshTrigger} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;