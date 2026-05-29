/* booking.jsx — flujo de turnos NityaBhaktii (3 variaciones) */
const { useState, useMemo } = React;

/* ---------- Datos ---------- */
const THERAPIES = [
  { key:"coach",     name:"Coach Ontológico",  dur:"60 min", desc:"Transformá tu forma de ser y actuar." },
  { key:"meditacion",name:"Meditación",        dur:"45 min", desc:"Calmá la mente y volvé al presente." },
  { key:"reiki",     name:"Reiki",             dur:"60 min", desc:"Equilibrá cuerpo, mente y espíritu." },
  { key:"sonido",    name:"Terapia con Sonido",dur:"50 min", desc:"Armonizá tu energía con cuencos." },
];

const SLOT_TIMES = ["08:30","10:00","11:30","13:00"];
const DOW = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

/* ---- turnos ya reservados (persisten en el navegador) ---- */
const BOOKED_KEY = "nb_turnos_reservados";
function getBooked(){
  try{ return JSON.parse(localStorage.getItem(BOOKED_KEY)||"[]"); }catch(e){ return []; }
}
function isBooked(dateStr,time){ return getBooked().includes(dateStr+"|"+time); }
function addBooked(dateStr,time){
  const b = getBooked(); const k = dateStr+"|"+time;
  if(!b.includes(k)){ b.push(k); localStorage.setItem(BOOKED_KEY, JSON.stringify(b)); }
}

/* disponibilidad base determinística (sólo para MODO DEMO, da sensación de agenda real) */
function slotBaseOpen(dateStr, time){
  let h = 0; const s = dateStr + time;
  for (let i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i)) % 997; }
  return h % 5 !== 0; // ~20% ocupados
}

function TherapyIcon({k}){
  const c = "var(--lavanda-700)";
  const common = {width:26,height:26,viewBox:"0 0 24 24",fill:"none",stroke:c,strokeWidth:1.6,strokeLinecap:"round",strokeLinejoin:"round"};
  if(k==="coach")     return <svg {...common}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>;
  if(k==="meditacion")return <svg {...common}><path d="M3 17a9 9 0 0 1 18 0"/><circle cx="12" cy="8" r="2.4"/></svg>;
  if(k==="reiki")     return <svg {...common}><path d="M12 4v3M12 4l-2 2M12 4l2 2"/><path d="M5 13c0 4 3.5 7 7 7s7-3 7-7c0-2-3-2-3 0"/><path d="M9 13c0-2-3-2-3 0"/></svg>;
  return <svg {...common}><path d="M5 12a7 7 0 0 1 14 0"/><path d="M8 12a4 4 0 0 1 8 0"/><circle cx="12" cy="12" r="1"/></svg>;
}

/* ---------- Calendario ---------- */
function Calendar({ value, onPick, viewDate, setViewDate }){
  const today = new Date(2026,4,29); today.setHours(0,0,0,0);
  const y = viewDate.getFullYear(), m = viewDate.getMonth();
  const first = new Date(y,m,1);
  const startDow = (first.getDay()+6)%7; // lunes=0
  const daysIn = new Date(y,m+1,0).getDate();
  const cells = [];
  for(let i=0;i<startDow;i++) cells.push(null);
  for(let d=1;d<=daysIn;d++) cells.push(d);

  const fmt = (d)=>`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const canPrev = new Date(y,m,1) > new Date(today.getFullYear(),today.getMonth(),1);

  return (
    <div className="cal">
      <div className="cal__head">
        <b>{MONTHS[m]} {y}</b>
        <div className="cal__nav">
          <button disabled={!canPrev} onClick={()=>setViewDate(new Date(y,m-1,1))} aria-label="Mes anterior">‹</button>
          <button onClick={()=>setViewDate(new Date(y,m+1,1))} aria-label="Mes siguiente">›</button>
        </div>
      </div>
      <div className="cal__dow">{DOW.map(d=><span key={d}>{d}</span>)}</div>
      <div className="cal__grid">
        {cells.map((d,i)=>{
          if(d===null) return <div key={i} className="cal__cell empty"/>;
          const date = new Date(y,m,d); date.setHours(0,0,0,0);
          const ds = fmt(d);
          // Días sin atención: Lunes(1), Miércoles(3), Sábado(6), Domingo(0). Se atiende Mar/Jue/Vie.
          const cerrado = [0,1,3,6].includes(date.getDay());
          const past = date < today;
          const disabled = past || cerrado;
          const isToday = +date === +today;
          return (
            <button key={i} disabled={disabled}
              className={"cal__cell"+(value===ds?" sel":"")+(isToday?" today":"")}
              onClick={()=>onPick(ds)}>{d}</button>
          );
        })}
      </div>
    </div>
  );
}

function Slots({ date, value, onPick, taken=[], loading=false }){
  if(!date) return <div className="slots__empty">Elegí un día para ver los horarios disponibles.</div>;
  if(loading) return <div className="slots__empty">Cargando disponibilidad…</div>;
  const live = window.agendaLive && window.agendaLive();
  const allTaken = SLOT_TIMES.every(t=> taken.includes(t) || (!live && !slotBaseOpen(date,t)));
  if(allTaken) return <div className="slots__empty">No quedan horarios libres este día. Probá otra fecha.</div>;
  return (
    <div className="slots">
      {SLOT_TIMES.map(t=>{
        const closed = taken.includes(t) || (!live && !slotBaseOpen(date,t));
        return (
          <button key={t} disabled={closed}
            className={"slot"+(value===t?" sel":"")}
            onClick={()=>onPick(t)}>{t}</button>
        );
      })}
    </div>
  );
}

function TherapyPicker({ value, onPick }){
  return (
    <div className="therapy-pick">
      {THERAPIES.map(t=>(
        <button key={t.key} className={"tp"+(value===t.key?" sel":"")} onClick={()=>onPick(t.key)}>
          <span className="tp__ic"><TherapyIcon k={t.key}/></span>
          <span className="tp__t"><b>{t.name}</b><span>{t.dur} · Online</span></span>
        </button>
      ))}
    </div>
  );
}

/* validación simple */
function useForm(){
  const [data,setData] = useState({nombre:"",tel:"",email:""});
  const [err,setErr] = useState({});
  const set = (k,v)=>{ setData(d=>({...d,[k]:v})); setErr(e=>({...e,[k]:null})); };
  const validate = ()=>{
    const e={};
    if(!data.nombre.trim()) e.nombre="Ingresá tu nombre";
    if(!/^[\d\s()+-]{6,}$/.test(data.tel)) e.tel="Teléfono inválido";
    if(!/^\S+@\S+\.\S+$/.test(data.email)) e.email="Email inválido";
    setErr(e); return Object.keys(e).length===0;
  };
  return {data,set,err,validate};
}

function DataFields({form}){
  const {data,set,err} = form;
  return (
    <>
      <div className={"field"+(err.nombre?" field--err":"")}>
        <label>Nombre y apellido</label>
        <input value={data.nombre} onChange={e=>set("nombre",e.target.value)} placeholder="Tu nombre"/>
        {err.nombre&&<div className="field__err">{err.nombre}</div>}
      </div>
      <div className="row2">
        <div className={"field"+(err.tel?" field--err":"")}>
          <label>Teléfono / WhatsApp</label>
          <input value={data.tel} onChange={e=>set("tel",e.target.value)} placeholder="+54 9 11 ..."/>
          {err.tel&&<div className="field__err">{err.tel}</div>}
        </div>
        <div className={"field"+(err.email?" field--err":"")}>
          <label>Email</label>
          <input value={data.email} onChange={e=>set("email",e.target.value)} placeholder="tu@email.com"/>
          {err.email&&<div className="field__err">{err.email}</div>}
        </div>
      </div>
    </>
  );
}

function prettyDate(ds){
  if(!ds) return "—";
  const [y,m,d]=ds.split("-").map(Number);
  const dt=new Date(y,m-1,d);
  return `${DOW[(dt.getDay()+6)%7]} ${d} de ${MONTHS[m-1]}`;
}

function Confirm({ therapy, date, time, data, onReset }){
  const t = THERAPIES.find(x=>x.key===therapy);
  const msg =
    `¡Hola Nadia! Quiero solicitar un turno 🙏\n\n`+
    `• Terapia: ${t?.name} (Online · ${t?.dur})\n`+
    `• Día: ${prettyDate(date)}\n`+
    `• Horario: ${time} hs\n`+
    `• Nombre: ${data.nombre}\n`+
    `• Teléfono: ${data.tel}\n`+
    `• Email: ${data.email}`;
  const waHref = `https://wa.me/5491154056339?text=${encodeURIComponent(msg)}`;
  return (
    <div className="confirm">
      <div className="confirm__check">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--lavanda)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
      </div>
      <h3>¡Turno reservado!</h3>
      <p>Listo {data.nombre.split(" ")[0]}. Tu horario quedó bloqueado en la agenda. Enviá el resumen por WhatsApp para que te confirme la sesión.</p>
      <div className="confirm__summary">
        <div className="confirm__row"><span>Terapia</span><b>{t?.name}</b></div>
        <div className="confirm__row"><span>Modalidad</span><b>Online · {t?.dur}</b></div>
        <div className="confirm__row"><span>Día</span><b>{prettyDate(date)}</b></div>
        <div className="confirm__row"><span>Horario</span><b>{time} hs</b></div>
        <div className="confirm__row"><span>A nombre de</span><b>{data.nombre}</b></div>
      </div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        <a className="btn btn--primary" href={waHref} target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.8-.1 1.4Z"/></svg>
          Enviar por WhatsApp
        </a>
        <button className="btn btn--ghost" onClick={onReset}>Pedir otro turno</button>
      </div>
    </div>
  );
}

Object.assign(window,{ THERAPIES, SLOT_TIMES, Calendar, Slots, TherapyPicker, useForm, DataFields, Confirm, prettyDate, TherapyIcon, slotBaseOpen, addBooked, isBooked, getBooked });
