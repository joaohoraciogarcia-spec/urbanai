import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WizardProgress from "../components/wizard/WizardProgress";
import StepTerrain from "../components/wizard/StepTerrain";
import StepEnterprise from "../components/wizard/StepEnterprise";
import StepParceling from "../components/wizard/StepParceling";
import StepRoads from "../components/wizard/StepRoads";
import StepLeisure from "../components/wizard/StepLeisure";
import StepConcept from "../components/wizard/StepConcept";

const TOTAL_STEPS = 6;

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    base44.entities.Project.filter({ id }).then((res) => {
      if (res.length > 0) setData(res[0]);
      setLoading(false);
    });
  }, [id]);

  const updateData = (updates) => setData((prev) => ({ ...prev, ...updates }));

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Project.update(id, data);
    navigate(`/projeto/${id}`);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepTerrain data={data} onChange={updateData} />;
      case 2: return <StepEnterprise data={data} onChange={updateData} />;
      case 3: return <StepParceling data={data} onChange={updateData} />;
      case 4: return <StepRoads data={data} onChange={updateData} />;
      case 5: return <StepLeisure data={data} onChange={updateData} />;
      case 6: return <StepConcept data={data} onChange={updateData} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Projeto não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(`/projeto/${id}`)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Projeto
            </button>
            <span className="text-sm text-muted-foreground">
              Editar — Etapa {step} de {TOTAL_STEPS}
            </span>
          </div>
          <WizardProgress currentStep={step} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
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
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar
            </Button>
            {step < TOTAL_STEPS && (
              <Button onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))} className="gap-2">
                Próximo
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}