import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Clock, BarChart2, X as XIcon } from 'lucide-react';

const ContentPreviewModal = ({ 
  is_open, 
  item, 
  dark_mode, 
  on_close 
}) => {
  const navigate = useNavigate();

  if (!is_open || !item) {
    return null;
  }

  const handleAnalyzeClick = () => {
    on_close();
    navigate(`/analytics?videoId=${item.videoId}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent className={`max-w-4xl w-[90vw] ${dark_mode ? 'bg-gray-900/90 border-gray-700/20' : 'bg-white/90 border-gray-300/20'} backdrop-blur-2xl rounded-3xl shadow-xl border p-8 space-y-6`}>
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
          <iframe
            src={`https://www.youtube.com/embed/${item.videoId}`}
            title={item.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
          <DialogClose asChild>
            <button
              type="button"
              className="absolute top-3 right-3 z-20 rounded-full p-1.5 bg-black/50 text-white/70 hover:bg-black/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="닫기"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </DialogClose>
        </div>
        <div className="flex items-start gap-8">
          <div className="flex-1 space-y-4">
            <DialogTitle asChild>
              <h2 className={`text-2xl font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h2>
            </DialogTitle>
            <DialogDescription asChild>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDate(item.publishedAt)}</span>
            </div>
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-3 w-40 flex-shrink-0">
            <Button 
              onClick={handleAnalyzeClick}
              className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 text-gray-800 dark:text-white rounded-xl py-3 text-base"
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              분석하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ContentPreviewModal);