import React, { useState } from "react";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

export default function Form({ todos, setTodos }) {
  const [todoInput, setTodoInput] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTodoInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (todoInput) {
      const newTodo = {
        title: todoInput.trim(),
        completed: false,
        removed: false,
      };

      setLoading(true);
      const addTaskResponse = await axios({
        method: "POST",
        url: "http://localhost:3000/auth/tasks", // add task API
        data: {
          title: todoInput.trim(),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (addTaskResponse.status === 201) {
        newTodo["task_id"] = addTaskResponse.data._id;
        setTodos([...todos, newTodo]);
        setTodoInput("");
        setLoading(false);
      } else {
        setLoading(false);
        alert("Task adding Failed!, Something went wrong");
      }
      setTodoInput("");
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="form-control">
      <div className="checkbox-border-wrap">
        <span className="checkbox"></span>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="todoInput">Add New Todo</label>
        <input
          type="text"
          name="todo-input"
          className="todo-input"
          id="todoInput"
          placeholder="Create a new todo..."
          value={todoInput}
          onChange={handleChange}
        />
        <button id="submitNewTodo" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
