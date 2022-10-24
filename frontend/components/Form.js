import React, { useState } from "react";
import axios from "axios";

// const idGenerator = (array) => {
//   const ids = array.map((item) => item.id);
//   return Math.max(...ids) + 1;
// };

export default function Form({ todos, setTodos }) {
  const [todoInput, setTodoInput] = useState("");
  const handleChange = (e) => {
    setTodoInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (todoInput) {
      const newTodo = {
        // id: idGenerator(todos),
        content: todoInput.trim(),
        completed: false,
        removed: false,
      };

      const addTaskResponse = await axios({
        method: "POST",
        url: "http://localhost:3000/auth/tasks",
        data: {
          title: todoInput.trim(),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Added Task Submitted", addTaskResponse);
      if (addTaskResponse.status === 201) {
        setTodos([...todos, newTodo]);
        setTodoInput("");
      } else {
        alert("Task adding Failed!, Something went wrong");
      }
      setTodoInput("");
    }
  };

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
