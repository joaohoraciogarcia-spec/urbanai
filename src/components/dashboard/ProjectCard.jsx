import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

const statusLabels = {
  rascunho: { label: "Rascunho", variant: "secondary" },
  terreno_enviado: { label: "Terreno Enviado", variant: "outline" },
  briefing_completo: { label: "Briefing Completo", variant: "outline" },
  masterplan_gerado: { label: "Masterplan Gerado", variant: "default" },
  em_revisao: { label: "Em Revisão", variant: "outline" },
  finalizado: { label: "Finalizado", variant: "default" },
};

const typeLabels = {
  condominio_rural: "Condomínio Rural",
  condominio_urbano_fechado: "Cond. Urbano Fechado",
  loteamento_aberto: "Loteamento Aberto",
  bairro_planejado: "Bairro Planejado",
  predio_vertical: "Prédio Vertical",
  conjunto_habitacional: "Conjunto Habitacional",
  mixed_use: "Mixed Use",
  condominio_casas: "Condomínio de Casas",
  resort_residencial: "Resort Residencial",
  empreendimento_comercial: "Emp. Comercial",
  masterplan_hibrido: "Masterplan Híbrido",
};

export default function ProjectCard({ project, index }) {
  const status = statusLabels[project.status] || statusLabels.rascunho;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/projeto/${project.id}`}
        className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
      >
        {project.masterplan_image ? (
          <div className="h-44 bg-muted overflow-hidden">
            <img
              src={project.masterplan_image}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="h-44 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                <MapPin className="h-8 w-8 text-primary/40" />
              </div>
              <p className="text-xs text-muted-foreground">Sem masterplan</p>
            </div>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{project.name}</h3>
              {project.enterprise_type && (
                <p className="text-xs text-muted-foreground mt-0.5">{typeLabels[project.enterprise_type] || project.enterprise_type}</p>
              )}
            </div>
            <Badge variant={status.variant} className="text-xs shrink-0">{status.label}</Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {project.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {project.location}
              </span>
            )}
            {project.total_area && (
              <span>{(project.total_area).toLocaleString("pt-BR")} m²</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {moment(project.created_date).format("DD/MM/YYYY")}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}