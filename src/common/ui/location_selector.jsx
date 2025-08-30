/**
 * 위치 선택 컴포넌트
 * 서울 구 선택, 명소 검색, 위치 선택 기능을 제공
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  SEOUL_DISTRICTS, 
  get_locations_by_district, 
  search_locations 
} from '../constants/locationData.js';

/**
 * LocationSelector 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object|null} props.selected_location - 선택된 위치 객체
 * @param {Function} props.on_location_select - 위치 선택 콜백 함수
 * @returns {JSX.Element} LocationSelector 컴포넌트
 */
const LocationSelector = ({ selected_location, on_location_select }) => {
  // 상태 관리
  const [selected_district, set_selected_district] = useState('');
  const [search_term, set_search_term] = useState('');
  const [is_district_dropdown_open, set_is_district_dropdown_open] = useState(false);

  // 구별 명소 목록 가져오기
  const district_locations = selected_district ? get_locations_by_district(selected_district) : [];
  
  // 통합 검색 결과 (구 이름 + 명소 이름)
  const search_results = useMemo(() => {
    if (!search_term) return [];
    
    const results = [];
    const search_lower = search_term.toLowerCase();
    
    // 구 이름으로 검색
    const matching_districts = SEOUL_DISTRICTS.filter(district => 
      district.toLowerCase().includes(search_lower)
    );
    
    // 매칭된 구의 모든 명소들 추가
    matching_districts.forEach(district => {
      const locations = get_locations_by_district(district);
      results.push(...locations.map(location => ({
        ...location,
        match_type: 'district' // 구 이름으로 매칭됨을 표시
      })));
    });
    
    // 명소 이름으로 검색 (기존 기능)
    const location_results = search_locations(search_term).map(location => ({
      ...location,
      match_type: 'location' // 명소 이름으로 매칭됨을 표시
    }));
    
    results.push(...location_results);
    
    // 중복 제거 (poi_id 기준)
    const unique_results = results.filter((result, index, self) => 
      index === self.findIndex(r => r.poi_id === result.poi_id)
    );
    
    return unique_results;
  }, [search_term]);

  // 구 선택 핸들러
  const handle_district_select = useCallback((district) => {
    set_selected_district(district);
    set_search_term('');
    set_is_district_dropdown_open(false);
    // 구 선택 시 선택된 위치 초기화
    if (selected_location) {
      on_location_select(null);
    }
  }, [selected_location, on_location_select]);
  
  // 드롭다운 토글 핸들러
  const toggle_district_dropdown = useCallback(() => {
    set_is_district_dropdown_open(prev => !prev);
  }, []);

  // 명소 선택 핸들러
  const handle_location_select = useCallback((location) => {
    on_location_select(location);
    set_search_term('');
    set_selected_district(location.district);
    set_is_district_dropdown_open(false);
  }, [on_location_select]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
          위치 선택
        </h3>
      </div>

      {/* 검색 입력 */}
      <div className="relative">
        <input
          type="text"
          placeholder="구 이름 또는 명소를 검색하세요 (예: 강남구, 서울역)"
          value={search_term}
          onChange={(e) => {
            set_search_term(e.target.value);
            set_is_district_dropdown_open(false);
          }}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
        />
      </div>

      {/* 검색 결과 또는 구별 선택 */}
      {search_term ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">검색 결과 ({search_results.length}개)</p>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {search_results.map((location) => (
              <button
                key={location.poi_id}
                onClick={() => handle_location_select(location)}
                className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 ${
                  selected_location?.poi_id === location.poi_id
                    ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-50 dark:bg-gray-700 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{location.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {location.district}
                    </span>
                  </div>
                  {location.match_type === 'district' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      구 매칭
                    </span>
                  )}
                </div>
              </button>
            ))}
            {search_results.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                "<span className="font-medium">{search_term}</span>"에 대한 검색 결과가 없습니다.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* 구 선택 드롭다운 */}
          <p className="text-sm text-gray-600 dark:text-gray-400">구 선택</p>
          
          <div className="relative">
            <button
              onClick={toggle_district_dropdown}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <span className={selected_district ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                {selected_district || '구를 선택하세요'}
              </span>
              {is_district_dropdown_open ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {/* 드롭다운 메뉴 */}
            <AnimatePresence>
              {is_district_dropdown_open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  <div className="max-h-64 overflow-y-auto py-1">
                    {SEOUL_DISTRICTS.map((district) => (
                      <button
                        key={district}
                        onClick={() => handle_district_select(district)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${
                          selected_district === district
                            ? 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-l-4 border-blue-500'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {district}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 선택된 구의 명소 목록 */}
          {selected_district && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selected_district} 명소
                </p>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {district_locations.length}개
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {district_locations.map((location) => (
                  <button
                    key={location.poi_id}
                    onClick={() => handle_location_select(location)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      selected_location?.poi_id === location.poi_id
                        ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-700 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <span className="font-medium">{location.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 선택된 위치 표시 */}
      {selected_location && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-medium">선택된 위치:</span> {selected_location.name} ({selected_location.district})
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;