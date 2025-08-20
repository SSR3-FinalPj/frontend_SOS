/**
 * ContentPublishModal 컴포넌트
 * 콘텐츠 게시 모달 - 위치 수정 버전
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Upload, X as XIcon } from 'lucide-react';
import { 
  get_type_icon, 
  get_platform_icon, 
  get_platform_list 
} from '../../utils/content_launch_utils.jsx';
import { usePageStore } from '../../stores/page_store';

const ContentPublishModal = ({ 
  is_open, 
  item, 
  publish_form,
  dark_mode, 
  on_close, 
  on_publish, 
  on_toggle_platform,
  on_update_form
}) => {
  if (!item) return null;

  const { platformConnectionStatus } = usePageStore();
  const platform_list = get_platform_list();

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent className={`
        max-w-2xl 
        max-h-[90vh] 
        overflow-y-auto
        top-[50%]
        left-[50%]
        translate-x-[-50%]
        translate-y-[-50%]
        ${dark_mode 
          ? 'bg-gray-900/95 border-gray-700/60' 
          : 'bg-white/95 border-white/60'
        } 
        backdrop-blur-2xl 
        rounded-3xl
        z-50
      `}>
        
        {/* 닫기 버튼 */}
        <DialogClose asChild>
          <button
            type="button"
            className="absolute top-4 right-4 z-20 rounded-md p-1.5 bg-white/50 dark:bg-black/50 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black transition-all focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="닫기"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </DialogClose>

        <DialogHeader className="pb-4">
          <DialogTitle className={`text-xl font-semibold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
            게시물 생성
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pb-4">
          {/* 플랫폼 선택 */}
          <div>
            <label className={`text-sm font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-700'} mb-3 block`}>
              게시할 플랫폼 선택
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {platform_list.map((platform) => (
                <Button
                  key={platform}
                  disabled={!platformConnectionStatus[platform]}
                  variant={publish_form.platforms.includes(platform) ? "default" : "outline"}
                  onClick={() => on_toggle_platform(platform)}
                  className={`rounded-2xl px-4 py-3 flex items-center gap-2 transition-opacity ${
                    publish_form.platforms.includes(platform)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : dark_mode 
                        ? 'border-gray-600/60 hover:bg-gray-700/60' 
                        : 'border-gray-300/60 hover:bg-gray-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {get_platform_icon(platform)}
                  <span className="capitalize">{platform}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* 미디어 미리보기 */}
          <div className={`${
            dark_mode ? 'bg-gray-800/50' : 'bg-gray-50'
          } rounded-2xl p-4`}>
            <div className="flex items-start gap-4">
              <div className={`w-20 h-20 ${
                dark_mode ? 'bg-gray-700' : 'bg-gray-200'
              } rounded-xl flex items-center justify-center flex-shrink-0`}>
                {get_type_icon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${dark_mode ? 'text-white' : 'text-gray-900'} mb-1 truncate`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>

          {/* 제목 편집 */}
          <div>
            <label className={`text-sm font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
              제목
            </label>
            <Input
              value={publish_form.title}
              onChange={(e) => on_update_form('title', e.target.value)}
              className={`${
                dark_mode ? 'bg-gray-800/60 border-gray-600/60' : 'bg-white/60 border-gray-300/60'
              } backdrop-blur-sm rounded-xl`}
              placeholder="게시물 제목을 입력하세요"
            />
          </div>

          {/* 설명 편집 */}
          <div>
            <label className={`text-sm font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
              설명
            </label>
            <Textarea
              value={publish_form.description}
              onChange={(e) => on_update_form('description', e.target.value)}
              className={`${
                dark_mode ? 'bg-gray-800/60 border-gray-600/60' : 'bg-white/60 border-gray-300/60'
              } backdrop-blur-sm rounded-xl min-h-[100px] resize-none`}
              placeholder="게시물 설명을 입력하세요"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className={`text-sm font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
              태그
            </label>
            <Input
              value={publish_form.tags}
              onChange={(e) => on_update_form('tags', e.target.value)}
              className={`${
                dark_mode ? 'bg-gray-800/60 border-gray-600/60' : 'bg-white/60 border-gray-300/60'
              } backdrop-blur-sm rounded-xl`}
              placeholder="#태그1 #태그2 #태그3"
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-3 pt-4 sticky bottom-0 bg-inherit">
            <Button
              variant="outline"
              onClick={on_close}
              className={`flex-1 ${
                dark_mode ? 'border-gray-600/60 hover:bg-gray-700/60' : 'border-gray-300/60 hover:bg-gray-100'
              } rounded-xl`}
            >
              취소
            </Button>
            
            <Button
              onClick={on_publish}
              disabled={publish_form.platforms.length === 0 || !publish_form.title.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              지금 게시하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ContentPublishModal);