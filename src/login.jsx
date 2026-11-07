
import { useState } from "react";
import { supabase } from "./services/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (signup) {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) throw error;

        setMessage(
          "Account created. Check your email if verification is required."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>SCP Foundation</h1>
        <h2>{signup ? "Create Account" : "Login"}</h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : signup ? "Sign Up" : "Login"}
        </button>

        {message && <p className="message">{message}</p>}

        <p
          className="login-link"
          onClick={() => {
            setSignup(!signup);
            setMessage("");
          }}
        >
          {signup
            ? "Already registered? Login"
            : "New researcher? Sign up"}
        </p>
      </form>
    </div>
  );
}

export default Login;
