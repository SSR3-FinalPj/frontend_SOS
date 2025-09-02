import React from 'react';

const CommentAnalysisView = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const { top3, atmosphere } = data;

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-4">댓글 반응 분석</h3>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">댓글 분위기:</h4>
        <p>{atmosphere}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">주요 댓글 (Top 3):</h4>
        <ul>
          {top3 && top3.map((comment, index) => (
            <li key={index} className="mb-2 p-2 border-b border-gray-200 dark:border-gray-700">
              <p className="font-semibold">{comment.author}</p>
              <p>{comment.text}</p>
              <div className="text-sm text-gray-500">
                <span>Likes: {comment.likes_or_score}</span>
                <span className="ml-4">Replies: {comment.replies}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommentAnalysisView;
