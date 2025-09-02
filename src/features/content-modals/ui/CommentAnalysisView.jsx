import React from 'react';
import { ThumbsUp, MessageCircle } from 'lucide-react';

const CommentAnalysisView = ({ data }) => {
  if (!data) {
    return <div className="text-center text-gray-500">데이터가 없습니다.</div>;
  }

  const { top3, atmosphere } = data;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">댓글 분위기</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{atmosphere}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">주요 댓글 (Top 3)</h4>
        <ul className="space-y-3">
          {top3 && top3.map((comment, index) => (
            <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{comment.author}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{comment.text}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comment.likes_or_score}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{comment.replies}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommentAnalysisView;
