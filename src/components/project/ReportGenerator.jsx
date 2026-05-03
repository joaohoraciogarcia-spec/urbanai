import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, ChevronDown } from "lucide-react";
import { jsPDF } from "jspdf";

const ENTERPRISE_LABELS = {
  condominio_rural: "Condomínio Rural",
  condominio_urbano_fechado: "Condomínio Urbano Fechado",
  loteamento_aberto: "Loteamento Aberto",
  bairro_planejado: "Bairro Planejado",
  predio_vertical: "Prédio Vertical",
  conjunto_habitacional: "Conjunto Habitacional",
  mixed_use: "Mixed Use",
  masterplan_hibrido: "Masterplan Híbrido",
};

function addSection(doc, title, y, pageH = 280) {
  if (y > pageH - 20) { doc.addPage(); y = 20; }
  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.setTextColor(30, 64, 175);
  doc.text(title, 20, y);
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.5);
  doc.line(20, y + 2, 190, y + 2);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "normal");
  return y + 10;
}

function addText(doc, text, y, fontSize = 10, pageH = 280) {
  if (y > pageH) { doc.addPage(); y = 20; }
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(String(text || "-"), 170);
  lines.forEach((line) => {
    if (y > pageH) { doc.addPage(); y = 20; }
    doc.text(line, 20, y);
    y += fontSize * 0.6;
  });
  return y + 4;
}

function addKV(doc, label, value, y, pageH = 280) {
  if (y > pageH) { doc.addPage(); y = 20; }
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text(label + ":", 20, y);
  doc.setFont(undefined, "normal");
  doc.text(String(value || "-"), 70, y);
  return y + 6;
}

export default function ReportGenerator({ project }) {
  const [open, setOpen] = useState(false);

  const generateReport = (mode) => {
    setOpen(false);
    const doc = new jsPDF();
    const fmt = (v) => v ? `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "-";
    const fmtPct = (v) => v != null ? `${Number(v).toFixed(1)}%` : "-";

    // CAPA
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 60, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, "bold");
    doc.text(project.name || "Projeto", 20, 30);
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text(ENTERPRISE_LABELS[project.enterprise_type] || project.enterprise_type || "", 20, 42);
    doc.text(project.location || "", 20, 52);
    doc.setTextColor(0, 0, 0);

    let y = 75;

    // BRIEFING
    y = addSection(doc, "1. Briefing do Projeto", y);
    y = addKV(doc, "Localização", project.location, y);
    y = addKV(doc, "Área Total", project.total_area ? `${project.total_area.toLocaleString()} m²` : "-", y);
    y = addKV(doc, "Tipo", ENTERPRISE_LABELS[project.enterprise_type] || project.enterprise_type, y);
    y = addKV(doc, "Padrão", project.product_standard, y);
    y = addKV(doc, "Público-alvo", project.target_audience, y);
    y = addKV(doc, "Estilo", project.design_style, y);
    y = addKV(doc, "Lote Médio", project.lot_size ? `${project.lot_size} m²` : "-", y);
    y = addKV(doc, "Unidades", project.lot_count || "-", y);
    if (project.concept_description) {
      y += 4;
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.text("Conceito:", 20, y); y += 5;
      y = addText(doc, project.concept_description, y, 9);
    }
    y += 6;

    if (mode === "completo") {
      // MASTERPLAN
      if (project.masterplan_description) {
        y = addSection(doc, "2. Proposta Urbanística", y);
        y = addText(doc, project.masterplan_description.replace(/[#*`]/g, ""), y, 9);
        y += 4;
      }

      // RELATÓRIO DE ÁREAS
      if (project.area_report) {
        y = addSection(doc, "3. Relatório de Áreas", y);
        const ar = project.area_report;
        y = addKV(doc, "Área Total", ar.total_area ? `${Number(ar.total_area).toLocaleString()} m²` : "-", y);
        y = addKV(doc, "Área Vendável", ar.sellable_area ? `${Number(ar.sellable_area).toLocaleString()} m²` : "-", y);
        y = addKV(doc, "Área Verde", ar.green_area ? `${Number(ar.green_area).toLocaleString()} m²` : "-", y);
        y = addKV(doc, "Sistema Viário", ar.road_area ? `${Number(ar.road_area).toLocaleString()} m²` : "-", y);
        y = addKV(doc, "Lazer", ar.leisure_area ? `${Number(ar.leisure_area).toLocaleString()} m²` : "-", y);
        y = addKV(doc, "Total de Lotes", ar.total_lots || "-", y);
        y += 4;
      }
    }

    // VIABILIDADE
    if (project.viability_study) {
      const vs = project.viability_study;
      const sectionNum = mode === "completo" ? "4" : "2";
      y = addSection(doc, `${sectionNum}. Estudo de Viabilidade`, y);
      y = addKV(doc, "VGV", fmt(vs.vgv), y);
      y = addKV(doc, "Custo Total", fmt(vs.total_cost), y);
      y = addKV(doc, "Margem Bruta", fmtPct(vs.gross_margin_pct), y);
      y = addKV(doc, "Margem Líquida", fmtPct(vs.net_margin_pct), y);
      y = addKV(doc, "ROI", fmtPct(vs.roi_pct), y);
      y = addKV(doc, "Payback", vs.payback_months ? `${vs.payback_months} meses` : "-", y);
      if (vs.executive_summary) {
        y += 4;
        y = addText(doc, vs.executive_summary, y, 9);
      }
      if (mode === "completo" && vs.recommendation) {
        y += 2;
        doc.setFontSize(9);
        doc.setFont(undefined, "bold");
        doc.text("Recomendação:", 20, y); y += 5;
        doc.setFont(undefined, "normal");
        y = addText(doc, vs.recommendation, y, 9);
      }
      y += 4;
    }

    // MERCADO
    if (project.market_analysis) {
      const ma = project.market_analysis;
      const sectionNum = mode === "completo" ? "5" : "3";
      y = addSection(doc, `${sectionNum}. Análise de Mercado`, y);
      y = addKV(doc, "Score de Demanda", ma.demand_score ? `${ma.demand_score}/10` : "-", y);
      y = addKV(doc, "Concorrência", ma.competition_score ? `${ma.competition_score}/10` : "-", y);
      y = addKV(doc, "VSO Mensal", ma.vso_monthly ? `${ma.vso_monthly?.toFixed(1)}%/mês` : "-", y);
      y = addKV(doc, "Oportunidade", ma.opportunity_level || "-", y);
      if (ma.executive_summary) {
        y += 4;
        y = addText(doc, ma.executive_summary, y, 9);
      }
      if (mode === "completo" && ma.positioning_recommendation) {
        y += 2;
        doc.setFontSize(9);
        doc.setFont(undefined, "bold");
        doc.text("Posicionamento:", 20, y); y += 5;
        doc.setFont(undefined, "normal");
        y = addText(doc, ma.positioning_recommendation, y, 9);
      }
      y += 4;
    }

    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`${project.name || "Relatório"} · Página ${i} de ${pageCount}`, 20, 292);
      doc.text(new Date().toLocaleDateString("pt-BR"), 180, 292, { align: "right" });
    }

    doc.save(`${project.name || "relatorio"}-${mode}.pdf`);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setOpen(!open)}
      >
        <FileDown className="h-4 w-4" />
        Gerar Relatório
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1 z-20 bg-card border border-border rounded-xl shadow-xl overflow-hidden w-56">
            <div className="p-2 space-y-1">
              <button
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                onClick={() => generateReport("resumido")}
              >
                <p className="font-medium">📄 Resumido</p>
                <p className="text-xs text-muted-foreground mt-0.5">Resumo de cada seção</p>
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                onClick={() => generateReport("completo")}
              >
                <p className="font-medium">📋 Completo</p>
                <p className="text-xs text-muted-foreground mt-0.5">Briefing, masterplan, mercado, viabilidade</p>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}