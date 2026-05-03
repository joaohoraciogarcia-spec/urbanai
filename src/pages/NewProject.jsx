import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WizardProgress from "../components/wizard/WizardProgress";
import StepTerrain from "../components/wizard/StepTerrain";
import StepEnterprise from "../components/wizard/StepEnterprise";
import StepParceling from "../components/wizard/StepParceling";
import StepRoads from "../components/wizard/StepRoads";
import StepInfrastructure from "../components/wizard/StepInfrastructure";
import StepLeisure from "../components/wizard/StepLeisure";
import StepConcept from "../components/wizard/StepConcept";

const TOTAL_STEPS = 7;

export default function NewProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Pre-fill from template if present in URL
  const templateParam = new URLSearchParams(window.location.search).get("template");
  const templateDefaults = templateParam ? (() => { try { return JSON.parse(decodeURIComponent(templateParam)); } catch { return {}; } })() : {};
  const templateName = templateDefaults._template_name;

  const [data, setData] = useState({
    status: "rascunho",
    occupation_rate: 50,
    utilization_coefficient: 1.0,
    ...templateDefaults,
    // Reset fields that should NOT be pre-filled from template
    name: "",
    location: "",
    total_area: undefined,
    perimeter: undefined,
    main_frontage: undefined,
    masterplan_image: undefined,
    masterplan_description: templateDefaults._masterplan_idea || undefined,
    _template_name: undefined,
    _masterplan_idea: undefined,
  });

  const updateData = (updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    if (step === 1) return !!data.name;
    if (step === 2) return !!data.enterprise_type;
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = async () => {
    setSaving(true);
    const { _template_name, _masterplan_idea, ...cleanData } = data;
    const projectData = { ...cleanData, status: "briefing_completo" };
    const created = await base44.entities.Project.create(projectData);
    navigate(`/projeto/${created.id}`);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepTerrain data={data} onChange={updateData} />;
      case 2: return <StepEnterprise data={data} onChange={updateData} />;
      case 3: return <StepParceling data={data} onChange={updateData} />;
      case 4: return <StepRoads data={data} onChange={updateData} />;
      case 5: return <StepInfrastructure data={data} onChange={updateData} />;
      case 6: return <StepLeisure data={data} onChange={updateData} />;
      case 7: return <StepConcept data={data} onChange={updateData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <span className="text-sm text-muted-foreground">
              Etapa {step} de {TOTAL_STEPS}
            </span>
          </div>
          <WizardProgress currentStep={step} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {templateName && (
          <div className="mb-6 flex items-center gap-3 p-3 bg-primary/8 border border-primary/20 rounded-xl text-sm text-primary">
            <span className="text-base">📋</span>
            <span>Usando template: <strong>{templateName}</strong> — campos pré-preenchidos. Adicione os dados do terreno para continuar.</span>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          {step < TOTAL_STEPS ? (
            <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
              Próximo
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={saving || !canProceed()}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {saving ? "Criando..." : "Criar Projeto"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}