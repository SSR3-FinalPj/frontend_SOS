import ErrorLayout from '../blocks/ErrorLayout';
import NotFoundView from '../blocks/NotFoundView';

/**
 * NotFoundPage 컴포넌트
 * 404 에러 페이지를 위한 레이아웃과 뷰 조립
 */
const NotFoundPage = () => (
  <ErrorLayout>
    <NotFoundView />
  </ErrorLayout>
);

export default NotFoundPage;