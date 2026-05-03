import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookmarkPlus, Trash2, Plus, Loader2, LayoutTemplate,
  Search, Building2, Palette, Users, Layers
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const typeLabels = {
  condominio_rural: "Condomínio Rural", condominio_urbano_fechado: "Condomínio Urbano Fechado",
  loteamento_aberto: "Loteamento Aberto", bairro_planejado: "Bairro Planejado",
  predio_vertical: "Prédio Vertical", conjunto_habitacional: "Conjunto Habitacional",
  mixed_use: "Mixed Use", condominio_casas: "Condomínio de Casas",
  resort_residencial: "Resort Residencial", empreendimento_comercial: "Empreendimento Comercial",
  masterplan_hibrido: "Masterplan Híbrido",
};

const styleLabels = {
  moderno: "Moderno", rustico: "Rústico", tropical: "Tropical", minimalista: "Minimalista",
  fazenda_contemporanea: "Fazenda Contemporânea", urbano_sofisticado: "Urbano Sofisticado",
  ecologico: "Ecológico", resort: "Resort", mediterraneo: "Mediterrâneo",
  industrial: "Industrial", biofilico: "Biofílico",
};

const stdLabels = {
  economico: "Econômico", medio: "Médio", medio_alto: "Médio-Alto",
  alto_padrao: "Alto Padrão", luxo: "Luxo",
};

function TemplateCard({ template, onDelete, onUse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
    >
      {/* Cover */}
      <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
        {template.cover_image ? (
          <img src={template.cover_image} alt={template.name} className="w-full h-full object-cover" />
        ) : (
          <LayoutTemplate className="h-12 w-12 text-primary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {template.enterprise_type && (
          <span className="absolute bottom-2 left-3 text-xs text-white/90 font-medium bg-black/30 rounded-full px-2 py-0.5">
            {typeLabels[template.enterprise_type] || template.enterprise_type}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 space-y-3">
        <div>
          <h3 className="font-semibold text-base leading-tight">{template.name}</h3>
          {template.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {template.design_style && (
            <span className="inline-flex items-center gap-1 text-xs bg-primary/8 text-primary rounded-full px-2 py-0.5">
              <Palette className="h-3 w-3" />
              {styleLabels[template.design_style] || template.design_style}
            </span>
          )}
          {template.product_standard && (
            <span className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent-foreground rounded-full px-2 py-0.5">
              <Layers className="h-3 w-3" />
              {stdLabels[template.product_standard] || template.product_standard}
            </span>
          )}
          {template.target_audience && (
            <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
              <Users className="h-3 w-3" />
              {template.target_audience.slice(0, 24)}{template.target_audience.length > 24 ? "…" : ""}
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex gap-3 text-xs text-muted-foreground">
          {template.lot_size && <span>🔲 Lotes: {template.lot_size} m²</span>}
          {template.leisure_items?.length > 0 && <span>🌳 {template.leisure_items.length} itens de lazer</span>}
        </div>

        {template.masterplan_idea && (
          <p className="text-xs text-foreground/60 italic line-clamp-2 border-l-2 border-primary/30 pl-2">
            {template.masterplan_idea}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 pt-0 flex gap-2">
        <Button size="sm" className="flex-1 gap-2" onClick={() => onUse(template)}>
          <Plus className="h-3.5 w-3.5" />
          Usar Template
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline" className="px-2.5 text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir template?</AlertDialogTitle>
              <AlertDialogDescription>
                O template "{template.name}" será removido permanentemente. Projetos existentes criados a partir dele não serão afetados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(template.id)} className="bg-destructive hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const user = await base44.auth.me();
    const data = await base44.entities.ProjectTemplate.filter({ created_by: user.email }, "-created_date", 100);
    setTemplates(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.ProjectTemplate.delete(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUse = (template) => {
    // Encode template fields as URL param so NewProject can pre-fill
    const fields = {
      enterprise_type: template.enterprise_type,
      concept_description: template.concept_description,
      target_audience: template.target_audience,
      product_standard: template.product_standard,
      product_focus: template.product_focus,
      design_style: template.design_style,
      lot_size: template.lot_size,
      min_front_width: template.min_front_width,
      avg_depth: template.avg_depth,
      occupation_rate: template.occupation_rate,
      utilization_coefficient: template.utilization_coefficient,
      max_height: template.max_height,
      setbacks: template.setbacks,
      road_type: template.road_type,
      road_width: template.road_width,
      road_features: template.road_features,
      has_gatehouse: template.has_gatehouse,
      leisure_items: template.leisure_items,
      _template_name: template.name,
      _masterplan_idea: template.masterplan_idea,
    };
    // Remove undefined/null fields
    Object.keys(fields).forEach((k) => {
      if (fields[k] === undefined || fields[k] === null) delete fields[k];
    });
    const encoded = encodeURIComponent(JSON.stringify(fields));
    navigate(`/novo-projeto?template=${encoded}`);
  };

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || "").toLowerCase().includes(search.toLowerCase()) ||
    (typeLabels[t.enterprise_type] || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
      >
        <div>
          <h1 className="text-3xl font-display font-semibold">Templates de Projeto</h1>
          <p className="text-muted-foreground mt-1">Reutilize configurações de projetos anteriores para agilizar novos briefings.</p>
        </div>
      </motion.div>

      {templates.length > 0 && (
        <div className="relative mb-8 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {templates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-2xl border border-dashed border-border p-16 text-center"
        >
          <div className="h-20 w-20 mx-auto rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
            <BookmarkPlus className="h-10 w-10 text-primary/30" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum template ainda</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Abra um projeto existente e clique em <strong>"Salvar como Template"</strong> para reutilizar suas configurações em novos projetos.
          </p>
        </motion.div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>Nenhum template encontrado para "{search}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onDelete={handleDelete} onUse={handleUse} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}