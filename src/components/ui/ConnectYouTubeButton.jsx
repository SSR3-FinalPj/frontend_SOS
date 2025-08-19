import { useEffect, useRef, useState } from "react";
import { apiFetch as api } from "../../lib/api.js";
import { Button } from "./button.jsx";
import { cn } from "../../utils/ui_utils.js";

function YouTubeIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M19.802 5.802a2.5 2.5 0 0 1 1.696 1.696c.392 1.484.392 4.502.392 4.502s0 3.018-.392 4.502a2.5 2.5 0 0 1-1.696 1.696c-1.484.392-7.802.392-7.802.392s-6.318 0-7.802-.392a2.5 2.5 0 0 1-1.696-1.696C2 15.002 2 12 2 12s0-3.018.392-4.502A2.5 2.5 0 0 1 4.088 5.8c1.484-.392 7.802-.392 7.802-.392s6.318 0 7.802.392ZM9.992 15.002l5.208-3.002-5.208-3.002v6.004Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
    <div className="flex items-center gap-3">
      <Button onClick={startOAuth} disabled={loading} variant="outline">
        <YouTubeIcon className="size-5" />
        {loading ? "연결 중..." : "유튜브 연동"}
      </Button>
      {error && <p className="text-sm text-red-500">Error: {error}</p>}
    </div>
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
