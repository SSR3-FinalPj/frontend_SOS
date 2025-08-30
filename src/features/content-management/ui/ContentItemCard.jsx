/**
 * ContentItemCard 컴포넌트
 * 개별 콘텐츠 아이템을 표시하는 카드
 */

import React from 'react';
import { Card, CardContent } from '../../../common/ui/card';
import { Button } from '../../../common/ui/button';
import { Badge } from '../../../common/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../common/ui/tooltip';
import { Clock, Upload, CheckCircle2, Loader2, Check } from 'lucide-react';
import Timer from '../../../common/ui/timer.jsx';
import jumpCatGif from '/src/assets/images/Jumpcat/jump_cat.gif';
import { 
  get_type_icon, 
  get_platform_color, 
  get_status_icon, 
  get_status_tooltip 
} from '../lib/contentLaunchUtils.jsx';

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
  on_publish,
  selected_video_id,
  on_video_select
}) => {
  // 백엔드 video_id 우선, 없으면 temp_id, 마지막으로 기존 id 사용
  const item_id = item.video_id || item.temp_id || item.id;
  const is_uploading = uploading_items.includes(item_id);
  const is_selected = selected_video_id === item_id;
  
  // 선택 가능한 상태인지 확인 (업로드 완료된 영상만)
  const is_selectable = item.status === 'uploaded';
  
  // 미리보기 클릭 가능한 상태인지 확인 (완성된 영상만)
  const is_clickable_for_preview = item.status === 'ready';
  
  // creationTime 포매팅 함수
  const formatCreationTime = (creationTime) => {
    if (!creationTime) return '';
    const date = new Date(creationTime);
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  // console.log('ContentItemCard render:', {
  //   title: item.title,
  //   video_id: item.video_id,
  //   temp_id: item.temp_id,
  //   id: item.id,
  //   final_item_id: item_id,
  //   is_uploading,
  //   uploading_items
  // });

  // 선택 클릭 핸들러
  const handle_select = (e) => {
    e.stopPropagation();
    if (is_selectable && on_video_select) {
      on_video_select(item);
    }
  };

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
      <CardContent className="p-4">
        
        {/* 썸네일 영역 - 클릭 시 미리보기 (ready 상태만) */}
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
              {/* PROCESSING 상태: 배경 이미지 (회색 필터) */}
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt="썸네일"
                  className="w-full h-full object-cover filter grayscale"
                />
              ) : (
                <div className={`w-full h-full ${
                  dark_mode ? 'bg-gray-600/50' : 'bg-gray-100'
                }`} />
              )}
              
              {/* PROCESSING 오버레이: 고양이 + 타이머 */}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                <img 
                  src={jumpCatGif}
                  alt="생성 중"
                  className="w-12 h-12"
                  onError={(e) => {
                    // 이미지 로드 실패 시 숨기고 대체 아이콘 표시
                    e.target.style.display = 'none';
                    console.warn('고양이 GIF 로드 실패:', jumpCatGif);
                  }}
                />
                <Timer startTime={item.start_time} className="text-white text-sm" />
              </div>
            </>
          ) : (
            <>
              {/* 기본 상태: 기존 UI */}
              <div className={`w-full h-32 ${
                dark_mode ? 'bg-gray-600/50' : 'bg-gray-100'
              } flex items-center justify-center hover:bg-gray-500/60 transition-colors`}>
                <div className={`w-16 h-16 ${
                  dark_mode ? 'bg-gray-500/50' : 'bg-gray-200'
                } rounded-full flex items-center justify-center`}>
                  {get_type_icon(item.type)}
                </div>
              </div>
              
              {/* 미리보기 오버레이 */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-2">
                  {/* 미리보기 아이콘 */}
                </div>
              </div>
            </>
          )}
          
          {/* 플랫폼 배지 - 공통 */}
          <div className="absolute top-2 left-2">
            <Badge className={`${get_platform_color(item.platform)} rounded-full px-2 py-1 text-xs border`}>
              {item.platform}
            </Badge>
          </div>
          
          {/* 상태 아이콘 - 공통 */}
          <div className="absolute top-2 right-2 flex gap-1">
            {/* 선택 표시 아이콘 */}
            {is_selected && (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            
            {/* 기존 상태 아이콘 */}
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
                {item.creationTime ? formatCreationTime(item.creationTime) : item.created_at}
              </span>
            </div>
            
            {/* 선택 가능 표시 */}
            {is_selectable && !is_selected && (
              <span className={`text-xs ${
                dark_mode ? 'text-green-400' : 'text-green-600'
              } font-medium`}>
                선택 가능
              </span>
            )}
            
            {/* 선택됨 표시 */}
            {is_selected && (
              <span className={`text-xs ${
                dark_mode ? 'text-green-400' : 'text-green-600'
              } font-medium`}>
                ✓ 선택됨
              </span>
            )}
          </div>

          {/* 업로드 버튼 - ready 및 READY_TO_LAUNCH 상태 */}
          {(item.status === 'ready' || item.status === 'READY_TO_LAUNCH') && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                on_publish(item);
              }}
              disabled={is_uploading}
              className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 text-gray-800 dark:text-white rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md"
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
              className="w-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 rounded-xl cursor-not-allowed"
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