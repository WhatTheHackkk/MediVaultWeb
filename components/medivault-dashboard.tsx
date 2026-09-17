"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Activity, ClipboardList, LayoutDashboard, LogIn, LogOut, Package, Search, ShieldCheck, ShoppingCart, Users } from "lucide-react";

const medicines = [
  { name: "Amoxicillin 500mg", batch: "AMX-2408", stock: 18, status: "Low stock" },
  { name: "Metformin 850mg", batch: "MET-2411", stock: 142, status: "Healthy" },
  { name: "Lisinopril 10mg", batch: "LIS-2409", stock: 7, status: "Low stock" },
  { name: "Azithromycin 250mg", batch: "AZI-2407", stock: 0, status: "Recalled" },
];
const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/checkout", label: "Secure checkout", icon: ShoppingCart },
  { href: "/audit", label: "Audit logs", icon: ClipboardList },
];

export default function MediVaultDashboard({ section = "overview" }: { section?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  useEffect(() => { setAdmin(sessionStorage.getItem("medivault-admin") === "true"); }, []);
  const title = section === "overview" ? "Operations overview" : section[0].toUpperCase() + section.slice(1);

  function submitLogin(event: FormEvent) {
    event.preventDefault();
    if (credentials.username === "admin" && credentials.password === "admin") {
      sessionStorage.setItem("medivault-admin", "true");
      setAdmin(true);
      setLoginOpen(false);
      window.location.reload();
    } else setLoginError("Use the preset admin credentials to continue.");
  }

  function signOut() {
    sessionStorage.removeItem("medivault-admin");
    setAdmin(false);
    router.push("/");
    window.location.reload();
  }

  if (!admin) return <PublicPortal onLogin={() => setLoginOpen(true)} loginOpen={loginOpen} credentials={credentials} setCredentials={setCredentials} error={loginError} onSubmit={submitLogin} onClose={() => setLoginOpen(false)} />;

  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">+</span><span>Medi<span>Vault</span></span></div><div className="role"><ShieldCheck size={16} /> Administrator</div><nav aria-label="Admin navigation">{nav.map(({ href, label, icon: Icon }) => <Link className={pathname === href ? "active" : ""} href={href} key={href}><Icon size={18} />{label}</Link>)}</nav><div className="sidebar-bottom"><div className="status"><span />Systems operational</div><button onClick={signOut}><LogOut size={16} />Sign out</button></div></aside><main className="main"><header><div><p className="eyebrow">MEDIVAULT / {section.toUpperCase()}</p><h1>{title}</h1></div><button className="admin-button" onClick={signOut}><span className="avatar">AR</span>Admin account</button></header>{section === "overview" ? <Overview /> : <Section section={section} />}</main></div>;
}

function PublicPortal({ onLogin, loginOpen, credentials, setCredentials, error, onSubmit, onClose }: any) {
  return <main className="public-shell"><header className="public-header"><div className="brand"><span className="brand-mark">+</span><span>Medi<span>Vault</span></span></div><nav><Link href="#find">Find a pharmacy</Link><Link href="#medicines">Medicine availability</Link><button className="admin-button" onClick={onLogin}><LogIn size={16} />Admin Login</button></nav></header><section className="public-hero"><p className="eyebrow">TRUSTED CARE, CLOSE TO HOME</p><h1>Find what you need.<br /><em>When you need it.</em></h1><p>Search verified medical shops and check medicine availability in your area, with privacy-first access to essential care.</p><div className="public-search" id="find"><Search size={18} /><input aria-label="Search medical shops" placeholder="Search by medicine, shop, or location" /><button className="primary">Search network</button></div></section><section className="shop-grid" id="medicines"><div className="section-heading"><div><p className="eyebrow">VERIFIED NETWORK</p><h2>Medical shops near you</h2></div><span className="live-pill"><Activity size={14} /> Live inventory</span></div>{["Northstar Pharmacy", "Civic Health Mart", "Greenline Medicals"].map((shop, index) => <article className="shop-card" key={shop}><div className="shop-icon">{index + 1}</div><div><h3>{shop}</h3><p>{index + 1}.2 + {index} miles away · Open until 9 PM</p><span className="badge healthy">{index === 1 ? "32 medicines available" : "Live stock verified"}</span></div><Link href="/inventory">View stock →</Link></article>)}</section>{loginOpen && <div className="modal-backdrop" role="presentation"><form className="login-modal" onSubmit={onSubmit}><button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button><p className="eyebrow">SECURE ACCESS</p><h2>Admin Login</h2><p className="muted">Access inventory, patients, checkout, and audit controls.</p><label>Username<input value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} autoComplete="username" /></label><label>Password<input type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} autoComplete="current-password" /></label>{error && <p className="form-error">{error}</p>}<button className="primary" type="submit">Enter admin dashboard</button></form></div>}</main>;
}

function Overview() { return <><div className="hero"><div><p className="eyebrow">LIVE MONITORING</p><h2>Welcome, Administrator.</h2><p>Your pharmacy network is stable. Here&apos;s the latest operational snapshot.</p></div><Link href="/checkout" className="primary"><ShoppingCart size={17} />Open secure checkout</Link></div><div className="stats"><Link href="/inventory?filter=low"><span className="stat-label">LOW STOCK ALERTS</span><strong>12</strong><small>Needs attention <b>→</b></small></Link><Link href="/patients"><span className="stat-label">REGISTERED PATIENTS</span><strong>2,481</strong><small>+8.4% this month <b>↗</b></small></Link><Link href="/inventory"><span className="stat-label">INVENTORY VALUE</span><strong>$84,290</strong><small>Across 286 products <b>→</b></small></Link><Link href="/audit"><span className="stat-label">SECURITY SCORE</span><strong>98.6%</strong><small>All systems secure <b>✓</b></small></Link></div><div className="content-grid"><section className="panel"><div className="panel-head"><div><p className="eyebrow">INVENTORY CONTROL</p><h3>Stock requiring attention</h3></div><Link href="/inventory">View inventory →</Link></div><div className="table-wrap"><table><thead><tr><th>Medicine</th><th>Batch</th><th>Stock</th><th>Status</th></tr></thead><tbody>{medicines.map((m) => <tr key={m.batch}><td><b>{m.name}</b></td><td className="muted">{m.batch}</td><td>{m.stock} units</td><td><span className={`badge ${m.status === "Healthy" ? "healthy" : m.status === "Recalled" ? "recalled" : "warning"}`}>{m.status}</span></td></tr>)}</tbody></table></div></section><section className="panel activity"><div className="panel-head"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>Audit trail</h3></div><Link href="/audit">Full log →</Link></div>{["Inventory synced across 4 locations", "New patient record registered", "Checkout terminal authenticated"].map((item, index) => <div className="activity-row" key={item}><span className="activity-dot" /><div><b>{item}</b><small>{index + 2} minutes ago · Admin</small></div></div>)}</section></div></>; }

function Section({ section }: { section: string }) { if (section === "checkout") return <div className="checkout panel"><p className="eyebrow">SECURE POS TERMINAL</p><h2>Process a prescription safely.</h2><p className="muted">Validate patient thresholds, stock limits, and recalled batches before dispensing.</p><label>Search patient or prescription<div className="input-with-icon"><input placeholder="Search by patient ID or medicine name" /><Search size={18} /></div></label><button className="primary">Begin secure checkout</button></div>; const rows = section === "inventory" ? medicines : [{ name: "Network inventory sync", batch: "AUD-1092", stock: "Today, 09:42", status: "Verified" }, { name: "Patient profile update", batch: "PAT-8821", stock: "Today, 09:31", status: "Verified" }, { name: "Checkout authorization", batch: "POS-4408", stock: "Today, 09:18", status: "Verified" }]; return <section className="panel full"><div className="panel-head"><div><p className="eyebrow">MEDIVAULT / {section.toUpperCase()}</p><h2>{section === "inventory" ? "Inventory control" : section === "patients" ? "Patient registry" : "System audit trail"}</h2></div><button className="primary">{section === "inventory" ? "+ Add medicine" : section === "patients" ? "+ Register patient" : "Export log"}</button></div><div className="search"><Search size={17} /><input placeholder={`Search ${section}...`} /></div><div className="table-wrap"><table><thead><tr><th>Record</th><th>Reference</th><th>Updated</th><th>Status</th></tr></thead><tbody>{rows.map((m: any) => <tr key={m.batch}><td><b>{m.name}</b></td><td className="muted">{m.batch}</td><td>{m.stock}</td><td><span className="badge healthy">{m.status}</span></td></tr>)}</tbody></table></div></section>; }

const _keepIcons = { Activity, ClipboardList, LayoutDashboard, LogIn, LogOut, Package, Search, ShieldCheck, ShoppingCart, Users };
void _keepIcons;
