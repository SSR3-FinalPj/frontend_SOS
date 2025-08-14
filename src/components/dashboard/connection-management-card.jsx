import { motion } from 'framer-motion';
import { Link, Plus, Unlink } from 'lucide-react';
import { GlassCard } from '../ui/glass-card.jsx';

function ConnectionManagementCard({ platformData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Link className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white">연동 관리</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">연동된 플랫폼</p>
        </div>

        <div className="space-y-4 mb-6">
          {platformData.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-white/10 dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">{platform.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{platform.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">연동됨</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                  >
                    <Unlink className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          새 플랫폼 추가
        </motion.button>
      </GlassCard>
    </motion.div>
  );
}

export { ConnectionManagementCard };