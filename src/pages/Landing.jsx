import { useState, useEffect, useRef } from "react";

const APP_URL = "https://urbanai-glr8-8zop0xt3x-joaohoraciogarcia-7675s-projects.vercel.app/";

const plans = [
  {
    name: "Starter", icon: "🌱",
    description: "Ideal para criar seu primeiro masterplan",
    price: "29,90", unit: "/ masterplan", credits: "1 Masterplan",
    features: ["1 geração de masterplan com IA", "Viabilidade financeira", "Análise de mercado", "Relatório PDF"],
    gradient: "linear-gradient(135deg, #374151, #1f2937)",
    highlight: false, badge: null, cta: "Começar agora",
  },
  {
    name: "Profissional", icon: "🚀",
    description: "Para corretores e construtores ativos",
    price: "59,90", unit: "/ 5 masterplans", credits: "5 Masterplans",
    features: ["5 gerações de masterplan com IA", "Viabilidade financeira completa", "Análise de mercado com IA", "Relatório PDF completo", "Templates personalizados"],
    gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    highlight: true, badge: "Mais popular", cta: "Escolher Profissional",
  },
  {
    name: "Avançado", icon: "🏆",
    description: "Escale sua produção de projetos",
    price: "199,90", unit: "/ 10 masterplans", credits: "10 Masterplans",
    features: ["10 gerações de masterplan com IA", "Todos os recursos anteriores", "Estudo de viabilidade avançado", "Comparação de cenários", "Biblioteca de projetos"],
    gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    highlight: false, badge: null, cta: "Escolher Avançado",
  },
  {
    name: "Ilimitado", icon: "♾️",
    description: "Para escritórios e incorporadoras",
    price: "299,90", unit: "/ mês", credits: "Ilimitado",
    features: ["Projetos ilimitados", "Todos os recursos", "Prioridade na geração", "Suporte dedicado", "Multi-usuário", "API de integração"],
    gradient: "linear-gradient(135deg, #f59e0b, #ea580c)",
    highlight: false, badge: "Melhor custo-benefício", cta: "Assinar Ilimitado",
  },
];

const steps = [
  { icon: "📍", label: "Informe o terreno", desc: "Localização, área e características físicas", bg: "#dbeafe", color: "#2563eb" },
  { icon: "🏢", label: "Defina o empreendimento", desc: "Tipo, padrão, público e conceito", bg: "#ede9fe", color: "#7c3aed" },
  { icon: "⚡", label: "IA gera o masterplan", desc: "Proposta urbanística completa em segundos", bg: "#fef3c7", color: "#d97706" },
  { icon: "📈", label: "Análise e viabilidade", desc: "VGV, margem, ROI e mercado real", bg: "#dcfce7", color: "#16a34a" },
];

const features = [
  { icon: "🗺️", label: "Masterplan com IA", desc: "Proposta urbanística completa e ilustrada gerada em segundos", bg: "#eff6ff", color: "#2563eb" },
  { icon: "📊", label: "Viabilidade Financeira", desc: "VGV, ROI, margem líquida e payback calculados automaticamente", bg: "#f0fdf4", color: "#16a34a" },
  { icon: "📉", label: "Análise de Mercado Real", desc: "Pesquisa em ZAP, VivaReal, OLX com dados reais da região", bg: "#f5f3ff", color: "#7c3aed" },
  { icon: "🌿", label: "Uso do Solo Otimizado", desc: "Distribuição automática de áreas: viária, APP, lazer e vendável", bg: "#fffbeb", color: "#d97706" },
  { icon: "👥", label: "Perfil do Comprador", desc: "Análise do público-alvo e posicionamento de mercado", bg: "#fff1f2", color: "#e11d48" },
  { icon: "📄", label: "Relatório Profissional", desc: "PDF completo para apresentar a investidores e parceiros", bg: "#ecfeff", color: "#0891b2" },
];

const testimonials = [
  { name: "Ricardo Almeida", role: "Incorporador", city: "SP", text: "Em 3 minutos tive um masterplan e uma viabilidade financeira que levaria dias para montar. Revolucionou meu processo.", avatar: "RA" },
  { name: "Fernanda Costa", role: "Arquiteta Urbanista", city: "MG", text: "A qualidade do masterplan gerado me surpreendeu. Uso como base para os projetos finais com meus clientes.", avatar: "FC" },
  { name: "Thiago Menezes", role: "Corretor", city: "GO", text: "Agora consigo mostrar viabilidade para o proprietário do terreno na primeira reunião. Fechei 3 parcerias em um mês.", avatar: "TM" },
];

function useOnScreen(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease`,
      ...style
    }}>
      {children}
    </div>
  );
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToApp = () => window.open(APP_URL, "_blank");

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowX: "hidden", color: "#0f172a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        a { text-decoration: none; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid #f1f5f9" : "1px solid transparent",
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>U</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>UrbanAI <span style={{ color: "#2563eb" }}>Intel</span></span>
        </div>

        <div style={{ display: "flex", gap: 32 }}>
          {[["#como-funciona", "Como funciona"], ["#funcionalidades", "Funcionalidades"], ["#planos", "Planos"]].map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: 14, color: "#64748b", fontWeight: 500, transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = "#0f172a"}
              onMouseLeave={e => e.target.style.color = "#64748b"}
            >{label}</a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={goToApp} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#64748b", fontWeight: 500, padding: "8px 12px", fontFamily: "inherit" }}>
            Entrar
          </button>
          <button onClick={goToApp} style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: 10, padding: "9px 20px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.3)", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
            Começar grátis →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", paddingTop: 64, overflow: "hidden", background: "linear-gradient(160deg, #0f172a 0%, #0a1628 55%, #0f172a 100%)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Glows */}
        <div style={{ position: "absolute", top: 0, left: "25%", width: 600, height: 500, background: "rgba(37,99,235,0.15)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 80, right: 0, width: 350, height: 350, background: "rgba(124,58,237,0.1)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 400, height: 400, background: "rgba(8,145,178,0.07)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px 0", position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>

            {/* Copy */}
            <div style={{ flex: 1, minWidth: 300, animation: "fadeUp 0.8s ease both" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 100, marginBottom: 28 }}>
                <span style={{ fontSize: 12, color: "#93c5fd", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>⚡ IA para Arquitetura e Urbanismo</span>
              </div>

              <h1 style={{ fontSize: "clamp(38px, 5vw, 64px)", fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 20 }}>
                Do terreno ao{" "}
                <span style={{ background: "linear-gradient(90deg, #60a5fa, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Masterplan
                </span>
                <br />em minutos
              </h1>

              <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, marginBottom: 36, maxWidth: 520, fontWeight: 300 }}>
                Gere propostas urbanísticas completas com IA — viabilidade financeira, análise de mercado e VGV em uma única plataforma inteligente.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
                <button onClick={goToApp} style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none", borderRadius: 14,
                  padding: "16px 32px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 8px 28px rgba(59,130,246,0.4)", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(59,130,246,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(59,130,246,0.4)"; }}
                >
                  ⚡ Gerar meu primeiro Masterplan
                </button>
                <a href="#planos" style={{ fontSize: 14, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                  A partir de R$ 29,90 →
                </a>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                {["Sem CAD necessário", "Resultado em < 3 min", "100% online"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: "#64748b" }}>
                    <span style={{ color: "#4ade80", fontSize: 16 }}>✓</span> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup */}
            <div style={{ flex: 1, minWidth: 300, maxWidth: 520, animation: "fadeUp 0.8s 0.2s ease both" }}>
              <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", border: "1px solid #1e293b", background: "#0f172a" }}>
                {/* Browser bar */}
                <div style={{ background: "#1e293b", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #334155" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#f87171", "#fbbf24", "#4ade80"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                  </div>
                  <div style={{ flex: 1, margin: "0 10px", height: 22, background: "#334155", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 10px" }}>
                    <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>urbanai.intel.app/projeto/masterplan</span>
                  </div>
                </div>
                {/* App header */}
                <div style={{ background: "#0f172a", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontWeight: 800, fontSize: 11 }}>U</span>
                    </div>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>UrbanAI Intel</span>
                  </div>
                  <div style={{ background: "rgba(74,222,128,0.15)", borderRadius: 100, padding: "4px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
                    <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 600 }}>Gerando...</span>
                  </div>
                </div>
                {/* Content */}
                <div style={{ background: "#020617", padding: 16, display: "flex", gap: 12, minHeight: 260 }}>
                  <div style={{ width: 90, display: "flex", flexDirection: "column", gap: 3 }}>
                    {["Dashboard", "Projetos", "Análise", "Relatórios"].map((item, i) => (
                      <div key={item} style={{ padding: "7px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500, background: i === 1 ? "#2563eb" : "transparent", color: i === 1 ? "#fff" : "#475569" }}>{item}</div>
                    ))}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Residencial Vila Nova</p>
                        <p style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>Campinas, SP · 45.000 m²</p>
                      </div>
                      <div style={{ background: "rgba(37,99,235,0.2)", color: "#60a5fa", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>Concluído</div>
                    </div>
                    {/* Map illustration */}
                    <div style={{ borderRadius: 10, overflow: "hidden", background: "#1e293b", height: 130, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <svg width="190" height="110" viewBox="0 0 190 110" style={{ opacity: 0.75 }}>
                        <rect x="8" y="8" width="174" height="94" rx="4" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,2" />
                        <rect x="18" y="18" width="65" height="38" rx="3" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="0.8" />
                        <rect x="92" y="18" width="80" height="38" rx="3" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="0.8" />
                        <rect x="18" y="64" width="154" height="24" rx="3" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="0.8" />
                        <line x1="88" y1="18" x2="88" y2="90" stroke="#334155" strokeWidth="1" />
                        <line x1="8" y1="60" x2="182" y2="60" stroke="#334155" strokeWidth="1" />
                        <circle cx="50" cy="37" r="8" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1" />
                        <circle cx="132" cy="37" r="6" fill="rgba(34,197,94,0.3)" stroke="#22c55e" strokeWidth="1" />
                      </svg>
                      <div style={{ position: "absolute", bottom: 6, right: 8, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 9, padding: "2px 8px", borderRadius: 5, fontWeight: 600 }}>🗺️ Masterplan Gerado</div>
                    </div>
                    {/* KPIs */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {[{ l: "VGV", v: "R$ 48M" }, { l: "ROI", v: "31,4%" }, { l: "Margem", v: "22,8%" }].map(k => (
                        <div key={k.l} style={{ background: "#1e293b", borderRadius: 8, padding: 8 }}>
                          <p style={{ color: "#475569", fontSize: 9 }}>{k.l}</p>
                          <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, marginTop: 2 }}>{k.v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)", marginTop: 60 }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 32px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {[{ v: "2.400+", l: "Masterplans gerados" }, { v: "3 min", l: "Tempo médio de entrega" }, { v: "R$ 2,1bi", l: "Em VGV analisado" }, { v: "98%", l: "Taxa de satisfação" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{s.v}</p>
                <p style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: "90px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ color: "#2563eb", fontWeight: 600, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Como funciona</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>4 passos para um masterplan profissional</h2>
              <p style={{ color: "#64748b", fontSize: 16 }}>Do terreno ao relatório final em menos de 3 minutos.</p>
            </div>
          </FadeIn>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 38, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, #bfdbfe, #ddd6fe, #bbf7d0)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
              {steps.map((s, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div style={{ position: "relative", background: "#fff", borderRadius: 20, padding: "28px 20px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", textAlign: "center", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 100, padding: "2px 10px", fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>0{i + 1}</div>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "8px auto 16px", fontSize: 26 }}>{s.icon}</div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "#0f172a" }}>{s.label}</h3>
                    <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" style={{ padding: "90px 32px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p style={{ color: "#2563eb", fontWeight: 600, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Tudo que você precisa</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Uma plataforma completa para urbanistas</h2>
              <p style={{ color: "#64748b", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>Todas as ferramentas que incorporadores, arquitetos e corretores precisam — em um só lugar.</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{ padding: 24, borderRadius: 20, background: "#fff", border: `1px solid ${hoveredFeature === i ? "#e2e8f0" : "#f1f5f9"}`, boxShadow: hoveredFeature === i ? "0 8px 32px rgba(0,0,0,0.08)" : "0 1px 6px rgba(0,0,0,0.04)", transition: "all 0.2s", cursor: "default" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 22 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.label}</h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ padding: "90px 32px", background: "linear-gradient(160deg, #0f172a, #1e3a5f, #0f172a)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ color: "#60a5fa", fontWeight: 600, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Quem já usa</p>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>Aprovado por profissionais do mercado</h2>
              <p style={{ color: "#94a3b8", fontSize: 15 }}>Mais de 2.400 masterplans gerados por incorporadores, arquitetos e corretores.</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, backdropFilter: "blur(8px)" }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>{"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#fbbf24", fontSize: 16 }}>{s}</span>)}</div>
                  <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.75, marginBottom: 20 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{t.avatar}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: "#64748b" }}>{t.role} · {t.city}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding: "90px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p style={{ color: "#2563eb", fontWeight: 600, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Planos e Preços</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Escolha o plano ideal para você</h2>
              <p style={{ color: "#64748b", fontSize: 16, maxWidth: 460, margin: "0 auto" }}>Sem assinatura forçada. Pague pelo que usar ou assine o ilimitado e escale sem limites.</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {plans.map((plan, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div
                  onMouseEnter={() => setHoveredPlan(i)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  style={{
                    borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column",
                    border: plan.highlight ? "2px solid #2563eb" : "1px solid #f1f5f9",
                    boxShadow: plan.highlight ? "0 20px 60px rgba(37,99,235,0.18)" : hoveredPlan === i ? "0 12px 40px rgba(0,0,0,0.08)" : "0 2px 12px rgba(0,0,0,0.05)",
                    transform: plan.highlight ? "scale(1.02)" : hoveredPlan === i ? "translateY(-4px)" : "none",
                    transition: "all 0.25s"
                  }}>
                  {plan.badge && (
                    <div style={{ background: plan.highlight ? "#2563eb" : "#f59e0b", color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "center", padding: "7px 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ background: plan.gradient, padding: "28px 24px" }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>{plan.icon}</div>
                    <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 22, letterSpacing: "-0.01em" }}>{plan.name}</h3>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{plan.description}</p>
                    <div style={{ marginTop: 18, display: "flex", alignItems: "flex-end", gap: 4 }}>
                      <span style={{ fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1 }}>R$ {plan.price}</span>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 2 }}>{plan.unit}</span>
                    </div>
                    <div style={{ marginTop: 10, display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 100 }}>{plan.credits}</div>
                  </div>
                  <div style={{ padding: 22, background: "#fff", flex: 1, display: "flex", flexDirection: "column" }}>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, flex: 1, marginBottom: 20 }}>
                      {plan.features.map((f, j) => (
                        <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#475569" }}>
                          <span style={{ color: "#22c55e", fontSize: 15, marginTop: -1, flexShrink: 0 }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={goToApp} style={{
                      width: "100%", padding: "13px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer",
                      border: plan.highlight ? "none" : "1px solid #e2e8f0",
                      background: plan.highlight ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#fff",
                      color: plan.highlight ? "#fff" : "#475569",
                      boxShadow: plan.highlight ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
                      transition: "all 0.2s", fontFamily: "inherit"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <p style={{ color: "#94a3b8", fontSize: 13 }}>✓ Pagamento seguro · Sem contrato de fidelidade · Cancele quando quiser</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "90px 32px", background: "#0f172a", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: "rgba(37,99,235,0.12)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
        <FadeIn>
          <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 24 }}>
              {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#fbbf24", fontSize: 22 }}>{s}</span>)}
              <span style={{ color: "#475569", fontSize: 14, marginLeft: 8, alignSelf: "center" }}>+2.400 masterplans gerados</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 16 }}>
              Transforme terrenos em empreendimentos inteligentes
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, marginBottom: 40 }}>
              Comece agora por <span style={{ color: "#fff", fontWeight: 700 }}>R$ 29,90</span> e gere seu primeiro masterplan hoje.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <button onClick={goToApp} style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none", borderRadius: 14,
                padding: "16px 36px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 8px 28px rgba(59,130,246,0.4)", fontFamily: "inherit", transition: "all 0.2s"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
                ⚡ Gerar meu Masterplan agora
              </button>
              <a href="#planos" style={{ color: "#64748b", fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
                Ver todos os planos →
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#020617", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}>U</span>
          </div>
          <span style={{ fontWeight: 600, color: "#475569", fontSize: 14 }}>UrbanAI Intel</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["#como-funciona", "Como funciona"], ["#planos", "Planos"], ["#", "Termos de uso"], ["#", "Privacidade"]].map(([href, label]) => (
            <a key={label} href={href} style={{ fontSize: 12, color: "#334155" }}>{label}</a>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#1e293b" }}>© {new Date().getFullYear()} UrbanAI Intel</p>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
