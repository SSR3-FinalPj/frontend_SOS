/**
 * ContentFolderCard 컴포넌트
 * 날짜별 콘텐츠 폴더를 표시하는 카드
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { 
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronRight, 
  Calendar 
} from 'lucide-react';
import ContentItemCard from './content_item_card';

/**
 * ContentFolderCard 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.folder - 폴더 객체
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @param {boolean} props.is_open - 폴더 열림 상태
 * @param {Array} props.uploading_items - 업로드 중인 아이템 목록
 * @param {Function} props.on_toggle - 폴더 토글 핸들러
 * @param {Function} props.on_preview - 미리보기 클릭 핸들러
 * @param {Function} props.on_publish - 게시 클릭 핸들러
 * @returns {JSX.Element} ContentFolderCard 컴포넌트
 */
const ContentFolderCard = ({ 
  folder, 
  dark_mode, 
  is_open, 
  uploading_items,
  on_toggle, 
  on_preview, 
  on_publish 
}) => {
  return (
    <Collapsible
      open={is_open}
      onOpenChange={on_toggle}
    >
      <Card className={`${
        dark_mode 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      } shadow-xl rounded-3xl overflow-hidden transition-all duration-300`}>
        
        {/* 폴더 헤더 */}
        <CollapsibleTrigger className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {is_open ? (
                    <FolderOpen className={`h-6 w-6 ${dark_mode ? 'text-gray-300' : 'text-gray-700'}`} />
                  ) : (
                    <Folder className={`h-6 w-6 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                  {is_open ? (
                    <ChevronDown className={`h-5 w-5 ${dark_mode ? 'text-gray-400' : 'text-gray-600'} transition-transform duration-200`} />
                  ) : (
                    <ChevronRight className={`h-5 w-5 ${dark_mode ? 'text-gray-400' : 'text-gray-600'} transition-transform duration-200`} />
                  )}
                </div>
                
                <div className="text-left">
                  <h3 className={`text-lg font-semibold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
                    {folder.display_date}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className={`h-4 w-4 ${dark_mode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {folder.item_count}개 항목
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={`${
                  dark_mode ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                } rounded-full px-3 py-1`}>
                  {folder.items.filter(item => item.status === 'ready').length}개 론칭 대기
                </Badge>
                
                <Badge className={`${
                  dark_mode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                } rounded-full px-3 py-1`}>
                  {folder.items.filter(item => item.status === 'uploaded').length}개 완료
                </Badge>
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>

        {/* 폴더 내용 (3열 그리드) */}
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-1 data-[state=open]:slide-down-1 duration-300 ease-out">
          <div className={`px-6 pb-6 border-t ${
            dark_mode ? 'border-gray-600/30' : 'border-gray-300/30'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {folder.items.map((item) => (
                <ContentItemCard
                  key={item.id}
                  item={item}
                  dark_mode={dark_mode}
                  uploading_items={uploading_items}
                  on_preview={on_preview}
                  on_publish={on_publish}
                />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default React.memo(ContentFolderCard);