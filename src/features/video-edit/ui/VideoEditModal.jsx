/**
 * 영상 수정 전용 모달 컴포넌트
 * 기존 영상의 프롬프트만 수정하여 새로운 버전을 생성
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wand2, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/common/ui/button';
import { Badge } from '@/common/ui/badge';
import { useVideoEdit } from '@/features/video-edit/logic/use-video-edit';

/**
 * VideoEditModal 컴포넌트
 * @param {Object} props
 * @param {boolean} props.is_open - 모달 열림 상태
 * @param {Function} props.on_close - 모달 닫기 함수
 * @param {Object} props.selected_video - 수정할 영상 데이터
 * @param {boolean} props.dark_mode - 다크모드 여부
 */
const VideoEditModal = ({ 
  is_open, 
  on_close, 
  selected_video,
  dark_mode = false 
}) => {
  const {
    prompt_text,
    is_submitting,
    character_count,
    handle_prompt_change,
    handle_edit_submit,
    reset_form
  } = useVideoEdit(selected_video, on_close);

  // 모달 ref
  const modal_ref = useRef(null);

  // 모달 닫기 핸들러
  const handle_close = useCallback(() => {
    if (is_submitting) return;
    reset_form();
    on_close();
  }, [is_submitting, reset_form, on_close]);

  // 모달 열릴 때 포커스 설정
  useEffect(() => {
    if (is_open && modal_ref.current) {
      modal_ref.current.focus();
    }
  }, [is_open]);

  // ESC 키 핸들러
  const handle_key_down = useCallback((e) => {
    if (e.key === 'Escape') {
      handle_close();
    }
  }, [handle_close]);

  if (!is_open || !selected_video) return null;

  const platform_colors = {
    youtube: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    reddit: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  };

  const platform_color = platform_colors[selected_video.platform?.toLowerCase()] || platform_colors.youtube;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={modal_ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10002] p-4"
        onClick={handle_close}
        onKeyDown={handle_key_down}
        tabIndex={0}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`${
            dark_mode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                <Wand2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
                  영상 수정하기
                </h2>
                <p className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                  새로운 프롬프트로 영상을 재생성합니다
                </p>
              </div>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handle_close();
              }}
              disabled={is_submitting}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <X className={`w-5 h-5 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* 기존 영상 정보 카드 */}
            <div className={`p-4 rounded-2xl border-2 border-dashed ${
              dark_mode 
                ? 'bg-gray-800/50 border-gray-600' 
                : 'bg-gray-50 border-gray-300'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold ${dark_mode ? 'text-gray-200' : 'text-gray-800'}`}>
                  수정할 영상
                </h3>
                <Badge className={platform_color}>
                  {selected_video.platform?.toUpperCase() || 'YOUTUBE'}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className={`font-medium ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
                  {selected_video.title}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  {selected_video.location_name && (
                    <div className={`flex items-center gap-1 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin className="w-4 h-4" />
                      <span>{selected_video.location_name}</span>
                    </div>
                  )}
                  
                  {selected_video.created_at && (
                    <div className={`flex items-center gap-1 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selected_video.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {selected_video.user_request && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className={`text-xs ${dark_mode ? 'text-gray-500' : 'text-gray-500'} mb-1`}>
                      기존 프롬프트:
                    </p>
                    <p className={`text-sm italic ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                      "{selected_video.user_request}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 새 프롬프트 입력 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <label className={`text-lg font-semibold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
                  새로운 프롬프트
                </label>
              </div>
              
              <div className="relative">
                <textarea
                  value={prompt_text}
                  onChange={(e) => handle_prompt_change(e.target.value)}
                  placeholder="어떻게 수정하고 싶으신가요? 구체적으로 설명해주세요."
                  disabled={is_submitting}
                  className={`w-full h-32 p-4 rounded-2xl border-2 resize-none ${
                    dark_mode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
                  } focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50`}
                  maxLength={500}
                />
                
                {/* 글자수 카운터 */}
                <div className={`absolute bottom-3 right-3 text-xs ${
                  character_count > 450 
                    ? 'text-red-500' 
                    : dark_mode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {character_count}/500
                </div>
              </div>

              <div className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <p>💡 <strong>팁:</strong> 구체적으로 원하는 변화를 설명해주세요</p>
                <p className="ml-4">예: "더 밝고 활기찬 분위기로", "음식에 초점을 맞춘 클로즈업으로"</p>
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handle_close();
              }}
              disabled={is_submitting}
              className="px-6"
            >
              취소
            </Button>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                handle_edit_submit();
              }}
              disabled={!prompt_text.trim() || is_submitting}
              className="px-8 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {is_submitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                  />
                  수정 중...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  영상 수정하기
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default VideoEditModal;