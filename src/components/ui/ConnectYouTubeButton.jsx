import { useEffect, useRef, useState } from "react";
import { apiFetch as api } from "../../lib/api.js";

export default function ConnectYouTubeButton({ onDone, oauthOrigin }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { connected, channelTitle? }
  const popupRef = useRef(null);
  const popupTimerRef = useRef(null);
  const timeoutRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const r = await api("/api/google/status", { method: "GET" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json().catch(() => ({}));
      setStatus(data && typeof data === "object" ? data : null);
    } catch (e) {
      console.error(e);
      setStatus(null);
    }
  };

  const startOAuth = async () => {
    setLoading(true);
    clearTimers();
    try {
      const res = await api("/api/google/login-url", { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const url = await res.text();

      popupRef.current = openOAuthPopup(url, "GoogleOAuth", 520, 700);

      // 팝업 차단 시 폴백
      if (!popupRef.current) {
        window.location.href = url;
        return; // 이 경우 로딩은 페이지 이동으로 종료됨
      }

      // 팝업 닫힘 폴링
      popupTimerRef.current = setInterval(() => {
        const w = popupRef.current;
        if (w && w.closed) {
          clearTimers();
          // 콜백 페이지가 메시지를 못 보낸 경우 대비
          window.postMessage({ type: "google-oauth-complete", ok: true }, "*");
        }
      }, 600);

      // 안전 타임아웃 (예: 3분)
      timeoutRef.current = setTimeout(() => {
        clearTimers();
        setLoading(false);
      }, 3 * 60 * 1000);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const onMsg = (e) => {
      // (선택) 콜백 도메인만 허용
      if (oauthOrigin && e.origin !== oauthOrigin) return;

      if (e.data && e.data.type === "google-oauth-complete") {
        clearTimers();
        setLoading(false);
        // 백엔드 처리를 위한 딜레이 추가
        setTimeout(() => {
          fetchStatus();
        }, 1000); // 1초 딜레이
        onDone && onDone();
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
  const width =
    window.innerWidth ?? document.documentElement.clientWidth ?? window.screen.width;
  const height =
    window.innerHeight ?? document.documentElement.clientHeight ?? window.screen.height;
  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualLeft;
  const top = (height - h) / 2 / systemZoom + dualTop;

  // 주의: postMessage 위해서는 'noopener'를 쓰지 마세요 (opener가 끊기면 안 됨)
  return window.open(
    url,
    title,
    `scrollbars=yes,width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`
  );
}
