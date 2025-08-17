/**
 * ContentPublishModal 컴포넌트
 * 콘텐츠 게시 모달
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Upload } from 'lucide-react';
import { 
  get_type_icon, 
  get_platform_icon, 
  get_platform_list 
} from '../../utils/content_launch_utils.jsx';

/**
 * ContentPublishModal 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.is_open - 모달 열림 상태
 * @param {Object} props.item - 게시할 아이템
 * @param {Object} props.publish_form - 게시 폼 데이터
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @param {Function} props.on_close - 모달 닫기 핸들러
 * @param {Function} props.on_publish - 게시 완료 핸들러
 * @param {Function} props.on_toggle_platform - 플랫폼 토글 핸들러
 * @param {Function} props.on_update_form - 폼 업데이트 핸들러
 * @returns {JSX.Element} ContentPublishModal 컴포넌트
 */
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

  const platform_list = get_platform_list();

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent className={`max-w-2xl ${
        dark_mode 
          ? 'bg-gray-900/95 border-gray-700/60' 
          : 'bg-white/95 border-white/60'
      } backdrop-blur-2xl rounded-3xl`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-semibold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
            게시물 생성
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 플랫폼 선택 */}
          <div>
            <label className={`text-sm font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-700'} mb-3 block`}>
              게시할 플랫폼 선택
            </label>
            <div className="flex items-center gap-3">
              {platform_list.map((platform) => (
                <Button
                  key={platform}
                  variant={publish_form.platforms.includes(platform) ? "default" : "outline"}
                  onClick={() => on_toggle_platform(platform)}
                  className={`rounded-2xl px-4 py-3 flex items-center gap-2 ${
                    publish_form.platforms.includes(platform)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : dark_mode 
                        ? 'border-gray-600/60 hover:bg-gray-700/60' 
                        : 'border-gray-300/60 hover:bg-gray-100'
                  }`}
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
              } rounded-xl flex items-center justify-center`}>
                {get_type_icon(item.type)}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${dark_mode ? 'text-white' : 'text-gray-900'} mb-1`}>
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
              } backdrop-blur-sm rounded-xl min-h-[120px]`}
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
          <div className="flex items-center gap-3 pt-4">
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
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
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