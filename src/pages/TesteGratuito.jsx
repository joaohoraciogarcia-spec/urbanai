import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

const roles = [
  "Incorporador / Investidor",
  "Arquiteto / Urbanista",
  "Engenheiro Civil",
  "Corretor de Imóveis",
  "Construtor / Empreiteiro",
  "Consultor Imobiliário",
  "Outro",
];

export default function TesteGratuito() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", company: "", role: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) {
      setError("Preencha nome, email e área de atuação.");
      return;
    }
    setError("");
    setLoading(true);

    // Check if email already used trial
    const existing = await base44.entities.Lead.filter({ email: form.email });
    if (existing.length > 0 && existing[0].status === "trial_used") {
      setError("Este email já utilizou o teste gratuito. Adquira um plano para continuar.");
      setLoading(false);
      return;
    }

    if (existing.length > 0) {
      // Already registered, just redirect to login
      base44.auth.redirectToLogin("/");
      return;
    }

    // Save lead
    await base44.entities.Lead.create({ ...form, status: "trial_pending" });

    setSuccess(true);
    setLoading(false);

    // Redirect to login/register after 2s
    setTimeout(() => {
      base44.auth.redirectToLogin("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0a1628] to-slate-900 flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <span className="font-bold text-white tracking-tight">UrbanAI Intel</span>
        </div>
        <button
          onClick={() => navigate("/landing")}
          className="text-slate-400 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {success ? (
            <div className="text-center">
              <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Cadastro realizado!</h2>
              <p className="text-slate-400">Redirecionando para o sistema...</p>
              <div className="mt-4 flex justify-center">
                <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/15 border border-blue-400/25 rounded-full text-blue-300 text-xs font-semibold mb-4 uppercase tracking-widest">
                  <Zap className="h-3 w-3 text-blue-400" /> Teste Gratuito
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Crie sua conta e comece agora</h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Preencha os dados abaixo para liberar sua primeira simulação de masterplan com IA — <span className="text-white font-semibold">100% gratuito</span>.
                </p>
              </div>

              {/* Benefit pill */}
              <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">O que você ganha:</p>
                  <ul className="text-xs text-slate-400 mt-1 space-y-0.5">
                    <li>• 1 masterplan completo com IA</li>
                    <li>• Viabilidade financeira (VGV, ROI, margem)</li>
                    <li>• Análise de mercado da região</li>
                    <li>• Relatório PDF para download</li>
                  </ul>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nome completo *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Empresa / Escritório</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Nome da empresa (opcional)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Área de atuação *</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors appearance-none"
                    required
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Selecione sua área</option>
                    {roles.map((r) => (
                      <option key={r} value={r} className="bg-slate-900 text-white">{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Telefone / WhatsApp</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-colors"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl text-sm gap-2 shadow-xl shadow-blue-500/20"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                  {loading ? "Criando sua conta..." : "Começar minha simulação gratuita"}
                </Button>

                <p className="text-center text-xs text-slate-500 leading-relaxed">
                  Após o teste gratuito, você precisará adquirir um plano para continuar usando a plataforma.
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}