import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { 
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronRight, 
  Upload, 
  Play, 
  FileText, 
  Image, 
  Calendar,
  Clock,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  CheckCircle2,
  Loader2,
  X,
  Volume2,
  Pause,
  SkipBack,
  SkipForward,
  Settings,
  Hash,
  Globe
} from "lucide-react";

export function ContentLaunchPage({ dark_mode }) {
  const [open_folders, set_open_folders] = useState(['2024-12-13']);
  const [uploading_items, set_uploading_items] = useState([]);
  
  // 모달 상태
  const [preview_modal, set_preview_modal] = useState({
    open: false,
    item: null
  });
  const [publish_modal, set_publish_modal] = useState({
    open: false,
    item: null
  });
  
  // 게시물 작성 상태
  const [publish_form, set_publish_form] = useState({
    platforms: [] ,
    title: '',
    description: '',
    tags: '',
    scheduled_time: ''
  });

  // 날짜별로 그룹화된 AI 생성 콘텐츠 데이터
  const date_folders = [
    {
      date: '2024-12-13',
      display_date: '2024년 12월 13일',
      item_count: 5,
      items: [
        {
          id: '1',
          title: 'AI 분석: 연말 파티 준비 완벽 가이드',
          type: 'video',
          platform: 'youtube',
          status: 'ready',
          engagement_score: 94,
          estimated_views: 15200,
          created_at: '09:15',
          description: '2024년을 마무리하는 완벽한 연말 파티를 위한 단계별 가이드입니다. 예산 계획부터 장소 선정, 음식 준비, 데코레이션까지 모든 것을 다룹니다.',
          video_url: '/video-sample.mp4'
        },
        {
          id: '2',
          title: '2024년 트렌드 총정리: 무엇이 바뀌었나?',
          type: 'text',
          platform: 'reddit',
          status: 'ready',
          engagement_score: 87,
          estimated_views: 3400,
          created_at: '11:30',
          description: '올해 가장 주목받은 기술, 문화, 사회적 트렌드들을 분석하고 2025년 전망을 제시합니다.'
        },
        {
          id: '3',
          title: '파티 데코레이션 아이디어 인포그래픽',
          type: 'image',
          platform: 'instagram',
          status: 'ready',
          engagement_score: 91,
          estimated_views: 8900,
          created_at: '14:20',
          description: '예산별, 테마별 파티 데코레이션 아이디어를 시각적으로 정리한 인포그래픽입니다.'
        },
        {
          id: '4',
          title: '효과적인 썸네일 제작 방법론',
          type: 'video',
          platform: 'youtube',
          status: 'uploaded',
          engagement_score: 89,
          estimated_views: 12100,
          created_at: '16:45',
          description: '클릭률을 높이는 썸네일 디자인의 핵심 원리와 실전 팁을 공개합니다.',
          video_url: '/video-sample2.mp4'
        },
        {
          id: '5',
          title: '브랜딩 전략: 색상 심리학 활용법',
          type: 'text',
          platform: 'reddit',
          status: 'ready',
          engagement_score: 85,
          estimated_views: 2800,
          created_at: '18:10',
          description: '브랜드 아이덴티티 구축에서 색상이 미치는 심리적 영향과 전략적 활용 방법을 분석합니다.'
        }
      ]
    },
    {
      date: '2024-12-12',
      display_date: '2024년 12월 12일',
      item_count: 3,
      items: [
        {
          id: '6',
          title: '소셜미디어 최적화 전략 영상',
          type: 'video',
          platform: 'youtube',
          status: 'ready',
          engagement_score: 92,
          estimated_views: 18500,
          created_at: '10:30',
          description: '각 플랫폼별 알고리즘 특성을 이해하고 콘텐츠 최적화하는 방법을 설명합니다.',
          video_url: '/video-sample3.mp4'
        },
        {
          id: '7',
          title: '커뮤니티 참여도 높이는 방법',
          type: 'text',
          platform: 'reddit',
          status: 'ready',
          engagement_score: 88,
          estimated_views: 4200,
          created_at: '15:20',
          description: '온라인 커뮤니티에서 의미있는 토론을 이끌어내고 참여도를 높이는 전략을 공유합니다.'
        },
        {
          id: '8',
          title: '비주얼 콘텐츠 디자인 가이드',
          type: 'image',
          platform: 'instagram',
          status: 'uploaded',
          engagement_score: 86,
          estimated_views: 7300,
          created_at: '17:45',
          description: '인스타그램에서 주목받는 비주얼 콘텐츠의 디자인 원칙과 트렌드를 정리했습니다.'
        }
      ]
    }
  ];

  const toggle_folder = (date) => {
    set_open_folders(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handle_preview = (item) => {
    set_preview_modal({ open: true, item });
  };

  const handle_publish = (item) => {
    set_publish_form({
      platforms: [item.platform],
      title: item.title,
      description: item.description || '',
      tags: '',
      scheduled_time: ''
    });
    set_publish_modal({ open: true, item });
  };

  const handle_final_publish = async () => {
    if (!publish_modal.item) return;
    
    set_uploading_items(prev => [...prev, publish_modal.item.id]);
    set_publish_modal({ open: false, item: null });
    
    // 업로드 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    set_uploading_items(prev => prev.filter(id => id !== publish_modal.item.id));
    console.log('Published:', publish_form);
  };

  const toggle_platform = (platform) => {
    set_publish_form(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const get_type_icon = (type) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const get_platform_color = (platform) => {
    switch (platform) {
      case 'youtube': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'reddit': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'instagram': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const get_platform_icon = (platform) => {
    switch (platform) {
      case 'youtube': return <Play className="h-5 w-5" />;
      case 'reddit': return <MessageSquare className="h-5 w-5" />;
      case 'instagram': return <Image className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  const get_status_icon = (status, item_id) => {
    if (uploading_items.includes(item_id)) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    switch (status) {
      case 'uploaded': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'ready': return <Upload className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className={`flex-1 ${
      dark_mode 
        ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/40 to-gray-900/80' 
        : 'bg-gradient-to-br from-indigo-50/80 via-white/40 to-cyan-50/80'
    } h-full overflow-hidden flex flex-col relative`}>
      
      {/* 강화된 배경 패턴 */}
      <div className={`absolute inset-0 ${
        dark_mode 
          ? 'bg-[radial-gradient(circle_at_15%_25%,rgba(99,102,241,0.03)_0%,transparent_40%),radial-gradient(circle_at_85%_75%,rgba(168,85,247,0.02)_0%,transparent_40%),radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.02)_0%,transparent_60%)]'
          : 'bg-[radial-gradient(circle_at_15%_25%,rgba(99,102,241,0.08)_0%,transparent_40%),radial-gradient(circle_at_85%_75%,rgba(168,85,247,0.06)_0%,transparent_40%),radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.04)_0%,transparent_60%)]'
      } pointer-events-none`} />

      {/* 날짜별 폴더 목록 */}
      <div className="flex-1 overflow-auto px-8 py-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 통계 정보 */}
          <div className="flex items-center justify-end gap-4 mb-6">
            <div className={`${
              dark_mode 
                ? 'bg-gray-800/60 border-gray-600/60' 
                : 'bg-white/60 border-white/60'
            } backdrop-blur-sm rounded-xl px-4 py-2 border`}>
              <div className="text-center">
                <div className={`text-lg font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
                  {date_folders.reduce((sum, folder) => sum + folder.item_count, 0)}
                </div>
                <div className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>총 콘텐츠</div>
              </div>
            </div>
            
            <div className={`${
              dark_mode 
                ? 'bg-gray-800/60 border-gray-600/60' 
                : 'bg-white/60 border-white/60'
            } backdrop-blur-sm rounded-xl px-4 py-2 border`}>
              <div className="text-center">
                <div className={`text-lg font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
                  {date_folders.length}
                </div>
                <div className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>폴더</div>
              </div>
            </div>
          </div>
          {date_folders.map((folder) => (
            <Collapsible
              key={folder.date}
              open={open_folders.includes(folder.date)}
              onOpenChange={() => toggle_folder(folder.date)}
            >
              <Card className={`${
                dark_mode 
                  ? 'bg-gray-800/50 border-gray-600/60 hover:bg-gray-700/60' 
                  : 'bg-white/50 border-white/60 hover:bg-white/80'
              } backdrop-blur-2xl shadow-xl rounded-3xl overflow-hidden transition-all duration-300`}>
                
                {/* 폴더 헤더 */}
                <CollapsibleTrigger className="w-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {open_folders.includes(folder.date) ? (
                            <FolderOpen className={`h-6 w-6 ${dark_mode ? 'text-blue-400' : 'text-blue-600'}`} />
                          ) : (
                            <Folder className={`h-6 w-6 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`} />
                          )}
                          {open_folders.includes(folder.date) ? (
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
                          dark_mode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                        } rounded-full px-3 py-1`}>
                          {folder.items.filter(item => item.status === 'ready').length}개 론칭 대기
                        </Badge>
                        
                        <Badge className={`${
                          dark_mode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                        } rounded-full px-3 py-1`}>
                          {folder.items.filter(item => item.status === 'uploaded').length}개 완료
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleTrigger>

                {/* 폴더 내용 (3열 그리드) */}
                <CollapsibleContent className="transition-all duration-300 ease-in-out">
                  <div className={`px-6 pb-6 border-t ${
                    dark_mode ? 'border-gray-600/30' : 'border-gray-300/30'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                      {folder.items.map((item) => (
                        <Card key={item.id} className={`${
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
                              onClick={() => handle_preview(item)}
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
                                        {get_status_icon(item.status, item.id)}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {item.status === 'ready' && '론칭 준비됨'}
                                        {item.status === 'uploading' && '업로드 중'}
                                        {item.status === 'uploaded' && '업로드 완료'}
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
                                    handle_publish(item);
                                  }}
                                  disabled={uploading_items.includes(item.id)}
                                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 group-hover:scale-105"
                                >
                                  {uploading_items.includes(item.id) ? (
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
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* 동영상 미리보기 모달 */}
      <Dialog open={preview_modal.open} onOpenChange={(open) => set_preview_modal({open, item: null})}>
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
                {preview_modal.item?.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${get_platform_color(preview_modal.item?.platform || '')} rounded-full px-3 py-1`}>
                  {preview_modal.item?.platform}
                </Badge>
                <span className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {preview_modal.item?.type === 'video' ? '비디오' : 
                   preview_modal.item?.type === 'image' ? '이미지' : '텍스트'}
                </span>
              </div>
            </div>

            {/* 미디어 플레이어 */}
            <div className="flex-1 p-6">
              {preview_modal.item?.type === 'video' ? (
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
              ) : preview_modal.item?.type === 'image' ? (
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
                      {preview_modal.item?.description}
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
                      예상 참여율: {preview_modal.item?.engagement_score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className={`text-sm ${dark_mode ? 'text-gray-300' : 'text-gray-700'}`}>
                      예상 조회수: {preview_modal.item?.estimated_views.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => set_preview_modal({open: false, item: null})}
                    className={`${
                      dark_mode ? 'border-gray-600/60 hover:bg-gray-700/60' : 'border-gray-300/60 hover:bg-gray-100'
                    } rounded-xl`}
                  >
                    닫기
                  </Button>
                  {preview_modal.item?.status === 'ready' && (
                    <Button 
                      onClick={() => {
                        set_preview_modal({open: false, item: null});
                        handle_publish(preview_modal.item);
                      }}
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

      {/* 게시물 생성 모달 */}
      <Dialog open={publish_modal.open} onOpenChange={(open) => set_publish_modal({open, item: null})}>
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
                {['youtube', 'reddit', 'instagram'].map((platform) => (
                  <Button
                    key={platform}
                    variant={publish_form.platforms.includes(platform) ? "default" : "outline"}
                    onClick={() => toggle_platform(platform)}
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
                  {get_type_icon(publish_modal.item?.type || 'text')}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${dark_mode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {publish_modal.item?.title}
                  </h3>
                  <p className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                    {publish_modal.item?.description}
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
                onChange={(e) => set_publish_form(prev => ({...prev, title: e.target.value}))}
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
                onChange={(e) => set_publish_form(prev => ({...prev, description: e.target.value}))}
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
                onChange={(e) => set_publish_form(prev => ({...prev, tags: e.target.value}))}
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
                onClick={() => set_publish_modal({open: false, item: null})}
                className={`flex-1 ${
                  dark_mode ? 'border-gray-600/60 hover:bg-gray-700/60' : 'border-gray-300/60 hover:bg-gray-100'
                } rounded-xl`}
              >
                취소
              </Button>
              
              <Button
                onClick={handle_final_publish}
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
    </div>
  );
}