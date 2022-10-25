import React from "react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  return (
    <>
      <header>
        <h1>TODO App</h1>
        <title>Todo Application - A2 Group 1</title>
      </header>
      <button
        className="btn"
        style={{
          float: "right",
          fontSize: "20px",
          color: "white",
          border: "none",
          borderRadius: "5px",
          margin: "10px",
        }}
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/");
        }}
      >
        Log Out
      </button>
      <button
        className="btn"
        style={{
          float: "right",
          fontSize: "20px",
          color: "white",
          border: "none",
          borderRadius: "5px",
          margin: "10px",
        }}
        onClick={() => {
          router.push("/profile-page");
        }}
      >
        View Profile
      </button>
      <h4 style={{ color: "wheat" }}>Implemented Features:</h4>
      <ul>
        <li>Add a new task</li>
        <li>Complete a task</li>
        <li>Toggle the view between All, Active and Completed tasks</li>
        <li>Remove one or all tasks under the Completed tab</li>
      </ul>
      <br />
    </>
  );
}
