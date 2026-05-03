import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = [
  "hsl(220, 70%, 45%)",
  "hsl(160, 55%, 40%)",
  "hsl(35, 90%, 55%)",
  "hsl(280, 55%, 55%)",
  "hsl(350, 65%, 55%)",
];

export default function AreaReport({ report }) {
  if (!report) return null;

  const chartData = [
    { name: "Área Vendável", value: report.sellable_area || 0 },
    { name: "Área Verde", value: report.green_area || 0 },
    { name: "Sistema Viário", value: report.road_area || 0 },
    { name: "Lazer", value: report.leisure_area || 0 },
    { name: "Institucional", value: report.institutional_area || 0 },
  ].filter((d) => d.value > 0);

  const stats = [
    { label: "Área Total", value: `${(report.total_area || 0).toLocaleString("pt-BR")} m²` },
    { label: "Área Vendável", value: `${(report.sellable_area || 0).toLocaleString("pt-BR")} m²` },
    { label: "Área Verde", value: `${(report.green_area || 0).toLocaleString("pt-BR")} m²` },
    { label: "Sistema Viário", value: `${(report.road_area || 0).toLocaleString("pt-BR")} m²` },
    { label: "Lazer", value: `${(report.leisure_area || 0).toLocaleString("pt-BR")} m²` },
    { label: "Total de Lotes", value: report.total_lots || 0 },
    { label: "Lote Médio", value: `${(report.avg_lot_size || 0).toLocaleString("pt-BR")} m²` },
    { label: "Densidade", value: `${(report.density || 0).toFixed(1)} lotes/ha` },
    { label: "% Ocupação", value: `${(report.occupation_percentage || 0).toFixed(1)}%` },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-semibold">Quadro de Áreas</h3>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value.toLocaleString("pt-BR")} m²`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-semibold mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}