import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";

const fmt = (v) => v != null && v !== "" ? `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "-";
const fmtPct = (v) => v != null && v !== "" ? `${Number(v).toFixed(1)}%` : "-";
const fmtN = (v, suffix = "") => v != null && v !== "" ? `${Number(v).toLocaleString("pt-BR")}${suffix}` : "-";

const stdLabels = { economico: "Econômico", medio: "Médio", medio_alto: "Médio-Alto", alto_padrao: "Alto Padrão", luxo: "Luxo" };
const typeLabels = {
  condominio_rural: "Condomínio Rural", condominio_urbano_fechado: "Condomínio Urbano Fechado",
  loteamento_aberto: "Loteamento Aberto", bairro_planejado: "Bairro Planejado",
  predio_vertical: "Prédio Vertical", mixed_use: "Mixed Use",
  condominio_casas: "Condomínio de Casas", resort_residencial: "Resort Residencial",
  conjunto_habitacional: "Conjunto Habitacional", masterplan_hibrido: "Masterplan Híbrido",
  empreendimento_comercial: "Empreendimento Comercial",
};

// ─────────────────────────────────────────────
// Layout helpers
// ─────────────────────────────────────────────

function pageHeader(doc, sectionTitle, page) {
  doc.setFillColor(28, 54, 140);
  doc.rect(0, 0, 210, 13, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(sectionTitle, 14, 9);
  doc.setFont("helvetica", "normal");
  doc.text(`Página ${page}`, 196, 9, { align: "right" });
  doc.setTextColor(30, 30, 30);
}

function pageFooter(doc, projectName) {
  doc.setFillColor(247, 249, 252);
  doc.rect(0, 283, 210, 14, "F");
  doc.setDrawColor(210, 218, 230);
  doc.line(14, 283, 196, 283);
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 150);
  doc.text(`${projectName} — Relatório Técnico Confidencial`, 14, 289);
  doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, 196, 289, { align: "right" });
  doc.setTextColor(30, 30, 30);
}

function sectionBox(doc, num, title, y) {
  doc.setFillColor(237, 242, 255);
  doc.roundedRect(14, y - 5, 182, 10, 2, 2, "F");
  doc.setDrawColor(180, 200, 240);
  doc.roundedRect(14, y - 5, 182, 10, 2, 2, "S");
  // Left accent
  doc.setFillColor(28, 54, 140);
  doc.rect(14, y - 5, 3, 10, "F");
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(28, 54, 140);
  doc.text(`${num}. ${title}`, 21, y + 1.5);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "normal");
  return y + 13;
}

function kpiCard(doc, x, y, w, h, label, value, bgRGB) {
  doc.setFillColor(...bgRGB);
  doc.roundedRect(x, y, w, h, 3, 3, "F");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90, 90, 110);
  doc.text(label, x + w / 2, y + 7, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 40);
  const lines = doc.splitTextToSize(value, w - 4);
  doc.text(lines[0] || value, x + w / 2, y + 16, { align: "center" });
  doc.setFont("helvetica", "normal");
}

function textBlock(doc, text, x, y, maxW, fontSize = 8.5, color = [60, 60, 80]) {
  if (!text) return y;
  doc.setFontSize(fontSize);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(String(text), maxW);
  lines.forEach((l) => { doc.text(l, x, y); y += fontSize * 0.56; });
  doc.setTextColor(30, 30, 30);
  return y + 3;
}

function labelValue(doc, label, value, x, y) {
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 100);
  doc.text(`${label}:`, x, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  doc.text(String(value || "-"), x + 45, y);
  return y + 6;
}

function checkPage(doc, y, threshold, header, footerName, page) {
  if (y > threshold) {
    doc.addPage();
    page++;
    pageHeader(doc, header, page);
    pageFooter(doc, footerName);
    y = 22;
  }
  return { y, page };
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function ReportPDFExport({ project }) {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const viability = project.viability_study || {};
    const market = project.market_analysis || {};
    const vp = project.viability_params || {};
    const ar = project.area_report || {};
    const projectName = project.name || "Projeto";
    let page = 1;

    // ═══════════════════════════════
    // CAPA — idêntica ao modelo
    // ═══════════════════════════════
    doc.setFillColor(28, 54, 140);
    doc.rect(0, 0, 210, 297, "F");

    // Faixa âmbar + azul mais escuro
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 220, 210, 5, "F");
    doc.setFillColor(20, 40, 110);
    doc.rect(0, 225, 210, 72, "F");

    // Nome do projeto
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(projectName, 180);
    doc.text(titleLines, 105, 115, { align: "center" });

    // Subtítulo
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(190, 210, 255);
    doc.text("Relatório Técnico de Viabilidade e Mercado", 105, 135, { align: "center" });

    // Metadados (como no PDF exemplo)
    const metas = [
      project.location && `📍  ${project.location}`,
      project.enterprise_type && `🏘  ${typeLabels[project.enterprise_type] || project.enterprise_type}`,
      project.product_standard && `⭐  ${stdLabels[project.product_standard] || project.product_standard}`,
      project.total_area && `📐  ${Number(project.total_area).toLocaleString("pt-BR")} m²`,
    ].filter(Boolean);

    doc.setFontSize(9.5);
    let my = 160;
    metas.forEach((m) => {
      doc.setTextColor(210, 225, 255);
      doc.text(m, 105, my, { align: "center" });
      my += 10;
    });

    // Data e CONFIDENCIAL
    doc.setFontSize(8);
    doc.setTextColor(160, 180, 230);
    doc.text(`Emitido em ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`, 105, 244, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(245, 158, 11);
    doc.text("CONFIDENCIAL", 105, 254, { align: "center" });

    // ═══════════════════════════════
    // PÁG 2 — BRIEFING DO TERRENO
    // ═══════════════════════════════
    doc.addPage(); page++;
    pageHeader(doc, "Briefing do Projeto", page);
    pageFooter(doc, projectName);
    let y = 22;

    y = sectionBox(doc, "1", "Dados do Terreno e Empreendimento", y);
    y = labelValue(doc, "Localização", project.location, 16, y);
    y = labelValue(doc, "Área Total", project.total_area ? `${Number(project.total_area).toLocaleString("pt-BR")} m²` : "-", 16, y);
    y = labelValue(doc, "Tipo", typeLabels[project.enterprise_type] || project.enterprise_type, 16, y);
    y = labelValue(doc, "Padrão", stdLabels[project.product_standard] || project.product_standard, 16, y);
    y = labelValue(doc, "Público-alvo", project.target_audience, 16, y);
    y = labelValue(doc, "Estilo", project.design_style, 16, y);
    y = labelValue(doc, "Topografia", project.predominant_topography, 16, y);
    y = labelValue(doc, "APP (%)", project.app_percentage ? `${project.app_percentage}%` : "-", 16, y);
    y += 4;

    y = sectionBox(doc, "2", "Parâmetros de Parcelamento", y);
    y = labelValue(doc, "Lote Médio", project.lot_size ? `${project.lot_size} m²` : "-", 16, y);
    y = labelValue(doc, "Unidades Estimadas", project.lot_count || ar.total_lots || "-", 16, y);
    y = labelValue(doc, "Frente Mínima", project.min_front_width ? `${project.min_front_width} m` : "-", 16, y);
    y = labelValue(doc, "Profundidade Média", project.avg_depth ? `${project.avg_depth} m` : "-", 16, y);
    y = labelValue(doc, "Recuos", project.setbacks || vp.setbacks || "-", 16, y);
    y += 4;

    if (ar.total_area || ar.sellable_area) {
      y = sectionBox(doc, "3", "Relatório de Áreas", y);
      const areaRows = [
        ["Área Total", ar.total_area ? `${Number(ar.total_area).toLocaleString("pt-BR")} m²` : "-"],
        ["Área Vendável", ar.sellable_area ? `${Number(ar.sellable_area).toLocaleString("pt-BR")} m²` : "-"],
        ["Área Verde / APP", ar.green_area ? `${Number(ar.green_area).toLocaleString("pt-BR")} m²` : "-"],
        ["Sistema Viário", ar.road_area ? `${Number(ar.road_area).toLocaleString("pt-BR")} m²` : "-"],
        ["Lazer e Equipamentos", ar.leisure_area ? `${Number(ar.leisure_area).toLocaleString("pt-BR")} m²` : "-"],
        ["Área Institucional", ar.institutional_area ? `${Number(ar.institutional_area).toLocaleString("pt-BR")} m²` : "-"],
        ["Total de Lotes", ar.total_lots || "-"],
        ["Lote Médio", ar.avg_lot_size ? `${Number(ar.avg_lot_size).toFixed(0)} m²` : "-"],
        ["Densidade", ar.density ? `${Number(ar.density).toFixed(2)} lotes/ha` : "-"],
      ];
      areaRows.forEach(([l, v], i) => {
        doc.setFillColor(i % 2 === 0 ? 247 : 255, 249, 252);
        doc.rect(14, y, 182, 7, "F");
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 100);
        doc.text(l, 18, y + 5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 30, 30);
        doc.text(v, 100, y + 5);
        y += 7.5;
      });
      y += 5;
    }

    if (project.concept_description) {
      ({ y, page } = checkPage(doc, y, 240, "Briefing do Projeto", projectName, page));
      y = sectionBox(doc, "4", "Conceito do Empreendimento", y);
      y = textBlock(doc, project.concept_description, 16, y, 178);
    }

    // ═══════════════════════════════
    // PÁG — VIABILIDADE FINANCEIRA
    // ═══════════════════════════════
    if (Object.keys(viability).length > 0) {
      doc.addPage(); page++;
      pageHeader(doc, "Estudo de Viabilidade Financeira", page);
      pageFooter(doc, projectName);
      y = 22;

      // Resumo executivo
      if (viability.executive_summary) {
        y = sectionBox(doc, "1", "Resumo Executivo", y);
        doc.setFillColor(239, 246, 255);
        const esLines = doc.splitTextToSize(viability.executive_summary, 174);
        doc.roundedRect(14, y, 182, esLines.length * 4.8 + 8, 3, 3, "F");
        doc.setFontSize(8.5);
        doc.setTextColor(28, 54, 140);
        doc.text(esLines, 18, y + 6);
        y += esLines.length * 4.8 + 14;
        doc.setTextColor(30, 30, 30);
      }

      // KPIs — 6 cards
      y = sectionBox(doc, "2", "Indicadores Financeiros", y);
      const kpis = [
        { label: "VGV Estimado",  value: fmt(viability.vgv),                bg: [209, 250, 229] },
        { label: "Custo Total",   value: fmt(viability.total_cost),          bg: [254, 220, 220] },
        { label: "Margem Bruta",  value: fmtPct(viability.gross_margin_pct), bg: [219, 234, 254] },
        { label: "Margem Líquida",value: fmtPct(viability.net_margin_pct),   bg: [254, 249, 195] },
        { label: "ROI",           value: fmtPct(viability.roi_pct),          bg: [237, 233, 254] },
        { label: "Payback",       value: viability.payback_months ? `${viability.payback_months} meses` : "-", bg: [255, 237, 213] },
      ];
      const kW = 27.5, kH = 23, kG = 3.5;
      kpis.forEach((k, i) => kpiCard(doc, 14 + i * (kW + kG), y, kW, kH, k.label, k.value, k.bg));
      y += kH + 8;

      // VPL e TIR em destaque (Lotelytics-style)
      const highlight = [
        { label: "VPL do Projeto", value: fmt(viability.vpl || viability.npv), bg: [209, 250, 229] },
        { label: "TIR (a.a.)",     value: fmtPct(viability.tir_pct || viability.irr_pct), bg: [219, 234, 254] },
        { label: "Pico de Exposição", value: fmt(viability.peak_exposure), bg: [254, 220, 220] },
        { label: "Break-Even",     value: viability.breakeven_lots ? `${viability.breakeven_lots} lotes` : "-", bg: [254, 249, 195] },
      ];
      ({ y, page } = checkPage(doc, y, 240, "Estudo de Viabilidade Financeira", projectName, page));
      y = sectionBox(doc, "3", "Indicadores Avançados (VPL / TIR)", y);
      const hW = 41, hH = 23, hG = 4;
      highlight.forEach((h, i) => kpiCard(doc, 14 + i * (hW + hG), y, hW, hH, h.label, h.value, h.bg));
      y += hH + 8;

      // Lotes validados
      if (viability.validated_lot_count) {
        doc.setFillColor(219, 234, 254);
        doc.roundedRect(14, y, 182, 13, 3, 3, "F");
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(28, 54, 140);
        doc.text(`✓  Lotes validados pela IA: ${viability.validated_lot_count}`, 20, y + 8.5);
        doc.setFont("helvetica", "normal");
        y += 18;
        doc.setTextColor(30, 30, 30);
      }

      // Estrutura de Custos
      if (viability.cost_breakdown?.length > 0) {
        ({ y, page } = checkPage(doc, y, 220, "Estudo de Viabilidade Financeira", projectName, page));
        y = sectionBox(doc, "4", "Estrutura de Custos", y);
        viability.cost_breakdown.forEach((c, i) => {
          ({ y, page } = checkPage(doc, y, 265, "Estudo de Viabilidade Financeira", projectName, page));
          doc.setFillColor(i % 2 === 0 ? 247 : 255, 249, 252);
          doc.rect(14, y, 182, 8, "F");
          doc.setFontSize(7.5);
          doc.setTextColor(60, 60, 80);
          doc.text(c.label, 18, y + 5.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 30, 30);
          doc.text(fmt(c.value_brl), 140, y + 5.5, { align: "right" });
          doc.text(`${(c.pct || 0).toFixed(0)}%`, 194, y + 5.5, { align: "right" });
          doc.setFont("helvetica", "normal");
          // mini bar
          doc.setFillColor(28, 54, 140, 0.4);
          doc.setFillColor(180, 200, 240);
          doc.rect(140, y + 6.5, Math.min(c.pct || 0, 100) * 0.5, 1.5, "F");
          y += 8.5;
        });
        y += 5;
      }

      // 3 cenários
      if (viability.scenarios?.length > 0) {
        ({ y, page } = checkPage(doc, y, 220, "Estudo de Viabilidade Financeira", projectName, page));
        y = sectionBox(doc, "5", "Análise de Cenários (Conservador / Ideal / Agressivo)", y);
        const scColors = [[254, 220, 220], [209, 250, 229], [219, 234, 254]];
        const scLabels = ["Conservador", "Ideal", "Agressivo"];
        const sW = 56, sH = 38, sGap = 5;
        viability.scenarios.forEach((sc, i) => {
          const sx = 14 + i * (sW + sGap);
          doc.setFillColor(...scColors[i]);
          doc.roundedRect(sx, y, sW, sH, 3, 3, "F");
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(40, 40, 60);
          doc.text(sc.label || scLabels[i] || `Cenário ${i + 1}`, sx + sW / 2, y + 8, { align: "center" });
          doc.setFont("helvetica", "normal");
          doc.setFontSize(6.8);
          doc.setTextColor(60, 60, 80);
          const rows = [
            ["VGV", fmt(sc.vgv)],
            ["TIR", fmtPct(sc.tir_pct || sc.irr_pct)],
            ["Margem", fmtPct(sc.net_margin_pct)],
            ["Payback", sc.payback_months ? `${sc.payback_months} m` : "-"],
          ];
          let ry = y + 14;
          rows.forEach(([l, v]) => {
            doc.setFont("helvetica", "bold");
            doc.text(l + ":", sx + 4, ry);
            doc.setFont("helvetica", "normal");
            doc.text(v, sx + sW - 4, ry, { align: "right" });
            ry += 5.5;
          });
        });
        y += sH + 10;
      }

      // Fases de receita
      if (viability.revenue_phases?.length > 0) {
        ({ y, page } = checkPage(doc, y, 220, "Estudo de Viabilidade Financeira", projectName, page));
        y = sectionBox(doc, "6", "Fases de Receita", y);
        viability.revenue_phases.forEach((ph) => {
          ({ y, page } = checkPage(doc, y, 265, "Estudo de Viabilidade Financeira", projectName, page));
          doc.setFillColor(209, 250, 229);
          doc.circle(18, y + 3.5, 2.5, "F");
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 30, 30);
          doc.text(ph.phase, 24, y + 4.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 120, 140);
          doc.text(`${ph.pct_of_vgv?.toFixed(0) || 0}% do VGV`, 190, y + 4.5, { align: "right" });
          if (ph.description) {
            doc.setFontSize(7);
            const ls = doc.splitTextToSize(ph.description, 155);
            doc.setTextColor(80, 80, 100);
            doc.text(ls, 24, y + 9.5);
            y += 5 + ls.length * 4.5;
          } else { y += 9; }
          doc.setTextColor(30, 30, 30);
        });
        y += 5;
      }

      // Riscos e Oportunidades
      ({ y, page } = checkPage(doc, y, 210, "Estudo de Viabilidade Financeira", projectName, page));
      y = sectionBox(doc, "7", "Riscos e Oportunidades", y);
      const startRO = y;
      if (viability.risks?.length > 0) {
        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(180, 50, 50);
        doc.text("⚠  Riscos", 16, y);
        doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 80);
        let ry2 = y + 6;
        viability.risks.forEach((r) => {
          const ls = doc.splitTextToSize(`• ${r}`, 86);
          doc.setFontSize(7.5); doc.text(ls, 16, ry2); ry2 += ls.length * 4.5;
        });
      }
      if (viability.opportunities?.length > 0) {
        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(20, 120, 70);
        doc.text("✓  Oportunidades", 110, startRO);
        doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 80);
        let oy2 = startRO + 6;
        viability.opportunities.forEach((o) => {
          const ls = doc.splitTextToSize(`• ${o}`, 86);
          doc.setFontSize(7.5); doc.text(ls, 110, oy2); oy2 += ls.length * 4.5;
        });
      }
      y = startRO + Math.max((viability.risks?.length || 0), (viability.opportunities?.length || 0)) * 10 + 10;
      doc.setTextColor(30, 30, 30);

      // Recomendação final
      if (viability.recommendation) {
        ({ y, page } = checkPage(doc, y, 250, "Estudo de Viabilidade Financeira", projectName, page));
        const recLines = doc.splitTextToSize(`✓  ${viability.recommendation}`, 174);
        doc.setFillColor(209, 250, 229);
        doc.roundedRect(14, y, 182, recLines.length * 5 + 12, 3, 3, "F");
        doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(20, 100, 60);
        doc.text("Recomendação Final", 18, y + 8);
        doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(30, 60, 40);
        doc.text(recLines, 18, y + 14);
        doc.setTextColor(30, 30, 30);
      }
    }

    // ═══════════════════════════════
    // PÁG — ESTUDO DE MERCADO
    // ═══════════════════════════════
    if (Object.keys(market).length > 0) {
      doc.addPage(); page++;
      pageHeader(doc, "Estudo de Mercado Imobiliário", page);
      pageFooter(doc, projectName);
      y = 22;

      if (market.executive_summary) {
        y = sectionBox(doc, "1", "Resumo Executivo de Mercado", y);
        doc.setFillColor(239, 246, 255);
        const esL = doc.splitTextToSize(market.executive_summary, 174);
        doc.roundedRect(14, y, 182, esL.length * 4.8 + 8, 3, 3, "F");
        doc.setFontSize(8.5); doc.setTextColor(28, 54, 140);
        doc.text(esL, 18, y + 6);
        y += esL.length * 4.8 + 14;
        doc.setTextColor(30, 30, 30);
      }

      // KPIs mercado
      y = sectionBox(doc, "2", "Indicadores de Mercado", y);
      const mkpis = [
        { label: "Score de Demanda", value: `${(market.demand_score || 0).toFixed(1)}/10`, bg: [209, 250, 229] },
        { label: "Concorrência",     value: `${(market.competition_score || 0).toFixed(1)}/10`, bg: [254, 220, 220] },
        { label: "VSO Estimado",     value: `${(market.vso_monthly || 0).toFixed(1)}%/mês`, bg: [219, 234, 254] },
        { label: "Oportunidade",     value: (market.opportunity_level || "-").replace(/_/g, " ").toUpperCase(), bg: [209, 250, 229] },
      ];
      const mW = 40.5, mH = 23, mG = 5;
      mkpis.forEach((k, i) => kpiCard(doc, 14 + i * (mW + mG), y, mW, mH, k.label, k.value, k.bg));
      y += mH + 10;

      // Preços de mercado
      if (market.avg_price_per_m2 || market.min_price || market.max_price) {
        ({ y, page } = checkPage(doc, y, 240, "Estudo de Mercado Imobiliário", projectName, page));
        y = sectionBox(doc, "3", "Preços Praticados na Região", y);
        const priceRows = [
          ["Preço Médio (m²)", market.avg_price_per_m2 ? fmt(market.avg_price_per_m2) + "/m²" : "-"],
          ["Ticket Mínimo", market.min_price ? fmt(market.min_price) : "-"],
          ["Ticket Máximo", market.max_price ? fmt(market.max_price) : "-"],
          ["Faixa de VGV/lote", market.avg_lot_price ? fmt(market.avg_lot_price) : "-"],
        ];
        priceRows.forEach(([l, v], i) => {
          doc.setFillColor(i % 2 === 0 ? 247 : 255, 249, 252);
          doc.rect(14, y, 182, 7, "F");
          doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(80, 80, 100);
          doc.text(l, 18, y + 5);
          doc.setFont("helvetica", "normal"); doc.setTextColor(28, 54, 140);
          doc.text(v, 194, y + 5, { align: "right" });
          y += 7.5;
        });
        y += 5;
      }

      // Perfil de demanda
      if (market.demand_profile || market.buyer_profile) {
        ({ y, page } = checkPage(doc, y, 230, "Estudo de Mercado Imobiliário", projectName, page));
        y = sectionBox(doc, "4", "Perfil de Demanda e Comprador", y);
        if (market.demand_profile) {
          doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(60, 60, 80);
          doc.text("Perfil de Demanda", 16, y); doc.setFont("helvetica", "normal");
          y = textBlock(doc, market.demand_profile, 16, y + 5, 178) + 3;
        }
        if (market.buyer_profile) {
          doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(60, 60, 80);
          doc.text("Perfil do Comprador", 16, y); doc.setFont("helvetica", "normal");
          y = textBlock(doc, market.buyer_profile, 16, y + 5, 178) + 3;
        }
        y += 4;
      }

      // Tendências
      if (market.market_trends?.length > 0) {
        ({ y, page } = checkPage(doc, y, 225, "Estudo de Mercado Imobiliário", projectName, page));
        y = sectionBox(doc, "5", "Tendências do Mercado", y);
        market.market_trends.forEach((t, i) => {
          ({ y, page } = checkPage(doc, y, 265, "Estudo de Mercado Imobiliário", projectName, page));
          doc.setFillColor(i % 2 === 0 ? 247 : 255, 249, 252);
          doc.rect(14, y, 182, 8, "F");
          doc.setFontSize(7.5); doc.setTextColor(28, 54, 140);
          doc.text(`${i + 1}.`, 18, y + 5.5);
          doc.setTextColor(60, 60, 80);
          const ls = doc.splitTextToSize(t, 168);
          doc.text(ls[0], 24, y + 5.5); y += 9;
        });
        y += 4;
      }

      // Concorrentes
      if (market.competitors?.length > 0) {
        ({ y, page } = checkPage(doc, y, 210, "Estudo de Mercado Imobiliário", projectName, page));
        y = sectionBox(doc, "6", "Concorrentes Típicos da Região", y);
        market.competitors.forEach((c) => {
          ({ y, page } = checkPage(doc, y, 265, "Estudo de Mercado Imobiliário", projectName, page));
          doc.setFillColor(247, 249, 252);
          doc.roundedRect(14, y, 182, 16, 2, 2, "F");
          doc.setDrawColor(210, 218, 230);
          doc.roundedRect(14, y, 182, 16, 2, 2, "S");
          doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 30, 30);
          doc.text(c.name || "-", 18, y + 7);
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(100, 100, 120);
          if (c.positioning) doc.text(doc.splitTextToSize(c.positioning, 120)[0], 18, y + 12);
          if (c.price_range) {
            doc.setTextColor(28, 54, 140); doc.setFont("helvetica", "bold");
            doc.text(c.price_range, 192, y + 9, { align: "right" });
            doc.setFont("helvetica", "normal");
          }
          y += 19; doc.setTextColor(30, 30, 30);
        });
        y += 4;
      }

      // Canais de venda
      if (market.sales_channels?.length > 0) {
        ({ y, page } = checkPage(doc, y, 250, "Estudo de Mercado Imobiliário", projectName, page));
        y = sectionBox(doc, "7", "Canais de Venda Recomendados", y);
        let cx = 16;
        market.sales_channels.forEach((ch) => {
          const w = doc.getTextWidth(ch) + 10;
          if (cx + w > 192) { cx = 16; y += 11; }
          doc.setFillColor(219, 234, 254); doc.roundedRect(cx, y, w, 7.5, 2, 2, "F");
          doc.setFontSize(7.5); doc.setTextColor(28, 54, 140);
          doc.text(ch, cx + 5, y + 5.2); cx += w + 4;
        });
        y += 14; doc.setTextColor(30, 30, 30);
      }

      // Riscos e Oportunidades de Mercado
      ({ y, page } = checkPage(doc, y, 215, "Estudo de Mercado Imobiliário", projectName, page));
      y = sectionBox(doc, "8", "Riscos e Oportunidades de Mercado", y);
      const mStartRO = y;
      if (market.risks?.length > 0) {
        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(180, 50, 50);
        doc.text("⚠  Riscos", 16, y);
        doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 80);
        let ry3 = y + 6;
        market.risks.forEach((r) => {
          const ls = doc.splitTextToSize(`• ${r}`, 86);
          doc.setFontSize(7.5); doc.text(ls, 16, ry3); ry3 += ls.length * 4.5;
        });
      }
      if (market.opportunities?.length > 0) {
        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(20, 120, 70);
        doc.text("✓  Oportunidades", 110, mStartRO);
        doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 80);
        let oy3 = mStartRO + 6;
        market.opportunities.forEach((o) => {
          const ls = doc.splitTextToSize(`• ${o}`, 86);
          doc.setFontSize(7.5); doc.text(ls, 110, oy3); oy3 += ls.length * 4.5;
        });
      }
      y = mStartRO + Math.max((market.risks?.length || 0), (market.opportunities?.length || 0)) * 10 + 10;
      doc.setTextColor(30, 30, 30);

      // Posicionamento
      if (market.positioning_recommendation) {
        ({ y, page } = checkPage(doc, y, 255, "Estudo de Mercado Imobiliário", projectName, page));
        const posLines = doc.splitTextToSize(market.positioning_recommendation, 174);
        doc.setFillColor(209, 250, 229);
        doc.roundedRect(14, y, 182, posLines.length * 5 + 12, 3, 3, "F");
        doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(20, 100, 60);
        doc.text("Posicionamento Recomendado", 18, y + 8);
        doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(30, 60, 40);
        doc.text(posLines, 18, y + 14);
      }
    }

    // ═══════════════════════════════
    // PÁG — MASTERPLAN (se existir)
    // ═══════════════════════════════
    if (project.masterplan_description) {
      doc.addPage(); page++;
      pageHeader(doc, "Proposta Urbanística — Masterplan", page);
      pageFooter(doc, projectName);
      y = 22;
      y = sectionBox(doc, "1", "Descrição da Proposta Urbanística", y);
      y = textBlock(doc, project.masterplan_description.replace(/[#*`]/g, ""), 16, y, 178, 8.5);
    }

    doc.save(`${projectName.replace(/\s+/g, "_")}_Relatorio.pdf`);
    setLoading(false);
  };

  const hasData = project.viability_study || project.market_analysis;

  return (
    <Button
      onClick={generate}
      disabled={loading || !hasData}
      variant="default"
      size="sm"
      className="gap-2"
      title={!hasData ? "Gere a viabilidade ou análise de mercado primeiro" : ""}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
      {loading ? "Gerando PDF..." : "Exportar Relatório PDF"}
    </Button>
  );
}