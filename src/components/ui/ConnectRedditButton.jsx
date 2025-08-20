import { useEffect, useRef, useState } from "react";
import { apiFetch as api } from "../../lib/api.js";
import { Button } from "./button.jsx";

export default function ConnectRedditButton({ onDone, oauthOrigin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);
  const popupTimerRef = useRef(null);
  const timeoutRef = useRef(null);

  const fetchStatus = async () => {
    try {
      // TODO: Replace with Reddit API status endpoint
      const r = await api("/api/reddit/status", { method: "GET" });
      if (!r.ok) {
        if (r.status === 403) {
          setError("로그인이 필요합니다.");
        }
        throw new Error(`HTTP ${r.status}`);
      }
      const data = await r.json().catch(() => ({}));
      const mapped = {
        connected: data.connected ?? data.linked ?? false,
        // Add any other relevant info from Reddit status
      }
      onDone && onDone(mapped);
    } catch (e) {
      console.error(e);
      setError(e.message);
      onDone && onDone({ connected: false });
    }
  };

  const startOAuth = async () => {
    setLoading(true);
    setError(null);
    clearTimers();
    try {
      // TODO: Replace with Reddit API login URL endpoint
      const res = await api("/api/reddit/login-url", { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const url = await res.text();

      popupRef.current = openOAuthPopup(url, "RedditOAuth", 520, 700);

      if (!popupRef.current) {
        window.location.href = url;
        return;
      }

      popupTimerRef.current = setInterval(() => {
        const w = popupRef.current;
        if (w && w.closed) {
          clearTimers();
          window.postMessage({ type: "reddit-oauth-complete", ok: true }, "*");
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
    fetchStatus();

    const onMsg = (e) => {
      if (oauthOrigin && e.origin !== oauthOrigin) return;

      if (e.data?.type === "reddit-oauth-complete") {
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
  <Button onClick={startOAuth} disabled={loading} variant="outline">
    <div className="gsi-material-button">
      <div className="gsi-material-button-state"></div>
      <div className="gsi-material-button-content-wrapper flex items-center gap-2">
        <div className="gsi-material-button-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            style={{ display: "block", width: '24px', height: '24px' }}
          >
            <path d="M256 128.329C256 198.801 198.801 256 128.329 256C57.858 256 0 198.801 0 128.329C0 57.858 57.858 0 128.329 0C198.801 0 256 57.858 256 128.329ZM184.431 143.815C184.431 153.441 176.655 161.217 167.029 161.217C163.333 161.217 159.911 160.163 157.113 158.485C161.001 151.249 163.225 142.959 163.225 134.045C163.225 107.113 147.633 85.401 123.237 85.401C118.415 85.401 113.867 86.245 109.683 87.797C112.481 80.185 113.973 72.045 113.973 63.529C113.973 53.903 106.197 46.127 96.571 46.127C86.945 46.127 79.169 53.903 79.169 63.529C79.169 72.153 80.769 80.389 83.675 87.905C79.491 86.353 74.943 85.509 70.121 85.509C45.725 85.509 30.133 107.221 30.133 134.153C30.133 143.067 32.357 151.357 36.245 158.593C33.447 160.271 30.025 161.325 26.329 161.325C16.703 161.325 8.927 153.549 8.927 143.923C8.927 143.547 8.927 143.279 8.927 142.903C8.927 142.419 9.035 141.935 9.035 141.559C14.957 130.927 25.073 123.043 36.989 119.283C34.299 110.993 32.807 102.079 32.807 92.637C32.807 60.313 57.203 34.285 89.069 34.285C101.829 34.285 113.557 38.221 123.125 45.081C132.693 38.221 144.421 34.285 157.181 34.285C189.047 34.285 213.443 60.313 213.443 92.637C213.443 102.079 211.951 110.993 209.261 119.283C221.177 123.043 231.293 130.927 237.215 141.559C237.323 141.935 237.323 142.419 237.323 142.903C237.323 143.279 237.323 143.547 237.323 143.815C237.323 153.441 229.547 161.217 219.921 161.217C216.225 161.217 212.803 160.163 210.005 158.485C213.893 151.249 216.117 142.959 216.117 134.045C216.117 107.113 200.525 85.401 176.129 85.401C171.307 85.401 166.759 86.245 162.575 87.797C165.373 80.185 166.865 72.045 166.865 63.529C166.865 53.903 159.089 46.127 149.463 46.127C139.837 46.127 132.061 53.903 132.061 63.529C132.061 72.153 133.661 80.389 136.567 87.905C132.383 86.353 127.835 85.509 123.013 85.509C98.617 85.509 83.025 107.221 83.025 134.153C83.025 143.067 85.249 151.357 89.137 158.593C86.339 160.271 82.917 161.325 79.221 161.325C69.595 161.325 61.819 153.549 61.819 143.923C61.819 143.547 61.819 143.279 61.927 142.903C61.927 142.419 61.927 141.935 62.035 141.559C67.957 130.927 78.073 123.043 89.989 119.283C87.299 110.993 85.807 102.079 85.807 92.637C85.807 60.313 110.203 34.285 142.069 34.285C154.829 34.285 166.557 38.221 176.125 45.081C185.693 38.221 197.421 34.285 210.181 34.285C242.047 34.285 266.443 60.313 266.443 92.637C266.443 102.079 264.951 110.993 262.261 119.283C274.177 123.043 284.293 130.927 290.215 141.559C290.323 141.935 290.323 142.419 290.323 142.903C290.323 143.279 290.323 143.547 290.323 143.815Z" fill="#FF4500"/>
          </svg>
        </div>
        <span className="gsi-material-button-contents">
          {loading ? "연결 중..." : "Reddit 계정으로 연동하기"}
        </span>
        <span style={{ display: "none" }}>Sign in with Reddit</span>
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
