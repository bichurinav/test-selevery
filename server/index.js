import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
const port = 3080;

const dirname = path.resolve();

app.use(express.static("dist"));

app.use("*", async (_, res) => {
  const html = await fs.readFile(path.join(dirname, "dist", "index.html"));
  res.send(html);
});

app.listen(port);
