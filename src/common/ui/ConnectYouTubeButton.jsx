import { useEffect, useRef, useState } from "react";
import { apiFetch as api } from "../api/api.js";
import { Button } from "./button.jsx";
import { usePlatformStore } from "../../stores/platform_store.js";
import { getGoogleStatus } from "../api/api.js";

export default function ConnectYouTubeButton({ onDone, oauthOrigin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);
  const popupTimerRef = useRef(null);
  const timeoutRef = useRef(null);
  const { setPlatformStatus } = usePlatformStore();

  const fetchStatus = async () => {
    const status = await getGoogleStatus();
    setPlatformStatus('google', status);
    onDone && onDone(status);
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

      if (!popupRef.current) {
        window.location.href = url;
        return;
      }

      popupTimerRef.current = setInterval(() => {
        const w = popupRef.current;
        if (w && w.closed) {
          clearTimers();
          window.postMessage({ type: "google-oauth-complete", ok: true }, "*");
        }
      }, 600);

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
    const onMsg = (e) => {
      if (oauthOrigin && e.origin !== oauthOrigin) return;
      if (e.data?.type === "google-oauth-complete") {
        clearTimers();
        setLoading(false);
        setTimeout(() => {
          fetchStatus();
        }, 1000);
      }
    };

    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("message", onMsg);
      clearTimers();
    };
  }, [oauthOrigin]);

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
    <Button onClick={startOAuth} disabled={loading} variant="outline">
      <div className="gsi-material-button">
        <div className="gsi-material-button-state"></div>
        <div className="gsi-material-button-content-wrapper flex items-center gap-2">
          <div className="gsi-material-button-icon">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              style={{ display: "block" }}
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
          </div>
          <span className="gsi-material-button-contents">
            {loading ? "연결 중..." : "Google 계정으로 연동하기"}
          </span>
          <span style={{ display: "none" }}>Sign in with Google</span>
        </div>
      </div>
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

  return window.open(
    url,
    title,
    `scrollbars=yes,width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`
  );
}