"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  advertised?: boolean;
  updated: string;
  color: string;
  symbol: string;
  photo?: string;
  cropType?: string;
  cropName?: string;
  quantity?: number;
  quantityPlanted?: number;
  unit?: string;
  yieldPerUnit?: number;
  expectedYieldPerUnit?: number;
  unitYield?: string;
  daysToHarvest?: number;
  status?: "planted" | "growing" | "near_harvest";
  daysSincePlanting?: number;
  plantingDate?: string;
  estimatedHarvestDays?: number;
  currentAvailableQty?: number;
  availabilityNotes?: string;
  notes?: string;
  farmerId?: string;
};

type FarmerProfile = { name: string; farm: string; location: string; email: string };
type FarmerEnquiry = { id: string; enterpriseName: string; crop: string; quantity: string; message: string; createdAt: string; status: string };

const defaultProfile: FarmerProfile = {
  name: "Thandi Mbeki",
  farm: "Mbeki Family Farm",
  location: "Makhanda, Eastern Cape",
  email: "",
};

const initialCrops: Crop[] = [
  { id: 1, name: "Maize", variety: "White maize · PAN 6Q-445B", field: "Field 03 · Makhanda", planted: "12 Jun 2026", harvest: "18–25 Nov", stage: "Grain fill", progress: 76, estimate: 2.8, ready: 0, quality: "Grade pending", updated: "Today, 08:42", color: "gold", symbol: "✳" },
  { id: 2, name: "Butternut", variety: "Waltham · Organic", field: "Field 01 · Makhanda", planted: "28 Jul 2026", harvest: "02–09 Dec", stage: "Fruit development", progress: 54, estimate: 1.4, ready: 0, quality: "Grade pending", updated: "Yesterday", color: "orange", symbol: "◒" },
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
  const [cropType, setCropType] = useState("vegetable");
  const [field, setField] = useState("Field 04 · Makhanda");
  const [quantity, setQuantity] = useState("0.5");
  const [unit, setUnit] = useState("hectares");
  const [harvest, setHarvest] = useState("2026-12-15");
  const [daysToHarvest, setDaysToHarvest] = useState("90");
  const [estimate, setEstimate] = useState("1.2");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const readableDate = new Date(`${harvest}T12:00:00`).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
    const plantedQuantity = Number(quantity);
    const growingPeriod = Number(daysToHarvest);
    const daysSincePlanting = 8;
    const plantingDate = new Date(Date.now() - daysSincePlanting * 86400000);
    const unitYield = unit === "hectares" ? "kg/ha" : unit === "m2" ? "kg/m²" : `kg/${unit}`;
    const expectedYieldPerUnit = Number(((Number(estimate) * 1000) / plantedQuantity).toFixed(2));
    onSave({ id: Date.now(), name, cropName: name, cropType, variety: "New planting · Farmer recorded", field: `${field} · ${quantity} ${unit}`, planted: plantingDate.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }), harvest: readableDate, stage: "Seedling", progress: 12, estimate: Number(estimate), ready: 0, quality: "Grade pending", updated: "Just now", color: "red", symbol: "●", quantity: plantedQuantity, quantityPlanted: plantedQuantity, unit, yieldPerUnit: expectedYieldPerUnit, expectedYieldPerUnit, unitYield, daysToHarvest: growingPeriod, status: "planted", daysSincePlanting, plantingDate: plantingDate.toISOString().slice(0, 10), estimatedHarvestDays: growingPeriod, currentAvailableQty: 0, notes: `Farm location: ${field}`, availabilityNotes: undefined });
  }

  return <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="crop-modal-title"><div className="modal-heading"><div><span className="eyebrow">FARM RECORD</span><h2 id="crop-modal-title">Add a crop</h2></div><button className="icon-button" onClick={onClose} aria-label="Close">×</button></div><p className="modal-copy">Start tracking a planting. You can add progress updates as it grows.</p><form onSubmit={submit} className="form-grid"><label>Crop category<select value={cropType} onChange={(event) => setCropType(event.target.value)}><option value="grain">Grain</option><option value="vegetable">Vegetable</option><option value="fruit">Fruit</option><option value="legume">Legume</option><option value="other">Other</option></select></label><label>Crop name<input value={name} onChange={(event) => setName(event.target.value)} required /></label><label>Field / location<input value={field} onChange={(event) => setField(event.target.value)} required /></label><label>Quantity planted<input type="number" min="0.1" step="0.1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required /></label><label>Quantity unit<select value={unit} onChange={(event) => setUnit(event.target.value)}><option value="hectares">Hectares</option><option value="m2">Square metres</option><option value="plants">Plants</option><option value="kg seed">Kilograms of seed</option></select></label><label>Expected harvest<input type="date" value={harvest} onChange={(event) => setHarvest(event.target.value)} required /></label><label>Growing period (days)<input type="number" min="1" max="730" value={daysToHarvest} onChange={(event) => setDaysToHarvest(event.target.value)} required /></label><label className="full-field">Estimated yield (tonnes)<input type="number" min="0.1" step="0.1" value={estimate} onChange={(event) => setEstimate(event.target.value)} required /></label><div className="modal-actions"><button type="button" className="button button-light" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">Save crop <span>↗</span></button></div></form></section></div>;
}

function ProfileModal({ profile, onClose, onSave }: { profile: FarmerProfile; onClose: () => void; onSave: (profile: FarmerProfile) => void }) {
  const [draft, setDraft] = useState(profile);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
  }

  return <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
      <div className="modal-heading"><div><span className="eyebrow">YOUR ACCOUNT</span><h2 id="profile-modal-title">Farmer profile</h2></div><button className="icon-button" onClick={onClose} aria-label="Close profile">×</button></div>
      <p className="modal-copy">Keep your farm and contact details current for your crop records.</p>
      <form className="form-grid" onSubmit={submit}>
        <label className="full-field">Full name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label>
        <label className="full-field">Farm name<input value={draft.farm} onChange={(event) => setDraft({ ...draft, farm: event.target.value })} required /></label>
        <label className="full-field">Location<input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} required /></label>
        <label className="full-field">Email address <span className="optional-label">Optional</span><input type="email" placeholder="you@example.com" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
        <div className="profile-local-note">Profile details are saved on this device.</div>
        <div className="modal-actions"><button type="button" className="button button-light" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">Save profile <span>✓</span></button></div>
      </form>
    </section>
  </div>;
}

function GrowthUpdateModal({ crop, onClose, onSave }: { crop: Crop; onClose: () => void; onSave: (crop: Crop) => void }) {
  const [cropType, setCropType] = useState(crop.cropType ?? "vegetable");
  const [quantity, setQuantity] = useState(String(crop.quantity ?? crop.quantityPlanted ?? 1));
  const [unit, setUnit] = useState(crop.unit ?? "hectares");
  const [progress, setProgress] = useState(String(crop.progress));
  const [stage, setStage] = useState(crop.stage);
  const [estimate, setEstimate] = useState(String(crop.estimate));
  const [ready, setReady] = useState(String(crop.ready));
  const [quality, setQuality] = useState(crop.quality);
  const [advertised, setAdvertised] = useState(crop.advertised !== false);
  const [status, setStatus] = useState<NonNullable<Crop["status"]>>(crop.status ?? (crop.progress <= 12 ? "planted" : crop.progress >= 90 ? "near_harvest" : "growing"));
  const [daysToHarvest, setDaysToHarvest] = useState(String(crop.daysToHarvest ?? 90));
  const [availabilityNotes, setAvailabilityNotes] = useState(crop.availabilityNotes ?? "");
  const [notes, setNotes] = useState(crop.notes?.split(" · Farm location:")[0] ?? "");
  const plantingAge = status === "near_harvest" ? Math.max(Number(daysToHarvest) - 7, 0) : status === "planted" ? 8 : 28;
  const calculatedPlantingDate = new Date(Date.now() - plantingAge * 86400000).toISOString().slice(0, 10);
  const expectedHarvestDate = new Date(new Date(`${calculatedPlantingDate}T12:00:00`).getTime() + Number(daysToHarvest || 0) * 86400000);
  const expectedHarvestDateIso = expectedHarvestDate.toISOString().slice(0, 10);
  const expectedHarvestLabel = expectedHarvestDate.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const growingPeriod = Number(daysToHarvest);
    const daysSincePlanting = status === "near_harvest" ? Math.max(growingPeriod - 7, 0) : status === "planted" ? 8 : 28;
    const plantingDate = new Date(Date.now() - daysSincePlanting * 86400000).toISOString().slice(0, 10);
    const plantedQuantity = Number(quantity);
    const expectedYieldPerUnit = Number(((Number(estimate) * 1000) / plantedQuantity).toFixed(2));
    const unitYield = unit === "hectares" ? "kg/ha" : unit === "m2" ? "kg/m²" : `kg/${unit}`;
    const planted = new Date(`${plantingDate}T12:00:00`).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
    onSave({ ...crop, cropType, progress: Number(progress), stage, planted, plantingDate, harvest: expectedHarvestLabel, estimate: Number(estimate), ready: Number(ready), currentAvailableQty: Number(ready), quality, advertised, status, daysToHarvest: growingPeriod, estimatedHarvestDays: growingPeriod, daysSincePlanting, quantity: plantedQuantity, quantityPlanted: plantedQuantity, unit, yieldPerUnit: expectedYieldPerUnit, expectedYieldPerUnit, unitYield, availabilityNotes: status === "near_harvest" ? availabilityNotes : undefined, notes, updated: "Just now" });
  }

  return <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal growth-update-modal" role="dialog" aria-modal="true" aria-labelledby="growth-update-title">
      <div className="modal-heading"><div><span className="eyebrow">CROP RECORD · {crop.field}</span><h2 id="growth-update-title">Update {crop.name}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close crop update">×</button></div>
      <p className="modal-copy">Enter what you observed today. Saving refreshes the farmer record and the enterprise supply view in this browser.</p>
      <form onSubmit={submit} className="form-grid">
        <div className="full-field growth-indicator-summary"><span>Production indicators</span><strong>{quantity || "0"} {unit} planted · {Number(estimate || 0).toFixed(2)} t forecast</strong><small>{((Number(estimate || 0) * 1000) / Math.max(Number(quantity || 0), 0.1)).toLocaleString()} {unit === "hectares" ? "kg/ha" : unit === "m2" ? "kg/m²" : `kg/${unit}`} expected yield rate · {Math.max(Number(daysToHarvest || 0) - plantingAge, 0)} days to harvest</small></div>
        <label>Crop category<select value={cropType} onChange={(event) => setCropType(event.target.value)}><option value="grain">Grain</option><option value="vegetable">Vegetable</option><option value="fruit">Fruit</option><option value="legume">Legume</option><option value="other">Other</option></select></label>
        <label>Crop name<input value={crop.name} readOnly /></label>
        <label>Quantity planted<input type="number" min="0.1" step="0.1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required /></label>
        <label>Quantity unit<select value={unit} onChange={(event) => setUnit(event.target.value)}><option value="hectares">Hectares</option><option value="m2">Square metres</option><option value="plants">Plants</option><option value="kg seed">Kilograms of seed</option></select></label>
        <label>Growth progress (%)<input type="number" min="0" max="100" value={progress} onChange={(event) => setProgress(event.target.value)} required /></label>
        <label>Growth stage<select value={stage} onChange={(event) => setStage(event.target.value)}>{["Seedling", "Vegetative growth", "Flowering", "Fruit development", "Grain fill", "Maturing", "Harvesting"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Production status<select value={status} onChange={(event) => setStatus(event.target.value as NonNullable<Crop["status"]>)}><option value="planted">Planted</option><option value="growing">Growing</option><option value="near_harvest">Near harvest</option></select></label>
        <label>Growing period (days)<input type="number" min="1" max="730" value={daysToHarvest} onChange={(event) => setDaysToHarvest(event.target.value)} required /></label>
        <label>Calculated planting date<input type="date" value={calculatedPlantingDate} readOnly /><small>Estimated from production status and growing period.</small></label>
        <label>Expected harvest date<input type="date" value={expectedHarvestDateIso} readOnly /><small>Calculated from planting date + growing period.</small></label>
        <label>Expected total yield (tonnes)<input type="number" min="0.01" step="0.01" value={estimate} onChange={(event) => setEstimate(event.target.value)} required /></label>
        <label>Sale-ready quantity (tonnes)<input type="number" min="0" step="0.01" value={ready} onChange={(event) => setReady(event.target.value)} required /></label>
        <label>Quality / grade<input value={quality} onChange={(event) => setQuality(event.target.value)} required /></label>
        {status === "near_harvest" && <label className="full-field">Availability notes<input value={availabilityNotes} onChange={(event) => setAvailabilityNotes(event.target.value)} placeholder="Collection date, packing, or handling notes" /></label>}
        <label className="full-field">Production notes<input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Observations about this crop" /></label>
        <label className="availability-checkbox"><input type="checkbox" checked={advertised} onChange={(event) => setAdvertised(event.target.checked)} /> Advertise this crop to enterprise buyers</label>
        <div className="modal-actions"><button type="button" className="button button-light" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">Save crop update <span>✓</span></button></div>
      </form>
    </section>
  </div>;
}

function FarmerMobile({ crops, enquiries, firstName, onAdd, onUpdate, onPhoto, onOpenHarvestPlan, activeNav, selectedCropId }: { crops: Crop[]; enquiries: FarmerEnquiry[]; firstName: string; onAdd: () => void; onUpdate: (crop: Crop) => void; onPhoto: (cropId: number, file: File) => void; onOpenHarvestPlan: (cropId: number) => void; activeNav: string; selectedCropId: number | null }) {
  if (activeNav !== "Overview") {
    return <div className="farmer-mobile-workspace"><FarmerSecondaryPage page={activeNav} crops={crops} enquiries={enquiries} onAdd={onAdd} onUpdate={onUpdate} onOpenHarvestPlan={onOpenHarvestPlan} selectedCropId={selectedCropId} /></div>;
  }
  return <div className="farmer-mobile-home">
    <section className="mobile-weather-hero"><div className="weather-sky"><span className="weather-place"><span>⌖</span> Makhanda, Eastern Cape</span><span className="weather-avatar">TM</span></div><div className="weather-content"><span className="mobile-greeting">Good morning, {firstName}</span><div className="weather-reading"><strong>21°</strong><span>☀ <b>Mostly sunny</b><small>Saturday · 17 Oct</small></span></div><div className="weather-chips"><span>⌁ &nbsp;12 km/h</span><span>◉ &nbsp;61% humidity</span></div></div><div className="weather-foot"><span>Area weather snapshot</span><span>Sample data</span></div></section>
    <section className="mobile-tasks-section"><div className="mobile-section-heading"><div><span className="eyebrow">YOUR FARM PLAN</span><h2>Today’s tasks <span className="count-badge">2</span></h2></div></div><div className="mobile-task-strip"><article className="mobile-task-card task-priority"><span className="task-time">◷ &nbsp; 7:30 AM</span><strong>Watering<br/>Field 03 · Maize</strong><span className="task-status progress-status"><i/> In progress</span></article><article className="mobile-task-card"><span className="task-time">◷ &nbsp; 9:00 AM</span><strong>Update crop<br/>growth record</strong><button className="task-status due-status" onClick={()=>onUpdate(crops[0])}>Record now <span>→</span></button></article><article className="mobile-task-card"><span className="task-time">◷ &nbsp; 11:30 AM</span><strong>Prepare spinach<br/>for collection</strong><span className="task-status done-status">Harvest-ready</span></article></div></section>
    <section className="mobile-fields-section"><div className="mobile-section-heading"><div><span className="eyebrow">SEASON 2026</span><h2>My growing fields <span className="count-badge">{crops.length}</span></h2></div><button className="mobile-small-link" onClick={onAdd}>+ Add crop</button></div><div className="mobile-field-list">{crops.map((crop,index)=><article className="mobile-field-card crop-card-clickable" key={crop.id} role="link" tabIndex={0} aria-label={`Open ${crop.name} harvest plan`} onClick={() => onOpenHarvestPlan(crop.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpenHarvestPlan(crop.id); } }}><div className={`field-photo field-photo-${index%3}`} style={{ backgroundImage: `linear-gradient(180deg,rgba(20,35,20,.08),rgba(20,35,20,.58)),url("${crop.photo ?? "/farmer-field-garden.jpg"}")`, backgroundSize: "cover", backgroundPosition: "center" }}><span className="field-crop-icon">{crop.symbol}</span><span className={`field-badge ${crop.ready>0?"field-badge-ready":""}`}>{crop.ready>0?"Harvesting":"Growing"}</span><label className="field-photo-upload" onClick={(event)=>event.stopPropagation()}>{crop.photo ? "Change photo" : "＋ Add field photo"}<input type="file" accept="image/*" aria-label={`Add field photo for ${crop.name}`} onChange={(event)=>{const file=event.target.files?.[0]; if(file) onPhoto(crop.id,file); event.currentTarget.value="";}} /></label></div><div className="mobile-field-info"><div className="field-title-row"><div><strong>{crop.name} · {crop.field.split("·")[0].trim()}</strong><small>{crop.variety}</small></div><button className="field-more" aria-label={`More options for ${crop.name}`} onClick={(event)=>{event.stopPropagation(); onUpdate(crop);}}>···</button></div><div className="field-location">⌖ &nbsp;Eastern Cape, Makhanda</div><div className="field-progress-head"><span>{crop.stage}</span><b>{crop.progress}%</b></div><div className="field-progress"><i style={{width:`${crop.progress}%`}}/></div><div className="field-bottom"><span>◷ &nbsp;{crop.harvest === "Ready now" ? "Ready to harvest" : `Expected ${crop.harvest}`}</span><span>◈ &nbsp;{crop.estimate.toFixed(1)} t est.</span></div>{crop.ready>0&&<div className="field-ready-stock"><span>Sale-ready stock</span><strong>{crop.ready.toFixed(2)} t</strong><button onClick={(event)=>{event.stopPropagation(); onUpdate(crop);}}>Update quantity</button></div>}</div></article>)}</div></section>
    <section className="mobile-growth-note"><span className="growth-note-icon">✦</span><div><strong>Keep your harvest forecast up to date</strong><p>Recent growth notes help buyers prepare before harvest.</p></div><button onClick={()=>onUpdate(crops[0])}>Update <span>→</span></button></section>
  </div>;
}

function FarmerSecondaryPage({ page, crops, enquiries, onAdd, onUpdate, onOpenHarvestPlan, selectedCropId }: { page: string; crops: Crop[]; enquiries: FarmerEnquiry[]; onAdd: () => void; onUpdate: (crop: Crop) => void; onOpenHarvestPlan: (cropId: number) => void; selectedCropId: number | null }) {
  const totalForecast = crops.reduce((total, crop) => total + crop.estimate, 0);
  const readyCrops = crops.filter((crop) => crop.ready > 0);
  const upcomingCrops = crops.filter((crop) => crop.ready === 0);

  if (page === "My crops") {
    return <section className="workspace-page">
      <header className="workspace-page-heading"><div><span className="eyebrow">YOUR FARM RECORDS</span><h1>My crops</h1><p>Keep each planting, growth stage, and expected harvest in one clear place.</p></div><button className="button button-primary" onClick={onAdd}><span className="plus">＋</span> Add a crop</button></header>
      <div className="workspace-summary"><article><span>Active plantings</span><strong>{crops.length}</strong></article><article><span>Forecast yield</span><strong>{totalForecast.toFixed(1)} t</strong></article><article><span>Sale-ready stock</span><strong>{readyCrops.reduce((sum, crop) => sum + crop.ready, 0).toFixed(2)} t</strong></article></div>
      <div className="workspace-crop-grid">{crops.map((crop) => <article className="workspace-crop-card crop-card-clickable" key={crop.id} role="link" tabIndex={0} aria-label={`Open ${crop.name} harvest plan`} onClick={() => onOpenHarvestPlan(crop.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpenHarvestPlan(crop.id); } }}>
        <div className="workspace-crop-top"><span className={`crop-avatar ${crop.color}`}>{crop.symbol}</span><span className={`workspace-stage ${crop.ready > 0 ? "workspace-stage-ready" : ""}`}>{crop.ready > 0 ? "Harvesting" : crop.stage}</span></div>
        <h2>{crop.name}</h2><p className="workspace-variety">{crop.variety}</p><p className="workspace-location">⌖ &nbsp;{crop.field}</p>
        <div className="workspace-progress-head"><span>Growth progress</span><strong>{crop.progress}%</strong></div><div className="workspace-progress"><i style={{ width: `${crop.progress}%` }} /></div>
        <div className="workspace-crop-meta"><div><span>Planted</span><strong>{crop.planted}</strong></div><div><span>Expected harvest</span><strong>{crop.harvest}</strong></div><div><span>Yield forecast</span><strong>{crop.estimate.toFixed(1)} t</strong></div><div><span>Quality / grade</span><strong>{crop.quality}</strong></div><div><span>Crop type · planted</span><strong>{crop.cropType ?? "Other"} · {crop.quantity ?? 1} {crop.unit ?? "ha"}</strong></div><div><span>Expected yield rate</span><strong>{(crop.yieldPerUnit ?? crop.estimate * 1000).toLocaleString()} {crop.unitYield ?? "kg/ha"}</strong></div><div><span>Production status</span><strong>{(crop.status ?? "growing").replace("_", " ")}</strong></div><div><span>Growing cycle</span><strong>{crop.daysSincePlanting ?? 0} / {crop.estimatedHarvestDays ?? crop.daysToHarvest ?? 90} days</strong></div></div>
        {crop.ready > 0 && <div className="workspace-ready-stock"><span>Confirmed for sale</span><strong>{crop.ready.toFixed(2)} t</strong></div>}
        <button className="workspace-record-button" onClick={(event) => { event.stopPropagation(); onUpdate(crop); }}>Record a growth update <span>→</span></button>
      </article>)}</div>
    </section>;
  }

  if (page === "Harvest plan") {
    return <section className="workspace-page">
      <header className="workspace-page-heading"><div><span className="eyebrow">SEASON 2026 · MAKHANDA</span><h1>Harvest plan</h1><p>Prepare for upcoming harvests with clear timing and next steps for each crop.</p></div><span className="workspace-plan-total">{totalForecast.toFixed(1)} t <small>forecast this season</small></span></header>
      <div className="workspace-plan-note"><span>✦</span><p>Harvest windows are estimates. Update crop progress as conditions change so buyers can plan with you.</p></div>
      <div className="harvest-timeline">{[...crops].sort((a, b) => {
        if (a.ready > 0 || b.ready > 0) return a.ready > 0 ? -1 : 1;
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthA = monthOrder.indexOf(a.harvest.match(/[A-Z][a-z]{2}/)?.[0] ?? "");
        const monthB = monthOrder.indexOf(b.harvest.match(/[A-Z][a-z]{2}/)?.[0] ?? "");
        return monthA - monthB;
      }).map((crop, index) => <article id={`harvest-crop-${crop.id}`} className={`harvest-plan-card${selectedCropId === crop.id ? " harvest-plan-card-selected" : ""}`} key={crop.id}>
        <div className="timeline-marker"><span>{crop.ready > 0 ? "✓" : String(index + 1).padStart(2, "0")}</span></div><div className="harvest-plan-content"><div className="harvest-plan-top"><div><span className="eyebrow">{crop.ready > 0 ? "READY TO SELL" : `HARVEST WINDOW · ${crop.progress}% GROWN`}</span><h2>{crop.name} · {crop.field.split("·")[0].trim()}</h2></div><strong>{crop.harvest}</strong></div>
        <div className="workspace-progress"><i style={{ width: `${crop.progress}%` }} /></div><div className="harvest-plan-bottom"><span>Forecast <b>{crop.estimate.toFixed(1)} t</b></span><span>{crop.ready > 0 ? `Confirmed stock ${crop.ready.toFixed(2)} t` : `Next step: ${crop.name === "Maize" ? "check grain maturity" : crop.name === "Butternut" ? "inspect fruit development" : "confirm harvest quantity"}`}</span><button onClick={() => onUpdate(crop)}>Update record →</button></div>
      </div></article>)}</div>
    </section>;
  }

  return <section className="workspace-page">
    <header className="workspace-page-heading"><div><span className="eyebrow">BUYER VISIBILITY · YOUR FARM</span><h1>Market</h1><p>Review what is ready to offer and what buyers can plan for in the coming weeks.</p></div><span className="market-sample-badge"><i /> Farmer-reported supply</span></header>
    <div className="market-highlight"><div><span className="eyebrow">AVAILABLE NOW</span><h2>{readyCrops.length ? `${readyCrops.reduce((sum, crop) => sum + crop.ready, 0).toFixed(2)} tonnes ready for buyers` : "No confirmed stock yet"}</h2><p>{readyCrops.length ? "Keep the harvested quantity and quality details current for sourcing conversations." : "When a crop is harvested, record its confirmed sale-ready quantity and quality."}</p></div><span className="market-highlight-icon">◈</span></div>
    <div className="market-section-heading"><div><span className="eyebrow">CURRENT INVENTORY</span><h2>Sale-ready crops</h2></div><span>{readyCrops.length} listed</span></div>
    {readyCrops.length ? <div className="market-list">{readyCrops.map((crop) => <article className="market-crop-row" key={crop.id}><span className={`crop-avatar ${crop.color}`}>{crop.symbol}</span><div className="market-crop-name"><strong>{crop.name}</strong><small>{crop.variety} · {crop.field}</small></div><div><span>AVAILABLE</span><strong>{crop.ready.toFixed(2)} t</strong></div><div><span>QUALITY</span><strong>{crop.quality}</strong></div><button onClick={() => onUpdate(crop)}>Refresh crop record <span>→</span></button></article>)}</div> : <div className="market-empty"><span>◈</span><p>Your confirmed inventory will appear here once you record a harvest.</p></div>}
    <div className="market-section-heading upcoming-heading"><div><span className="eyebrow">BUYER MESSAGES</span><h2>Enterprise enquiries</h2></div><span>{enquiries.length} received</span></div>
    {enquiries.length ? <div className="market-list">{enquiries.map((enquiry) => <article className="farmer-enquiry-card" key={enquiry.id}><div><strong>{enquiry.enterpriseName}</strong><span>{enquiry.crop}{enquiry.quantity ? ` · ${enquiry.quantity} t requested` : ""}</span><p>{enquiry.message}</p><small>{new Date(enquiry.createdAt).toLocaleString()} · {enquiry.status}</small></div></article>)}</div> : <div className="market-empty"><span>✉</span><p>Supplier enquiries from enterprise buyers will appear here.</p></div>}
    <div className="market-section-heading upcoming-heading"><div><span className="eyebrow">COMING SOON</span><h2>Growing toward market</h2></div><span>{upcomingCrops.length} crops</span></div>
    <div className="market-upcoming-grid">{upcomingCrops.map((crop) => <article className="market-upcoming-card" key={crop.id}><div><span className={`crop-avatar ${crop.color}`}>{crop.symbol}</span><span className="market-stage">{crop.progress}% grown</span></div><h3>{crop.name}</h3><p>{crop.field}</p><div className="workspace-progress"><i style={{ width: `${crop.progress}%` }} /></div><footer><span>Expected {crop.harvest}</span><strong>{crop.estimate.toFixed(1)} t est.</strong></footer></article>)}</div>
    <p className="market-disclaimer">Market availability and quality are based on farmer records. Forecast quantities are estimates until harvest is confirmed.</p>
  </section>;
}

export default function Farmer() {
  const router = useRouter();
  const [dataReady, setDataReady] = useState(false);
  const [crops, setCrops] = useState<Crop[]>(() => {
    if (typeof window === "undefined") return initialCrops;
    try {
      const savedCrops = window.localStorage.getItem("agri-mart-farmer-crops");
      return savedCrops ? JSON.parse(savedCrops) as Crop[] : initialCrops;
    } catch {
      return initialCrops;
    }
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All crops");
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropToUpdate, setCropToUpdate] = useState<Crop | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<FarmerProfile>(() => {
    if (typeof window === "undefined") return defaultProfile;
    try {
      const savedProfile = window.localStorage.getItem("agri-mart-farmer-profile");
      return savedProfile ? { ...defaultProfile, ...JSON.parse(savedProfile) as Partial<FarmerProfile> } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [activeNav, setActiveNav] = useState("Overview");
  const [toast, setToast] = useState("");
  const [updatedCrop, setUpdatedCrop] = useState<number | null>(null);
  const [selectedCropId, setSelectedCropId] = useState<number | null>(null);
  const [enquiries, setEnquiries] = useState<FarmerEnquiry[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadWorkspace() {
      try {
        const sessionResponse = await fetch("/api/auth/me", { cache: "no-store" });
        if (!sessionResponse.ok) { router.replace("/login/farmer"); return; }
        const session = await sessionResponse.json() as { user: { role: string; name: string; email: string; profile: Record<string, string> } };
        if (session.user.role !== "farmer") { router.replace(session.user.role === "enterprise" ? "/login/enterprise" : "/login/farmer"); return; }
        const [cropResponse, enquiryResponse] = await Promise.all([fetch("/api/crops", { cache: "no-store" }), fetch("/api/enquiries", { cache: "no-store" })]);
        if (!cropResponse.ok || !enquiryResponse.ok) throw new Error("Farm records could not be loaded.");
        const [cropResult, enquiryResult] = await Promise.all([cropResponse.json(), enquiryResponse.json()]) as [{ crops: Crop[] }, { enquiries: FarmerEnquiry[] }];
        if (cancelled) return;
        setProfile({ name: session.user.name, email: session.user.email, farm: session.user.profile.farm ?? "", location: session.user.profile.location ?? "" });
        setCrops(cropResult.crops);
        setEnquiries(enquiryResult.enquiries);
        setDataReady(true);
      } catch {
        if (!cancelled) flash("Could not load your farm records. Please refresh the page.");
      }
    }
    void loadWorkspace();
    return () => { cancelled = true; };
  }, [router]);

  const filteredCrops = useMemo(() => crops.filter((crop) => `${crop.name} ${crop.variety} ${crop.field}`.toLowerCase().includes(search.toLowerCase()) && (filter === "All crops" || crop.stage === filter)), [crops, search, filter]);
  const totalEstimate = crops.reduce((total, crop) => total + crop.estimate, 0);
  const readyStock = crops.reduce((total, crop) => total + crop.ready, 0);
  useEffect(() => {
    if (!dataReady) return;
    try {
      window.localStorage.setItem("agri-mart-farmer-crops", JSON.stringify(crops));
    } catch {
      // Keep the current screen usable if browser storage is full or disabled.
    }
    void fetch("/api/crops", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ crops }) }).then((response) => {
      if (!response.ok) flash("Crop changes could not be saved. Please sign in again and retry.");
    }).catch(() => flash("Crop changes could not be saved. Check your connection and retry."));
  }, [crops, dataReady]);

  useEffect(() => {
    if (!dataReady) return;
    const timer = window.setInterval(() => {
      void fetch("/api/enquiries", { cache: "no-store" }).then(async (response) => {
        if (response.ok) { const result = await response.json() as { enquiries: FarmerEnquiry[] }; setEnquiries(result.enquiries); }
      }).catch(() => undefined);
    }, 15000);
    return () => window.clearInterval(timer);
  }, [dataReady]);

  useEffect(() => {
    if (activeNav !== "Harvest plan" || selectedCropId === null) return;
    const timeout = window.setTimeout(() => {
      document.getElementById(`harvest-crop-${selectedCropId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
    return () => window.clearTimeout(timeout);
  }, [activeNav, selectedCropId]);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  function addCrop(crop: Crop) {
    setCrops((current) => [crop, ...current]);
    setShowCropModal(false);
    flash(`${crop.name} added to your crop records`);
  }

  async function saveCropPhoto(cropId: number, file: File) {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image editor unavailable");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const photo = await new Promise<string>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Could not process image"));
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("Could not read image"));
          reader.readAsDataURL(blob);
        }, "image/jpeg", 0.78);
      });
      setCrops((current) => current.map((crop) => crop.id === cropId ? { ...crop, photo } : crop));
      flash("Field photo added to crop record");
    } catch {
      flash("Could not add that photo. Please choose a JPG, PNG, or WebP image.");
    }
  }

  function recordUpdate(crop: Crop) {
    setCropToUpdate(crop);
  }

  function saveGrowthUpdate(updatedCrop: Crop) {
    setUpdatedCrop(updatedCrop.id);
    setCrops((current) => current.map((item) => item.id === updatedCrop.id ? updatedCrop : item));
    setCropToUpdate(null);
    flash(`${updatedCrop.name} record updated`);
    window.setTimeout(() => setUpdatedCrop(null), 900);
  }

  function openHarvestPlan(cropId: number) {
    setSelectedCropId(cropId);
    setActiveNav("Harvest plan");
  }

  async function saveFarmerProfile(nextProfile: FarmerProfile) {
    const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nextProfile) });
    const result = await response.json() as { error?: string };
    if (!response.ok) { flash(result.error ?? "Could not save your profile."); return; }
    setProfile(nextProfile);
    setShowProfile(false);
    flash("Profile saved");
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login/farmer");
  }

  if (!dataReady) return <main className="farm-loading">Loading your farm workspace…</main>;

  return <div className="app-shell farmer-app-shell">
    <aside className="sidebar"><Brand /><div className="workspace-label">FARM WORKSPACE</div><nav className="side-nav" aria-label="Main navigation">{navItems.map((item) => <button key={item.label} className={`nav-link ${activeNav === item.label ? "active" : ""}`} onClick={() => setActiveNav(item.label)}><Icon>{item.icon}</Icon>{item.label}{item.label === "Harvest plan" && <span className="nav-count">3</span>}</button>)}</nav><div className="sidebar-spacer" /><div className="side-help"><span className="help-leaf">♧</span><strong>Growing takes a team.</strong><p>Get help with crop records or your next harvest.</p><button onClick={() => flash("A local support request would start here.")}>Visit help centre <span>↗</span></button></div><button className="profile-button" onClick={() => setShowProfile(true)} aria-haspopup="dialog"><span className="avatar">{profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span><span><strong>{profile.name}</strong><small>Smallholder farmer</small></span><span className="profile-more">···</span></button></aside>

    <main className="main-panel">
      <header className="topbar"><button className="workspace-back-button" onClick={() => router.push("/")} aria-label="Back to Agri-Mart home">← <span>Back</span></button><div className="mobile-brand"><Brand /></div><div className="breadcrumb"><span>Farm workspace</span><b>/</b><strong>{activeNav}</strong></div><div className="top-actions"><button className="icon-button notification-button" aria-label="Notifications" onClick={() => flash("You’re all caught up.")}>♧<i /></button><button className="avatar top-avatar profile-top-button" onClick={() => setShowProfile(true)} aria-label={`Open profile for ${profile.name}`} aria-haspopup="dialog">{profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</button><button className="logout-action" onClick={signOut}>Sign out</button></div></header>

      <div className="page-content">
          <div className="farmer-desktop">
          {activeNav === "Overview" ? <>
          <section className="welcome-row"><div><div className="date-line"><span className="status-dot" /> YOUR FARM, AT A GLANCE <span className="date-divider">/</span> SATURDAY, 17 OCTOBER 2026</div><h1>Good morning, {profile.name.trim().split(/\s+/)[0] || "there"} <span className="wave">✳</span></h1><p className="subheading">Small updates today make for a more reliable harvest tomorrow.</p></div><button className="button button-primary add-crop" onClick={() => setShowCropModal(true)}><span className="plus">＋</span> Add a crop</button></section>

          <section className="stat-grid" aria-label="Farm summary"><article className="stat-card"><div className="stat-top"><span className="stat-icon leaf-bg">♧</span><span className="stat-change">↗ 2 this season</span></div><div className="stat-number">{crops.length.toString().padStart(2, "0")}<span> active crops</span></div><div className="stat-foot">Across 3 growing areas</div></article><article className="stat-card"><div className="stat-top"><span className="stat-icon gold-bg">◉</span><span className="stat-tag">ESTIMATED</span></div><div className="stat-number">{totalEstimate.toFixed(1)}<span> t</span></div><div className="stat-foot">Forecast yield this season</div></article><article className="stat-card"><div className="stat-top"><span className="stat-icon mint-bg">▣</span><span className="stat-tag green-tag">SALE-READY</span></div><div className="stat-number">{readyStock.toFixed(2)}<span> t</span></div><div className="stat-foot">Confirmed harvest stock</div></article></section>

          <div className="dashboard-grid"><section className="panel growth-panel"><div className="panel-header"><div><span className="eyebrow">SEASON PROGRESS</span><h2>Crop growth &amp; harvest outlook</h2><p className="panel-desc">Your reported progress helps buyers plan ahead.</p></div><button className="period-select" onClick={() => flash("Showing the current growing season")}>This season <span>⌄</span></button></div><div className="chart-legend"><span><i className="legend-forecast" /> Expected yield</span><span><i className="legend-harvest" /> Harvested</span><span className="chart-period">JUN <span>JUL</span> AUG <span>SEP</span> OCT <span>NOV</span> DEC</span></div><div className="chart-wrap"><svg className="yield-chart" viewBox="0 0 760 190" role="img" aria-label="Expected yield rises from June to December, with current harvest beginning in October"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#cfe7a3" stopOpacity=".55"/><stop offset="100%" stopColor="#cfe7a3" stopOpacity="0"/></linearGradient></defs><line x1="0" y1="34" x2="760" y2="34" className="grid-line"/><line x1="0" y1="84" x2="760" y2="84" className="grid-line"/><line x1="0" y1="134" x2="760" y2="134" className="grid-line"/><path d="M0 158 C68 152 82 141 126 144 S197 125 253 129 S324 109 380 110 S452 81 507 83 S580 59 633 61 S705 35 760 29 L760 190 L0 190 Z" fill="url(#chartFill)"/><path d="M0 158 C68 152 82 141 126 144 S197 125 253 129 S324 109 380 110 S452 81 507 83 S580 59 633 61 S705 35 760 29" className="yield-line"/><path d="M0 188 L760 188" className="harvest-line"/><circle cx="507" cy="83" r="5" className="chart-point"/><line x1="507" y1="30" x2="507" y2="174" className="today-line"/><rect x="472" y="4" width="70" height="22" rx="11" className="today-pill"/><text x="507" y="19" textAnchor="middle" className="today-label">TODAY</text></svg></div><div className="chart-foot"><span><b>2.8 t</b> expected in the next 30 days</span><button onClick={() => setActiveNav("Harvest plan")}>View harvest plan <span>→</span></button></div></section>

          <aside className="panel update-panel"><div className="panel-header compact-header"><div><span className="eyebrow">YOUR NEXT STEP</span><h2>Keep records fresh</h2></div><span className="pulse-dot" /></div><p className="update-copy">A recent update gives buyers confidence in your harvest timeline.</p><div className="update-reminder"><span className="reminder-icon">◷</span><span><strong>Butternut · Field 01</strong><small>Update due · 2 days ago</small></span><button onClick={() => recordUpdate(crops.find((crop) => crop.name === "Butternut") ?? crops[0])} aria-label="Record butternut growth update">→</button></div><div className="update-reminder"><span className="reminder-icon">◷</span><span><strong>Maize · Field 03</strong><small>Next check-in · Today</small></span><button onClick={() => recordUpdate(crops.find((crop) => crop.name === "Maize") ?? crops[0])} aria-label="Record maize growth update">→</button></div><div className="update-note"><span>✦</span> Just a photo and a quick note can update your crop’s progress.</div></aside></div>

          <section className="panel crops-panel"><div className="panel-header crops-heading"><div><span className="eyebrow">GROWING NOW</span><h2>Your crop records <span className="count-badge">{crops.length}</span></h2></div><div className="crop-tools"><label className="search-box"><span>⌕</span><input aria-label="Search crops" placeholder="Search crops" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="filter-select" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter by crop stage"><option>All crops</option><option>Grain fill</option><option>Fruit development</option><option>Harvesting</option><option>Seedling</option></select><button className="text-link desktop-link" onClick={() => setActiveNav("My crops")}>View all <span>→</span></button></div></div>
            <div className="crop-table-wrap"><table className="crop-table"><thead><tr><th>Crop / field</th><th>Growth stage</th><th>Expected harvest</th><th>Yield forecast</th><th>Stock / quality</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filteredCrops.map((crop) => <tr key={crop.id} className={`crop-table-row-clickable${updatedCrop === crop.id ? " row-flash" : ""}`} role="link" tabIndex={0} aria-label={`Open ${crop.name} harvest plan`} onClick={() => openHarvestPlan(crop.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openHarvestPlan(crop.id); } }}><td><div className="crop-cell"><span className={`crop-avatar ${crop.color} crop-avatar-photo`} style={{ backgroundImage: `url("${crop.photo ?? "/farmer-field-garden.jpg"}")` }}>{null}</span><span><strong>{crop.name}</strong><small>{crop.field}</small></span></div></td><td><span className="stage-label">{crop.stage}</span><div className="progress-row"><span className="progress-track"><i style={{ width: `${crop.progress}%` }} /></span><small>{crop.progress}%</small></div></td><td><strong className="harvest-date">{crop.harvest}</strong><small className="table-sub">Planted {crop.planted}</small></td><td><strong>{crop.estimate.toFixed(1)} t</strong><small className="table-sub">Farmer estimate</small></td><td>{crop.ready > 0 ? <><span className="stock-pill ready-pill"><i />{crop.ready.toFixed(2)} t ready</span><small className="table-sub">{crop.quality}</small></> : <><span className="stock-pill forecast-pill"><i />In field</span><small className="table-sub">Quality · {crop.quality}</small></>}</td><td><label className="crop-photo-button" onClick={(event) => event.stopPropagation()}>▧ <span>{crop.photo ? "Change photo" : "Add photo"}</span><input type="file" accept="image/*" aria-label={`Add field photo for ${crop.name}`} onChange={(event) => { const file = event.target.files?.[0]; if (file) saveCropPhoto(crop.id, file); event.currentTarget.value = ""; }} /></label><button className="row-action" onClick={(event) => { event.stopPropagation(); recordUpdate(crop); }} title={`Record a growth update for ${crop.name}`}>＋ <span>Update</span></button></td></tr>)}</tbody></table>{filteredCrops.length === 0 && <div className="empty-state">No crops match that search. Try another name or stage.</div>}</div><div className="table-footer"><span>Last synced just now <span className="sync-mark">●</span></span><button onClick={() => flash("You’re viewing all current crop records.")}>See all crop records <span>→</span></button></div></section>

          <footer className="page-footer"><span>Agri-Mart supports better planning, one crop update at a time.</span><span>Need help? <button onClick={() => flash("Help centre")}>Talk to our team</button></span></footer>
          </> : <FarmerSecondaryPage page={activeNav} crops={crops} enquiries={enquiries} onAdd={() => setShowCropModal(true)} onUpdate={recordUpdate} onOpenHarvestPlan={openHarvestPlan} selectedCropId={selectedCropId} />}
          </div>
          <FarmerMobile crops={crops} enquiries={enquiries} firstName={profile.name.trim().split(/\s+/)[0] || "there"} onAdd={() => setShowCropModal(true)} onUpdate={recordUpdate} onPhoto={saveCropPhoto} onOpenHarvestPlan={openHarvestPlan} activeNav={activeNav} selectedCropId={selectedCropId} />
        
      </div>

      <nav className="mobile-bottom-nav" aria-label="Farmer navigation">{navItems.map((item)=><button key={item.label} onClick={()=>setActiveNav(item.label)} className={activeNav===item.label?"mobile-active":""}><span>{item.icon}</span><small>{item.label}</small></button>)}</nav>
    </main>
    {showCropModal && <CropModal onClose={() => setShowCropModal(false)} onSave={addCrop} />}
    {cropToUpdate && <GrowthUpdateModal crop={cropToUpdate} onClose={() => setCropToUpdate(null)} onSave={saveGrowthUpdate} />}
    {showProfile && <ProfileModal profile={profile} onClose={() => setShowProfile(false)} onSave={saveFarmerProfile} />}
    {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
  </div>;
}
