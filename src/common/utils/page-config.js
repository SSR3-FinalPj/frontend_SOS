export const get_page_title = (current_page) => {
  switch (current_page) {
    case 'dashboard':
      return '플랫폼 성과 분석';
    case 'content-launch':
      return 'AI 콘텐츠 론칭';
    case 'content-list':
      return '콘텐츠 목록';
    case 'analytics':
      return '상세 분석';
    case 'preferences':
      return '환경설정';
    default:
      return '콘텐츠 목록';
  }
};

export const get_page_description = (current_page) => {
  switch (current_page) {
    case 'dashboard':
      return 'YouTube와 Reddit의 핵심 지표와 트렌드를 실시간으로 비교하세요';
    case 'content-launch':
      return 'AI가 생성한 미디어 콘텐츠를 검토하고 플랫폼에 론칭하세요';
    case 'content-list':
      return '모든 플랫폼의 콘텐츠를 통합 관리하고 성과를 추적하세요';
    case 'analytics':
      return '플랫폼별 상세 데이터와 심화 분석으로 성과를 극대화하세요';
    case 'preferences':
      return '서비스 환경을 개인화하고 데이터를 안전하게 관리하세요';
    default:
      return '모든 플랫폼의 콘텐츠를 통합 관리하고 성과를 추적하세요';
  }
};