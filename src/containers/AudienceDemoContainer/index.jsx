import { useEffect, useState } from "react";
import { getYouTubeDailyDemographics } from "@/common/api/api";
import { transformDemographics } from "@/common/utils/transformDemographics";
import AudienceDemographicsChart from "@/common/ui/AudienceDemographicsChart";

function AudienceDemoContainer({ startDate, endDate }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!startDate || !endDate) return;

        // 날짜를 YYYY-MM-DD 문자열로 변환
        const start = new Date(startDate).toISOString().slice(0, 10);
        const end = new Date(endDate).toISOString().slice(0, 10);

        const res = await getYouTubeDailyDemographics(start, end);
        const transformed = transformDemographics(res);
        setChartData(transformed);
      } catch (e) {
        console.error("AudienceDemoContainer fetch error:", e);
      }
    }
    fetchData();
  }, [startDate, endDate]);

  return <AudienceDemographicsChart data={chartData} />;
}

export default AudienceDemoContainer;