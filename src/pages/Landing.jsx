import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Layers, TrendingUp, BarChart2, Zap, CheckCircle, ArrowRight, Star, Building2, TreePine, Users, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    icon: "🌱",
    description: "Ideal para testar e criar seu primeiro masterplan",
    price: "29,90",
    unit: "/ masterplan",
    credits: "1 Masterplan",
    features: ["1 geração de masterplan com IA", "Viabilidade financeira", "Análise de mercado", "Relatório PDF"],
    color: "from-slate-700 to-slate-800",
    badge: null,
    cta: "Começar agora",
    highlight: false,
  },
  {
    name: "Profissional",
    icon: "🚀",
    description: "Para corretores e construtores ativos",
    price: "59,90",
    unit: "/ 5 masterplans",
    credits: "5 Masterplans",
    features: ["5 gerações de masterplan com IA", "Viabilidade financeira completa", "Análise de mercado com IA", "Relatório PDF completo", "Templates personalizados"],
    color: "from-blue-600 to-blue-700",
    badge: "Mais popular",
    cta: "Escolher Profissional",
    highlight: true,
  },
  {
    name: "Avançado",
    icon: "🏆",
    description: "Escale sua produção de projetos",
    price: "99,90",
    unit: "/ 10 masterplans",
    credits: "10 Masterplans",
    features: ["10 gerações de masterplan com IA", "Todos os recursos anteriores", "Estudo de viabilidade avançado", "Comparação de cenários", "Biblioteca de projetos"],
    color: "from-violet-600 to-violet-700",
    badge: null,
    cta: "Escolher Avançado",
    highlight: false,
  },
  {
    name: "Ilimitado",
    icon: "♾️",
    description: "Para escritórios e incorporadoras",
    price: "299,90",
    unit: "/ mês",
    credits: "Ilimitado",
    features: ["Projetos ilimitados", "Todos os recursos", "Prioridade na geração", "Suporte dedicado", "Multi-usuário", "API de integração"],
    color: "from-amber-500 to-orange-600",
    badge: "Melhor custo-benefício",
    cta: "Assinar Ilimitado",
    highlight: false,
  },
];

const steps = [
  { icon: MapPin, label: "Informe o terreno", desc: "Localização, área e características físicas", color: "bg-blue-100 text-blue-600", num: "01" },
  { icon: Building2, label: "Defina o empreendimento", desc: "Tipo, padrão, público e conceito", color: "bg-violet-100 text-violet-600", num: "02" },
  { icon: Zap, label: "IA gera o masterplan", desc: "Proposta urbanística completa em segundos", color: "bg-amber-100 text-amber-600", num: "03" },
  { icon: TrendingUp, label: "Análise e viabilidade", desc: "VGV, margem, ROI e mercado real", color: "bg-green-100 text-green-600", num: "04" },
];

const testimonials = [
  { name: "Ricardo Almeida", role: "Incorporador", city: "SP", text: "Em 3 minutos tive um masterplan e uma viabilidade financeira que levaria dias para montar. Revolucionou meu processo.", stars: 5, avatar: "RA" },
  { name: "Fernanda Costa", role: "Arquiteta Urbanista", city: "MG", text: "A qualidade do masterplan gerado me surpreendeu. Uso como base para os projetos finais com meus clientes.", stars: 5, avatar: "FC" },
  { name: "Thiago Menezes", role: "Corretor", city: "GO", text: "Agora consigo mostrar viabilidade para o proprietário do terreno na primeira reunião. Fechei 3 parcerias em um mês.", stars: 5, avatar: "TM" },
];

const features = [
  { icon: Layers, label: "Masterplan com IA", desc: "Proposta urbanística completa e ilustrada gerada em segundos", color: "text-blue-600 bg-blue-50", border: "hover:border-blue-200" },
  { icon: TrendingUp, label: "Viabilidade Financeira", desc: "VGV, ROI, margem líquida e payback calculados automaticamente", color: "text-green-600 bg-green-50", border: "hover:border-green-200" },
  { icon: BarChart2, label: "Análise de Mercado Real", desc: "Pesquisa em ZAP, VivaReal, OLX com dados reais da região", color: "text-violet-600 bg-violet-50", border: "hover:border-violet-200" },
  { icon: TreePine, label: "Uso do Solo Otimizado", desc: "Distribuição automática de áreas: viária, APP, lazer e vendável", color: "text-amber-600 bg-amber-50", border: "hover:border-amber-200" },
  { icon: Users, label: "Perfil do Comprador", desc: "Análise do público-alvo e posicionamento de mercado", color: "text-rose-600 bg-rose-50", border: "hover:border-rose-200" },
  { icon: CheckCircle, label: "Relatório Profissional", desc: "PDF completo para apresentar a investidores e parceiros", color: "text-cyan-600 bg-cyan-50", border: "hover:border-cyan-200" },
];

const stats = [
  { value: "2.400+", label: "Masterplans gerados" },
  { value: "3 min", label: "Tempo médio de entrega" },
  { value: "R$ 2,1bi", label: "Em VGV analisado" },
  { value: "98%", label: "Taxa de satisfação" },
];

function ProductMockup() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
      <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2 border-b border-slate-700">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <div className="h-3 w-3 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 mx-4 h-5 bg-slate-700 rounded-md text-[10px] text-slate-400 flex items-center px-3 font-mono">
          urbanai.intel.app/projeto/masterplan
        </div>
      </div>
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">U</span>
          </div>
          <span className="text-white text-xs font-semibold">UrbanAI Intel</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 px-2 bg-green-500/20 text-green-400 text-[10px] font-semibold rounded-full flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Gerando...
          </div>
        </div>
      </div>
      <div className="bg-slate-950 p-4 flex gap-3 min-h-[280px]">
        <div className="w-28 shrink-0 space-y-1">
          {["Dashboard", "Projetos", "Análise", "Relatórios"].map((item, i) => (
            <div key={i} className={`px-2 py-1.5 rounded-lg text-[10px] font-medium ${i === 1 ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
              {item}
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-xs font-bold">Residencial Vila Nova</p>
              <p className="text-slate-500 text-[10px]">Campinas, SP · 45.000 m²</p>
            </div>
            <div className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-full">Concluído</div>
          </div>
          <div className="rounded-xl overflow-hidden bg-slate-800 h-36 relative">
            <img
              src="https://media.base44.com/images/public/69d6980f08bdf9896d077343/bb5afac34_generated_image.png"
              alt="Masterplan"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] px-2 py-1 rounded-lg font-semibold">
              🗺️ Masterplan Gerado
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "VGV", value: "R$ 48M" },
              { label: "ROI", value: "31,4%" },
              { label: "Margem", value: "22,8%" },
            ].map((kpi, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-2">
                <p className="text-slate-500 text-[9px]">{kpi.label}</p>
                <p className="text-white text-xs font-bold mt-0.5">{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  const goToApp = () => {
    base44.auth.redirectToLogin("/");
  };

  const goToTrial = () => {
    navigate("/teste-gratuito");
  };

  return (
    <div className="min-h-screen bg-white font-inter overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="text-white font-bold text-base">U</span>
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">UrbanAI Intel</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#como-funciona" className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">Como funciona</a>
          <a href="#funcionalidades" className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">Funcionalidades</a>
          <a href="#planos" className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">Planos</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={goToApp} className="text-sm text-slate-600 hover:text-slate-900 font-medium hidden sm:block transition-colors">
            Entrar
          </button>
          <Button size="sm" onClick={goToTrial} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm shadow-blue-600/30 rounded-lg px-4">
            Começar grátis <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-24 pb-0 overflow-hidden bg-gradient-to-br from-slate-900 via-[#0a1628] to-slate-900">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 pt-12 pb-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/15 border border-blue-400/25 rounded-full text-blue-300 text-xs font-semibold mb-6 uppercase tracking-widest">
                <Zap className="h-3 w-3 fill-blue-400 text-blue-400" /> IA para Arquitetura e Urbanismo
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5 tracking-tight">
                Do terreno ao{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400">
                  Masterplan
                </span>
                <br />em minutos
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Gere propostas urbanísticas completas com IA — viabilidade financeira, análise de mercado e VGV em uma única plataforma inteligente.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10">
                <Button
                  size="lg"
                  onClick={goToTrial}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2 px-7 py-6 text-base font-semibold shadow-2xl shadow-blue-500/30 rounded-xl w-full sm:w-auto"
                >
                  <Zap className="h-5 w-5" />
                  Testar gratuitamente
                </Button>

                <a href="#planos" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap">
                  A partir de R$ 29,90 <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-slate-500 text-sm">
                <div className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400 shrink-0" /> Sem CAD necessário</div>
                <div className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400 shrink-0" /> Resultado em &lt; 3 min</div>
                <div className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400 shrink-0" /> 100% online</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full max-w-xl lg:max-w-none"
            >
              <ProductMockup />
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 mt-16 border-t border-white/5 bg-white/[0.03] backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCREENSHOTS / PRODUTO ─── */}
      <section className="py-20 px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Veja na prática</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Tudo dentro de uma plataforma</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">Do briefing ao relatório final, sem precisar de nenhum software extra.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                src: "https://media.base44.com/images/public/69d6980f08bdf9896d077343/bb5afac34_generated_image.png",
                label: "🗺️ Masterplan com IA",
                desc: "Proposta urbanística gerada automaticamente",
                tag: "Em segundos",
                tagColor: "bg-blue-50 text-blue-600",
                span: "md:col-span-2",
              },
              {
                src: "https://media.base44.com/images/public/69d6980f08bdf9896d077343/9d2f22707_generated_image.png",
                label: "📊 Análise de Mercado",
                desc: "Dados reais: ZAP, VivaReal e OLX",
                tag: "Automático",
                tagColor: "bg-violet-50 text-violet-600",
                span: "md:col-span-1",
              },
              {
                src: "https://media.base44.com/images/public/69d6980f08bdf9896d077343/eb3e5f2bd_generated_image.png",
                label: "💰 Viabilidade Financeira",
                desc: "VGV, margem, ROI e ponto de equilíbrio",
                tag: "Completo",
                tagColor: "bg-green-50 text-green-600",
                span: "md:col-span-3",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${item.span} rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow group`}
              >
                <div className="overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    style={{ maxHeight: i === 2 ? "240px" : "220px" }}
                  />
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${item.tagColor}`}>{item.tag}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section id="como-funciona" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Como funciona</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">4 passos para um masterplan profissional</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">Do terreno ao relatório final em menos de 3 minutos.</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-green-200" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center hover:shadow-md hover:border-slate-200 transition-all"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 px-2.5 bg-white border border-slate-200 rounded-full text-slate-400 text-[10px] font-bold flex items-center shadow-sm">
                    {s.num}
                  </div>
                  <div className={`h-14 w-14 rounded-2xl ${s.color} flex items-center justify-center mx-auto mt-2 mb-4`}>
                    <s.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{s.label}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FUNCIONALIDADES ─── */}
      <section id="funcionalidades" className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Tudo que você precisa</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Uma plataforma completa para urbanistas</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">Todas as ferramentas que incorporadores, arquitetos e corretores precisam — em um só lugar.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`p-6 rounded-2xl bg-white border border-slate-100 ${f.border} hover:shadow-md transition-all cursor-default`}
              >
                <div className={`h-11 w-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{f.label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─── */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">Quem já usa</p>
            <h2 className="text-3xl font-bold text-white tracking-tight">Aprovado por profissionais do mercado</h2>
            <p className="text-slate-400 mt-3">Mais de 2.400 masterplans gerados por incorporadores, arquitetos e corretores.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/8 transition-colors"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} · {t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLANOS ─── */}
      <section id="planos" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Planos e Preços</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Escolha o plano ideal para você</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">Sem assinatura forçada. Pague pelo que usar ou assine o ilimitado e escale sem limites.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl overflow-hidden flex flex-col ${plan.highlight ? "ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.02]" : "border border-slate-100 shadow-sm"}`}
              >
                {plan.badge && (
                  <div className={`absolute top-0 left-0 right-0 py-1.5 text-white text-[10px] font-bold text-center uppercase tracking-widest ${plan.highlight ? "bg-blue-600" : "bg-amber-500"}`}>
                    {plan.badge}
                  </div>
                )}
                <div className={`bg-gradient-to-br ${plan.color} p-5 ${plan.badge ? "pt-9" : ""}`}>
                  <div className="text-2xl mb-2">{plan.icon}</div>
                  <h3 className="text-white font-bold text-lg tracking-tight">{plan.name}</h3>
                  <p className="text-white/60 text-xs mt-1 leading-relaxed">{plan.description}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-3xl font-bold text-white leading-none">R$ {plan.price}</span>
                    <span className="text-white/50 text-xs mb-0.5">{plan.unit}</span>
                  </div>
                  <div className="mt-2.5 inline-block bg-white/15 text-white text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wide">{plan.credits}</div>
                </div>
                <div className="p-5 bg-white flex-1 flex flex-col">
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-5 rounded-xl font-semibold text-sm ${plan.highlight ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20" : ""}`}
                    variant={plan.highlight ? "default" : "outline"}
                    onClick={goToTrial}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Pagamento seguro · Sem contrato de fidelidade · Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-20 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <div className="flex items-center justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-slate-400 text-sm ml-2">+2.400 masterplans gerados</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Transforme terrenos em empreendimentos inteligentes
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Comece agora por <span className="text-white font-semibold">R$ 29,90</span> e gere seu primeiro masterplan hoje.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={goToTrial}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-10 py-6 text-base rounded-xl shadow-2xl shadow-blue-500/30 gap-2"
            >
              <Zap className="h-5 w-5" />
              Testar gratuitamente
            </Button>
            <a href="#planos" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
              Ver todos os planos <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-950 text-slate-600 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-xs">U</span>
            </div>
            <span className="font-semibold text-slate-400 text-sm">UrbanAI Intel</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <a href="#como-funciona" className="hover:text-slate-300 transition-colors">Como funciona</a>
            <a href="#planos" className="hover:text-slate-300 transition-colors">Planos</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Termos de uso</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacidade</a>
          </div>
          <p className="text-xs text-center md:text-right">
            © {new Date().getFullYear()} UrbanAI Intel · Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}