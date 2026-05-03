import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart2, RefreshCw, TrendingUp, Users, Target, Megaphone, AlertTriangle, CheckCircle, Star, Home } from "lucide-react";

export default function MarketAnalysis({ project }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(project.market_analysis || null);

  const generate = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em análise de mercado imobiliário brasileiro. Gere uma análise estruturada e detalhada para o empreendimento abaixo.

DADOS DO EMPREENDIMENTO:
- Nome: ${project.name}
- Localização: ${project.location || "não informada"}
- Tipo: ${project.enterprise_type || "-"}
- Padrão: ${project.product_standard || "-"}
- Público-alvo: ${project.target_audience || "-"}
- Foco do produto: ${project.product_focus || "-"}
- Conceito: ${project.concept_description || "-"}
- Estilo: ${project.design_style || "-"}
- Área Total: ${project.total_area ? project.total_area.toLocaleString() + " m²" : "-"}

INSTRUÇÕES IMPORTANTES:
1. Para o campo "active_listings", pesquise e liste loteamentos e condomínios REAIS em venda na região, com nome, preço médio do m², e fonte (ZAP Imóveis, VivaReal, OLX, etc.).
2. Para "recent_transactions", relate vendas recentes reais de lotes e imóveis na região.
3. Para "market_pricing", traga dados reais de preço médio do m² para loteamentos e condomínios.
4. Seja específico com a localização informada — pesquise dados reais desta cidade/região.
5. Inclua dados dos principais portais: ZAP Imóveis, VivaReal, OLX Imóveis, Imovelweb.`,
      response_json_schema: {
        type: "object",
        properties: {
          demand_score: { type: "number" },
          competition_score: { type: "number" },
          vso_monthly: { type: "number" },
          opportunity_level: { type: "string", enum: ["baixo", "medio", "alto", "muito_alto"] },
          executive_summary: { type: "string" },
          demand_profile: { type: "string" },
          buyer_profile: { type: "string" },
          market_pricing: {
            type: "object",
            properties: {
              avg_price_m2_lot: { type: "number", description: "Preço médio m² de lotes na região" },
              avg_price_m2_condo: { type: "number", description: "Preço médio m² de condomínios na região" },
              price_range_min: { type: "number" },
              price_range_max: { type: "number" },
              sources: { type: "array", items: { type: "string" } }
            }
          },
          active_listings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: { type: "string" },
                price_m2: { type: "number" },
                total_units: { type: "number" },
                source: { type: "string" },
                highlights: { type: "string" }
              }
            }
          },
          market_trends: { type: "array", items: { type: "string" } },
          competitors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                positioning: { type: "string" },
                price_range: { type: "string" }
              }
            }
          },
          sales_channels: { type: "array", items: { type: "string" } },
          risks: { type: "array", items: { type: "string" } },
          opportunities: { type: "array", items: { type: "string" } },
          positioning_recommendation: { type: "string" },
        },
      },
      add_context_from_internet: true,
      model: "gemini_3_1_pro",
    });
    setResult(res);
    await base44.entities.Project.update(project.id, { market_analysis: res });
    setLoading(false);
  };

  const oppConfig = {
    baixo: { label: "Baixo", cls: "bg-red-100 text-red-700 border-red-200" },
    medio: { label: "Médio", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    alto: { label: "Alto", cls: "bg-green-100 text-green-700 border-green-200" },
    muito_alto: { label: "Muito Alto", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  };

  const ScoreBar = ({ label, value, max = 10, color }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className={`font-bold ${color}`}>{value?.toFixed(1)}/{max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color.replace("text-", "bg-")}`} style={{ width: `${((value || 0) / max) * 100}%` }} />
      </div>
    </div>
  );

  const fmt = (v) => v ? `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "-";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-display font-semibold">Análise de Mercado</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Pesquisa em portais imobiliários, demanda, concorrência e oportunidades reais da região.</p>
        </div>
        <Button onClick={generate} disabled={loading} variant={result ? "outline" : "default"} size="sm" className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : result ? <RefreshCw className="h-4 w-4" /> : <BarChart2 className="h-4 w-4" />}
          {loading ? "Pesquisando..." : result ? "Reanalisar" : "Analisar Mercado"}
        </Button>
      </div>

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Pesquisando dados reais em portais imobiliários...</p>
          <p className="text-xs text-muted-foreground mt-1 opacity-70">ZAP Imóveis · VivaReal · OLX · Imovelweb</p>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-16 text-muted-foreground">
          <BarChart2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">Gere uma análise com dados reais de loteamentos e condomínios da região.</p>
          <p className="text-xs mt-1 opacity-70">Pesquisa em ZAP Imóveis, VivaReal, OLX e buscadores.</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-8">
          {/* Resumo Executivo */}
          {result.executive_summary && (
            <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-sm font-semibold text-primary mb-2">Resumo Executivo</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{result.executive_summary}</p>
            </div>
          )}

          <div className="border-t border-border" />

          {/* Scores + VSO + Oportunidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 sm:col-span-2 space-y-4">
              <h4 className="text-sm font-semibold">📊 Indicadores de Mercado</h4>
              <ScoreBar label="Score de Demanda" value={result.demand_score} color="text-green-600" />
              <ScoreBar label="Nível de Concorrência" value={result.competition_score} color="text-orange-500" />
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center flex flex-col items-center justify-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <p className="text-xs text-muted-foreground">VSO Estimado</p>
              <p className="text-2xl font-bold text-primary">{result.vso_monthly?.toFixed(1)}<span className="text-sm font-normal text-muted-foreground">%/mês</span></p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center flex flex-col items-center justify-center gap-2">
              <Star className="h-6 w-6 text-accent" />
              <p className="text-xs text-muted-foreground">Nível de Oportunidade</p>
              {result.opportunity_level && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${oppConfig[result.opportunity_level]?.cls}`}>
                  {oppConfig[result.opportunity_level]?.label}
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Preços de Mercado */}
          {result.market_pricing && (
            <div>
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" /> Preços Praticados na Região
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {result.market_pricing.avg_price_m2_lot > 0 && (
                  <div className="p-3 bg-muted/50 border border-border rounded-xl text-center">
                    <p className="text-xs text-muted-foreground">m² Lotes</p>
                    <p className="text-lg font-bold text-primary mt-1">{fmt(result.market_pricing.avg_price_m2_lot)}</p>
                  </div>
                )}
                {result.market_pricing.avg_price_m2_condo > 0 && (
                  <div className="p-3 bg-muted/50 border border-border rounded-xl text-center">
                    <p className="text-xs text-muted-foreground">m² Condomínios</p>
                    <p className="text-lg font-bold text-primary mt-1">{fmt(result.market_pricing.avg_price_m2_condo)}</p>
                  </div>
                )}
                {result.market_pricing.price_range_min > 0 && (
                  <div className="p-3 bg-muted/50 border border-border rounded-xl text-center">
                    <p className="text-xs text-muted-foreground">Ticket Mínimo</p>
                    <p className="text-lg font-bold text-green-600 mt-1">{fmt(result.market_pricing.price_range_min)}</p>
                  </div>
                )}
                {result.market_pricing.price_range_max > 0 && (
                  <div className="p-3 bg-muted/50 border border-border rounded-xl text-center">
                    <p className="text-xs text-muted-foreground">Ticket Máximo</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">{fmt(result.market_pricing.price_range_max)}</p>
                  </div>
                )}
              </div>
              {result.market_pricing.sources?.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">Fontes: {result.market_pricing.sources.join(" · ")}</p>
              )}
            </div>
          )}

          {/* Anúncios Ativos / Concorrência Real */}
          {result.active_listings?.length > 0 && (
            <>
              <div className="border-t border-border" />
              <div>
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  🏘️ Loteamentos e Condomínios em Venda na Região
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.active_listings.map((l, i) => (
                    <div key={i} className="p-4 bg-card border border-border rounded-xl space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-tight">{l.name}</p>
                        {l.type && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">{l.type}</span>}
                      </div>
                      {l.price_m2 > 0 && <p className="text-sm font-bold text-primary">{fmt(l.price_m2)}/m²</p>}
                      {l.total_units > 0 && <p className="text-xs text-muted-foreground">{l.total_units} unidades</p>}
                      {l.highlights && <p className="text-xs text-foreground/70 leading-relaxed">{l.highlights}</p>}
                      {l.source && <p className="text-[10px] text-muted-foreground">📌 {l.source}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="border-t border-border" />

          {/* Perfil de Demanda + Comprador */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.demand_profile && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /><h4 className="text-sm font-semibold">Perfil de Demanda</h4></div>
                <p className="text-sm text-foreground/80 leading-relaxed">{result.demand_profile}</p>
              </div>
            )}
            {result.buyer_profile && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><h4 className="text-sm font-semibold">Perfil do Comprador</h4></div>
                <p className="text-sm text-foreground/80 leading-relaxed">{result.buyer_profile}</p>
              </div>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Tendências + Canais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.market_trends?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /><h4 className="text-sm font-semibold">Tendências do Mercado</h4></div>
                <ul className="space-y-2">
                  {result.market_trends.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.sales_channels?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2"><Megaphone className="h-4 w-4 text-primary" /><h4 className="text-sm font-semibold">Canais de Venda Recomendados</h4></div>
                <div className="flex flex-wrap gap-2">
                  {result.sales_channels.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Concorrentes */}
          {result.competitors?.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-semibold">🏢 Concorrentes Típicos da Região</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.competitors.map((c, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{c.positioning}</p>
                    {c.price_range && <p className="text-xs font-medium text-primary mt-1">{c.price_range}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border" />

          {/* Riscos e Oportunidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.risks?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-500" /><h4 className="text-sm font-semibold">Riscos</h4></div>
                <ul className="space-y-2">
                  {result.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-1 h-2 w-2 rounded-full bg-orange-400 shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.opportunities?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><h4 className="text-sm font-semibold">Oportunidades</h4></div>
                <ul className="space-y-2">
                  {result.opportunities.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-1 h-2 w-2 rounded-full bg-green-400 shrink-0" />{o}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Posicionamento */}
          {result.positioning_recommendation && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-700">Posicionamento Recomendado</p>
                <p className="text-sm text-green-800 mt-0.5 leading-relaxed">{result.positioning_recommendation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}