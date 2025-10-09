// src/api.js
export const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwWGZwb0uk602XGOFb_w92PTdD1vMQQX7a0fLDnKK-Hc2v7vDPpovd4vycH_NNntaEjqg/exec";

// Timeout helper
async function fetchWithTimeout(resource, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// GET counts (con reintento)
export async function fetchCounts() {
  let tries = 0;
  while (tries < 2) {
    try {
      const res = await fetchWithTimeout(`${GAS_URL}?action=counts`, {
        method: "GET",
        mode: "cors",
        redirect: "follow"
      });
      const txt = await res.text();
      return JSON.parse(txt);
    } catch (e) {
      if (++tries >= 2) throw e;
    }
  }
}

// POST vote (con reintento)
export async function sendVote({ userId, projectId }) {
  let tries = 0;
  while (tries < 2) {
    try {
      const res = await fetchWithTimeout(GAS_URL, {
        method: "POST",
        mode: "cors",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // evita preflight
        body: JSON.stringify({ userId, projectId })
      });
      const txt = await res.text();
      return JSON.parse(txt);
    } catch (e) {
      if (++tries >= 2) throw e;
    }
  }
}
