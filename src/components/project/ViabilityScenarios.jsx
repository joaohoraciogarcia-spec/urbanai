import { useState } from "react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Loader2, Plus, Trash2, GitCompare } from "lucide-react";

const pricePerM2 = { economico: 4000, medio: 6000, medio_alto: 9000, alto_padrao: 14000, luxo: 22000 };

function calcScenario(project, params) {
  const totalArea = project.total_area || 0;
  const nonSellablePct = ((params.road_pct || 20) + (params.app_pct || 10) + (params.leisure_pct || 10) + (params.institutional_pct || 5)) / 100;
  const sellableArea = totalArea * (1 - nonSellablePct);
  const lotSize = project.lot_size || 300;
  const lots = lotSize > 0 ? Math.floor(sellableArea / lotSize) : 0;
  const std = project.product_standard || "medio";
  const price = parseFloat(params.price_per_m2) || pricePerM2[std] || 6000;
  const vgv = sellableArea * price;
  const landCost = params.land_cost_mode === "pct_vgv"
    ? vgv * ((params.land_cost_pct_vgv || 15) / 100)
    : parseFloat(params.land_cost_total) || 0;
  const infraCost = sellableArea * (params.infra_cost_per_m2 || 180);
  const baseCost = infraCost + landCost;
  const approvalCost = baseCost * ((params.approval_cost_pct || 3) / 100);
  const contingency = baseCost * ((params.contingency_pct || 8) / 100);
  const commission = vgv * ((params.sales_commission_pct || 5) / 100);
  const totalCost = baseCost + approvalCost + contingency + commission;
  const profit = vgv - totalCost;
  const margin = vgv > 0 ? (profit / vgv) * 100 : 0;
  return { vgv, totalCost, profit, margin, lots, sellableArea };
}

const fmt = (v) => `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
const fmtPct = (v) => `${Number(v).toFixed(1)}%`;

const SCENARIO_LABELS = ["Conservador", "Base", "Otimista"];
const SCENARIO_COLORS = ["text-orange-600 bg-orange-50 border-orange-200", "text-blue-600 bg-blue-50 border-blue-200", "text-green-600 bg-green-50 border-green-200"];

export default function ViabilityScenarios({ project, baseParams }) {
  const [open, setOpen] = useState(false);
  const [scenarios, setScenarios] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const std = project.product_standard || "medio";
    const basePrice = parseFloat(baseParams.price_per_m2) || pricePerM2[std] || 6000;

    const conservative = {
      ...baseParams,
      price_per_m2: (basePrice * 0.85).toFixed(0),
      infra_cost_per_m2: (baseParams.infra_cost_per_m2 || 180) * 1.2,
      contingency_pct: (baseParams.contingency_pct || 8) + 4,
    };
    const optimistic = {
      ...baseParams,
      price_per_m2: (basePrice * 1.15).toFixed(0),
      infra_cost_per_m2: (baseParams.infra_cost_per_m2 || 180) * 0.9,
      contingency_pct: Math.max(2, (baseParams.contingency_pct || 8) - 2),
    };

    const [conservativeAI, optimisticAI] = await Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `Para o empreendimento "${project.name}" (${project.enterprise_type}, ${project.location}), dado cenário CONSERVADOR com preço R$${conservative.price_per_m2}/m², infra R$${conservative.infra_cost_per_m2.toFixed(0)}/m², contingência ${conservative.contingency_pct}%, forneça: payback estimado e 2 riscos principais.`,
        response_json_schema: { type: "object", properties: { payback_months: { type: "number" }, notes: { type: "string" } } }
      }),
      base44.integrations.Core.InvokeLLM({
        prompt: `Para o empreendimento "${project.name}" (${project.enterprise_type}, ${project.location}), dado cenário OTIMISTA com preço R$${optimistic.price_per_m2}/m², infra R$${optimistic.infra_cost_per_m2.toFixed(0)}/m², contingência ${optimistic.contingency_pct}%, forneça: payback estimado e 2 oportunidades principais.`,
        response_json_schema: { type: "object", properties: { payback_months: { type: "number" }, notes: { type: "string" } } }
      }),
    ]);

    setScenarios([
      { ...calcScenario(project, conservative), label: "Conservador", params: conservative, ai: conservativeAI },
      { ...calcScenario(project, baseParams), label: "Base", params: baseParams, ai: { payback_months: null, notes: "Cenário base configurado pelo usuário." } },
      { ...calcScenario(project, optimistic), label: "Otimista", params: optimistic, ai: optimisticAI },
    ]);
    setLoading(false);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold flex items-center gap-2"><GitCompare className="h-4 w-4 text-primary" /> Comparação de Cenários</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Conservador, Base e Otimista gerados automaticamente.</p>
        </div>
        <Button size="sm" variant="outline" onClick={generate} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitCompare className="h-4 w-4" />}
          {loading ? "Gerando..." : scenarios ? "Reatualizar" : "Comparar Cenários"}
        </Button>
      </div>

      {scenarios && open && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Indicador</th>
                {scenarios.map((s, i) => (
                  <th key={i} className={`p-3 text-center text-xs font-semibold rounded-t-lg border ${SCENARIO_COLORS[i]}`}>
                    {s.label}
                    <div className="text-[10px] font-normal mt-0.5 opacity-70">R${Number(s.params.price_per_m2).toLocaleString()}/m²</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "VGV", key: "vgv", format: fmt },
                { label: "Custo Total", key: "totalCost", format: fmt },
                { label: "Lucro", key: "profit", format: fmt },
                { label: "Margem", key: "margin", format: fmtPct },
                { label: "Lotes", key: "lots", format: (v) => `${v} lotes` },
              ].map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="p-3 text-xs text-muted-foreground font-medium">{row.label}</td>
                  {scenarios.map((s, si) => (
                    <td key={si} className={`p-3 text-center text-xs font-semibold ${row.key === "margin" ? (s.margin >= 20 ? "text-green-600" : s.margin >= 10 ? "text-yellow-600" : "text-red-600") : row.key === "profit" ? (s.profit >= 0 ? "text-green-600" : "text-red-600") : ""}`}>
                      {row.format(s[row.key])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-3 text-xs text-muted-foreground font-medium">Payback</td>
                {scenarios.map((s, si) => (
                  <td key={si} className="p-3 text-center text-xs text-muted-foreground">
                    {s.ai?.payback_months ? `${s.ai.payback_months} meses` : "-"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-xs text-muted-foreground font-medium align-top">Observações</td>
                {scenarios.map((s, si) => (
                  <td key={si} className="p-3 text-xs text-muted-foreground text-left align-top leading-relaxed">{s.ai?.notes}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}