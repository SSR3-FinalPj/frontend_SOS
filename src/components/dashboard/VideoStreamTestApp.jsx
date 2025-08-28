/**
 * 하드코딩된 resultId로 영상 스트리밍을 테스트하는 컴포넌트
 * 사용자 제공 테스트 코드를 그대로 React 컴포넌트로 변환
 */
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { useAccessTokenMemory } from '../../hooks/useAccessTokenMemory.js';

// API 어댑터 함수들
const api = async (url, options = {}) => {
  return await apiFetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body
  });
};

const loginApi = async (username, password) => {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: '로그인 실패' }));
    throw new Error(errorData.message || '로그인 실패');
  }

  return await res.json();
};

const logoutApi = async () => {
  try {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};

const silentRefresh = async () => {
  try {
    const res = await apiFetch('/api/auth/refresh', {
      method: 'POST',
    });
    return res.ok;
  } catch (error) {
    console.error('세션 복원 실패:', error);
    return false;
  }
};

/**
 * 하드코딩 테스트 앱 컴포넌트
 */
const VideoStreamTestApp = ({ dark_mode }) => {
  const token = useAccessTokenMemory(); // 기존 토큰 시스템 활용
  const [jwt, setJwt] = useState('');
  const [msg, setMsg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [redditStatus, setRedditStatus] = useState(null); 
  const [statusMsg, setStatusMsg] = useState('');

  // ✅ 영상 스트리밍 상태
  const [videoUrl, setVideoUrl] = useState(null);

  // 기존 토큰이 있으면 jwt 상태 업데이트
  useEffect(() => {
    if (token) {
      setJwt('existing-token');
      setMsg('🔐 기존 세션 사용 중');
    }
  }, [token]);

  // 새로고침 시 세션 복원
  useEffect(() => {
    (async () => {
      const ok = await silentRefresh();
      if (ok) {
        setJwt('updated');
        setMsg('🔐 세션 복원됨');
      }
    })();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const data = await loginApi(username, password);
      setJwt(data.accessToken);
      setMsg('✅ 로그인 완료 (Access 발급, Refresh는 쿠키)');
    } catch (e2) {
      setMsg('❌ 로그인 실패: ' + e2.message);
    }
  };

  const callProtected = async () => {
    setMsg('');
    try {
      const res = await api('/api/protected', { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMsg('🔓 보호 API 응답: ' + JSON.stringify(data));
    } catch (e2) {
      setMsg('❌ 보호 API 실패: ' + e2.message);
    }
  };

  const goRedditConsent = async () => {
    setMsg('');
    try {
      const res = await api('/api/reddit/login-url', { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const url = await res.text();
      window.location.href = url;
    } catch (e2) {
      setMsg('❌ Reddit 동의 URL 실패: ' + e2.message);
    }
  };

  const checkRedditStatus = async () => {
    setStatusMsg('');
    try {
      const res = await api('/api/reddit/status', { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRedditStatus(data);
      setStatusMsg('ℹ️ 상태 조회 성공');
    } catch (e2) {
      setStatusMsg('❌ 상태 조회 실패: ' + e2.message);
      setRedditStatus(null);
    }
  };

  const logout = async () => {
    await logoutApi();
    setJwt('');
    setMsg('🔓 로그아웃 완료');
    setRedditStatus(null);
    setVideoUrl(null);
  };

  // ✅ 샘플 영상 스트리밍 요청 (하드코딩 resultId=1)
  const playSampleVideo = async () => {
    try {
      // 🔥 하드코딩된 resultId (사용자 요청에 따라 그대로 유지)
      const sampleResultId = 1;

      const res = await api('/api/videos/stream', {
        method: 'POST',
        body: JSON.stringify({ resultId: sampleResultId })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setVideoUrl(data.url);
      setMsg('🎬 Presigned URL 발급 성공');
    } catch (e) {
      setMsg('❌ 영상 스트리밍 요청 실패: ' + e.message);
    }
  };

  const mask = (t) => (t && t.length > 20 ? `${t.slice(0, 10)}...${t.slice(-8)}` : t || '');

  return (
    <div className={`p-6 rounded-2xl border ${
      dark_mode 
        ? 'bg-gray-800/50 border-gray-700/30 text-white' 
        : 'bg-white/80 border-gray-200/50 text-gray-900'
    } backdrop-blur-sm`}>
      <h3 className={`text-xl font-bold mb-4 ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
        🧪 API 테스트 (하드코딩 resultId=1)
      </h3>

      <form onSubmit={login} className="grid grid-cols-1 gap-2 mb-4">
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className={`p-2 border rounded-lg ${
            dark_mode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className={`p-2 border rounded-lg ${
            dark_mode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <button 
          type="submit"
          className={`p-2 rounded-lg font-medium transition-colors ${
            dark_mode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          1) 로그인
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={callProtected}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            dark_mode
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          2) 보호 API 호출
        </button>
        <button 
          onClick={goRedditConsent}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            dark_mode
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          3) Reddit 동의 화면
        </button>
        <button 
          onClick={checkRedditStatus}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            dark_mode
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          4) Reddit 상태 확인
        </button>
        <button 
          onClick={playSampleVideo}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            dark_mode
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          5) 샘플 영상 스트리밍
        </button>
        <button 
          onClick={logout}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            dark_mode
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
        >
          로그아웃
        </button>
      </div>

      <div className={`text-sm mb-4 ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
        <div><b>Access(표시용):</b> {mask(jwt) || '(없음)'}</div>
        <div className="mt-2 whitespace-pre-wrap">{msg}</div>
      </div>

      {/* ✅ Reddit 상태 표시 */}
      {redditStatus && (
        <div className={`text-sm p-3 rounded-lg mb-4 ${
          dark_mode
            ? 'bg-gray-700/50 border border-gray-600/50'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div><b>연동됨:</b> {redditStatus.linked ? '✅' : '❌'}</div>
          {redditStatus.username && <div><b>Reddit 사용자명:</b> {redditStatus.username}</div>}
          {redditStatus.expiresAt && (
            <div><b>만료 시각:</b> {new Date(redditStatus.expiresAt).toLocaleString()}</div>
          )}
          <div className="mt-1 text-xs text-gray-500">{statusMsg}</div>
        </div>
      )}

      {/* ✅ 영상 스트리밍 표시 */}
      {videoUrl && (
        <div className="mt-4">
          <video controls width="100%" className="rounded-lg" src={videoUrl} />
        </div>
      )}

      <hr className={`my-4 ${dark_mode ? 'border-gray-600' : 'border-gray-200'}`} />
      <p className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-500'}`}>
        * 모든 요청은 credentials: 'include'로 쿠키 전송.
        <br />* 401이면 자동으로 /api/auth/refresh 호출 후 재시도.
        <br />* Access는 메모리만, Refresh는 HttpOnly 쿠키(자바스크립트 접근 불가).
        <br />* <b>🔥 하드코딩된 resultId=1로 테스트</b>
      </p>
    </div>
  );
};

export default VideoStreamTestApp;