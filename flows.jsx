/* flows.jsx — 3 variaciones del flujo de turnos (conectado a la agenda) */
const { useState:useStateF } = React;

/* utilidades compartidas */
function useBooking(preselect){
  const [therapy,setTherapy] = useStateF(preselect||null);
  const [date,setDate] = useStateF(null);
  const [time,setTime] = useStateF(null);
  const [viewDate,setViewDate] = useStateF(new Date(2026,4,1));
  const [taken,setTaken] = useStateF([]);
  const [loadingSlots,setLoadingSlots] = useStateF(false);
  const [submitting,setSubmitting] = useStateF(false);
  const [error,setError] = useStateF(null);
  const [done,setDone] = useStateF(false);
  const form = window.useForm();

  const selectDate = async (d)=>{
    setDate(d); setTime(null); setError(null); setLoadingSlots(true);
    try{ setTaken(await window.fetchTaken(d)); }
    catch(e){ setTaken([]); }
    setLoadingSlots(false);
  };

  const doBook = async ()=>{
    if(submitting) return;
    const t = THERAPIES.find(x=>x.key===therapy);
    setSubmitting(true); setError(null);
    try{
      const res = await window.bookTurno({
        therapy, therapyName:t&&t.name, dur:t&&t.dur,
        date, time, nombre:form.data.nombre, tel:form.data.tel, email:form.data.email
      });
      if(res && res.ok){ setDone(true); }
      else if(res && res.taken){ setError("Ese horario se acaba de ocupar. Elegí otro, por favor."); selectDate(date); }
      else { setError("No pudimos reservar el turno. Intentá de nuevo."); }
    }catch(e){ setError("Error de conexión. Revisá tu internet e intentá otra vez."); }
    setSubmitting(false);
  };

  const reset = ()=>{ setTherapy(null);setDate(null);setTime(null);setTaken([]);setDone(false);setError(null);
    form.set("nombre","");form.set("tel","");form.set("email",""); };
  return {therapy,setTherapy,date,setDate,time,setTime,viewDate,setViewDate,
    taken,loadingSlots,submitting,error,setError,selectDate,doBook,done,setDone,form,reset};
}

function FootError({b}){
  if(!b.error) return null;
  return <div style={{background:"#fbe9ee",color:"#b1455f",borderRadius:12,padding:"11px 15px",fontSize:13.5,fontWeight:600,marginTop:16}}>{b.error}</div>;
}

/* =================================================================
   VARIACIÓN 1 — "Asistida": panel lateral con pasos guiados
   ================================================================= */
function FlowSplit({preselect}){
  const b = useBooking(preselect);
  const [step,setStep] = useStateF(preselect?1:0);
  const steps = [
    {t:"Elegí tu terapia",s:"4 disciplinas online"},
    {t:"Día y horario",s:"Agenda en tiempo real"},
    {t:"Tus datos",s:"Para confirmarte"},
  ];
  if(b.done) return <div className="booking__card"><div className="bk-body"><Confirm therapy={b.therapy} date={b.date} time={b.time} data={b.form.data} onReset={()=>{b.reset();setStep(0);}}/></div></div>;

  const next = ()=>{
    if(step===0 && !b.therapy) return;
    if(step===1 && !(b.date&&b.time)) return;
    if(step===2){ if(b.form.validate()) b.doBook(); return; }
    setStep(s=>s+1);
  };
  return (
    <div className="booking__card">
      <div className="bk-split">
        <aside className="bk-aside">
          <h3>Reservá tu sesión</h3>
          <p>Un espacio para reconectar con tu ser. Todas las sesiones son online, donde estés.</p>
          <div className="bk-aside__steps">
            {steps.map((s,i)=>(
              <div key={i} className={"bk-step"+(i===step?" active":"")+(i<step?" done":"")}>
                <div className="bk-step__n">{i<step?"✓":i+1}</div>
                <div className="bk-step__t"><b>{s.t}</b><span>{s.s}</span></div>
              </div>
            ))}
          </div>
        </aside>
        <div className="bk-body">
          {step===0 && <>
            <div className="field-label">¿Qué terapia querés reservar?</div>
            <TherapyPicker value={b.therapy} onPick={k=>{b.setTherapy(k);}}/>
          </>}
          {step===1 && <>
            <div className="field-label">Elegí día y horario</div>
            <Calendar value={b.date} onPick={b.selectDate} viewDate={b.viewDate} setViewDate={b.setViewDate}/>
            <div style={{marginTop:18}}><Slots date={b.date} value={b.time} onPick={t=>b.setTime(t)} taken={b.taken} loading={b.loadingSlots}/></div>
          </>}
          {step===2 && <>
            <div className="field-label">Completá tus datos</div>
            <DataFields form={b.form}/>
          </>}
          <FootError b={b}/>
          <div className="bk-foot">
            {step>0 ? <button className="btn btn--ghost" onClick={()=>setStep(s=>s-1)}>Volver</button> : <span/>}
            <button className="btn btn--primary" disabled={(step===0&&!b.therapy)||(step===1&&!(b.date&&b.time))||b.submitting} onClick={next}>
              {step===2?(b.submitting?"Reservando…":"Solicitar turno"):"Continuar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   VARIACIÓN 2 — "Wizard": pasos a pantalla completa con progreso
   ================================================================= */
function FlowWizard({preselect}){
  const b = useBooking(preselect);
  const [step,setStep] = useStateF(preselect?1:0);
  if(b.done) return <div className="booking__card"><div className="bk-body"><Confirm therapy={b.therapy} date={b.date} time={b.time} data={b.form.data} onReset={()=>{b.reset();setStep(0);}}/></div></div>;
  const titles=["Elegí tu terapia","Seleccioná día y horario","Dejanos tus datos"];
  const next=()=>{
    if(step===0&&!b.therapy)return;
    if(step===1&&!(b.date&&b.time))return;
    if(step===2){ if(b.form.validate()) b.doBook(); return;}
    setStep(s=>s+1);
  };
  return (
    <div className="booking__card">
      <div className="bk-body">
        <div className="stepper">
          {[0,1,2].map(i=><div key={i} className={"stepper__seg"+(i<=step?" fill":"")}><i/></div>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
          <h3 style={{fontSize:30}}>{titles[step]}</h3>
          <span style={{fontSize:13,fontWeight:700,color:"var(--tinta-soft)"}}>Paso {step+1} de 3</span>
        </div>
        <div style={{marginTop:14,minHeight:300}}>
          {step===0 && <TherapyPicker value={b.therapy} onPick={k=>b.setTherapy(k)}/>}
          {step===1 && <div className="bk-compact__grid" style={{gap:30}}>
            <div><Calendar value={b.date} onPick={b.selectDate} viewDate={b.viewDate} setViewDate={b.setViewDate}/></div>
            <div><h4 style={{fontFamily:"var(--sans)",fontSize:13,letterSpacing:".06em",textTransform:"uppercase",color:"var(--lavanda)",margin:"0 0 14px"}}>Horarios — {b.date?prettyDate(b.date):"elegí un día"}</h4>
              <Slots date={b.date} value={b.time} onPick={t=>b.setTime(t)} taken={b.taken} loading={b.loadingSlots}/></div>
          </div>}
          {step===2 && <div style={{maxWidth:560}}><DataFields form={b.form}/></div>}
        </div>
        <FootError b={b}/>
        <div className="bk-foot">
          {step>0 ? <button className="btn btn--ghost" onClick={()=>setStep(s=>s-1)}>Volver</button> : <span/>}
          <button className="btn btn--primary" disabled={(step===0&&!b.therapy)||(step===1&&!(b.date&&b.time))||b.submitting} onClick={next}>
            {step===2?(b.submitting?"Reservando…":"Solicitar turno"):"Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   VARIACIÓN 3 — "Express": todo en una pantalla
   ================================================================= */
function FlowCompact({preselect}){
  const b = useBooking(preselect);
  if(b.done) return <div className="booking__card"><div className="bk-body"><Confirm therapy={b.therapy} date={b.date} time={b.time} data={b.form.data} onReset={b.reset}/></div></div>;
  const ready = b.therapy && b.date && b.time;
  const submit=()=>{ if(!ready) return; if(b.form.validate()) b.doBook(); };
  return (
    <div className="booking__card">
      <div className="bk-compact">
        <div className="bk-compact__grid">
          <div className="bk-compact__col">
            <h4>1 · Terapia</h4>
            <div className="therapy-pick" style={{gridTemplateColumns:"1fr"}}>
              {THERAPIES.map(t=>(
                <button key={t.key} className={"tp"+(b.therapy===t.key?" sel":"")} onClick={()=>b.setTherapy(t.key)}>
                  <span className="tp__ic"><TherapyIcon k={t.key}/></span>
                  <span className="tp__t"><b>{t.name}</b><span>{t.dur} · Online</span></span>
                </button>
              ))}
            </div>
            <h4 style={{marginTop:26}}>3 · Tus datos</h4>
            <DataFields form={b.form}/>
          </div>
          <div className="bk-compact__col">
            <h4>2 · Día y horario</h4>
            <Calendar value={b.date} onPick={b.selectDate} viewDate={b.viewDate} setViewDate={b.setViewDate}/>
            <div style={{marginTop:16}}><Slots date={b.date} value={b.time} onPick={t=>b.setTime(t)} taken={b.taken} loading={b.loadingSlots}/></div>
            <FootError b={b}/>
            <button className="btn btn--primary btn--block" style={{marginTop:20}} disabled={!ready||b.submitting} onClick={submit}>
              {b.submitting?"Reservando…":(ready?`Solicitar — ${prettyDate(b.date)}, ${b.time} hs`:"Completá los pasos")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window,{ FlowSplit, FlowWizard, FlowCompact });
