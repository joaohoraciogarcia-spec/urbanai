import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from "recharts";

const fmt = (v) => v >= 1_000_000
  ? `R$${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000
    ? `R$${(v / 1_000).toFixed(0)}K`
    : `R$${v}`;

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];

export default function ViabilityCharts({ result }) {
  if (!result) return null;

  // VGV vs Custo
  const vgvCostData = [
    { name: "VGV", value: result.vgv || 0, fill: "#10b981" },
    { name: "Custo Total", value: result.total_cost || 0, fill: "#ef4444" },
    { name: "Lucro", value: Math.max(0, (result.vgv || 0) - (result.total_cost || 0)), fill: "#3b82f6" },
  ];

  // Fluxo de caixa projetado pelas fases
  const cashFlowData = (result.revenue_phases || []).map((p, i) => ({
    name: p.phase,
    receita: ((p.pct_of_vgv || 0) / 100) * (result.vgv || 0),
    custo: ((p.pct_of_vgv || 0) / 100) * (result.total_cost || 0) * 0.9,
  }));

  // Cost breakdown pie
  const pieData = (result.cost_breakdown || []).map((c) => ({
    name: c.label,
    value: c.value_brl || 0,
  }));

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">📊 Gráficos da Viabilidade</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VGV vs Custo vs Lucro */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-semibold mb-4">VGV × Custo × Lucro</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vgvCostData} barSize={48}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={fmt} tick={{ fontSize: 10 }} width={60} />
              <Tooltip formatter={(v) => [`R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`, ""]} />
              {vgvCostData.map((entry, i) => (
                <Bar key={entry.name} dataKey="value" data={[entry]} fill={entry.fill} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fluxo de Caixa por Fase */}
        {cashFlowData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm font-semibold mb-4">Fluxo de Caixa Projetado por Fase</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={fmt} tick={{ fontSize: 10 }} width={60} />
                <Tooltip formatter={(v) => [`R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`, ""]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Receita" />
                <Line type="monotone" dataKey="custo" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Custo" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Cost Breakdown Pie */}
        {pieData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 md:col-span-2">
            <p className="text-sm font-semibold mb-4">Distribuição dos Custos</p>
            <div className="flex items-center gap-6 flex-wrap">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground flex-1">{d.name}</span>
                    <span className="font-semibold">{fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}