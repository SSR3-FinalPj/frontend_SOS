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
    // 500자 제한
    if (value.length <= 500) {
      on_prompt_change(value);
    }
  }, [on_prompt_change]);

  // 글자 수에 따른 색상 클래스 결정 (500자 기준으로 조정)
  const get_counter_color = useCallback((length) => {
    if (length <= 125) return 'text-green-600 dark:text-green-400';
    if (length <= 250) return 'text-yellow-600 dark:text-yellow-400';
    if (length <= 375) return 'text-orange-600 dark:text-orange-400';
    if (length <= 500) return 'text-red-600 dark:text-red-400';
    return 'text-red-600 dark:text-red-400';
  }, []);

  // 예시 문장들
  const example_prompts = [
    "해질녘 서울숲, 9:16 비율로",
    "영화적인 4K 고화질, 비오는 날의 강남역 거리",
    "항공뷰로 본 남산타워, 16:9 비율로",
    "따뜻한 색감의 북촌 한옥마을 풍경",
    "광화문 광장을 걷는 사람들, 타임랩스"
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            영상 생성 프롬프트 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(선택사항)</span>
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          원하는 영상이 최대한 구체적으로 그려질 수 있도록 프롬프트를 작성해 주세요. 입력하지 않으면 선택한 장소와 이미지를 기반으로 자동 생성됩니다.
        </p>
      </div>

      {/* 프롬프트 입력창 */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt_text}
            onChange={handle_prompt_change}
            placeholder="원하는 영상의 구체적인 모습을 서술해주세요 (예: 해질녘 서울숲, 9:16 비율로)"
            maxLength={500}
            className="w-full min-h-[120px] p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            rows={4}
          />
          
          {/* 글자 수 카운터 */}
          <div className={`absolute bottom-3 right-3 text-xs font-medium ${get_counter_color(prompt_text.length)}`}>
            {prompt_text.length}/500자
          </div>
        </div>

        {/* 입력 가이드 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              💡 입력 가이드
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc pl-5">
              <li><strong>필수:</strong> 영상의 <strong>주제, 배경, 행동</strong>을 명확하게 서술해주세요.</li>
              <li><strong>추천:</strong> 영상의 <strong>스타일, 분위기, 카메라 구도</strong>를 추가하면 완성도가 높아집니다.</li>
              <li><strong>형식:</strong> 프롬프트에 <strong>"9:16 비율로"</strong> 또는 <strong>"16:9 비율로"</strong> 와 같이 영상 비율을 꼭 포함해주세요.</li>
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