"use client";

import { useMemo, useState } from "react";

type Crop = {
  id: number;
  name: string;
  variety: string;
  field: string;
  planted: string;
  harvest: string;
  stage: string;
  progress: number;
  estimate: number;
  ready: number;
  quality: string;
  updated: string;
  color: string;
  symbol: string;
};

const initialCrops: Crop[] = [
  { id: 1, name: "Maize", variety: "White maize · PAN 6Q-445B", field: "Field 03 · Makhanda", planted: "12 Jun 2026", harvest: "18–25 Nov", stage: "Grain fill", progress: 76, estimate: 2.8, ready: 0, quality: "On track", updated: "Today, 08:42", color: "gold", symbol: "✳" },
  { id: 2, name: "Butternut", variety: "Waltham · Organic", field: "Field 01 · Makhanda", planted: "28 Jul 2026", harvest: "02–09 Dec", stage: "Fruit development", progress: 54, estimate: 1.4, ready: 0, quality: "On track", updated: "Yesterday", color: "orange", symbol: "◒" },
  { id: 3, name: "Spinach", variety: "Fordhook Giant", field: "Tunnel 02 · Makhanda", planted: "05 Sep 2026", harvest: "Ready now", stage: "Harvesting", progress: 100, estimate: 0.42, ready: 0.28, quality: "Grade A", updated: "Today, 07:15", color: "green", symbol: "✿" },
];

const navItems = [
  { label: "Overview", icon: "⌂" },
  { label: "My crops", icon: "♧" },
  { label: "Harvest plan", icon: "▤" },
  { label: "Market", icon: "◈" },
];

function Brand() {
  return <div className="brand"><span className="brand-mark">♧</span><span><strong>Agri<span>-Mart</span></strong><small>GROW TOGETHER</small></span></div>;
}

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="nav-icon" aria-hidden="true">{children}</span>;
}

function CropModal({ onClose, onSave }: { onClose: () => void; onSave: (crop: Crop) => void }) {
  const [name, setName] = useState("Tomatoes");
  const [field, setField] = useState("Field 04 · Makhanda");
  const [hectares, setHectares] = useState("0.5");
  const [harvest, setHarvest] = useState("2026-12-15");
  const [estimate, setEstimate] = useState("1.2");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const readableDate = new Date(`${harvest}T12:00:00`).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
    onSave({ id: Date.now(), name, variety: "New planting · Farmer recorded", field: `${field} · ${hectares} ha`, planted: "Today", harvest: readableDate, stage: "Seedling", progress: 12, estimate: Number(estimate), ready: 0, quality: "New entry", updated: "Just now", color: "red", symbol: "●" });
  }

  return <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="crop-modal-title"><div className="modal-heading"><div><span className="eyebrow">FARM RECORD</span><h2 id="crop-modal-title">Add a crop</h2></div><button className="icon-button" onClick={onClose} aria-label="Close">×</button></div><p className="modal-copy">Start tracking a planting. You can add progress updates as it grows.</p><form onSubmit={submit} className="form-grid"><label>Crop name<input value={name} onChange={(event) => setName(event.target.value)} required /></label><label>Field / location<input value={field} onChange={(event) => setField(event.target.value)} required /></label><label>Area planted (ha)<input type="number" min="0.1" step="0.1" value={hectares} onChange={(event) => setHectares(event.target.value)} required /></label><label>Expected harvest<input type="date" value={harvest} onChange={(event) => setHarvest(event.target.value)} required /></label><label className="full-field">Estimated yield (tonnes)<input type="number" min="0.1" step="0.1" value={estimate} onChange={(event) => setEstimate(event.target.value)} required /></label><div className="modal-actions"><button type="button" className="button button-light" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">Save crop <span>↗</span></button></div></form></section></div>;
}

function FarmerMobile({ crops, onAdd, onUpdate }: { crops: Crop[]; onAdd: () => void; onUpdate: (crop: Crop) => void }) {
  return <div className="farmer-mobile-home">
    <section className="mobile-weather-hero"><div className="weather-sky"><span className="weather-place"><span>⌖</span> Makhanda, Eastern Cape</span><span className="weather-avatar">TM</span></div><div className="weather-content"><span className="mobile-greeting">Good morning, Thandi</span><div className="weather-reading"><strong>21°</strong><span>☀ <b>Mostly sunny</b><small>Saturday · 17 Oct</small></span></div><div className="weather-chips"><span>⌁ &nbsp;12 km/h</span><span>◉ &nbsp;61% humidity</span></div></div><div className="weather-foot"><span>Area weather snapshot</span><span>Sample data</span></div></section>
    <section className="mobile-tasks-section"><div className="mobile-section-heading"><div><span className="eyebrow">YOUR FARM PLAN</span><h2>Today’s tasks <span className="count-badge">2</span></h2></div></div><div className="mobile-task-strip"><article className="mobile-task-card task-priority"><span className="task-time">◷ &nbsp; 7:30 AM</span><strong>Watering<br/>Field 03 · Maize</strong><span className="task-status progress-status"><i/> In progress</span></article><article className="mobile-task-card"><span className="task-time">◷ &nbsp; 9:00 AM</span><strong>Update crop<br/>growth record</strong><button className="task-status due-status" onClick={()=>onUpdate(crops[0])}>Record now <span>→</span></button></article><article className="mobile-task-card"><span className="task-time">◷ &nbsp; 11:30 AM</span><strong>Prepare spinach<br/>for collection</strong><span className="task-status done-status">Harvest-ready</span></article></div></section>
    <section className="mobile-fields-section"><div className="mobile-section-heading"><div><span className="eyebrow">SEASON 2026</span><h2>My growing fields <span className="count-badge">{crops.length}</span></h2></div><button className="mobile-small-link" onClick={onAdd}>+ Add crop</button></div><div className="mobile-field-list">{crops.map((crop,index)=><article className="mobile-field-card" key={crop.id}><div className={`field-photo field-photo-${index%3}`}><span className="field-crop-icon">{crop.symbol}</span><span className={`field-badge ${crop.ready>0?"field-badge-ready":""}`}>{crop.ready>0?"Harvesting":"Growing"}</span></div><div className="mobile-field-info"><div className="field-title-row"><div><strong>{crop.name} · {crop.field.split("·")[0].trim()}</strong><small>{crop.variety}</small></div><button className="field-more" aria-label={`More options for ${crop.name}`} onClick={()=>onUpdate(crop)}>···</button></div><div className="field-location">⌖ &nbsp;Eastern Cape, Makhanda</div><div className="field-progress-head"><span>{crop.stage}</span><b>{crop.progress}%</b></div><div className="field-progress"><i style={{width:`${crop.progress}%`}}/></div><div className="field-bottom"><span>◷ &nbsp;{crop.harvest === "Ready now" ? "Ready to harvest" : `Expected ${crop.harvest}`}</span><span>◈ &nbsp;{crop.estimate.toFixed(1)} t est.</span></div>{crop.ready>0&&<div className="field-ready-stock"><span>Sale-ready stock</span><strong>{crop.ready.toFixed(2)} t</strong><button onClick={()=>onUpdate(crop)}>Update quantity</button></div>}</div></article>)}</div></section>
    <section className="mobile-growth-note"><span className="growth-note-icon">✦</span><div><strong>Keep your harvest forecast up to date</strong><p>Recent growth notes help buyers prepare before harvest.</p></div><button onClick={()=>onUpdate(crops[0])}>Update <span>→</span></button></section>
  </div>;
}

export default function Home() {
  const [role, setRole] = useState<"farmer" | "buyer">("farmer");
  const [crops, setCrops] = useState<Crop[]>(initialCrops);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All crops");
  const [showCropModal, setShowCropModal] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [toast, setToast] = useState("");
  const [updatedCrop, setUpdatedCrop] = useState<number | null>(null);

  const filteredCrops = useMemo(() => crops.filter((crop) => `${crop.name} ${crop.variety} ${crop.field}`.toLowerCase().includes(search.toLowerCase()) && (filter === "All crops" || crop.stage === filter)), [crops, search, filter]);
  const totalEstimate = crops.reduce((total, crop) => total + crop.estimate, 0);
  const readyStock = crops.reduce((total, crop) => total + crop.ready, 0);
  const buyerRows = crops.map((crop) => ({
    name: crop.name,
    variety: crop.variety,
    region: crop.field.split("·").at(-1)?.trim() ?? "Farm location not set",
    farms: 1,
    forecast: crop.harvest,
    expected: `${crop.estimate.toFixed(1)} t`,
    ready: `${crop.ready.toFixed(2)} t`,
    quality: crop.ready > 0 ? "Farmer confirmed" : "Farmer reported",
    icon: crop.symbol,
    color: crop.color,
    verified: false,
  }));
  const enterpriseCrops = buyerRows;
  const buyerSearchRows = buyerRows.filter((crop) => `${crop.name} ${crop.variety} ${crop.region}`.toLowerCase().includes(search.toLowerCase()));
  const buyerMonths = ["OCT", "NOV", "DEC", "JAN", "FEB", "MAR"].map((month) => {
    const monthCrops = crops.filter((crop) => crop.harvest === "Ready now" ? month === "OCT" : crop.harvest.toUpperCase().includes(month));
    return { month, expected: monthCrops.reduce((total, crop) => total + crop.estimate, 0), ready: monthCrops.reduce((total, crop) => total + crop.ready, 0) };
  });
  const maxMonthlyYield = Math.max(1, ...buyerMonths.map((month) => month.expected));
  const peakMonth = buyerMonths.reduce((peak, month) => month.expected > peak.expected ? month : peak, buyerMonths[0]);
  const currentRecordCount = crops.filter((crop) => crop.updated.includes("Today") || crop.updated.includes("Just now")).length;
  const currentRecordPercent = crops.length ? Math.round(currentRecordCount / crops.length * 100) : 0;

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  function addCrop(crop: Crop) {
    setCrops((current) => [crop, ...current]);
    setShowCropModal(false);
    flash(`${crop.name} added to your crop records`);
  }

  function recordUpdate(crop: Crop) {
    setUpdatedCrop(crop.id);
    setCrops((current) => current.map((item) => item.id === crop.id ? { ...item, updated: "Just now", progress: Math.min(100, item.progress + 4) } : item));
    flash(`Growth update saved for ${crop.name}`);
    window.setTimeout(() => setUpdatedCrop(null), 600);
  }

  return <div className="app-shell">
    <aside className="sidebar"><Brand /><div className="workspace-label">FARM WORKSPACE</div><nav className="side-nav" aria-label="Main navigation">{navItems.map((item) => <button key={item.label} className={`nav-link ${activeNav === item.label ? "active" : ""}`} onClick={() => setActiveNav(item.label)}><Icon>{item.icon}</Icon>{item.label}{item.label === "Harvest plan" && <span className="nav-count">3</span>}</button>)}</nav><div className="sidebar-spacer" /><div className="side-help"><span className="help-leaf">♧</span><strong>Growing takes a team.</strong><p>Get help with crop records or your next harvest.</p><button onClick={() => flash("A local support request would start here.")}>Visit help centre <span>↗</span></button></div><button className="profile-button" onClick={() => flash("Farmer profile") }><span className="avatar">TM</span><span><strong>Thandi Mbeki</strong><small>Smallholder farmer</small></span><span className="profile-more">···</span></button></aside>

    <main className="main-panel">
      <header className="topbar"><div className="mobile-brand"><Brand /></div><div className="breadcrumb"><span>Farm workspace</span><b>/</b><strong>{role === "farmer" ? activeNav : "Supply overview"}</strong></div><div className="top-actions"><div className="role-switch" aria-label="Switch dashboard view"><button className={role === "farmer" ? "selected" : ""} onClick={() => setRole("farmer")}>Farmer</button><button className={role === "buyer" ? "selected" : ""} onClick={() => setRole("buyer")}>Enterprise</button></div><button className="icon-button notification-button" aria-label="Notifications" onClick={() => flash("You’re all caught up.")}>♧<i /></button><span className="avatar top-avatar">TM</span></div></header>

      <div className="page-content">
        {role === "farmer" ? <>
          <div className="farmer-desktop">
          <section className="welcome-row"><div><div className="date-line"><span className="status-dot" /> YOUR FARM, AT A GLANCE <span className="date-divider">/</span> SATURDAY, 17 OCTOBER 2026</div><h1>Good morning, Thandi <span className="wave">✳</span></h1><p className="subheading">Small updates today make for a more reliable harvest tomorrow.</p></div><button className="button button-primary add-crop" onClick={() => setShowCropModal(true)}><span className="plus">＋</span> Add a crop</button></section>

          <section className="stat-grid" aria-label="Farm summary"><article className="stat-card"><div className="stat-top"><span className="stat-icon leaf-bg">♧</span><span className="stat-change">↗ 2 this season</span></div><div className="stat-number">{crops.length.toString().padStart(2, "0")}<span> active crops</span></div><div className="stat-foot">Across 3 growing areas</div></article><article className="stat-card"><div className="stat-top"><span className="stat-icon gold-bg">◉</span><span className="stat-tag">ESTIMATED</span></div><div className="stat-number">{totalEstimate.toFixed(1)}<span> t</span></div><div className="stat-foot">Forecast yield this season</div></article><article className="stat-card"><div className="stat-top"><span className="stat-icon mint-bg">▣</span><span className="stat-tag green-tag">SALE-READY</span></div><div className="stat-number">{readyStock.toFixed(2)}<span> t</span></div><div className="stat-foot">Confirmed harvest stock</div></article></section>

          <div className="dashboard-grid"><section className="panel growth-panel"><div className="panel-header"><div><span className="eyebrow">SEASON PROGRESS</span><h2>Crop growth &amp; harvest outlook</h2><p className="panel-desc">Your reported progress helps buyers plan ahead.</p></div><button className="period-select" onClick={() => flash("Showing the current growing season")}>This season <span>⌄</span></button></div><div className="chart-legend"><span><i className="legend-forecast" /> Expected yield</span><span><i className="legend-harvest" /> Harvested</span><span className="chart-period">JUN <span>JUL</span> AUG <span>SEP</span> OCT <span>NOV</span> DEC</span></div><div className="chart-wrap"><svg className="yield-chart" viewBox="0 0 760 190" role="img" aria-label="Expected yield rises from June to December, with current harvest beginning in October"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#cfe7a3" stopOpacity=".55"/><stop offset="100%" stopColor="#cfe7a3" stopOpacity="0"/></linearGradient></defs><line x1="0" y1="34" x2="760" y2="34" className="grid-line"/><line x1="0" y1="84" x2="760" y2="84" className="grid-line"/><line x1="0" y1="134" x2="760" y2="134" className="grid-line"/><path d="M0 158 C68 152 82 141 126 144 S197 125 253 129 S324 109 380 110 S452 81 507 83 S580 59 633 61 S705 35 760 29 L760 190 L0 190 Z" fill="url(#chartFill)"/><path d="M0 158 C68 152 82 141 126 144 S197 125 253 129 S324 109 380 110 S452 81 507 83 S580 59 633 61 S705 35 760 29" className="yield-line"/><path d="M0 188 L760 188" className="harvest-line"/><circle cx="507" cy="83" r="5" className="chart-point"/><line x1="507" y1="30" x2="507" y2="174" className="today-line"/><rect x="472" y="4" width="70" height="22" rx="11" className="today-pill"/><text x="507" y="19" textAnchor="middle" className="today-label">TODAY</text></svg></div><div className="chart-foot"><span><b>2.8 t</b> expected in the next 30 days</span><button onClick={() => setActiveNav("Harvest plan")}>View harvest plan <span>→</span></button></div></section>

          <aside className="panel update-panel"><div className="panel-header compact-header"><div><span className="eyebrow">YOUR NEXT STEP</span><h2>Keep records fresh</h2></div><span className="pulse-dot" /></div><p className="update-copy">A recent update gives buyers confidence in your harvest timeline.</p><div className="update-reminder"><span className="reminder-icon">◷</span><span><strong>Butternut · Field 01</strong><small>Update due · 2 days ago</small></span><button onClick={() => recordUpdate(crops.find((crop) => crop.name === "Butternut") ?? crops[0])} aria-label="Record butternut growth update">→</button></div><div className="update-reminder"><span className="reminder-icon">◷</span><span><strong>Maize · Field 03</strong><small>Next check-in · Today</small></span><button onClick={() => recordUpdate(crops.find((crop) => crop.name === "Maize") ?? crops[0])} aria-label="Record maize growth update">→</button></div><div className="update-note"><span>✦</span> Just a photo and a quick note can update your crop’s progress.</div></aside></div>

          <section className="panel crops-panel"><div className="panel-header crops-heading"><div><span className="eyebrow">GROWING NOW</span><h2>Your crop records <span className="count-badge">{crops.length}</span></h2></div><div className="crop-tools"><label className="search-box"><span>⌕</span><input aria-label="Search crops" placeholder="Search crops" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="filter-select" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter by crop stage"><option>All crops</option><option>Grain fill</option><option>Fruit development</option><option>Harvesting</option><option>Seedling</option></select><button className="text-link desktop-link" onClick={() => setActiveNav("My crops")}>View all <span>→</span></button></div></div>
            <div className="crop-table-wrap"><table className="crop-table"><thead><tr><th>Crop / field</th><th>Growth stage</th><th>Expected harvest</th><th>Yield forecast</th><th>Stock status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filteredCrops.map((crop) => <tr key={crop.id} className={updatedCrop === crop.id ? "row-flash" : ""}><td><div className="crop-cell"><span className={`crop-avatar ${crop.color}`}>{crop.symbol}</span><span><strong>{crop.name}</strong><small>{crop.field}</small></span></div></td><td><span className="stage-label">{crop.stage}</span><div className="progress-row"><span className="progress-track"><i style={{ width: `${crop.progress}%` }} /></span><small>{crop.progress}%</small></div></td><td><strong className="harvest-date">{crop.harvest}</strong><small className="table-sub">Planted {crop.planted}</small></td><td><strong>{crop.estimate.toFixed(1)} t</strong><small className="table-sub">Farmer estimate</small></td><td>{crop.ready > 0 ? <><span className="stock-pill ready-pill"><i />{crop.ready.toFixed(2)} t ready</span><small className="table-sub">{crop.quality}</small></> : <><span className="stock-pill forecast-pill"><i />In field</span><small className="table-sub">No sale stock yet</small></>}</td><td><button className="row-action" onClick={() => recordUpdate(crop)} title={`Record a growth update for ${crop.name}`}>＋ <span>Update</span></button></td></tr>)}</tbody></table>{filteredCrops.length === 0 && <div className="empty-state">No crops match that search. Try another name or stage.</div>}</div><div className="table-footer"><span>Last synced just now <span className="sync-mark">●</span></span><button onClick={() => flash("You’re viewing all current crop records.")}>See all crop records <span>→</span></button></div></section>

          <footer className="page-footer"><span>Agri-Mart supports better planning, one crop update at a time.</span><span>Need help? <button onClick={() => flash("Help centre")}>Talk to our team</button></span></footer>
          </div>
          <FarmerMobile crops={crops} onAdd={() => setShowCropModal(true)} onUpdate={recordUpdate} />
        </> : <>
          <section className="welcome-row buyer-welcome"><div><div className="date-line"><span className="status-dot" /> ENTERPRISE SUPPLY VIEW <span className="date-divider">/</span> EASTERN CAPE</div><h1>Plan your next harvest.</h1><p className="subheading">A clearer view of what’s growing, when it may be ready, and what’s confirmed.</p></div><button className="button button-primary" onClick={() => flash("Your supply report is being prepared.")}>Download report <span>↓</span></button></section>
          <section className="buyer-banner"><div className="banner-copy"><span className="eyebrow">SUPPLY SNAPSHOT · 17 OCT 2026</span><h2>Growing supply, <em>visible earlier.</em></h2><p>Plan sourcing around farmer-reported progress. Harvest forecasts are estimates until quantities are confirmed after harvest.</p><button onClick={() => flash("Supply forecast details")}>Explore supply outlook <span>→</span></button></div><div className="banner-illustration"><div className="sun"/><div className="hill hill-back"/><div className="hill hill-front"/><div className="field-lines"/><div className="banner-data"><span>Expected this season</span><strong>{totalEstimate.toFixed(1)} <small>tonnes</small></strong><small><i /> {crops.length} crop records</small></div></div></section>
          <section className="stat-grid buyer-stat-grid"><article className="stat-card"><div className="stat-top"><span className="stat-icon leaf-bg">♧</span><span className="stat-tag">FARMER FORECAST</span></div><div className="stat-number">{totalEstimate.toFixed(1)}<span> t</span></div><div className="stat-foot">Expected over the next 8 weeks</div></article><article className="stat-card"><div className="stat-top"><span className="stat-icon mint-bg">▣</span><span className="stat-tag green-tag">CONFIRMED</span></div><div className="stat-number">{readyStock.toFixed(2)}<span> t</span></div><div className="stat-foot">Harvested and sale-ready</div></article><article className="stat-card"><div className="stat-top"><span className="stat-icon gold-bg">♧</span><span className="stat-tag">ACTIVE NETWORK</span></div><div className="stat-number">1<span> farmer</span></div><div className="stat-foot">With farmer-recorded locations</div></article><article className="stat-card"><div className="stat-top"><span className="stat-icon orange-bg">✳</span><span className="stat-tag orange-tag">GROWING</span></div><div className="stat-number">{crops.length}<span> crops</span></div><div className="stat-foot">With farmer progress records</div></article></section>
          <div className="dashboard-grid buyer-dash-grid"><section className="panel growth-panel buyer-chart-panel"><div className="panel-header"><div><span className="eyebrow">UPCOMING AVAILABILITY</span><h2>Expected supply by month</h2><p className="panel-desc">Forecast quantities from active farmer records.</p></div><button className="period-select" onClick={() => flash("Showing the next 6 months")}>Next 6 months <span>⌄</span></button></div><div className="buyer-chart-legend"><span><i className="legend-forecast"/>Forecast</span><span><i className="legend-confirmed"/>Confirmed</span></div><div className="bar-chart" role="img" aria-label="Monthly forecast versus confirmed crop supply from October to March"><div className="bar-grid"><i/><i/><i/><i/></div>{buyerMonths.map((item)=><div className="bar-group" key={item.month}><div className="bars"><i className="bar-forecast" style={{height:`${item.expected / maxMonthlyYield * 90}%`}}/><i className="bar-confirmed" style={{height:`${item.ready / maxMonthlyYield * 90}%`}}/></div><small>{item.month}</small></div>)}</div><div className="buyer-chart-foot"><span>Peak expected availability <strong>{peakMonth.month} · {peakMonth.expected.toFixed(1)} t</strong></span><span className="reported-note"><i/> Forecasts are farmer reported</span></div></section><aside className="panel reliability-panel"><div><span className="eyebrow">SUPPLIER VISIBILITY</span><h2>Progress is being tracked</h2><p>Most active suppliers have updated their crop records this week.</p></div><div className="reliability-score"><div className="score-ring"><strong>{currentRecordPercent}<small>%</small></strong></div><span>Records current</span></div><div className="reliability-bottom"><span><i className="green-dot"/> {currentRecordCount} records current</span><span><i className="amber-dot"/> {Math.max(0, crops.length - currentRecordCount)} need an update</span></div><button onClick={() => flash("Opening supplier records")}>View supplier records <span>→</span></button></aside></div>
          <section className="panel supply-panel"><div className="panel-header crops-heading"><div><span className="eyebrow">BUYER SOURCING</span><h2>Available &amp; upcoming crops <span className="count-badge">{crops.length}</span></h2></div><div className="crop-tools"><label className="search-box"><span>⌕</span><input aria-label="Search supply" placeholder="Search crops or region" value={search} onChange={(event) => setSearch(event.target.value)} /></label><button className="filter-select filter-button" onClick={() => flash("Filters: crop, region, harvest date and quality")}>Filters <span>☷</span></button></div></div><div className="supply-list">{enterpriseCrops.filter((crop)=>`${crop.name} ${crop.variety} ${crop.region}`.toLowerCase().includes(search.toLowerCase())).map((crop)=><article className="supply-row" key={crop.name}><span className={`crop-avatar large ${crop.color}`}>{crop.icon}</span><div className="supply-product"><strong>{crop.name}</strong><span>{crop.variety}</span><small>{crop.region}</small></div><div className="supply-farms"><span>SUPPLIERS</span><strong>{crop.farms} farms</strong></div><div className="supply-harvest"><span>{crop.forecast.includes("now")?"AVAILABLE":"EXPECTED HARVEST"}</span><strong>{crop.forecast}</strong></div><div className="supply-amount"><span>ESTIMATED YIELD</span><strong>{crop.expected}</strong><small>Farmer-reported</small></div><div className="supply-amount confirmed-amount"><span>SALE-READY</span><strong>{crop.ready}</strong><small>Confirmed quantity</small></div><div className="quality-col"><span className={`quality-tag ${crop.verified?"verified":"reported"}`}><i/>{crop.quality}</span><button className="row-action buyer-action" onClick={() => flash(`Opening ${crop.name} supplier records`)}>Details →</button></div></article>)}</div><div className="buyer-disclaimer">Forecast yield is based on progress recorded by farmers and may change. Sale-ready quantity is confirmed after harvest.</div></section>
          <footer className="page-footer"><span>Supply data last refreshed today at 08:42.</span><span>Data questions? <button onClick={() => flash("Your account manager can help with sourcing data.")}>Contact your account manager</button></span></footer>
        </>}
      </div>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{(role === "farmer" ? [{label:"Home",icon:"⌂"},{label:"Fields",icon:"♧"},{label:"Updates",icon:"▤"},{label:"Alerts",icon:"◉"}] : [{label:"Overview",icon:"⌂"},{label:"Supply",icon:"◈"},{label:"Farms",icon:"♧"},{label:"Reports",icon:"▤"}]).map((item)=><button key={item.label} onClick={()=>{setActiveNav(item.label); if(item.label==="Supply") setRole("buyer");}} className={(activeNav===item.label||((activeNav==="Overview"||activeNav==="Home")&&item.label==="Home"))?"mobile-active":""}><span>{item.icon}</span><small>{item.label}</small></button>)}</nav>
    </main>
    {showCropModal && <CropModal onClose={() => setShowCropModal(false)} onSave={addCrop} />}
    {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
  </div>;
}
