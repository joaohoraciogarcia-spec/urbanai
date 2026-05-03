import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plus, FolderOpen, MapPin, Layers, CheckCircle, Zap, TrendingUp, BarChart2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import StatsCard from "../components/dashboard/StatsCard";
import ProjectCard from "../components/dashboard/ProjectCard";

const quickActions = [
  {
    to: "/novo-projeto",
    icon: Zap,
    label: "Novo Masterplan",
    desc: "Gere uma proposta urbanística com IA",
    gradient: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/30",
  },
  {
    to: "/biblioteca",
    icon: FolderOpen,
    label: "Minha Biblioteca",
    desc: "Acesse todos os seus projetos",
    gradient: "from-violet-500 to-violet-600",
    shadow: "shadow-violet-500/30",
  },
  {
    to: "/templates",
    icon: Layers,
    label: "Templates",
    desc: "Use modelos prontos para agilizar",
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/30",
  },
];

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const user = await base44.auth.me();
    const data = await base44.entities.Project.filter({ created_by: user.email }, "-created_date", 50);
    setProjects(data);
    setLoading(false);
  };

  const stats = [
    { icon: FolderOpen, label: "Total de Projetos", value: projects.length, color: "bg-blue-100 text-blue-600", gradient: "from-blue-500 to-blue-600" },
    { icon: Layers, label: "Masterplans Gerados", value: projects.filter((p) => p.status === "masterplan_gerado" || p.status === "finalizado").length, color: "bg-violet-100 text-violet-600", gradient: "from-violet-500 to-violet-600" },
    { icon: MapPin, label: "Área Total", value: `${(projects.reduce((acc, p) => acc + (p.total_area || 0), 0) / 10000).toFixed(1)} ha`, color: "bg-emerald-100 text-emerald-600", gradient: "from-emerald-500 to-emerald-600" },
    { icon: CheckCircle, label: "Finalizados", value: projects.filter((p) => p.status === "finalizado").length, color: "bg-amber-100 text-amber-600", gradient: "from-amber-500 to-orange-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus projetos urbanísticos inteligentes</p>
        </div>
        <Link to="/novo-projeto">
          <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 text-white rounded-xl px-6">
            <Zap className="h-5 w-5" />
            Novo Masterplan
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color} shrink-0`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-muted-foreground mb-4 uppercase tracking-wider text-xs">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <Link to={action.to}>
                <div className={`relative rounded-2xl bg-gradient-to-br ${action.gradient} p-6 text-white shadow-xl ${action.shadow} hover:scale-[1.02] transition-transform cursor-pointer group overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base">{action.label}</h3>
                  <p className="text-white/70 text-xs mt-1 leading-relaxed">{action.desc}</p>
                  <ArrowRight className="h-4 w-4 mt-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold">Projetos Recentes</h2>
          {projects.length > 0 && (
            <Link to="/biblioteca" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl border border-blue-100 p-16 text-center"
          >
            <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">Pronto para criar seu primeiro projeto?</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
              Informe um terreno e deixe a IA gerar uma proposta urbanística completa com viabilidade financeira.
            </p>
            <Link to="/novo-projeto">
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-5 rounded-xl shadow-lg shadow-blue-500/20">
                <Zap className="h-4 w-4" />
                Criar Primeiro Projeto
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}