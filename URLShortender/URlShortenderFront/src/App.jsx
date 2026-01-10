import { useState } from "react";
import { GetStats, ShortenUrl } from "./api";
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
      const data = await ShortenUrl(url.trim());
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
    <div className="app">
      <h1 className="title">URL Shortener</h1>

      <TextSubmit label="Shorten URL" value={url} onChange={setUrl} onSubmit={handleShorten} loading={loading} 
        placeholder="Paste URL" error={error}/>
      <ShortResult data={result}/>

      <TextSubmit label="Get stats" value={code} onChange={setCode} onSubmit={handleStats} loading={loading} 
        placeholder="Enter code" error={error}/>
      <StatsResult data={stats} />
    </div>
  );
}

export default App;
