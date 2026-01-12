import { useState } from "react";
import { GetStats, ShortenUrl } from "../api";
import TextSubmit from "../components/TextSubmit";
import ShortResult from "../components/ShortResult";
import StatsResult from "../components/StatsResult";
import { useAuth } from "../context/AuthContext";

const ShortenerPage = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [lifetimeHours, setLifetimeHours] = useState(24);
  const { token, user } = useAuth();

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
      const data = await ShortenUrl(url.trim(), lifetimeHours, token);
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

  return (
    <div className="page-grid">
      <section className="hero-card">
        <h1>Twórz krótkie linki w kilka sekund.</h1>
        <p>
          Ustal czas życia, udostępniaj linki i podglądaj ich skuteczność. {user ? "Linki zapisują się w profilu." : "Zaloguj się, aby je zapisać."}
        </p>
        <div className="hero-badges">
          <span>Bezpieczne</span>
          <span>Szybkie</span>
          <span>Nowoczesne</span>
        </div>
      </section>

      <div className="shortener-layout">
        <section className="panel shorten-panel">
          <h2 className="section-title">Skróć link</h2>
          <TextSubmit
            title={null}
            value={url}
            onChange={setUrl}
            onSubmit={handleShorten}
            loading={loading}
            placeholder="Wklej długi adres URL"
            error={error}
            buttonText="Skróć"
          >
            <label className="field">
              <span>Czas życia</span>
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
        </section>

        <section className="panel stats-panel">
          <h2 className="section-title">Statystyki</h2>
          <TextSubmit
            title={null}
            value={code}
            onChange={setCode}
            onSubmit={handleStats}
            loading={loading}
            placeholder="Wpisz kod linku"
            error={error}
            buttonText="Sprawdź"
          />
          <StatsResult data={stats} />
        </section>
      </div>
    </div>
  );
};

export default ShortenerPage;
