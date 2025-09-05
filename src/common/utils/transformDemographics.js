export function transformDemographics(apiResponse) {
  if (!apiResponse?.data) return [];

  // 날짜별 demographic 데이터를 합산
  const aggregated = {};
  apiResponse.data.forEach((entry) => {
    entry.demographics.forEach(({ ageGroup, gender, viewerPercentage }) => {
      const cleanedAgeGroup = ageGroup.replace('age', ''); // 'age' 접두사 제거
      if (!aggregated[cleanedAgeGroup]) {
        aggregated[cleanedAgeGroup] = { age: cleanedAgeGroup, male: 0, female: 0 };
      }
      aggregated[cleanedAgeGroup][gender] += viewerPercentage;
    });
  });

  // 최종 데이터를 포맷팅하여 반환
  const formatted = Object.values(aggregated).map(item => ({
    ...item,
    // 소수점 3자리까지 반올림
    male: parseFloat(item.male.toFixed(3)),
    female: parseFloat(item.female.toFixed(3)),
  }));

  return formatted;
}