/**
 * ContentItemCard 컴포넌트
 * 개별 콘텐츠 아이템을 표시하는 카드
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Clock, TrendingUp, Eye, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { 
  get_type_icon, 
  get_platform_color, 
  get_status_icon, 
  get_status_tooltip 
} from '../../utils/content_launch_utils.jsx';

/**
 * ContentItemCard 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.item - 콘텐츠 아이템 객체
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @param {Array} props.uploading_items - 업로드 중인 아이템 목록
 * @param {Function} props.on_preview - 미리보기 클릭 핸들러
 * @param {Function} props.on_publish - 게시 클릭 핸들러
 * @returns {JSX.Element} ContentItemCard 컴포넌트
 */
const ContentItemCard = ({ 
  item, 
  dark_mode, 
  uploading_items, 
  on_preview, 
  on_publish 
}) => {
  const is_uploading = uploading_items.includes(item.id);

  return (
    <Card className={`${
      dark_mode 
        ? 'bg-gray-700/60 border-gray-600/70 hover:bg-gray-600/70' 
        : 'bg-white/60 border-white/70 hover:bg-white/90'
    } backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 group`}>
      <CardContent className="p-4">
        
        {/* 썸네일 영역 - 클릭 시 미리보기 */}
        <div 
          className={`w-full h-32 ${
            dark_mode ? 'bg-gray-600/50' : 'bg-gray-100'
          } rounded-xl mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer hover:bg-gray-500/60 transition-colors`}
          onClick={() => on_preview(item)}
        >
          <div className={`w-16 h-16 ${
            dark_mode ? 'bg-gray-500/50' : 'bg-gray-200'
          } rounded-full flex items-center justify-center`}>
            {get_type_icon(item.type)}
          </div>
          
          {/* 미리보기 오버레이 */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-2">
              <Eye className="h-5 w-5 text-gray-800" />
            </div>
          </div>
          
          {/* 플랫폼 배지 */}
          <div className="absolute top-2 left-2">
            <Badge className={`${get_platform_color(item.platform)} rounded-full px-2 py-1 text-xs border`}>
              {item.platform}
            </Badge>
          </div>
          
          {/* 상태 아이콘 */}
          <div className="absolute top-2 right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className={`w-8 h-8 ${
                    dark_mode ? 'bg-gray-700/80' : 'bg-white/80'
                  } backdrop-blur-sm rounded-full flex items-center justify-center`}>
                    {get_status_icon(item.status, item.id, uploading_items)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {is_uploading ? '업로드 중' : get_status_tooltip(item.status)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* 콘텐츠 정보 */}
        <div className="space-y-3">
          <h4 className={`font-semibold ${dark_mode ? 'text-white' : 'text-gray-900'} line-clamp-2 text-sm`}>
            {item.title}
          </h4>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Clock className={`h-3 w-3 ${dark_mode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.created_at}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className={`${dark_mode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                  {item.engagement_score}%
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-blue-500" />
                <span className={`${dark_mode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                  {(item.estimated_views / 1000).toFixed(1)}K
                </span>
              </div>
            </div>
          </div>

          {/* 업로드 버튼 */}
          {item.status === 'ready' && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                on_publish(item);
              }}
              disabled={is_uploading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 group-hover:scale-105"
            >
              {is_uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  지금 론칭
                </>
              )}
            </Button>
          )}
          
          {item.status === 'uploaded' && (
            <Button
              disabled
              className="w-full bg-green-100 text-green-700 rounded-xl cursor-not-allowed"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              업로드 완료
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ContentItemCard);