import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { audience_demo_data } from '../../utils/dashboard_constants.js';
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            시청자 성별 · 연령대 비교
          </h3>
        </div>

        {/* 차트 */}
        <motion.div
          className="h-80 sm:h-96 w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={audience_demo_data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
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
