import { useState } from 'react';
import Modal from './Modal';
import { PlusIcon } from '../assets/icons';

const AddTaskButton = ({ onTaskAdded }) => {
  const [open, setOpen] = useState(false);

  const handleTaskAddedFromModal = () => {
    if (onTaskAdded) {
      onTaskAdded();
    }
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-violet-500 hover:bg-violet-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        <PlusIcon />
        Add New Task
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        onTaskAdded={handleTaskAddedFromModal}
        title="Add New Task"
      />
    </>
  );
};

export default AddTaskButton;