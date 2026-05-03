import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PartyPopper, Dumbbell, Trophy, Waves, Fish, Footprints,
  Dog, Apple, Flower2, Church, UtensilsCrossed, Laptop, Store, Baby
} from "lucide-react";

const leisureItems = [
  { id: "salao_festas", label: "Salão de Festas", icon: PartyPopper },
  { id: "clube", label: "Clube", icon: Trophy },
  { id: "academia", label: "Academia", icon: Dumbbell },
  { id: "quadras", label: "Quadras Esportivas", icon: Trophy },
  { id: "beach_tennis", label: "Beach Tennis", icon: Trophy },
  { id: "piscina", label: "Piscina", icon: Waves },
  { id: "lago_acude", label: "Lago / Açude", icon: Fish },
  { id: "pesca_esportiva", label: "Pesca Esportiva", icon: Fish },
  { id: "trilhas", label: "Trilhas", icon: Footprints },
  { id: "playground", label: "Playground", icon: Baby },
  { id: "espaco_pet", label: "Espaço Pet", icon: Dog },
  { id: "pomar", label: "Pomar", icon: Apple },
  { id: "horta_comunitaria", label: "Horta Comunitária", icon: Flower2 },
  { id: "praca_central", label: "Praça Central", icon: Flower2 },
  { id: "capela", label: "Capela", icon: Church },
  { id: "espaco_gourmet", label: "Espaço Gourmet", icon: UtensilsCrossed },
  { id: "coworking", label: "Coworking", icon: Laptop },
  { id: "area_comercial", label: "Área Comercial de Apoio", icon: Store },
];

export default function StepLeisure({ data, onChange }) {
  const toggleItem = (id) => {
    const current = data.leisure_items || [];
    const updated = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    onChange({ leisure_items: updated });
  };

  const selected = data.leisure_items || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-1">Áreas de Lazer</h2>
        <p className="text-muted-foreground">Selecione os itens de lazer e conveniência desejados.</p>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Selecionados:</span>
        <span className="font-semibold text-primary">{selected.length} itens</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {leisureItems.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/20 hover:bg-muted/50"
              }`}
            >
              <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}