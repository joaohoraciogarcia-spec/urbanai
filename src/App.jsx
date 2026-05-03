export default function App() {
  return (
    <div style={{
      fontFamily: 'Inter, Arial',
      background: '#05070a',
      color: '#fff',
      minHeight: '100vh'
    }}>

      {/* ATTENTION */}
      <section style={{
        textAlign: 'center',
        padding: '100px 20px',
        maxWidth: 1100,
        margin: '0 auto'
      }}>
        <img 
          src="/logo.png" 
          alt="UrbanAI"
          style={{ width: 120, marginBottom: 30 }}
        />

        <h1 style={{
          fontSize: 56,
          fontWeight: 700,
          marginBottom: 20
        }}>
          Decida antes de investir milhões
        </h1>

        <p style={{
          fontSize: 20,
          color: '#aaa',
          maxWidth: 600,
          margin: '0 auto 40px'
        }}>
          O UrbanAI analisa terrenos e revela o potencial real de incorporação em segundos.
        </p>

        <button style={{
          background: 'linear-gradient(135deg, #7b5cff, #a855f7)',
          border: 'none',
          padding: '16px 32px',
          borderRadius: 12,
          color: '#fff',
          fontSize: 16,
          cursor: 'pointer'
        }}>
          Analisar terreno agora
        </button>
      </section>

      {/* INTEREST */}
      <section style={{
        padding: '80px 20px',
        background: '#0b0f14'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, marginBottom: 20 }}>
            O problema do mercado
          </h2>

          <p style={{ color: '#aaa', lineHeight: 1.6 }}>
            A maioria das decisões de compra de terrenos ainda é feita com base em percepção,
            sem dados concretos de viabilidade, potencial construtivo e retorno financeiro.
          </p>
        </div>
      </section>

      {/* DESIRE */}
      <section style={{
        padding: '80px 20px'
      }}>
        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20
        }}>
          {[
            "📍 Localização inteligente",
            "📐 Potencial construtivo",
            "💰 Estimativa de VGV",
            "📊 Viabilidade financeira"
          ].map((item, i) => (
            <div key={i} style={{
              background: '#11151c',
              padding: 25,
              borderRadius: 14,
              border: '1px solid #1f2937'
            }}>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* PROVA / FLUXO */}
      <section style={{
        padding: '80px 20px',
        background: '#0b0f14',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: 32, marginBottom: 20 }}>
          Como funciona
        </h2>

        <p style={{ color: '#aaa', marginBottom: 40 }}>
          Em poucos passos você transforma dúvida em decisão.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 30,
          flexWrap: 'wrap'
        }}>
          {[
            "1. Insira o terreno",
            "2. Receba análise",
            "3. Tome decisão"
          ].map((step, i) => (
            <div key={i} style={{
              background: '#11151c',
              padding: 20,
              borderRadius: 12,
              width: 200
            }}>
              {step}
            </div>
          ))}
        </div>
      </section>

      {/* ACTION */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: 36, marginBottom: 20 }}>
          Pronto para analisar seu próximo investimento?
        </h2>

        <button style={{
          background: 'linear-gradient(135deg, #7b5cff, #a855f7)',
          border: 'none',
          padding: '18px 40px',
          borderRadius: 12,
          color: '#fff',
          fontSize: 18,
          cursor: 'pointer'
        }}>
          Começar agora
        </button>
      </section>

    </div>
  )
}
