/**
 * ContentItemCard 컴포넌트
 * 개별 콘텐츠 아이템을 표시하는 카드
 */

import React from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Button } from '@/common/ui/button';
import { Badge } from '@/common/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/common/ui/tooltip';
import { Clock, Upload, CheckCircle2, Loader2, Check, AlertTriangle, GitMerge } from 'lucide-react';
import Timer from '@/common/ui/timer';
import jumpCatGif from '@/assets/images/Jumpcat/jump_cat.gif';
import { 
  get_type_icon, 
  get_platform_color, 
  get_status_icon, 
  get_status_tooltip 
} from '@/features/content-management/lib/content-launch-utils.jsx';
import { formatCreationTime } from '@/common/utils/date-utils';
import { get_location_by_poi_id } from '@/common/constants/location-data';

const ContentItemCard = ({ 
  item, 
  dark_mode, 
  uploading_items, 
  on_preview, 
  on_publish,
  selected_video_id,
  on_video_select,
  isVersionBaseline = false
}) => {
  const item_id = item.result_id || item.resultId || item.video_id || item.temp_id || item.id;
  const is_uploading = uploading_items.includes(item_id);
  const is_selected = selected_video_id === item_id;
  
  let status = (item.status || '').toString();
  if (status === 'COMPLETED' || status === 'completed') {
    status = 'ready';
  }

  const is_selectable = status === 'uploaded' || status === 'ready' || status === 'READY_TO_LAUNCH';
  const is_clickable_for_preview = (
    status === 'ready' || status === 'READY' ||
    status === 'PROCESSING' || status === 'processing' ||
    status === 'uploaded' ||
    status === 'READY_TO_LAUNCH'
  );

  const handle_select = (e) => {
    e.stopPropagation();
    if (is_selectable && on_video_select) {
      on_video_select(item);
    }
  };

  const regionCode = item.poi_id ? item.poi_id.split('_')[2] : null;
  const location = regionCode ? get_location_by_poi_id(regionCode) : null;
  const locationName = location ? location.name : '';

  return (
    <Card className={`${
      is_selected
        ? dark_mode
          ? 'bg-green-900/20 border-green-500 hover:bg-green-900/30'
          : 'bg-green-50 border-green-400 hover:bg-green-100'
        : dark_mode 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
    } shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 group ${
      is_selectable ? 'cursor-pointer' : ''
    }`} 
    onClick={is_selectable ? handle_select : undefined}>
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
          {/* 썸네일 영역 */}
          <div 
            className={`w-full h-32 rounded-xl mb-4 relative overflow-hidden ${
              is_clickable_for_preview ? 'cursor-pointer' : 'cursor-default'
            }`}
            onClick={is_clickable_for_preview ? (e) => {
              e.stopPropagation();
              on_preview(item);
            } : undefined}
          >
            {item.status === 'PROCESSING' ? (
              <>
                <div className={`w-full h-full ${dark_mode ? 'bg-gray-700' : 'bg-gray-800'}`} />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                  <img src={jumpCatGif} alt="생성 중" className="w-12 h-12" />
                  <Timer startTime={item.start_time} className="text-white text-sm" />
                </div>
              </>
            ) : (
              <>
                <div className={`w-full h-32 ${dark_mode ? 'bg-gray-600/50' : 'bg-gray-100'} flex items-center justify-center`}>
                  <div className={`w-16 h-16 ${dark_mode ? 'bg-gray-500/50' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                    {get_type_icon(item.type)}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
              </>
            )}
            
            {/* 플랫폼 배지 */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <Badge className={`${get_platform_color(item.platform)} rounded-full px-2 py-1 text-xs border`}>
                {item.platform}
              </Badge>
            </div>
            
            {/* 상태 아이콘 */}
            <div className="absolute top-2 right-2 flex gap-1">
              {isVersionBaseline && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`w-8 h-8 ${dark_mode ? 'bg-blue-900/40 border-blue-500/40' : 'bg-blue-50 border-blue-200'} border rounded-full flex items-center justify-center shadow-sm`}
                      >
                        <GitMerge className={`w-4 h-4 ${dark_mode ? 'text-blue-200' : 'text-blue-600'}`} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>이 영상 기반으로 다음 버전이 생성되었습니다.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {/* 버전 배지 (루트/카드에서도 표시) */}
              {item.version && (
                <Badge className={`${dark_mode ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-100/80 text-gray-600'} rounded-full px-2 py-1 text-xs border`}>
                  v{item.version}
                </Badge>
              )}
              {is_selected && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className={`w-8 h-8 ${dark_mode ? 'bg-gray-700/80' : 'bg-white/80'} backdrop-blur-sm rounded-full flex items-center justify-center`}>
                      {get_status_icon(status, item.id, uploading_items)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{is_uploading ? '업로드 중' : get_status_tooltip(status)}</p>
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
            {locationName && (
              <div className={`font-bold text-xs ${dark_mode ? 'text-gray-300' : 'text-gray-700'}`}>
                {locationName}
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Clock className={`h-3 w-3 ${dark_mode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.createdAt ? formatCreationTime(item.createdAt) : (item.creationTime ? formatCreationTime(item.creationTime) : item.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-4 space-y-2">
          {(status === 'ready' || status === 'READY_TO_LAUNCH') && (
            <Button
              onClick={(e) => { e.stopPropagation(); on_publish(item); }}
              disabled={is_uploading}
              variant="brand"
              className="w-full rounded-xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {is_uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              {is_uploading ? '업로드 중...' : '지금 론칭'}
            </Button>
          )}
          
          {status === 'uploaded' && (
            <Button disabled className="w-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 rounded-xl cursor-not-allowed">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              업로드 완료
            </Button>
          )}
          
          {status === 'failed' && (
            <Button
              onClick={(e) => { e.stopPropagation(); alert('재시도 기능은 현재 구현 중입니다.'); }}
              className="w-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 hover:from-red-500/30 hover:to-orange-500/30 text-red-600 dark:text-red-400 rounded-xl font-medium"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              재시도
            </Button>
          )}

        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ContentItemCard);
