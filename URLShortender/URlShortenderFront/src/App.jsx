import { useState } from "react";
import { GetStats, LoginUser, RegisterUser, ShortenUrl } from "./api";
import TextSubmit from "./components/TextSubmit";
import ShortResult from "./components/ShortResult";
import StatsResult from "./components/StatsResult";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [lifetimeHours, setLifetimeHours] = useState(24);
  const [authTab, setAuthTab] = useState("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleShorten = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Wpisz URL");
      return;
    }

    setLoading(true);
    try {
      const data = await ShortenUrl(url.trim(), lifetimeHours);
      setResult(data);
      setUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStats = async (e) => {
    e.preventDefault();
    setError("");
    setStats(null);

    if (!code.trim()) {
      setError("Wpisz Code");
      return;
    }

    setLoading(true);
    try {
      const data = await GetStats(code.trim());
      setStats(data);
      setCode("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");

    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password) {
      setAuthError("Uzupełnij wszystkie pola");
      return;
    }

    setAuthLoading(true);
    try {
      const data = await RegisterUser({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
      });
      setAuthUser(data.user);
      setAuthMessage(`Konto utworzone. Witaj, ${data.user.name}!`);
      setRegisterData({ name: "", email: "", password: "" });
      setAuthTab("login");
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");

    if (!loginData.email.trim() || !loginData.password) {
      setAuthError("Wpisz e-mail i hasło");
      return;
    }

    setAuthLoading(true);
    try {
      const data = await LoginUser({
        email: loginData.email.trim(),
        password: loginData.password,
      });
      setAuthUser(data.user);
      setAuthMessage(`Zalogowano jako ${data.user.name}`);
      setLoginData({ email: "", password: "" });
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <span className="pill">Nowoczesny URL Shortener</span>
        <h1 className="title">Skracaj, analizuj i zarządzaj linkami w jednym miejscu.</h1>
        <p className="subtitle">
          Twórz krótkie linki, sprawdzaj statystyki i zakładaj konto, aby zachować historię.
        </p>
      </header>

      <div className="content-grid">
        <section className="panel">
          <h2 className="section-title">Twoje narzędzia</h2>

          <TextSubmit
            title="Shorten URL"
            value={url}
            onChange={setUrl}
            onSubmit={handleShorten}
            loading={loading}
            placeholder="Wklej URL do skrócenia"
            error={error}
            buttonText="Skróć link"
          >
            <label className="field">
              <span>Czas życia linku</span>
              <select
                className="select-field"
                value={lifetimeHours}
                onChange={(e) => setLifetimeHours(Number(e.target.value))}
              >
                <option value={24}>1 dzień</option>
                <option value={48}>2 dni</option>
                <option value={72}>3 dni</option>
              </select>
            </label>
          </TextSubmit>
          <ShortResult data={result} />

          <TextSubmit
            title="Get stats"
            value={code}
            onChange={setCode}
            onSubmit={handleStats}
            loading={loading}
            placeholder="Wpisz kod linku"
            error={error}
            buttonText="Sprawdź statystyki"
          />
          <StatsResult data={stats} />
        </section>

        <section className="panel auth-panel">
          <div className="panel-header">
            <h2 className="section-title">Konto użytkownika</h2>
            <p className="panel-description">
              Zaloguj się lub utwórz konto, aby mieć szybki dostęp do swoich linków.
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={authTab === "login" ? "auth-tab active" : "auth-tab"}
              onClick={() => setAuthTab("login")}
            >
              Logowanie
            </button>
            <button
              type="button"
              className={authTab === "register" ? "auth-tab active" : "auth-tab"}
              onClick={() => setAuthTab("register")}
            >
              Rejestracja
            </button>
          </div>

          {authMessage && <div className="auth-message success">{authMessage}</div>}
          {authError && <div className="auth-message error">{authError}</div>}

          {authTab === "login" ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <label className="field">
                <span>E-mail</span>
                <input
                  type="email"
                  placeholder="twoj@email.pl"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Hasło</span>
                <input
                  type="password"
                  placeholder="Wpisz hasło"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </label>
              <button className="primary-button" type="submit" disabled={authLoading}>
                {authLoading ? "Logowanie..." : "Zaloguj się"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <label className="field">
                <span>Imię</span>
                <input
                  type="text"
                  placeholder="Anna"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                />
              </label>
              <label className="field">
                <span>E-mail</span>
                <input
                  type="email"
                  placeholder="anna@email.pl"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Hasło</span>
                <input
                  type="password"
                  placeholder="Minimum 8 znaków"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
              </label>
              <button className="primary-button" type="submit" disabled={authLoading}>
                {authLoading ? "Tworzenie..." : "Utwórz konto"}
              </button>
            </form>
          )}

          {authUser && (
            <div className="profile-card">
              <div>
                <p className="profile-label">Aktywny użytkownik</p>
                <p className="profile-name">{authUser.name}</p>
                <p className="profile-email">{authUser.email}</p>
              </div>
              <span className="status-pill">Aktywny</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
