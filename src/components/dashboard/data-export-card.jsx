import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { GlassCard } from '../ui/glass-card.jsx';

function DataExportCard({ t }) {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  const handleExport = (format) => {
    // Mock export functionality
    console.log(`Exporting ${selectedPeriod} data as ${format}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <GlassCard>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white">{t.dataExport}</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{t.exportPeriod}</p>
        </div>

        {/* Period Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t.selectPeriod}
          </label>
          <div className="flex gap-3">
            <motion.button
              onClick={() => setSelectedPeriod('7days')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPeriod === '7days'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/20 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
              }`}
            >
              {t.last7Days}
            </motion.button>
            <motion.button
              onClick={() => setSelectedPeriod('30days')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPeriod === '30days'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/20 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
              }`}
            >
              {t.last30Days}
            </motion.button>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-4">
          <motion.button
            onClick={() => handleExport('csv')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            {t.exportToCSV}
          </motion.button>
          <motion.button
            onClick={() => handleExport('excel')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            {t.exportToExcel}
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export { DataExportCard };