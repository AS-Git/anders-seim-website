"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Search, MessageSquare, Trophy, TrendingUp,
  Monitor, Sparkles, Megaphone, ShoppingCart, Compass,
  MapPin, Phone, Mail, Check, Menu, X, ChevronDown,
  ArrowRight, Lightbulb, Rocket, BarChart3, Building2,
} from "lucide-react";

// ─── Schema ──────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().min(2, "Bitte geben Sie Ihren Namen ein."),
  firma:   z.string().min(1, "Bitte geben Sie Ihre Firma an."),
  email:   z.string().email("Bitte eine gültige E-Mail-Adresse eingeben."),
  phone:   z.string().optional(),
  message: z.string().min(10, "Bitte beschreiben Sie Ihr Anliegen kurz."),
  privacy: z.boolean().refine(v => v === true, {
    message: "Bitte stimmen Sie den Datenschutzbestimmungen zu.",
  }),
});
type ContactValues = z.infer<typeof contactSchema>;

// ─── Data ────────────────────────────────────────────────────────────────────
const TYPING_WORDS = ["SEO", "GEO", "KI-Sichtbarkeit", "Webdesign"];

const marqueeItems = [
  "Internetagentur seit 1997", "Webdesign & Entwicklung",
  "SEO · Google Rankings",    "GEO · KI-Sichtbarkeit",
  "ChatGPT · Perplexity",     "200+ Projekte",
  "DACH-Region",               "100% Weiterempfehlung",
  "Online-Marketing",          "E-Commerce",
  "Strategie & UX",           "Frankfurt · Langen",
];

const pillars = [
  {
    num: "01", icon: Search, title: "Gefunden werden",
    text: "Organische Sichtbarkeit durch professionelle SEO und GEO — bei Google und in KI-Suchantworten wie ChatGPT oder Google AI Overviews.",
  },
  {
    num: "02", icon: MessageSquare, title: "Qualifizierte Anfragen",
    text: "Mehr relevante Kontakte statt zufälliger Besucher — durch Websites und Inhalte, die Ihre Zielgruppe gezielt ansprechen und überzeugen.",
  },
  {
    num: "03", icon: Trophy, title: "Messbar mehr Erfolg",
    text: "Klare Zahlen statt leere Versprechen: Wir messen, was zählt — Anfragen, Conversion-Rate und organisches Wachstum.",
  },
  {
    num: "04", icon: TrendingUp, title: "Langfristige Partnerschaft",
    text: "Wir begleiten Sie dauerhaft: monatliche Reportings, kontinuierliche Optimierung und persönliche Ansprechpartner.",
  },
];

const services = [
  { num: "01", icon: Monitor,      title: "Webdesign & Entwicklung", badge: null,
    text: "Professionelle, schnell ladende Websites, die Ihre Zielgruppe überzeugen und Besucher in Kunden verwandeln." },
  { num: "02", icon: Search,       title: "SEO – Suchmaschinenoptimierung", badge: null,
    text: "Nachhaltig besser ranken bei Google: technische Optimierung, hochwertiger Content und strategischer Linkaufbau." },
  { num: "03", icon: Sparkles,     title: "GEO – KI-Sichtbarkeit", badge: "NEU",
    text: "Generative Engine Optimization: Wir optimieren Ihre Inhalte so, dass KI-Systeme wie ChatGPT und Perplexity Ihr Unternehmen empfehlen." },
  { num: "04", icon: Megaphone,    title: "Content & Online-Marketing", badge: null,
    text: "Strategischer Content, Social Media und E-Mail-Marketing — organische Reichweite aufbauen und die richtige Botschaft platzieren." },
  { num: "05", icon: ShoppingCart, title: "E-Commerce", badge: null,
    text: "Onlineshops, die wirklich verkaufen — von der Produktstrategie über das Design bis zu Conversion-Optimierung." },
  { num: "06", icon: Compass,      title: "Strategie & UX", badge: null,
    text: "Durchdachte digitale Konzepte: Nutzerführung, Conversion-Optimierung und datenbasierte Entscheidungen." },
];

const processSteps = [
  { icon: Lightbulb, step: "01", title: "Kennenlernen & Strategie",
    text: "Kostenloses Erstgespräch, Analyse Ihres Marktes und Ihrer Wettbewerber, gemeinsame Zieldefinition — ohne Fachchinesisch." },
  { icon: Rocket, step: "02", title: "Design & Umsetzung",
    text: "Professionelles Design, technisch saubere Entwicklung und SEO-optimierte Inhalte — zügig und transparent, mit Ihnen gemeinsam." },
  { icon: BarChart3, step: "03", title: "Launch & Optimierung",
    text: "Go-live, Monitoring und kontinuierliche Verbesserung: Wir bleiben als digitaler Partner an Ihrer Seite und optimieren laufend." },
];

const testimonials = [
  { initials: "MK", name: "Markus Keller", role: "Geschäftsführer, Keller Bau GmbH",
    quote: "Endlich eine Agentur, die zuhört und liefert. Unsere Anfragen haben sich seit dem Relaunch spürbar erhöht — und das ohne Werbekosten." },
  { initials: "SB", name: "Sandra Berger", role: "Inhaberin, Praxis Berger",
    quote: "Professionell, schnell und immer erreichbar. Die Zusammenarbeit fühlt sich wie eine echte Partnerschaft an. Absolute Weiterempfehlung." },
  { initials: "TW", name: "Thomas Wagner", role: "Leiter Marketing, Wagner Logistik",
    quote: "Unsere Google-Sichtbarkeit ist enorm gestiegen — und seit GEO finden uns auch Kunden über ChatGPT. Das war vor zwei Jahren noch unvorstellbar." },
];

const faqs = [
  { q: "Was ist GEO – Generative Engine Optimization?",
    a: "GEO (Generative Engine Optimization) ist die Optimierung von Inhalten für KI-basierte Suchsysteme wie ChatGPT, Google AI Overviews, Perplexity und Bing Copilot. Während klassisches SEO auf Google-Rankings zielt, sorgt GEO dafür, dass KI-Systeme Ihr Unternehmen als relevante Quelle zitieren und empfehlen. Da immer mehr Nutzer Antworten direkt von KI erhalten statt auf Suchergebnisse zu klicken, ist GEO ein entscheidender Wettbewerbsvorteil." },
  { q: "Für welche Unternehmen ist Anders & Seim geeignet?",
    a: "Wir arbeiten mit kleinen und mittelständischen Unternehmen (KMU) in Deutschland, Österreich und der Schweiz zusammen — branchenübergreifend. Besonders profitieren Unternehmen, die lokal oder regional mehr Sichtbarkeit aufbauen und qualifizierte Anfragen über ihre Website generieren möchten, ohne dauerhaft von bezahlter Werbung abhängig zu sein." },
  { q: "Wie läuft eine Zusammenarbeit mit Anders & Seim ab?",
    a: "Nach einem kostenlosen Erstgespräch analysieren wir Ihren Markt und definieren klare Ziele. Dann folgen Konzept, Design und technische Umsetzung — immer transparent und in enger Abstimmung mit Ihnen. Nach dem Launch bleiben wir als langfristiger digitaler Partner an Ihrer Seite: mit monatlichem Reporting, kontinuierlicher Optimierung und persönlichem Ansprechpartner." },
  { q: "Was unterscheidet SEO von bezahlter Werbung?",
    a: "SEO (Suchmaschinenoptimierung) erzeugt organische Sichtbarkeit, die nachhaltig wirkt und keine laufenden Werbekosten verursacht. Einmal aufgebaut, bringt gute SEO dauerhaft qualifizierte Besucher auf Ihre Website. Bezahlte Werbung erzeugt sofortige Sichtbarkeit, endet aber sobald das Budget aufgebraucht ist. Für nachhaltiges digitales Wachstum empfehlen wir SEO als Fundament." },
  { q: "Wie lange dauert es, bis SEO und GEO Ergebnisse zeigen?",
    a: "Erste messbare Ergebnisse sehen Sie bei SEO meist nach 3–6 Monaten. GEO-Maßnahmen können schneller wirken, da KI-Systeme Inhalte kontinuierlich indexieren. Für nachhaltiges Wachstum empfehlen wir einen Zeithorizont von 6–12 Monaten — mit konkreten Meilensteinen und monatlichem Reporting." },
];

const trustBadges = [
  "Keine Vertragsbindung", "Persönliche Beratung",
  "Schnelle Umsetzung",   "DSGVO-konform",
];

// ─── CountUp ─────────────────────────────────────────────────────────────────
function CountUpStat({ value, label }: { value: string; label: string }) {
  const num = parseInt(value, 10);
  const suffix = isNaN(num) ? "" : value.replace(/\d/g, "");
  const [display, setDisplay] = useState(isNaN(num) ? value : "0");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNaN(num)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const t0 = performance.now();
      const dur = 1800;
      function tick(now: number) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - (1 - p) ** 3;
        setDisplay(Math.round(eased * num) + suffix);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [num, suffix]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-[44px] md:text-[56px] font-extrabold text-white leading-none tabular-nums mb-2">{display}</div>
      <div className="text-[13px] font-semibold tracking-wide" style={{ color: "#9aa0c9" }}>{label}</div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Typewriter
  const [typed, setTyped] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Hero cursor spotlight
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  // Testimonial carousel
  const [activeT, setActiveT] = useState(0);
  const [tKey, setTKey] = useState(0);

  // Floating CTA
  const [showFloat, setShowFloat] = useState(false);

  useEffect(() => {
    const current = TYPING_WORDS[wordIdx];
    const speed = isDeleting ? 55 : 130;
    const timer = setTimeout(() => {
      if (!isDeleting && typed === current) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && typed === "") {
        setIsDeleting(false);
        setWordIdx(i => (i + 1) % TYPING_WORDS.length);
      } else {
        setTyped(isDeleting ? typed.slice(0, -1) : current.slice(0, typed.length + 1));
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [typed, wordIdx, isDeleting]);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Testimonial auto-advance
  useEffect(() => {
    const t = setInterval(() => {
      setActiveT(prev => (prev + 1) % testimonials.length);
      setTKey(k => k + 1);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Floating button on scroll
  useEffect(() => {
    const onScroll = () => setShowFloat(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { privacy: false },
  });

  const onSubmit = (data: ContactValues) => {
    const subject = encodeURIComponent(`Projektanfrage von ${data.name} (${data.firma})`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nFirma: ${data.firma}\nE-Mail: ${data.email}\nTelefon: ${data.phone ?? "–"}\n\n${data.message}`
    );
    window.location.href = `mailto:hallo@andersundseim.de?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const nav = [
    ["Leistungen", "#leistungen"], ["Vorteile", "#vorteile"],
    ["Referenzen", "#referenzen"], ["Kontakt", "#kontakt"],
  ];

  const t = testimonials[activeT];

  return (
    <>
      {/* ── FLOATING PHONE BUTTON ────────────────────────────────────────────── */}
      <div className={`float-cta ${showFloat ? "is-visible" : ""}`}>
        <a
          href="tel:+4961035930"
          className="flex items-center gap-2.5 h-12 px-5 rounded-full font-bold text-[14px] text-white shadow-2xl hover:-translate-y-0.5 transition-transform"
          style={{ background: "#20296c", border: "1px solid rgba(0,155,169,.4)", boxShadow: "0 8px 32px rgba(0,0,0,.25)" }}
        >
          <Phone size={16} color="#5fe0ec" strokeWidth={2} />
          <span>Jetzt anrufen</span>
        </a>
      </div>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between h-[72px] px-6 md:px-14"
        style={{ background: "#20296c", borderBottom: "1px solid rgba(255,255,255,.08)" }}
      >
        <button onClick={scrollToTop} className="flex items-center" aria-label="Zur Startseite">
          <Image src="/images/logo-white.png" alt="Anders & Seim Internetagentur" width={150} height={36} className="h-[34px] w-auto" priority />
        </button>

        <div className="hidden md:flex items-center gap-8">
          {nav.map(([l, h]) => (
            <a key={l} href={h} className="text-[#c7cbe6] font-semibold text-[14px] hover:text-white transition-colors tracking-wide">{l}</a>
          ))}
          <a href="#kontakt" className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg font-bold text-[14px] text-white transition-all hover:-translate-y-px" style={{ background: "#7C019C", boxShadow: "0 4px 14px rgba(124,1,156,.4)" }}>
            Kostenlos anfragen <ArrowRight size={14} />
          </a>
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(v => !v)} aria-label="Menü öffnen">
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden sticky top-[72px] z-40 flex flex-col gap-3 px-6 py-4 border-b" style={{ background: "#20296c", borderColor: "rgba(255,255,255,.08)" }}>
          {nav.map(([l, h]) => (
            <a key={l} href={h} className="text-[#c7cbe6] font-semibold text-[15px] hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>{l}</a>
          ))}
          <a href="#kontakt" onClick={() => setMobileMenuOpen(false)} className="inline-flex justify-center items-center h-11 rounded-lg font-bold text-white text-[15px] mt-1" style={{ background: "#7C019C" }}>
            Kostenlos anfragen
          </a>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden px-6 md:px-14 min-h-[90vh] flex items-center"
        style={{ background: "radial-gradient(140% 120% at 65% -10%, #2a348a 0%, #20296c 45%, #161d54 100%)" }}
        onMouseMove={e => {
          const rect = heroRef.current?.getBoundingClientRect();
          if (rect) setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => setMouse({ x: -1000, y: -1000 })}
      >
        {/* Grid overlay */}
        <div className="hero-grid absolute inset-0 pointer-events-none" />
        {/* Cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(500px circle at ${mouse.x}px ${mouse.y}px, rgba(0,155,169,.13), transparent 40%)` }}
        />
        {/* Scan line */}
        <div className="hero-scan absolute left-0 right-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(0,155,169,.55), transparent)" }} />
        {/* Blobs */}
        <div className="animate-float2 absolute w-[700px] h-[700px] -right-40 -top-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,155,169,.28), transparent 70%)", filter: "blur(18px)" }} />
        <div className="animate-float absolute w-[600px] h-[600px] -left-44 -bottom-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,1,156,.28), transparent 70%)", filter: "blur(18px)" }} />

        <div className="relative max-w-6xl mx-auto w-full py-24 lg:py-0 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">

          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-[#5fe0ec] text-[13px] font-semibold tracking-wider" style={{ background: "rgba(0,155,169,.14)", border: "1px solid rgba(0,155,169,.32)" }}>
              <span className="w-[6px] h-[6px] rounded-full animate-pulse" style={{ background: "#009BA9" }} />
              Internetagentur · Frankfurt&nbsp;/&nbsp;Langen · seit&nbsp;1997
            </div>

            {/* Headline — NO gradient text (impeccable absolute ban) */}
            <h1 className="text-[52px] md:text-[70px] xl:text-[82px] font-extrabold text-white leading-[1.0] tracking-tight mb-5">
              Wunderbar<br />
              <span style={{ color: "#009BA9" }}>wirksame</span><br />
              Websites.
            </h1>

            {/* Typewriter */}
            <div className="flex items-center gap-1.5 mb-6 h-10">
              <span className="text-[18px] md:text-[21px] font-semibold" style={{ color: "#c7cbe6" }}>KI-affin. Für&nbsp;</span>
              <span className="text-[18px] md:text-[21px] font-extrabold" style={{ color: "#009BA9", minWidth: "8ch" }}>
                {typed}
                <span className="inline-block w-[2px] h-[1.1em] ml-[2px] align-middle animate-pulse rounded-sm" style={{ background: "#009BA9", verticalAlign: "text-bottom" }} />
              </span>
            </div>

            <p className="text-base md:text-[17px] text-[#c7cbe6] max-w-[530px] mb-10 leading-relaxed">
              Wir helfen KMU in Deutschland, Österreich und der Schweiz —
              bei Google <em>und</em> in KI-Antworten wie ChatGPT, Perplexity
              und Google AI Overviews sichtbar zu sein. Organisch. Nachhaltig. Wirksam.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <a href="#kontakt" className="inline-flex items-center gap-2 justify-center h-[54px] px-8 rounded-xl font-bold text-[16px] text-white transition-all hover:-translate-y-0.5 hover:shadow-2xl w-full sm:w-auto" style={{ background: "#7C019C", boxShadow: "0 12px 32px rgba(124,1,156,.45)" }}>
                Jetzt kostenlos anfragen <ArrowRight size={16} />
              </a>
              <a href="#leistungen" className="inline-flex items-center justify-center gap-2 h-[54px] px-8 rounded-xl font-bold text-[16px] text-white transition-all hover:bg-white/10 w-full sm:w-auto" style={{ border: "1.5px solid rgba(255,255,255,.28)" }}>
                Unsere Leistungen
              </a>
            </div>

            <div className="inline-flex items-center gap-2 mt-10 text-[#dfe2f2] font-semibold text-[14px]">
              <span className="text-[#FFB400] tracking-widest">★★★★★</span>
              5,0&nbsp;/&nbsp;5,0 · 100% Weiterempfehlung · ProvenExpert
            </div>
          </div>

          {/* Right: AI Orb — solid chips, no glassmorphism */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative" style={{ width: 400, height: 400 }}>
              {/* Beacon rings */}
              <div className="hero-beacon absolute rounded-full pointer-events-none" style={{ inset: -40, border: "1px solid rgba(0,155,169,.14)" }} />
              <div className="hero-beacon-2 absolute rounded-full pointer-events-none" style={{ inset: -18, border: "1px solid rgba(0,155,169,.2)" }} />
              {/* Ring 1 */}
              <div className="hero-spin-cw absolute inset-0 rounded-full" style={{ border: "1.5px dashed rgba(0,155,169,.42)" }}>
                <span className="absolute left-1/2 -translate-x-1/2 w-[11px] h-[11px] rounded-full" style={{ top: -5.5, background: "#009BA9", boxShadow: "0 0 12px rgba(0,155,169,.9), 0 0 24px rgba(0,155,169,.5)" }} />
              </div>
              {/* Ring 2 */}
              <div className="hero-spin-ccw absolute rounded-full" style={{ inset: 46, border: "1.5px solid rgba(124,1,156,.5)" }}>
                <span className="absolute left-1/2 -translate-x-1/2 w-[9px] h-[9px] rounded-full" style={{ top: -4.5, background: "#9b22c1", boxShadow: "0 0 10px rgba(124,1,156,.9)" }} />
              </div>
              {/* Ring 3 */}
              <div className="hero-spin-cw-2 absolute rounded-full" style={{ inset: 90, border: "1px solid rgba(255,255,255,.16)" }}>
                <span className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-white/35" style={{ top: -3 }} />
              </div>
              {/* Central orb */}
              <div className="hero-orb-glow absolute rounded-full flex items-center justify-center" style={{ inset: 138, background: "radial-gradient(circle at 38% 35%, #00d4e8, #009BA9 45%, #1b2572 85%)" }}>
                <Sparkles size={44} color="rgba(255,255,255,.92)" strokeWidth={1.6} />
              </div>
              {/* Keyword chips — solid background, no backdrop-filter */}
              <div className="hero-chip" style={{ top: -20, left: 20 }}>SEO</div>
              <div className="hero-chip" style={{ top: 20, right: -60, animationDelay: ".8s", animationDuration: "5s" }}>GEO</div>
              <div className="hero-chip" style={{ top: 148, right: -74, animationDelay: "1.6s", animationDuration: "3.8s" }}>ChatGPT</div>
              <div className="hero-chip" style={{ bottom: 48, right: -66, animationDelay: ".4s", animationDuration: "4.5s" }}>Google AI</div>
              <div className="hero-chip" style={{ bottom: -18, left: 68, animationDelay: "1.2s", animationDuration: "5.5s" }}>Perplexity</div>
              <div className="hero-chip" style={{ bottom: 88, left: -68, animationDelay: "2s", animationDuration: "4.2s" }}>Webdesign</div>
              <div className="hero-chip" style={{ top: 82, left: -62, animationDelay: ".6s", animationDuration: "4.8s" }}>KI-Suche</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TICKER ───────────────────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-[#E2E5EE] select-none" style={{ background: "#F0F2F8", paddingBlock: "14px" }}>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((text, i) => (
            <span key={i} className="flex items-center gap-3 px-7 text-[12px] font-bold tracking-[.08em] uppercase whitespace-nowrap" style={{ color: "#6B7280" }}>
              <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: "#009BA9" }} />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ── PILLARS / WHY ────────────────────────────────────────────────────── */}
      <section id="vorteile" className="px-6 md:px-14 py-24" style={{ background: "#F5F6FA" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-14" data-reveal>
            <p className="text-[13px] font-bold tracking-[.1em] uppercase mb-3" style={{ color: "#009BA9" }}>Warum Anders &amp; Seim</p>
            <h2 className="text-3xl md:text-[44px] font-extrabold text-[#1A1A1A] leading-[1.1] tracking-tight max-w-xl">
              Mehr als eine Agentur.<br className="hidden sm:block" /> Ihr digitaler Wachstumspartner.
            </h2>
          </div>

          {/* 2×2 separated blocks — not floating card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "#E2E5EE" }}>
            {pillars.map(({ num, icon: Icon, title, text }, i) => (
              <div key={title} className="bg-white p-8 md:p-10" data-reveal data-delay={String(i + 1)}>
                <div className="flex items-start gap-5 mb-5">
                  <span className="font-extrabold text-[56px] leading-none select-none" style={{ color: "#ECEEF4", letterSpacing: "-0.02em" }}>{num}</span>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-none mt-2" style={{ background: "rgba(0,155,169,.1)", color: "#009BA9" }}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                </div>
                <h3 className="font-bold text-[20px] text-[#1A1A1A] mb-3 leading-snug">{title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────────── */}
      <section id="leistungen" className="px-6 md:px-14 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14" data-reveal>
            <p className="text-[13px] font-bold tracking-[.1em] uppercase mb-3" style={{ color: "#009BA9" }}>Unsere Leistungen</p>
            <h2 className="text-3xl md:text-[44px] font-extrabold text-[#1A1A1A] leading-[1.1] tracking-tight max-w-lg">
              Alles für Ihren<br className="hidden sm:block" /> digitalen Erfolg
            </h2>
            <p className="mt-4 text-[16px] text-[#6B7280] leading-relaxed max-w-lg">
              Von der Website über SEO bis zur KI-Sichtbarkeit — wir decken alle Kanäle ab, die nachhaltig Anfragen bringen.
            </p>
          </div>

          {/* Numbered list — not identical card grid */}
          <div className="flex flex-col">
            {services.map(({ num, icon: Icon, title, text, badge }, i) => (
              <div
                key={title}
                className="service-row group flex items-start gap-5 md:gap-8 py-6 border-b border-[#ECEEF4] cursor-default"
                data-reveal data-delay={String((i % 3) + 1)}
              >
                <span className="font-extrabold text-[12px] text-[#D4D7E6] w-7 flex-none mt-1.5 tracking-wider">{num}</span>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-none group-hover:scale-110 transition-transform mt-0.5" style={{ background: "rgba(0,155,169,.09)", color: "#009BA9" }}>
                  <Icon size={20} strokeWidth={1.9} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <h3 className="font-bold text-[17px] md:text-[18px] text-[#1A1A1A]">{title}</h3>
                    {badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider text-white" style={{ background: "#009BA9" }}>{badge}</span>
                    )}
                  </div>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-xl">{text}</p>
                </div>
                <ArrowRight size={18} className="flex-none mt-2 text-[#D4D7E6] group-hover:text-[#009BA9] group-hover:translate-x-1 transition-all hidden sm:block" />
              </div>
            ))}
          </div>

          <div className="mt-12" data-reveal>
            <a href="#kontakt" className="inline-flex items-center gap-2 h-[52px] px-8 rounded-xl font-bold text-[15px] text-white transition-all hover:-translate-y-0.5" style={{ background: "#7C019C", boxShadow: "0 8px 24px rgba(124,1,156,.3)" }}>
              Kostenlos beraten lassen <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-14 py-24" style={{ background: "#F5F6FA" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16" data-reveal>
            <p className="text-[13px] font-bold tracking-[.1em] uppercase mb-3" style={{ color: "#009BA9" }}>Unser Ansatz</p>
            <h2 className="text-3xl md:text-[44px] font-extrabold text-[#1A1A1A] leading-[1.1] tracking-tight">
              So arbeiten wir zusammen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px" style={{ background: "linear-gradient(90deg, #009BA9, #7C019C)" }} />

            {processSteps.map(({ icon: Icon, step, title, text }, i) => (
              <div key={step} className="flex flex-col items-center text-center" data-reveal data-delay={String(i + 1)}>
                <div className="relative w-[104px] h-[104px] rounded-full flex items-center justify-center mb-6 z-10" style={{ background: "rgba(0,155,169,.07)", border: "2px solid #ECEEF4" }}>
                  <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center bg-white" style={{ boxShadow: "0 4px 20px rgba(32,41,108,.1)" }}>
                    <Icon size={28} style={{ color: "#009BA9" }} strokeWidth={1.8} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold" style={{ background: "#7C019C" }}>{step}</span>
                </div>
                <h3 className="font-bold text-[18px] text-[#1A1A1A] mb-3">{title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-xs">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — auto-carousel ─────────────────────────────────────── */}
      <section id="referenzen" className="px-6 md:px-14 py-24 overflow-hidden" style={{ background: "radial-gradient(130% 110% at 20% -10%, #2a348a 0%, #20296c 50%, #161d54 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16" data-reveal>
            <h2 className="text-3xl md:text-[44px] font-extrabold text-white leading-[1.1] tracking-tight mb-4">
              Das sagen unsere Kunden
            </h2>
            <div className="inline-flex items-center gap-2 text-[14px] font-semibold" style={{ color: "#9aa0c9" }}>
              <span className="text-[#FFB400] tracking-[3px]">★★★★★</span>
              <span className="text-white">5,0 / 5,0</span>
              · 100% Weiterempfehlung · ProvenExpert
            </div>
          </div>

          {/* Single active testimonial */}
          <div key={tKey} className="testimonial-active text-center max-w-2xl mx-auto mb-10">
            <div className="text-[80px] font-extrabold leading-none select-none mb-4" style={{ color: "#009BA9", opacity: 0.2 }}>"</div>
            <p className="text-[18px] md:text-[22px] font-medium text-white leading-relaxed mb-8">
              „{t.quote}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[14px] flex-none" style={{ background: "linear-gradient(135deg, #009BA9, #20296c)" }}>{t.initials}</div>
              <div className="text-left">
                <div className="font-bold text-white text-[15px]">{t.name}</div>
                <div className="text-[13px]" style={{ color: "#9aa0c9" }}>{t.role}</div>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-2 mb-16">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveT(i); setTKey(k => k + 1); }}
                className="rounded-full transition-all duration-400"
                style={{ width: i === activeT ? 28 : 8, height: 8, background: i === activeT ? "#009BA9" : "rgba(255,255,255,.25)" }}
                aria-label={`Referenz ${i + 1}`}
              />
            ))}
          </div>

          {/* Stats strip — contextual, not hero-metric template */}
          <div className="flex flex-wrap items-stretch justify-center gap-px pt-12 border-t border-white/10" style={{ borderTop: "1px solid rgba(255,255,255,.1)" }}>
            {[
              { value: "29+", label: "Jahre Erfahrung" },
              { value: "200+", label: "Projekte umgesetzt" },
              { value: "100%", label: "Weiterempfehlung" },
            ].map((s, i) => (
              <div key={s.label} className="flex-1 min-w-[120px] flex flex-col items-center py-6 px-4" data-reveal data-delay={String(i + 1)}>
                <CountUpStat value={s.value} label={s.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-white px-6 md:px-14 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14" data-reveal>
            <p className="text-[13px] font-bold tracking-[.1em] uppercase mb-3" style={{ color: "#009BA9" }}>Häufige Fragen</p>
            <h2 className="text-3xl md:text-[44px] font-extrabold text-[#1A1A1A] leading-[1.1] tracking-tight">
              Alles, was Sie wissen sollten
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} data-reveal data-delay={String((i % 3) + 1)}
                className="rounded-2xl overflow-hidden transition-all"
                style={{ border: "1.5px solid", borderColor: openFaq === i ? "#009BA9" : "#ECEEF4", background: openFaq === i ? "rgba(0,155,169,.02)" : "#fff" }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-[15px] text-[#1A1A1A] leading-snug">{q}</span>
                  <ChevronDown size={20} className="flex-none transition-transform duration-300" style={{ color: "#009BA9", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                <div className={`faq-content ${openFaq === i ? "open" : ""}`}>
                  <div className="px-6 pb-5">
                    <p className="text-[14px] text-[#6B7280] leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 md:px-14 py-24 text-center" style={{ background: "linear-gradient(120deg, #7C019C 0%, #5a1490 50%, #20296c 100%)" }}>
        <div className="absolute w-[500px] h-[500px] -right-24 -bottom-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,155,169,.25), transparent 70%)" }} />
        <div className="absolute w-[400px] h-[400px] -left-24 -top-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,.06), transparent 70%)" }} />
        <div className="relative max-w-2xl mx-auto" data-reveal>
          <p className="text-[13px] font-bold tracking-[.1em] uppercase mb-4 text-white/60">Starten Sie jetzt</p>
          <h2 className="text-4xl md:text-[52px] font-extrabold text-white leading-[1.08] tracking-tight mb-5">
            Bereit für nachhaltig<br className="hidden sm:block" /> mehr Sichtbarkeit?
          </h2>
          <p className="text-[18px] font-semibold mb-10" style={{ color: "rgba(255,255,255,.8)" }}>
            Mehr organische Anfragen. Mehr Umsatz. Mehr Wachstum — ohne Werbebudget.
          </p>
          <a href="#kontakt" className="inline-flex items-center gap-2 h-[56px] px-10 rounded-xl font-extrabold text-[16px] transition-all hover:-translate-y-0.5 hover:shadow-2xl" style={{ background: "#ffffff", color: "#7C019C", boxShadow: "0 14px 36px rgba(0,0,0,.2)" }}>
            Kostenloses Erstgespräch vereinbaren <ArrowRight size={16} />
          </a>
          <div className="flex flex-wrap justify-center gap-5 mt-10">
            {trustBadges.map(item => (
              <div key={item} className="flex items-center gap-2 font-semibold text-[14px]" style={{ color: "rgba(255,255,255,.85)" }}>
                <Check size={16} color="#5fe0ec" strokeWidth={2.5} /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ─────────────────────────────────────────────────────── */}
      <section id="kontakt" className="bg-white px-6 md:px-14 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-16 max-w-5xl mx-auto">

          {/* Form */}
          <div data-reveal>
            <p className="text-[13px] font-bold tracking-[.1em] uppercase mb-3" style={{ color: "#009BA9" }}>Kontakt aufnehmen</p>
            <h2 className="text-3xl md:text-[40px] font-extrabold text-[#1A1A1A] leading-[1.1] tracking-tight mb-3">
              Erzählen Sie uns von Ihrem Projekt
            </h2>
            <p className="text-[15px] text-[#6B7280] mb-8 leading-relaxed">
              Kostenlos und unverbindlich. Wir melden uns innerhalb eines Werktages bei Ihnen.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#1A1A1A]">Name *</label>
                  <input {...register("name")} type="text" placeholder="Ihr Name"
                    className="h-[50px] px-4 rounded-xl text-[15px] outline-none transition-all focus:ring-2 focus:ring-[#009BA9]"
                    style={{ border: `1.5px solid ${errors.name ? "#ef4444" : "#E2E5EE"}`, fontFamily: "inherit" }} />
                  {errors.name && <p className="text-red-500 text-[12px]">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#1A1A1A]">Firma *</label>
                  <input {...register("firma")} type="text" placeholder="Ihr Unternehmen"
                    className="h-[50px] px-4 rounded-xl text-[15px] outline-none transition-all focus:ring-2 focus:ring-[#009BA9]"
                    style={{ border: `1.5px solid ${errors.firma ? "#ef4444" : "#E2E5EE"}`, fontFamily: "inherit" }} />
                  {errors.firma && <p className="text-red-500 text-[12px]">{errors.firma.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#1A1A1A]">E-Mail *</label>
                  <input {...register("email")} type="email" placeholder="name@firma.de"
                    className="h-[50px] px-4 rounded-xl text-[15px] outline-none transition-all focus:ring-2 focus:ring-[#009BA9]"
                    style={{ border: `1.5px solid ${errors.email ? "#ef4444" : "#E2E5EE"}`, fontFamily: "inherit" }} />
                  {errors.email && <p className="text-red-500 text-[12px]">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#1A1A1A]">
                    Telefon <span className="text-[#9aa0c9] font-normal">(optional)</span>
                  </label>
                  <input {...register("phone")} type="tel" placeholder="+49 6103 59730"
                    className="h-[50px] px-4 rounded-xl text-[15px] outline-none transition-all"
                    style={{ border: "1.5px solid #E2E5EE", fontFamily: "inherit" }} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#1A1A1A]">Ihre Anfrage *</label>
                <textarea {...register("message")} rows={4}
                  placeholder="Was möchten Sie erreichen? Beschreiben Sie kurz Ihr Projekt oder Anliegen."
                  className="px-4 py-3 rounded-xl text-[15px] outline-none transition-all resize-y focus:ring-2 focus:ring-[#009BA9]"
                  style={{ border: `1.5px solid ${errors.message ? "#ef4444" : "#E2E5EE"}`, fontFamily: "inherit" }} />
                {errors.message && <p className="text-red-500 text-[12px]">{errors.message.message}</p>}
              </div>

              {/* DSGVO checkbox */}
              <div className="flex items-start gap-3">
                <input
                  {...register("privacy")}
                  type="checkbox"
                  id="privacy"
                  className="w-4 h-4 mt-0.5 rounded flex-none cursor-pointer"
                  style={{ accentColor: "#009BA9" }}
                />
                <label htmlFor="privacy" className="text-[13px] text-[#6B7280] leading-relaxed cursor-pointer">
                  Ich habe die{" "}
                  <a href="#" className="font-semibold hover:underline" style={{ color: "#20296c" }}>Datenschutzerklärung</a>
                  {" "}gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu. *
                </label>
              </div>
              {errors.privacy && <p className="text-red-500 text-[12px] -mt-3">{errors.privacy.message}</p>}

              <button type="submit"
                className="h-[52px] rounded-xl font-bold text-[15px] text-white transition-all hover:brightness-110 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{ background: "#7C019C", boxShadow: "0 8px 24px rgba(124,1,156,.28)" }}
              >
                Nachricht senden <ArrowRight size={16} />
              </button>

              <p className="text-[12px] text-[#9aa0c9]">* Pflichtfelder · Ihre Daten werden vertraulich behandelt und nicht weitergegeben.</p>

              {sent && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-[14px]" style={{ background: "rgba(0,155,169,.08)", color: "#007a86" }}>
                  <Check size={18} strokeWidth={2.5} /> Vielen Dank! Wir melden uns innerhalb eines Werktages bei Ihnen.
                </div>
              )}
            </form>
          </div>

          {/* Contact info card */}
          <div className="rounded-2xl p-8 text-white flex flex-col" style={{ background: "linear-gradient(155deg, #20296c 0%, #161d54 100%)" }} data-reveal data-delay="2">
            <h3 className="font-extrabold text-[20px] mb-1">Anders &amp; Seim</h3>
            <p className="text-[14px] mb-8" style={{ color: "#9aa0c9" }}>Neue Medien · Internetagentur</p>

            <div className="flex flex-col gap-5 flex-1">
              {[
                { Icon: MapPin, label: "Langen, Hessen", sub: "Region Frankfurt am Main" },
                { Icon: Phone, label: "06103 59730", sub: "Mo–Fr, 9–17 Uhr" },
                { Icon: Mail, label: "hallo@andersundseim.de", sub: "Antwort meist noch am selben Tag" },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-none" style={{ background: "rgba(0,155,169,.12)" }}>
                    <Icon size={18} color="#5fe0ec" strokeWidth={1.9} />
                  </div>
                  <div>
                    <div className="font-semibold text-[14px]">{label}</div>
                    <div className="text-[13px]" style={{ color: "#c7cbe6" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,.1)" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#FFB400] tracking-[2px] text-[15px]">★★★★★</span>
                <span className="font-bold text-[13px]">5,00 / 5,00</span>
              </div>
              <span className="font-semibold text-[12px] tracking-wider" style={{ color: "#9aa0c9" }}>100% Weiterempfehlung · ProvenExpert</span>
            </div>

            <a href="#kontakt" className="mt-6 flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-[14px] text-white transition-all hover:brightness-110"
              style={{ background: "rgba(0,155,169,.18)", border: "1px solid rgba(0,155,169,.35)" }}>
              <Building2 size={16} color="#5fe0ec" />
              Kostenloses Erstgespräch buchen
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-14 pt-14 pb-8" style={{ background: "#161d54" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 max-w-5xl mx-auto">
          <div>
            <button onClick={scrollToTop} className="mb-4 flex" aria-label="Zur Startseite">
              <Image src="/images/logo-white.png" alt="Anders & Seim Internetagentur" width={130} height={32} className="h-[30px] w-auto" />
            </button>
            <p className="text-[13px] leading-relaxed max-w-[260px]" style={{ color: "#9aa0c9" }}>
              Wunderbar wirksame Websites — Webdesign, SEO, GEO und Online-Marketing für KMU in Deutschland, Österreich und der Schweiz.
            </p>
          </div>
          <div>
            <div className="font-bold text-[13px] text-white mb-4 tracking-wider uppercase">Leistungen</div>
            <div className="flex flex-col gap-2.5">
              {["Webdesign & Entwicklung", "SEO", "GEO (KI-Sichtbarkeit)", "Online-Marketing", "E-Commerce"].map(l => (
                <a key={l} href="#leistungen" className="text-[13px] hover:text-white transition-colors" style={{ color: "#9aa0c9" }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-bold text-[13px] text-white mb-4 tracking-wider uppercase">Unternehmen</div>
            <div className="flex flex-col gap-2.5">
              {[["Über uns", "#vorteile"], ["Referenzen", "#referenzen"], ["FAQ", "#faq"], ["Kontakt", "#kontakt"]].map(([l, h]) => (
                <a key={l} href={h} className="text-[13px] hover:text-white transition-colors" style={{ color: "#9aa0c9" }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-bold text-[13px] text-white mb-4 tracking-wider uppercase">Kontakt</div>
            <div className="flex flex-col gap-2.5 text-[13px]" style={{ color: "#9aa0c9" }}>
              <span>Langen, Hessen</span>
              <a href="tel:+4961035930" className="hover:text-white transition-colors">06103 59730</a>
              <a href="mailto:hallo@andersundseim.de" className="hover:text-white transition-colors">hallo@andersundseim.de</a>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between max-w-5xl mx-auto mt-10 pt-6 gap-3" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <span className="text-[12px]" style={{ color: "#7c83b5" }}>© 2026 Anders &amp; Seim · Neue Medien · Langen (Hessen)</span>
          <div className="flex gap-5">
            {["Impressum", "Datenschutz"].map(l => (
              <a key={l} href="#" className="text-[12px] hover:text-white transition-colors" style={{ color: "#7c83b5" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
