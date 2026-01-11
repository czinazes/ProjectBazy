import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Uzupełnij wszystkie pola");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
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
        <h1>Utwórz konto</h1>
        <p>Załóż konto, aby zapisywać skrócone linki i zarządzać nimi później.</p>
        {error && <div className="auth-message error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Imię</span>
            <input
              type="text"
              placeholder="Anna"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="field">
            <span>E-mail</span>
            <input
              type="email"
              placeholder="anna@email.pl"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Hasło</span>
            <input
              type="password"
              placeholder="Minimum 8 znaków"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Tworzenie..." : "Utwórz konto"}
          </button>
        </form>
        <p className="auth-footer">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
