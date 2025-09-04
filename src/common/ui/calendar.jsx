"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  generate_calendar_grid, 
  get_month_name_kr, 
  get_weekday_names_kr, 
  is_sunday,
  is_today 
} from '@/common/utils/calendar-utils';
import { cn } from '@/common/utils/ui-utils';

function Calendar({
  selected_date,
  on_date_select,
  selected_range = { from: null, to: null },
  on_range_select,
  mode = "range",
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

  const calendar_grid = useMemo(() => {
    return generate_calendar_grid(current_year, current_month);
  }, [current_year, current_month]);

  const go_to_previous_month = () => {
    if (current_month === 0) {
      set_current_year(current_year - 1);
      set_current_month(11);
    } else {
      set_current_month(current_month - 1);
    }
  };

  const go_to_next_month = () => {
    if (current_month === 11) {
      set_current_year(current_year + 1);
      set_current_month(0);
    } else {
      set_current_month(current_month + 1);
    }
  };

  const handle_range_select = (clicked_date) => {
    if (!temp_range.from || (temp_range.from && temp_range.to)) {
      set_temp_range({ from: clicked_date, to: null });
    } else if (temp_range.from && !temp_range.to) {
      const from_date = temp_range.from;
      const to_date = clicked_date;
      
      if (from_date <= to_date) {
        set_temp_range({ from: from_date, to: to_date });
        on_range_select?.({ from: from_date, to: to_date });
      } else {
        set_temp_range({ from: to_date, to: from_date });
        on_range_select?.({ from: to_date, to: from_date });
      }
    }
  };

  const handle_date_click = (date_obj) => {
    if (mode === "single") {
      on_date_select?.(date_obj.full_date);
    } else if (mode === "range") {
      handle_range_select(date_obj.full_date);
    }
  };

  const is_date_in_range = (date, from_date, to_date) => {
    if (!from_date || !to_date) return false;
    return date >= from_date && date <= to_date;
  };

  const is_range_start = (date, from_date) => {
    return from_date && date.toDateString() === from_date.toDateString();
  };

  const is_range_end = (date, to_date) => {
    return to_date && date.toDateString() === to_date.toDateString();
  };

  const get_date_cell_class = (date_obj) => {
    const base_class = "w-10 h-10 flex flex-col items-center justify-center text-sm cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
    
    let text_color = "";
    let bg_class = "";
    
    if (date_obj.is_current_month) {
      if (is_sunday(date_obj.day_of_week)) {
        text_color = "text-red-500";
      } else {
        text_color = "text-gray-900 dark:text-white";
      }
    } else {
      text_color = "text-gray-400 dark:text-gray-600";
    }

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

    if (is_today(date_obj.full_date) && !bg_class) {
      bg_class = "bg-gray-200 dark:bg-gray-700 font-semibold border border-gray-300 dark:border-gray-600";
    }

    if (mode === "single" && selected_date && 
        date_obj.full_date.toDateString() === selected_date.toDateString()) {
      bg_class = "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800";
      text_color = "text-white dark:text-gray-800";
    }

    return `${base_class} ${text_color} ${bg_class}`.trim();
  };

  const format_date = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/\s/g, '');
  };

  const handle_apply = () => {
    if (temp_range.from && temp_range.to) {
      on_apply?.(temp_range);
    }
  };

  const handle_cancel = () => {
    set_temp_range({ from: null, to: null });
    on_cancel?.();
  };

  const weekday_names = get_weekday_names_kr();

  return (
    <div className={cn("p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg", className)}>
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
            
            {show_lunar && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-0.5">
              </span>
            )}
          </div>
        ))}
      </div>

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