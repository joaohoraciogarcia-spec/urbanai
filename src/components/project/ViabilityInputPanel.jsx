import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DollarSign, ChevronDown, ChevronUp, Info } from "lucide-react";

const DEFAULT_PARAMS = {
  land_cost_mode: "mixed", // "value", "pct_vgv", "mixed"
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
  condo_area_pct: 10,
  private_area_pct: 68,
  setbacks: "",
};

function Tip({ text }) {
  return (
    <span className="group relative cursor-help ml-1 inline-flex">
      <Info className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="hidden group-hover:block absolute left-5 top-0 z-10 w-52 bg-foreground text-background text-xs rounded-lg p-2 shadow-lg leading-relaxed">
        {text}
      </span>
    </span>
  );
}

function SliderField({ label, tip, value, onChange, min, max, step = 1, suffix = "%" }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm flex items-center">
          {label}{tip && <Tip text={tip} />}
        </Label>
        <span className="text-sm font-semibold text-primary">{value}{suffix}</span>
      </div>
      <Slider
        min={min} max={max} step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
}

export default function ViabilityInputPanel({ project, params, onChange }) {
  const [open, setOpen] = useState(true);

  const p = { ...DEFAULT_PARAMS, ...params };
  const set = (key, val) => onChange({ ...p, [key]: val });

  const totalArea = project.total_area || 0;
  const nonSellablePct = (p.road_pct + p.app_pct + p.leisure_pct + p.institutional_pct) / 100;
  const sellableArea = totalArea * (1 - nonSellablePct);
  const lotSize = project.lot_size || 300;
  const calculatedLots = lotSize > 0 ? Math.floor(sellableArea / lotSize) : 0;

  const pricePerM2 = parseFloat(p.price_per_m2) || 0;
  const vgvPotential = pricePerM2 > 0 ? sellableArea * pricePerM2 : 0;

  // Custo do terreno: misto = aporte + % VGV restante
  let landCost = 0;
  const landCostFixed = parseFloat(p.land_cost_total) || 0;
  if (p.land_cost_mode === "value") {
    landCost = landCostFixed;
  } else if (p.land_cost_mode === "pct_vgv") {
    landCost = vgvPotential * ((p.land_cost_pct_vgv || 0) / 100);
  } else {
    // mixed: aporte fixo + % sobre VGV restante
    const remainingVgv = vgvPotential - landCostFixed;
    const pctPart = remainingVgv > 0 ? remainingVgv * ((p.land_cost_pct_vgv || 0) / 100) : 0;
    landCost = landCostFixed + pctPart;
  }

  const infraCost = sellableArea * (p.infra_cost_per_m2 || 0);
  const baseCost = infraCost + landCost;
  const totalCostEst = baseCost * (1 + (p.approval_cost_pct + p.contingency_pct) / 100);

  const profit = vgvPotential > 0 ? vgvPotential - totalCostEst : 0;
  const marginPct = vgvPotential > 0 ? (profit / vgvPotential) * 100 : 0;

  const fmt = (v) => v ? `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "-";
  const fmtArea = (v) => `${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} m²`;

  // Tipologia label
  const enterprise = project.enterprise_type || "";
  const isVertical = enterprise.includes("vertical") || enterprise.includes("predio");
  const typologyLabel = isVertical
    ? `Apartamento — ${project.lot_size || "—"} m²`
    : `Lote — ${project.lot_size || "—"} m²`;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Parâmetros de Viabilidade</p>
            <p className="text-xs text-muted-foreground">Configure custos e taxas para o estudo financeiro</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-5 pb-6 space-y-8 border-t border-border">

          {/* VGV DESTAQUE */}
          <div className="mt-5 p-5 bg-gradient-to-br from-green-600 to-green-700 rounded-xl text-white shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1 space-y-2">
                <Label className="text-xs text-white/70 font-semibold uppercase tracking-wider">
                  Valor do m² de Venda (R$/m²)
                  <span className="ml-1 inline-flex"><Tip text="Preço de venda por m² praticado na região para o padrão do produto." /></span>
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 800"
                  value={p.price_per_m2}
                  onChange={(e) => set("price_per_m2", e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/40 focus:border-white max-w-xs"
                />
                <p className="text-xs text-white/60">Tipologia: <span className="font-semibold text-white">{typologyLabel}</span></p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-white/60 mb-1">VGV Potencial Estimado</p>
                <p className="text-4xl font-bold tracking-tight">
                  {vgvPotential > 0 ? `R$ ${vgvPotential.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "—"}
                </p>
                {vgvPotential > 0 && (
                  <p className="text-xs text-white/60 mt-1">
                    {fmtArea(sellableArea)} × R$ {pricePerM2.toLocaleString("pt-BR")}/m²
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Resultado rápido */}
          {vgvPotential > 0 && totalCostEst > 0 && (
            <div className={`p-4 rounded-xl border grid grid-cols-2 gap-4 ${profit >= 0 ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">💰 Lucro do Empreendimento</p>
                <p className={`text-xl font-bold ${profit >= 0 ? "text-blue-700" : "text-red-600"}`}>
                  {profit >= 0 ? "" : "-"}R$ {Math.abs(profit).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">VGV − Custo Total</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">📊 Margem de Retorno</p>
                <p className={`text-xl font-bold ${marginPct >= 20 ? "text-blue-700" : marginPct >= 10 ? "text-yellow-600" : "text-red-600"}`}>
                  {marginPct.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">sobre o VGV</p>
              </div>
            </div>
          )}

          {/* Preview dinâmico */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Área Vendável", value: fmtArea(sellableArea) },
              { label: "Lotes Calculados", value: calculatedLots > 0 ? `${calculatedLots} lotes` : "-", highlight: true },
              { label: "Custo de Infra", value: fmt(infraCost) },
              { label: "Custo Total Est.", value: fmt(totalCostEst) },
            ].map((item) => (
              <div key={item.label} className={`p-3 rounded-lg border text-center ${item.highlight ? "bg-primary/5 border-primary/30" : "bg-muted/50 border-border"}`}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`text-sm font-bold mt-0.5 ${item.highlight ? "text-primary" : ""}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Custos + Recuos */}
            <div className="space-y-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">💰 Custos</h4>

              {/* Terreno modo misto */}
              <div className="space-y-3">
                <Label className="text-sm flex items-center">
                  Custo de Aquisição do Terreno
                  <Tip text="Valor absoluto, % do VGV, ou misto (aporte fixo + % sobre o VGV restante)." />
                </Label>
                <div className="flex rounded-lg overflow-hidden border border-border w-fit text-xs font-medium">
                  {[
                    { key: "value", label: "Valor (R$)" },
                    { key: "pct_vgv", label: "% VGV" },
                    { key: "mixed", label: "Misto" },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => set("land_cost_mode", m.key)}
                      className={`px-3 py-1.5 transition-colors ${p.land_cost_mode === m.key ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {(p.land_cost_mode === "value" || p.land_cost_mode === "mixed") && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Aporte Fixo (R$)</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 2.500.000"
                      value={p.land_cost_total}
                      onChange={(e) => set("land_cost_total", e.target.value)}
                    />
                    {landCostFixed > 0 && <p className="text-xs text-muted-foreground">{fmt(landCostFixed)}</p>}
                  </div>
                )}

                {(p.land_cost_mode === "pct_vgv" || p.land_cost_mode === "mixed") && (
                  <div className="space-y-1">
                    {p.land_cost_mode === "mixed" && (
                      <Label className="text-xs text-muted-foreground">% sobre VGV Restante</Label>
                    )}
                    <SliderField
                      label={p.land_cost_mode === "mixed" ? "% VGV (complementar)" : "% do VGV"}
                      tip={p.land_cost_mode === "mixed"
                        ? "Percentual aplicado sobre o VGV já descontado o aporte fixo."
                        : "Percentual do VGV destinado à aquisição. Típico: 10–25%."}
                      value={p.land_cost_pct_vgv}
                      onChange={(v) => set("land_cost_pct_vgv", v)}
                      min={1} max={50}
                    />
                    {vgvPotential > 0 && (
                      <p className="text-xs text-muted-foreground">Custo total do terreno: {fmt(landCost)}</p>
                    )}
                  </div>
                )}
              </div>

              <SliderField
                label="Custo de Infraestrutura (R$/m²)"
                tip="Custo médio de implantação por m² de área vendável."
                value={p.infra_cost_per_m2} onChange={(v) => set("infra_cost_per_m2", v)}
                min={50} max={600} step={10} suffix=" R$/m²"
              />
              <SliderField
                label="Aprovações e Legalizações"
                tip="% sobre custo total para taxas, projetos, aprovações municipais."
                value={p.approval_cost_pct} onChange={(v) => set("approval_cost_pct", v)}
                min={1} max={10}
              />
              <SliderField
                label="Contingência"
                tip="Reserva para imprevistos e variações de custo."
                value={p.contingency_pct} onChange={(v) => set("contingency_pct", v)}
                min={2} max={20}
              />

              {/* Recuos */}
              <div className="space-y-2 pt-2 border-t border-border">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">📐 Recuos Obrigatórios</h4>
                <Label className="text-sm flex items-center">
                  Recuos do Projeto
                  <Tip text="Recuos obrigatórios conforme legislação municipal (frente, fundo, laterais)." />
                </Label>
                <Input
                  type="text"
                  placeholder="Ex: Frente 5m, Fundos 3m, Laterais 1,5m"
                  value={p.setbacks || ""}
                  onChange={(e) => set("setbacks", e.target.value)}
                />
              </div>
            </div>

            {/* Right: Receita + Uso do Solo */}
            <div className="space-y-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">📊 Receita e Parcelamento</h4>

              <SliderField
                label="Comissão de Vendas"
                tip="% do VGV pago às imobiliárias e corretores."
                value={p.sales_commission_pct} onChange={(v) => set("sales_commission_pct", v)}
                min={2} max={10}
              />
              <SliderField
                label="Taxa de Financiamento (a.a.)"
                tip="Taxa de juros anual para capital de giro."
                value={p.financing_rate_pct} onChange={(v) => set("financing_rate_pct", v)}
                min={5} max={25}
              />
              <SliderField
                label="Margem Líquida Alvo"
                tip="Meta de rentabilidade líquida sobre o VGV."
                value={p.target_net_margin_pct} onChange={(v) => set("target_net_margin_pct", v)}
                min={5} max={40}
              />

              <div className="pt-2 border-t border-border space-y-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">🗺️ Uso do Solo (% da Área Total)</h4>
                <SliderField
                  label="Sistema Viário"
                  tip="% da área total destinada a vias e calçadas. Típico: 15-25%."
                  value={p.road_pct} onChange={(v) => set("road_pct", v)}
                  min={10} max={35}
                />
                <SliderField
                  label="APP / Preservação"
                  tip="% para Áreas de Preservação Permanente."
                  value={p.app_pct} onChange={(v) => set("app_pct", v)}
                  min={0} max={40}
                />
                <SliderField
                  label="Lazer e Equipamentos"
                  tip="% para áreas de lazer e áreas comuns."
                  value={p.leisure_pct} onChange={(v) => set("leisure_pct", v)}
                  min={5} max={20}
                />
                <SliderField
                  label="Área Institucional"
                  tip="% para equipamentos públicos, praças, etc."
                  value={p.institutional_pct} onChange={(v) => set("institutional_pct", v)}
                  min={0} max={15}
                />
              </div>

              {/* Condomínio e Área Privativa */}
              <div className="pt-2 border-t border-border space-y-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">🏘️ Áreas Internas do Condomínio</h4>
                <SliderField
                  label="Área de Condomínio Prevista"
                  tip="% da área total destinada a áreas comuns do condomínio (clube, guarita, vias internas, paisagismo)."
                  value={p.condo_area_pct} onChange={(v) => set("condo_area_pct", v)}
                  min={5} max={40}
                />
                {totalArea > 0 && (
                  <p className="text-xs text-muted-foreground -mt-2">
                    = {fmtArea(totalArea * p.condo_area_pct / 100)}
                  </p>
                )}
                <SliderField
                  label="Área Privativa"
                  tip="% da área vendável que corresponde à área privativa. Sugestão: 67–70%."
                  value={p.private_area_pct} onChange={(v) => set("private_area_pct", v)}
                  min={50} max={90}
                />
                {sellableArea > 0 && (
                  <p className="text-xs text-muted-foreground -mt-2">
                    = {fmtArea(sellableArea * p.private_area_pct / 100)} de área privativa
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted/50 rounded-xl text-sm">
            <p className="font-semibold mb-2">📐 Resumo do Parcelamento</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div><span className="text-muted-foreground">Área Total:</span> <span className="font-medium">{fmtArea(totalArea)}</span></div>
              <div><span className="text-muted-foreground">Área Vendável ({(100 - nonSellablePct * 100).toFixed(0)}%):</span> <span className="font-medium text-green-600">{fmtArea(sellableArea)}</span></div>
              <div><span className="text-muted-foreground">Lote / Unidade:</span> <span className="font-medium">{fmtArea(lotSize)}</span></div>
              <div><span className="text-muted-foreground">Unidades Estimadas:</span> <span className="font-bold text-primary">{calculatedLots}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}