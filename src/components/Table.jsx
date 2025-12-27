import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import Actions from './Actions';
import { SearchIcon, SortIcon } from '../assets/icons';

const Table = ({ refreshTrigger, onTaskUpdate }) => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Sorting
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    
    // Search and Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [refreshTrigger]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Apply filters whenever tasks, search term, or status filter changes
    useEffect(() => {
        applyFilters();
    }, [tasks, debouncedSearchTerm, statusFilter]);

    const fetchTasks = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (error) {
            setError('Failed to load tasks. Please check your connection.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...tasks];

        // Apply search filter
        if (debouncedSearchTerm.trim()) {
            const term = debouncedSearchTerm.toLowerCase();
            result = result.filter(task => 
                task.task_name?.toLowerCase().includes(term)
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            const targetStatus = statusFilter === 'completed';
            result = result.filter(task => task.status === targetStatus);
        }

        setFilteredTasks(result);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        
        if (sortConfig.key === key) {
            direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        }
        
        setSortConfig({ key, direction });
        
        const sortedTasks = [...filteredTasks].sort((a, b) => {
            const aValue = a[key] || '';
            const bValue = b[key] || '';
            
            if (key === 'due_date') {
                const aDate = aValue ? new Date(aValue).getTime() : 0;
                const bDate = bValue ? new Date(bValue).getTime() : 0;
                
                return direction === 'asc' ? aDate - bDate : bDate - aDate;
            }
            
            return direction === 'asc' 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
        });
        
        setFilteredTasks(sortedTasks);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <SortIcon className="w-4 h-4 text-gray-300" strokeWidth={1.5} />;
        }
        
        if (sortConfig.direction === 'asc') {
            return <SortIcon className="w-4 h-4 text-white" strokeWidth={2} />;
        } else {
            return (
                <SortIcon 
                    className="w-4 h-4 text-white transform rotate-180" 
                    strokeWidth={2} 
                />
            );
        }
    };

    // Handle task status toggle
    const handleToggleStatus = async (id) => {
        try {
            const task = tasks.find(t => t.id === id);
            const newStatus = !task.status;

            await taskService.updateTask(id, { status: newStatus });

            setTasks(prev => prev.map(task =>
                task.id === id ? { ...task, status: newStatus } : task
            ));

            if (onTaskUpdate) onTaskUpdate();
        } catch (error) {
            console.error('Toggle error:', error);
            alert('Failed to update task status');
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskService.deleteTask(id);

            setTasks(prev => prev.filter(task => task.id !== id));

            if (onTaskUpdate) onTaskUpdate();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete task');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Get status
    const getStatusText = (status) => {
        return status ? 'Completed' : 'Pending';
    };

    // Get status color
    const getStatusColor = (status) => {
        return status
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    };

    const handleTaskUpdate = () => {
        fetchTasks();
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                <span className="ml-3 text-gray-600">Loading tasks...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div>
            {/* Search and Filter Controls */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Tasks
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by task name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <SearchIcon/>
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Filter Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                        >
                            <option value="all">All Tasks</option>
                            <option value="pending">Pending Only</option>
                            <option value="completed">Completed Only</option>
                        </select>
                    </div>

                </div>
            </div>

            {/* Table */}
            {filteredTasks.length === 0 ? (
                <div className="text-center py-8 border border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-gray-500 text-lg">No tasks match your filters</p>
                    <p className="text-gray-400 text-sm mt-1">
                        {searchTerm || statusFilter !== 'all' ? 'Try changing your search or filters' : 'Add your first task to get started!'}
                    </p>
                    {(searchTerm || statusFilter !== 'all') && (
                        <button
                            onClick={handleClearFilters}
                            className="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 border-collapse">
                        <thead className="bg-violet-600 text-white">
                            <tr>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">S.No</th>
                                
                                <th 
                                    className="border border-gray-300 px-4 py-3 text-left font-semibold cursor-pointer hover:bg-violet-700 transition-colors"
                                    onClick={() => handleSort('task_name')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Title</span>
                                        {getSortIcon('task_name')}
                                    </div>
                                </th>
                                
                                <th 
                                    className="border border-gray-300 px-4 py-3 text-left font-semibold cursor-pointer hover:bg-violet-700 transition-colors"
                                    onClick={() => handleSort('due_date')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Due Date</span>
                                        {getSortIcon('due_date')}
                                    </div>
                                </th>
                                
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Status</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredTasks.map((task, index) => (
                                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{index + 1}</td>

                                    <td className="border border-gray-300 px-4 py-3 font-medium">
                                        {task.task_name || 'Untitled Task'}
                                    </td>

                                    <td className="border border-gray-300 px-4 py-3">
                                        {formatDate(task.due_date)}
                                    </td>

                                    <td className="border border-gray-300 px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                                            {getStatusText(task.status)}
                                        </span>
                                    </td>

                                    <td className="border border-gray-300 px-4 py-3">
                                        <Actions
                                            taskId={task.id}
                                            status={task.status}
                                            onTaskUpdated={handleTaskUpdate}
                                            onDelete={() => handleDeleteTask(task.id)}
                                            onToggleStatus={() => handleToggleStatus(task.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Summary */}
                    <div className="mt-4 text-sm text-gray-600 flex items-center gap-4">
                        <span>
                            Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;