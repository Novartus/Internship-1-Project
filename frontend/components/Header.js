import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    // Perform localStorage action
    setToken(localStorage.getItem("token"));
  }, []);
  const router = useRouter();
  // const storage = window.localStorage;
  return (
    <>
      <header>
        <h1>A2 Group 1</h1>
        <title>Internship - A2 Group 1</title>
      </header>
      {!token ? (
        <div>
          <button
            className="btn"
            style={{
              float: "right",
              fontSize: "20px",
              color: "black",
              border: "none",
              borderRadius: "5px",
              margin: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push("/");
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <div>
          <button
            className="btn"
            style={{
              float: "right",
              fontSize: "20px",
              color: "black",
              border: "none",
              borderRadius: "5px",
              margin: "10px",
              cursor: "pointer",
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
              color: "black",
              border: "none",
              borderRadius: "5px",
              margin: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push("/profile-page");
            }}
          >
            View Profile
          </button>
          <button
            className="btn"
            style={{
              float: "right",
              fontSize: "20px",
              color: "black",
              border: "none",
              borderRadius: "5px",
              margin: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push("/gallery");
            }}
          >
            View Gallery
          </button>
        </div>
      )}

      {/* <h4 style={{ color: "wheat" }}>Implemented Features:</h4>
      <ul>
        <li>Add a new task</li>
        <li>Complete a task</li>
        <li>Toggle the view between All, Active and Completed tasks</li>
        <li>Remove one or all tasks under the Completed tab</li>
      </ul>
      <br /> */}
    </>
  );
}
