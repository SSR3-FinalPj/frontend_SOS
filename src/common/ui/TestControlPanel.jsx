/**
 * 테스트 컨트롤 패널 컴포넌트
 * 개발 환경에서 영상 생성, 미리보기, 업로드, 수정 기능을 테스트할 수 있는 UI
 */

import React, { useState } from 'react';
import { Button } from '@/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/ui/card';
import { Badge } from '@/common/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  Eye, 
  Wand2, 
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TestTube
} from 'lucide-react';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';
import { use_content_modals } from '@/features/content-modals/logic/use-content-modals';
import { generateTestVideoData } from '@/common/utils/test-data-generator';
import { 
  runVideoCreationScenario, 
  runPreviewScenario, 
  runUploadScenario, 
  runEditScenario,
  runFullWorkflowScenario,
  runErrorScenarios,
  logScenarioResult
} from '@/common/utils/test-scenarios';

const TestControlPanel = ({ dark_mode = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState('youtube');
  
  const {
    pending_videos,
    folders,
    add_pending_video,
    transition_to_ready,
    transition_to_uploaded,
    transition_to_failed,
    simulate_upload,
    select_video
  } = use_content_launch();

  const {
    preview_modal,
    open_preview_modal,
    close_preview_modal
  } = use_content_modals();

  // 테스트 영상 생성 (PROCESSING 상태)
  const handleCreateTestVideo = () => {
    const testData = generateTestVideoData('PROCESSING', selectedTestType);
    add_pending_video(testData, new Date().toISOString().split('T')[0]);
  };

  // 상태 전환 테스트
  const handleStatusTransition = (video, newStatus) => {
    const videoId = video.video_id || video.temp_id || video.id;
    
    switch(newStatus) {
      case 'ready':
        transition_to_ready(videoId);
        break;
      case 'uploaded':
        transition_to_uploaded(videoId);
        break;
      case 'failed':
        transition_to_failed(videoId);
        break;
    }
  };

  // 다양한 상태의 테스트 데이터 일괄 생성
  const handleCreateFullTestSet = () => {
    const statuses = ['PROCESSING', 'ready', 'uploaded', 'failed'];
    const platforms = ['youtube', 'reddit'];
    
    statuses.forEach(status => {
      platforms.forEach(platform => {
        const testData = generateTestVideoData(status, platform);
        add_pending_video(testData, new Date().toISOString().split('T')[0]);
      });
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PROCESSING': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle2 className="w-4 h-4" />;
      case 'uploaded': return <Upload className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <TestTube className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'uploaded': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
          size="sm"
        >
          <TestTube className="w-4 h-4 mr-2" />
          테스트 패널
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className={`${dark_mode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-xl`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TestTube className="w-5 h-5 text-orange-500" />
              테스트 컨트롤 패널
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 플랫폼 선택 */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${dark_mode ? 'text-gray-200' : 'text-gray-700'}`}>
              테스트 플랫폼
            </label>
            <div className="flex gap-2">
              <Button
                variant={selectedTestType === 'youtube' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTestType('youtube')}
              >
                YouTube
              </Button>
              <Button
                variant={selectedTestType === 'reddit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTestType('reddit')}
              >
                Reddit
              </Button>
            </div>
          </div>

          {/* 테스트 액션 버튼들 */}
          <div className="space-y-2">
            <Button
              onClick={handleCreateTestVideo}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 영상 생성 테스트
            </Button>

            <Button
              onClick={handleCreateFullTestSet}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <TestTube className="w-4 h-4 mr-2" />
              전체 테스트 세트 생성
            </Button>
          </div>

          {/* 시나리오 테스트 버튼들 */}
          <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <h5 className={`text-xs font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
              시나리오 테스트
            </h5>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={async () => {
                  const result = await runVideoCreationScenario(use_content_launch.getState());
                  logScenarioResult('영상 생성', result);
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Play className="w-3 h-3 mr-1" />
                생성
              </Button>
              
              <Button
                onClick={() => {
                  const result = runPreviewScenario(
                    use_content_launch.getState(), 
                    { open_preview_modal }
                  );
                  logScenarioResult('미리보기', result);
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                미리보기
              </Button>
              
              <Button
                onClick={async () => {
                  const result = await runUploadScenario(use_content_launch.getState());
                  logScenarioResult('업로드', result);
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Upload className="w-3 h-3 mr-1" />
                업로드
              </Button>
              
              <Button
                onClick={() => {
                  const result = runEditScenario(use_content_launch.getState());
                  logScenarioResult('수정', result);
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Wand2 className="w-3 h-3 mr-1" />
                수정
              </Button>
            </div>
            
            <Button
              onClick={async () => {
                const results = await runFullWorkflowScenario({
                  contentLaunchStore: use_content_launch.getState(),
                  previewModalStore: { open_preview_modal }
                });
                logScenarioResult('통합 워크플로우', results.overall);
              }}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              전체 플로우 테스트
            </Button>
            
            <Button
              onClick={() => {
                const result = runErrorScenarios(use_content_launch.getState());
                logScenarioResult('에러 시나리오', result);
              }}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              에러 상황 테스트
            </Button>
          </div>

          {/* 현재 상태 표시 */}
          <div>
            <h4 className={`text-sm font-medium mb-2 ${dark_mode ? 'text-gray-200' : 'text-gray-700'}`}>
              현재 영상 상태 ({pending_videos.length}개)
            </h4>
            
            {pending_videos.length === 0 ? (
              <p className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-500'}`}>
                테스트 영상이 없습니다
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pending_videos.slice(0, 5).map((video, index) => (
                  <div 
                    key={video.temp_id || video.id || index}
                    className={`p-2 rounded-lg border ${dark_mode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getStatusColor(video.status)}>
                        {getStatusIcon(video.status)}
                        <span className="ml-1 text-xs">{video.status}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {video.platform || 'YouTube'}
                      </Badge>
                    </div>
                    
                    <p className={`text-xs truncate mb-2 ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {video.title}
                    </p>

                    {/* 상태 전환 버튼들 */}
                    <div className="flex gap-1">
                      {video.status === 'PROCESSING' && (
                        <Button
                          size="xs"
                          onClick={() => handleStatusTransition(video, 'ready')}
                          className="text-xs px-2 py-1 h-6"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          완료
                        </Button>
                      )}
                      
                      {video.status === 'ready' && (
                        <>
                          <Button
                            size="xs"
                            onClick={() => handleStatusTransition(video, 'uploaded')}
                            className="text-xs px-2 py-1 h-6"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            업로드
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => select_video(video)}
                            className="text-xs px-2 py-1 h-6"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </>
                      )}

                      {video.status === 'uploaded' && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => select_video(video)}
                          className="text-xs px-2 py-1 h-6"
                        >
                          <Wand2 className="w-3 h-3 mr-1" />
                          수정
                        </Button>
                      )}

                      {(video.status === 'PROCESSING' || video.status === 'ready') && (
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => handleStatusTransition(video, 'failed')}
                          className="text-xs px-2 py-1 h-6"
                        >
                          <AlertTriangle className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {pending_videos.length > 5 && (
                  <p className={`text-xs text-center ${dark_mode ? 'text-gray-400' : 'text-gray-500'}`}>
                    +{pending_videos.length - 5}개 더...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 폴더 상태 정보 */}
          <div>
            <p className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-500'}`}>
              총 {folders.length}개 폴더 • 개발 모드 전용
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestControlPanel;