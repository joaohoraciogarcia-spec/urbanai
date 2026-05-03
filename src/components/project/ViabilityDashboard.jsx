import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, ReferenceLine
} from "recharts";

const fmtBRL = (v) => v >= 1_000_000
  ? `R$ ${(v / 1_000_000).toFixed(2)}M`
  : v >= 1_000
    ? `R$ ${(v / 1_000).toFixed(0)}K`
    : `R$ ${Number(v).toLocaleString("pt-BR")}`;

const fmtFull = (v) => v != null ? `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "-";
const fmtPct = (v) => v != null ? `${Number(v).toFixed(1)}%` : "-";

// ─────────────────────────────────────────────
// 3 CENÁRIOS DE VGV
// ─────────────────────────────────────────────
function ScenarioCards({ scenarios }) {
  if (!scenarios?.length) return null;
  const colors = [
    { bg: "from-red-500 to-red-600", badge: "bg-red-100 text-red-700", label: "Conservador", accent: "#ef4444" },
    { bg: "from-blue-500 to-blue-600", badge: "bg-blue-100 text-blue-700", label: "Ideal", accent: "#3b82f6" },
    { bg: "from-green-500 to-green-600", badge: "bg-green-100 text-green-700", label: "Agressivo", accent: "#10b981" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-foreground">Potencial do Empreendimento</h4>
        <span className="text-xs text-muted-foreground">Análise comparativa de cenários de mercado</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {scenarios.slice(0, 3).map((sc, i) => {
          const c = colors[i];
          return (
            <div key={i} className={`bg-gradient-to-br ${c.bg} rounded-2xl p-5 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">{sc.label || c.label}</span>
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">VGV</span>
              </div>
              <p className="text-2xl font-bold mb-1">{fmtFull(sc.vgv)}</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 text-xs text-white/80">
                <div>Lotes: <span className="font-semibold text-white">{sc.lots || "-"}</span></div>
                <div>Margem: <span className="font-semibold text-white">{fmtPct(sc.net_margin_pct ?? sc.margin)}</span></div>
                <div>Custo: <span className="font-semibold text-white">{fmtBRL(sc.totalCost ?? sc.total_cost ?? 0)}</span></div>
                <div>Payback: <span className="font-semibold text-white">{sc.payback_months ? `${sc.payback_months}m` : "-"}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Variação de VGV — barra comparativa */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Variação de Valor Geral de Vendas</p>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={scenarios.slice(0, 3).map((sc, i) => ({ name: sc.label || colors[i].label, vgv: sc.vgv || 0 }))} layout="vertical" barSize={20}>
            <XAxis type="number" tickFormatter={fmtBRL} tick={{ fontSize: 9 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
            <Tooltip formatter={(v) => fmtFull(v)} />
            <Bar dataKey="vgv" radius={[0, 6, 6, 0]}>
              {scenarios.slice(0, 3).map((_, i) => (
                <rect key={i} fill={colors[i].accent} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-between mt-3 text-xs">
          {scenarios.slice(0, 3).map((sc, i) => (
            <div key={i} className={`text-center px-3 py-1.5 rounded-lg ${colors[i].badge}`}>
              <p className="font-bold">{fmtFull(sc.vgv)}</p>
              <p className="opacity-70 text-[10px]">{sc.label || colors[i].label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIMULAÇÃO DE RECEBÍVEIS
// ─────────────────────────────────────────────
function ReceivablesSimulation({ receivables, lotCount }) {
  if (!receivables) return null;
  return (
    <div>
      <h4 className="text-sm font-bold text-foreground mb-4">Simulação Completa de Recebíveis</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Prazo Total</p>
          <p className="text-3xl font-bold text-foreground">{receivables.total_months || lotCount || "-"}</p>
          <p className="text-xs text-muted-foreground">{receivables.total_months ? "meses" : "lotes"}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
          <p className="text-xs text-blue-500 mb-1">Recebimento Ideal</p>
          <p className="text-xl font-bold text-blue-700">{fmtFull(receivables.ideal_monthly)}</p>
          <p className="text-xs text-blue-400">/mês</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <p className="text-xs text-green-500 mb-1">Recebimento Médio</p>
          <p className="text-xl font-bold text-green-700">{fmtFull(receivables.avg_monthly)}</p>
          <p className="text-xs text-green-400">/mês</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
          <p className="text-xs text-amber-500 mb-1">Sua Participação</p>
          <p className="text-2xl font-bold text-amber-700">{receivables.developer_pct ? `${receivables.developer_pct}%` : "—"}</p>
        </div>
      </div>

      {/* Linha do Tempo */}
      {receivables.timeline_labels?.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Linha do Tempo dos Recebimentos</p>
          <div className="relative flex items-center gap-0">
            <div className="absolute top-3 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full" />
            <div className="relative flex justify-between w-full">
              {receivables.timeline_labels.map((tl, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`h-6 w-6 rounded-full z-10 flex items-center justify-center text-white text-[10px] font-bold shadow ${i === 0 ? "bg-blue-400" : i === receivables.timeline_labels.length - 1 ? "bg-blue-600" : "bg-blue-500"}`}>
                    {i === 0 ? "▶" : i === receivables.timeline_labels.length - 1 ? "■" : "●"}
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-[10px] text-muted-foreground">{tl.label}</p>
                    <p className="text-xs font-bold text-foreground">{tl.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPARATIVO DE CENÁRIOS — TOTAL DE RECEBÍVEIS
// ─────────────────────────────────────────────
function ScenarioReceivables({ scenarios }) {
  if (!scenarios?.length) return null;
  const colors = [
    { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "bg-red-400", name: "Conservador" },
    { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "bg-blue-500", name: "Ideal" },
    { bg: "bg-green-50 border-green-200", text: "text-green-700", label: "bg-green-500", name: "Agressivo" },
  ];
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Comparativo de Cenários — Total de Recebíveis</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.slice(0, 3).map((sc, i) => {
          const c = colors[i];
          return (
            <div key={i} className={`border rounded-xl p-4 ${c.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`h-2 w-2 rounded-full ${c.label}`} />
                <p className={`text-xs font-bold ${c.text}`}>{sc.label || c.name}</p>
              </div>
              <p className={`text-xl font-bold ${c.text}`}>{fmtFull(sc.vgv)}</p>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Lotes ideal</span><span className="font-medium">{sc.lots || "-"}</span></div>
                <div className="flex justify-between"><span>Valor médio</span><span className="font-medium">{fmtFull(sc.vgv && sc.lots ? sc.vgv / sc.lots : null)}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FLUXO ANUAL DETALHADO
// ─────────────────────────────────────────────
function AnnualCashFlow({ cashflow }) {
  if (!cashflow?.length) return null;

  const chartData = cashflow.map((row) => ({
    ...row,
    acumulado: row.acumulado ?? row.cumulative,
    receita: row.receita ?? row.revenue,
    custo: row.custo ?? row.cost,
    lucro: row.lucro ?? row.profit,
  }));

  return (
    <div>
      <h4 className="text-sm font-bold text-foreground mb-4">Fluxo Anual Detalhado</h4>
      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 9 }} />
            <YAxis tickFormatter={fmtBRL} tick={{ fontSize: 9 }} width={65} />
            <Tooltip
              formatter={(v, name) => [fmtFull(v), name === "receita" ? "Receita" : name === "custo" ? "Custo" : "Lucro"]}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="receita" name="Receita" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="custo" name="Custo" fill="#ef4444" radius={[3, 3, 0, 0]} />
            <Bar dataKey="lucro" name="Lucro" fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Linha Acumulada */}
      {chartData.some(r => r.acumulado != null) && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Fluxo Acumulado</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 9 }} />
              <YAxis tickFormatter={fmtBRL} tick={{ fontSize: 9 }} width={65} />
              <Tooltip formatter={(v) => [fmtFull(v), "Acumulado"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="acumulado" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Acumulado" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabela Consolidada */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <p className="text-xs font-semibold text-muted-foreground px-4 py-3 border-b border-border uppercase tracking-wider">Tabela Consolidada</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Período</th>
                <th className="text-right px-3 py-2 font-semibold text-blue-600">Receita</th>
                <th className="text-right px-3 py-2 font-semibold text-red-600">Custo</th>
                <th className="text-right px-3 py-2 font-semibold text-green-600">Lucro</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground">Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                  <td className="px-4 py-1.5 font-medium text-foreground">{row.period}</td>
                  <td className="px-3 py-1.5 text-right text-blue-700">{fmtFull(row.receita)}</td>
                  <td className="px-3 py-1.5 text-right text-red-600">{fmtFull(row.custo)}</td>
                  <td className={`px-3 py-1.5 text-right font-semibold ${(row.lucro ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}>{fmtFull(row.lucro)}</td>
                  <td className={`px-4 py-1.5 text-right ${(row.acumulado ?? 0) >= 0 ? "text-slate-700" : "text-red-500"}`}>{fmtFull(row.acumulado)}</td>
                </tr>
              ))}
            </tbody>
            {chartData.length > 0 && (
              <tfoot className="border-t border-border bg-muted/50">
                <tr>
                  <td className="px-4 py-2 font-bold text-foreground">Total</td>
                  <td className="px-3 py-2 text-right font-bold text-blue-700">{fmtFull(chartData.reduce((a, r) => a + (r.receita || 0), 0))}</td>
                  <td className="px-3 py-2 text-right font-bold text-red-600">{fmtFull(chartData.reduce((a, r) => a + (r.custo || 0), 0))}</td>
                  <td className="px-3 py-2 text-right font-bold text-green-600">{fmtFull(chartData.reduce((a, r) => a + (r.lucro || 0), 0))}</td>
                  <td className="px-4 py-2 text-right font-bold text-muted-foreground">—</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ETAPAS DO EMPREENDIMENTO
// ─────────────────────────────────────────────
function ProjectStages({ stages, totalVgv }) {
  if (!stages?.length) return null;

  const stageColors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500"];
  const stageBg = ["bg-blue-50 border-blue-200", "bg-emerald-50 border-emerald-200", "bg-violet-50 border-violet-200", "bg-amber-50 border-amber-200"];
  const stageText = ["text-blue-700", "text-emerald-700", "text-violet-700", "text-amber-700"];

  return (
    <div>
      <h4 className="text-sm font-bold text-foreground mb-2">Seu Terreno em Etapas</h4>
      <p className="text-xs text-muted-foreground mb-5">Estruture o desenvolvimento ao longo do tempo e maximize os retornos em cada fase.</p>

      {/* Cronograma visual */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Cronograma de Desenvolvimento</p>
        <div className="space-y-3">
          {stages.map((stage, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-16 text-xs font-medium text-muted-foreground shrink-0">{stage.name}</div>
              <div className="flex-1 relative h-7 bg-muted/30 rounded-lg overflow-hidden">
                <div
                  className={`absolute top-0 bottom-0 ${stageColors[i % stageColors.length]} rounded-lg flex items-center px-2 transition-all`}
                  style={{ left: `${(stage.start_pct || 0)}%`, width: `${stage.duration_pct || 40}%` }}
                >
                  <span className="text-white text-[10px] font-semibold truncate">{stage.duration_label || ""}</span>
                </div>
              </div>
              <div className="w-20 text-xs font-bold text-right text-muted-foreground shrink-0">{stage.lots ? `${stage.lots} lotes` : ""}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-3">
          <span>Início</span>
          <span className="flex gap-4">
            {stages.map((s, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${stageColors[i % stageColors.length]}`} />
                {s.name}
              </span>
            ))}
          </span>
          <span>Fim</span>
        </div>
      </div>

      {/* Cards por etapa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {stages.map((stage, i) => (
          <div key={i} className={`border rounded-xl p-4 ${stageBg[i % stageBg.length]}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs font-bold ${stageText[i % stageText.length]}`}>{stage.name}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white/60 ${stageText[i % stageText.length]}`}>{stage.lots ? `${stage.lots} lotes` : ""}</span>
            </div>
            <p className={`text-xl font-bold ${stageText[i % stageText.length]}`}>{fmtFull(stage.vgv)}</p>
            <div className="mt-2 text-xs space-y-1 text-muted-foreground">
              {stage.avg_price && <div className="flex justify-between"><span>Preço médio/lote</span><span className="font-medium">{fmtFull(stage.avg_price)}</span></div>}
              {stage.margin_pct && <div className="flex justify-between"><span>Margem</span><span className="font-medium">{fmtPct(stage.margin_pct)}</span></div>}
              {stage.duration_label && <div className="flex justify-between"><span>Duração</span><span className="font-medium">{stage.duration_label}</span></div>}
            </div>
          </div>
        ))}
      </div>

      {/* Totais */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-white/50 mb-1">Lotes Totais</p>
          <p className="text-2xl font-bold">{stages.reduce((a, s) => a + (s.lots || 0), 0) || "-"}</p>
        </div>
        <div className="border-x border-white/10">
          <p className="text-xs text-white/50 mb-1">VGV Total</p>
          <p className="text-xl font-bold">{fmtFull(totalVgv)}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 mb-1">Receb. por Etapa</p>
          <p className="text-xl font-bold">{fmtFull(stages.reduce((a, s) => a + (s.vgv || 0), 0) / Math.max(stages.length, 1))}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function ViabilityDashboard({ result, params, project }) {
  if (!result) return null;

  const scenarios = result.scenarios?.length
    ? result.scenarios
    : [
        { label: "Conservador", vgv: result.vgv * 0.85, totalCost: result.total_cost * 1.1, lots: Math.floor((result.validated_lot_count || project?.lot_count || 0) * 0.9), net_margin_pct: result.net_margin_pct ? result.net_margin_pct - 5 : null, payback_months: result.payback_months ? result.payback_months + 6 : null },
        { label: "Ideal", vgv: result.vgv, totalCost: result.total_cost, lots: result.validated_lot_count || project?.lot_count, net_margin_pct: result.net_margin_pct, payback_months: result.payback_months },
        { label: "Agressivo", vgv: result.vgv * 1.15, totalCost: result.total_cost * 0.95, lots: Math.ceil((result.validated_lot_count || project?.lot_count || 0) * 1.1), net_margin_pct: result.net_margin_pct ? result.net_margin_pct + 6 : null, payback_months: result.payback_months ? result.payback_months - 4 : null },
      ];

  return (
    <div className="space-y-10">
      {/* 1 - CENÁRIOS */}
      <ScenarioCards scenarios={scenarios} />

      {/* 2 - RECEBÍVEIS */}
      {result.receivables && (
        <ReceivablesSimulation receivables={result.receivables} lotCount={result.validated_lot_count} />
      )}

      {/* 3 - COMPARATIVO DE RECEBÍVEIS POR CENÁRIO */}
      <ScenarioReceivables scenarios={scenarios} />

      {/* 4 - FLUXO ANUAL */}
      {result.annual_cashflow?.length > 0 && (
        <AnnualCashFlow cashflow={result.annual_cashflow} />
      )}

      {/* 5 - ETAPAS */}
      {result.stages?.length > 0 && (
        <ProjectStages stages={result.stages} totalVgv={result.vgv} />
      )}
    </div>
  );
}