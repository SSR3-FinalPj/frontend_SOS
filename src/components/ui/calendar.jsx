"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  generate_calendar_grid, 
  get_month_name_kr, 
  get_weekday_names_kr, 
  is_sunday,
  is_today 
} from '../../utils/calendar-utils.js';
import { cn } from "../../utils/ui_utils";

function Calendar({
  selected_date,
  on_date_select,
  selected_range = { from: null, to: null },
  on_range_select,
  mode = "range", // "single" | "range"
  className = "",
  show_lunar = false,
  on_apply,
  on_cancel,
  show_actions = true,
  ...props
}) {
  const [current_year, set_current_year] = useState(new Date().getFullYear());
  const [current_month, set_current_month] = useState(new Date().getMonth());
  const [temp_range, set_temp_range] = useState({ from: null, to: null });

  // 달력 그리드 데이터 생성 (42개 날짜)
  const calendar_grid = useMemo(() => {
    return generate_calendar_grid(current_year, current_month);
  }, [current_year, current_month]);

  // 이전 월로 이동
  const go_to_previous_month = () => {
    if (current_month === 0) {
      set_current_year(current_year - 1);
      set_current_month(11);
    } else {
      set_current_month(current_month - 1);
    }
  };

  // 다음 월로 이동
  const go_to_next_month = () => {
    if (current_month === 11) {
      set_current_year(current_year + 1);
      set_current_month(0);
    } else {
      set_current_month(current_month + 1);
    }
  };

  // 날짜 범위 선택 로직
  const handle_range_select = (clicked_date) => {
    if (!temp_range.from || (temp_range.from && temp_range.to)) {
      // 첫 번째 날짜 선택 또는 새로운 범위 시작
      set_temp_range({ from: clicked_date, to: null });
    } else if (temp_range.from && !temp_range.to) {
      // 두 번째 날짜 선택
      const from_date = temp_range.from;
      const to_date = clicked_date;
      
      // 날짜 순서 정렬 (from이 to보다 앞서야 함)
      if (from_date <= to_date) {
        set_temp_range({ from: from_date, to: to_date });
        on_range_select?.({ from: from_date, to: to_date });
      } else {
        set_temp_range({ from: to_date, to: from_date });
        on_range_select?.({ from: to_date, to: from_date });
      }
    }
  };

  // 날짜 클릭 핸들러
  const handle_date_click = (date_obj) => {
    if (mode === "single") {
      on_date_select?.(date_obj.full_date);
    } else if (mode === "range") {
      handle_range_select(date_obj.full_date);
    }
  };

  // 두 날짜 사이에 있는지 확인
  const is_date_in_range = (date, from_date, to_date) => {
    if (!from_date || !to_date) return false;
    return date >= from_date && date <= to_date;
  };

  // 날짜가 범위의 시작점인지 확인
  const is_range_start = (date, from_date) => {
    return from_date && date.toDateString() === from_date.toDateString();
  };

  // 날짜가 범위의 끝점인지 확인
  const is_range_end = (date, to_date) => {
    return to_date && date.toDateString() === to_date.toDateString();
  };

  // 날짜 셀의 스타일 클래스 계산
  const get_date_cell_class = (date_obj) => {
    const base_class = "w-10 h-10 flex flex-col items-center justify-center text-sm cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
    
    let text_color = "";
    let bg_class = "";
    
    // 현재 월 / 이전-다음 월 구분
    if (date_obj.is_current_month) {
      if (is_sunday(date_obj.day_of_week)) {
        text_color = "text-red-500"; // 일요일은 빨간색
      } else {
        text_color = "text-gray-900 dark:text-white"; // 현재 월은 진한 검은색
      }
    } else {
      text_color = "text-gray-400 dark:text-gray-600"; // 이전/다음 월은 연한 회색
    }

    // 범위 선택 스타일링 (range mode)
    if (mode === "range" && temp_range.from) {
      const current_date = date_obj.full_date;
      
      if (is_range_start(current_date, temp_range.from)) {
        bg_class = "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-600 dark:hover:bg-gray-300 rounded-full";
        text_color = "text-white dark:text-gray-800";
      } else if (is_range_end(current_date, temp_range.to)) {
        bg_class = "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-600 dark:hover:bg-gray-300 rounded-full";
        text_color = "text-white dark:text-gray-800";
      } else if (is_date_in_range(current_date, temp_range.from, temp_range.to)) {
        bg_class = "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      }
    }

    // 오늘 날짜 강조 (범위 선택이 아닐 때만)
    if (is_today(date_obj.full_date) && !bg_class) {
      bg_class = "bg-gray-200 dark:bg-gray-700 font-semibold border border-gray-300 dark:border-gray-600";
    }

    // 선택된 날짜 스타일 (single mode)
    if (mode === "single" && selected_date && 
        date_obj.full_date.toDateString() === selected_date.toDateString()) {
      bg_class = "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800";
      text_color = "text-white dark:text-gray-800";
    }

    return `${base_class} ${text_color} ${bg_class}`.trim();
  };

  // 날짜 포맷팅 함수
  const format_date = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/\s/g, '');
  };

  // 적용 버튼 핸들러
  const handle_apply = () => {
    if (temp_range.from && temp_range.to) {
      on_apply?.(temp_range);
    }
  };

  // 취소 버튼 핸들러
  const handle_cancel = () => {
    set_temp_range({ from: null, to: null });
    on_cancel?.();
  };

  const weekday_names = get_weekday_names_kr();

  return (
    <div className={cn("p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg", className)}>
      {/* 헤더: 년월 표시 및 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={go_to_previous_month}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {current_year}년
          </span>
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {get_month_name_kr(current_month)}
          </span>
        </div>

        <button
          onClick={go_to_next_month}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {weekday_names.map((weekday, index) => (
          <div
            key={weekday}
            className={`h-10 flex items-center justify-center text-sm font-medium ${
              index === 0 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* 달력 그리드 (6주 x 7일 = 42칸) */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendar_grid.map((date_obj, index) => (
          <div
            key={`${date_obj.full_date.toISOString()}-${index}`}
            className={get_date_cell_class(date_obj)}
            onClick={() => handle_date_click(date_obj)}
          >
            <span className="font-medium">
              {date_obj.date}
            </span>
            
            {/* 보조 정보 슬롯 (음력, 기념일 등) */}
            {show_lunar && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-0.5">
                {/* 여기에 음력이나 기념일 정보 추가 가능 */}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 선택된 기간 표시 */}
      {mode === "range" && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {temp_range.from && temp_range.to
              ? `${format_date(temp_range.from)} ~ ${format_date(temp_range.to)}`
              : temp_range.from
              ? `${format_date(temp_range.from)} ~ 종료일을 선택하세요`
              : '날짜 범위를 선택하세요'
            }
          </p>
        </div>
      )}

      {/* 액션 버튼들 */}
      {show_actions && (
        <div className="flex gap-2">
          <button
            onClick={handle_cancel}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg transition-colors text-sm"
          >
            취소
          </button>
          <button
            onClick={handle_apply}
            disabled={!temp_range.from || !temp_range.to}
            className="flex-1 bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-white dark:text-gray-800 py-2 px-4 rounded-lg transition-colors text-sm"
          >
            기간 적용
          </button>
        </div>
      )}
    </div>
  );
}

export { Calendar };
