import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSave = (task) => {
    if (editingTask) {
      // Update the task if it's in edit mode
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? { ...t, ...task } : t))
      );
      setEditingTask(null);
    } else {
      // Add a new task to the list
      setTasks((prevTasks) => [task, ...prevTasks]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>

      {/* Pass handleSave as the onSave prop to TaskForm */}
      {editingTask && <TaskForm task={editingTask} onSave={handleSave} />}
      {!editingTask && <TaskForm onSave={handleSave} />}

      <div className="mt-8">
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <div>
                  <button
                    className="mr-4 text-blue-500"
                    onClick={() => setEditingTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TaskList;





