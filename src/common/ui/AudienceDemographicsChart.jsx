import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';

const AudienceDemographicsChart = ({ data }) => {
  // Hover 강조 상태: 동일 연령대(인덱스)를 남/여 동시에 강조
  const [activeIdx, setActiveIdx] = React.useState(null);

  const isDimmed = (idx) => {
    return activeIdx !== null && idx !== activeIdx;
  };

  // 다크 모드 탐지 (Recharts 스타일에 사용)
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const tickColor = isDark ? 'rgba(243, 244, 246, 0.85)' : 'rgba(55, 65, 81, 0.85)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <GlassCard className="p-6" hover={false}>
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary-500/30 to-brand-secondary-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-brand-primary-600 dark:text-brand-primary-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              시청자 분포 분석
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              성별 · 연령대별 비교
            </p>
          </div>
        </motion.div>

        <motion.div
          className="h-80 sm:h-96 w-full relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              onMouseMove={(state) => {
                const idx = state?.activeTooltipIndex;
                if (idx !== undefined && idx !== null) setActiveIdx(idx);
              }}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'} opacity={0.08} />
              <XAxis dataKey="age" tick={{ fontSize: 12, fill: tickColor }} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} />
              <Tooltip
                cursor={{ fill: 'rgba(148, 163, 184, 0.25)' }}
                contentStyle={{
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(200, 200, 200, 0.3)',
                  borderRadius: '1rem',
                  backdropFilter: 'blur(10px)',
                  color: isDark ? 'rgba(243, 244, 246, 0.92)' : 'rgba(17, 24, 39, 0.85)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              {/* 남성 막대: hover 시 해당 막대만 강조, 나머지는 디밍 */}
              <Bar dataKey="male" name="남성" fill="#3b82f6">
                {data.map((_, idx) => (
                  <Cell
                    key={`male-${idx}`}
                    fill={isDimmed(idx) ? 'rgba(148, 163, 184, 0.55)' : '#3b82f6'}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onMouseLeave={() => setActiveIdx(null)}
                  />
                ))}
              </Bar>
              {/* 여성 막대: hover 시 해당 막대만 강조, 나머지는 디밍 */}
              <Bar dataKey="female" name="여성" fill="#7c3aed">
                {data.map((_, idx) => (
                  <Cell
                    key={`female-${idx}`}
                    fill={isDimmed(idx) ? 'rgba(148, 163, 184, 0.55)' : '#7c3aed'}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onMouseLeave={() => setActiveIdx(null)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
};

export default AudienceDemographicsChart;
