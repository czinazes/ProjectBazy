import { useEffect, useState } from "react";
import { GetUserLinks } from "../api";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, token, updateProfile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name ?? "", email: user.email ?? "" });
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const data = await GetUserLinks(token);
        setLinks(data);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Uzupełnij wszystkie pola");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ name: form.name.trim(), email: form.email.trim() });
      setMessage("Profil zaktualizowany");
      await refreshProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <section className="panel">
        <h2 className="section-title">Twoje dane</h2>
        {message && <div className="auth-message success">{message}</div>}
        {error && <div className="auth-message error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Imię</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="field">
            <span>E-mail</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
        </form>
      </section>

      <section className="panel">
        <h2 className="section-title">Twoje linki</h2>
        <div className="links-list">
          {links.length === 0 ? (
            <p className="empty-state">Brak aktywnych linków. Utwórz nowy link w sekcji Shorten.</p>
          ) : (
            links.map((link) => (
              <div key={link.shortCode} className="link-card">
                <div>
                  <p className="link-label">Short URL</p>
                  <p className="link-value">{link.shortUrl}</p>
                  <p className="link-meta">{link.originalUrl}</p>
                </div>
                <div className="link-aside">
                  <span>{new Date(link.createdAt).toLocaleString()}</span>
                  <span>Wygasa: {new Date(link.expiresAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
