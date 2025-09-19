import { useEffect, useRef, useState } from "react";
import { apiFetch as api } from '@/common/api/api';
import { Button } from '@/common/ui/button';
import RedditIcon from '@/assets/images/button/Reddit_Icon.svg';
import { getRedditStatus } from '@/common/api/api';

export default function ConnectRedditButton({ onDone, oauthOrigin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);
  const popupTimerRef = useRef(null);
  const timeoutRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const status = await getRedditStatus();
      onDone && onDone(status);
    } catch (e) {
      setError(e.message);
      onDone && onDone({ connected: false });
    }
  };

  const startOAuth = async () => {
    setLoading(true);
    setError(null);
    clearTimers();
    try {
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
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
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
      <div className="gsi-material-button-content-wrapper flex items-center gap-3">
        <div className="gsi-material-button-icon">
            <img src={RedditIcon} alt="Reddit Icon" style={{ display: "block", width: '18px', height: '18px' }} />
        </div>
        <span className="gsi-material-button-contents">
          {loading ? "연결 중..." : "Reddit 계정으로 연동하기"}
        </span>
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
