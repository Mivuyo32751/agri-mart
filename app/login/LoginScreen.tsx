"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

type AccountRole = "farmer" | "enterprise";

export default function LoginPage({ accountRole }: { accountRole?: AccountRole }) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<AccountRole>(accountRole ?? "farmer");
  const role = accountRole ?? selectedRole;
  const isEnterprise = role === "enterprise";
  const story = isEnterprise
    ? {
        title: <>Source with<br />confidence</>,
        description: "Find dependable local suppliers, compare available produce, and plan purchasing around real harvest timelines.",
        benefits: ["Supplier network", "Live availability", "Harvest outlook"],
        credit: "A clearer view of your supply chain",
      }
    : {
        title: <>Grow with<br />confidence</>,
        description: "Keep crop records, track expected yields, and share harvest updates with the buyers who need them.",
        benefits: ["Crop records", "Harvest planning", "Buyer visibility"],
        credit: "A clearer view of every growing season",
      };
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [recovery, setRecovery] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const savedEmail = window.localStorage.getItem(`agri-mart-${role}-email`);
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, [role]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loginForm = event.currentTarget;
    if (recovery) {
      setNotice("Password recovery is not connected yet. Your email has not been sent.");
      return;
    }
    setNotice(registering ? "Creating your account…" : "Signing you in…");
    try {
      const response = await fetch(registering ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password, remember, ...(registering ? { name, businessName } : {}) }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) { setNotice(result.error ?? "Could not complete sign-in. Try again."); return; }
      if (!registering) {
        if (remember) window.localStorage.setItem(`agri-mart-${role}-email`, email.trim());
        else window.localStorage.removeItem(`agri-mart-${role}-email`);
        const credentialWindow = window as Window & { PasswordCredential?: new (form: HTMLFormElement) => Credential };
        if (remember && credentialWindow.PasswordCredential && navigator.credentials) {
          void navigator.credentials.store(new credentialWindow.PasswordCredential(loginForm)).catch(() => undefined);
        }
      }
      router.replace(role === "farmer" ? "/farmer" : "/enterprise");
    } catch {
      setNotice("Could not reach Agri-Mart. Check your connection and try again.");
    }
  }

  return <main className={`login-shell ${isEnterprise ? "login-shell-enterprise" : "login-shell-farmer"}`}>
    <section className={`login-story ${isEnterprise ? "login-story-enterprise" : "login-story-farmer"}`} aria-label={isEnterprise ? "Agri-Mart enterprise sourcing tools" : "Agri-Mart farmer tools"}>
      <Link href="/" className="login-story-brand"><span>✳</span><strong>Agri-Mart</strong></Link>
      <div className="login-story-copy"><span className="login-story-mark">{isEnterprise ? "◈" : "♧"}</span><h1>{story.title}</h1><i /><p>{story.description}</p></div>
      <div className="login-benefits"><article><span>{isEnterprise ? "◈" : "♧"}</span><strong>{story.benefits[0]}</strong><small>{isEnterprise ? "Discover producers" : "Keep fields organized"}</small></article><article><span>{isEnterprise ? "⌖" : "◷"}</span><strong>{story.benefits[1]}</strong><small>{isEnterprise ? "Plan with confidence" : "Know what comes next"}</small></article><article><span>▥</span><strong>{story.benefits[2]}</strong><small>{isEnterprise ? "Compare crop outlooks" : "Share progress with buyers"}</small></article></div>
      <span className="login-image-credit">{story.credit}</span>
    </section>

    <section className="login-panel">
      <div className="login-panel-top"><Link href="/" className="login-back-link">← <span>Agri-Mart home</span></Link><Link href={isEnterprise ? "/enterprise#enterprise-plans" : "/farmer"} className="login-plans-link">{isEnterprise ? "Enterprise plans" : "Farmer workspace"} ↗</Link></div>
      <div className="login-form-wrap">
        <div className={`login-logo-mark ${isEnterprise ? "enterprise-login-mark" : ""}`}>{isEnterprise ? "◈" : "♧"}</div><p className="login-wordmark">Agri<span>-Mart</span></p><p className="login-tagline">{isEnterprise ? "Source well. Grow together." : "Grow together. Thrive together."}</p>
        <div className="login-heading"><h2>{recovery ? "Reset your password" : registering ? isEnterprise ? "Create enterprise account" : "Create farmer account" : isEnterprise ? "Enterprise sign in" : "Farmer sign in"}</h2><p>{recovery ? "Enter your email to request a reset." : registering ? "Create your role-specific Agri-Mart account." : isEnterprise ? "Sign in to discover suppliers and plan your next order." : "Sign in to manage your crops and prepare for harvest."}</p></div>

        {!recovery && (accountRole ? <p className="login-role-locked">{role === "farmer" ? "Farmer workspace sign in" : "Enterprise buyer sign in"}</p> : <div className="login-role-switch" role="group" aria-label="Choose account type"><button type="button" className={role === "farmer" ? "active" : ""} onClick={() => setSelectedRole("farmer")}>♧ &nbsp; Farmer</button><button type="button" className={role === "enterprise" ? "active" : ""} onClick={() => setSelectedRole("enterprise")}>◈ &nbsp; Enterprise</button></div>)}

        <form className="login-form" onSubmit={submit}>
          {registering && <><label className="login-field"><span>{isEnterprise ? "Contact name" : "Full name"}</span><span className="login-input-wrap"><i>♙</i><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required autoComplete="name" /></span></label>{isEnterprise && <label className="login-field"><span>Business name</span><span className="login-input-wrap"><i>◈</i><input value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Your business" required autoComplete="organization" /></span></label>}</>}
          <label className="login-field"><span>Email address</span><span className="login-input-wrap"><i>♙</i><input type="email" name="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required autoComplete="username" /></span></label>
          {!recovery && <label className="login-field"><span>Password</span><span className="login-input-wrap"><i>♙</i><input type={showPassword ? "text" : "password"} name="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={registering ? "At least 10 characters" : "Enter your password"} required minLength={registering ? 10 : undefined} autoComplete={registering ? "new-password" : "current-password"} /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "◉" : "◎"}</button></span></label>}
          {!recovery && !registering && <div className="login-options"><label><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Remember me</label><button type="button" onClick={() => { setRecovery(true); setNotice(""); }}>Forgot password?</button></div>}
          <button className="login-submit" type="submit">{recovery ? "Request reset" : registering ? "Create account" : isEnterprise ? "Sign in to enterprise" : "Sign in to farmer workspace"}<span>↗</span></button>
          {recovery && <button className="login-cancel-recovery" type="button" onClick={() => { setRecovery(false); setNotice(""); }}>Back to login</button>}
        </form>

        {notice && <p className="login-notice" role="status">{notice}</p>}
        {!recovery && <button className="login-account-toggle" type="button" onClick={() => { setRegistering(!registering); setNotice(""); }}>{registering ? "Already registered? Sign in" : "New to Agri-Mart? Create an account"}</button>}
        <div className="login-security"><span>♙</span><div><strong>{isEnterprise ? "Your sourcing workspace" : "Your farm records"}</strong><p>{isEnterprise ? "Review supplier availability and crop information shared by farmers." : "Your crop and harvest updates help buyers plan with confidence."}</p></div></div>
      </div>
      <p className="login-terms">By continuing, you agree to Agri-Mart’s <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
    </section>
  </main>;
}
