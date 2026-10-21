import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, CheckCircle2, FileText,
  Image as ImageIcon, Inbox, LayoutTemplate, PenLine, RefreshCw,
} from "lucide-react";
import { api } from "../api/client.js";
import { COLLECTION_UI } from "../config/collections.js";
import { Badge } from "../components/ui/Badge.jsx";
import { fmtStamp } from "../lib/format.js";
import { ACTION_TONE } from "./ActivityLog.jsx";
import { EnquiryBadge } from "./Enquiries.jsx";

// Charts below are the reference admin's dashboard charts, fed with enquiries.

const STATUS_META = {
  new: { label: "New", color: "#d96922" },
  reviewed: { label: "Reviewed", color: "#2563eb" },
  actioned: { label: "Actioned", color: "#16a36a" },
  archived: { label: "Archived", color: "#94a3b8" },
};

const MONTH_FORMAT = new Intl.DateTimeFormat("en-IN", { month: "short" });
const NUMBER_FORMAT = new Intl.NumberFormat("en-IN");

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonths(rows = []) {
  const byMonth = new Map(rows.map((row) => [row.month, row]));
  const now = new Date();
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    const row = byMonth.get(monthKey(date));
    return {
      key: monthKey(date),
      label: MONTH_FORMAT.format(date),
      total: Number(row?.total ?? 0),
      fresh: Number(row?.new ?? 0),
    };
  });
}

function EnquiryChart({ months }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const max = Math.max(4, ...months.map((month) => month.total));
  const roundedMax = Math.ceil(max / 4) * 4;
  const chart = { left: 44, top: 18, width: 680, height: 176 };
  const slot = chart.width / months.length;
  const barWidth = Math.min(25, slot * 0.52);
  const ticks = [0, roundedMax / 2, roundedMax];

  return (
    <div className="dash-chart-scroll">
      <svg className="dash-submission-chart" viewBox="0 0 760 250" role="img" aria-label="Monthly form enquiries for the last 12 months">
        {ticks.map((tick) => {
          const y = chart.top + chart.height - (tick / roundedMax) * chart.height;
          return <g key={tick}>
            <line x1={chart.left} y1={y} x2={chart.left + chart.width} y2={y} className="dash-chart-grid" />
            <text x={chart.left - 10} y={y + 4} textAnchor="end" className="dash-chart-axis">{tick}</text>
          </g>;
        })}
        {months.map((month, index) => {
          const x = chart.left + slot * index + (slot - barWidth) / 2;
          const totalHeight = (month.total / roundedMax) * chart.height;
          const newHeight = (month.fresh / roundedMax) * chart.height;
          const totalY = chart.top + chart.height - totalHeight;
          const newY = chart.top + chart.height - newHeight;
          const monthTitle = new Date(`${month.key}-01T12:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
          const tooltipX = Math.max(4, Math.min(596, x + barWidth / 2 - 80));
          const tooltipY = Math.max(4, totalY - 72);
          return <g key={month.key} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
            <rect x={x} y={month.total ? totalY : chart.top + chart.height - 1} width={barWidth} height={Math.max(totalHeight, 5)} rx="5" className="dash-chart-bar-total" tabIndex="0" role="graphics-symbol" aria-label={`${monthTitle}: ${month.total} total enquiries, ${month.fresh} new`} onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)}>
              <title>{monthTitle}: {month.total} total enquiries, {month.fresh} new</title>
            </rect>
            {month.fresh > 0 && <rect x={x + barWidth * 0.65} y={newY} width={barWidth * 0.35} height={Math.max(newHeight, 2)} rx="3" className="dash-chart-bar-new" pointerEvents="none" />}
            <text x={x + barWidth / 2} y={chart.top + chart.height + 22} textAnchor="middle" className="dash-chart-axis">{month.label}</text>
            {activeIndex === index && <g className="dash-svg-tooltip" pointerEvents="none">
              <rect x={tooltipX} y={tooltipY} width="160" height="64" rx="8" />
              <text x={tooltipX + 11} y={tooltipY + 19} className="dash-svg-tooltip-title">{monthTitle}</text>
              <text x={tooltipX + 11} y={tooltipY + 39}>Total enquiries</text>
              <text x={tooltipX + 149} y={tooltipY + 39} textAnchor="end" className="dash-svg-tooltip-value">{NUMBER_FORMAT.format(month.total)}</text>
              <text x={tooltipX + 11} y={tooltipY + 55}>New enquiries</text>
              <text x={tooltipX + 149} y={tooltipY + 55} textAnchor="end" className="dash-svg-tooltip-value">{NUMBER_FORMAT.format(month.fresh)}</text>
            </g>}
          </g>;
        })}
      </svg>
    </div>
  );
}

function StatusChart({ statuses }) {
  const items = statuses
    .map((row) => ({
      status: row.status,
      total: Number(row.total ?? 0),
      ...(STATUS_META[row.status] ?? { label: row.status, color: "#64748b" }),
    }))
    .filter((item) => item.total > 0);
  const total = items.reduce((sum, item) => sum + item.total, 0);
  let cursor = 0;
  const gradient = items.map((item) => {
    const start = cursor;
    cursor += (item.total / total) * 100;
    return `${item.color} ${start}% ${cursor}%`;
  }).join(", ");

  return (
    <div className="dash-status-content">
      <div className="dash-donut-wrap">
        <div className={`dash-donut${total ? "" : " is-empty"}`} style={total ? { background: `conic-gradient(${gradient})` } : undefined}>
          <div className="dash-donut-hole"><strong>{NUMBER_FORMAT.format(total)}</strong><span>enquiries</span></div>
        </div>
      </div>
      <ul className="dash-legend">
        {items.length ? items.map((item) => <li key={item.status}>
          <span className="dash-legend-label"><i style={{ background: item.color }} />{item.label}</span>
          <strong>{NUMBER_FORMAT.format(item.total)}</strong>
        </li>) : <li className="dash-legend-empty">No enquiries to summarize yet</li>}
      </ul>
    </div>
  );
}

function DailyActivityChart({ rows = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const points = rows.map((row) => ({
    label: new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(new Date(`${row.day}T12:00:00`)),
    fullLabel: new Date(`${row.day}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    total: Number(row.total ?? 0),
  }));
  const max = Math.max(4, ...points.map((point) => point.total));
  const width = 420;
  const left = 15;
  const plotWidth = 390;
  const plotHeight = 104;
  const top = 12;
  const xFor = (index) => left + (points.length <= 1 ? 0 : (plotWidth / (points.length - 1)) * index);
  const yFor = (value) => top + plotHeight - (value / max) * plotHeight;
  const line = points.map((point, index) => `${index ? "L" : "M"}${xFor(index)},${yFor(point.total)}`).join(" ");
  const area = points.length ? `${line} L${xFor(points.length - 1)},${top + plotHeight} L${left},${top + plotHeight} Z` : "";

  return <svg className="dash-daily-chart" viewBox={`0 0 ${width} 160`} role="img" aria-label="Daily form enquiries over the last seven days">
    {[0, 0.5, 1].map((fraction) => {
      const y = top + plotHeight * fraction;
      return <line key={fraction} x1={left} y1={y} x2={left + plotWidth} y2={y} className="dash-daily-grid" />;
    })}
    <defs><linearGradient id="daily-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#7441e8" stopOpacity=".22" /><stop offset="100%" stopColor="#7441e8" stopOpacity="0" /></linearGradient></defs>
    {area && <path d={area} fill="url(#daily-area)" />}
    {line && <path d={line} fill="none" stroke="#7441e8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
    {points.map((point, index) => {
      const tooltipX = Math.max(3, Math.min(width - 151, xFor(index) - 74));
      const tooltipY = Math.max(3, yFor(point.total) - 58);
      return <g key={`${point.label}-${index}`}>
      <circle cx={xFor(index)} cy={yFor(point.total)} r="5" fill="#fff" stroke="#7441e8" strokeWidth="2" className="dash-daily-point" tabIndex="0" role="graphics-symbol" aria-label={`${point.fullLabel}: ${point.total} enquiries`} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)}><title>{point.fullLabel}: {point.total} enquiries</title></circle>
      {activeIndex === index && <g className="dash-svg-tooltip" pointerEvents="none">
        <rect x={tooltipX} y={tooltipY} width="148" height="48" rx="8" />
        <text x={tooltipX + 10} y={tooltipY + 19} className="dash-svg-tooltip-title">{point.fullLabel}</text>
        <text x={tooltipX + 10} y={tooltipY + 37}>Enquiries</text>
        <text x={tooltipX + 138} y={tooltipY + 37} textAnchor="end" className="dash-svg-tooltip-value">{NUMBER_FORMAT.format(point.total)}</text>
      </g>}
      <text x={xFor(index)} y="145" textAnchor="middle" className="dash-daily-label">{point.label}</text>
    </g>;
    })}
  </svg>;
}

function MonthlySparkline({ months }) {
  const points = months.slice(-7);
  const max = Math.max(1, ...points.map((point) => point.total));
  const coords = points.map((point, index) => ({
    x: points.length <= 1 ? 10 : 10 + (180 / (points.length - 1)) * index,
    y: 46 - (point.total / max) * 37,
  }));
  const path = coords.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
  return <svg className="dash-sparkline" viewBox="0 0 200 58" role="img" aria-label="Enquiry trend over the last seven months">
    <path d={path} fill="none" stroke="rgba(255,255,255,.78)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {coords.length > 0 && <circle cx={coords.at(-1).x} cy={coords.at(-1).y} r="3.5" fill="#fff" />}
  </svg>;
}


const COLORS = ["#d96922", "#2563eb", "#16a36a", "#8b5cf6", "#ec4c76", "#0eaa8a", "#f59e0b", "#64748b", "#7441e8"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/dashboard");
      setData(res.data);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err.message || "Dashboard data could not be loaded");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const stats = data?.stats ?? {};
  const months = useMemo(() => buildMonths(data?.enquiryTrend), [data?.enquiryTrend]);
  const currentMonth = months.at(-1)?.total ?? 0;
  const currentMonthNew = months.at(-1)?.fresh ?? 0;
  const previousMonth = months.at(-2)?.total ?? 0;
  const monthChange = previousMonth === 0
    ? (currentMonth > 0 ? 100 : 0)
    : Math.round(((currentMonth - previousMonth) / previousMonth) * 100);

  const contentItems = (data?.collections ?? []).map((c, i) => ({
    label: COLLECTION_UI[c.name]?.title ?? c.entity,
    value: c.published,
    draft: c.draft,
    color: COLORS[i % COLORS.length],
    to: `/admin/content/${c.name}`,
  }));
  const maxContent = Math.max(1, ...contentItems.map((item) => item.value));
  const fmt = (v) => (loading && !data ? "—" : NUMBER_FORMAT.format(v ?? 0));

  const cards = [
    { label: "Total enquiries", value: stats.totalEnquiries, icon: Inbox, color: "#7441e8", to: "/admin/enquiries", sub: `${fmt(stats.enquiriesThisMonth)} this month` },
    { label: "Awaiting review", value: stats.newEnquiries, icon: Activity, color: "#0eaa8a", to: "/admin/enquiries", sub: "Status: New" },
    { label: "Published records", value: stats.publishedRecords, icon: CheckCircle2, color: "#16a36a", to: "/admin/sections", sub: `${fmt(stats.totalRecords)} active records, ${fmt(stats.contentModules)} modules` },
    { label: "Draft records", value: stats.draftRecords, icon: PenLine, color: "#fa8756", to: "/admin/sections", sub: "Hidden from the website" },
    { label: "Sections live", value: stats.sectionsPublished, icon: LayoutTemplate, color: "#2563eb", to: "/admin/sections", sub: `${fmt(stats.sectionsPending)} with unpublished changes` },
    { label: "Media assets", value: stats.mediaAssets, icon: ImageIcon, color: "#ec4c76", to: "/admin/media", sub: `${fmt(stats.activeUsers)} active CMS users` },
  ];

  return (
    <div className="dash-page">
      <div className="a-page-header dash-header">
        <div>
          <span className="dash-eyebrow">AMRUT PETH CMS</span>
          <h1 className="a-page-title">Dashboard</h1>
          <p className="a-page-desc">A live overview of website content and enquiries.</p>
        </div>
        <div className="dash-header-actions">
          {updatedAt && <span className="dash-updated">Updated {updatedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>}
          <button className="a-btn a-btn-ghost a-btn-sm" onClick={loadDashboard} disabled={loading}>
            <RefreshCw size={15} className={loading ? "a-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {error && <div className="dash-error" role="alert">{error}<button className="a-btn a-btn-ghost a-btn-sm" onClick={loadDashboard}>Try again</button></div>}

      <div className="a-stat-grid dash-stat-grid dash-stat-grid-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return <Link key={card.label} to={card.to} className="a-stat-tile dash-stat-tile">
            <div className="dash-stat-top">
              <span className="a-stat-label">{card.label}</span>
              <span className="dash-stat-icon" style={{ color: card.color, background: `${card.color}14` }}><Icon size={17} /></span>
            </div>
            <strong className="a-stat-value">{fmt(card.value)}</strong>
            <span className="a-stat-sub">{card.sub}</span>
          </Link>;
        })}
      </div>

      <div className="dash-chart-grid">
        <section className="a-card dash-panel dash-trend-panel">
          <header className="dash-panel-header">
            <div><span className="dash-eyebrow">ENQUIRY ACTIVITY</span><h2>Enquiry trend</h2><p>Monthly enquiries over the last 12 months</p></div>
            <div className={`dash-change ${monthChange >= 0 ? "positive" : "negative"}`}>
              {monthChange >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              {Math.abs(monthChange)}% <span>vs last month</span>
            </div>
          </header>
          {loading && !data ? <div className="dash-chart-loading">Loading activity…</div> : <EnquiryChart months={months} />}
          <div className="dash-chart-legend"><span><i className="dash-legend-blue" /> All enquiries</span><span><i className="dash-legend-orange" /> New enquiries</span></div>
        </section>

        <section className="a-card dash-panel dash-status-panel">
          <header className="dash-panel-header">
            <div><span className="dash-eyebrow">INBOX HEALTH</span><h2>Enquiry status</h2><p>Distribution across all enquiries</p></div>
          </header>
          {loading && !data ? <div className="dash-chart-loading">Loading statuses…</div> : <StatusChart statuses={data?.enquiryStatuses ?? []} />}
          <Link to="/admin/enquiries" className="dash-panel-link">Manage enquiries <ArrowRight size={15} /></Link>
        </section>
      </div>

      <div className="dash-lower-grid">
        <section className="a-card dash-panel dash-daily-panel">
          <header className="dash-panel-header">
            <div><span className="dash-eyebrow">RECENT ACTIVITY</span><h2>Daily enquiries</h2><p>Enquiries received over the last 7 days</p></div>
            <span className="dash-period-label">Last 7 days</span>
          </header>
          {loading && !data ? <div className="dash-daily-loading">Loading activity…</div> : <DailyActivityChart rows={data?.dailyEnquiries ?? []} />}
        </section>

        <section className="a-card dash-panel">
          <header className="dash-panel-header">
            <div><span className="dash-eyebrow">CONTENT HEALTH</span><h2>Published content</h2><p>Published records per module (drafts in brackets)</p></div>
          </header>
          <div className="dash-content-list">
            {contentItems.map((item) => <Link to={item.to} key={item.label} className="dash-content-row">
              <span className="dash-content-label">{item.label}</span>
              <span className="dash-content-track"><i style={{ width: `${(item.value / maxContent) * 100}%`, background: item.color }} /></span>
              <strong>{NUMBER_FORMAT.format(item.value)}{item.draft ? <span className="a-text-muted"> ({item.draft})</span> : null}</strong>
              <ArrowUpRight size={14} className="dash-content-arrow" />
            </Link>)}
          </div>
        </section>

        <section className="dash-highlight-card">
          <span className="dash-highlight-label">THIS MONTH</span>
          <strong className="dash-highlight-value">{fmt(currentMonth)}</strong>
          <span className="dash-highlight-caption">enquiries received</span>
          <MonthlySparkline months={months} />
          <div className="dash-highlight-foot"><span>{NUMBER_FORMAT.format(currentMonthNew)} new</span><span>{monthChange >= 0 ? "+" : ""}{monthChange}% vs prev.</span></div>
          <Link to="/admin/enquiries" className="dash-highlight-link">View enquiries <ArrowRight size={14} /></Link>
        </section>
      </div>

      <div className="dash-chart-grid dash-chart-grid--even">
        <section className="a-card dash-panel">
          <header className="dash-panel-header">
            <div><span className="dash-eyebrow">INBOX</span><h2>Latest enquiries</h2><p>The six most recent submissions</p></div>
          </header>
          {data?.recentEnquiries?.length ? (
            <ul className="dash-recent-list">
              {data.recentEnquiries.map((e) => (
                <li key={e.id}>
                  <Link to={`/admin/enquiries/${e.id}`}>
                    <span><strong>{e.name}</strong><span className="a-row-sub">{e.subject_label} · {fmtStamp(e.created_at)}</span></span>
                    <EnquiryBadge status={e.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="dash-legend-empty">{loading ? "Loading…" : "No enquiries yet"}</p>}
        </section>

        <section className="a-card dash-panel">
          <header className="dash-panel-header">
            <div><span className="dash-eyebrow">AUDIT</span><h2>Recent changes</h2><p>Latest actions by CMS users</p></div>
          </header>
          {data?.recentActivity?.length ? (
            <ul className="dash-recent-list">
              {data.recentActivity.map((a) => (
                <li key={a.id}>
                  <span><span>{a.summary}</span><span className="a-row-sub">{a.user_name || "System"} · {fmtStamp(a.created_at)}</span></span>
                  <Badge tone={ACTION_TONE[a.action] || "neutral"}>{a.action}</Badge>
                </li>
              ))}
            </ul>
          ) : <p className="dash-legend-empty">{loading ? "Loading…" : "No activity yet"}</p>}
        </section>
      </div>

      <nav className="dash-action-strip" aria-label="Quick actions">
        <Link to="/admin/enquiries"><FileText size={15} /> Review enquiries <ArrowRight size={14} /></Link>
        <Link to="/admin/sections"><LayoutTemplate size={15} /> Edit page sections <ArrowRight size={14} /></Link>
        <Link to="/admin/media"><ImageIcon size={15} /> Media library <ArrowRight size={14} /></Link>
      </nav>
    </div>
  );
}
