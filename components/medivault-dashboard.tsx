"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Activity, ClipboardList, LayoutDashboard, LogIn, LogOut, Package, Search, ShieldCheck, ShoppingCart, Users } from "lucide-react";

type Medicine = { name: string; batch: string; stock: number; threshold: number; recalled?: boolean };

const medicines: Medicine[] = [
  { name: "Amoxicillin 500mg", batch: "AMX-2408", stock: 18, threshold: 20 },
  { name: "Metformin 850mg", batch: "MET-2411", stock: 142, threshold: 30 },
  { name: "Lisinopril 10mg", batch: "LIS-2409", stock: 7, threshold: 15 },
  { name: "Azithromycin 250mg", batch: "AZI-2407", stock: 0, threshold: 10, recalled: true },
  { name: "Atorvastatin 20mg", batch: "ATO-2410", stock: 64, threshold: 20 },
  { name: "Omeprazole 20mg", batch: "OMP-2412", stock: 51, threshold: 15 },
  { name: "Amlodipine 5mg", batch: "AML-2406", stock: 23, threshold: 20 },
  { name: "Cetirizine 10mg", batch: "CET-2413", stock: 88, threshold: 25 },
  { name: "Ibuprofen 400mg", batch: "IBU-2405", stock: 12, threshold: 20 },
  { name: "Losartan 50mg", batch: "LOS-2414", stock: 39, threshold: 20 },
];
const patients = ["PAT-1001", "PAT-1002", "PAT-1003", "PAT-1004", "PAT-1005"];
const lowStock = medicines.filter((medicine) => !medicine.recalled && medicine.stock < medicine.threshold);
const recalled = medicines.filter((medicine) => medicine.recalled);
const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/checkout", label: "Secure checkout", icon: ShoppingCart },
  { href: "/audit", label: "Audit logs", icon: ClipboardList },
];

export default function MediVaultDashboard({ section = "overview" }: { section?: string }) {
  const pathname = usePathname();
  const [admin, setAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  useEffect(() => setAdmin(sessionStorage.getItem("medivault-admin") === "true"), []);

  function submitLogin(event: FormEvent) {
    event.preventDefault();
    if (credentials.username === "admin" && credentials.password === "admin") {
      sessionStorage.setItem("medivault-admin", "true");
      window.location.reload();
    } else setLoginError("Enter the administrator credentials to continue.");
  }
  function signOut() {
    sessionStorage.removeItem("medivault-admin");
    window.location.href = "/";
  }
  if (!admin) return <PublicPortal loginOpen={loginOpen} credentials={credentials} setCredentials={setCredentials} error={loginError} onLogin={() => { setLoginError(""); setCredentials({ username: "", password: "" }); setLoginOpen(true); }} onSubmit={submitLogin} onClose={() => setLoginOpen(false)} />;

  const title = section === "overview" ? "Operations overview" : section === "checkout" ? "Secure checkout" : section === "audit" ? "Audit logs" : section[0].toUpperCase() + section.slice(1);
  return <div className="app-shell"><aside className="sidebar"><Brand /><div className="role"><ShieldCheck size={16} /> Administrator</div><nav aria-label="Admin navigation">{nav.map(({ href, label, icon: Icon }) => <Link className={pathname === href ? "active" : ""} href={href} key={href}><Icon size={18} />{label}</Link>)}</nav><div className="sidebar-bottom"><div className="status"><span />Local data connected</div><button onClick={signOut}><LogOut size={16} />Sign out</button></div></aside><main className="main"><header><div><p className="eyebrow">MEDIVAULT / {section.toUpperCase()}</p><h1>{title}</h1></div><button className="admin-button" onClick={signOut}><span className="avatar">AD</span>Administrator</button></header>{section === "overview" ? <Overview /> : <Section section={section} />}</main></div>;
}

function Brand() { return <div className="brand"><span className="brand-mark">+</span><span>Medi<span>Vault</span></span></div>; }
function PublicPortal({ onLogin, loginOpen, credentials, setCredentials, error, onSubmit, onClose }: any) { return <main className="public-shell"><header className="public-header"><Brand /><nav><Link href="#find">Find a pharmacy</Link><Link href="#medicines">Medicine availability</Link><button className="admin-button" onClick={onLogin}><LogIn size={16} />Admin Login</button></nav></header><section className="public-hero"><p className="eyebrow">TRUSTED CARE, CLOSE TO HOME</p><h1>Find what you need.<br /><em>When you need it.</em></h1><p>Check verified medicine availability in a privacy-first local pharmacy network.</p><div className="public-search" id="find"><Search size={18} /><input aria-label="Search medical shops" placeholder="Search by medicine, shop, or location" /><button className="primary">Search network</button></div></section><section className="shop-grid" id="medicines"><div className="section-heading"><div><p className="eyebrow">VERIFIED NETWORK</p><h2>Medical shops near you</h2></div><span className="live-pill"><Activity size={14} /> Local inventory</span></div>{["Northstar Pharmacy", "Civic Health Mart", "Greenline Medicals"].map((shop, index) => <article className="shop-card" key={shop}><div className="shop-icon">{index + 1}</div><div><h3>{shop}</h3><p>{1 + index}.2 miles away · Open until 9 PM</p><span className="badge healthy">Inventory verified</span></div><Link href="/inventory">View stock →</Link></article>)}</section>{loginOpen && <div className="modal-backdrop"><form className="login-modal" onSubmit={onSubmit}><button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button><p className="eyebrow">SECURE ACCESS</p><h2>Admin Login</h2><p className="muted">Use your administrator credentials to access local records.</p><label>Username<input autoComplete="username" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} /></label><label>Password<input type="password" autoComplete="current-password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary" type="submit">Sign in securely</button></form></div>}</main>; }

function Overview() { return <><div className="hero"><div><p className="eyebrow">LIVE MONITORING</p><h2>Welcome, Administrator.</h2><p>Your local pharmacy data is ready. Here&apos;s the current operational snapshot.</p></div><Link href="/checkout" className="primary"><ShoppingCart size={17} />Open secure checkout</Link></div><div className="stats"><Link href="/inventory?filter=low"><span className="stat-label">LOW STOCK ALERTS</span><strong>{lowStock.length}</strong><small>Below threshold <b>→</b></small></Link><Link href="/patients"><span className="stat-label">REGISTERED PATIENTS</span><strong>{patients.length}</strong><small>Local records <b>→</b></small></Link><Link href="/inventory"><span className="stat-label">TOTAL MEDICINES</span><strong>{medicines.length}</strong><small>Seeded records <b>→</b></small></Link><Link href="/inventory?filter=recalled"><span className="stat-label">RECALLED BATCHES</span><strong>{recalled.length}</strong><small>Quarantined <b>→</b></small></Link></div><div className="content-grid"><section className="panel"><div className="panel-head"><div><p className="eyebrow">INVENTORY CONTROL</p><h3>Stock requiring attention</h3></div><Link href="/inventory?filter=low">View filtered inventory →</Link></div><div className="table-wrap"><table><thead><tr><th>Medicine</th><th>Batch</th><th>Stock</th><th>Status</th></tr></thead><tbody>{medicines.filter((m) => m.recalled || m.stock < m.threshold).map((m) => <MedicineRow medicine={m} key={m.batch} />)}</tbody></table></div></section><section className="panel activity"><div className="panel-head"><div><p className="eyebrow">LOCAL ACTIVITY</p><h3>System trail</h3></div><Link href="/audit">Full log →</Link></div>{["Inventory records loaded", `${patients.length} patient records available`, `${recalled.length} batch marked recalled`].map((item) => <div className="activity-row" key={item}><span className="activity-dot" /><div><b>{item}</b><small>Current session</small></div></div>)}</section></div></>; }
function MedicineRow({ medicine }: { medicine: Medicine }) { const status = medicine.recalled ? "Recalled" : "Low stock"; return <tr><td><b>{medicine.name}</b></td><td className="muted">{medicine.batch}</td><td>{medicine.stock} / {medicine.threshold} min</td><td><span className={`badge ${medicine.recalled ? "recalled" : "warning"}`}>{status}</span></td></tr>; }
function Section({ section }: { section: string }) { if (section === "checkout") return <div className="checkout panel"><p className="eyebrow">SECURE POS TERMINAL</p><h2>Process a prescription safely.</h2><p className="muted">Validate patient thresholds, stock limits, and recalled batches before dispensing.</p><label>Search patient or prescription<div className="input-with-icon"><input placeholder="Search by patient ID or medicine name" /><Search size={18} /></div></label><button className="primary">Begin secure checkout</button></div>; if (section === "inventory") { return <section className="panel full"><div className="panel-head"><div><p className="eyebrow">MEDIVAULT / INVENTORY</p><h2>Inventory control</h2><p className="muted">{medicines.length} medicines · {lowStock.length} low stock · {recalled.length} recalled</p></div></div><div className="table-wrap"><table><thead><tr><th>Medicine</th><th>Batch</th><th>Stock / threshold</th><th>Status</th></tr></thead><tbody>{medicines.map((m) => <MedicineRow medicine={m} key={m.batch} />)}</tbody></table></div></section>; } if (section === "patients") return <section className="panel full"><div className="panel-head"><div><p className="eyebrow">MEDIVAULT / PATIENTS</p><h2>Patient registry</h2><p className="muted">{patients.length} registered local patients</p></div></div><div className="patient-list">{patients.map((patient, index) => <div className="patient-row" key={patient}><span className="avatar">{String(index + 1).padStart(2, "0")}</span><div><b>Patient record {index + 1}</b><small>{patient} · Registered locally</small></div><span className="badge healthy">Active</span></div>)}</div></section>; return <section className="panel full"><div className="panel-head"><div><p className="eyebrow">MEDIVAULT / AUDIT</p><h2>System audit trail</h2></div></div>{["Inventory records loaded", "Patient registry accessed", "Secure checkout ready"].map((item, index) => <div className="activity-row" key={item}><span className="activity-dot" /><div><b>{item}</b><small>Local session event · {index + 1}</small></div></div>)}</section>; }
