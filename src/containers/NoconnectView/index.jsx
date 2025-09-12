import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NoconnectView = () => {
  const navigate = useNavigate();

  const handleConnect = () => {
    // TODO: Implement Google login functionality
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/80 dark:border-gray-700/60 rounded-2xl p-8 shadow-inner">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">계정이 연결되지 않았습니다</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            대시보드 데이터를 보려면 계정을 연결해야 합니다. 설정 페이지에서 계정을 연동하여 모든 분석 기능을 사용해보세요.
        </p>
        <div className="flex gap-4">
            <button
                onClick={() => navigate('/settings')}
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
                설정으로 이동
            </button>
            
        </div>
    </div>
  );
};

export default NoconnectView;
