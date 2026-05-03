import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, TreePine, Home, Building, Landmark, Hotel, Store, LayoutGrid, Mountain } from "lucide-react";

const enterpriseTypes = [
  { value: "condominio_rural", label: "Condomínio Rural", icon: TreePine, desc: "Lotes amplos em área rural" },
  { value: "condominio_urbano_fechado", label: "Cond. Urbano Fechado", icon: Home, desc: "Condomínio fechado urbano" },
  { value: "loteamento_aberto", label: "Loteamento Aberto", icon: LayoutGrid, desc: "Lotes com vias públicas" },
  { value: "bairro_planejado", label: "Bairro Planejado", icon: Building, desc: "Planejamento urbano completo" },
  { value: "predio_vertical", label: "Prédio Vertical", icon: Building2, desc: "Torres residenciais ou comerciais" },
  { value: "condominio_casas", label: "Condomínio de Casas", icon: Home, desc: "Casas em condomínio fechado" },
  { value: "resort_residencial", label: "Resort Residencial", icon: Hotel, desc: "Lazer e segunda residência" },
  { value: "mixed_use", label: "Mixed Use", icon: Store, desc: "Residencial + Comercial" },
  { value: "masterplan_hibrido", label: "Masterplan Híbrido", icon: Mountain, desc: "Múltiplas tipologias" },
];

const standards = [
  { value: "economico", label: "Econômico" },
  { value: "medio", label: "Médio" },
  { value: "medio_alto", label: "Médio-Alto" },
  { value: "alto_padrao", label: "Alto Padrão" },
  { value: "luxo", label: "Luxo" },
];

const focuses = [
  { value: "moradia", label: "Moradia" },
  { value: "investimento", label: "Investimento" },
  { value: "turismo", label: "Turismo" },
  { value: "renda", label: "Renda" },
  { value: "misto", label: "Misto" },
];

export default function StepEnterprise({ data, onChange }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-1">Tipo de Empreendimento</h2>
        <p className="text-muted-foreground">Defina o conceito e perfil do projeto desejado.</p>
      </div>

      {/* Enterprise Type */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Tipologia *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {enterpriseTypes.map((type) => {
            const isSelected = data.enterprise_type === type.value;
            return (
              <button
                key={type.value}
                onClick={() => onChange({ enterprise_type: type.value })}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                }`}
              >
                <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  <type.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>{type.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{type.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Concept Description */}
      <div>
        <Label>Descrição do Conceito</Label>
        <p className="text-xs text-muted-foreground mb-1.5">Descreva em linguagem natural o que deseja.</p>
        <Textarea
          placeholder="Ex: Quero um condomínio rural sofisticado, com lotes amplos, lagos, clube, áreas verdes e vocação para segunda residência."
          value={data.concept_description || ""}
          onChange={(e) => onChange({ concept_description: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <Label>Público-alvo</Label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1.5"
            placeholder="Ex: Famílias, investidores"
            value={data.target_audience || ""}
            onChange={(e) => onChange({ target_audience: e.target.value })}
          />
        </div>
        <div>
          <Label>Padrão do Produto</Label>
          <Select value={data.product_standard || ""} onValueChange={(v) => onChange({ product_standard: v })}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {standards.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Foco</Label>
          <Select value={data.product_focus || ""} onValueChange={(v) => onChange({ product_focus: v })}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {focuses.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}