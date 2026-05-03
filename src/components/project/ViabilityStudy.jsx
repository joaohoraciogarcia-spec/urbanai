import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, RefreshCw, CheckCircle, AlertTriangle, DollarSign, BarChart2, Clock } from "lucide-react";
import ViabilityInputPanel from "./ViabilityInputPanel";
import ViabilityCharts from "./ViabilityCharts";
import ViabilityScenarios from "./ViabilityScenarios";
import ViabilityDashboard from "./ViabilityDashboard";

const stdLabels = { economico: "Econômico", medio: "Médio", medio_alto: "Médio-Alto", alto_padrao: "Alto Padrão", luxo: "Luxo" };
const pricePerM2 = { economico: 4000, medio: 6000, medio_alto: 9000, alto_padrao: 14000, luxo: 22000 };

const DEFAULT_PARAMS = {
  land_cost_mode: "value",
  land_cost_total: "",
  land_cost_pct_vgv: 15,
  price_per_m2: "",
  infra_cost_per_m2: 180,
  approval_cost_pct: 3,
  sales_commission_pct: 5,
  contingency_pct: 8,
  financing_rate_pct: 12,
  target_net_margin_pct: 20,
  road_pct: 20,
  app_pct: 10,
  leisure_pct: 10,
  institutional_pct: 5,
};

function KpiCard({ label, value, color, KpiIcon }) {
  return (
    <div className="p-4 bg-card border border-border rounded-xl flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {KpiIcon && (
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${color.bg}`}>
            <KpiIcon className={`h-4 w-4 ${color.icon}`} />
          </div>
        )}
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
      </div>
      <p className={`text-xl font-bold ${color.text}`}>{value}</p>
    </div>
  );
}

export default function ViabilityStudy({ project }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(project.viability_study || null);
  const savedParams = project.viability_params;
  const hasValidParams = savedParams && Object.keys(savedParams).length > 0;
  const [params, setParams] = useState(hasValidParams ? { ...DEFAULT_PARAMS, ...savedParams } : DEFAULT_PARAMS);

  const generate = async () => {
    setLoading(true);

    const totalArea = project.total_area || 0;
    const nonSellablePct = ((params.road_pct || 20) + (params.app_pct || 10) + (params.leisure_pct || 10) + (params.institutional_pct || 5)) / 100;
    const sellableArea = totalArea * (1 - nonSellablePct);
    const lotSize = project.lot_size || 300;
    const calculatedLots = lotSize > 0 ? Math.floor(sellableArea / lotSize) : 0;

    const std = project.product_standard || "medio";
    const priceFromParams = parseFloat(params.price_per_m2) || 0;
    const price = priceFromParams > 0 ? priceFromParams : (pricePerM2[std] || 6000);
    const vgvEstimate = sellableArea * price;

    // Land cost: respeita o modo (valor absoluto ou % do VGV)
    const landCost = params.land_cost_mode === "pct_vgv"
      ? vgvEstimate * ((params.land_cost_pct_vgv || 15) / 100)
      : parseFloat(params.land_cost_total) || 0;

    const infraCost = sellableArea * (params.infra_cost_per_m2 || 180);
    const baseCost = infraCost + landCost;
    const approvalCost = baseCost * ((params.approval_cost_pct || 3) / 100);
    const contingencyCost = baseCost * ((params.contingency_pct || 8) / 100);
    const commissionCost = vgvEstimate * ((params.sales_commission_pct || 5) / 100);
    const totalCost = baseCost + approvalCost + contingencyCost + commissionCost;

    const landCostLabel = params.land_cost_mode === "pct_vgv"
      ? `${params.land_cost_pct_vgv}% do VGV = R$ ${landCost.toLocaleString()}`
      : landCost > 0 ? `R$ ${landCost.toLocaleString()}` : "não informado (use estimativa de mercado)";

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em viabilidade imobiliária brasileiro. Com base nos dados e nos parâmetros financeiros informados, gere um estudo de viabilidade completo e realista.

DADOS DO PROJETO:
- Nome: ${project.name}
- Localização: ${project.location || "não informada"}
- Área total: ${totalArea.toLocaleString()} m² (${(totalArea / 10000).toFixed(2)} ha)
- Conceito: ${project.concept_description || "não informado"}
- Público-alvo: ${project.target_audience || "não informado"}
- Tipo de empreendimento: ${project.enterprise_type || "não informado"}
- Padrão do produto: ${stdLabels[std] || std}
- Estilo arquitetônico: ${project.design_style || "não informado"}
- Distribuição de uso do solo:
  * Sistema Viário: ${params.road_pct}% = ${(totalArea * params.road_pct / 100).toLocaleString()} m²
  * APP / Preservação: ${params.app_pct}% = ${(totalArea * params.app_pct / 100).toLocaleString()} m²
  * Lazer / Equipamentos: ${params.leisure_pct}% = ${(totalArea * params.leisure_pct / 100).toLocaleString()} m²
  * Área Institucional: ${params.institutional_pct}% = ${(totalArea * params.institutional_pct / 100).toLocaleString()} m²
  * ÁREA VENDÁVEL: ${(100 - nonSellablePct * 100).toFixed(0)}% = ${sellableArea.toLocaleString()} m²
- Lote médio: ${lotSize} m² | Lotes calculados: ${calculatedLots}
- Itens de lazer: ${(project.leisure_items || []).join(", ") || "não informados"}

PARÂMETROS FINANCEIROS:
- Custo de aquisição do terreno: ${landCostLabel}
- Custo de infraestrutura: R$ ${(params.infra_cost_per_m2 || 180).toLocaleString()}/m² vendável
- Aprovações e legalizações: ${params.approval_cost_pct}% sobre custo base
- Comissão de vendas: ${params.sales_commission_pct}% do VGV
- Taxa de financiamento: ${params.financing_rate_pct}% a.a.
- Contingência: ${params.contingency_pct}%
- Meta de margem líquida: ${params.target_net_margin_pct}%

PRÉ-CÁLCULO (use como referência):
- VGV estimado: ${calculatedLots} lotes × ${lotSize}m² × R$ ${price.toLocaleString()}/m² = R$ ${vgvEstimate.toLocaleString()}
- Custo total estimado: R$ ${totalCost.toLocaleString()}
- Lucro estimado (VGV - Custo): R$ ${(vgvEstimate - totalCost).toLocaleString()}
- Margem estimada: ${vgvEstimate > 0 ? (((vgvEstimate - totalCost) / vgvEstimate) * 100).toFixed(1) : 0}%

Gere a análise considerando estes números reais. Valide o número de lotes e justifique. Inclua um texto de oportunidade destacando os pontos mais favoráveis deste empreendimento.

IMPORTANTE: gere também:
1. annual_cashflow: fluxo de caixa anual para TODOS os anos do projeto (tipicamente 3-6 anos). Cada item deve ter: period (ex: "Ano 1"), receita, custo, lucro, acumulado (saldo acumulado, pode ser negativo nos primeiros anos).
2. scenarios: 3 cenários com label ("Conservador", "Ideal", "Agressivo"), vgv, totalCost, lots, net_margin_pct, payback_months.
3. receivables: simulação de recebíveis com total_months, ideal_monthly, avg_monthly, developer_pct (% do incorporador), e timeline_labels (array de 3 a 5 pontos: [{label: "Início", value: "Mês 1"}, {label: "Intermediário", value: "Mês X"}, {label: "Final", value: "Mês N"}]).
4. stages: 2 etapas do empreendimento. Cada uma com: name ("Etapa 1", "Etapa 2"), lots, vgv, avg_price (preço médio/lote), margin_pct, duration_label ("25 meses"), start_pct (posição inicial na barra, 0-60), duration_pct (largura na barra, 30-50).`,
      response_json_schema: {
        type: "object",
        properties: {
          vgv: { type: "number" },
          total_cost: { type: "number" },
          gross_margin_pct: { type: "number" },
          net_margin_pct: { type: "number" },
          roi_pct: { type: "number" },
          payback_months: { type: "number" },
          validated_lot_count: { type: "number", description: "Número de lotes validado/ajustado pela IA" },
          lot_count_justification: { type: "string", description: "Breve justificativa do número de lotes" },
          executive_summary: { type: "string" },
          cost_breakdown: {
            type: "array",
            items: { type: "object", properties: { label: { type: "string" }, value_brl: { type: "number" }, pct: { type: "number" } } }
          },
          revenue_phases: {
            type: "array",
            items: { type: "object", properties: { phase: { type: "string" }, description: { type: "string" }, pct_of_vgv: { type: "number" } } }
          },
          risks: { type: "array", items: { type: "string" } },
          opportunities: { type: "array", items: { type: "string" } },
          opportunity_summary: { type: "string", description: "Texto narrativo de 2-3 parágrafos destacando as principais oportunidades e pontos favoráveis do empreendimento" },
          recommendation: { type: "string" },
          annual_cashflow: {
            type: "array",
            items: { type: "object", properties: { period: { type: "string" }, receita: { type: "number" }, custo: { type: "number" }, lucro: { type: "number" }, acumulado: { type: "number" } } }
          },
          scenarios: {
            type: "array",
            items: { type: "object", properties: { label: { type: "string" }, vgv: { type: "number" }, totalCost: { type: "number" }, lots: { type: "number" }, net_margin_pct: { type: "number" }, payback_months: { type: "number" } } }
          },
          receivables: {
            type: "object",
            properties: {
              total_months: { type: "number" },
              ideal_monthly: { type: "number" },
              avg_monthly: { type: "number" },
              developer_pct: { type: "number" },
              timeline_labels: { type: "array", items: { type: "object", properties: { label: { type: "string" }, value: { type: "string" } } } }
            }
          },
          stages: {
            type: "array",
            items: { type: "object", properties: { name: { type: "string" }, lots: { type: "number" }, vgv: { type: "number" }, avg_price: { type: "number" }, margin_pct: { type: "number" }, duration_label: { type: "string" }, start_pct: { type: "number" }, duration_pct: { type: "number" } } }
          },
        },
      },
      model: "claude_sonnet_4_6",
    });

    setResult(res);
    await base44.entities.Project.update(project.id, {
      viability_study: res,
      viability_params: params,
      lot_count: res.validated_lot_count || calculatedLots,
    });
    setLoading(false);
  };

  const fmt = (v) => v ? `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "-";
  const fmtPct = (v) => v != null ? `${Number(v).toFixed(1)}%` : "-";

  const marginColor = (pct) => {
    if (!pct) return { text: "text-muted-foreground", bg: "bg-muted", icon: "text-muted-foreground" };
    if (pct >= 20) return { text: "text-green-600", bg: "bg-green-100", icon: "text-green-600" };
    if (pct >= 10) return { text: "text-yellow-600", bg: "bg-yellow-100", icon: "text-yellow-600" };
    return { text: "text-red-600", bg: "bg-red-100", icon: "text-red-600" };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-display font-semibold">Estudo de Viabilidade Financeira</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Configure os parâmetros abaixo e gere o estudo com IA.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={generate} disabled={loading} variant={result ? "outline" : "default"} size="sm" className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : result ? <RefreshCw className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            {loading ? "Analisando..." : result ? "Reanalisar" : "Gerar Viabilidade"}
          </Button>
        </div>
      </div>

      {/* Input Panel */}
      <ViabilityInputPanel project={project} params={params} onChange={setParams} />

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Calculando viabilidade financeira com IA...</p>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-xl">
          <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Configure os parâmetros acima e clique em "Gerar Viabilidade".</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-8">
          {/* Lot count validation */}
          {result.validated_lot_count && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                {result.validated_lot_count}
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-700">Lotes validados pela IA</p>
                <p className="text-sm text-blue-800 mt-0.5">{result.lot_count_justification}</p>
              </div>
            </div>
          )}

          {result.executive_summary && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-sm font-semibold text-primary mb-1">Resumo Executivo</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{result.executive_summary}</p>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <KpiCard label="VGV Estimado" value={fmt(result.vgv)} KpiIcon={DollarSign} color={{ text: "text-green-600", bg: "bg-green-100", icon: "text-green-600" }} />
            <KpiCard label="Custo Total" value={fmt(result.total_cost)} KpiIcon={BarChart2} color={{ text: "text-red-500", bg: "bg-red-100", icon: "text-red-500" }} />
            <KpiCard label="Margem Bruta" value={fmtPct(result.gross_margin_pct)} KpiIcon={TrendingUp} color={marginColor(result.gross_margin_pct)} />
            <KpiCard label="Margem Líquida" value={fmtPct(result.net_margin_pct)} KpiIcon={TrendingUp} color={marginColor(result.net_margin_pct)} />
            <KpiCard label="ROI" value={fmtPct(result.roi_pct)} KpiIcon={TrendingUp} color={marginColor(result.roi_pct)} />
          </div>

          {result.payback_months && (
            <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/30 rounded-xl">
              <Clock className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-sm font-semibold">Prazo de Retorno Estimado</p>
                <p className="text-sm text-muted-foreground">{result.payback_months} meses · {(result.payback_months / 12).toFixed(1)} anos</p>
              </div>
            </div>
          )}

          {/* Cost Breakdown + Revenue Phases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.cost_breakdown?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <h4 className="text-sm font-semibold">💰 Estrutura de Custos</h4>
                <div className="space-y-2">
                  {result.cost_breakdown.map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground/70">{c.label}</span>
                        <span className="font-medium">R$ {Number(c.value_brl || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} <span className="text-muted-foreground">({(c.pct || 0).toFixed(0)}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${Math.min(c.pct || 0, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.revenue_phases?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <h4 className="text-sm font-semibold">📈 Fases de Receita</h4>
                <div className="space-y-3">
                  {result.revenue_phases.map((phase, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{phase.phase}</p>
                          <p className="text-sm font-bold text-primary">{(phase.pct_of_vgv || 0).toFixed(0)}% do VGV</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Risks & Opportunities */}
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

          {result.opportunity_summary && (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌟</span>
                <p className="text-sm font-semibold text-amber-800">Análise de Oportunidade</p>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">{result.opportunity_summary}</p>
            </div>
          )}

          {result.recommendation && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-700">Recomendação</p>
                <p className="text-sm text-green-800 mt-0.5 leading-relaxed">{result.recommendation}</p>
              </div>
            </div>
          )}

          {/* Dashboard Visual — Cenários, Recebíveis, Fluxo Anual, Etapas */}
          <div className="pt-4 border-t border-border">
            <ViabilityDashboard result={result} params={params} project={project} />
          </div>

          {/* Gráficos Interativos */}
          <ViabilityCharts result={result} />

          {/* Comparação de Cenários */}
          <div className="bg-card border border-border rounded-xl p-5">
            <ViabilityScenarios project={project} baseParams={params} />
          </div>

          {/* Destaque Final: Preço Médio do Lote e VGVL */}
          {(() => {
            const lotCount = result.validated_lot_count || project.lot_count || 0;
            const lotSize = project.lot_size || 300;
            const priceM2 = parseFloat(params.price_per_m2) || 0;
            const avgLotPrice = priceM2 > 0 && lotSize > 0 ? priceM2 * lotSize : (result.vgv && lotCount > 0 ? result.vgv / lotCount : 0);
            const vgvl = result.vgv || 0;
            return (
              <div className="rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 text-white shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-4">📊 Resumo Comercial do Empreendimento</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-xs text-white/60 mb-1">Lotes Validados</p>
                    <p className="text-4xl font-bold">{lotCount > 0 ? lotCount : "—"}</p>
                    <p className="text-xs text-white/60 mt-1">unidades de {lotSize.toLocaleString("pt-BR")} m²</p>
                  </div>
                  <div className="text-center border-y sm:border-y-0 sm:border-x border-white/20 py-4 sm:py-0">
                    <p className="text-xs text-white/60 mb-1">Preço Médio por Lote</p>
                    <p className="text-3xl font-bold">
                      {avgLotPrice > 0 ? `R$ ${avgLotPrice.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "—"}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {priceM2 > 0 ? `R$ ${priceM2.toLocaleString("pt-BR")}/m²` : "baseado no VGV/lotes"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-white/60 mb-1">VGV Total (VGVL)</p>
                    <p className="text-3xl font-bold">
                      {vgvl > 0 ? `R$ ${vgvl.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "—"}
                    </p>
                    <p className="text-xs text-white/60 mt-1">Valor Geral de Vendas dos Lotes</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}