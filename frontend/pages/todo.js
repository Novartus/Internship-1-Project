import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Form from "../components/Form";
import Footer from "../components/Footer";
import List from "../components/List";
import axios from "axios";

const data = [
  { id: 1, content: "Start the demo", completed: true },
  { id: 2, content: "Introduce Team-members", completed: false },
  { id: 3, content: "Answer Questions", completed: false },
  { id: 4, content: "Explore Tech Stack", completed: false },
  { id: 5, content: "Ask for feedback", completed: false },
];

function Home() {
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, []);

  const [todos, setTodos] = useState([]);
  const [themeLight, setThemeLight] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState(todos);

  const themeClass = "dark";

  useEffect(async () => {
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
  }, []);

  useEffect(() => {
    const handleFilter = () => {
      switch (filterStatus) {
        case "active":
          return setFilteredTodos(todos.filter((todo) => !todo.completed));

        case "completed":
          return setFilteredTodos(todos.filter((todo) => todo.completed));

        default:
          return setFilteredTodos(todos);
      }
    };
    handleFilter();
  }, [todos, filterStatus]);

  return (
    <div className={`wrapper ${themeClass}`}>
      <div className="container">
        <Header themeLight={themeLight} setThemeLight={setThemeLight} />
        <main>
          <Form todos={todos} setTodos={setTodos} />
          <List
            todos={todos}
            setTodos={setTodos}
            filteredTodos={filteredTodos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
