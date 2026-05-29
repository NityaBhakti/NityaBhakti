/* app.jsx — sitio NityaBhaktii */
const { useState:useS } = React;
const IMG = "https://jesussgonzalez.github.io/Proyecto-Coderhouse/Imagenes/";
const WA = "https://wa.me/5491154056339";
const IG = "https://www.instagram.com/_u/nitya_baktii_2023/?hl=es";

const THERAPY_LONG = {
  coach:"Disciplina filosófica aplicada que ayuda a transformar tu forma de ser y de actuar, cuestionando la percepción de la realidad, el lenguaje y las emociones para generar cambios profundos.",
  meditacion:"Práctica milenaria de entrenamiento mental y corporal que calma la mente, reduce el estrés y fomenta la paz interior a través de la atención plena.",
  reiki:"Terapia japonesa de imposición de manos que canaliza la energía vital universal para equilibrar cuerpo, mente y espíritu, y apoyar la sanación natural del organismo.",
  sonido:"Baño de sonido con cuencos tibetanos y de cuarzo: vibraciones y armónicos que inducen relajación profunda y reequilibran tu campo energético.",
};

function Nav({onBook}){
  return (
    <nav className="nav">
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#inicio">
          <img src={IMG+"logo-navegacion.png"} alt="Nitya Bhaktii"/>
          Nitya Bhaktii
        </a>
        <div className="nav__links">
          <a href="#sobre-mi">¿Quién soy?</a>
          <a href="#terapias">Terapias</a>
          <a href="#turnos">Turnos</a>
          <a className="btn btn--primary nav__cta" href="#turnos" onClick={onBook}>Pedir turno</a>
        </div>
      </div>
    </nav>
  );
}

function Hero({onBook}){
  return (
    <header className="hero" id="inicio">
      <div className="wrap hero__grid">
        <div>
          <span className="eyebrow">Acompañamiento multidimensional</span>
          <h1 style={{marginTop:18}}>Conectando<br/>con tu <em>ser</em></h1>
          <p className="hero__sub">Coaching ontológico, meditación, reiki y terapia con sonido para recuperar tu equilibrio y diseñar tu propia vida. Sesiones online, donde estés.</p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#turnos" onClick={onBook}>Pedir un turno</a>
            <a className="btn btn--ghost" href="#terapias">Conocer las terapias</a>
          </div>
        </div>
        <div className="hero__art">
          <div className="hero__lotus"><img src={IMG+"logo-principal.png"} alt="Flor de loto Nitya Bhaktii"/></div>
          <div className="hero__chips">
            <div className="chip-float" style={{top:"8%",left:"-2%"}}><span className="dot" style={{background:"var(--salvia)"}}></span>100% Online</div>
            <div className="chip-float" style={{bottom:"12%",right:"-4%"}}><span className="dot" style={{background:"var(--dorado)"}}></span>4 terapias</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function About(){
  const [open,setOpen]=useS(false);
  const creds=["Lic. en Psicología","Lic. en Enfermería","Coach Ontológica","Instructora de Yoga","Máster Reiki Usui","Máster Reiki Karuna","Terapeuta en Cuencos"];
  return (
    <section className="section about" id="sobre-mi">
      <div className="wrap about__grid">
        <div className="about__photo">
          <img src={IMG+"Nadia-en-foto-de-Perfil.png"} alt="Nadia Cañete"/>
          <div className="about__badge"><b>15+</b><span>años acompañando procesos de salud y transformación</span></div>
        </div>
        <div>
          <span className="eyebrow">¿Quién soy?</span>
          <h2 style={{marginTop:16}}>Hola, soy Nadia Cañete</h2>
          <p>Te cuento el recorrido que hice y el que la vida me fue llevando. Mi primera profesión, durante 15 años, fue como Licenciada en Enfermería. Mientras trabajaba sentí la necesidad de conocer la mente: cuidar solo el cuerpo físico no me alcanzaba, por eso estudié y me recibí de Licenciada en Psicología.</p>
          <div className={"about__more"+(open?" open":"")}>
            <p>Con los años quise conocer el mundo del Coaching y por dos años y medio realicé mi proceso de transformación en la Escuela de Manu Colombo Mov, donde recibí mi certificación de Coach Ontológica. En el camino me formé en distintas terapias complementarias: Instructora de Yoga, Máster en Reiki Usui y Karuna, Terapeuta en Cuencos Sonoros y sanación con manos y voz.</p>
            <p>Hoy acompaño a las personas a transformar su vida teniendo en cuenta nuestros tres dominios —el lenguaje, las emociones y el cuerpo— sumando el cuerpo energético, muchas veces dejado de lado. Te invito a conocerte más y a expandirte sin límites.</p>
          </div>
          <button className="about__toggle" onClick={()=>setOpen(o=>!o)}>{open?"Ver menos ▲":"Ver más ▼"}</button>
          <div className="creds">{creds.map(c=><span className="cred" key={c}>{c}</span>)}</div>
        </div>
      </div>
    </section>
  );
}

function Therapies({onBook}){
  return (
    <section className="section section--wash" id="terapias">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Terapias</span>
          <h2>Caminos para reconectar</h2>
          <p className="lead" style={{margin:"0 auto"}}>Cuatro disciplinas que integran mente, cuerpo y energía. Elegí la que resuene con vos y reservá tu sesión online.</p>
        </div>
        <div className="therapy-grid">
          {THERAPIES.map(t=>(
            <article className="therapy" key={t.key}>
              <div className="therapy__ic"><TherapyIcon k={t.key}/></div>
              <h3>{t.name}</h3>
              <p>{THERAPY_LONG[t.key]}</p>
              <div className="therapy__foot">
                <span className="therapy__meta">● Online · {t.dur}</span>
                <button className="therapy__book" onClick={()=>onBook(t.key)}>Pedir turno →</button>
              </div>
            </article>
          ))}
        </div>
        <div className="strip">
          <img src={IMG+"Nadia-meditando-en-provincia-de-entre-rios.png"} alt=""/>
          <img src={IMG+"Nadia-pose-de-yoga-en-el-rio.png"} alt=""/>
          <img src={IMG+"Nadia-en-paisaje.png"} alt=""/>
          <img src={IMG+"Nadia-en-la-monta%C3%B1a.png"} alt=""/>
        </div>
      </div>
    </section>
  );
}

function BookingSection({flow,preselect}){
  const live = window.agendaLive && window.agendaLive();
  return (
    <section className="section booking" id="turnos">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Pedí tu turno</span>
          <h2>Reservá tu sesión online</h2>
          <p className="lead" style={{margin:"0 auto"}}>Elegí terapia, día y horario. Te confirmo personalmente por WhatsApp.</p>
          <div className="agenda-status" title={live?"Los turnos se sincronizan con Google Calendar":"Demostración: los turnos se guardan sólo en este navegador"}>
            <span className={"agenda-dot"+(live?" live":"")}></span>
            {live?"Agenda sincronizada con Google Calendar":"Modo demostración"}
          </div>
        </div>
        {flow==="split"   && <FlowSplit preselect={preselect}/>}
        {flow==="wizard"  && <FlowWizard preselect={preselect}/>}
        {flow==="compact" && <FlowCompact preselect={preselect}/>}
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div>
          <div className="footer__brand"><img src={IMG+"logo-navegacion.png"} alt=""/>Nitya Bhaktii</div>
          <p>Un espacio de acompañamiento multidimensional para recuperar tu equilibrio y coherencia. Conectando con tu ser.</p>
          <div className="footer__social">
            <a href={IG} target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="#fff" stroke="none"/></svg>
            </a>
            <a href={WA} target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.8-.1 1.4Z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4>Navegación</h4>
          <div className="footer__links">
            <a href="#sobre-mi">¿Quién soy?</a>
            <a href="#terapias">Terapias</a>
            <a href="#turnos">Pedir turno</a>
          </div>
        </div>
        <div>
          <h4>Terapias</h4>
          <div className="footer__links">
            {THERAPIES.map(t=><a key={t.key} href="#terapias">{t.name}</a>)}
          </div>
        </div>
      </div>
      <div className="wrap footer__bottom">
        <span>© 2026 Nitya Bhaktii · Conectando con tu ser</span>
        <span>Sesiones online · Argentina</span>
      </div>
    </footer>
  );
}

Object.assign(window,{ Nav, Hero, About, Therapies, BookingSection, Footer });
