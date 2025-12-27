import { useState } from 'react';
import Modal from './Modal';
import { EditIcon, TrashIcon } from '../assets/icons';

const Actions = ({ taskId, status, onToggleStatus, onDelete, onTaskUpdated }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleTaskUpdated = () => {
    setIsEditModalOpen(false);
    
    // refresh the table
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="flex gap-2">
        {/* Edit Button */}
        <button
          className="px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded text-sm font-medium transition"
          onClick={handleEditClick}
          title="Edit Task"
        >
          <EditIcon />
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition"
          title="Delete Task"
        >
          <TrashIcon />
        </button>

        {/* Toggle Status Button */}
        <button
          onClick={onToggleStatus}
          className={`px-3 py-1.5 rounded text-sm font-medium transition ${
            status 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          title={status ? 'Mark as Pending' : 'Mark as Completed'}
        >
          {status ? 'Pending' : 'Complete'}
        </button>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onTaskAdded={handleTaskUpdated}
        taskId={taskId}
        mode="edit"
        title="Edit Task"
      />
    </>
  );
};

export default Actions;