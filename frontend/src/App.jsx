import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

function Landing() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white px-4">
      <div className="w-full max-w-md rounded-lg shadow-lg bg-white p-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-wimbledonPurple mb-6 text-center">
          Welcome to <span className="text-wimbledonGreen">Bookly</span>!
        </h1>
        <div className="flex flex-col md:flex-row w-full gap-4">
          <Link to="/login" className="flex-1 py-2 rounded-lg bg-wimbledonPurple text-white font-semibold text-center hover:bg-wimbledonGreen transition-colors">
            Log In
          </Link>
          <Link to="/signup" className="flex-1 py-2 rounded-lg bg-wimbledonGreen text-white font-semibold text-center hover:bg-wimbledonPurple transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [jwt, setJwt] = useState("");

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
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Login failed. Server error.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white px-4">
      <div className="w-full max-w-md rounded-lg shadow-lg bg-white p-8 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-wimbledonPurple">Log In</h2>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-wimbledonPurple"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-wimbledonPurple"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button className="w-full py-2 rounded-lg bg-wimbledonPurple text-white font-semibold hover:bg-wimbledonGreen transition-colors" type="submit">
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
    </div>
  );
}

function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
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