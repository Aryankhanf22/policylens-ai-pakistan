import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Cpu, 
  Globe, 
  Briefcase, 
  Zap, 
  Database, 
  BarChart2,
  ArrowRightCircle,
  Brain,
  CirclePlay,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import heroImage from '../23.png';
import featureImage from '../2.png';
import featureImageTwo from '../3.png';
import './Landing.css';

export const LandingPage = () => {
  const { login } = useAuth();

  useEffect(() => {
    const els = document.querySelectorAll('.animate-on-scroll');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-black/10 selection:text-black overflow-hidden font-sans">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar__container">
          <div className="navbar__logo">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-black text-white shrink-0">P</div>
              <span className="font-extrabold text-xl tracking-tighter text-slate-900">PolicyLens <span className="text-black">AI</span></span>
            </div>
          </div>
          
          <nav className="navbar__nav hidden md:flex">
            <a className="navbar__nav-link" href="#features">Features</a>
            <a className="navbar__nav-link" href="#how">How It Works</a>
            <a className="navbar__nav-link" href="#solutions">Solutions</a>
          </nav>

          <div className="navbar__buttons">
            <button onClick={login} className="navbar__login">Log in</button>
            <button onClick={login} className="navbar__signup">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero__tag">AI Policy Intelligence Platform</div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Simulate Economic Policy<br />
            <span className="gradient-text">Before It Happens</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            AI-powered simulations of fuel prices, taxes, and subsidies — built for real-world Pakistan.
          </motion.p>

          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button onClick={login} className="btn primary">
              Start Simulation <CirclePlay size={18} />
            </button>
            <button onClick={login} className="btn secondary">
              See Demo <BarChart3 size={18} />
            </button>
          </motion.div>

        </div>

        <div className="hero-visual animate-on-scroll slide-in-right">
          <div className="hero-image-wrap relative">
            <div className="absolute inset-0 bg-black/10 blur-[120px] rounded-full -z-10 hero-glow" />
            <img 
              src={heroImage} 
              alt="Policy Intelligence Dashboard" 
              className="hero-image w-full h-full object-cover rounded-[40px] border border-white/5"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how-it-works section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 animate-on-scroll slide-in-up">
            <span className="overline mb-4">THE PROCESS</span>
            <h2 className="section-title text-5xl font-black tracking-tight">How It Works</h2>
            <p className="how-sub max-w-2xl mx-auto opacity-70">From fragmented data to actionable policy decisions in just 4 simple steps.</p>
          </div>

          <div className="how-grid">
            {[
              {
                num: "1",
                title: "Input Policy",
                icon: Database,
                desc: "Enter fuel prices, taxes, subsidies and other parameters.",
                bullets: ["Petrol: 272 → 300 PKR", "Diesel: 280 → 315 PKR", "Tax Adjustment: +3%"]
              },
              {
                num: "2",
                title: "Run Simulation",
                icon: Cpu,
                desc: "Our engine processes inputs using real-world economic formulas.",
                bullets: ["Fuel Shock Modeling", "CPI Inflation Impact", "Consumer Basket Shift"]
              },
              {
                num: "3",
                title: "Analyze Results",
                icon: BarChart2,
                desc: "View detailed results, visualizations and risk assessments.",
                bullets: ["Projected Inflation", "Household Burden", "Price Volatility"]
              },
              {
                num: "4",
                title: "Get Insights",
                icon: Brain,
                desc: "Receive AI-powered recommendations and actionable insights.",
                bullets: ["Causal Factors", "Mitigation Strategies", "Policy Guidance"]
              }
            ].map((card, idx) => (
              <div key={idx} className="how-card animate-on-scroll slide-in-up" style={{ transitionDelay: `${idx * 0.1}s` }}>
                <div className="how-number">{card.num}</div>
                <div className="how-card-content">
                  <card.icon size={36} className="text-black mb-6" />
                  <h3 className="how-card-title">{card.title}</h3>
                  <p className="how-card-desc">{card.desc}</p>
                  <ul className="how-card-list">
                    {card.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM / EXPLANATION SECTION */}
      <section id="features" className="feature-container section-padding">
        <div className="feature-image-wrapper animate-on-scroll slide-in-left relative">
          <div className="absolute inset-0 bg-black/10 blur-[80px] rounded-full -z-10" />
          <img 
            src={featureImage} 
            alt="Traditional Analysis vs AI Modeling" 
            className="w-full h-auto object-cover rounded-[40px] shadow-[0_0_50px_rgba(0,100,255,0.1)] border border-white/5"
          />
        </div>

        <div className="feature-content animate-on-scroll slide-in-right">
          <span className="overline">WHY IT MATTERS</span>
          <h2 className="main-title text-4xl font-black mb-8 leading-tight">Why Traditional Policy Analysis <br/>Falls Short</h2>

          <div className="features-grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
            {[
              { icon: Database, title: "No Real-Time Data", desc: "Decisions are based on outdated information and static reports." },
              { icon: Shield, title: "Guesswork", desc: "Lack of accurate modeling leads to unreliable and risky predictions." },
              { icon: Briefcase, title: "Hidden Impact", desc: "Real burden on families is rarely measured or accurately understood." },
              { icon: Brain, title: "No Guidance", desc: "Policymakers don't get actionable AI-driven recommendations." },
            ].map((item, idx) => (
              <div key={idx} className="feature-item">
                <item.icon className="text-black w-5 h-5 flex-shrink-0 mt-1" />
                <div className="text-content">
                  <h3 className="font-black text-slate-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES SECTION */}
      <section id="solutions" className="feature2-container section-padding bg-slate-50">
        <div className="feature-content animate-on-scroll slide-in-left">
          <span className="overline mb-4">CAPABILITIES</span>
          <h2 className="main-title text-5xl font-black mb-12 tracking-tight">Advanced Intelligence <br/>for Complex Markets</h2>
          
          <div className="features-grid grid-cols-1 gap-8">
            {[
              { icon: Zap, title: "Scenario Testing", desc: "Model high-inflation outcomes and policy shocks instantly." },
              { icon: BarChart3, title: "CPI Forecasting", desc: "Predict precise consumer price index shifts at a granular level." },
              { icon: Globe, title: "Regional Modeling", desc: "Analyze impact across different provinces and socioeconomic groups." },
            ].map((item, idx) => (
              <div key={idx} className="feature-item group p-6 rounded-3xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all">
                <item.icon className="text-black w-8 h-8 group-hover:scale-110 transition-transform flex-shrink-0" />
                <div className="text-content">
                  <h3 className="font-black text-slate-900 text-xl mb-3">{item.title}</h3>
                  <p className="text-slate-600 text-base leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="feature-image-wrapper animate-on-scroll slide-in-right relative">
          <div className="absolute inset-0 bg-black/10 blur-[100px] rounded-full -z-10" />
          <img 
            src={featureImageTwo} 
            alt="Advanced Intelligence Dashboard" 
            className="w-full h-auto object-cover rounded-[40px] shadow-[0_0_50px_rgba(0,100,255,0.1)] border border-white/5"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};


const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div className="footer-col footer-brand">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-black text-white shrink-0">P</div>
            <span className="font-extrabold text-lg tracking-tighter text-slate-900">PolicyLens <span className="text-black">AI</span></span>
          </div>
        </div>
        <p className="footer-desc">AI-powered economic policy intelligence platform built for Pakistan's future.</p>
      </div>

      <div className="footer-col">
        <h4>Product</h4>
        <ul>
          <li><a href="#">Features</a></li>
          <li><a href="#">How It Works</a></li>
          <li><a href="#">Security</a></li>
        </ul>
      </div>

      <div className="footer-col">
        <h4>Solutions</h4>
        <ul>
          <li><a href="#">Government</a></li>
          <li><a href="#">Business</a></li>
          <li><a href="#">Research</a></li>
        </ul>
      </div>

      <div className="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Privacy</a></li>
        </ul>
      </div>
    </div>

    <div className="site-footer__bottom">
      <div className="copyright">© 2026 PolicyLens AI. All rights reserved.</div>
      <div className="footer-legal">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </footer>
);
