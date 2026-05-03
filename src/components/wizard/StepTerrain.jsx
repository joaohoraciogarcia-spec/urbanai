import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const terrainFeatures = [
  "APP (Área de Preservação Permanente)",
  "Rio ou Riacho",
  "Cursos d'água",
  "Açudes/Represas",
  "Vegetação nativa",
  "Declividade acentuada",
  "Servidões",
  "Linha de alta tensão",
  "Área alagável",
];

const topographyOptions = [
  { value: "plano", label: "Plano" },
  { value: "suave_ondulado", label: "Suave Ondulado" },
  { value: "ondulado", label: "Ondulado" },
  { value: "forte_ondulado", label: "Forte Ondulado" },
  { value: "montanhoso", label: "Montanhoso" },
];

const slopeOptions = [
  { value: "aclive", label: "Aclive — terreno que sobe" },
  { value: "declive", label: "Declive — terreno que desce" },
  { value: "misto", label: "Misto (aclive e declive)" },
  { value: "sem_inclinacao", label: "Sem inclinação definida" },
];

const appPercentOptions = [5, 6, 7, 8, 9, 10];

export default function StepTerrain({ data, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadingAerial, setUploadingAerial] = useState(false);
  const [uploadingLegal, setUploadingLegal] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const uploadedUrls = [...(data.uploaded_files || [])];
    const fileNames = [...(data.file_names || [])];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      uploadedUrls.push(file_url);
      fileNames.push(file.name);
    }
    onChange({ uploaded_files: uploadedUrls, file_names: fileNames });
    setUploading(false);
  };

  const handleLegalUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingLegal(true);
    const uploadedUrls = [...(data.legal_files || [])];
    const fileNames = [...(data.legal_file_names || [])];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      uploadedUrls.push(file_url);
      fileNames.push(file.name);
    }
    onChange({ legal_files: uploadedUrls, legal_file_names: fileNames });
    setUploadingLegal(false);
  };

  const removeLegalFile = (index) => {
    const urls = [...(data.legal_files || [])];
    const names = [...(data.legal_file_names || [])];
    urls.splice(index, 1);
    names.splice(index, 1);
    onChange({ legal_files: urls, legal_file_names: names });
  };

  const removeFile = (index) => {
    const uploadedUrls = [...(data.uploaded_files || [])];
    const fileNames = [...(data.file_names || [])];
    uploadedUrls.splice(index, 1);
    fileNames.splice(index, 1);
    onChange({ uploaded_files: uploadedUrls, file_names: fileNames });
  };

  const toggleFeature = (feature) => {
    const current = data.terrain_features || [];
    const updated = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    onChange({ terrain_features: updated });
  };

  const handleAerialUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAerial(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange({ aerial_image: file_url });
    setUploadingAerial(false);
  };

  const hasRiver = (data.terrain_features || []).includes("Rio ou Riacho");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-1">Dados do Terreno</h2>
        <p className="text-muted-foreground">Informe os dados básicos e envie os arquivos do terreno.</p>
      </div>

      {/* Aerial / Topographic Image */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Imagem Aérea ou Topográfica</Label>
        <p className="text-xs text-muted-foreground">Foto aérea, imagem de satélite ou planta topográfica. Será usada como base do masterplan.</p>
        {data.aerial_image ? (
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img src={data.aerial_image} alt="Imagem aérea" className="w-full h-56 object-cover" />
            <button
              onClick={() => onChange({ aerial_image: null })}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute bottom-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              Base do masterplan
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all">
            <ImageIcon className={`h-8 w-8 ${uploadingAerial ? "animate-bounce text-primary" : "text-primary/40"}`} />
            <span className="text-sm text-muted-foreground">
              {uploadingAerial ? "Enviando..." : "Enviar foto aérea ou topográfica"}
            </span>
            <span className="text-xs text-muted-foreground">JPG, PNG, TIFF</span>
            <input type="file" accept="image/*" className="hidden" disabled={uploadingAerial} onChange={handleAerialUpload} />
          </label>
        )}
      </div>

      {/* Other Files */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Outros Arquivos do Terreno</Label>
        <p className="text-xs text-muted-foreground">Topografia, matrícula, memorial descritivo, KML, KMZ, etc.</p>
        <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
          <Upload className={`h-8 w-8 ${uploading ? "animate-bounce text-primary" : "text-muted-foreground"}`} />
          <span className="text-sm text-muted-foreground">
            {uploading ? "Enviando..." : "Clique para enviar arquivos"}
          </span>
          <span className="text-xs text-muted-foreground">DWG, DXF, PDF, KML, KMZ, SHP</span>
          <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
        {(data.file_names || []).length > 0 && (
          <div className="space-y-2 mt-3">
            {data.file_names.map((name, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm flex-1 truncate">{name}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFile(i)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Label>Nome do Projeto *</Label>
          <Input
            placeholder="Ex: Condomínio Recanto das Águas"
            value={data.name || ""}
            onChange={(e) => onChange({ name: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Localização</Label>
          <Input
            placeholder="Cidade, Estado"
            value={data.location || ""}
            onChange={(e) => onChange({ location: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Área Total (m²)</Label>
          <Input
            type="number"
            placeholder="Ex: 180000"
            value={data.total_area || ""}
            onChange={(e) => onChange({ total_area: parseFloat(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Perímetro (m)</Label>
          <Input
            type="number"
            placeholder="Ex: 1800"
            value={data.perimeter || ""}
            onChange={(e) => onChange({ perimeter: parseFloat(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Testada Principal (m)</Label>
          <Input
            type="number"
            placeholder="Ex: 250"
            value={data.main_frontage || ""}
            onChange={(e) => onChange({ main_frontage: parseFloat(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Topography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Topografia Predominante</Label>
          <Select value={data.predominant_topography || ""} onValueChange={(v) => onChange({ predominant_topography: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {topographyOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Inclinação do Terreno</Label>
          <Select value={data.slope_direction || ""} onValueChange={(v) => onChange({ slope_direction: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {slopeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">Aclive sobe / Declive desce em relação ao acesso principal.</p>
        </div>
      </div>

      {/* Terrain Features */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Características do Terreno</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {terrainFeatures.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => toggleFeature(feature)}
            >
              <Checkbox
                checked={(data.terrain_features || []).includes(feature)}
                onCheckedChange={() => toggleFeature(feature)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* River warning */}
        {hasRiver && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <span className="text-blue-500 text-base shrink-0">💧</span>
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Atenção — Faixa de APP de cursos d'água:</strong> A partir do eixo do rio/riacho deve ser reservada uma faixa non aedificandi de <strong>30m</strong> (15m para cada margem), conforme Código Florestal (Lei 12.651/2012). Esta área deve ser computada como APP e descontada da área aproveitável.
            </p>
          </div>
        )}
      </div>

      {/* APP Percentage */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-3">
        <div>
          <Label className="text-sm font-semibold text-green-800">% de APP (Área de Preservação Permanente)</Label>
          <p className="text-xs text-green-700 mt-0.5">Conforme regramento municipal e federal, reserva entre 5% e 10% da área total.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {appPercentOptions.map((pct) => (
            <button
              key={pct}
              onClick={() => onChange({ app_percentage: pct })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                data.app_percentage === pct
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-700 border-green-300 hover:border-green-500"
              }`}
            >
              {pct}%
            </button>
          ))}
          <span className="text-xs text-green-700 ml-1">
            {data.total_area && data.app_percentage
              ? `≈ ${((data.total_area * data.app_percentage) / 100).toLocaleString("pt-BR")} m²`
              : ""}
          </span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Orientação Solar</Label>
          <Input
            placeholder="Ex: Norte-Sul"
            value={data.solar_orientation || ""}
            onChange={(e) => onChange({ solar_orientation: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Acessos Existentes</Label>
          <Input
            placeholder="Ex: Rodovia BR-040, Estrada municipal"
            value={data.existing_access || ""}
            onChange={(e) => onChange({ existing_access: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Vistas Relevantes</Label>
          <Textarea
            placeholder="Descreva vistas importantes do terreno..."
            value={data.relevant_views || ""}
            onChange={(e) => onChange({ relevant_views: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Limitações Legais Conhecidas</Label>
          <Textarea
            placeholder="Restrições ambientais, servidões, etc..."
            value={data.legal_limitations || ""}
            onChange={(e) => onChange({ legal_limitations: e.target.value })}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Legal Documents Upload */}
      <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div>
          <Label className="text-sm font-semibold text-amber-800">📄 Legislação Municipal (Plano Diretor / Código de Obras)</Label>
          <p className="text-xs text-amber-700 mt-0.5">
            Envie arquivos PDF ou Word com a legislação local. A IA irá extrair os parâmetros urbanísticos relevantes para o projeto.
          </p>
        </div>
        <label className="flex flex-col items-center gap-2 p-5 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-100/50 transition-all">
          <FileText className={`h-7 w-7 ${uploadingLegal ? "animate-bounce text-amber-600" : "text-amber-400"}`} />
          <span className="text-sm text-amber-700">
            {uploadingLegal ? "Enviando..." : "Enviar legislação municipal"}
          </span>
          <span className="text-xs text-amber-600">PDF, DOCX, DOC, TXT</span>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={handleLegalUpload}
            disabled={uploadingLegal}
          />
        </label>
        {(data.legal_file_names || []).length > 0 && (
          <div className="space-y-2">
            {data.legal_file_names.map((name, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200">
                <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="text-sm flex-1 truncate">{name}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeLegalFile(i)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}