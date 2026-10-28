const { useState, useEffect, useRef } = React;

// Adapt Lucide icons from browser window object for standalone CDN execution
const getIcon = (iconName) => {
  return ({ size = 20, color = "currentColor", strokeWidth = 2, className = "", style = {} }) => {
    const iconData = window.lucide?.icons?.[iconName];
    if (!iconData) return null;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ flexShrink: 0, ...style }}
        dangerouslySetInnerHTML={{
          __html: iconData
            .map(([tag, attrs]) => {
              const attrStr = Object.entries(attrs)
                .map(([k, v]) => `${k}="${v}"`)
                .join(" ");
              return `<${tag}${attrStr}></${tag}>`; }) .join(""), }} /> ); }; };  const Droplets = getIcon("Droplets"); const Home = getIcon("Home"); const BookOpen = getIcon("BookOpen"); const User = getIcon("User"); const Camera = getIcon("Camera"); const MapPin = getIcon("MapPin"); const LocateFixed = getIcon("LocateFixed"); const ChevronLeft = getIcon("ChevronLeft"); const ChevronDown = getIcon("ChevronDown"); const Check = getIcon("Check"); const Plus = getIcon("Plus"); const X = getIcon("X"); const Mail = getIcon("Mail"); const Lock = getIcon("Lock"); const Eye = getIcon("Eye"); const EyeOff = getIcon("EyeOff"); const Video = getIcon("Video"); const ImageIcon = getIcon("Image"); const LogOut = getIcon("LogOut"); const Sparkles = getIcon("Sparkles"); const Leaf = getIcon("Leaf"); const Users = getIcon("Users"); const Megaphone = getIcon("Megaphone"); const FlaskConical = getIcon("FlaskConical"); const ShoppingBag = getIcon("ShoppingBag"); const Wrench = getIcon("Wrench"); const Timer = getIcon("Timer"); const Shirt = getIcon("Shirt"); const Factory = getIcon("Factory"); const Fuel = getIcon("Fuel"); const ClipboardList = getIcon("ClipboardList"); const Waves = getIcon("Waves");  /* ================================================================== * 1. CONSTANTS & MOCK DATA * ================================================================== */  const POINTS_PER_REPORT = 50; const POINTS_PER_TIP = 5; const STARTING_POINTS = 120;  const LEVELS = [ { name: "Ripple", min: 0 }, { name: "Stream Scout", min: 40 }, { name: "Water Warrior", min: 100 }, { name: "River Guardian", min: 200 }, { name: "Ocean Protector", min: 400 }, ];  const POLLUTION_TYPES = [ { id: "plastic", label: "Plastic waste", icon: ShoppingBag }, { id: "chemical", label: "Chemical runoff", icon: FlaskConical }, { id: "sewage", label: "Sewage", icon: Droplets }, { id: "oil", label: "Oil spill", icon: Fuel }, { id: "industrial", label: "Industrial waste", icon: Factory }, ];  const TIP_CATEGORIES = [ { id: "household", title: "Household habits", subtitle: "Small choices at home add up downstream", tips: [ { id: "chemicals", icon: FlaskConical, title: "Dispose of household chemicals properly", detail: "Take paint, solvents and strong cleaners to a hazardous-waste drop-off. Never pour them down a drain or onto the ground.", }, { id: "plastic", icon: ShoppingBag, title: "Cut back on single-use plastic", detail: "Carry a reusable bottle, bag and cup. Discarded plastic breaks into microplastics that end up in rivers and oceans.", }, { id: "detergent", icon: Leaf, title: "Switch to eco-friendly detergents", detail: "Choose phosphate-free, biodegradable soaps and cleaners so what goes down the drain is gentler on aquatic life.", }, ], }, { id: "water", title: "Conserving water", subtitle: "Use less, and less ends up polluted", tips: [ { id: "showers", icon: Timer, title: "Take shorter showers", detail: "Trimming a shower by two minutes saves liters of water and eases the load on treatment plants.", }, { id: "leaks", icon: Wrench, title: "Fix leaks quickly", detail: "A dripping tap or running toilet wastes water around the clock. Check your fixtures once a month.", }, { id: "laundry", icon: Shirt, title: "Run full loads of laundry", detail: "Wait until the machine is full. Fewer cycles means less water, less detergent and fewer microfibers released.", }, ], }, { id: "community", title: "Community action", subtitle: "Bigger change happens together", tips: [ { id: "cleanup", icon: Users, title: "Join a beach or river cleanup", detail: "Cleanups remove trash before it washes downstream. Go with a group, wear gloves and bring a sturdy bag.", }, { id: "dumping", icon: Megaphone, title: "Report illegal dumping you see", detail: "Note the place and time, then tell your local authority or file a report here so it can be followed up.", }, { id: "plant", icon: Leaf, title: "Plant native greenery near waterways", detail: "Roots hold soil in place and filter runoff before it reaches the water.", }, ], }, ];  const ALL_TIPS = TIP_CATEGORIES.flatMap((c) => c.tips.map((t) => ({ ...t, categoryId: c.id, categoryTitle: c.title })) );  const HOME_TIPS = ALL_TIPS.filter((_, i) => i \% 3 !== 2);  const SEED_REPORTS = [ { id: "r_seed", title: "Foam and plastic by the footbridge", type: "plastic", description: "Thick foam and loose bottles gathering against the bank.", location: { lat: 12.9588, lng: 77.5702, label: "Near the old footbridge" }, evidence: [], status: "Under review", createdAt: Date.now() - 3 * 3600 * 1000, }, ];  const MAP_ORIGIN = { lat: 12.9612, lng: 77.5634 };  /* ================================================================== * 2. HELPERS & MOCK API * ================================================================== */  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); const todayKey = () => new Date().toDateString(); const clamp01 = (n) => Math.min(1, Math.max(0, n));  const makeGuestId = () => "Guest-" + Math.random().toString(36).slice(2, 6).padEnd(4, "0").toUpperCase();  const prettyName = (email) => email .split("@")[0] .replace(/[._-]+/g, " ") .replace(/\b\w/g, (c) => c.toUpperCase());  function getLevelInfo(points) { let index = 0; LEVELS.forEach((level, i) => { if (points >= level.min) index = i; }); const current = LEVELS[index]; const next = LEVELS[index + 1] \vert{}\vert{} null; const progress = next ? (points - current.min) / (next.min - current.min) : 1; return { index, current, next, progress, toNext: next ? next.min - points : 0 }; }  function timeAgo(ts) { const minutes = Math.round((Date.now() - ts) / 60000); if (minutes < 1) return "Just now"; if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} days ago`;
}

const mockApi = {
  async authenticate({ mode, name, email }) {
    await wait(700);
    return {
      type: "member",
      id: "u_" + Math.random().toString(36).slice(2, 8),
      name: mode === "signup" ? name.trim() : prettyName(email),
      email,
    };
  },
  async socialSignIn(provider) {
    await wait(600);
    return {
      type: "member",
      id: "u_" + Math.random().toString(36).slice(2, 8),
      name: `${provider} user`, }; }, async submitReport(payload) { await wait(900); return { ...payload, id: "r_" + Date.now(), status: "Received", createdAt: Date.now(), }; }, };  /* ================================================================== * 3. SHARED UI PIECES * ================================================================== */  function WaveStrip({ color, top, duration, reverse }) { return ( <svg viewBox="0 0 240 12" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", top, left: 0, width: "200\%", height: 12, animation: `wave-slide ${duration}s linear infinite ${reverse ? "reverse" : "normal"}`, }} > <path fill={color} d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6 T150 6 T180 6 T210 6 T240 6 V12 H0 Z" /> </svg> ); }  function WaterVessel({ points, progress, size = 136 }) { const level = Math.max(0.07, progress); return ( <div role="img" aria-label={`${points} Eco-Points`}
      style={{
        position: "relative", width: size, height: size, borderRadius: "50%",
        overflow: "hidden", background: "#0B3A55", border: "4px solid #1B6F90", flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0,
          transform: `translateY(${(1 - level) * 100}\%)`, transition: "transform 1.4s cubic-bezier(.22,.8,.2,1)", }} > <WaveStrip color="#5CC3DB" top={-11} duration={5} /> <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "#5CC3DB" }} /> <WaveStrip color="#0A7EA4" top={-5} duration={7} reverse /> <div style={{ position: "absolute", left: 0, right: 0, top: 6, bottom: 0, background: "#0A7EA4" }} /> </div> <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", textShadow: "0 1px 6px rgba(6,42,64,.6)", }} > <span className="font-display" style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}> {points} </span> <span style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Eco-Points</span> </div> </div> ); }  function Field({ label, icon: Icon, error, right, multiline, ...props }) { const Tag = multiline ? "textarea" : "input"; return ( <div style={{ marginBottom: 14 }}> <label className="text-sm font-semibold text-ink" style={{ display: "block", marginBottom: 6 }}> {label} <div style={{ position: "relative", marginTop: 6, fontWeight: 400 }}> {Icon && ( <div style={{ position: "absolute", left: 14, top: multiline ? 15 : 14 }}> <Icon size={18} color="#6B8795" /> </div> )} <Tag className={`field ${error ? "field-error" : ""}`}
            style={{ paddingLeft: Icon ? 42 : 14, paddingRight: right ? 46 : 14, resize: "none" }}
            aria-invalid={!!error}
            rows={multiline ? 4 : undefined}
            {...props}
          />
          {right && <div style={{ position: "absolute", right: 8, top: 6 }}>{right}</div>}
        </div>
      </label>
      {error && (
        <p role="alert" className="text-warn text-sm" style={{ marginTop: 2 }}>{error}</p>
      )}
    </div>
  );
}

function ProgressBar({ value, height = 8 }) {
  return (
    <div className="bg-mist" style={{ height, borderRadius: height, overflow: "hidden" }}>
      <div
        className="bg-ocean"
        style={{
          height: "100%", width: `${Math.round(clamp01(value) * 100)}\%`, borderRadius: height, transition: "width .5s ease", }} /> </div> ); }  function ReportCard({ report }) { const type = POLLUTION_TYPES.find((t) => t.id === report.type); const Icon = type ? type.icon : Droplets; return ( <div className="bg-white border border-mist" style={{ borderRadius: 18, padding: 14, display: "flex", gap: 12 }}> <div className="bg-foam text-ocean" style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}> <Icon size={20} /> </div> <div style={{ flex: 1, minWidth: 0 }}> <p className="font-semibold text-ink">{report.title}</p> <p className="text-sm text-slate-600"> {type ? type.label : "Pollution"} near {report.location.label} </p> <div className="flex items-center gap-2" style={{ marginTop: 6 }}> <span className="bg-foam text-ocean text-xs font-bold" style={{ padding: "3px 8px", borderRadius: 999 }}> {report.status} </span> <span className="text-xs text-slate-500">{timeAgo(report.createdAt)}</span> </div> </div> </div> ); }  function SectionTitle({ children, action }) { return ( <div className="flex items-center justify-between" style={{ margin: "26px 0 12px" }}> <h2 className="font-display text-xl text-abyss" style={{ fontWeight: 800 }}>{children}</h2> {action} </div> ); }  /* ================================================================== * 4. SCREENS * ================================================================== */  function AuthScreen({ initialMode = "signin", onAuthed }) { const [mode, setMode] = useState(initialMode); const [form, setForm] = useState({ name: "", email: "", password: "" }); const [showPw, setShowPw] = useState(false); const [errors, setErrors] = useState({}); const [busy, setBusy] = useState(null);  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: undefined })); };  const validate = () => { const e = {}; if (mode === "signup" && !form.name.trim()) e.name = "Enter your name."; if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address."; if (form.password.length < 6) e.password = "Use at least 6 characters."; setErrors(e); return Object.keys(e).length === 0; };  const submit = async () => { if (busy \vert{}\vert{} !validate()) return; setBusy("form"); onAuthed(await mockApi.authenticate({ mode, ...form })); };  const social = async (provider) => { if (busy) return; setBusy(provider); onAuthed(await mockApi.socialSignIn(provider)); };  const continueAsGuest = () => onAuthed({ type: "guest", id: makeGuestId(), name: "Guest" });  return ( <div className="bg-abyss" style={{ height: "100\%", overflowY: "auto", display: "flex", flexDirection: "column" }}> <div style={{ padding: "36px 24px 0" }}> <div className="flex items-center gap-2"> <div className="bg-shallows text-abyss" style={{ width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}> <Droplets size={22} /> </div> <span className="font-display text-white text-2xl" style={{ fontWeight: 800 }}>Water Guardian</span> </div> <h1 className="font-display text-white" style={{ fontSize: 32, lineHeight: 1.1, fontWeight: 800, marginTop: 28 }}> Spot pollution in the water? Report it. </h1> <p className="text-mist" style={{ marginTop: 10, lineHeight: 1.5 }}> Report incidents, learn what actually helps, and earn Eco-Points as you protect your local waterways. </p>  <button type="button" className="btn btn-shallows" onClick={continueAsGuest} style={{ marginTop: 24, padding: "18px 20px", flexDirection: "column", gap: 2, fontSize: 18 }}> <span>Continue as guest</span> <span style={{ fontSize: 13, fontWeight: 500 }}>Get a temporary Guest ID and start right away</span> </button> </div>  <svg viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block", width: "100\%", height: 30, marginTop: 20 }}> <path fill="#fff" d="M0 20 C240 40 480 0 720 20 C960 40 1200 0 1440 20 V40 H0 Z" /> </svg>  <div style={{ background: "#fff", flex: 1, padding: "6px 24px 32px" }} onKeyDown={(e) => e.key === "Enter" && submit()} > <div className="bg-foam" role="tablist" style={{ display: "flex", padding: 4, borderRadius: 14, marginBottom: 18 }}> {[["signin", "Sign in"], ["signup", "Create account"]].map(([id, label]) => ( <button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => { setMode(id); setErrors({}); }} style={{ flex: 1, padding: "10px 0", borderRadius: 11, border: 0, fontWeight: 700, fontSize: 15, background: mode === id ? "#fff" : "transparent", color: mode === id ? "#062A40" : "#4B6B7B", boxShadow: mode === id ? "0 1px 4px rgba(6,42,64,.15)" : "none", }}> {label} </button> ))} </div>  {mode === "signup" && ( <Field label="Name" icon={User} value={form.name} onChange={set("name")} placeholder="Your name" autoComplete="name" error={errors.name} /> )} <Field label="Email" icon={Mail} type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" error={errors.email} /> <Field label="Password" icon={Lock} type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="At least 6 characters" error={errors.password} autoComplete={mode === "signup" ? "new-password" : "current-password"} right={ <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"} style={{ background: "none", border: 0, padding: 8, color: "#6B8795" }}> {showPw ? <EyeOff size={18} /> : <Eye size={18} />} </button> } />  <button type="button" className="btn btn-primary" onClick={submit} disabled={!!busy}> {busy === "form" ? <span className="spinner" aria-label="Loading" /> : null} {mode === "signin" ? "Sign in" : "Create account"} </button>  <p className="text-sm text-slate-500" style={{ textAlign: "center", margin: "18px 0 12px" }}> Or continue with </p> <div style={{ display: "flex", gap: 10 }}> {["Google", "Apple"].map((p) => ( <button key={p} type="button" className="btn btn-outline" onClick={() => social(p)} disabled={!!busy}> {busy === p ? <span className="spinner" aria-label="Loading" /> : null} {p} </button> ))} </div> </div> </div> ); }  function HomeScreen({ user, points, doneCount, reports, onReport, onOpenLearn, onOpenProfile }) { const info = getLevelInfo(points);  return ( <div style={{ paddingBottom: 28 }}> <header className="bg-abyss" style={{ padding: "24px 20px 54px", borderRadius: "0 0 32px 32px" }}> <div className="flex items-center justify-between"> <div> <p className="text-mist text-sm">Hello,</p> <h1 className="font-display text-white text-2xl" style={{ fontWeight: 800 }}>{user.name}</h1> </div> <span className="bg-deep text-mist text-xs font-semibold" style={{ padding: "6px 10px", borderRadius: 999 }}> {user.type === "guest" ? user.id : "Member"} </span> </div>  <div className="flex items-center" style={{ gap: 20, marginTop: 22 }}> <WaterVessel points={points} progress={info.progress} /> <div style={{ minWidth: 0 }}> <p className="text-shallows text-sm font-semibold">Your rank</p> <p className="font-display text-white" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}> {info.current.name} </p> <div className="flex" style={{ gap: 4, margin: "10px 0 8px" }} aria-hidden="true"> {LEVELS.map((l, i) => ( <span key={l.name} style={{ width: 22, height: 6, borderRadius: 3, background: i <= info.index ? "#5CC3DB" : "#0B4F6C" }} /> ))} </div> <p className="text-mist text-sm"> {info.next ? `${info.toNext} more points to reach ${info.next.name}` : "You've reached the top rank"} </p> </div> </div> </header>  <div style={{ padding: "0 20px", marginTop: -28 }}> <button type="button" className="btn btn-primary" onClick={onReport} style={{ padding: "16px 18px", justifyContent: "space-between", textAlign: "left", boxShadow: "0 12px 26px rgba(6,42,64,.28)" }}> <span className="flex items-center" style={{ gap: 12 }}> <span className="bg-deep" style={{ width: 42, height: 42, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}> <Camera size={22} /> </span> <span> <span style={{ display: "block", fontSize: 18 }}>Report pollution</span> <span style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#CFE6EE" }}> Mark the spot and add evidence </span> </span> </span> <span className="bg-white text-ocean font-bold" style={{ padding: "6px 10px", borderRadius: 999, fontSize: 14 }}> +{POINTS_PER_REPORT} </span> </button> </div>  <div style={{ padding: "0 20px" }}> <button type="button" onClick={onOpenLearn} className="bg-foam" style={{ width: "100\%", marginTop: 18, padding: 16, borderRadius: 20, border: 0, textAlign: "left" }}> <div className="flex items-center justify-between" style={{ marginBottom: 10 }}> <span className="font-semibold text-abyss">Today's habits</span> <span className="text-sm font-semibold text-ocean">{doneCount} of {ALL_TIPS.length} done</span> </div> <ProgressBar value={doneCount / ALL_TIPS.length} /> <p className="text-sm text-slate-600" style={{ marginTop: 8 }}> Check off habits to earn +{POINTS_PER_TIP} points each. </p> </button>  {reports.length > 0 && ( <> <SectionTitle action={ <button type="button" onClick={onOpenProfile} className="text-ocean text-sm font-semibold" style={{ background: "none", border: 0 }}> See all </button> }> Your recent reports </SectionTitle> <div style={{ display: "grid", gap: 10 }}> {reports.slice(0, 2).map((r) => <ReportCard key={r.id} report={r} />)} </div> </> )}  <SectionTitle action={ <button type="button" onClick={onOpenLearn} className="text-ocean text-sm font-semibold" style={{ background: "none", border: 0 }}> See all tips </button> }> Ways to keep water clean </SectionTitle> <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}> {HOME_TIPS.map((tip) => { const Icon = tip.icon; return ( <button key={tip.id} type="button" onClick={onOpenLearn} className="bg-white border border-mist" style={{ textAlign: "left", padding: 14, borderRadius: 18 }}> <span className="bg-foam text-ocean" style={{ width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}> <Icon size={18} /> </span> <span className="text-ink font-semibold text-sm" style={{ display: "block", lineHeight: 1.3 }}> {tip.title} </span> <span className="text-xs text-slate-500" style={{ display: "block", marginTop: 6 }}> {tip.categoryTitle} </span> </button> ); })} </div> </div> </div> ); }  function TypeSelect({ value, onChange, error }) { const [open, setOpen] = useState(false); const selected = POLLUTION_TYPES.find((t) => t.id === value); const SelectedIcon = selected ? selected.icon : null;  return ( <div style={{ marginBottom: 14 }}> <p id="type-label" className="text-sm font-semibold text-ink" style={{ marginBottom: 6 }}> Type of pollution </p> <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-labelledby="type-label" onClick={() => setOpen((o) => !o)} className={`field ${error ? "field-error" : ""}`}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
        <span className="flex items-center gap-2" style={{ color: selected ? "#0E2A38" : "#6B8795" }}>
          {SelectedIcon && <SelectedIcon size={18} className="text-ocean" />}
          {selected ? selected.label : "Choose a type"}
        </span>
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>

      {open && (
        <ul role="listbox" aria-labelledby="type-label" className="border border-mist"
          style={{ marginTop: 8, borderRadius: 14, overflow: "hidden", background: "#fff", listStyle: "none", padding: 0 }}>
          {POLLUTION_TYPES.map((t) => {
            const Icon = t.icon;
            const active = t.id === value;
            return (
              <li key={t.id} role="presentation">
                <button type="button" role="option" aria-selected={active}
                  onClick={() => { onChange(t.id); setOpen(false); }}
                  className={active ? "bg-foam" : "bg-white"}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                    border: 0, textAlign: "left", fontSize: 16, color: "#0E2A38" }}>
                  <Icon size={18} className="text-ocean" />
                  <span style={{ flex: 1 }}>{t.label}</span>
                  {active && <Check size={18} className="text-ocean" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p role="alert" className="text-warn text-sm" style={{ marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function MapPicker({ pin, onPick }) {
  const handleTap = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onPick(clamp01((e.clientX - r.left) / r.width), clamp01((e.clientY - r.top) / r.height));
  };

  return (
    <div
      role="button" tabIndex={0}
      aria-label="Map. Tap to drop a pin on the pollution location."
      onClick={handleTap}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick(0.5, 0.5)}
      style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", borderRadius: 20,
        overflow: "hidden", cursor: "crosshair", border: "1.5px solid #CFE6EE" }}
    >
      <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
        <rect width="360" height="240" fill="#F2F7F8" />
        <g stroke="#DCE9EE" strokeWidth="3">
          <path d="M0 40 H140 M0 90 H110 M0 200 H150 M40 0 V240 M80 0 V150" />
        </g>
        <g fill="#E1EEF2">
          <rect x="48" y="48" width="26" height="34" rx="3" /><rect x="88" y="98" width="22" height="30" rx="3" />
          <rect x="10" y="98" width="24" height="40" rx="3" /><rect x="50" y="208" width="30" height="22" rx="3" />
          <rect x="296" y="12" width="40" height="30" rx="3" />
        </g>
        <path fill="#BFE3EE" d="M215 0 C195 50 170 80 190 120 C208 160 175 200 200 240 H360 V0 Z" />
        <path fill="none" stroke="#9FD3E3" strokeWidth="2" d="M215 0 C195 50 170 80 190 120 C208 160 175 200 200 240" />
        <path fill="none" stroke="#BFE3EE" strokeWidth="11" strokeLinecap="round"
          d="M0 160 C50 150 80 178 125 156 S180 112 192 118" />
        <path fill="#F2F7F8" d="M330 150 C310 170 318 205 305 240 H360 V150 Z" />
      </svg>

      {pin && (
        <>
          <span key={`ring-${pin.fx}-${pin.fy}`} aria-hidden="true"
            style={{ position: "absolute", left: `${pin.fx * 100}\%`, top: `${pin.fy * 100}%`, width: 26, height: 26,
              borderRadius: "50%", background: "#0A7EA4", animation: "ring-out 1.2s ease-out 2" }} />
          <span key={`pin-${pin.fx}-${pin.fy}`} aria-hidden="true"
            style={{ position: "absolute", left: `${pin.fx * 100}\%`, top: `${pin.fy * 100}%`,
              transform: "translate(-50%,-100%)", animation: "drop-pin .45s ease-out", lineHeight: 0 }}>
            <MapPin size={38} color="#fff" strokeWidth={1.8} style={{ fill: "#0A7EA4" }} />
          </span>
        </>
      )}
      {!pin && (
        <span className="bg-abyss text-white text-xs font-semibold"
          style={{ position: "absolute", left: 10, bottom: 10, padding: "6px 10px", borderRadius: 999 }}>
          Tap the map to drop a pin
        </span>
      )}
    </div>
  );
}

function StepHeader({ step, onBack }) {
  const titles = ["What happened", "Where it is", "Details and evidence"];
  return (
    <div style={{ padding: "20px 20px 4px" }}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <button type="button" onClick={onBack} aria-label="Go back" className="bg-foam text-abyss"
          style={{ width: 38, height: 38, borderRadius: 12, border: 0, display: "flex",
            alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={22} />
        </button>
        <div>
          <p className="text-sm text-slate-500">Report pollution, step {step + 1} of 3</p>
          <h1 className="font-display text-abyss text-2xl" style={{ fontWeight: 800, lineHeight: 1.1 }}>
            {titles[step]}
          </h1>
        </div>
      </div>
      <div className="flex" style={{ gap: 6, marginTop: 14 }} aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i <= step ? "bg-ocean" : "bg-mist"}
            style={{ flex: 1, height: 5, borderRadius: 3, transition: "background .3s" }} />
        ))}
      </div>
    </div>
  );
}

function ReportScreen({ points, onCancel, onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ title: "", type: "", landmark: "", description: "" });
  const [pin, setPin] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const pickLocation = (fx, fy) => {
    setPin({
      fx, fy,
      lat: MAP_ORIGIN.lat + (0.5 - fy) * 0.06,
      lng: MAP_ORIGIN.lng + (fx - 0.5) * 0.09,
    });
    setErrors((er) => ({ ...er, pin: undefined }));
  };

  const useCurrentLocation = async () => {
    setLocating(true);
    await wait(900);
    pickLocation(0.4 + Math.random() * 0.12, 0.38 + Math.random() * 0.2);
    setLocating(false);
  };

  const addEvidence = (kind) => {
    setEvidence((list) => {
      if (list.length >= 4) return list;
      const n = list.filter((e) => e.kind === kind).length + 1;
      return [...list, {
        id: `${kind}-${Date.now()}-${n}`, kind, name: kind === "photo" ? `photo_${n}.jpg` : `clip_${n}.mp4`, }]; }); };  const validateStep = (s) => { const e = {}; if (s === 0) { if (!form.title.trim()) e.title = "Add a short title for the incident."; if (!form.type) e.type = "Choose the type of pollution."; } if (s === 1 && !pin) e.pin = "Tap the map or use your current location to mark the spot."; if (s === 2 && form.description.trim().length < 10) { e.description = "Describe what you saw in at least 10 characters."; } setErrors(e); return Object.keys(e).length === 0; };  const next = () => validateStep(step) && setStep(step + 1); const back = () => (step === 0 ? onCancel() : setStep(step - 1));  const submit = async () => { if (submitting \vert{}\vert{} !validateStep(2)) return; setSubmitting(true); const label = form.landmark.trim() \vert{}\vert{} `${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}`; const report = await mockApi.submitReport({ title: form.title.trim(), type: form.type, description: form.description.trim(), location: { lat: pin.lat, lng: pin.lng, label }, evidence, }); const before = getLevelInfo(points).current.name; const after = getLevelInfo(points + POINTS_PER_REPORT).current.name; onSubmit(report, after !== before ? after : null); };  const typeLabel = POLLUTION_TYPES.find((t) => t.id === form.type)?.label;  return ( <div style={{ paddingBottom: 28 }}> <StepHeader step={step} onBack={back} />  <div style={{ padding: "18px 20px 0" }}> {step === 0 && ( <> <Field label="Incident title" value={form.title} onChange={update("title")} maxLength={80} placeholder="e.g. Oil sheen near the boat ramp" error={errors.title} /> <TypeSelect value={form.type} error={errors.type} onChange={(id) => { setForm((f) => ({ ...f, type: id })); setErrors((er) => ({ ...er, type: undefined })); }} /> </> )}  {step === 1 && ( <> <MapPicker pin={pin} onPick={pickLocation} /> {errors.pin && <p role="alert" className="text-warn text-sm" style={{ marginTop: 8 }}>{errors.pin}</p>}  <button type="button" className="btn btn-outline" onClick={useCurrentLocation} disabled={locating} style={{ marginTop: 12 }}> {locating ? <span className="spinner" aria-label="Locating" /> : <LocateFixed size={18} className="text-ocean" />} {locating ? "Finding your location" : "Use my current location"} </button>  {pin && ( <p className="text-sm text-slate-600" style={{ margin: "12px 0 4px" }}> Pin set at <strong>{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</strong> </p> )} <div style={{ marginTop: 14 }}> <Field label="Nearby landmark (optional)" icon={MapPin} value={form.landmark} onChange={update("landmark")} placeholder="e.g. Under the red footbridge" /> </div> </> )}  {step === 2 && ( <> <Field label="Description" multiline value={form.description} onChange={update("description")} maxLength={400} placeholder="What do you see, smell or notice? How large is the affected area?" error={errors.description} />  <p className="text-sm font-semibold text-ink" style={{ marginBottom: 8 }}>Photo or video evidence</p> <div style={{ display: "flex", gap: 10 }}> <button type="button" className="btn btn-outline" onClick={() => addEvidence("photo")} disabled={evidence.length >= 4}> <Camera size={18} className="text-ocean" /> Add photo </button> <button type="button" className="btn btn-outline" onClick={() => addEvidence("video")} disabled={evidence.length >= 4}> <Video size={18} className="text-ocean" /> Add video </button> </div> <p className="text-xs text-slate-500" style={{ marginTop: 6 }}> Prototype only: attachments are placeholders. Up to 4. </p>  {evidence.length > 0 && ( <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}> {evidence.map((item, i) => { const Icon = item.kind === "photo" ? ImageIcon : Video; return ( <div key={item.id} className={i \% 2 ? "bg-deep" : "bg-ocean"} style={{ position: "relative", height: 88, borderRadius: 14, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}> <Icon size={24} /> <span className="text-xs font-semibold" style={{ marginTop: 6 }}>{item.name}</span> <button type="button" aria-label={`Remove ${item.name}`}
                        onClick={() => setEvidence((list) => list.filter((e) => e.id !== item.id))}
                        className="bg-abyss"
                        style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%",
                          border: 0, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-foam" style={{ marginTop: 18, padding: 14, borderRadius: 16 }}>
              <p className="font-semibold text-abyss">{form.title}</p>
              <p className="text-sm text-slate-600">
                {typeLabel} at {form.landmark.trim() || (pin && `${pin.lat.toFixed(4)},${pin.lng.toFixed(4)}`)}
              </p>
            </div>
          </>
        )}

        <div style={{ marginTop: 22 }}>
          {step < 2 ? (
            <button type="button" className="btn btn-primary" onClick={next}>Continue</button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={submit} disabled={submitting}>
              {submitting && <span className="spinner" aria-label="Submitting" />}
              {submitting ? "Submitting" : `Submit report (+${POINTS_PER_REPORT} Eco-Points)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessOverlay({ title, leveledTo, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-abyss" role="dialog" aria-modal="true" aria-label="Report submitted"
      style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 28, textAlign: "center",
        animation: "fade-in .25s ease-out" }}>
      <div style={{ position: "relative", width: 96, height: 96, marginBottom: 28 }}>
        {[0, 0.5, 1].map((delay) => (
          <span key={delay} aria-hidden="true"
            style={{ position: "absolute", left: "50%", top: "50%", width: 96, height: 96, borderRadius: "50%",
              border: "2px solid #5CC3DB", animation: `ring-out 1.8s ease-out ${delay}s infinite` }} />
        ))}
        <div className="bg-shallows" style={{ position: "relative", width: 96, height: 96, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center", animation: "pop-in .5s ease-out" }}>
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M16 33 L28 45 L49 21" stroke="#062A40" strokeWidth="6" strokeLinecap="round"
              strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60"
              style={{ animation: "draw .5s ease-out .3s forwards" }} />
          </svg>
        </div>
      </div>

      <h2 className="font-display text-white" style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1,
        animation: "pop-in .5s ease-out .5s both" }}>
        +{POINTS_PER_REPORT} Eco-Points Earned!
      </h2>
      <p className="text-mist" style={{ marginTop: 12, maxWidth: 280, lineHeight: 1.5 }}>
        Thanks for reporting "{title}". Your report is saved.
      </p>
      {leveledTo && (
        <p className="bg-deep text-shallows font-semibold"
          style={{ marginTop: 16, padding: "8px 14px", borderRadius: 999, animation: "pop-in .5s ease-out 1s both" }}>
          Level up! You're now a {leveledTo}.
        </p>
      )}
      <button type="button" className="btn btn-shallows" onClick={onDone} style={{ marginTop: 32, maxWidth: 280 }}>
        Back to dashboard
      </button>
    </div>
  );
}

function TipRow({ tip, done, justChecked, onToggle }) {
  const Icon = tip.icon;
  return (
    <button type="button" role="checkbox" aria-checked={done} onClick={() => onToggle(tip)}
      className={`border ${done ? "bg-foam border-ocean" : "bg-white border-mist"}`} style={{ position: "relative", width: "100\%", display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left", padding: 14, borderRadius: 18, transition: "background .2s, border-color .2s" }}> <span style={{ marginTop: 2, width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: done ? "2px solid #0A7EA4" : "2px solid #9CC7D6", background: done ? "#0A7EA4" : "#fff", transition: "background .2s" }}> {done && <Check size={16} color="#fff" strokeWidth={3} />} </span> <span style={{ flex: 1, minWidth: 0 }}> <span className="flex items-center gap-2 font-semibold text-ink"> <Icon size={16} className="text-ocean" style={{ flexShrink: 0 }} /> <span>{tip.title}</span> </span> <span className="text-sm text-slate-600" style={{ display: "block", marginTop: 6, lineHeight: 1.45 }}> {tip.detail} </span> </span> {!done && <span className="text-xs font-bold text-ocean" style={{ marginTop: 4 }}>+{POINTS_PER_TIP}</span>} {justChecked && ( <span aria-hidden="true" className="text-ocean font-bold" style={{ position: "absolute", right: 14, top: 10, animation: "float-up .9s ease-out forwards" }}> +{POINTS_PER_TIP} </span> )} </button> ); }  function LearnScreen({ doneIds, onToggle }) { const [justChecked, setJustChecked] = useState(null); const done = doneIds.length;  const handleToggle = (tip) => { const willCheck = !doneIds.includes(tip.id); onToggle(tip); if (willCheck) { setJustChecked(tip.id); setTimeout(() => setJustChecked(null), 900); } };  return ( <div style={{ padding: "24px 20px 28px" }}> <h1 className="font-display text-abyss" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}> Keep water clean </h1> <p className="text-slate-600" style={{ marginTop: 8, lineHeight: 1.5 }}> Check off a habit once you've done it today. Each one earns +{POINTS_PER_TIP} Eco-Points, and the list resets tomorrow. </p>  <div className="bg-foam" style={{ marginTop: 16, padding: 16, borderRadius: 20 }}> <div className="flex items-center justify-between" style={{ marginBottom: 10 }}> <span className="font-semibold text-abyss">{done} of {ALL_TIPS.length} done today</span> <span className="text-sm font-bold text-ocean">+{done * POINTS_PER_TIP} points</span> </div> <ProgressBar value={done / ALL_TIPS.length} /> {done === ALL_TIPS.length && ( <p className="text-sm text-abyss font-semibold" style={{ marginTop: 10 }}> Every habit done. Come back tomorrow for more. </p> )} </div>  {TIP_CATEGORIES.map((cat) => { const catDone = cat.tips.filter((t) => doneIds.includes(t.id)).length; return ( <section key={cat.id} aria-label={cat.title} style={{ marginTop: 26 }}> <div className="flex items-end justify-between" style={{ marginBottom: 10 }}> <div> <h2 className="font-display text-abyss text-xl" style={{ fontWeight: 800 }}>{cat.title}</h2> <p className="text-sm text-slate-500">{cat.subtitle}</p> </div> <span className="text-sm font-semibold text-ocean">{catDone}/{cat.tips.length}</span> </div> <div style={{ display: "grid", gap: 10 }}> {cat.tips.map((tip) => ( <TipRow key={tip.id} tip={tip} done={doneIds.includes(tip.id)} justChecked={justChecked === tip.id} onToggle={handleToggle} /> ))} </div> </section> ); })} </div> ); }  function ProfileScreen({ user, points, reports, doneCount, onSignOut, onUpgrade }) { const info = getLevelInfo(points); const stats = [ ["Eco-Points", points], ["Reports", reports.length], ["Habits today", doneCount], ];  return ( <div style={{ padding: "24px 20px 28px" }}> <div className="flex items-center" style={{ gap: 14 }}> <div className="bg-abyss text-shallows" style={{ width: 60, height: 60, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}> <Waves size={28} /> </div> <div> <h1 className="font-display text-abyss text-2xl" style={{ fontWeight: 800, lineHeight: 1.1 }}>{user.name}</h1> <p className="text-sm text-slate-600"> {user.type === "guest" ? `${user.id}, temporary account` : user.email || "Member"}
          </p>
          <p className="text-sm font-semibold text-ocean">{info.current.name}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 20 }}>
        {stats.map(([label, value]) => (
          <div key={label} className="bg-foam" style={{ padding: "14px 8px", borderRadius: 16, textAlign: "center" }}>
            <p className="font-display text-abyss text-2xl" style={{ fontWeight: 800 }}>{value}</p>
            <p className="text-xs text-slate-600">{label}</p>
          </div>
        ))}
      </div>

      {user.type === "guest" && (
        <div className="bg-abyss" style={{ marginTop: 18, padding: 16, borderRadius: 20 }}>
          <p className="text-white font-semibold">Keep your progress</p>
          <p className="text-mist text-sm" style={{ margin: "4px 0 12px", lineHeight: 1.45 }}>
            Guest data lives only in this session. Create an account to save your points and reports.
          </p>
          <button type="button" className="btn btn-shallows" onClick={onUpgrade}>Create an account</button>
        </div>
      )}

      <SectionTitle>My reports</SectionTitle>
      {reports.length === 0 ? (
        <div className="bg-foam" style={{ padding: 18, borderRadius: 18, textAlign: "center" }}>
          <ClipboardList size={26} className="text-ocean" style={{ margin: "0 auto 8px" }} />
          <p className="text-slate-600 text-sm">No reports yet. Use Report to log your first incident.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {reports.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      )}

      <button type="button" className="btn btn-outline" onClick={onSignOut} style={{ marginTop: 26 }}>
        <LogOut size={18} /> Sign out
      </button>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "report", label: "Report", icon: Plus, accent: true },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "profile", label: "Profile", icon: User },
];

function BottomNav({ tab, onChange }) {
  return (
    <nav aria-label="Main" className="bg-white border-mist"
      style={{ display: "flex", borderTop: "1px solid #CFE6EE", padding: "8px 8px 12px", flexShrink: 0 }}>
      {NAV_ITEMS.map(({ id, label, icon: Icon, accent }) => {
        const active = tab === id;
        return (
          <button key={id} type="button" onClick={() => onChange(id)} aria-current={active ? "page" : undefined}
            style={{ flex: 1, background: "none", border: 0, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, color: active ? "#0A7EA4" : "#5A7482", fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 40, height: 30, borderRadius: 15, display: "flex", alignItems: "center",
              justifyContent: "center",
              background: accent ? "#0A7EA4" : active ? "#EAF6FA" : "transparent",
              color: accent ? "#fff" : "inherit" }}>
              <Icon size={20} />
            </span>
            {label}
          </button>
        );
      })}
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("signin");
  const [tab, setTab] = useState("home");

  const [points, setPoints] = useState(STARTING_POINTS);
  const [reports, setReports] = useState(SEED_REPORTS);
  const [tipLog, setTipLog] = useState({ day: todayKey(), ids: [] });

  const [toast, setToast] = useState(null);
  const [celebration, setCelebration] = useState(null);

  const mainRef = useRef(null);

  const doneIds = tipLog.day === todayKey() ? tipLog.ids : [];

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0 });
  }, [tab]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const handleToggleTip = (tip) => {
    const wasDone = doneIds.includes(tip.id);
    const nextPoints = Math.max(0, points + (wasDone ? -POINTS_PER_TIP : POINTS_PER_TIP));
    setTipLog({
      day: todayKey(),
      ids: wasDone ? doneIds.filter((id) => id !== tip.id) : [...doneIds, tip.id],
    });
    setPoints(nextPoints);
    if (!wasDone) {
      const before = getLevelInfo(points).index;
      const after = getLevelInfo(nextPoints).index;
      if (after > before) setToast(`Level up! You're now a ${LEVELS[after].name}.`);
    }
  };

  const handleSubmitReport = (report, leveledTo) => {
    setReports((list) => [report, ...list]);
    setPoints((p) => p + POINTS_PER_REPORT);
    setTab("home");
    setCelebration({ title: report.title, leveledTo });
  };

  const handleSignOut = (mode = "signin") => {
    setUser(null);
    setAuthMode(mode);
    setTab("home");
    setPoints(STARTING_POINTS);
    setReports(SEED_REPORTS);
    setTipLog({ day: todayKey(), ids: [] });
    setCelebration(null);
  };

  return (
    <div className="tw">
      <div className="phone-shell bg-white">
        {!user ? (
          <AuthScreen key={authMode} initialMode={authMode} onAuthed={(u) => { setUser(u); setTab("home"); }} />
        ) : (
          <>
            <main ref={mainRef} style={{ flex: 1, overflowY: "auto" }}>
              {tab === "home" && (
                <HomeScreen user={user} points={points} doneCount={doneIds.length} reports={reports}
                  onReport={() => setTab("report")} onOpenLearn={() => setTab("learn")}
                  onOpenProfile={() => setTab("profile")} />
              )}
              {tab === "report" && (
                <ReportScreen points={points} onCancel={() => setTab("home")} onSubmit={handleSubmitReport} />
              )}
              {tab === "learn" && <LearnScreen doneIds={doneIds} onToggle={handleToggleTip} />}
              {tab === "profile" && (
                <ProfileScreen user={user} points={points} reports={reports} doneCount={doneIds.length}
                  onSignOut={() => handleSignOut("signin")} onUpgrade={() => handleSignOut("signup")} />
              )}
            </main>
            <BottomNav tab={tab} onChange={setTab} />
          </>
        )}

        {toast && (
          <div role="status" aria-live="polite" className="bg-abyss text-white font-semibold text-sm"
            style={{ position: "absolute", left: "50%", bottom: 92, zIndex: 40, padding: "10px 16px",
              borderRadius: 999, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
              boxShadow: "0 8px 24px rgba(6,42,64,.3)", animation: "toast-in .3s ease-out forwards" }}>
            <Sparkles size={16} className="text-shallows" /> {toast}
          </div>
        )}

        {celebration && <SuccessOverlay {...celebration} onDone={() => setCelebration(null)} />}
      </div>
    </div>
  );
}

// Render root
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
