import { useEffect, useRef, useState } from "react";
import { apiFetch as api } from "../../lib/api.js";
import { Button } from "./button.jsx";

export default function ConnectYouTubeButton({ onDone, oauthOrigin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);
  const popupTimerRef = useRef(null);
  const timeoutRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const r = await api("/api/google/status", { method: "GET" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json().catch(() => ({}));
      onDone && onDone(data && typeof data === "object" ? data : null);
    } catch (e) {
      console.error(e);
      setError(e.message);
      onDone && onDone(null);
    }
  };

  const startOAuth = async () => {
    setLoading(true);
    setError(null);
    clearTimers();
    try {
      const res = await api("/api/google/login-url", { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const url = await res.text();

      popupRef.current = openOAuthPopup(url, "GoogleOAuth", 520, 700);

      // Fallback for popup blockers
      if (!popupRef.current) {
        window.location.href = url;
        return; // Loading ends with page navigation in this case
      }

      // Poll for popup close
      popupTimerRef.current = setInterval(() => {
        const w = popupRef.current;
        if (w && w.closed) {
          clearTimers();
          // Failsafe in case callback page fails to send message
          window.postMessage({ type: "google-oauth-complete", ok: true }, "*");
        }
      }, 600);

      // Safety timeout (e.g., 3 minutes)
      timeoutRef.current = setTimeout(() => {
        clearTimers();
        setLoading(false);
      }, 3 * 60 * 1000);
    } catch (e) {
      console.error(e);
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const onMsg = (e) => {
      // (Optional) only allow messages from our callback domain
      if (oauthOrigin && e.origin !== oauthOrigin) return;

      if (e.data && e.data.type === "google-oauth-complete") {
        clearTimers();
        setLoading(false);
        // Add a delay for backend processing
        setTimeout(() => {
          fetchStatus();
        }, 1000); // 1s delay
      }
    };

    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("message", onMsg);
      clearTimers();
    };
  }, []);

  const clearTimers = () => {
    if (popupTimerRef.current) {
      clearInterval(popupTimerRef.current);
      popupTimerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    popupRef.current = null;
  };

  return (
    <Button
      onClick={startOAuth}
      disabled={loading}
      className="bg-white text-gray-650 font-bold py-2 px-4 rounded-lg border border-gray-400 shadow-md hover:bg-gray-100 transition-all duration-300"
    >
      {loading ? "연결 중..." : "연동하기"}
    </Button>
  );
}

function openOAuthPopup(url, title, w, h) {
  const dualLeft = window.screenLeft ?? window.screenX ?? 0;
  const dualTop = window.screenTop ?? window.screenY ?? 0;
  const width =
    window.innerWidth ?? document.documentElement.clientWidth ?? window.screen.width;
  const height =
    window.innerHeight ?? document.documentElement.clientHeight ?? window.screen.height;
  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualLeft;
  const top = (height - h) / 2 / systemZoom + dualTop;

  // Note: do not use 'noopener' for postMessage to work (opener is needed)
  return window.open(
    url,
    title,
    `scrollbars=yes,width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`
  );
}
