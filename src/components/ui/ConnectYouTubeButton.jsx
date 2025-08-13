import { useEffect, useState } from "react";

export default function ConnectYouTubeButton({ onDone }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { connected, channelTitle? }

  const fetchStatus = async () => {
    try {
      const r = await fetch("/api/google/status", { credentials: "include" });
      const data = await r.json();
      setStatus(data);
    } catch (e) {
      console.error(e);
    }
  };

  const startOAuth = () => {
    setLoading(true);
    const w = openOAuthPopup("/api/google/login", "GoogleOAuth", 520, 700);
    if (!w) window.location.href = "/api/google/login";
  };

  useEffect(() => {
    fetchStatus();
    const onMsg = (e) => {
      if (e.data && e.data.type === "google-oauth-complete") {
        setLoading(false);
        fetchStatus();
        onDone && onDone();
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <button onClick={startOAuth} disabled={loading} className="px-3 py-2 rounded border">
        {loading ? "연결 중..." : "유튜브 연동"}
      </button>
      <span>

        {status?.connected ? `✅${status.channelTitle ? " · " + status.channelTitle : ""}` : "연동 안 됨"}
      </span>
    </div>
  );
}

function openOAuthPopup(url, title, w, h) {
  const dualLeft = window.screenLeft ?? window.screenX ?? 0;
  const dualTop = window.screenTop ?? window.screenY ?? 0;
  const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
  const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;
  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualLeft;
  const top = (height - h) / 2 / systemZoom + dualTop;

  const win = window.open(
    url,
    title,
    `scrollbars=yes,width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`
  );

  // 콜백 페이지가 postMessage 못 보낸 채로 닫힌 경우 대비
  const timer = setInterval(() => {
    if (win && win.closed) {
      clearInterval(timer);
      window.postMessage({ type: "google-oauth-complete", ok: true }, "*");
    }
  }, 600);

  return win;
}