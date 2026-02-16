import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const token = response.data.token;

      // ✅ Save token
      localStorage.setItem("token", token);

      // ✅ Decode token
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const role = decoded.role;

      alert("Login successful ✅");

      // 🔥 Role based redirect
      if (role === "developer") {
        navigate("/my-tasks");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);
      alert("Login failed ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>DevTrack Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>

      <br />

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;