const MOCKAPI_URL = import.meta.env.VITE_MOCKAPI_URL; //https://694f6fae8531714d9bce1eee.mockapi.io/api/tasks

export const taskService = {
  // Get all tasks
  async getTasks() {
    try {
      const response = await fetch(MOCKAPI_URL);
      
      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }
      
      const tasks = await response.json();

      return tasks;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },

  // Get task by ID
  async getTaskById(id) {
    try {
        
      const response = await fetch(`${MOCKAPI_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }
      
      const task = await response.json();
      
      return task;
    } catch (error) {
      console.error(`Failed to fetch task ${id}:`, error);
      throw error;
    }
  },

  // Create new task
  async createTask(task) {
    const newTask = {
      task_name: task.name,
      due_date: task.dueDate ? new Date(task.dueDate).toISOString() : '',
      status: false,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(MOCKAPI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }
      
      const savedTask = await response.json();
      return savedTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  // Update task
  async updateTask(id, updates) {
    const apiUpdates = { ...updates };
    
    if (updates.status !== undefined && typeof updates.status === 'string') {
      apiUpdates.status = updates.status === 'completed';
    }

    try {
      const response = await fetch(`${MOCKAPI_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiUpdates),
      });

      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }
      
      const updatedTask = await response.json();
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  // Delete task
  async deleteTask(id) {

    try {
      const response = await fetch(`${MOCKAPI_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }
};