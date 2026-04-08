"use client";

import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════
   ANIMATED BACKGROUND — subtle floating orbs
══════════════════════════════════════════ */
function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0;

    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 200 + Math.random() * 300,
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      alpha: 0.03 + Math.random() * 0.04,
    }));

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < 0 || o.x > 1) o.vx *= -1;
        if (o.y < 0 || o.y > 1) o.vy *= -1;

        const grd = ctx.createRadialGradient(o.x * w, o.y * h, 0, o.x * w, o.y * h, o.r);
        grd.addColorStop(0, `rgba(200, 199, 194, ${o.alpha})`);
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(o.x * w, o.y * h, o.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.015)";
      ctx.lineWidth = 1;
      const step = 80;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" />;
}

/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };

    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button, [data-hover]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + "px";
        ringRef.current.style.top = ring.current.y + "px";
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring${hovering ? " hovering" : ""}`} />
    </>
  );
}

/* ══════════════════════════════════════════
   FADE-UP HOOK
══════════════════════════════════════════ */
function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const skills = [
  {
    icon: "⌨",
    title: "Programación",
    sub: "Desarrollo de software",
    tags: ["Python", "JavaScript", "Java", "C++", "C#", "PHP", "SQL"],
  },
  {
    icon: "◻",
    title: "UI/UX & Diseño",
    sub: "Interfaces & experiencia",
    tags: ["Diseño de interfaces", "Prototipado", "Usabilidad", "UX Research"],
  },
  {
    icon: "◈",
    title: "Ciberseguridad",
    sub: "Seguridad avanzada",
    tags: ["Análisis de vulnerabilidades", "Protección de sistemas", "Buenas prácticas"],
  },
];

const methodologies = ["Scrum Master", "Gestión de backlogs", "Sprints", "Liderazgo ágil", "Planificación de proyectos"];

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function Home() {
  useFadeUp();

  return (
    <>
      <Background />
      <Cursor />

      <div className="page-wrapper">

        {/* ── NAV ── */}
        <nav>
          <span className="logo">J.A.M.</span>
          <ul>
            {["Sobre mí", "Habilidades", "Educación", "Contacto"].map((item, i) => (
              <li key={i}>
                <a href={`#${["about","skills","education","contact"][i]}`} data-hover="true">{item}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="container">
            <div className="hero-grid">

              <div>
                <p className="hero-role fade-up">Ingeniería de Sistemas · 7° semestre</p>
                <h1 className="hero-name fade-up d1">
                  Julio<br />
                  <span>Alejandro</span><br />
                  Marín
                </h1>
              </div>

              <div className="hero-right fade-up d2">
                <p className="hero-desc">
                  Estudiante apasionado por construir soluciones eficientes, seguras y centradas en el usuario. Con formación sólida en desarrollo de software, diseño UI/UX y ciberseguridad avanzada.
                </p>
                <div className="hero-tags">
                  {["Scrum Master Cert.", "UI/UX", "Ciberseguridad", "Full-Stack"].map((t) => (
                    <span key={t} className="tag" data-hover="true">{t}</span>
                  ))}
                </div>
                <p className="hero-location">📍 Ibagué, Colombia</p>
              </div>

            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="section" id="about">
          <div className="container">
            <p className="section-label fade-up">Perfil profesional</p>
            <div className="about-grid">
              <div className="about-big fade-up d1">
                Construyendo soluciones <em>seguras</em> y centradas en las <em>personas</em>.
              </div>
              <div className="about-detail fade-up d2">
                <p>
                  Curso el séptimo semestre de Ingeniería de Sistemas en la Universidad de Ibagué, con promedio académico destacado en programación, redes y seguridad informática.
                </p>
                <p>
                  Certificado como Scrum Master, con habilidades comprobadas en metodologías ágiles, planificación de sprints y liderazgo de equipos tecnológicos. Orientado al aprendizaje continuo y a la adaptación rápida.
                </p>
                <p>
                  Interesado en oportunidades de práctica o trabajo en desarrollo de software, ciberseguridad o gestión de proyectos tecnológicos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section className="section" id="skills">
          <div className="container">
            <p className="section-label fade-up">Área de conocimiento</p>
            <h2 className="section-title fade-up d1">Habilidades <em>técnicas</em></h2>
            <div className="skills-grid fade-up d2">
              {skills.map((s) => (
                <div key={s.title} className="skill-card" data-hover="true">
                  <div className="skill-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p className="skill-subtitle">{s.sub}</p>
                  <div className="skill-list">
                    {s.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Methodologies */}
            <div style={{ marginTop: 2, padding: "36px 32px", border: "1px solid var(--dark-gray)", background: "rgba(255,255,255,0.01)" }} className="fade-up">
              <p className="skill-subtitle" style={{ marginBottom: 16 }}>Gestión & metodologías</p>
              <div className="skill-list">
                {methodologies.map((m) => (
                  <span key={m} className="tag">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section className="section" id="education">
          <div className="container">
            <p className="section-label fade-up">Formación académica</p>
            <h2 className="section-title fade-up d1">Educación &amp; <em>certificaciones</em></h2>
            <div className="edu-grid fade-up d2">

              <div className="edu-card" data-hover="true">
                <p className="edu-year">2021 — Presente</p>
                <h3>Ingeniería de Sistemas</h3>
                <p className="inst">Universidad de Ibagué</p>
                <ul className="edu-bullets">
                  <li>Actualmente en 7° semestre</li>
                  <li>Promedio académico destacado en programación, redes y seguridad</li>
                  <li>Participación activa en actividades de desarrollo de software</li>
                </ul>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div className="edu-card" data-hover="true">
                  <p className="edu-year">Certificación</p>
                  <h3>Scrum Master</h3>
                  <p className="inst">Gestión de proyectos ágiles</p>
                  <ul className="edu-bullets">
                    <li>Planificación de sprints y gestión de backlogs</li>
                    <li>Reuniones de seguimiento y liderazgo de equipos</li>
                  </ul>
                </div>
                <div className="edu-card" data-hover="true">
                  <p className="edu-year">Certificación</p>
                  <h3>Ciberseguridad Avanzada</h3>
                  <p className="inst">Conocimientos especializados</p>
                  <ul className="edu-bullets">
                    <li>Análisis de vulnerabilidades y protección de sistemas</li>
                    <li>Buenas prácticas de seguridad informática</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── IDIOMAS ── */}
        <section style={{ padding: "0 0 120px" }}>
          <div className="container">
            <div style={{ height: 1, background: "var(--dark-gray)", marginBottom: 48 }} className="fade-up" />
            <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
              <div className="fade-up">
                <p className="section-label" style={{ marginBottom: 12 }}>Idiomas</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <span className="tag">Español — Nativo</span>
                </div>
              </div>
              <div className="fade-up d1">
                <p className="section-label" style={{ marginBottom: 12 }}>Disponibilidad</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <span className="tag">Prácticas</span>
                  <span className="tag">Tiempo parcial</span>
                  <span className="tag">Freelance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="contact-wrap">
          <div className="container">
            <p className="contact-pre fade-up">¿Hablamos?</p>
            <h2 className="contact-title fade-up d1">Trabajemos juntos</h2>
            <a
              href="mailto:9marinalejandro9@gmail.com"
              className="contact-link fade-up d2"
              data-hover="true"
            >
              9marinalejandro9@gmail.com
            </a>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer>
          <span className="footer-text">© 2025 Julio Alejandro Marín Aguilar</span>
          <span className="footer-text">Ibagué, Colombia</span>
        </footer>

      </div>
    </>
  );
}
