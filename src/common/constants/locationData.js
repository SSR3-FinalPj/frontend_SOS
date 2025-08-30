/**
 * 서울시 구별 명소 데이터
 * 120개 주요 명소를 구별로 분류하여 관리
 */

export const SEOUL_DISTRICTS = [
  "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
  "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
  "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구", "과천시"
];

export const LOCATION_DATA = {
  "강남구": {
    "POI001": "강남 MICE 관광특구",
    "POI014": "강남역",
    "POI034": "선릉역",
    "POI037": "신논현역·논현역",
    "POI042": "역삼역",
    "POI059": "가로수길",
    "POI071": "압구정로데오거리",
    "POI080": "청담동 명품거리"
  },
  "강동구": {
    "POI011": "서울 암사동 유적",
    "POI016": "고덕역",
    "POI050": "천호역",
    "POI087": "광나루한강공원"
  },
  "강북구": {
    "POI026": "미아사거리역",
    "POI036": "수유역",
    "POI096": "북서울꿈의숲"
  },
  "강서구": {
    "POI027": "발산역",
    "POI032": "서울식물원·마곡나루역",
    "POI061": "김포공항",
    "POI085": "강서한강공원"
  },
  "관악구": {
    "POI031": "서울대입구역",
    "POI039": "신림역"
  },
  "광진구": {
    "POI015": "건대입구역",
    "POI021": "군자역",
    "POI093": "뚝섬한강공원",
    "POI102": "아차산",
    "POI104": "어린이대공원"
  },
  "구로구": {
    "POI019": "구로디지털단지역",
    "POI020": "구로역",
    "POI023": "대림역",
    "POI038": "신도림역",
    "POI086": "고척돔",
    "POI125": "안양천"
  },
  "금천구": {
    "POI013": "가산디지털단지역"
  },
  "도봉구": {
    "POI070": "쌍문역",
    "POI079": "창동 신경제 중심지"
  },
  "동대문구": {
    "POI049": "장한평역",
    "POI056": "회기역",
    "POI081": "청량리 제기동 일대 전통시장"
  },
  "동작구": {
    "POI029": "사당역",
    "POI051": "총신대입구(이수)역",
    "POI063": "노량진",
    "POI123": "보라매공원"
  },
  "마포구": {
    "POI007": "홍대 관광특구",
    "POI040": "신촌·이대역",
    "POI053": "합정역",
    "POI055": "홍대입구역(2호선)",
    "POI073": "연남동",
    "POI084": "DMC(디지털미디어시티)",
    "POI090": "난지한강공원",
    "POI094": "망원한강공원",
    "POI106": "월드컵공원"
  },
  "서대문구": {
    "POI052": "충정로역",
    "POI122": "신촌 스타광장",
    "POI124": "서대문독립공원",
    "POI128": "홍제폭포"
  },
  "서초구": {
    "POI017": "고속터미널역",
    "POI018": "교대역",
    "POI041": "양재역",
    "POI095": "반포한강공원",
    "POI098": "서리풀공원·몽마르뜨공원",
    "POI111": "잠원한강공원",
    "POI112": "청계산"
  },
  "성동구": {
    "POI025": "뚝섬역",
    "POI045": "왕십리역",
    "POI068": "성수카페거리",
    "POI101": "서울숲공원",
    "POI107": "응봉산"
  },
  "성북구": {
    "POI035": "성신여대입구역"
  },
  "송파구": {
    "POI005": "잠실 관광특구",
    "POI048": "장지역",
    "POI058": "가락시장",
    "POI109": "잠실종합운동장",
    "POI110": "잠실한강공원",
    "POI118": "잠실새내역",
    "POI119": "잠실역",
    "POI120": "잠실롯데타워 일대",
    "POI121": "송리단길·호수단길",
    "POI127": "올림픽공원"
  },
  "양천구": {
    "POI044": "오목교역·목동운동장",
    "POI117": "신정네거리역"
  },
  "영등포구": {
    "POI072": "여의도",
    "POI074": "영등포 타임스퀘어",
    "POI103": "양화한강공원",
    "POI105": "여의도한강공원",
    "POI126": "여의서로"
  },
  "용산구": {
    "POI004": "이태원 관광특구",
    "POI030": "삼각지역",
    "POI046": "용산역",
    "POI047": "이태원역",
    "POI076": "용리단길",
    "POI077": "이태원 앤틱가구거리",
    "POI082": "해방촌·경리단길",
    "POI089": "국립중앙박물관·용산가족공원",
    "POI092": "노들섬",
    "POI108": "이촌한강공원"
  },
  "은평구": {
    "POI043": "연신내역"
  },
  "종로구": {
    "POI006": "종로·청계 관광특구",
    "POI008": "경복궁",
    "POI009": "광화문·덕수궁",
    "POI010": "보신각",
    "POI012": "창덕궁·종묘",
    "POI024": "동대문역",
    "POI054": "혜화역",
    "POI060": "광장(전통)시장",
    "POI066": "북촌한옥마을",
    "POI067": "서촌",
    "POI078": "인사동",
    "POI088": "광화문광장",
    "POI113": "청와대",
    "POI116": "익선동"
  },
  "중구": {
    "POI002": "동대문 관광특구",
    "POI003": "명동 관광특구",
    "POI033": "서울역",
    "POI064": "덕수궁길·정동길",
    "POI083": "DDP(동대문디자인플라자)",
    "POI091": "남산공원",
    "POI099": "서울광장",
    "POI114": "북창동 먹자골목",
    "POI115": "남대문시장"
  },
  "과천시": {
    "POI100": "서울대공원"
  }
};

/**
 * POI ID로 명소 정보 조회
 * @param {string} poi_id - POI ID (예: "POI001")
 * @returns {Object|null} 명소 정보 객체
 */
export const get_location_by_poi_id = (poi_id) => {
  for (const [district, locations] of Object.entries(LOCATION_DATA)) {
    if (locations[poi_id]) {
      return {
        poi_id,
        name: locations[poi_id],
        district
      };
    }
  }
  return null;
};

/**
 * 명소명으로 POI ID 조회
 * @param {string} location_name - 명소명 (예: "서울역")
 * @returns {Object|null} POI 정보 객체
 */
export const get_poi_by_location_name = (location_name) => {
  for (const [district, locations] of Object.entries(LOCATION_DATA)) {
    for (const [poi_id, name] of Object.entries(locations)) {
      if (name === location_name) {
        return {
          poi_id,
          name,
          district
        };
      }
    }
  }
  return null;
};

/**
 * 특정 구의 명소 목록 조회
 * @param {string} district - 구명 (예: "강남구")
 * @returns {Array} 명소 목록 배열
 */
export const get_locations_by_district = (district) => {
  const locations = LOCATION_DATA[district] || {};
  return Object.entries(locations).map(([poi_id, name]) => ({
    poi_id,
    name,
    district
  }));
};

/**
 * 명소명으로 검색
 * @param {string} search_term - 검색어
 * @returns {Array} 검색 결과 배열
 */
export const search_locations = (search_term) => {
  const results = [];
  const search_lower = search_term.toLowerCase();
  
  for (const [district, locations] of Object.entries(LOCATION_DATA)) {
    for (const [poi_id, name] of Object.entries(locations)) {
      if (name.toLowerCase().includes(search_lower)) {
        results.push({
          poi_id,
          name,
          district
        });
      }
    }
  }
  
  return results;
};

/**
 * 모든 명소 개수 조회
 * @returns {number} 총 명소 개수
 */
export const get_total_location_count = () => {
  return Object.values(LOCATION_DATA).reduce((total, locations) => {
    return total + Object.keys(locations).length;
  }, 0);
};