/**
 * 자연어 프롬프트 입력 컴포넌트
 * 영상 재생성을 위한 자연어 텍스트 입력을 처리하는 컴포넌트
 */

import React, { useCallback } from 'react';
import { FileText } from 'lucide-react';

/**
 * NaturalPromptInput 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.prompt_text - 현재 입력된 프롬프트 텍스트
 * @param {Function} props.on_prompt_change - 프롬프트 변경 콜백 함수
 * @returns {JSX.Element} NaturalPromptInput 컴포넌트
 */
const NaturalPromptInput = ({ 
  prompt_text, 
  on_prompt_change
}) => {
  
  // 프롬프트 변경 핸들러
  const handle_prompt_change = useCallback((e) => {
    const value = e.target.value;
    // 200자 제한
    if (value.length <= 200) {
      on_prompt_change(value);
    }
  }, [on_prompt_change]);

  // 글자 수에 따른 색상 클래스 결정
  const get_counter_color = useCallback((length) => {
    if (length <= 50) return 'text-green-600 dark:text-green-400';
    if (length <= 100) return 'text-yellow-600 dark:text-yellow-400';
    if (length <= 200) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  }, []);

  // 예시 문장들
  const example_prompts = [
    "더 밝고 생동감 있는 느낌으로",
    "카메라 움직임을 더 부드럽게", 
    "색감을 따뜻하고 포근하게",
    "좀 더 역동적이고 활기차게",
    "안개 낀 몽환적인 분위기로"
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            영상 재생성 방향 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(선택사항)</span>
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          현재 영상을 어떻게 개선하고 싶으신가요? 원하는 방향을 자유롭게 입력해주세요.
          입력하지 않으면 기존 방식으로 재생성됩니다.
        </p>
      </div>

      {/* 프롬프트 입력창 */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt_text}
            onChange={handle_prompt_change}
            placeholder="영상을 어떻게 개선하고 싶으신가요? (예: 더 밝고 화사한 느낌으로)"
            className="w-full min-h-[120px] p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            rows={4}
          />
          
          {/* 글자 수 카운터 */}
          <div className={`absolute bottom-3 right-3 text-xs font-medium ${get_counter_color(prompt_text.length)}`}>
            {prompt_text.length}/200자
          </div>
        </div>

        {/* 입력 가이드 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              💡 입력 가이드
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• <strong>50자 내외</strong>가 8초 영상에 가장 최적화됩니다</li>
              <li>• 구체적인 방향성을 제시할수록 더 정확한 결과를 얻을 수 있습니다</li>
              <li>• 한국어로 자연스럽게 입력해주세요</li>
            </ul>
          </div>
        </div>

        {/* 예시 문장들 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            예시 문장:
          </h4>
          <div className="flex flex-wrap gap-2">
            {example_prompts.map((example, index) => (
              <button
                key={index}
                onClick={() => on_prompt_change(example)}
                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-600"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NaturalPromptInput;