import { Badge } from "@/components/ui/badge";

const typeLabels = {
  condominio_rural: "Condomínio Rural",
  condominio_urbano_fechado: "Cond. Urbano Fechado",
  loteamento_aberto: "Loteamento Aberto",
  bairro_planejado: "Bairro Planejado",
  predio_vertical: "Prédio Vertical",
  conjunto_habitacional: "Conj. Habitacional",
  mixed_use: "Mixed Use",
  condominio_casas: "Cond. de Casas",
  resort_residencial: "Resort Residencial",
  empreendimento_comercial: "Emp. Comercial",
  masterplan_hibrido: "Masterplan Híbrido",
};

const styleLabels = {
  moderno: "Moderno", rustico: "Rústico", tropical: "Tropical",
  minimalista: "Minimalista", fazenda_contemporanea: "Fazenda Contemporânea",
  urbano_sofisticado: "Urbano Sofisticado", ecologico: "Ecológico",
  resort: "Resort", mediterraneo: "Mediterrâneo", industrial: "Industrial",
  biofilico: "Biofílico",
};

const leisureLabels = {
  salao_festas: "Salão de Festas", clube: "Clube", academia: "Academia",
  quadras: "Quadras", beach_tennis: "Beach Tennis", piscina: "Piscina",
  lago_acude: "Lago/Açude", pesca_esportiva: "Pesca Esportiva", trilhas: "Trilhas",
  playground: "Playground", espaco_pet: "Espaço Pet", pomar: "Pomar",
  horta_comunitaria: "Horta Comunitária", praca_central: "Praça Central",
  capela: "Capela", espaco_gourmet: "Espaço Gourmet", coworking: "Coworking",
  area_comercial: "Área Comercial",
};

export default function ProjectSummary({ project }) {
  const sections = [
    {
      title: "Terreno",
      items: [
        { label: "Área", value: project.total_area ? `${project.total_area.toLocaleString("pt-BR")} m²` : null },
        { label: "Perímetro", value: project.perimeter ? `${project.perimeter} m` : null },
        { label: "Testada", value: project.main_frontage ? `${project.main_frontage} m` : null },
        { label: "Topografia", value: project.predominant_topography },
        { label: "Orientação Solar", value: project.solar_orientation },
        { label: "Acessos", value: project.existing_access },
      ],
    },
    {
      title: "Empreendimento",
      items: [
        { label: "Tipo", value: typeLabels[project.enterprise_type] },
        { label: "Padrão", value: project.product_standard },
        { label: "Foco", value: project.product_focus },
        { label: "Público", value: project.target_audience },
        { label: "Estilo", value: styleLabels[project.design_style] },
      ],
    },
    {
      title: "Parcelamento",
      items: [
        { label: "Lotes", value: project.lot_size ? `${project.lot_size} m²` : null },
        { label: "Quantidade", value: project.lot_count },
        { label: "Frente mín.", value: project.min_front_width ? `${project.min_front_width} m` : null },
        { label: "Ocupação", value: project.occupation_rate ? `${project.occupation_rate}%` : null },
        { label: "Coeficiente", value: project.utilization_coefficient },
        { label: "Gabarito", value: project.max_height ? `${project.max_height} andares` : null },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-semibold">Resumo do Projeto</h3>

      {sections.map((section) => {
        const visibleItems = section.items.filter((i) => i.value);
        if (visibleItems.length === 0) return null;
        return (
          <div key={section.title}>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{section.title}</h4>
            <div className="space-y-2">
              {visibleItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Leisure */}
      {(project.leisure_items || []).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Lazer</h4>
          <div className="flex flex-wrap gap-2">
            {project.leisure_items.map((item) => (
              <Badge key={item} variant="secondary" className="text-xs">
                {leisureLabels[item] || item}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Concept */}
      {project.concept_description && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Conceito</h4>
          <p className="text-sm leading-relaxed">{project.concept_description}</p>
        </div>
      )}
    </div>
  );
}