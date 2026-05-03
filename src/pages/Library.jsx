import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";

const references = [
  {
    category: "Condomínios Rurais",
    items: [
      { name: "Fazenda Boa Vista", location: "Porto Feliz, SP", description: "Condomínio rural de alto padrão com campo de golf, clube hípico e lotes a partir de 5.000m²." },
      { name: "Terras de São José", location: "Itu, SP", description: "Condomínio rural com lagos, clube e lotes amplos em meio à natureza." },
    ],
  },
  {
    category: "Bairros Planejados",
    items: [
      { name: "Alphaville", location: "Barueri, SP", description: "Referência em bairro planejado com infraestrutura completa, segurança e áreas de lazer." },
      { name: "Riviera de São Lourenço", location: "Bertioga, SP", description: "Bairro planejado litorâneo com sustentabilidade e qualidade de vida." },
    ],
  },
  {
    category: "Loteamentos",
    items: [
      { name: "Cidade Jardim", location: "São Paulo, SP", description: "Loteamento de alto padrão com boulevard, club e áreas verdes preservadas." },
      { name: "Damha", location: "São José do Rio Preto, SP", description: "Rede de loteamentos planejados com foco em qualidade de vida e segurança." },
    ],
  },
  {
    category: "Resorts Residenciais",
    items: [
      { name: "Txai Resort", location: "Itacaré, BA", description: "Resort residencial integrado à mata atlântica com praia privativa." },
      { name: "Ponta dos Ganchos", location: "Governador Celso Ramos, SC", description: "Resort de luxo com bangalôs exclusivos e natureza preservada." },
    ],
  },
  {
    category: "Torres Residenciais",
    items: [
      { name: "Faria Lima Office", location: "São Paulo, SP", description: "Referência em torre comercial com infraestrutura de ponta." },
      { name: "Yachthouse", location: "Balneário Camboriú, SC", description: "Torres residenciais de super-luxo com vista para o mar." },
    ],
  },
];

export default function Library() {
  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-semibold mb-2">Biblioteca de Referências</h1>
        <p className="text-muted-foreground mb-10">Empreendimentos de referência para inspirar seus projetos.</p>
      </motion.div>

      <div className="space-y-10">
        {references.map((cat, ci) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.1 }}
          >
            <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {cat.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300"
                >
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.location}</p>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}