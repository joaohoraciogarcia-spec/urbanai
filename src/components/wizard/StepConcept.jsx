import { Label } from "@/components/ui/label";
import { Paintbrush, Leaf, Sun, Minimize2, Home, Building2, TreePine, Hotel, Landmark, Factory, Sprout } from "lucide-react";

const styles = [
  { value: "moderno", label: "Moderno", icon: Building2, desc: "Linhas retas, vidro e concreto" },
  { value: "rustico", label: "Rústico", icon: Home, desc: "Pedra, madeira e elementos naturais" },
  { value: "tropical", label: "Tropical", icon: Sun, desc: "Vegetação exuberante e tons quentes" },
  { value: "minimalista", label: "Minimalista", icon: Minimize2, desc: "Simplicidade e funcionalidade" },
  { value: "fazenda_contemporanea", label: "Fazenda Contemporânea", icon: TreePine, desc: "Rural sofisticado e atual" },
  { value: "urbano_sofisticado", label: "Urbano Sofisticado", icon: Landmark, desc: "Elegância metropolitana" },
  { value: "ecologico", label: "Ecológico", icon: Leaf, desc: "Sustentabilidade e natureza" },
  { value: "resort", label: "Resort", icon: Hotel, desc: "Lazer e hospitalidade" },
  { value: "mediterraneo", label: "Mediterrâneo", icon: Sun, desc: "Tons terrosos e arcos" },
  { value: "industrial", label: "Industrial", icon: Factory, desc: "Metal, tijolo e concreto aparente" },
  { value: "biofilico", label: "Biofílico", icon: Sprout, desc: "Integração total com a natureza" },
];

export default function StepConcept({ data, onChange }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-1">Estilo Conceitual</h2>
        <p className="text-muted-foreground">Escolha a linguagem estética do empreendimento.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {styles.map((style) => {
          const isSelected = data.design_style === style.value;
          return (
            <button
              key={style.value}
              onClick={() => onChange({ design_style: style.value })}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              }`}
            >
              <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <style.icon className="h-5 w-5" />
              </div>
              <div>
                <p className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>{style.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{style.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}