import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { audience_demo_data } from '../../domain/dashboard/model/dashboardConstants.js';
import GlassCard from './glass-card.jsx';

const AudienceDemographicsChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <GlassCard className="p-6" hover={true}>
        {/* 헤더 */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/30 to-cyan-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
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

        {/* 차트 */}
        <motion.div
          className="h-80 sm:h-96 w-full relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={audience_demo_data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="age" tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.7 }} />
              <YAxis tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.7 }} />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(200, 200, 200, 0.3)',
                  borderRadius: '1rem',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="male" name="남성" fill="#3b82f6" />
              <Bar dataKey="female" name="여성" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
};

export default AudienceDemographicsChart;
