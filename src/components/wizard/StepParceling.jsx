import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function StepParceling({ data, onChange }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-1">Parcelamento e Ocupação</h2>
        <p className="text-muted-foreground">Configure as dimensões dos lotes e parâmetros de ocupação.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label>Metragem dos Lotes (m²)</Label>
          <Input
            type="number"
            placeholder="Ex: 1000"
            value={data.lot_size || ""}
            onChange={(e) => onChange({ lot_size: parseFloat(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Quantidade Aproximada de Lotes</Label>
          <Input
            type="number"
            placeholder="Ex: 120"
            value={data.lot_count || ""}
            onChange={(e) => onChange({ lot_count: parseInt(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Largura Mínima de Frente (m)</Label>
          <Input
            type="number"
            placeholder="Ex: 20"
            value={data.min_front_width || ""}
            onChange={(e) => onChange({ min_front_width: parseFloat(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Profundidade Média (m)</Label>
          <Input
            type="number"
            placeholder="Ex: 50"
            value={data.avg_depth || ""}
            onChange={(e) => onChange({ avg_depth: parseFloat(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Taxa de Ocupação</Label>
            <span className="text-sm font-semibold text-primary">{data.occupation_rate || 50}%</span>
          </div>
          <Slider
            value={[data.occupation_rate || 50]}
            onValueChange={([v]) => onChange({ occupation_rate: v })}
            max={100}
            min={10}
            step={5}
            className="mt-1"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>10%</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Coeficiente de Aproveitamento</Label>
            <span className="text-sm font-semibold text-primary">{data.utilization_coefficient || 1.0}</span>
          </div>
          <Slider
            value={[data.utilization_coefficient ? data.utilization_coefficient * 10 : 10]}
            onValueChange={([v]) => onChange({ utilization_coefficient: v / 10 })}
            max={50}
            min={1}
            step={1}
            className="mt-1"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.1</span>
            <span>5.0</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label>Gabarito (andares)</Label>
          <Input
            type="number"
            placeholder="Ex: 2"
            value={data.max_height || ""}
            onChange={(e) => onChange({ max_height: parseInt(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Recuos</Label>
          <Input
            placeholder="Ex: Frontal 5m, Lateral 2m, Fundos 3m"
            value={data.setbacks || ""}
            onChange={(e) => onChange({ setbacks: e.target.value })}
            className="mt-1.5"
          />
        </div>
      </div>
    </div>
  );
}