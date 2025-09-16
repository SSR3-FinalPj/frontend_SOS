// /**
//  * SearchModal 컴포넌트
//  * 통합 분석을 위한 콘텐츠 검색 모달
//  */

// import React, { useState, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Search,
//   Play, 
//   MessageSquare,
//   X,
//   Clock
// } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/common/ui/dialog';
// import { Input } from '@/common/ui/input';

// const SearchModal = ({ 
//   isOpen, 
//   onClose, 
//   onSelectContent, 
//   contentList = [] 
// }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedQuery, setDebouncedQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(-1);

//   // 디바운싱 구현
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedQuery(searchQuery);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // 토큰화된 스마트 검색 로직
//   const tokenizeSearchQuery = useCallback((query) => {
//     if (!query || query.length < 2) return [];
    
//     // 한글 자음/모음 분해 및 토큰화
//     const tokens = [];
//     const cleanQuery = query.toLowerCase().trim();
    
//     // 전체 문자열 토큰
//     tokens.push(cleanQuery);
    
//     // 공백으로 분리된 개별 단어들
//     const words = cleanQuery.split(/\s+/).filter(word => word.length >= 2);
//     tokens.push(...words);
    
//     return [...new Set(tokens)]; // 중복 제거
//   }, []);

//   // 검색 매칭 로직
//   const matchContent = useCallback((content, tokens) => {
//     if (tokens.length === 0) return false;
    
//     const searchText = content.title.toLowerCase();
    
//     return tokens.some(token => {
//       // 부분 문자열 매칭
//       if (searchText.includes(token)) return true;
      
//       // 초성 검색 지원 (간단한 버전)
//       const initials = searchText.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
//       if (initials.includes(token)) return true;
      
//       return false;
//     });
//   }, []);

//   // 검색 실행
//   useEffect(() => {
//     if (debouncedQuery.length < 2) {
//       setSearchResults([]);
//       return;
//     }

//     const tokens = tokenizeSearchQuery(debouncedQuery);
//     const filtered = contentList.filter(content => 
//       matchContent(content, tokens)
//     );

//     // 관련성 순으로 정렬 (제목에 완전 포함된 것이 우선)
//     filtered.sort((a, b) => {
//       const aTitle = a.title.toLowerCase();
//       const bTitle = b.title.toLowerCase();
//       const query = debouncedQuery.toLowerCase();
      
//       if (aTitle.includes(query) && !bTitle.includes(query)) return -1;
//       if (!aTitle.includes(query) && bTitle.includes(query)) return 1;
//       return 0;
//     });

//     setSearchResults(filtered);
//   }, [debouncedQuery, contentList, tokenizeSearchQuery, matchContent]);

//   // 콘텐츠 선택 처리
//   const handleSelectContent = (content) => {
//     onSelectContent(content);
    
//     // 최근 검색어에 추가
//     const newRecentSearch = {
//       id: content.id,
//       title: content.title,
//       timestamp: Date.now()
//     };
    
//     setRecentSearches(prev => {
//       const filtered = prev.filter(item => item.id !== content.id);
//       return [newRecentSearch, ...filtered].slice(0, 5); // 최대 5개만 저장
//     });
    
//     onClose();
//     setSearchQuery('');
//   };

//   // 키보드 네비게이션 처리
//   const handleKeyDown = useCallback((e) => {
//     if (!isOpen) return;
    
//     const currentResults = debouncedQuery.length >= 2 ? searchResults : recentSearches;
    
//     switch (e.key) {
//       case 'ArrowDown':
//         e.preventDefault();
//         setSelectedIndex(prev => 
//           prev < currentResults.length - 1 ? prev + 1 : 0
//         );
//         break;
//       case 'ArrowUp':
//         e.preventDefault();
//         setSelectedIndex(prev => 
//           prev > 0 ? prev - 1 : currentResults.length - 1
//         );
//         break;
//       case 'Enter':
//         e.preventDefault();
//         if (selectedIndex >= 0 && currentResults[selectedIndex]) {
//           const selectedItem = currentResults[selectedIndex];
//           if (debouncedQuery.length >= 2) {
//             // 검색 결과에서 선택
//             handleSelectContent(selectedItem);
//           } else {
//             // 최근 검색에서 선택
//             const content = contentList.find(c => c.id === selectedItem.id);
//             if (content) handleSelectContent(content);
//           }
//         }
//         break;
//       case 'Escape':
//         e.preventDefault();
//         handleClose();
//         break;
//     }
//   }, [isOpen, debouncedQuery, searchResults, recentSearches, selectedIndex, handleSelectContent, contentList]);

//   // 키보드 이벤트 리스너 추가
//   useEffect(() => {
//     if (isOpen) {
//       document.addEventListener('keydown', handleKeyDown);
//       return () => document.removeEventListener('keydown', handleKeyDown);
//     }
//   }, [isOpen, handleKeyDown]);

//   // 검색 결과가 변경되면 선택 인덱스 초기화
//   useEffect(() => {
//     setSelectedIndex(-1);
//   }, [searchResults, recentSearches, debouncedQuery]);

//   // 모달 닫기 처리
//   const handleClose = () => {
//     onClose();
//     setSearchQuery('');
//     setSearchResults([]);
//     setSelectedIndex(-1);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="max-w-2xl max-h-[80vh] bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-xl border border-gray-300/20 dark:border-gray-700/20 p-8 space-y-6">
//         <div className="flex flex-col h-full">
//           {/* 헤더 */}
//           <DialogHeader className="flex-shrink-0">
//             <div className="flex items-center justify-between">
//               <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
//                 콘텐츠 검색
//               </DialogTitle>
//               <button
//                 onClick={handleClose}
//                 className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//               </button>
//             </div>
//           </DialogHeader>

//           {/* 검색 입력 */}
//           <div className="flex-shrink-0 space-y-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
//               <Input
//                 type="text"
//                 placeholder="비교할 콘텐츠 제목을 검색해보세요... (최소 2자)"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-12 h-12 text-base bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-600/50 rounded-xl"
//                 autoFocus
//               />
//             </div>
            
//             {searchQuery.length > 0 && searchQuery.length < 2 && (
//               <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
//                 최소 2글자 이상 입력해주세요
//               </p>
//             )}
//           </div>

//           {/* 결과 영역 */}
//           <div className="flex-1 min-h-0 overflow-y-auto">
//             <AnimatePresence mode="wait">
//               {debouncedQuery.length >= 2 ? (
//                 // 검색 결과
//                 <motion.div
//                   key="search-results"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                   className="space-y-4"
//                 >
//                   {searchResults.length > 0 ? (
//                     <div className="space-y-2">
//                       <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                         검색 결과 ({searchResults.length}개)
//                       </h3>
//                       {searchResults.map((content, index) => (
//                         <motion.button
//                           key={content.id}
//                           onClick={() => handleSelectContent(content)}
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                           className={`w-full p-4 text-left border border-gray-200/50 dark:border-gray-600/50 rounded-xl transition-all duration-200 ${
//                             index === selectedIndex
//                               ? 'bg-blue-100/80 dark:bg-blue-900/40 border-blue-300/60 dark:border-blue-600/60 shadow-lg'
//                               : 'bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50/80 dark:hover:bg-gray-700/60 hover:shadow-md'
//                           }`}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex-1">
//                               <h4 className="font-medium text-gray-900 dark:text-white mb-1">
//                                 {content.title}
//                               </h4>
//                               <div className="text-xs text-gray-500 dark:text-gray-400">
//                                 게시일: {content.platforms.youtube.publishedAt} (YouTube)
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-3 ml-4">
//                               <div className="flex items-center gap-1">
//                                 <Play className="w-3 h-3 text-red-500" />
//                                 <span className="text-xs text-gray-500">YouTube</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <MessageSquare className="w-3 h-3 text-orange-500" />
//                                 <span className="text-xs text-gray-500">Reddit</span>
//                               </div>
//                             </div>
//                           </div>
//                         </motion.button>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-12">
//                       <div className="w-16 h-16 bg-gray-100/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
//                       </div>
//                       <p className="text-gray-500 dark:text-gray-400 text-lg">
//                         "{debouncedQuery}"에 대한 검색 결과가 없습니다
//                       </p>
//                     </div>
//                   )}
//                 </motion.div>
//               ) : (
//                 // 최근 검색 또는 초기 상태
//                 <motion.div
//                   key="recent-searches"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                   className="space-y-4"
//                 >
//                   {recentSearches.length > 0 ? (
//                     <div className="space-y-2">
//                       <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                         최근 검색한 콘텐츠
//                       </h3>
//                       {recentSearches.map((item, index) => (
//                         <motion.button
//                           key={item.id}
//                           onClick={() => {
//                             const content = contentList.find(c => c.id === item.id);
//                             if (content) handleSelectContent(content);
//                           }}
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                           className={`w-full p-3 text-left border border-gray-200/50 dark:border-gray-600/50 rounded-xl transition-all duration-200 ${
//                             index === selectedIndex
//                               ? 'bg-blue-100/80 dark:bg-blue-900/40 border-blue-300/60 dark:border-blue-600/60 shadow-lg'
//                               : 'bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50/80 dark:hover:bg-gray-700/60 hover:shadow-md'
//                           }`}
//                         >
//                           <div className="flex items-center gap-3">
//                             <Clock className="w-4 h-4 text-gray-400" />
//                             <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
//                               {item.title}
//                             </span>
//                           </div>
//                         </motion.button>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-12">
//                       <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
//                         <Search className="w-10 h-10 text-blue-500 dark:text-blue-400" />
//                       </div>
//                       <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-3">
//                         콘텐츠 검색
//                       </h3>
//                       <p className="text-gray-500 dark:text-gray-400 mb-6">
//                         비교할 콘텐츠의 제목을 검색해보세요
//                       </p>
//                       <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
//                         <p>• 최소 2글자 이상 입력</p>
//                         <p>• 제목의 일부만 입력해도 검색 가능</p>
//                         <p>• 초성 검색 지원</p>
//                         <p>• ↑↓ 키로 선택, Enter로 확인, ESC로 닫기</p>
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default SearchModal;