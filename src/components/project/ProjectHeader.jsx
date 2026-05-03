import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
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

export default function ProjectHeader({ project }) {
  const status = statusLabels[project.status] || statusLabels.rascunho;

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-semibold">{project.name}</h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {project.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {project.location}
              </span>
            )}
            {project.total_area > 0 && (
              <span>{(project.total_area).toLocaleString("pt-BR")} m² ({(project.total_area / 10000).toFixed(2)} ha)</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {moment(project.created_date).format("DD/MM/YYYY")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}