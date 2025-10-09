// src/api.js
export const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwWGZwb0uk602XGOFb_w92PTdD1vMQQX7a0fLDnKK-Hc2v7vDPpovd4vycH_NNntaEjqg/exec";

// Helper con timeout
async function fetchWithTimeout(resource, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// GET conteos (con reintento)
export async function fetchCounts() {
  let tries = 0;
  while (tries < 2) {
    try {
      const res = await fetchWithTimeout(`${GAS_URL}?action=counts`, {
        method: "GET",
        mode: "cors",
        redirect: "follow",
      });
      const txt = await res.text();
      return JSON.parse(txt);
    } catch (e) {
      if (++tries >= 2) throw e;
      await new Promise(r => setTimeout(r, 200));
    }
  }
}

// POST voto (tolerante a respuestas “opacas” de Apps Script)
export async function sendVote({ userId, projectId }) {
  let tries = 0;
  while (tries < 2) {
    try {
      const res = await fetchWithTimeout(GAS_URL, {
        method: "POST",
        mode: "cors",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // evita preflight
        body: JSON.stringify({ userId, projectId }),
      });

      const txt = await res.text();

      // Si hay HTTP error real, lo tratamos como error
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${txt}`);

      // Intentar parsear; si falla, considerar éxito (voto llegó igual)
      try {
        return JSON.parse(txt); // { ok:true } o { ok:false, reason }
      } catch {
        return { ok: true, opaque: true };
      }
    } catch (e) {
      if (++tries >= 2) throw e;
      await new Promise(r => setTimeout(r, 250));
    }
  }
}
