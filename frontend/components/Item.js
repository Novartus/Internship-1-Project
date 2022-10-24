import React, { useState } from "react";
import axios from "axios";

export default function Item({ todo, todos, setTodos }) {
  const [mutableTodo, setMutableTodo] = useState(todo);

  const classes = mutableTodo.completed ? "completed" : "";
  const checkIcon = mutableTodo.completed ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
      <path
        fill="none"
        stroke="#FFF"
        strokeWidth="2"
        d="M1 4.304L3.696 7l6-6"
      />
    </svg>
  ) : (
    ""
  );

  const toggleCompleted = async () => {
    console.log("toggleCompleted Called");

    const completeTaskResponse = await axios({
      method: "PATCH",
      url: "http://localhost:3000/auth/tasks-complete",
      data: {
        task_id: todo.task_id,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Complete Task Submitted", completeTaskResponse);
    if (completeTaskResponse.status === 200) {
      const viewTasksResponse = await axios({
        method: "GET",
        url: "http://localhost:3000/auth/tasks-active",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const viewTasksResponseData = viewTasksResponse.data;
      setTodos(viewTasksResponseData);
      setMutableTodo({ ...mutableTodo, completed: !mutableTodo.completed });
    } else {
      alert("Task Completion Update Status Failed!, Something went wrong");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const removeTaskResponse = await axios({
      method: "DELETE",
      url: "http://localhost:3000/auth/tasks-delete",
      data: {
        task_id: todo.task_id,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (removeTaskResponse.status === 200) {
      const viewTasksResponse = await axios({
        method: "GET",
        url: "http://localhost:3000/auth/tasks-active",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const viewTasksResponseData = viewTasksResponse.data;
      setTodos(viewTasksResponseData);
    } else {
      alert("Task removing Failed!, Something went wrong");
    }
  };

  return (
    <li className={classes}>
      <label htmlFor={`todoCheckbox-${todo.task_id}`}>Completed Checkbox</label>
      <input
        id={`todoCheckbox-${todo.task_id}`}
        type="checkbox"
        name="completed-checkbox"
        defaultChecked={mutableTodo.completed}
      />
      <div className="checkbox-border-wrap">
        <span className="checkbox" onClick={toggleCompleted}>
          {checkIcon}
        </span>
      </div>

      <p>{mutableTodo.title}</p>
      <div className="checkbox-border-wrap">
        <span
          className="checkbox"
          onClick={(e) => {
            handleDelete(e);
          }}
        >
          X
        </span>
      </div>
    </li>
  );
}
