import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const infraItems = [
  {
    key: "energy_network",
    label: "Rede de Energia Elétrica",
    description: "Tipo de distribuição da rede elétrica interna.",
    type: "select",
    options: [
      { value: "subterranea", label: "Subterrânea (maior custo, mais estética)" },
      { value: "aerea", label: "Aérea (menor custo)" },
    ],
    field: "energy_type",
  },
  {
    key: "sewage",
    label: "Esgotamento Sanitário",
    description: "Solução para coleta e tratamento de esgoto.",
    type: "select",
    options: [
      { value: "rede_publica", label: "Rede Pública de Esgoto" },
      { value: "fossa_filtro", label: "Fossa + Filtro Anaeróbico" },
      { value: "eta", label: "ETE (Estação de Tratamento)" },
    ],
    field: "sewage_type",
  },
  {
    key: "water",
    label: "Abastecimento de Água",
    description: "Fonte de abastecimento hídrico.",
    type: "select",
    options: [
      { value: "rede_publica", label: "Rede Pública" },
      { value: "poco_artesiano", label: "Poço Artesiano (condomínio rural)" },
      { value: "misto", label: "Rede Pública + Poço de Reserva" },
    ],
    field: "water_supply_type",
  },
];

const switchItems = [
  {
    key: "stormwater",
    label: "Rede de Drenagem Pluvial",
    description: "Inclui estimativa de custo da rede de captação de águas pluviais.",
    field: "has_stormwater",
  },
  {
    key: "retention_basin",
    label: "Bacia de Amortecimento",
    description: "Exigência municipal — bacia para controle de cheias e amortecimento de picos de vazão.",
    field: "has_retention_basin",
  },
  {
    key: "earthworks",
    label: "Terraplanagem",
    description: "Terreno com declividade acentuada pode exigir corte e aterro de grande volume (custo relevante).",
    field: "has_earthworks",
  },
];

export default function StepInfrastructure({ data, onChange }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-1">Infraestrutura</h2>
        <p className="text-muted-foreground">Configure as redes e infraestrutura do empreendimento para estimativa de custo.</p>
      </div>

      {/* Select-based items */}
      <div className="space-y-5">
        {infraItems.map((item) => (
          <div key={item.key} className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div>
              <Label className="text-sm font-semibold">{item.label}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <Select
              value={data[item.field] || ""}
              onValueChange={(v) => onChange({ [item.field]: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {item.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* Switch-based items */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold block">Itens Adicionais de Infraestrutura</Label>
        {switchItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30 gap-4">
            <div>
              <Label className="text-sm font-semibold">{item.label}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <Switch
              checked={data[item.field] || false}
              onCheckedChange={(v) => onChange({ [item.field]: v })}
            />
          </div>
        ))}
      </div>

      {/* Terraplanagem warning */}
      {data.has_earthworks && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
          <span className="text-orange-500 text-base shrink-0">⚠️</span>
          <p className="text-xs text-orange-800 leading-relaxed">
            <strong>Terraplanagem:</strong> Em terrenos com declividade acentuada, o custo de movimentação de terra pode representar 15–30% do custo total de infraestrutura. Será considerado no estudo de viabilidade.
          </p>
        </div>
      )}

      {/* Retention basin info */}
      {data.has_retention_basin && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
          <span className="text-blue-500 text-base shrink-0">💧</span>
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Bacia de Amortecimento:</strong> Área reservada para controle do escoamento superficial. Será representada no masterplan como área verde/lago, podendo também ter função paisagística.
          </p>
        </div>
      )}

      {/* Poço artesiano info */}
      {data.water_supply_type === "poco_artesiano" && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-start gap-2">
          <span className="text-teal-500 text-base shrink-0">💧</span>
          <p className="text-xs text-teal-800 leading-relaxed">
            <strong>Poço Artesiano:</strong> Indicado para condomínios rurais e áreas sem cobertura de rede pública. Exige outorga de uso d'água e análise de qualidade. Custo de perfuração varia conforme profundidade e geologia local.
          </p>
        </div>
      )}
    </div>
  );
}