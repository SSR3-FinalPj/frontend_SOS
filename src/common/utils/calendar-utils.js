/**
 * 달력 날짜 계산을 위한 유틸리티 함수들
 * 네이버 캘린더와 동일한 6x7 고정 그리드 구조 구현
 */

/**
 * 해당 월의 첫 번째 날이 무슨 요일인지 계산
 * @param {number} year - 연도
 * @param {number} month - 월 (0-11)
 * @returns {number} 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
 */
export const get_first_day_of_month = (year, month) => {
  return new Date(year, month, 1).getDay();
};

/**
 * 해당 월의 마지막 날짜 계산
 * @param {number} year - 연도  
 * @param {number} month - 월 (0-11)
 * @returns {number} 마지막 날짜 (28-31)
 */
export const get_last_date_of_month = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * 이전 달의 마지막 날짜 계산
 * @param {number} year - 연도
 * @param {number} month - 월 (0-11) 
 * @returns {number} 이전 달의 마지막 날짜
 */
export const get_previous_month_last_date = (year, month) => {
  return new Date(year, month, 0).getDate();
};

/**
 * 6x7 그리드를 채우기 위한 42개 날짜 데이터 생성
 * @param {number} year - 연도
 * @param {number} month - 월 (0-11)
 * @returns {Array} 42개 날짜 객체 배열
 */
export const generate_calendar_grid = (year, month) => {
  const first_day = get_first_day_of_month(year, month);
  const last_date = get_last_date_of_month(year, month);
  const prev_month_last_date = get_previous_month_last_date(year, month);
  
  const calendar_grid = [];
  
  // 이전 달의 날짜들로 시작 부분 채우기
  for (let i = first_day - 1; i >= 0; i--) {
    calendar_grid.push({
      date: prev_month_last_date - i,
      is_current_month: false,
      is_previous_month: true,
      is_next_month: false,
      day_of_week: (first_day - 1 - i) % 7,
      full_date: new Date(year, month - 1, prev_month_last_date - i)
    });
  }
  
  // 현재 달의 날짜들 추가
  for (let date = 1; date <= last_date; date++) {
    calendar_grid.push({
      date,
      is_current_month: true,
      is_previous_month: false,
      is_next_month: false,
      day_of_week: (first_day + date - 1) % 7,
      full_date: new Date(year, month, date)
    });
  }
  
  // 다음 달의 날짜들로 끝부분 채우기 (총 42개가 되도록)
  const remaining_cells = 42 - calendar_grid.length;
  for (let date = 1; date <= remaining_cells; date++) {
    calendar_grid.push({
      date,
      is_current_month: false,
      is_previous_month: false,
      is_next_month: true,
      day_of_week: (first_day + last_date + date - 1) % 7,
      full_date: new Date(year, month + 1, date)
    });
  }
  
  return calendar_grid;
};

/**
 * 해당 날짜가 일요일인지 확인
 * @param {number} day_of_week - 요일 (0-6)
 * @returns {boolean} 일요일 여부
 */
export const is_sunday = (day_of_week) => {
  return day_of_week === 0;
};

/**
 * 월 이름을 한글로 반환
 * @param {number} month - 월 (0-11)
 * @returns {string} 한글 월 이름
 */
export const get_month_name_kr = (month) => {
  const month_names = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  return month_names[month];
};

/**
 * 요일 이름을 한글로 반환
 * @returns {Array} 한글 요일 배열
 */
export const get_weekday_names_kr = () => {
  return ['일', '월', '화', '수', '목', '금', '토'];
};

/**
 * 현재 날짜와 비교하여 오늘인지 확인
 * @param {Date} date - 비교할 날짜
 * @returns {boolean} 오늘 여부
 */
export const is_today = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};