import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Pencil, FileDown, MessageCircle } from "lucide-react";
import SaveAsTemplate from "../components/project/SaveAsTemplate";
import ViabilityStudy from "../components/project/ViabilityStudy";
import TerrainMap from "../components/project/TerrainMap";
import MarketAnalysis from "../components/project/MarketAnalysis";
import ProjectNotes from "../components/project/ProjectNotes";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import ReportPDFExport from "../components/project/ReportPDFExport";
import ReportGenerator from "../components/project/ReportGenerator";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ProjectHeader from "../components/project/ProjectHeader";
import ProjectSummary from "../components/project/ProjectSummary";
import MasterplanGenerator from "../components/project/MasterplanGenerator";
import AreaReport from "../components/project/AreaReport";

export default function ProjectDetail() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const projectId = window.location.pathname.split("/projeto/")[1]?.split("/")[0] ||
    new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    if (!projectId) { setLoading(false); return; }
    const data = await base44.entities.Project.filter({ id: projectId });
    if (data.length > 0) setProject(data[0]);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Projeto não encontrado.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-10 max-w-7xl mx-auto"
    >
      <div className="flex items-start justify-between">
        <ProjectHeader project={project} />
        <div className="flex items-center gap-2 mt-1">
          <SaveAsTemplate project={project} />
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/projeto/${project.id}/editar`)}>
            <Pencil className="h-4 w-4" />
            Editar Briefing
          </Button>
        </div>
      </div>

      <Tabs defaultValue="masterplan" className="mt-8">
        <TabsList className="bg-muted/50 p-1 flex-wrap">
          <TabsTrigger value="masterplan">Masterplan</TabsTrigger>
          <TabsTrigger value="report">Relatório</TabsTrigger>
          <TabsTrigger value="viability">Viabilidade</TabsTrigger>
          <TabsTrigger value="market">Mercado</TabsTrigger>
          <TabsTrigger value="map">Mapa</TabsTrigger>
          <TabsTrigger value="notes">Anotações</TabsTrigger>
          <TabsTrigger value="summary">Briefing</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="masterplan">
            {project.masterplan_image ? (
              <div className="space-y-8">
                {/* Hero Masterplan Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden border border-border shadow-2xl"
                >
                  <img
                    src={project.masterplan_image}
                    alt="Masterplan Ilustrativo"
                    className="w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
                    <p className="text-white font-display text-xl font-semibold">{project.name}</p>
                    {project.location && (
                      <p className="text-white/70 text-sm mt-1">{project.location}</p>
                    )}
                  </div>
                </motion.div>

                {/* Description */}
                {project.masterplan_description && (
                  <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
                    <h3 className="text-xl font-display font-semibold mb-4">Proposta Urbanística</h3>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{project.masterplan_description}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Area Report inline */}
                {project.area_report && (
                  <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
                    <AreaReport report={project.area_report} />
                  </div>
                )}

                {/* Share Masterplan */}
                <div className="bg-card rounded-xl border border-border p-6 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm font-medium">Compartilhar Masterplan</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Envie a imagem e descrição via WhatsApp.</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                    const text = [
                      `🏙️ *Masterplan — ${project.name}*`,
                      project.location ? `📍 ${project.location}` : "",
                      project.total_area ? `📏 Área: ${project.total_area.toLocaleString()} m²` : "",
                      project.enterprise_type ? `🏘️ Tipo: ${project.enterprise_type}` : "",
                      project.lot_count ? `🔲 Lotes: ${project.lot_count} unidades` : "",
                      project.design_style ? `🎨 Estilo: ${project.design_style}` : "",
                      "",
                      project.masterplan_description
                        ? project.masterplan_description.replace(/[#*`]/g, "").slice(0, 400) + "..."
                        : "",
                      "",
                      project.masterplan_image ? `🖼️ Imagem: ${project.masterplan_image}` : "",
                    ].filter(Boolean).join("\n");
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                  }}>
                    <MessageCircle className="h-4 w-4" />
                    Compartilhar via WhatsApp
                  </Button>
                </div>

                {/* Regenerate */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <MasterplanGenerator
                    project={project}
                    onGenerated={(updated) => setProject(updated)}
                    regenerateOnly
                  />
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
                <MasterplanGenerator
                  project={project}
                  onGenerated={(updated) => setProject(updated)}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="report">
            <div className="bg-card rounded-xl border border-border p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-semibold">Relatório do Projeto</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Relatório de áreas e exportação completa em PDF.</p>
                </div>
                <ReportGenerator project={project} />
              </div>
              {project.area_report ? (
                <AreaReport report={project.area_report} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Gere o masterplan primeiro para ver o relatório de áreas.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="viability">
            <div className="bg-card rounded-xl border border-border p-6 lg:p-8 space-y-6">
              <div className="flex justify-end">
                <ReportPDFExport project={project} />
              </div>
              <ViabilityStudy project={project} />
            </div>
          </TabsContent>

          <TabsContent value="market">
            <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
              <MarketAnalysis project={project} />
            </div>
          </TabsContent>

          <TabsContent value="map">
            <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
              <TerrainMap project={project} />
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
              <ProjectNotes project={project} />
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
              <div className="flex gap-3 mb-6">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                  const doc = new jsPDF();
                  doc.setFontSize(18);
                  doc.text(project.name || "Projeto", 20, 20);
                  doc.setFontSize(11);
                  const lines = [
                    `Localização: ${project.location || "-"}`,
                    `Área Total: ${project.total_area ? project.total_area.toLocaleString() + " m²" : "-"}`,
                    `Tipo: ${project.enterprise_type || "-"}`,
                    `Padrão: ${project.product_standard || "-"}`,
                    `Público-alvo: ${project.target_audience || "-"}`,
                    `Lotes: ${project.lot_count || "-"} unidades de ${project.lot_size || "-"} m²`,
                    `Estilo: ${project.design_style || "-"}`,
                    "",
                    "Conceito:",
                    ...(doc.splitTextToSize(project.concept_description || "-", 170)),
                  ];
                  if (project.masterplan_description) {
                    lines.push("", "Masterplan:");
                    lines.push(...doc.splitTextToSize(project.masterplan_description.replace(/[#*`]/g, ""), 170));
                  }
                  doc.text(lines, 20, 35);
                  doc.save(`${project.name || "relatorio"}.pdf`);
                }}>
                  <FileDown className="h-4 w-4" />
                  Gerar Relatório
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                  const text = [
                    `📐 *${project.name}*`,
                    project.location ? `📍 ${project.location}` : "",
                    project.total_area ? `📏 Área: ${project.total_area.toLocaleString()} m²` : "",
                    project.enterprise_type ? `🏘️ Tipo: ${project.enterprise_type}` : "",
                    project.lot_count ? `🔲 Lotes: ${project.lot_count} unidades` : "",
                    project.design_style ? `🎨 Estilo: ${project.design_style}` : "",
                    project.concept_description ? `\n💡 ${project.concept_description}` : "",
                  ].filter(Boolean).join("\n");
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}>
                  <MessageCircle className="h-4 w-4" />
                  Compartilhar no WhatsApp
                </Button>
              </div>
              <ProjectSummary project={project} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}