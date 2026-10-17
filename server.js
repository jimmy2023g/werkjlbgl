const GAME_IDS = new Set([
  "lane-shift",
  "minecraft-233",
  "gta-vi",
  "gasher-game-jam",
  "gasher-art",
  "fnaf-bag",
  "silksong",
]);

export const schema = `
  CREATE TABLE IF NOT EXISTS game_popularity (
    game_id TEXT PRIMARY KEY,
    clicks INTEGER NOT NULL DEFAULT 0
  );
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/popular-games") {
      const { results = [] } = await env.DB
        .prepare("SELECT game_id AS id, clicks FROM game_popularity ORDER BY clicks DESC, game_id ASC LIMIT 5")
        .all();
      return Response.json({ top: results }, { headers: { "Cache-Control": "no-store" } });
    }

    if (request.method === "POST" && url.pathname === "/api/game-click") {
      let body;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "Invalid JSON" }, { status: 400 });
      }
      if (typeof body.id !== "string" || !GAME_IDS.has(body.id)) {
        return Response.json({ error: "Unknown game" }, { status: 400 });
      }
      await env.DB.prepare(
        "INSERT INTO game_popularity (game_id, clicks) VALUES (?, 1) ON CONFLICT(game_id) DO UPDATE SET clicks = clicks + 1"
      ).bind(body.id).run();
      return Response.json({ ok: true });
    }

    return new Response("Not found", { status: 404 });
  },
};
