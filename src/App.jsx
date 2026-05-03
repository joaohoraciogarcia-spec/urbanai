export default function App() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#050505",
      color: "#fff",
      fontFamily: "Arial, sans-serif",
      padding: "40px 24px"
    }}>
      <section style={{
        maxWidth: 1100,
        margin: "0 auto",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        <img
          src="/logo.png"
          alt="UrbanAI"
          style={{ width: 180, marginBottom: 48 }}
        />

        <p style={{
          color: "#C6A15B",
          letterSpacing: 3,
          fontSize: 13,
          textTransform: "uppercase",
          marginBottom: 24
        }}>
          Inteligência para incorporação imobiliária
        </p>

        <h1 style={{
          fontSize: "clamp(38px, 6vw, 76px)",
          lineHeight: 1.05,
          fontWeight: 500,
          maxWidth: 950,
          margin: "0 0 28px"
        }}>
          Descubra o verdadeiro potencial de um terreno antes de investir milhões
        </h1>

        <p style={{
          color: "#b5b5b5",
          fontSize: 20,
          maxWidth: 680,
          lineHeight: 1.6,
          marginBottom: 42
        }}>
          O UrbanAI transforma dados urbanos, potencial construtivo, VGV e viabilidade em uma leitura estratégica para decisões imobiliárias de alto valor.
        </p>

        <button style={{
          background: "#C6A15B",
          color: "#050505",
          border: "none",
          padding: "18px 42px",
          borderRadius: 4,
          fontWeight: 700,
          letterSpacing: 1.5,
          cursor: "pointer"
        }}>
          SOLICITAR ANÁLISE
        </button>
      </section>
    </main>
  )
}
