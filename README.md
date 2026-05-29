# Nitya Bhaktii — Sitio web

Sitio web de **Nadia Cañete** (Nitya Bhaktii): acompañamiento multidimensional con coaching ontológico, meditación, reiki y terapia con sonido. Página de una sola sección (*one-page*) con **sistema de turnos online** integrable a Google Calendar.

> **Conectando con tu ser.**

---

## 📑 Contenido de la página

Una sola página (`index.html`) con estas secciones:

1. **Inicio (Hero)** — presentación de marca con el logo de la flor de loto.
2. **¿Quién soy?** — biografía de Nadia + sus certificaciones, con "Ver más".
3. **Terapias** — las 4 disciplinas (Coach Ontológico, Meditación, Reiki, Terapia con Sonido), todas online. Cada una tiene un botón "Pedir turno".
4. **Pedí tu turno** — calendario para reservar sesiones (ver más abajo).
5. **Footer** — Instagram, WhatsApp y navegación.

> La sección de *Productos Artesanales* fue eliminada.

---

## 🗂️ Archivos del proyecto

| Archivo | Qué es |
|---|---|
| `index.html` | Página principal. Carga todo y contiene la **configuración** (URL de la agenda, ver abajo). |
| `styles.css` | Todos los estilos: paleta de colores, tipografías, layout. |
| `app.jsx` | Estructura del sitio: hero, ¿quién soy?, terapias, footer. |
| `booking.jsx` | Componentes de turnos: calendario, horarios, selección de terapia, formulario, confirmación. |
| `flows.jsx` | Las 3 variaciones del flujo de reserva. |
| `agenda.js` | Conexión con Google Calendar (o modo demo). |
| `tweaks-panel.jsx` | Panel de ajustes en pantalla (colores, fuente, flujo). |
| `CONFIGURAR-GOOGLE-CALENDAR.md` | Guía paso a paso para sincronizar los turnos con tu Google Calendar. |

---

## 🎨 Identidad visual

Tomada del logo original (flor de loto sobre lavanda):

- **Lavanda** `#8f6fc0` (color principal) · lila claro `#b89dde`
- **Rosa pétalo** `#ecc7dd` · **Dorado loto** `#e0ab6e` · **Verde salvia** `#9aae8d`
- **Texto** ciruela `#2d2540` · fondos crema/lila `#faf7fd` y `#f3ecfa`
- **Tipografías:** Cormorant Garamond (títulos) + Mulish (texto)

Los logos y las fotos se cargan desde el sitio original alojado en GitHub.

---

## 🗓️ Sistema de turnos

- **Modalidad:** todas las sesiones son **online**.
- **Días de atención:** **Martes, Jueves y Viernes** (Lunes, Miércoles, Sábado y Domingo están anulados).
- **Datos que completa el cliente:** terapia, día, horario, nombre, teléfono/WhatsApp y email.
- **Al confirmar:**
  - El horario queda **bloqueado** para que no se vuelva a reservar.
  - Se abre **WhatsApp** con el resumen del turno listo para enviarte.

### 3 variaciones del flujo (cambiables desde el panel *Tweaks*)
1. **Asistido** — panel lateral con pasos guiados.
2. **Wizard** — pasos a pantalla completa con barra de progreso.
3. **Express** — todo en una sola pantalla.

### Modo demo vs. agenda real
- **Modo demostración** (por defecto): los turnos se guardan solo en el navegador de cada persona. Sirve para probar.
- **Agenda sincronizada con Google Calendar**: los turnos crean eventos reales en tu calendario y se bloquean para **todos** los visitantes. Un indicador arriba del formulario muestra en qué modo está.

👉 Para activar la agenda real, seguí **`CONFIGURAR-GOOGLE-CALENDAR.md`**.

---

## ⚙️ Panel de ajustes (Tweaks)

Desde la barra de herramientas se puede abrir el panel **Tweaks** para probar en vivo:
- Variación del flujo de turnos (Asistido / Wizard / Express)
- Color de acento
- Color de fondo de sección
- Fuente de títulos

---

## ✏️ Personalizaciones rápidas

| Quiero cambiar… | Dónde |
|---|---|
| **Número de WhatsApp** | `booking.jsx` y `app.jsx`: buscar `5491154056339` |
| **Instagram** | `app.jsx`: constante `IG` |
| **Horarios ofrecidos** | `booking.jsx`: `SLOT_TIMES` |
| **Días de atención** | `booking.jsx`: el array `[0,1,3,6]` (días cerrados) en el calendario |
| **Terapias / duración / textos** | `booking.jsx`: `THERAPIES` y `app.jsx`: `THERAPY_LONG` |
| **Colores / tipografías** | `styles.css` (variables `:root`) |
| **URL de la agenda Google** | `index.html`: `window.NB_AGENDA = { endpoint: "" }` |

---

## 🚀 Publicar (GitHub Pages)

1. Subí todos los archivos al repositorio (reemplazando los anteriores).
2. GitHub Pages se actualiza automáticamente.
3. No es necesario subir capturas ni archivos que empiecen con `_`.

Para ver el sitio en tu computadora, abrí `index.html` con doble clic (necesita conexión a internet para cargar fuentes e imágenes).

---

## 📞 Contacto

- Instagram: **@nitya_baktii_2023**
- WhatsApp: **+54 9 11 5405-6339**

© 2026 Nitya Bhaktii · Conectando con tu ser
