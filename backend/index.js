const express = require("express");

const app = express();
const puerto = 3000;

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.listen(puerto, () => {
  console.log(`Servidor en http://localhost:${puerto}`);
});