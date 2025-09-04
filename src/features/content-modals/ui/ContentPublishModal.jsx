/**
 * ContentPublishModal 컴포넌트
 * 콘텐츠 게시 모달 - 위치 수정 버전
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/common/ui/dialog';
import { Button } from '@/common/ui/button';
import { Input } from '@/common/ui/input';
import { Textarea } from '@/common/ui/textarea';
import { Upload, X as XIcon } from 'lucide-react';
import { 
  get_type_icon, 
  get_platform_icon, 
  get_platform_list 
} from '@/features/content-management/lib/content-launch-utils';
import { usePlatformStore } from '@/domain/platform/logic/store';

// YouTube 카테고리 목록
const YOUTUBE_CATEGORIES = {
  "1": "Film & Animation",
  "2": "Autos & Vehicles", 
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "19": "Travel & Events",
  "20": "Gaming",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
  "29": "Nonprofits & Activism"
};

// 공개 상태 옵션
const PRIVACY_OPTIONS = [
  { value: 'private', label: '비공개', description: '나만 볼 수 있음' },
  { value: 'unlisted', label: '일부 공개', description: '링크를 아는 사람만' },
  { value: 'public', label: '공개', description: '모든 사람이 볼 수 있음' }
];

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

  const { platforms } = usePlatformStore();
  const platform_list = get_platform_list();

  const isPlatformConnected = (platform) => {
    const storeKey = platform === 'youtube' ? 'google' : platform;
    return platforms[storeKey]?.connected;
  };

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
                  disabled={!isPlatformConnected(platform)}
                  variant={publish_form.platforms.includes(platform) ? "default" : "outline"}
                  onClick={() => on_toggle_platform(platform)}
                  className={`rounded-2xl px-4 py-3 flex items-center gap-2 transition-opacity ${
                    publish_form.platforms.includes(platform)
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-gray-800 dark:text-white'
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
              placeholder="태그1, 태그2, 태그3 (쉼표로 구분)"
            />
          </div>

          {/* Reddit 전용 설정 */}
          {publish_form.platforms.includes('reddit') && (
            <>
              {/* Subreddit 입력 */}
              <div>
                <label className={`text-sm font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
                  서브레딧 (Subreddit)
                </label>
                <Input
                  value={publish_form.subreddit}
                  onChange={(e) => on_update_form('subreddit', e.target.value)}
                  className={`${
                    dark_mode ? 'bg-gray-800/60 border-gray-600/60' : 'bg-white/60 border-gray-300/60'
                  } backdrop-blur-sm rounded-xl`}
                  placeholder="예: r/videos (r/ 없이 입력하세요)"
                />
                <p className={`text-xs mt-1 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                  게시할 서브레딧의 이름을 입력하세요. 예: videos, funny, gaming
                </p>
              </div>
            </>
          )}

          {/* YouTube 전용 설정 */}
          {publish_form.platforms.includes('youtube') && (
            <>
              {/* 공개 상태 */}
              <div>
                <label className={`text-sm font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-700'} mb-3 block`}>
                  공개 상태
                </label>
                <div className="space-y-2">
                  {PRIVACY_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        publish_form.privacyStatus === option.value
                          ? dark_mode
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                            : 'bg-blue-50 border-blue-200 text-blue-700'
                          : dark_mode
                            ? 'bg-gray-800/30 border-gray-600/60 hover:bg-gray-700/60'
                            : 'bg-white/30 border-gray-300/60 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="privacyStatus"
                        value={option.value}
                        checked={publish_form.privacyStatus === option.value}
                        onChange={(e) => on_update_form('privacyStatus', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 카테고리 선택 */}
              <div>
                <label className={`text-sm font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
                  카테고리
                </label>
                <select
                  value={publish_form.categoryId}
                  onChange={(e) => on_update_form('categoryId', e.target.value)}
                  className={`w-full p-3 rounded-xl border ${
                    dark_mode 
                      ? 'bg-gray-800/60 border-gray-600/60 text-white' 
                      : 'bg-white/60 border-gray-300/60 text-gray-900'
                  } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {Object.entries(YOUTUBE_CATEGORIES).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 아동용 여부 */}
              <div>
                <label className={`text-sm font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-700'} mb-3 block`}>
                  아동용 콘텐츠
                </label>
                <div className="flex items-center gap-4">
                  <label className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors ${
                    !publish_form.madeForKids ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}>
                    <input
                      type="radio"
                      name="madeForKids"
                      checked={!publish_form.madeForKids}
                      onChange={() => on_update_form('madeForKids', false)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className={dark_mode ? 'text-gray-300' : 'text-gray-700'}>
                      아니오
                    </span>
                  </label>
                  <label className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors ${
                    publish_form.madeForKids ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}>
                    <input
                      type="radio"
                      name="madeForKids"
                      checked={publish_form.madeForKids}
                      onChange={() => on_update_form('madeForKids', true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className={dark_mode ? 'text-gray-300' : 'text-gray-700'}>
                      예
                    </span>
                  </label>
                </div>
                <p className={`text-xs mt-2 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                  13세 이하를 대상으로 제작된 콘텐츠인지 선택해주세요.
                </p>
              </div>
            </>
          )}

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
              disabled={
                publish_form.platforms.length === 0 || 
                !publish_form.title.trim() ||
                (publish_form.platforms.includes('reddit') && !publish_form.subreddit.trim())
              }
              className="flex-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 text-gray-800 dark:text-white rounded-xl disabled:opacity-50"
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