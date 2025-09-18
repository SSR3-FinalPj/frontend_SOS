import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { motion } from 'framer-motion';
import { PieChart as PieChartIcon } from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';
import { useAnalyticsStore } from '@/domain/analytics/logic/store';
import { cn } from '@/common/utils/ui-utils';

// 트래픽 소스 시각 구분을 위한 혼합 팔레트 (브랜드 보라/파랑 + 인디고/시안/청록)
const TRAFFIC_COLORS = [
  '#3b82f6', // brand-secondary-500 (파랑)
  '#7c3aed', // brand-primary-500 (보라)
  '#6366f1', // indigo-500 (인디고)
  '#06b6d4', // cyan-500 (시안)
  '#14b8a6', // teal-500 (청록)
  '#60a5fa', // brand-secondary-400 (연파랑)
  '#9275ff', // brand-primary-400 (연보라)
  '#a5b4fc', // indigo-300 (연인디고)
];

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, data }) => {
  if (active && payload && payload.length && data) {
    // 실제 총합 계산
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : '0.0';
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/30 rounded-2xl p-4 shadow-2xl"
      >
        <p className="font-semibold text-gray-800 dark:text-white mb-2">
          {payload[0].name}
        </p>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {payload[0].value.toLocaleString()}회 ({percentage}%)
          </span>
        </div>
      </motion.div>
    );
  }
  return null;
};

// 활성 섹터 렌더링 (호버 시 도넛 확장)
const renderActiveShape = (props) => {
  const {
    cx, cy,
    innerRadius, outerRadius,
    startAngle, endAngle,
    fill,
  } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

// 로딩 스켈레톤 컴포넌트
const LoadingSkeleton = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-80 sm:h-96"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
  </motion.div>
);

// 데이터 없음 컴포넌트
const NoDataMessage = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-80 sm:h-96"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <PieChartIcon className="w-12 h-12 text-gray-400 mb-4" />
    <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
      데이터가 없습니다
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
      선택한 기간에 트래픽 소스 데이터가 없습니다
    </p>
  </motion.div>
);

// 에러 메시지 컴포넌트
const ErrorMessage = ({ error }) => (
  <motion.div 
    className="flex flex-col items-center justify-center h-80 sm:h-96"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
      <PieChartIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
    </div>
    <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
      데이터 로딩 실패
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
      {error}
    </p>
  </motion.div>
);

const TrafficSourceChart = () => {
  const { 
    trafficSourceData, 
    isTrafficLoading, 
    trafficError,
    fetchTrafficSourceData 
  } = useAnalyticsStore();

  // 초기 데이터 로딩
  React.useEffect(() => {
    fetchTrafficSourceData();
  }, [fetchTrafficSourceData]);

  const chartData = trafficSourceData && trafficSourceData.length > 0 
    ? trafficSourceData 
    : [];

  // Pie & Legend hover 동기화 상태
  const [activeIndex, setActiveIndex] = React.useState(null);
  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  // 레전드 커스텀 렌더러: 호버 시 값/비율 표시 + Pie 하이라이트
  const legendContainerRef = React.useRef(null);
  const [legendHover, setLegendHover] = React.useState({ show: false, idx: null, x: 0, y: 0 });

  const handleLegendEnter = (e, idx) => {
    setActiveIndex(idx);
    if (legendContainerRef.current) {
      const containerRect = legendContainerRef.current.getBoundingClientRect();
      const itemRect = e.currentTarget?.getBoundingClientRect?.() || { left: e.clientX, width: 0 };
      const centerX = (itemRect.left - containerRect.left) + (itemRect.width / 2);
      setLegendHover({ show: true, idx, x: centerX, y: 0 });
    } else {
      setLegendHover({ show: true, idx, x: 0, y: 0 });
    }
  };

  const handleLegendMove = (e) => {
    if (!legendContainerRef.current) return;
    const containerRect = legendContainerRef.current.getBoundingClientRect();
    const itemRect = e.currentTarget?.getBoundingClientRect?.() || { left: e.clientX, width: 0 };
    const centerX = (itemRect.left - containerRect.left) + (itemRect.width / 2);
    setLegendHover((s) => ({ ...s, x: centerX }));
  };

  const handleLegendLeave = () => {
    setLegendHover({ show: false, idx: null, x: 0, y: 0 });
    setActiveIndex(null);
  };

  const renderLegend = () => {
    // payload에 의존하지 않고 항상 chartData 기반으로 렌더링
    const total = chartData.reduce((s, d) => s + (d.value || 0), 0) || 0;
    const hoveredItem = legendHover.idx != null ? chartData[legendHover.idx] : null;
    const hoveredColor = legendHover.idx != null ? TRAFFIC_COLORS[legendHover.idx % TRAFFIC_COLORS.length] : null;
    const hoveredPct = hoveredItem ? (total > 0 ? ((hoveredItem.value / total) * 100).toFixed(1) : '0.0') : null;

    return (
      <div
        ref={legendContainerRef}
        className="relative flex flex-wrap justify-center gap-3 mt-2"
      >
        {chartData.map((item, idx) => {
          const isActive = activeIndex === idx;
          const color = TRAFFIC_COLORS[idx % TRAFFIC_COLORS.length];
          return (
            <div
              key={`${item.name}-${idx}`}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-colors ${
                isActive
                  ? 'bg-white/30 dark:bg-white/10 border-white/30 dark:border-white/20'
                  : 'bg-white/20 dark:bg-white/5 border-white/20 dark:border-white/10'
              }`}
              onMouseEnter={(e) => handleLegendEnter(e, idx)}
              onMouseMove={handleLegendMove}
              onMouseLeave={handleLegendLeave}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {item.name}
              </span>
            </div>
          );
        })}

        {/* 레전드 호버 툴팁 (차트 툴팁과 동일 형식) */}
        {legendHover.show && hoveredItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-10 rounded-xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/30 p-3 shadow-xl"
            style={{ left: legendHover.x, bottom: 'calc(100% + 8px)', transform: 'translateX(-50%)' }}
          >
            <p className="font-semibold text-gray-800 dark:text-white mb-1">{hoveredItem.name}</p>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: hoveredColor }} />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {hoveredItem.value?.toLocaleString?.() ?? hoveredItem.value}회 ({hoveredPct}%)
              </span>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="p-6" hover={false}>
        {/* 헤더 섹션 */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-secondary-500/30 to-brand-primary-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg">
            <PieChartIcon className="w-6 h-6 text-brand-primary-600 dark:text-brand-primary-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              트래픽 소스 분석
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {trafficSourceData && trafficSourceData.length > 0 
                ? '실제 유입 경로별 조회수' 
                : '유입 경로별 사용자 비율'}
            </p>
          </div>
        </motion.div>

        {/* 차트 영역 */}
        <motion.div 
          className={cn(
            "h-80 sm:h-96 w-full",
            "relative pb-16 sm:pb-20"
          )}
          role="img"
          aria-label="웹사이트 트래픽 소스별 비율을 나타내는 파이 차트"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {isTrafficLoading ? (
            <LoadingSkeleton />
          ) : trafficError ? (
            <ErrorMessage error={trafficError} />
          ) : chartData.length === 0 ? (
            <NoDataMessage />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="44%"
                  labelLine={false}
                  outerRadius={window.innerWidth < 640 ? 64 : 104}
                  innerRadius={window.innerWidth < 640 ? 26 : 36}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  animationBegin={500}
                  animationDuration={800}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {chartData.map((_, index) => {
                    const isDim = activeIndex !== null && activeIndex !== index;
                    const color = isDim
                      ? 'rgba(148, 163, 184, 0.55)' // gray-400 with alpha (명확한 회색 처리)
                      : TRAFFIC_COLORS[index % TRAFFIC_COLORS.length];
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={color}
                        fillOpacity={1}
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth={2}
                      />
                    );
                  })}
                </Pie>
                
                <Tooltip content={<CustomTooltip data={chartData} />} />
              </PieChart>
            </ResponsiveContainer>
          )}
          {/* 커스텀 레전드: 차트 영역 내부 하단에 절대 배치하여 전체 카드 높이 고정 */}
          {chartData.length > 0 && (
            <div className="absolute inset-x-0 bottom-0">
              {renderLegend()}
            </div>
          )}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
};

export default TrafficSourceChart;
