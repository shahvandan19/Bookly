import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";


function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Bookly!</h1>
      <div className="space-x-4">
        <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Log In</Link>
        <Link to="/signup" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Sign Up</Link>
      </div>
    </div>
  );
}

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [jwt, setJwt] = useState(""); // Store JWT for demo

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setMessage("Login successful!");
        setJwt(data.token);
        // For real apps, save JWT to localStorage and redirect to profile
        // localStorage.setItem("jwt", data.token);
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Login failed. Server error.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Log In</h2>
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <input
          className="mb-4 w-full p-2 border rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="mb-4 w-full p-2 border rounded"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">
          Log In
        </button>
      </form>
      {message && (
        <div className="mt-4 text-center text-red-600">{message}</div>
      )}
      {jwt && (
        <div className="mt-4 text-xs break-all text-green-700">
          <b>JWT:</b> {jwt}
        </div>
      )}
    </div>
  );
}

function Signup() {
  // State for form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(""); // For success/error messages

  // Handle form input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const res = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! You can now log in.");
        setForm({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
        });
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (err) {
      setMessage("Signup failed. Server error.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <input
          className="mb-4 w-full p-2 border rounded"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          className="mb-4 w-full p-2 border rounded"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          className="mb-4 w-full p-2 border rounded"
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          className="mb-4 w-full p-2 border rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="mb-4 w-full p-2 border rounded"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" type="submit">
          Sign Up
        </button>
      </form>
      {message && (
        <div className="mt-4 text-center text-red-600">{message}</div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Add more routes here as you build more pages */}
      </Routes>
    </Router>
  );
}

export default App;