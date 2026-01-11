import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Wpisz e-mail i hasło");
      return;
    }

    setLoading(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Zaloguj się</h1>
        <p>Wróć do swoich linków i zarządzaj nimi z jednego miejsca.</p>
        {error && <div className="auth-message error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>E-mail</span>
            <input
              type="email"
              placeholder="twoj@email.pl"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Hasło</span>
            <input
              type="password"
              placeholder="Wpisz hasło"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
        <p className="auth-footer">
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
