import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const leisureLabels = {
  salao_festas: "Salão de Festas", clube: "Clube", academia: "Academia",
  quadras: "Quadras", beach_tennis: "Beach Tennis", piscina: "Piscina",
  lago_acude: "Lago/Açude", pesca_esportiva: "Pesca Esportiva", trilhas: "Trilhas",
  playground: "Playground", espaco_pet: "Espaço Pet", pomar: "Pomar",
  horta_comunitaria: "Horta Comunitária", praca_central: "Praça Central",
  capela: "Capela", espaco_gourmet: "Espaço Gourmet", coworking: "Coworking",
  area_comercial: "Área Comercial",
};

const typeLabels = {
  condominio_rural: "Condomínio Rural",
  condominio_urbano_fechado: "Condomínio Urbano Fechado",
  loteamento_aberto: "Loteamento Aberto",
  bairro_planejado: "Bairro Planejado",
  predio_vertical: "Prédio Vertical",
  conjunto_habitacional: "Conjunto Habitacional",
  mixed_use: "Mixed Use",
  condominio_casas: "Condomínio de Casas",
  resort_residencial: "Resort Residencial",
  empreendimento_comercial: "Empreendimento Comercial",
  masterplan_hibrido: "Masterplan Híbrido",
};

const styleLabels = {
  moderno: "Moderno", rustico: "Rústico", tropical: "Tropical",
  minimalista: "Minimalista", fazenda_contemporanea: "Fazenda Contemporânea",
  urbano_sofisticado: "Urbano Sofisticado", ecologico: "Ecológico",
  resort: "Resort", mediterraneo: "Mediterrâneo", industrial: "Industrial",
  biofilico: "Biofílico",
};

function buildPrompt(project) {
  const leisure = (project.leisure_items || []).map((i) => leisureLabels[i] || i).join(", ");
  const roadFeatures = (project.road_features || []).join(", ");
  const terrainFeatures = (project.terrain_features || []).join(", ");

  return `Você é um urbanista e arquiteto experiente. Analise os dados a seguir e gere um estudo urbanístico detalhado com um masterplan conceitual.

DADOS DO TERRENO:
- Área total: ${project.total_area || "não informada"} m² (${((project.total_area || 0) / 10000).toFixed(2)} hectares)
- Perímetro: ${project.perimeter || "não informado"} m
- Testada principal: ${project.main_frontage || "não informada"} m
- Topografia: ${project.predominant_topography || "não informada"}
- Características: ${terrainFeatures || "não informadas"}
- Orientação solar: ${project.solar_orientation || "não informada"}
- Acessos: ${project.existing_access || "não informados"}
- Vistas: ${project.relevant_views || "não informadas"}
- Limitações legais: ${project.legal_limitations || "não informadas"}

EMPREENDIMENTO:
- Tipo: ${typeLabels[project.enterprise_type] || project.enterprise_type || "não definido"}
- Conceito: ${project.concept_description || "não descrito"}
- Público-alvo: ${project.target_audience || "não definido"}
- Padrão: ${project.product_standard || "não definido"}
- Foco: ${project.product_focus || "não definido"}
- Estilo: ${styleLabels[project.design_style] || "não definido"}

PARCELAMENTO:
- Metragem dos lotes: ${project.lot_size || "não definida"} m²
- Quantidade estimada: ${project.lot_count || "não definida"}
- Frente mínima: ${project.min_front_width || "não definida"} m
- Profundidade média: ${project.avg_depth || "não definida"} m
- Taxa de ocupação: ${project.occupation_rate || 50}%
- Coeficiente: ${project.utilization_coefficient || 1.0}
- Gabarito: ${project.max_height || "não definido"} andares
- Recuos: ${project.setbacks || "não definidos"}

VIÁRIO:
- Tipo de via: ${project.road_type || "não definido"}
- Largura: ${project.road_width || "não definida"} m
- Portaria: ${project.has_gatehouse ? "Sim" : "Não"}
- Elementos: ${roadFeatures || "não definidos"}

LAZER:
${leisure || "Nenhum item selecionado"}

Gere uma resposta estruturada com:
1. Descrição detalhada do masterplan proposto
2. Setorização do empreendimento
3. Distribuição do sistema viário
4. Posicionamento das áreas de lazer
5. Quadro de áreas estimado

IMPORTANTE: Calcule o quadro de áreas de forma realista considerando a área total informada.

Se o empreendimento for do tipo bairro planejado, mixed use, masterplan híbrido ou se o conceito mencionar centralidade, proponha OBRIGATORIAMENTE uma estrutura de SUPERLOTES/QUADRAS: agrupe os lotes em quadras delimitadas por vias coletoras (12-16m), com uma centralidade clara no centro do masterplan (praça, área comercial ou equipamento de uso misto). Descreva as dimensões típicas de cada quadra e o sistema viário hierárquico.`;
}

export default function MasterplanGenerator({ project, onGenerated, regenerateOnly = false }) {
  const [generating, setGenerating] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [description, setDescription] = useState(project.masterplan_description || "");
  const [image, setImage] = useState(project.masterplan_image || "");
  const [report, setReport] = useState(project.area_report || null);
  const [customImagePrompt, setCustomImagePrompt] = useState("");

  const generateMasterplan = async () => {
    setGenerating(true);
    setDescription("");
    setImage("");
    setReport(null);

    // Generate description and area report
    const prompt = buildPrompt(project);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          masterplan_description: { type: "string", description: "Descrição completa e detalhada do masterplan, com markdown" },
          area_report: {
            type: "object",
            properties: {
              total_area: { type: "number" },
              sellable_area: { type: "number" },
              green_area: { type: "number" },
              road_area: { type: "number" },
              leisure_area: { type: "number" },
              institutional_area: { type: "number" },
              total_lots: { type: "number" },
              avg_lot_size: { type: "number" },
              density: { type: "number" },
              occupation_percentage: { type: "number" },
            },
          },
        },
      },
      model: "claude_sonnet_4_6",
    });

    setDescription(result.masterplan_description);
    setReport(result.area_report);
    setGenerating(false);

    // Generate conceptual image overlaid on terrain
    setGeneratingImage(true);
    const aerialImage = project.aerial_image;
    const totalHa = ((project.total_area || 0) / 10000).toFixed(2);
    const lotCount = result.area_report?.total_lots || project.lot_count || "?";
    const lotSize = project.lot_size || 300;
    // Estimate a realistic scale: sqrt of area gives rough side length in meters
    const terrainSideM = Math.sqrt(project.total_area || 10000).toFixed(0);

    const lotSide = Math.sqrt(lotSize).toFixed(0);
    const isCentrality = (project.concept_description || "").toLowerCase().includes("centralidade") ||
      (project.enterprise_type || "").includes("bairro") ||
      (project.enterprise_type || "").includes("mixed_use") ||
      (project.enterprise_type || "").includes("masterplan");

    const superblockNote = isCentrality
      ? `SUPERBLOCKS REQUIRED: Organize lots into clearly defined superblocks/quadras of 6-12 lots each, separated by collector roads (12-16m wide). Each superblock is a rectangular cluster of lots clearly bounded by roads on all four sides. Between superblocks, draw wide collector avenues (bold lines). Within each superblock, lots are arranged in rows. The central area must have a prominent mixed-use or leisure centrality hub clearly visible and distinctly colored.`
      : `Group lots into quadras/superblocks of 8-12 lots. Each quadra is clearly delimited by roads on all sides.`;

    const scaleNote = `CRITICAL SCALE RULE: The full terrain is ${totalHa} hectares wide in the image. Each individual lot is only ${lotSize}m² (${lotSide}m × ${lotSide}m). This means ONE lot is a TINY fraction of the total area. Total ${lotCount} lots must ALL fit inside the terrain boundary — each lot appears as a SMALL rectangle. Roads are thin lines between lots. The terrain boundary must be completely filled with lots, roads, and green areas — NO empty or white areas inside the boundary.`;

    const imagePrompt = aerialImage
      ? `You are given an aerial photo of a terrain. Draw a precise urban masterplan overlay directly on this photo, covering the ENTIRE terrain area from boundary to boundary — leave NO blank spaces inside. ${scaleNote} ${superblockNote} Style: ${styleLabels[project.design_style] || "modern"} ${typeLabels[project.enterprise_type] || "residential"} development. Draw: semi-transparent colored lot fills (light beige/cream), clearly defined road network (gray lines), green areas (light green), leisure cluster (teal/blue), gatehouse at main entrance. Roads between quadras are bold/thick (collector). Roads inside quadras are thinner (local). Add north arrow, scale bar, and simple color legend. Keep aerial photo visible underneath as texture. Professional architectural site plan quality.`
      : `Top-down professional urban masterplan for a ${typeLabels[project.enterprise_type] || "residential development"} (${styleLabels[project.design_style] || "modern"} style), ${totalHa} hectares. ${scaleNote} ${superblockNote} Fill the ENTIRE plot boundary with content — no empty zones. Color scheme: lots in light cream/beige, collector roads in medium gray (bold), local roads in light gray (thin), green/APP areas in soft green, leisure in teal, institutional in light blue, gatehouse marked at entrance. Add north arrow, scale bar (e.g. "0 — 100m"), and legend. Clean high-resolution architectural top-down rendering. ${project.concept_description || ""}`;

    const finalImagePrompt = customImagePrompt.trim() ? customImagePrompt.trim() : imagePrompt;

    const imageResult = await base44.integrations.Core.GenerateImage({
      prompt: finalImagePrompt,
      existing_image_urls: aerialImage ? [aerialImage] : undefined,
    });
    setImage(imageResult.url);
    setGeneratingImage(false);

    // Save to project
    const updateData = {
      masterplan_description: result.masterplan_description,
      masterplan_image: imageResult.url,
      area_report: result.area_report,
      status: "masterplan_gerado",
    };
    
    await base44.entities.Project.update(project.id, updateData);
    if (onGenerated) onGenerated({ ...project, ...updateData });
  };

  const hasContent = description || image;

  // Compact mode: just show a regenerate button
  if (regenerateOnly) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Masterplan gerado</p>
            <p className="text-xs text-muted-foreground mt-0.5">Gere uma nova versão com base nos mesmos dados.</p>
          </div>
          <Button variant="outline" size="sm" onClick={generateMasterplan} className="gap-2" disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {generating ? "Gerando..." : "Regenerar"}
          </Button>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Prompt customizado para imagem (opcional)</p>
          <Textarea
            placeholder="Cole aqui um prompt específico para o DALL-E gerar a imagem com mais precisão. Deixe em branco para usar o prompt automático."
            value={customImagePrompt}
            onChange={(e) => setCustomImagePrompt(e.target.value)}
            className="text-xs min-h-[90px] resize-y font-mono"
          />
          {customImagePrompt.trim() && (
            <p className="text-xs text-amber-600">⚠ Prompt customizado ativo — o prompt automático será ignorado.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!hasContent && generating && (
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
          <h3 className="text-lg font-semibold mb-1">Gerando Masterplan...</h3>
          <p className="text-sm text-muted-foreground">Analisando dados e criando proposta urbanística.</p>
        </div>
      )}

      {!hasContent && !generating && (
        <div className="space-y-6 py-8">
          <div className="text-center space-y-4">
            <Sparkles className="h-12 w-12 mx-auto text-primary/40" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Nenhum masterplan gerado</h3>
              <p className="text-sm text-muted-foreground">Clique abaixo para gerar o masterplan com IA.</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Prompt customizado para imagem (opcional)</p>
            <Textarea
              placeholder="Cole aqui um prompt específico para o DALL-E gerar a imagem com mais precisão. Deixe em branco para usar o prompt automático."
              value={customImagePrompt}
              onChange={(e) => setCustomImagePrompt(e.target.value)}
              className="text-xs min-h-[90px] resize-y font-mono"
            />
            {customImagePrompt.trim() && (
              <p className="text-xs text-amber-600">⚠ Prompt customizado ativo — o prompt automático será ignorado.</p>
            )}
          </div>
          <div className="flex justify-center">
            <Button onClick={generateMasterplan} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Gerar Masterplan
            </Button>
          </div>
        </div>
      )}

      {description && (
        <div>
          {image ? (
            <div className="rounded-xl overflow-hidden border border-border mb-6">
              <img src={image} alt="Masterplan" className="w-full" />
            </div>
          ) : generatingImage ? (
            <div className="h-64 rounded-xl border border-border bg-muted flex items-center justify-center mb-6">
              <div className="text-center">
                <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Gerando imagem conceitual...</p>
              </div>
            </div>
          ) : null}

          <Button variant="outline" size="sm" onClick={generateMasterplan} className="gap-2 mb-4" disabled={generating}>
            <RefreshCw className="h-4 w-4" />
            Regenerar
          </Button>
        </div>
      )}
    </div>
  );
}