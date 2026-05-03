export default function App() {
  return (
    <div style={{
      background: "#050505",
      color: "#fff",
      minHeight: "100vh",
      fontFamily: "Inter, sans-serif"
    }}>

      {/* HERO */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "40px 20px"
      }}>

        {/* LOGO CENTRAL */}
        <img
          src="/logo.png"
          alt="UrbanAI"
          style={{
            width: 120,
            marginBottom: 40
          }}
        />

        {/* HEADLINE */}
        <h1 style={{
          fontSize: "48px",
          fontWeight: 500,
          maxWidth: 800,
          lineHeight: 1.2,
          marginBottom: 20,
          letterSpacing: "-0.5px"
        }}>
          Descubra o verdadeiro potencial de um terreno
          <br /> antes de investir milhões
        </h1>

        {/* SUB */}
        <p style={{
          color: "#A1A1AA",
          fontSize: 18,
          maxWidth: 500,
          marginBottom: 40
        }}>
          Inteligência para incorporação imobiliária
        </p>

        {/* CTA */}
        <button style={{
          padding: "16px 36px",
          background: "#C6A15B",
          color: "#000",
          border: "none",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 1,
          cursor: "pointer"
        }}>
          SOLICITAR ANÁLISE
        </button>

      </section>

      {/* BLOCO CONCEITO */}
      <section style={{
        padding: "120px 20px",
        textAlign: "center"
      }}>
        <p style={{
          maxWidth: 700,
          margin: "0 auto",
          fontSize: 20,
          color: "#d4d4d8",
          lineHeight: 1.6
        }}>
          O UrbanAI transforma dados complexos em decisões estratégicas,
          permitindo identificar viabilidade, potencial construtivo e retorno
          financeiro com precisão.
        </p>
      </section>

      {/* DIFERENCIAL */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
        gap: 40,
        padding: "80px 40px",
        maxWidth: 1100,
        margin: "0 auto"
      }}>
        {[
          "Análise de potencial construtivo",
          "Estimativa de VGV",
          "Viabilidade financeira",
          "Decisão estratégica"
        ].map((item, i) => (
          <div key={i} style={{
            borderTop: "1px solid #222",
            paddingTop: 20,
            color: "#A1A1AA",
            fontSize: 14
          }}>
            {item}
          </div>
        ))}
      </section>

      {/* CTA FINAL */}
      <section style={{
        textAlign: "center",
        padding: "140px 20px"
      }}>
        <h2 style={{
          fontSize: 32,
          marginBottom: 30,
          fontWeight: 500
        }}>
          Tome decisões com inteligência imobiliária
        </h2>

        <button style={{
          padding: "16px 40px",
          background: "transparent",
          border: "1px solid #C6A15B",
          color: "#C6A15B",
          fontSize: 14,
          letterSpacing: 1,
          cursor: "pointer"
        }}>
          COMEÇAR
        </button>
      </section>

    </div>
  );
}
