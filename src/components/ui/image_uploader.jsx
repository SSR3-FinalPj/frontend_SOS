/**
 * 이미지 업로드 컴포넌트
 * 드래그앤드롭, 파일 선택, 미리보기 기능을 제공
 */

import React, { useRef, useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

/**
 * ImageUploader 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {File|null} props.uploaded_file - 업로드된 파일 객체
 * @param {Function} props.on_file_change - 파일 변경 콜백 함수
 * @returns {JSX.Element} ImageUploader 컴포넌트
 */
const ImageUploader = ({ uploaded_file, on_file_change }) => {
  // 상태 관리
  const [is_dragging, set_is_dragging] = useState(false);
  
  // 참조
  const file_input_ref = useRef(null);

  // 파일 업로드 핸들러
  const handle_file_change = useCallback((file) => {
    if (!file) return;
    
    // 파일 형식 검증
    const valid_types = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!valid_types.includes(file.type)) {
      alert('PNG 또는 JPG 파일만 업로드 가능합니다.');
      return;
    }
    
    // 파일 크기 검증 (10MB)
    const max_size = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > max_size) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    on_file_change(file);
  }, [on_file_change]);

  // 파일 입력 클릭 핸들러
  const handle_file_input_click = useCallback(() => {
    file_input_ref.current?.click();
  }, []);

  // 파일 입력 변경 핸들러
  const handle_file_input_change = useCallback((e) => {
    const file = e.target.files[0];
    handle_file_change(file);
  }, [handle_file_change]);

  // 드래그 오버 핸들러
  const handle_drag_over = useCallback((e) => {
    e.preventDefault();
    set_is_dragging(true);
  }, []);

  // 드래그 리브 핸들러
  const handle_drag_leave = useCallback((e) => {
    e.preventDefault();
    set_is_dragging(false);
  }, []);

  // 드롭 핸들러
  const handle_drop = useCallback((e) => {
    e.preventDefault();
    set_is_dragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handle_file_change(files[0]);
    }
  }, [handle_file_change]);

  // 파일 제거 핸들러
  const handle_file_remove = useCallback(() => {
    on_file_change(null);
    if (file_input_ref.current) {
      file_input_ref.current.value = '';
    }
  }, [on_file_change]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
          이미지 업로드
        </h3>
      </div>

      {/* 파일 업로드 영역 */}
      <div
        onClick={handle_file_input_click}
        onDragOver={handle_drag_over}
        onDragLeave={handle_drag_leave}
        onDrop={handle_drop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          is_dragging
            ? 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20'
            : uploaded_file
            ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <input
          ref={file_input_ref}
          type="file"
          accept="image/*"
          onChange={handle_file_input_change}
          className="hidden"
        />
        
        {uploaded_file ? (
          <div className="space-y-4">
            {/* 이미지 미리보기 */}
            <div className="relative inline-block">
              <img
                src={URL.createObjectURL(uploaded_file)}
                alt="업로드된 이미지 미리보기"
                className="max-w-full max-h-48 rounded-lg shadow-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handle_file_remove();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* 파일 정보 */}
            <div className="text-sm space-y-1">
              <p className="font-medium text-gray-800 dark:text-white">
                {uploaded_file.name}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {(uploaded_file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            
            <p className="text-sm text-green-600 dark:text-green-400">
              클릭하여 다른 이미지로 변경
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 업로드 아이콘 */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            
            {/* 업로드 텍스트 */}
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-800 dark:text-white">
                이미지를 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG 파일 (최대 10MB)
              </p>
            </div>
          </div>
        )}
        
        {/* 드래깅 오버레이 */}
        {is_dragging && (
          <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-500 rounded-xl flex items-center justify-center">
            <p className="text-lg font-medium text-green-600 dark:text-green-400">
              이미지를 여기에 놓으세요
            </p>
          </div>
        )}
      </div>

      {/* 업로드 가이드 */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• 선택한 명소의 샘플 이미지를 넣어주세요.</p>
        <p>• AI가 업로드된 이미지를 기반으로 영상을 생성합니다.</p>
        <p>• 지원 형식: PNG, JPG | 최대 크기: 10MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;