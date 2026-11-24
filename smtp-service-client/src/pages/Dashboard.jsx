import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  Mail,
  RefreshCw,
  Send,
  X,
  XCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useThemeStyles } from "../utils/useThemeStyles";

const DashboardSkeleton = ({ colors }) => (
  <div className="max-w-7xl mx-auto space-y-6 animate-pulse" aria-label="Loading dashboard">
    <div className="h-28 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }} />
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }} />)}</div>
    <div className="grid xl:grid-cols-5 gap-6"><div className="h-80 xl:col-span-3 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }} /><div className="h-80 xl:col-span-2 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }} /></div>
    <div className="h-96 rounded-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }} />
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const { getDashboardData } = useAuth();
  const { background, foreground, primary, primaryForeground, secondary, secondaryForeground, mutedForeground, card, border, hover, theme } = useThemeStyles();

  const fetchData = async (showRefreshIndicator = false) => {
    showRefreshIndicator ? setRefreshing(true) : setLoading(true);
    try {
      const result = await getDashboardData(currentPage, statusFilter);
      if (result) { setData(result); setLastUpdated(new Date()); }
    } catch (error) { console.error("Dashboard Fetch Error:", error); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, [currentPage, statusFilter]);

  if (loading && !data) return <main className="min-h-screen px-4 py-8 md:px-6" style={{ backgroundColor: background.color }}><DashboardSkeleton colors={{ card: card.color, border: border.color }} /></main>;
  if (!data) return <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: background.color }}><div className="rounded-2xl p-8 text-center" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}><AlertCircle className="mx-auto mb-3 text-red-500" size={40} /><h1 className="font-semibold" style={{ color: foreground.color }}>Dashboard unavailable</h1><p className="text-sm mt-2" style={{ color: mutedForeground.color }}>We could not load your delivery data.</p><button onClick={() => fetchData(true)} className="mt-5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: primary.color, color: primaryForeground.color }}>Try again</button></div></main>;

  const { summary = {}, recentEmails = [], pagination } = data;
  const stats = [
    { label: "Total sent", value: summary.totalEmails || 0, icon: Send, tone: primary.color },
    { label: "Delivered", value: summary.sentEmails || 0, icon: CheckCircle2, tone: "#16a34a" },
    { label: "Needs attention", value: summary.failedEmails || 0, icon: XCircle, tone: "#dc2626" },
    { label: "In queue", value: summary.pendingEmails || 0, icon: Clock3, tone: "#d97706" },
  ];
  const chartData = [{ name: "Delivered", value: summary.sentEmails || 0 }, { name: "Failed", value: summary.failedEmails || 0 }, { name: "Queued", value: summary.pendingEmails || 0 }];
  const pieData = [{ name: "Delivered", value: summary.sentEmails || 0, color: "#16a34a" }, { name: "Failed", value: summary.failedEmails || 0, color: "#dc2626" }, { name: "Queued", value: summary.pendingEmails || 0, color: "#d97706" }];

  const statusStyle = (status) => status === "sent" ? { backgroundColor: "rgba(22,163,74,.12)", color: "#15803d", icon: CheckCircle2 } : status === "failed" ? { backgroundColor: "rgba(220,38,38,.1)", color: "#b91c1c", icon: XCircle } : { backgroundColor: "rgba(217,119,6,.12)", color: "#b45309", icon: Clock3 };

  return (
    <main className="min-h-screen px-4 py-6 md:px-6 md:py-8" style={{ backgroundColor: background.color, color: foreground.color }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="rounded-2xl p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-5" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}>
          <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em]" style={{ color: primary.color }}><Activity size={15} />Delivery command center</div><h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-3" style={{ color: foreground.color }}>Email performance, at a glance.</h1><p className="text-sm mt-2 max-w-xl" style={{ color: mutedForeground.color }}>A clear view of your queue, delivery health, and the latest messages moving through SMTPLite.</p></div>
          <div className="flex items-center gap-2"><div className="hidden sm:block text-right mr-2"><p className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: mutedForeground.color }}>Last sync</p><p className="text-sm font-medium mt-1" style={{ color: foreground.color }}>{lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}</p></div><button onClick={() => fetchData(true)} disabled={refreshing} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: primary.color, color: primaryForeground.color }}><RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />{refreshing ? "Refreshing" : "Refresh"}</button></div>
        </header>

        <section className="grid grid-cols-2 xl:grid-cols-4 gap-3" aria-label="Email summary">
          {stats.map(({ label, value, icon: Icon, tone }) => <div key={label} className="rounded-2xl p-4 md:p-5" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}><div className="flex items-center justify-between"><span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${tone}18`, color: tone }}><Icon size={18} /></span><ArrowUpRight size={15} style={{ color: mutedForeground.color }} /></div><p className="text-xs font-semibold mt-5" style={{ color: mutedForeground.color }}>{label}</p><p className="text-2xl md:text-3xl font-bold mt-1" style={{ color: foreground.color }}>{value.toLocaleString()}</p></div>)}
        </section>

        <section className="grid xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 rounded-2xl p-5 md:p-6" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}><div className="flex items-center justify-between mb-5"><div><h2 className="font-bold" style={{ color: foreground.color }}>Delivery mix</h2><p className="text-xs mt-1" style={{ color: mutedForeground.color }}>Current message outcomes</p></div><span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: secondary.color, color: mutedForeground.color }}>Live view</span></div><ResponsiveContainer width="100%" height={245}><BarChart data={chartData} barCategoryGap="28%"><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: mutedForeground.color, fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: mutedForeground.color, fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: card.color, border: `1px solid ${border.color}`, borderRadius: 12, color: foreground.color }} cursor={{ fill: hover.background }} /><Bar dataKey="value" fill={primary.color} radius={[7, 7, 2, 2]} /></BarChart></ResponsiveContainer></div>
          <div className="xl:col-span-2 rounded-2xl p-5 md:p-6" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}><h2 className="font-bold" style={{ color: foreground.color }}>Queue health</h2><p className="text-xs mt-1" style={{ color: mutedForeground.color }}>How your messages are distributed</p><div className="h-[245px] relative"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={86} paddingAngle={3}>{pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ backgroundColor: card.color, border: `1px solid ${border.color}`, borderRadius: 12 }} /><Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, color: foreground.color }} /></PieChart></ResponsiveContainer><div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-5"><div className="text-center"><p className="text-2xl font-bold" style={{ color: foreground.color }}>{summary.totalEmails || 0}</p><p className="text-[10px] uppercase tracking-wide" style={{ color: mutedForeground.color }}>messages</p></div></div></div></div>
        </section>

        {summary.lastSent && <section className="rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5" style={{ backgroundColor: primary.color, color: primaryForeground.color }}><div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,.16)" }}><Mail size={21} /></div><div className="flex-1 min-w-0"><p className="text-xs uppercase tracking-[.16em] opacity-70 font-semibold">Latest delivery</p><p className="font-semibold mt-1 truncate">{summary.lastSent.subject || "Untitled message"}</p><p className="text-sm opacity-75 mt-1 truncate">{summary.lastSent.to}</p></div><div className="text-sm opacity-80 flex items-center gap-2"><Calendar size={15} />{new Date(summary.lastSent.createdAt).toLocaleString()}</div></section>}

        <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}><div className="p-5 md:p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={{ borderColor: border.color }}><div><h2 className="font-bold" style={{ color: foreground.color }}>Recent activity</h2><p className="text-xs mt-1" style={{ color: mutedForeground.color }}>Select a message to inspect its delivery trail.</p></div><div className="flex items-center gap-2"><div className="flex items-center gap-2"><Filter size={15} style={{ color: mutedForeground.color }} /><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: secondary.color, color: secondaryForeground.color, border: `1px solid ${border.color}` }}><option value="all">All statuses</option><option value="sent">Delivered</option><option value="failed">Failed</option><option value="pending">Queued</option></select></div><button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: secondary.color, color: secondaryForeground.color, border: `1px solid ${border.color}` }}><Download size={15} />Export</button></div></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[680px]"><thead><tr style={{ backgroundColor: secondary.color }}><th className="text-left px-5 py-3 text-[11px] uppercase tracking-wide" style={{ color: mutedForeground.color }}>Message</th><th className="text-left px-5 py-3 text-[11px] uppercase tracking-wide" style={{ color: mutedForeground.color }}>Recipient</th><th className="text-left px-5 py-3 text-[11px] uppercase tracking-wide" style={{ color: mutedForeground.color }}>Status</th><th className="text-left px-5 py-3 text-[11px] uppercase tracking-wide" style={{ color: mutedForeground.color }}>Created</th></tr></thead><tbody>{recentEmails.length === 0 ? <tr><td colSpan="4" className="text-center py-14" style={{ color: mutedForeground.color }}><Mail size={32} className="mx-auto mb-2 opacity-40" /><p className="text-sm">No messages found</p></td></tr> : recentEmails.map((email, index) => { const status = statusStyle(email.status); const StatusIcon = status.icon; return <tr key={email._id} onClick={() => setSelectedEmail(email)} className="cursor-pointer transition-colors" style={{ borderTop: `1px solid ${border.color}`, backgroundColor: index % 2 ? hover.background : "transparent" }}><td className="px-5 py-4"><p className="font-semibold text-sm truncate max-w-[260px]" style={{ color: foreground.color }}>{email.subject || "(No subject)"}</p><p className="text-xs mt-1" style={{ color: mutedForeground.color }}>{email.from || "SMTPLite"}</p></td><td className="px-5 py-4 text-sm max-w-[240px] truncate" style={{ color: foreground.color }}>{email.to}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: status.backgroundColor, color: status.color }}><StatusIcon size={13} />{email.status === "sent" ? "Delivered" : email.status === "failed" ? "Failed" : "Queued"}</span></td><td className="px-5 py-4 text-xs whitespace-nowrap" style={{ color: mutedForeground.color }}>{new Date(email.createdAt).toLocaleString()}</td></tr>; })}</tbody></table></div>
          {pagination && pagination.totalPages > 1 && <div className="p-4 md:px-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: border.color }}><p className="text-xs" style={{ color: mutedForeground.color }}>Page {pagination.page} of {pagination.totalPages} · {pagination.totalFiltered} messages</p><div className="flex items-center gap-1">{[<button key="prev" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="p-2 rounded-lg disabled:opacity-40" style={{ backgroundColor: secondary.color, color: secondaryForeground.color }}><ChevronLeft size={16} /></button>, <span key="page" className="px-3 text-sm font-semibold" style={{ color: foreground.color }}>{currentPage}</span>, <button key="next" onClick={() => setCurrentPage((page) => Math.min(pagination.totalPages, page + 1))} disabled={currentPage === pagination.totalPages} className="p-2 rounded-lg disabled:opacity-40" style={{ backgroundColor: secondary.color, color: secondaryForeground.color }}><ChevronRight size={16} /></button>]}</div></div>}
        </section>
      </div>
      {selectedEmail && <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15,23,42,.52)" }} onClick={() => setSelectedEmail(null)}><div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }} onClick={(event) => event.stopPropagation()}><div className="flex justify-between gap-4 mb-6"><div><p className="text-xs uppercase tracking-[.16em] font-bold" style={{ color: primary.color }}>Delivery record</p><h2 className="text-xl font-bold mt-2" style={{ color: foreground.color }}>{selectedEmail.subject || "(No subject)"}</h2><p className="text-xs mt-1 break-all" style={{ color: mutedForeground.color }}>{selectedEmail._id}</p></div><button onClick={() => setSelectedEmail(null)} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: secondary.color, color: foreground.color }}><X size={17} /></button></div><div className="grid sm:grid-cols-2 gap-3">{[["From", selectedEmail.from], ["To", selectedEmail.to], ["Status", selectedEmail.status], ["Attempts", selectedEmail.attempts || 0], ["Queued", selectedEmail.createdAt && new Date(selectedEmail.createdAt).toLocaleString()], ["Updated", selectedEmail.updatedAt && new Date(selectedEmail.updatedAt).toLocaleString()]].map(([label, value]) => <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: background.color, border: `1px solid ${border.color}` }}><p className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: mutedForeground.color }}>{label}</p><p className="text-sm mt-1 break-words" style={{ color: foreground.color }}>{value || "—"}</p></div>)}</div><div className="mt-6"><h3 className="font-semibold mb-3" style={{ color: foreground.color }}>Delivery trail</h3><div className="space-y-2">{(selectedEmail.events?.length ? selectedEmail.events : [{ status: "queued", at: selectedEmail.createdAt }, { status: selectedEmail.status, at: selectedEmail.updatedAt }]).map((event, index) => <div key={`${event.status}-${event.at}-${index}`} className="flex items-center gap-3 text-sm"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: event.status === "failed" ? "#dc2626" : event.status === "sent" ? "#16a34a" : primary.color }} /><span className="capitalize font-medium" style={{ color: foreground.color }}>{event.status}</span><span style={{ color: mutedForeground.color }}>{event.at ? new Date(event.at).toLocaleString() : "—"}</span>{event.error && <span className="text-red-600 truncate">{event.error}</span>}</div>)}</div></div>{selectedEmail.lastError && <div className="mt-5 p-4 rounded-xl text-sm text-red-600" style={{ backgroundColor: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.2)" }}><strong>Latest error:</strong> {selectedEmail.lastError}</div>}</div></div>}
    </main>
  );
};

export default Dashboard;
