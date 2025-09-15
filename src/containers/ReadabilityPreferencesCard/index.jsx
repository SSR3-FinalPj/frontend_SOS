import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/common/ui/glass-card';
import { Text } from 'lucide-react';

const SIZES = [
  { id: 'sm', label: '작게', value: '13px' },
  { id: 'md', label: '보통', value: '14px' },
  { id: 'lg', label: '크게', value: '15px' },
];

export default function ReadabilityPreferencesCard() {
  const [size, setSize] = useState(localStorage.getItem('pref-font-size') || '14px');

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', size);
    localStorage.setItem('pref-font-size', size);
  }, [size]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <GlassCard>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-secondary-500/20 to-brand-primary-500/20 flex items-center justify-center">
              <Text className="w-5 h-5 text-brand-secondary-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white">가독성 설정</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">글자 크기를 선택해 전체 화면에 적용합니다.</p>
        </div>
        <div className="flex gap-3">
          {SIZES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSize(s.value)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                size === s.value
                  ? 'bg-gradient-to-r from-brand-secondary-500/20 to-brand-primary-500/20 border-brand-secondary-500/40 text-gray-900 dark:text-white'
                  : 'bg-white/30 dark:bg-white/10 border-white/40 dark:border-white/10 text-gray-700 dark:text-gray-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

