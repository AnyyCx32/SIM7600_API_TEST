// Servidor receptor de datos SIM7600 - muestra mapa y datos recibidos
const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let lastData = null;
let dataLog = [];

app.post("/api/v1/telemetria/tren-ligero/enviar-coordenadas", (req, res) => {
  const data = req.body;
  const now = new Date().toISOString();

  lastData = { ...data, fecha: now };
  dataLog.push(lastData);
  if (dataLog.length > 50) dataLog.shift(); // solo guarda últimos 50

  console.log("[📡 recibido]", data);
  res.json({ ok: true, recibido: data });
});

app.get("/api/v1/telemetria/tren-ligero/datos", (req, res) => {
  res.json({ datos: dataLog });
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Servidor telemetría activo en puerto ${port}`)
);
