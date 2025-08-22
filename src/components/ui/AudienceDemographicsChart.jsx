
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { audience_demo_data } from '../../utils/dashboard_constants.js';

const AudienceDemographicsChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-xl h-96">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">시청자 성별 · 연령대 비교</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={audience_demo_data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
        </div>
      </div>
    </motion.div>
  );
};

export default AudienceDemographicsChart;
