/* agenda.js — capa de conexión con Google Calendar (vía Google Apps Script)
   Si NB_AGENDA.endpoint está vacío, funciona en MODO DEMO (guarda en este navegador).
   Cuando pegues la URL del Apps Script, los turnos se sincronizan en tu Google Calendar
   y los horarios ocupados se bloquean para TODOS los visitantes. */

window.NB_AGENDA = window.NB_AGENDA || { endpoint: "" };

function agendaLive(){ return !!(window.NB_AGENDA && window.NB_AGENDA.endpoint); }

/* Horarios ocupados de un día -> array de strings "HH:MM" */
async function fetchTaken(dateStr){
  const ep = (window.NB_AGENDA && window.NB_AGENDA.endpoint) || "";
  if(!ep){
    // modo demo: lee los turnos guardados localmente
    return (window.getBooked ? window.getBooked() : [])
      .filter(k => k.indexOf(dateStr + "|") === 0)
      .map(k => k.split("|")[1]);
  }
  const url = ep + (ep.indexOf("?") >= 0 ? "&" : "?") + "action=taken&date=" + encodeURIComponent(dateStr);
  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  return Array.isArray(data.taken) ? data.taken : [];
}

/* Crea el turno. payload: {therapy, therapyName, dur, date, time, nombre, tel, email} */
async function bookTurno(payload){
  const ep = (window.NB_AGENDA && window.NB_AGENDA.endpoint) || "";
  if(!ep){
    // modo demo
    if(window.addBooked) window.addBooked(payload.date, payload.time);
    await new Promise(r => setTimeout(r, 450)); // simula latencia
    return { ok: true, demo: true };
  }
  // text/plain evita el preflight CORS con Apps Script
  const res = await fetch(ep, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(Object.assign({ action: "book" }, payload))
  });
  return await res.json();
}

Object.assign(window, { agendaLive, fetchTaken, bookTurno });
