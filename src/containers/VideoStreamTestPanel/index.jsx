/**
 * VideoStreamTestPanel 컴포넌트
 * 영상 스트리밍과 다운로드 API를 독립적으로 테스트할 수 있는 패널
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Loader2, AlertCircle, TestTube, Upload } from 'lucide-react';
import { Button } from '@/common/ui/button';
import { getVideoStreamUrl, getVideoDownloadUrl } from '@/common/api/api';

/**
 * VideoStreamTestPanel 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @param {Function} props.on_upload_test - YouTube 업로드 테스트 핸들러
 * @returns {JSX.Element} VideoStreamTestPanel 컴포넌트
 */
const VideoStreamTestPanel = ({ dark_mode, on_upload_test }) => {
  // 상태 관리
  const [resultId, setResultId] = useState('81');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // YouTube 업로드 테스트용 상태
  const [jobId, setJobId] = useState('test-job-001');
  const [uploadResultId, setUploadResultId] = useState('81');

  // 에러 메시지 초기화
  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  // 스트리밍 테스트 핸들러
  const handleStreamTest = async () => {
    if (!resultId.trim() || isLoading) return;

    setIsLoading(true);
    clearMessages();
    setVideoUrl(null);

    try {
      const data = await getVideoStreamUrl(resultId);
      setVideoUrl(data.url);
      setSuccessMessage(`스트리밍 URL 획득 성공! (ID: ${resultId})`);
    } catch (err) {
      console.error('스트리밍 테스트 실패:', err);
      setError(`스트리밍 테스트 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 다운로드 테스트 핸들러
  const handleDownloadTest = async () => {
    if (!resultId.trim() || isLoading) return;

    setIsLoading(true);
    clearMessages();

    try {
      const data = await getVideoDownloadUrl(resultId);
      
      // 파일 다운로드 실행
      const link = document.createElement('a');
      link.href = data.url;
      link.setAttribute('download', `test_video_${resultId}.mp4`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccessMessage(`다운로드 시작! (ID: ${resultId})`);
    } catch (err) {
      console.error('다운로드 테스트 실패:', err);
      setError(`다운로드 테스트 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ResultID 입력 핸들러
  const handleResultIdChange = (e) => {
    setResultId(e.target.value);
    clearMessages();
  };
  
  // YouTube 업로드 테스트 핸들러
  const handleUploadTest = () => {
    if (!jobId.trim() || !uploadResultId.trim()) {
      setError('업로드 테스트를 위해 jobId와 resultId를 모두 입력해주세요.');
      return;
    }
    
    if (on_upload_test) {
      on_upload_test(jobId, uploadResultId);
      setSuccessMessage(`업로드 테스트 모달을 열었습니다. (Job: ${jobId}, Result: ${uploadResultId})`);
    } else {
      setError('업로드 테스트 핸들러가 설정되지 않았습니다.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${
        dark_mode 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      } backdrop-blur-xl rounded-xl border p-6 shadow-lg mb-6`}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20">
          <TestTube className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
            스트리밍/다운로드 API 테스트 패널
          </h3>
          <p className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
            ES 데이터 없이 하드코딩된 resultId로 직접 API 테스트
          </p>
        </div>
      </div>

      {/* 입력 및 컨트롤 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* ResultID 입력 */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            dark_mode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Result ID
          </label>
          <input
            type="text"
            value={resultId}
            onChange={handleResultIdChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
              dark_mode 
                ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-400' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50`}
            placeholder="예: 81"
          />
        </div>

        {/* 테스트 버튼들 */}
        <div className="flex gap-2">
          <Button
            onClick={handleStreamTest}
            disabled={!resultId.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30 text-gray-800 dark:text-white rounded-lg"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            스트리밍 테스트
          </Button>
          
          <Button
            onClick={handleDownloadTest}
            disabled={!resultId.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30 text-gray-800 dark:text-white rounded-lg"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            다운로드 테스트
          </Button>
        </div>
      </div>

      {/* 상태 메시지 영역 */}
      {(error || successMessage) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4"
        >
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
              <TestTube className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-700 dark:text-green-300">{successMessage}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* 비디오 플레이어 영역 */}
      {videoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <h4 className={`text-sm font-medium mb-3 ${
            dark_mode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            스트리밍 테스트 결과
          </h4>
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video 
              controls 
              src={videoUrl} 
              className="w-full h-full" 
              preload="metadata"
              style={{ objectFit: 'contain' }}
            >
              <p className="text-white p-4">
                브라우저가 비디오 태그를 지원하지 않습니다.
              </p>
            </video>
          </div>
        </motion.div>
      )}

      {/* YouTube 업로드 테스트 섹션 */}
      <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20">
            <Upload className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
              YouTube 업로드 테스트
            </h3>
            <p className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
              jobId와 resultId로 직접 업로드 모달 열기
            </p>
          </div>
        </div>

        {/* YouTube 테스트 입력 및 컨트롤 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* JobID 입력 */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              dark_mode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Job ID
            </label>
            <input
              type="text"
              value={jobId}
              onChange={(e) => {
                setJobId(e.target.value);
                clearMessages();
              }}
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                dark_mode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:border-red-400' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
              } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
              placeholder="예: test-job-001"
            />
          </div>
          
          {/* Upload ResultID 입력 */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              dark_mode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Result ID
            </label>
            <input
              type="text"
              value={uploadResultId}
              onChange={(e) => {
                setUploadResultId(e.target.value);
                clearMessages();
              }}
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                dark_mode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:border-red-400' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
              } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
              placeholder="예: 81"
            />
          </div>

          {/* 업로드 테스트 버튼 */}
          <div className="lg:col-span-2 flex items-end">
            <Button
              onClick={handleUploadTest}
              disabled={!jobId.trim() || !uploadResultId.trim()}
              className="w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30 text-gray-800 dark:text-white rounded-lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              업로드 테스트 모달 열기
            </Button>
          </div>
        </div>
      </div>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-xl flex items-center justify-center"
        >
          <div className={`${
            dark_mode ? 'bg-gray-800' : 'bg-white'
          } rounded-lg p-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className={`text-sm font-medium ${
                dark_mode ? 'text-white' : 'text-gray-900'
              }`}>
                API 호출 중...
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(VideoStreamTestPanel);