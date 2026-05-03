export default function App() {
  return (
    <div style={{
      fontFamily: 'Arial',
      background: '#0b0f14',
      color: '#fff',
      minHeight: '100vh'
    }}>

      {/* HERO */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        maxWidth: 1000,
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: 48,
          marginBottom: 20,
          lineHeight: 1.2
        }}>
          UrbanAI
        </h1>

        <h2 style={{
          fontSize: 24,
          fontWeight: 'normal',
          color: '#aaa',
          marginBottom: 30
        }}>
          Inteligência para análise de terrenos e incorporação
        </h2>

        <p style={{
          fontSize: 18,
          marginBottom: 40,
          color: '#ccc'
        }}>
          Descubra o potencial de um terreno antes de investir milhões.
        </p>

        <button style={{
          background: '#00ffae',
          color: '#000',
          padding: '15px 30px',
          border: 'none',
          borderRadius: 8,
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: 16
        }}>
          Analisar terreno
        </button>
      </section>

      {/* PROBLEMA */}
      <section style={{
        padding: '60px 20px',
        background: '#111'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h3 style={{ fontSize: 28, marginBottom: 20 }}>
            O problema
          </h3>

          <p style={{ color: '#bbb', lineHeight: 1.6 }}>
            Comprar um terreno para incorporação sem dados claros pode gerar decisões erradas,
            prejuízos e oportunidades perdidas. Hoje, muitos investimentos ainda são feitos no feeling.
          </p>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section style={{
        padding: '60px 20px'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h3 style={{ fontSize: 28, marginBottom: 20 }}>
            A solução
          </h3>

          <p style={{ color: '#bbb', lineHeight: 1.6 }}>
            O UrbanAI analisa automaticamente o potencial construtivo,
            estima VGV e indica viabilidade em segundos.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{
        padding: '60px 20px',
        background: '#111'
      }}>
        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20
        }}>
          {[
            "📍 Análise por localização",
            "📐 Potencial construtivo",
            "💰 Simulação de VGV",
            "📈 Viabilidade do projeto"
          ].map((item, i) => (
            <div key={i} style={{
              background: '#1a1f27',
              padding: 20,
              borderRadius: 10
            }}>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: 28, marginBottom: 20 }}>
          Pronto para analisar seu próximo terreno?
        </h2>

        <button style={{
          background: '#00ffae',
          color: '#000',
          padding: '15px 30px',
          border: 'none',
          borderRadius: 8,
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Começar agora
        </button>
      </section>

    </div>
  )
}
