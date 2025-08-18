/**
 * ContentPreviewModal 컴포넌트
 * 콘텐츠 미리보기 모달
 */

import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Play, 
  Image, 
  TrendingUp, 
  Eye, 
  Upload, 
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Settings
} from 'lucide-react';
import { 
  get_platform_color, 
  get_content_type_label 
} from '../../utils/content_launch_utils.jsx';

/**
 * ContentPreviewModal 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.is_open - 모달 열림 상태
 * @param {Object} props.item - 미리보기할 아이템
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @param {Function} props.on_close - 모달 닫기 핸들러
 * @param {Function} props.on_publish - 게시 버튼 클릭 핸들러
 * @returns {JSX.Element} ContentPreviewModal 컴포넌트
 */
const ContentPreviewModal = ({ 
  is_open, 
  item, 
  dark_mode, 
  on_close, 
  on_publish 
}) => {
  if (!item) return null;

  const handle_publish_click = () => {
    on_close();
    on_publish(item);
  };

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent className={`max-w-4xl h-[80vh] ${
        dark_mode 
          ? 'bg-gray-900/95 border-gray-700/60' 
          : 'bg-white/95 border-white/60'
      } backdrop-blur-2xl rounded-3xl p-0 overflow-hidden`}>
        <div className="relative w-full h-full">
          {/* 모달 헤더 */}
          <div className={`p-6 border-b ${
            dark_mode ? 'border-gray-700/60 bg-gray-800/50' : 'border-gray-200/60 bg-white/50'
          } backdrop-blur-sm`}>
            <DialogTitle className={`text-xl font-semibold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
              {item.title}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${get_platform_color(item.platform)} rounded-full px-3 py-1`}>
                {item.platform}
              </Badge>
              <span className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                {get_content_type_label(item.type)}
              </span>
            </div>
          </div>

          {/* 미디어 플레이어 */}
          <div className="flex-1 p-6">
            {item.type === 'video' ? (
              <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center relative">
                {/* 비디오 플레이어 시뮬레이션 */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="h-10 w-10 text-white ml-1" />
                  </div>
                  <p className="text-white/80">비디오 플레이어</p>
                  <p className="text-white/60 text-sm mt-1">실제 환경에서는 영상이 재생됩니다</p>
                </div>

                {/* 비디오 컨트롤 */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 rounded-full p-2">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 rounded-full p-2">
                        <Pause className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 rounded-full p-2">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-white/20 rounded-full">
                          <div className="h-2 bg-white w-1/3 rounded-full"></div>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 rounded-full p-2">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 rounded-full p-2">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : item.type === 'image' ? (
              <div className={`w-full h-full ${
                dark_mode ? 'bg-gray-800' : 'bg-gray-100'
              } rounded-2xl flex items-center justify-center`}>
                <div className="text-center">
                  <Image className={`h-20 w-20 ${dark_mode ? 'text-gray-400' : 'text-gray-600'} mx-auto mb-4`} />
                  <p className={`${dark_mode ? 'text-gray-300' : 'text-gray-700'}`}>이미지 미리보기</p>
                </div>
              </div>
            ) : (
              <div className={`w-full h-full ${
                dark_mode ? 'bg-gray-800/50' : 'bg-gray-50'
              } rounded-2xl p-6 overflow-auto`}>
                <div className="prose max-w-none">
                  <p className={`${dark_mode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {item.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 모달 하단 액션 */}
          <div className={`p-6 border-t ${
            dark_mode ? 'border-gray-700/60 bg-gray-800/50' : 'border-gray-200/60 bg-white/50'
          } backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className={`text-sm ${dark_mode ? 'text-gray-300' : 'text-gray-700'}`}>
                    예상 참여율: {item.engagement_score}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className={`text-sm ${dark_mode ? 'text-gray-300' : 'text-gray-700'}`}>
                    예상 조회수: {item.estimated_views.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={on_close}
                  className={`${
                    dark_mode ? 'border-gray-600/60 hover:bg-gray-700/60' : 'border-gray-300/60 hover:bg-gray-100'
                  } rounded-xl`}
                >
                  닫기
                </Button>
                {item.status === 'ready' && (
                  <Button 
                    onClick={handle_publish_click}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    지금 론칭
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ContentPreviewModal);