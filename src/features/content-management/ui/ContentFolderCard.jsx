/**
 * ContentFolderCard 컴포넌트
 * 날짜별 콘텐츠 폴더를 표시하는 카드
 */

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Badge } from '@/common/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/common/ui/collapsible';
import { 
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronRight, 
  Calendar 
} from 'lucide-react';
import ContentItemCard from '@/features/content-management/ui/ContentItemCard';

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
  on_publish,
  selected_video_id,
  on_video_select
}) => {
  const versionGroups = useMemo(() => {
    if (!folder?.items || folder.items.length === 0) return [];

    const toNumericVersion = (version) => {
      if (!version) return 1000; // 기본값: v1.0
      const [majorStr, minorStr] = version.split('.');
      const major = parseInt(majorStr, 10) || 1;
      const minor = parseInt(minorStr, 10) || 0;
      return major * 1000 + minor;
    };

    const map = new Map();
    folder.items.forEach((item) => {
      const versionValue = item?.version || (typeof item?.version_depth === 'number' ? (item.version_depth === 0 ? '1.0' : `1.${item.version_depth}`) : '1.0');
      if (!map.has(versionValue)) {
        map.set(versionValue, []);
      }
      map.get(versionValue).push(item);
    });

    return Array.from(map.entries())
      .map(([version, items]) => ({
        version,
        label: `v${version}`,
        items: items.sort((a, b) => {
          const aTime = new Date(a.createdAt || a.creationTime || a.created_at || 0).getTime();
          const bTime = new Date(b.createdAt || b.creationTime || b.created_at || 0).getTime();
          return bTime - aTime;
        }),
        readyCount: items.filter((i) => (i.status || '').toLowerCase() === 'ready' || i.status === 'READY_TO_LAUNCH').length,
        uploadedCount: items.filter((i) => (i.status || '').toLowerCase() === 'uploaded').length,
      }))
      .sort((a, b) => toNumericVersion(a.version) - toNumericVersion(b.version));
  }, [folder.items]);

  return (
    <Collapsible
      open={is_open}
      onOpenChange={on_toggle}
    >
      <Card className={`${
        dark_mode 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      } rounded-3xl overflow-hidden transition-colors duration-300`}>
        
        {/* 폴더 헤더 */}
        <CollapsibleTrigger className={`w-full shadow-lg hover:shadow-xl transition-shadow duration-300 ${
          is_open ? 'rounded-t-3xl' : 'rounded-3xl'
        }`}>
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
                {(() => {
                  const ready_count = folder.items.filter(item => item.status === 'ready').length;
                  const uploaded_count = folder.items.filter(item => item.status === 'uploaded').length;
                  
                  return (
                    <>
                      <Badge className={`${
                        dark_mode ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                      } rounded-full px-3 py-1`}>
                        {ready_count}개 론칭 대기
                      </Badge>
                      
                      <Badge className={`${
                        dark_mode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                      } rounded-full px-3 py-1`}>
                        {uploaded_count}개 완료
                      </Badge>
                    </>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>

        {/* 폴더 내용 - 버전 그룹 단위로 렌더링 */}
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300 ease-out rounded-b-3xl">
          <div className={`px-6 pb-6 border-t ${
            dark_mode ? 'border-gray-600/30' : 'border-gray-300/30'
          }`}>
            <div className="flex flex-col gap-6 pt-6">
              {versionGroups.map((group) => (
                <div
                  key={group.version}
                  className={`${dark_mode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/70 border-gray-200/70'} border rounded-2xl p-5 transition-colors`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className={`text-lg font-semibold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
                        {group.label}
                      </h4>
                      <p className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {group.items.length}개 영상 묶음
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${dark_mode ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700'} rounded-full px-3 py-1`}>
                        {group.readyCount}개 론칭 대기
                      </Badge>
                      <Badge className={`${dark_mode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'} rounded-full px-3 py-1`}>
                        {group.uploadedCount}개 완료
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.items.map((item) => (
                      <ContentItemCard
                        key={item.id || item.temp_id}
                        item={{ ...item, version: item.version || group.version }}
                        dark_mode={dark_mode}
                        uploading_items={uploading_items}
                        on_preview={on_preview}
                        on_publish={on_publish}
                        selected_video_id={selected_video_id}
                        on_video_select={on_video_select}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default React.memo(ContentFolderCard);
