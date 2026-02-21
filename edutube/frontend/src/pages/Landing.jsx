import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * Landing page – chiseled / liquid UI reference (HYDRARGYRUM-style).
 * Dark theme, mercury blobs, glass cards, scroll progress, reveal animations.
 * EduTube content: learning journeys, sign in/sign up, footer.
 */
const Landing = () => {
  const progressRef = useRef(null);
  const heroImageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${scrolled}%`;

      const reveals = document.querySelectorAll(".landing-reveal");
      const windowHeight = window.innerHeight;
      reveals.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 150) el.classList.add("landing-reveal-active");
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const label = document.getElementById("landing-hero-label");
    const title = document.getElementById("landing-hero-title");
    const cta = document.getElementById("landing-hero-cta");
    if (!label || !title || !cta) return;
    const t1 = setTimeout(() => {
      label.style.transition = "all 1s ease";
      label.style.opacity = "1";
      label.style.transform = "translateY(0)";
    }, 300);
    const t2 = setTimeout(() => {
      title.style.transition = "all 1.2s cubic-bezier(0.23, 1, 0.32, 1)";
      title.style.opacity = "1";
      title.style.transform = "translateY(0)";
    }, 500);
    const t3 = setTimeout(() => {
      cta.style.transition = "all 1s ease";
      cta.style.opacity = "1";
      cta.style.transform = "translateY(0)";
    }, 800);
    const t4 = setTimeout(() => {
      if (heroImageRef.current) heroImageRef.current.classList.add("landing-hero-image-visible");
    }, 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="landing-page">
      <style>{`
        .landing-page {
          --landing-bg: #050506;
          --landing-mercury: linear-gradient(135deg, #e0e0e0 0%, #8e8e93 45%, #ffffff 50%, #8e8e93 55%, #4a4a4a 100%);
          --landing-glass: rgba(255, 255, 255, 0.03);
          --landing-border: rgba(255, 255, 255, 0.12);
          --landing-mono: 'JetBrains Mono', monospace;
          --landing-sans: 'Inter', sans-serif;
        }
        .landing-page { background: var(--landing-bg); color: #fff; font-family: var(--landing-sans); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        .landing-mercury-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; filter: blur(80px) contrast(1.2); opacity: 0.6; pointer-events: none; }
        .landing-blob { position: absolute; background: var(--landing-mercury); border-radius: 50%; animation: landing-float 20s infinite ease-in-out; }
        .landing-blob-1 { width: 600px; height: 600px; top: -10%; left: -10%; animation-delay: 0s; opacity: 0.4; }
        .landing-blob-2 { width: 500px; height: 500px; bottom: -5%; right: -5%; animation-delay: -5s; opacity: 0.3; }
        @keyframes landing-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, 50px) scale(1.1); }
          66% { transform: translate(-50px, 120px) scale(0.9); }
        }
        .landing-header { position: fixed; top: 0; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 4rem; z-index: 1000; backdrop-filter: blur(20px) saturate(180%); background: rgba(5, 5, 6, 0.4); border-bottom: 1px solid var(--landing-border); }
        .landing-logo { font-family: var(--landing-mono); font-weight: 500; letter-spacing: -1px; font-size: 1.2rem; text-transform: uppercase; display: flex; align-items: center; gap: 10px; color: #fff; text-decoration: none; }
        .landing-logo-orb { width: 16px; height: 16px; background: var(--landing-mercury); border-radius: 50%; box-shadow: 0 0 15px rgba(255,255,255,0.3); }
        .landing-hero { min-height: 100vh; position: relative; display: flex; align-items: flex-start; padding: 8rem 8rem 4rem; overflow: hidden; }
        .landing-hero-bg { position: absolute; inset: 0; z-index: 0; }
        .landing-hero-bg img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1); }
        .landing-hero-bg img.landing-hero-image-visible { opacity: 1; }
        .landing-hero-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(90deg, rgba(5,5,6,0.85) 0%, rgba(5,5,6,0.5) 50%, rgba(5,5,6,0.2) 100%); }
        .landing-hero-content { position: relative; z-index: 2; max-width: 720px; padding-top: 4vh; }
        .landing-hero-label { font-family: var(--landing-mono); font-size: 0.75rem; color: #8e8e93; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px; opacity: 0; transform: translateY(20px); }
        .landing-hero-label::before { content: ''; width: 40px; height: 1px; background: #4a4a4a; }
        .landing-hero h1 { font-size: clamp(2.5rem, 11vw, 7rem); line-height: 0.9; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase; margin-bottom: 2rem; background: linear-gradient(180deg, #fff 0%, #666 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; opacity: 0; transform: translateY(40px); }
        .landing-hero-cta { display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; opacity: 0; transform: translateY(30px); }
        .landing-btn-primary { padding: 1.2rem 2.5rem; background: #fff; color: #000; text-decoration: none; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 2px; transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1); display: inline-block; }
        .landing-btn-primary:hover { transform: scale(1.05); }
        .landing-btn-secondary { font-family: var(--landing-mono); font-size: 0.8rem; color: #fff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 4px; transition: border-color 0.3s; }
        .landing-btn-secondary:hover { border-color: #fff; }
        .landing-section { padding: 10rem 8rem; display: grid; grid-template-columns: 1.2fr 1fr; gap: 6rem; align-items: center; border-top: 1px solid var(--landing-border); }
        .landing-section-tag { font-family: var(--landing-mono); color: #8e8e93; font-size: 0.8rem; margin-bottom: 2rem; display: block; }
        .landing-section h2 { font-size: clamp(2rem, 4rem, 4rem); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 1.5rem; }
        .landing-section p { font-size: 1.2rem; color: rgba(255,255,255,0.5); max-width: 500px; margin-bottom: 3rem; }
        .landing-card { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%); border: 1px solid var(--landing-border); padding: 3rem; border-radius: 4px; position: relative; backdrop-filter: blur(10px); transition: border-color 0.5s ease; }
        .landing-card:hover { border-color: rgba(255,255,255,0.4); }
        .landing-card-spec { font-family: var(--landing-mono); font-size: 0.7rem; color: #4a4a4a; position: absolute; top: 20px; right: 20px; }
        .landing-indicator { width: 100%; height: 2px; background: #1a1a1a; margin-top: 2rem; position: relative; }
        .landing-indicator-fill { position: absolute; left: 0; top: 0; height: 100%; width: 40%; background: #fff; box-shadow: 0 0 15px #fff; }
        .landing-reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
        .landing-reveal.landing-reveal-active { opacity: 1; transform: translateY(0); }
        .landing-footer { padding: 5rem 8rem 3rem; border-top: 1px solid var(--landing-border); font-family: var(--landing-mono); }
        .landing-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 4rem; }
        .landing-footer-brand { max-width: 280px; }
        .landing-footer-brand .landing-logo { margin-bottom: 1rem; }
        .landing-footer-brand p { font-size: 0.8rem; color: rgba(255,255,255,0.45); line-height: 1.6; text-transform: none; letter-spacing: 0; }
        .landing-footer-col h4 { font-size: 0.65rem; color: #4a4a4a; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1.25rem; font-weight: 600; }
        .landing-footer-col ul { list-style: none; padding: 0; margin: 0; }
        .landing-footer-col li { margin-bottom: 0.75rem; }
        .landing-footer-col a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; transition: color 0.3s; }
        .landing-footer-col a:hover { color: #fff; }
        .landing-footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-top: 2rem; border-top: 1px solid var(--landing-border); font-size: 0.7rem; color: #4a4a4a; text-transform: uppercase; }
        .landing-footer-bottom a { color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.3s; }
        .landing-footer-bottom a:hover { color: #fff; }
        #landing-progress { position: fixed; left: 0; top: 0; height: 2px; background: var(--landing-mercury); z-index: 1001; width: 0%; transition: width 0.1s ease; }
        @media (max-width: 1024px) {
          .landing-hero { padding: 6rem 2rem 3rem; }
          .landing-hero-overlay { background: rgba(5,5,6,0.7); }
        }
        @media (max-width: 768px) {
          .landing-hero { padding: 5rem 2rem 2rem; }
          .landing-section { padding: 5rem 2rem; grid-template-columns: 1fr; }
          .landing-header { padding: 1.5rem 2rem; }
          .landing-footer { padding: 3rem 2rem 2rem; }
          .landing-footer-grid { grid-template-columns: 1fr; gap: 2.5rem; margin-bottom: 3rem; text-align: center; }
          .landing-footer-brand { max-width: none; }
          .landing-footer-bottom { flex-direction: column; text-align: center; padding-top: 1.5rem; }
        }
      `}</style>

      <div id="landing-progress" ref={progressRef} />

      <div className="landing-mercury-canvas" aria-hidden>
        <div className="landing-blob landing-blob-1" />
        <div className="landing-blob landing-blob-2" />
      </div>

      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <span className="landing-logo-orb" />
          EduTube
        </Link>
        <Link to="/auth?tab=signup" className="landing-btn-primary" style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem" }}>
          Sign up
        </Link>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-bg" aria-hidden>
            <img
              ref={heroImageRef}
              src="/hero.png"
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80";
              }}
            />
          </div>
          <div className="landing-hero-overlay" aria-hidden />
          <div className="landing-hero-content">
            <div className="landing-hero-label" id="landing-hero-label">
              Learning platform · Your progress, one step at a time
            </div>
            <h1 id="landing-hero-title">
              Your Journey,
              <br />
              One Step at a Time
            </h1>
            <div className="landing-hero-cta" id="landing-hero-cta">
              <Link to="/auth" className="landing-btn-primary">
                Sign in
              </Link>
              <Link to="/auth?tab=signup" className="landing-btn-secondary">
                Create account
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-section landing-reveal" id="features">
          <div>
            <span className="landing-section-tag">01 // Create</span>
            <h2>Journeys from playlists</h2>
            <p>
              Turn any YouTube playlist into a structured learning journey. Add chapters, track progress, and keep notes in one place.
            </p>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--landing-mono)", fontSize: "1.5rem", color: "#fff" }}>Playlists</div>
                <div style={{ fontFamily: "var(--landing-mono)", fontSize: "0.6rem", color: "#4a4a4a" }}>YOUTUBE SOURCES</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--landing-mono)", fontSize: "1.5rem", color: "#fff" }}>Chapters</div>
                <div style={{ fontFamily: "var(--landing-mono)", fontSize: "0.6rem", color: "#4a4a4a" }}>STRUCTURED STEPS</div>
              </div>
            </div>
          </div>
          <div className="landing-card">
            <div className="landing-card-spec">EDUTUBE_01</div>
            <div style={{ fontFamily: "var(--landing-mono)", fontSize: "0.8rem", marginBottom: "1rem", color: "#8e8e93" }}>
              // DASHBOARD
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Track progress</h3>
            <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
              See completion per journey and chapter. Pick up where you left off and keep momentum.
            </p>
            <div style={{ fontFamily: "var(--landing-mono)", fontSize: "0.7rem", color: "#4a4a4a", marginBottom: "1rem" }}>DRAFTS &amp; STATE</div>
            <ul style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ padding: "0.35rem 0", borderBottom: "1px solid var(--landing-border)" }}>· In progress — 2 journeys</li>
              <li style={{ padding: "0.35rem 0", borderBottom: "1px solid var(--landing-border)" }}>· Draft — 1 journey</li>
              <li style={{ padding: "0.35rem 0" }}>· Completed — 4 journeys</li>
            </ul>
            <div className="landing-indicator">
              <div className="landing-indicator-fill" />
            </div>
          </div>
        </section>

        <section className="landing-section landing-reveal" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="landing-card" style={{ order: -1 }}>
            <div className="landing-card-spec">NOTE_SPEC</div>
            <div style={{ fontFamily: "var(--landing-mono)", fontSize: "0.7rem", color: "#4a4a4a", marginBottom: "0.75rem" }}>// DRAFT LINES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ height: 40, width: "100%", borderBottom: "1px solid var(--landing-border)" }} />
              <div style={{ height: 40, width: "80%", borderBottom: "1px solid var(--landing-border)" }} />
              <div style={{ height: 40, width: "60%", borderBottom: "1px solid var(--landing-border)" }} />
            </div>
            <p style={{ fontSize: "0.85rem", color: "#8e8e93", marginTop: "1rem", marginBottom: "1rem" }}>Rich notes per chapter</p>
            <div style={{ fontFamily: "var(--landing-mono)", fontSize: "0.7rem", color: "#4a4a4a", marginBottom: "0.5rem" }}>SAVED DRAFTS</div>
            <ul style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ padding: "0.25rem 0" }}>Ch.1 — Key formulas</li>
              <li style={{ padding: "0.25rem 0" }}>Ch.3 — Summary draft</li>
            </ul>
8          </div>
          <div>
            <span className="landing-section-tag">02 // Learn</span>
            <h2>Notes & structure</h2>
            <p>
              Take notes while you learn. Organize by chapter and revisit anytime. Export and share when you need to.
            </p>
            <Link to="/auth?tab=signup" className="landing-btn-secondary">
              Get started
            </Link>
          </div>
        </section>

        <section className="landing-section landing-reveal">
          <div>
            <span className="landing-section-tag">03 // Explore</span>
            <h2>Discover & fork</h2>
            <p>
              Browse public journeys from the community. Fork any journey to your account and adapt it to your pace.
            </p>
            <Link to="/auth" className="landing-btn-primary">
              Sign in to explore
            </Link>
          </div>
          <div className="landing-card">
            <div className="landing-card-spec">PUBLIC</div>
            <div style={{ fontFamily: "var(--landing-mono)", fontSize: "0.8rem", color: "#8e8e93", marginBottom: "0.5rem" }}>
              Community journeys
            </div>
            <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
              Public learning paths you can clone and customize.
            </p>
            <div style={{ fontFamily: "var(--landing-mono)", fontSize: "0.7rem", color: "#4a4a4a", marginBottom: "0.5rem" }}>DISCOVERY DRAFTS</div>
            <ul style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ padding: "0.3rem 0", borderBottom: "1px solid var(--landing-border)" }}>React basics · 12 chapters</li>
              <li style={{ padding: "0.3rem 0", borderBottom: "1px solid var(--landing-border)" }}>Python for data · 8 chapters</li>
              <li style={{ padding: "0.3rem 0" }}>System design · 6 chapters</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand">
            <Link to="/" className="landing-logo">
              <span className="landing-logo-orb" />
              EduTube
            </Link>
            <p>
              Turn YouTube playlists into structured learning journeys. Track progress, take notes, and learn at your own pace.
            </p>
          </div>
          <div className="landing-footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how">How it works</a></li>
              <li><Link to="/auth?tab=signup">Get started</Link></li>
            </ul>
          </div>
          <div className="landing-footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/auth">Sign in</Link></li>
              <li><Link to="/auth?tab=signup">Sign up</Link></li>
            </ul>
          </div>
          <div className="landing-footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <div>© {new Date().getFullYear()} EduTube. All rights reserved.</div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link to="/auth">Sign in</Link>
            <Link to="/auth?tab=signup">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
