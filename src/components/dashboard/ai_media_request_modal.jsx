/**
 * AI 미디어 제작 요청 모달 컴포넌트
 * 위치 선택, 이미지 업로드, 요청 메모 기능을 포함한 제작 요청 폼
 */

import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, MapPin, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '../ui/button.jsx';
import { 
  SEOUL_DISTRICTS, 
  get_locations_by_district, 
  search_locations 
} from '../../utils/location_data.js';

/**
 * AI 미디어 제작 요청 모달 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.is_open - 모달 열림 상태
 * @param {Function} props.on_close - 모달 닫기 함수
 * @returns {JSX.Element} AI 미디어 제작 요청 모달 컴포넌트
 */
const AIMediaRequestModal = ({ is_open, on_close }) => {
  // 폼 상태 관리
  const [selected_district, set_selected_district] = useState('');
  const [selected_location, set_selected_location] = useState(null);
  const [search_term, set_search_term] = useState('');
  const [uploaded_file, set_uploaded_file] = useState(null);
  const [request_memo, set_request_memo] = useState('');
  const [is_dragging, set_is_dragging] = useState(false);
  const [is_submitting, set_is_submitting] = useState(false);
  
  // 카테고리별 요청 상태
  const [request_categories, set_request_categories] = useState({
    style: '',
    subject: '',
    motion: '',
    constraints: ''
  });

  // 참조
  const file_input_ref = useRef(null);
  const modal_ref = useRef(null);
  
  // 한국어-영어 변환 데이터
  const CATEGORY_TRANSLATIONS = {
    style: {
      '영화적인 4K 고화질': 'cinematic 4K, high detail, moody lighting',
      '자연스러운 다큐멘터리': 'documentary style, natural lighting',
      '현대적이고 세련된': 'modern sleek style, clean composition',
      '빈티지 감성': 'vintage aesthetic, warm tone, film grain',
      '미니멀리즘': 'minimalist style, clean lines, simple composition'
    },
    subject: {
      '궁궐 안뜰과 돌문': 'palace courtyards, stone gates, wet ground reflections',
      '도심 속 건물들': 'urban buildings, city skyline, street views',
      '자연 경관': 'natural landscapes, scenic views',
      '전통 건축': 'traditional architecture, cultural heritage',
      '현대적 랜드마크': 'modern landmarks, architectural highlights'
    },
    motion: {
      '천천히 앞으로': 'slow dolly forward',
      '좌우 패닝': 'smooth pan left to right',
      '위에서 아래로': 'top down aerial view',
      '회전하며 촬영': 'circular rotation around subject',
      '고정 카메라': 'static camera, no movement'
    },
    constraints: {
      '같은 앵글 유지': 'same camera angle, consistent framing',
      '타임랩스 시퀀스': 'timelapse sequence',
      '황금 시간대': 'golden hour lighting',
      '날씨 변화 포함': 'weather transition effects',
      '사람 없는 장면': 'empty scene, no people'
    }
  };
  
  const CATEGORY_OPTIONS = {
    style: Object.keys(CATEGORY_TRANSLATIONS.style),
    subject: Object.keys(CATEGORY_TRANSLATIONS.subject),
    motion: Object.keys(CATEGORY_TRANSLATIONS.motion),
    constraints: Object.keys(CATEGORY_TRANSLATIONS.constraints)
  };

  // 구별 명소 목록 가져오기
  const district_locations = selected_district ? get_locations_by_district(selected_district) : [];
  
  // 검색 결과
  const search_results = search_term ? search_locations(search_term) : [];

  // 파일 업로드 핸들러
  const handle_file_change = useCallback((file) => {
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      set_uploaded_file(file);
    } else {
      alert('PNG 또는 JPG 파일만 업로드 가능합니다.');
    }
  }, []);

  // 드래그 앤 드롭 이벤트 핸들러
  const handle_drag_enter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    set_is_dragging(true);
  }, []);

  const handle_drag_leave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    set_is_dragging(false);
  }, []);

  const handle_drop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    set_is_dragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handle_file_change(files[0]);
    }
  }, [handle_file_change]);

  // 파일 선택 클릭 핸들러
  const handle_file_click = useCallback(() => {
    file_input_ref.current?.click();
  }, []);

  // 파일 삭제 핸들러
  const handle_file_remove = useCallback(() => {
    set_uploaded_file(null);
    if (file_input_ref.current) {
      file_input_ref.current.value = '';
    }
  }, []);

  // 구 선택 핸들러
  const handle_district_select = useCallback((district) => {
    set_selected_district(district);
    set_selected_location(null);
    set_search_term('');
  }, []);

  // 명소 선택 핸들러
  const handle_location_select = useCallback((location) => {
    set_selected_location(location);
    set_search_term('');
    set_selected_district(location.district);
  }, []);
  
  // 카테고리 선택 핸들러
  const handle_category_select = useCallback((category, value) => {
    set_request_categories(prev => ({
      ...prev,
      [category]: value
    }));
  }, []);

  // 폼 제출 핸들러
  const handle_submit = useCallback(async () => {
    // 필수 항목 검증
    if (!selected_location) {
      alert('위치를 선택해주세요.');
      return;
    }

    if (!uploaded_file) {
      alert('참고 이미지를 업로드해주세요.');
      return;
    }

    // 모든 카테고리가 선택되었는지 확인
    const required_categories = ['style', 'subject', 'motion', 'constraints'];
    const missing_categories = required_categories.filter(cat => !request_categories[cat]);
    
    if (missing_categories.length > 0) {
      alert('모든 카테고리를 선택해주세요.');
      return;
    }

    set_is_submitting(true);

    try {
      // 카테고리를 영어로 변환
      const translated_categories = {
        style: CATEGORY_TRANSLATIONS.style[request_categories.style],
        subject: CATEGORY_TRANSLATIONS.subject[request_categories.subject],
        motion: CATEGORY_TRANSLATIONS.motion[request_categories.motion],
        constraints: CATEGORY_TRANSLATIONS.constraints[request_categories.constraints]
      };

      // 백엔드 전송 데이터 구성
      const form_data = new FormData();
      form_data.append('location_id', selected_location.poi_id);
      form_data.append('location_name', selected_location.name);
      form_data.append('district', selected_location.district);
      form_data.append('user_request', JSON.stringify({ user: translated_categories }));
      form_data.append('reference_image', uploaded_file);

      // TODO: 실제 API 호출 구현
      console.log('제작 요청 데이터:', {
        location_id: selected_location.poi_id,
        location_name: selected_location.name,
        district: selected_location.district,
        user_request: { user: translated_categories },
        has_image: true
      });

      // 성공 처리
      alert('AI 미디어 제작 요청이 성공적으로 전송되었습니다!');
      on_close();
      
      // 폼 초기화
      set_selected_district('');
      set_selected_location(null);
      set_search_term('');
      set_uploaded_file(null);
      set_request_memo('');
      set_request_categories({
        style: '',
        subject: '',
        motion: '',
        constraints: ''
      });
      
    } catch (error) {
      console.error('제작 요청 전송 실패:', error);
      alert('요청 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      set_is_submitting(false);
    }
  }, [selected_location, request_memo, uploaded_file, on_close]);

  // 모달 닫기 핸들러
  const handle_close = useCallback(() => {
    if (is_submitting) return;
    on_close();
  }, [is_submitting, on_close]);

  // ESC 키 핸들러
  const handle_key_down = useCallback((e) => {
    if (e.key === 'Escape') {
      handle_close();
    }
  }, [handle_close]);

  if (!is_open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
        onClick={handle_close}
        onKeyDown={handle_key_down}
        tabIndex={-1}
      >
        <motion.div
          ref={modal_ref}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              AI 미디어 제작 요청
            </h2>
            <button
              onClick={handle_close}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              disabled={is_submitting}
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* 컨텐츠 */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            {/* 위치 선택 섹션 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  촬영 위치 선택
                </h3>
              </div>

              {/* 검색 바 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="명소를 검색하세요 (예: 서울역, 강남역)"
                  value={search_term}
                  onChange={(e) => set_search_term(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
              </div>

              {/* 검색 결과 또는 구별 선택 */}
              {search_term ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">검색 결과</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {search_results.map((location) => (
                      <button
                        key={location.poi_id}
                        onClick={() => handle_location_select(location)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 ${
                          selected_location?.poi_id === location.poi_id
                            ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-50 dark:bg-gray-700 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="font-medium">{location.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({location.district})
                        </span>
                      </button>
                    ))}
                    {search_results.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
                        검색 결과가 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 구 선택 탭 */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">구 선택</p>
                  <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                    {SEOUL_DISTRICTS.map((district) => (
                      <button
                        key={district}
                        onClick={() => handle_district_select(district)}
                        className={`px-3 py-2 text-sm rounded-xl transition-all duration-200 ${
                          selected_district === district
                            ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {district}
                      </button>
                    ))}
                  </div>

                  {/* 선택된 구의 명소 목록 */}
                  {selected_district && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selected_district} 명소
                      </p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {district_locations.map((location) => (
                          <button
                            key={location.poi_id}
                            onClick={() => handle_location_select(location)}
                            className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 ${
                              selected_location?.poi_id === location.poi_id
                                ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                                : 'bg-gray-50 dark:bg-gray-700 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {location.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 선택된 위치 표시 */}
              {selected_location && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">선택된 위치:</span> {selected_location.name} ({selected_location.district})
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    ID: {selected_location.poi_id}
                  </p>
                </div>
              )}
            </div>

            {/* 이미지 업로드 섹션 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  참고 이미지
                </h3>
              </div>

              <div
                onDragEnter={handle_drag_enter}
                onDragOver={handle_drag_enter}
                onDragLeave={handle_drag_leave}
                onDrop={handle_drop}
                onClick={handle_file_click}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  is_dragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 shadow-lg'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm hover:shadow-md'
                }`}
              >
                <input
                  ref={file_input_ref}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => handle_file_change(e.target.files?.[0])}
                  className="hidden"
                />
                
                {uploaded_file ? (
                  <div className="space-y-3">
                    <img
                      src={URL.createObjectURL(uploaded_file)}
                      alt="업로드된 이미지 미리보기"
                      className="max-h-32 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {uploaded_file.name}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handle_file_remove();
                      }}
                      className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-gray-600 dark:text-gray-400">
                      이미지를 드래그 앤 드롭하거나 클릭하여 업로드
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG 파일만 지원 (최대 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 영상 제작 요청 카테고리 섹션 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  영상 제작 요청 사항
                </h3>
              </div>

              {/* 스타일 선택 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  영상 스타일
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.style.map((option) => (
                    <button
                      key={option}
                      onClick={() => handle_category_select('style', option)}
                      className={`px-3 py-2 text-sm rounded-xl transition-all duration-200 text-left ${
                        request_categories.style === option
                          ? 'bg-purple-100 dark:bg-purple-900 border border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200'
                          : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* 주제 선택 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  촬영 주제
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.subject.map((option) => (
                    <button
                      key={option}
                      onClick={() => handle_category_select('subject', option)}
                      className={`px-3 py-2 text-sm rounded-xl transition-all duration-200 text-left ${
                        request_categories.subject === option
                          ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* 카메라 움직임 선택 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  카메라 움직임
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.motion.map((option) => (
                    <button
                      key={option}
                      onClick={() => handle_category_select('motion', option)}
                      className={`px-3 py-2 text-sm rounded-xl transition-all duration-200 text-left ${
                        request_categories.motion === option
                          ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                          : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* 제약사항 선택 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  특별 요구사항
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.constraints.map((option) => (
                    <button
                      key={option}
                      onClick={() => handle_category_select('constraints', option)}
                      className={`px-3 py-2 text-sm rounded-xl transition-all duration-200 text-left ${
                        request_categories.constraints === option
                          ? 'bg-orange-100 dark:bg-orange-900 border border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200'
                          : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handle_close}
              disabled={is_submitting}
            >
              취소
            </Button>
            
            <Button
              onClick={handle_submit}
              disabled={!selected_location || !uploaded_file || Object.values(request_categories).some(val => !val) || is_submitting}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold"
            >
              {is_submitting ? '요청 중...' : '제작 요청하기'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default AIMediaRequestModal;