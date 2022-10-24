import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import LoadingScreen from "../components/LoadingScreen";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone || !bio) {
      alert("Please fill all the fields");
      return;
    }
    setLoading(true);
    const registerAPIResponse = await axios({
      method: "POST",
      url: "http://localhost:3000/auth/register",
      data: {
        email: email,
        name: name,
        password: password,
        phone: phone,
        bio: bio,
      },
    });
    console.log("Submitted", registerAPIResponse);
    if (registerAPIResponse.status === 201) {
      setLoading(false);
      alert("Registration Completed!");
      router.push("/");
    } else {
      setLoading(false);
      alert("Registration Failed!, Something went wrong");
    }
  };

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="login-box">
      <h2>Login for Todo</h2>
      <h4
        style={{
          color: "wheat",
          paddingBottom: "15px",
        }}
      >
        Assignment by Group 14
      </h4>
      <form>
        <div className="user-box">
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <label>Email</label>
        </div>
        <div className="user-box">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="on"
          />
          <label>Password</label>
        </div>
        <div className="user-box">
          <input
            type="text"
            name="Name"
            placeholder="Enter Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Enter Name</label>
        </div>
        <div className="user-box">
          <input
            type="text"
            name="Bio"
            placeholder="Enter Bio Details"
            onChange={(e) => setBio(e.target.value)}
            required
          />
          <label>Enter Bio Details</label>
        </div>
        <div className="user-box">
          <input
            type="tel"
            name="Phone number"
            placeholder="Enter Phone Number"
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <label>Enter Phone Number</label>
        </div>
        <a href="#" onClick={(e) => handleSubmit(e)}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Register
        </a>{" "}
        <div>
          <a href="/">Login</a>
        </div>
      </form>
    </div>
  );
}
