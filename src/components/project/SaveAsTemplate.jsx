import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookmarkPlus, Loader2, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TEMPLATE_FIELDS = [
  "enterprise_type", "concept_description", "target_audience",
  "product_standard", "product_focus", "design_style",
  "lot_size", "min_front_width", "avg_depth", "occupation_rate",
  "utilization_coefficient", "max_height", "setbacks",
  "road_type", "road_width", "road_features", "has_gatehouse",
  "leisure_items",
];

export default function SaveAsTemplate({ project }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(`Template — ${project.name}`);
  const [description, setDescription] = useState("");
  const [masterplanIdea, setMasterplanIdea] = useState(
    project.masterplan_description
      ? project.masterplan_description.replace(/[#*`]/g, "").slice(0, 500)
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const templateData = { name, description, masterplan_idea: masterplanIdea, source_project_id: project.id };

    TEMPLATE_FIELDS.forEach((field) => {
      if (project[field] !== undefined && project[field] !== null) {
        templateData[field] = project[field];
      }
    });

    // Extract viability area allocations if available
    if (project.viability_params) {
      const vp = project.viability_params;
      if (vp.road_pct) templateData.road_pct = vp.road_pct;
      if (vp.app_pct) templateData.app_pct = vp.app_pct;
      if (vp.leisure_pct) templateData.leisure_pct = vp.leisure_pct;
      if (vp.institutional_pct) templateData.institutional_pct = vp.institutional_pct;
    }

    // Use masterplan image as cover if available
    if (project.masterplan_image) {
      templateData.cover_image = project.masterplan_image;
    }

    await base44.entities.ProjectTemplate.create(templateData);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setOpen(false); }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookmarkPlus className="h-4 w-4" />
          Salvar como Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Salvar como Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Este template capturará o tipo de empreendimento, conceito, estilo, parcelamento, viário, lazer e alocações de área deste projeto.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nome do template</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Condomínio Rural Alto Padrão" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva quando usar este template..."
              className="min-h-[70px] resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Ideia inicial de masterplan (opcional)</label>
            <Textarea
              value={masterplanIdea}
              onChange={(e) => setMasterplanIdea(e.target.value)}
              placeholder="Diretrizes conceituais para novos projetos criados a partir deste template..."
              className="min-h-[90px] resize-none text-xs"
            />
          </div>
          <Button onClick={handleSave} disabled={saving || !name.trim() || saved} className="w-full gap-2">
            {saved ? (
              <><CheckCircle className="h-4 w-4" /> Template salvo!</>
            ) : saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
            ) : (
              <><BookmarkPlus className="h-4 w-4" /> Salvar Template</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}