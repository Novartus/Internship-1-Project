import React, { useEffect, useState } from "react";
import axios from "axios";
import Item from "./Item";
import Filter from "./Filter";
import LoadingScreen from "../components/LoadingScreen";

export default function List({
  todos,
  setTodos,
  filteredTodos,
  filterStatus,
  setFilterStatus,
}) {
  const [leftTodoCount, setLeftTodoCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const unCompletedTodos = todos.filter((todo) => !todo.completed);
    setLeftTodoCount(unCompletedTodos.length);
  }, [todos]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const displaySearchedTodo = async () => {
    if (!searchInput.trim()) {
      const viewTasksResponse = await axios({
        method: "GET",
        url: "http://localhost:3000/auth/tasks-active",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (viewTasksResponse.status === 200) {
        setTodos(viewTasksResponse.data);
      } else {
        alert("Task Fetching failed!, Something went wrong");
      }
    }
    if (searchInput) {
      setLoading(true);
      const searchAPIResponse = await axios({
        method: "POST",
        url: "http://localhost:3000/auth/task-search", // search task API
        data: {
          task: searchInput.trim(),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (searchAPIResponse.status === 201) {
        setTodos(searchAPIResponse.data);
        setLoading(false);
      } else {
        alert("Something went wrong while searching");
        setLoading(false);
      }
    }
  };

  const textPlacer = filterStatus === "completed" ? "closed task" : "task";

  const clearCompletedTodos = () => {
    setTodos(todos.filter((todo) => !todo.completed));
    setFilterStatus("all");
  };

  if (isLoading) return <LoadingScreen />;
  return (
    <React.Fragment>
      <section className="todo-list-section">
        {filteredTodos.length < 1 ? (
          <p className="info-text">There's no {textPlacer}</p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <Item
                todo={todo}
                key={todo.task_id}
                setTodos={setTodos}
                todos={todos}
              />
            ))}
          </ul>
        )}

        <div>
          <br />
          <input
            type="text"
            name="todo-search"
            className="todo-search"
            style={{
              width: "100%",
              height: "40px",
              fontSize: "20px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            id="searchInput"
            placeholder="Search for a new todo..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e)}
          />
          <button
            type="submit"
            // style={{ display: "none" }}
            onClick={displaySearchedTodo}
          >
            Search
          </button>
        </div>

        <div className="todo-filter-control">
          <div className="todos-count">{leftTodoCount} Items Left</div>

          <div className="control-btn group filter-control-for-desktop">
            <Filter
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </div>

          <div className="control-btn">
            <button className="btn" onClick={clearCompletedTodos}>
              Clear Completed
            </button>
          </div>
        </div>
      </section>

      {/* For Mobile */}
      <section className="filter-control-for-mobile">
        <div className="control-btn group">
          <Filter
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </div>
      </section>
    </React.Fragment>
  );
}
