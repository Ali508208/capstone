import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "./api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/login", form);
      if (res.data?.ok) navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      style={{ maxWidth: 420, margin: "48px auto", fontFamily: "system-ui" }}
    >
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            type="text"
            required
            style={{ display: "block", width: "100%", marginBottom: 12 }}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
            required
            style={{ display: "block", width: "100%", marginBottom: 12 }}
          />
        </label>
        <button type="submit">Sign in</button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <p style={{ marginTop: 16 }}>
        No account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
}
