
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { PieChart as PieChartIcon } from 'lucide-react';
import GlassCard from './glass-card.jsx';
import { traffic_source_data } from '../../utils/dashboard_constants.js';
import { cn } from '../../utils/ui_utils.js';

// 프로젝트 표준 그라데이션 색상 시스템 (5개 카테고리용)
const GRADIENT_COLORS = [
  'hsl(217, 91%, 60%)', // 파란색 기본 - 검색
  'hsl(262, 83%, 58%)', // 보라색 기본 - 추천/탐색
  'hsl(245, 58%, 51%)', // 파란색-보라색 중간 - 채널/구독
  'hsl(280, 100%, 70%)', // 밝은 보라색 - 외부
  'hsl(200, 80%, 55%)' // 청록색 - 기타
];

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    // 실제 총합 계산
    const total = traffic_source_data.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((payload[0].value / total) * 100).toFixed(1);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/30 rounded-2xl p-4 shadow-2xl"
      >
        <p className="font-semibold text-gray-800 dark:text-white mb-2">
          {payload[0].name}
        </p>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {payload[0].value.toLocaleString()}명 ({percentage}%)
          </span>
        </div>
      </motion.div>
    );
  }
  return null;
};

// 커스텀 레전드 컴포넌트
const CustomLegend = ({ payload }) => (
  <motion.div 
    className="flex flex-wrap justify-center gap-4 mt-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.8 }}
  >
    {payload.map((entry, index) => (
      <motion.div
        key={entry.value}
        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.9 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05, y: -2 }}
      >
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {entry.value}
        </span>
      </motion.div>
    ))}
  </motion.div>
);

const TrafficSourceChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="p-6" hover={true}>
        {/* 헤더 섹션 */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg">
            <PieChartIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              트래픽 소스 분석
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              유입 경로별 사용자 비율
            </p>
          </div>
        </motion.div>

        {/* 차트 영역 */}
        <motion.div 
          className={cn(
            "h-80 sm:h-96 w-full",
            "relative"
          )}
          role="img"
          aria-label="웹사이트 트래픽 소스별 비율을 나타내는 파이 차트"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={traffic_source_data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={window.innerWidth < 640 ? 60 : 90}
                innerRadius={window.innerWidth < 640 ? 25 : 35}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                animationBegin={500}
                animationDuration={800}
              >
                {traffic_source_data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
};

export default TrafficSourceChart;
