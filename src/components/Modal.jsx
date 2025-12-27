import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { WarningIcon } from '../assets/icons';

const Modal = ({ isOpen, onClose, title, onTaskAdded, taskId, mode = 'add' }) => {
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // load data in edit mode
    useEffect(() => {
        if (isOpen && mode === 'edit' && taskId) {
            loadTaskData();
        }

        // reset in add mode
        if (isOpen && mode === 'add') {
            resetForm();
        }
    }, [isOpen, mode, taskId]);

    const loadTaskData = async () => {
        setLoading(true);
        try {
            const task = await taskService.getTaskById(taskId);
            setTaskName(task.task_name || '');

            // convert date
            if (task.due_date) {
                const date = new Date(task.due_date);
                const formattedDate = date.toISOString().split('T')[0];
                setDueDate(formattedDate);
            } else {
                setDueDate('');
            }
        } catch (error) {
            console.error('Failed to load task:', error);
            setError('Failed to load task data');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTaskName('');
        setDueDate('');
        setError('');
    };

    if (!isOpen) return null;

    const handleSave = async () => {
        setError('');

        if (!taskName.trim()) {
            setError('Task name is required!');
            return;
        }

        if (!dueDate) {
            setError('Due date is required!');
            return;
        }

        const selectedDate = new Date(dueDate);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setError('Due date cannot be earlier than today!');
            return;
        }

        setLoading(true);

        try {
            if (mode === 'add') {
                // Create new task
                const newTask = await taskService.createTask({
                    name: taskName,
                    dueDate: dueDate
                });
            } else if (mode === 'edit' && taskId) {
                // Update existing task
                const updatedTask = await taskService.updateTask(taskId, {
                    task_name: taskName,
                    due_date: dueDate ? new Date(dueDate).toISOString() : ''
                });
            }

            // Reset form
            resetForm();

            //callback to refresh table
            if (onTaskAdded) {
                onTaskAdded();
            }

            onClose();
        } catch (error) {
            console.error('Save failed:', error);
            setError(`Failed to add/edit task. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const modalTitle = mode === 'edit' ? 'Edit Task' : title;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-full max-w-md p-4">

                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">{modalTitle}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-xl"
                        disabled={loading}
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                        <div className="flex items-center gap-2">
                            <WarningIcon />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Task Name *</label>
                        <input
                            type="text"
                            placeholder="Enter task name"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Due Date *</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                            min={new Date().toISOString().split('T')[0]}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 disabled:opacity-10 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {mode === 'edit' ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                mode === 'edit' ? 'Update Task' : 'Save Task'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;