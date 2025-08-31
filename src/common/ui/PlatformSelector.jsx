/**
 * 플랫폼 선택 컴포넌트
 * YouTube와 Reddit 플랫폼을 선택할 수 있는 재사용 가능한 UI 컴포넌트
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Image } from 'lucide-react';

/**
 * 플랫폼 선택 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.selectedPlatform - 현재 선택된 플랫폼 ('youtube' | 'reddit')
 * @param {Function} props.onPlatformChange - 플랫폼 변경 시 호출되는 콜백 함수
 * @returns {JSX.Element} 플랫폼 선택 컴포넌트
 */
const PlatformSelector = ({ selectedPlatform, onPlatformChange }) => {
  const platforms = [
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Play,
      color: 'from-red-500/20 to-red-600/20',
      borderColor: 'border-red-500/30',
      hoverColor: 'hover:from-red-500/30 hover:to-red-600/30',
      textColor: 'text-red-600',
      description: '동영상 생성'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: Image,
      color: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      hoverColor: 'hover:from-orange-500/30 hover:to-red-500/30',
      textColor: 'text-orange-600',
      description: '이미지 생성'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          플랫폼 선택
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isSelected = selectedPlatform === platform.id;
          
          return (
            <motion.button
              key={platform.id}
              onClick={() => onPlatformChange(platform.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-2xl border-2 transition-all duration-200
                ${isSelected 
                  ? `bg-gradient-to-br ${platform.color} ${platform.borderColor} shadow-lg` 
                  : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
                ${!isSelected && `${platform.hoverColor}`}
              `}
            >
              {/* 선택된 상태 표시 */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              )}
              
              <div className="flex flex-col items-center text-center space-y-3">
                {/* 아이콘 */}
                <div className={`
                  p-3 rounded-xl
                  ${isSelected 
                    ? 'bg-white/30 dark:bg-white/20' 
                    : 'bg-gray-100 dark:bg-gray-700'
                  }
                `}>
                  <Icon className={`
                    w-6 h-6
                    ${isSelected 
                      ? platform.textColor 
                      : 'text-gray-600 dark:text-gray-400'
                    }
                  `} />
                </div>
                
                {/* 플랫폼 이름 */}
                <div>
                  <h4 className={`
                    font-bold text-base
                    ${isSelected 
                      ? 'text-gray-800 dark:text-white' 
                      : 'text-gray-700 dark:text-gray-300'
                    }
                  `}>
                    {platform.name}
                  </h4>
                  <p className={`
                    text-xs mt-1
                    ${isSelected 
                      ? 'text-gray-600 dark:text-gray-300' 
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {platform.description}
                  </p>
                </div>
              </div>
              
              {/* Reddit 준비 중 배지 */}
              {platform.id === 'reddit' && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                    준비중
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* 선택된 플랫폼 안내 */}
      {selectedPlatform && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-700/30"
        >
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-semibold">
              {platforms.find(p => p.id === selectedPlatform)?.name}
            </span>
            {selectedPlatform === 'youtube' 
              ? ' 플랫폼이 선택되었습니다. 아래 정보를 입력해주세요.'
              : ' 플랫폼이 선택되었습니다. (현재 준비 중인 기능입니다)'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PlatformSelector;