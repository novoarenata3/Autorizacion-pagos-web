const historialIdempotencia = new Map();
let contadorExitos = 0;
let contadorDuplicados = 0;

function generarUUID() {
  return 'idx-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
}

function generarNuevaClave() {
  document.getElementById("idempotency-key").value = generarUUID();
}

function procesarPago(esReintento) {
  const key = document.getElementById("idempotency-key").value;
  const cuenta = document.getElementById("cuenta-origen").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const timestamp = new Date().toLocaleTimeString();

  if (!key) {
    alert("Por favor genera una clave de idempotencia.");
    return;
  }

  if (historialIdempotencia.has(key)) {
    contadorDuplicados++;
    document.getElementById("m-duplicados").innerText = contadorDuplicados;
    
    const registroPrevio = historialIdempotencia.get(key);
    agregarRegistroTabla(timestamp, key, monto, "DUPLICADO_IGNORADO", `Respuesta previa retornada (${registroPrevio.estado})`, "bg-purple-100 text-purple-800");
    alert(`[IDEMPOTENCIA DETECTADA] La transacción con clave '${key}' ya fue procesada anteriormente. No se aplicó un segundo cobro.`);
    return;
  }

  if (monto > 1000) {
    historialIdempotencia.set(key, { estado: "RECHAZADO_LIMITE", monto });
    agregarRegistroTabla(timestamp, key, monto, "RECHAZADO", "Excede límite diario ($1,000)", "bg-red-100 text-red-800");
    return;
  }

  contadorExitos++;
  document.getElementById("m-exitosos").innerText = contadorExitos;
  historialIdempotencia.set(key, { estado: "APROBADO", monto });
  agregarRegistroTabla(timestamp, key, monto, "APROBADO", "Banco Externo: OK (200)", "bg-emerald-100 text-emerald-800");
}

function agregarRegistroTabla(time, key, monto, estado, detalle, claseBadge) {
  const tbody = document.getElementById("tabla-auditoria");
  const tr = document.createElement("tr");
  tr.className = "hover:bg-slate-50";
  tr.innerHTML = `
    <td class="p-2 text-slate-500">${time}</td>
    <td class="p-2 font-bold text-slate-700">${key.substring(0, 15)}...</td>
    <td class="p-2">$${monto.toFixed(2)}</td>
    <td class="p-2"><span class="px-2 py-0.5 rounded text-xs font-semibold ${claseBadge}">${estado}</span></td>
    <td class="p-2 text-slate-600">${detalle}</td>
  `;
  tbody.insertBefore(tr, tbody.firstChild);
}

document.addEventListener("DOMContentLoaded", () => {
  generarNuevaClave();
});
