const http = require("http");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST || "postgres",
  user: process.env.PGUSER || "demo",
  password: process.env.PGPASSWORD || "demo123",
  database: process.env.PGDATABASE || "demodb",
  port: parseInt(process.env.PGPORT || "5432", 10),
});

async function init() {
  await pool.query(`CREATE TABLE IF NOT EXISTS hits(
    id SERIAL PRIMARY KEY,
    ts TIMESTAMPTZ DEFAULT now()
  )`);
}
init().catch(console.error);

const server = http.createServer(async (req, res) => {
  if (req.url === "/hit") {
    await pool.query("INSERT INTO hits DEFAULT VALUES");
    const { rows } = await pool.query("SELECT count(*)::int AS count FROM hits");
    res.writeHead(200, {"Content-Type":"application/json"});
    res.end(JSON.stringify({ ok: true, hits: rows[0].count }));
    return;
  }
  res.writeHead(200);
  res.end("OK. Call /hit\n");
});

server.listen(3000, () => console.log("listening on 3000"));

