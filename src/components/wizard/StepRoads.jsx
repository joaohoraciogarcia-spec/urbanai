import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const roadFeatures = [
  "Calçadas",
  "Ciclovia",
  "Canteiro Central",
  "Bolsões de Estacionamento",
  "Vagas para Visitantes (próx. à entrada)",
  "Acesso de Serviço",
  "Arborização",
  "Iluminação Especial",
  "Pavimentação Intertravada",
];

export default function StepRoads({ data, onChange }) {
  const toggleFeature = (feature) => {
    const current = data.road_features || [];
    const updated = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    onChange({ road_features: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-1">Sistema Viário</h2>
        <p className="text-muted-foreground">Configure as vias internas e acessos do empreendimento.</p>
      </div>

      {/* Via Principal e Via Secundária */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold block">Via Principal (Eixo Central)</Label>
        <p className="text-xs text-muted-foreground -mt-2">Via de maior hierarquia — normalmente 2 pistas com canteiro central.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label>Tipo de Via Principal</Label>
            <Select value={data.road_type || ""} onValueChange={(v) => onChange({ road_type: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="coletora">Coletora</SelectItem>
                <SelectItem value="boulevard">Boulevard (canteiro central)</SelectItem>
                <SelectItem value="mista">Mista</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Largura da Via Principal (m)</Label>
            <Input
              type="number"
              placeholder="Ex: 24 (2 pistas + canteiro)"
              value={data.road_width || ""}
              onChange={(e) => onChange({ road_width: parseFloat(e.target.value) || 0 })}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">Sugestão: Boulevard com canteiro ≈ 24–30m.</p>
          </div>
        </div>
      </div>

      {/* Vias Secundárias */}
      <div className="p-4 bg-muted/40 rounded-xl space-y-4 border border-border">
        <div>
          <Label className="text-sm font-semibold">Vias Secundárias (ramificações da principal)</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Vias que se ramificam da via principal para os lotes internos.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label>Tipo de Via Secundária</Label>
            <Select value={data.secondary_road_type || ""} onValueChange={(v) => onChange({ secondary_road_type: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local (simples)</SelectItem>
                <SelectItem value="sem_saida">Cul-de-sac / Sem saída</SelectItem>
                <SelectItem value="viela">Viela / Servidão</SelectItem>
                <SelectItem value="mista">Mista</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Largura das Vias Secundárias (m)</Label>
            <Input
              type="number"
              placeholder="Ex: 12"
              value={data.secondary_road_width || ""}
              onChange={(e) => onChange({ secondary_road_width: parseFloat(e.target.value) || 0 })}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">Sugestão: vias locais ≈ 10–14m.</p>
          </div>
        </div>
      </div>

      {/* Gatehouse */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
        <div>
          <Label className="text-sm font-semibold">Portaria / Controle de Acesso</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Incluir portaria com controle de entrada</p>
        </div>
        <Switch
          checked={data.has_gatehouse || false}
          onCheckedChange={(v) => onChange({ has_gatehouse: v })}
        />
      </div>

      {/* Road Features */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Elementos Viários</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roadFeatures.map((feature) => (
            <label key={feature} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
              <Checkbox
                checked={(data.road_features || []).includes(feature)}
                onCheckedChange={() => toggleFeature(feature)}
              />
              <span className="text-sm">{feature}</span>
            </label>
          ))}
        </div>
        {(data.road_features || []).includes("Vagas para Visitantes (próx. à entrada)") && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            💡 As vagas para visitantes serão posicionadas próximas à portaria/entrada principal no masterplan.
          </div>
        )}
      </div>
    </div>
  );
}