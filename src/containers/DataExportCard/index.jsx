import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Copy as CopyIcon } from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';
import { ZipWriter } from '@/common/utils/zip';
import { toCSV, downloadBlob } from '@/common/utils/csv';
import { format_date_for_api } from '@/domain/dashboard/logic/dashboard-utils';
import { getYouTubeChannelId, getRedditChannelInfo, getYouTubeUploadsByRange, getRedditUploadsByRange, getTrafficSourceSummary, getYouTubeDailyDemographics } from '@/common/api/api';
import { Button } from '@/common/ui/button';
import SuccessModal from '@/common/ui/success-modal';

function DataExportCard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [include, setInclude] = useState({ yt: true, rd: true, traffic: true, demo: false });
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const computeRange = () => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(end.getDate() - (selectedPeriod === '30days' ? 29 : 6));
    return { start: format_date_for_api(start), end: format_date_for_api(end) };
  };

  const handleCopyPrompt = async () => {
    try {
      setCopying(true);
      const { start, end } = computeRange();
      const parts = [];
      parts.push(`기간: ${start} ~ ${end}`);
      // YouTube
      if (include.yt) {
        const ytCh = await getYouTubeChannelId().catch(() => null);
        if (ytCh?.channelId) {
          const yt = await getYouTubeUploadsByRange(start, end, ytCh.channelId).catch(() => null);
          const videos = (yt?.videos || yt || []);
          const n = videos.length;
          const top = [...videos]
            .map(v => ({ title: v.title, views: v.viewCount || v.views || 0 }))
            .sort((a,b)=>b.views-a.views)
            .slice(0,3)
            .map(v => `${v.title}(${v.views?.toLocaleString?.() || v.views}회)`)
            .join(', ');
          parts.push(`YouTube 업로드 ${n}건. 상위 조회수 3개: ${top || '해당 없음'}`);
        }
      }
      // Reddit
      if (include.rd) {
        const rdCh = await getRedditChannelInfo().catch(() => null);
        if (rdCh?.channelId) {
          const rd = await getRedditUploadsByRange(start, end, rdCh.channelId).catch(() => null);
          const posts = (rd?.posts || rd || []);
          const n = posts.length;
          const top = [...posts]
            .map(p => ({ title: p.title, score: p.upvotes || p.upvote || p.score || 0 }))
            .sort((a,b)=>b.score-a.score)
            .slice(0,3)
            .map(p => `${p.title}(점수 ${p.score?.toLocaleString?.() || p.score})`)
            .join(', ');
          parts.push(`Reddit 업로드 ${n}건. 상위 점수 3개: ${top || '해당 없음'}`);
        }
      }
      // Traffic source
      if (include.traffic) {
        const ts = await getTrafficSourceSummary(start, end).catch(() => null);
        const rows = (ts?.data || []);
        const total = rows.reduce((s, r) => s + (Number(r.views)||0), 0) || 1;
        const top = [...rows]
          .map(r => ({ name: r.insightTrafficSourceType, pct: ((Number(r.views)||0)/total)*100 }))
          .sort((a,b)=>b.pct-a.pct)
          .slice(0,3)
          .map(r => `${r.name} ${r.pct.toFixed(1)}%`).join(', ');
        if (rows.length) parts.push(`트래픽 상위: ${top}`);
      }
      // Demographics (optional)
      if (include.demo) {
        const demo = await getYouTubeDailyDemographics(start, end).catch(() => null);
        const arr = (demo?.data || demo || []);
        if (arr.length) {
          const avgMale = Math.round(arr.reduce((s,d)=>s+(Number(d.male)||0),0)/arr.length);
          const avgFemale = Math.round(arr.reduce((s,d)=>s+(Number(d.female)||0),0)/arr.length);
          parts.push(`평균 시청자 분포: 남성 ${avgMale}, 여성 ${avgFemale}`);
        }
      }

      parts.push('\n[지시] 위 기간의 성과를 요약하고, 플랫폼별 주목할 패턴 3가지와 다음 주에 시도할 콘텐츠 아이디어 3가지를 제안해줘. 수치는 간단히 괄호로 병기하고, 불필요한 장식은 제외해줘.');
      const text = parts.join('\n');

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
      }
      setCopySuccess(true);
    } catch (_) {
      alert('프롬프트 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setCopying(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const { start, end } = computeRange();
      const zip = new ZipWriter();
      let added = 0;

      if (include.yt) {
        const ytCh = await getYouTubeChannelId().catch(() => null);
        if (ytCh?.channelId) {
          const yt = await getYouTubeUploadsByRange(start, end, ytCh.channelId).catch(() => null);
          const rows = (yt?.videos || yt || []).map((v) => ({
            id: v.id || v.videoId,
            title: v.title,
            views: v.viewCount || v.views,
            likes: v.likeCount || v.likes,
            comments: v.commentCount || v.comments,
            publishedAt: v.publishedAt || v.uploadDate || v.uploadedAt,
          }));
          const csv = toCSV(rows, ['id','title','views','likes','comments','publishedAt']);
          if (csv && csv.length) {
            zip.addFile(`youtube_uploads_${start}_${end}.csv`, new TextEncoder().encode(csv));
            added++;
          }
        }
      }

      if (include.rd) {
        const rdCh = await getRedditChannelInfo().catch(() => null);
        if (rdCh?.channelId) {
          const rd = await getRedditUploadsByRange(start, end, rdCh.channelId).catch(() => null);
          const rows = (rd?.posts || rd || []).map((p) => ({
            id: p.id || p.postId,
            title: p.title,
            upvotes: p.upvotes || p.upvote || p.score,
            comments: p.comments || p.comment_count,
            createdAt: p.createdAt || p.created_at || p.uploadDate,
          }));
          const csv = toCSV(rows, ['id','title','upvotes','comments','createdAt']);
          if (csv && csv.length) {
            zip.addFile(`reddit_posts_${start}_${end}.csv`, new TextEncoder().encode(csv));
            added++;
          }
        }
      }

      if (include.traffic) {
        const ts = await getTrafficSourceSummary(start, end).catch(() => null);
        const rows = (ts?.data || []).map((t) => ({ source: t.insightTrafficSourceType, views: t.views }));
        const csv = toCSV(rows, ['source','views']);
        if (csv && csv.length) {
          zip.addFile(`traffic_source_${start}_${end}.csv`, new TextEncoder().encode(csv));
          added++;
        }
      }

      if (include.demo) {
        const demo = await getYouTubeDailyDemographics(start, end).catch(() => null);
        const rows = (demo?.data || demo || []).map((d) => ({ date: d.date || d.day, male: d.male, female: d.female }));
        const csv = toCSV(rows, ['date','male','female']);
        if (csv && csv.length) {
          zip.addFile(`demographics_${start}_${end}.csv`, new TextEncoder().encode(csv));
          added++;
        }
      }

      if (added === 0) {
        alert('선택한 기간에 내보낼 데이터가 없습니다.');
      } else {
        const blob = zip.build();
        downloadBlob(blob, `export_${start}_${end}.zip`);
      }
    } catch (e) {
      console.error('Export failed', e);
      alert('내보내기에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <GlassCard>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white">데이터 내보내기</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">선택한 기간의 데이터를 내보냅니다.</p>
        </div>

        {/* Period Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            기간 선택
          </label>
          <div className="flex gap-3">
            <motion.button
              onClick={() => setSelectedPeriod('7days')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                selectedPeriod === '7days'
                  ? 'text-white shadow-md bg-gradient-to-r from-brand-secondary-500 to-brand-primary-500'
                  : 'bg-white/30 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/20'
              }`}
            >
              최근 7일
            </motion.button>
            <motion.button
              onClick={() => setSelectedPeriod('30days')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                selectedPeriod === '30days'
                  ? 'text-white shadow-md bg-gradient-to-r from-brand-secondary-500 to-brand-primary-500'
                  : 'bg-white/30 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/20'
              }`}
            >
              최근 30일
            </motion.button>
          </div>
        </div>

        {/* Include Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">포함할 데이터</label>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={include.yt} onChange={(e)=>setInclude(s=>({...s, yt:e.target.checked}))} /> YouTube 업로드</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={include.rd} onChange={(e)=>setInclude(s=>({...s, rd:e.target.checked}))} /> Reddit 업로드</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={include.traffic} onChange={(e)=>setInclude(s=>({...s, traffic:e.target.checked}))} /> 트래픽 소스</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={include.demo} onChange={(e)=>setInclude(s=>({...s, demo:e.target.checked}))} /> 데모그래픽</label>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex gap-4">
          <Button onClick={handleExport} disabled={loading} variant="brand" className="flex-1 rounded-xl py-3 text-base">
            <FileText className="w-5 h-5" />
            {loading ? '내보내는 중...' : 'ZIP로 내보내기'}
          </Button>
          <Button onClick={handleCopyPrompt} disabled={copying} variant="brand-weak" className="rounded-xl py-3 text-base">
            <CopyIcon className="w-5 h-5" />
            {copying ? '생성 중...' : 'LLM 요약 프롬프트 복사'}
          </Button>
        </div>

        <SuccessModal
          is_open={copySuccess}
          on_close={() => setCopySuccess(false)}
          title="복사 완료"
          message="요약 프롬프트를 클립보드에 복사했습니다. 선호하는 LLM에 붙여넣어 분석을 요청하세요."
        />
      </GlassCard>
    </motion.div>
  );
}

export { DataExportCard };
