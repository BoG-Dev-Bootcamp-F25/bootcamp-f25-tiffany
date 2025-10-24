export async function GET(
  _req: Request,
  a: { params: Promise<{ name: string }> }
): Promise<Response> {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=1`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return Response.json({ error: "no pokemon" }, { status: 500 });
    }

    const data = await res.json();
    const count: number = data?.count ?? 1010;
    const pokeID = 1 + Math.floor(Math.random() * count);

    const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeID}`, {
      cache: "no-store",
    });
    if (!r.ok) {
        return Response.json({error: "id error"}, {status: 500});
    }

    const p = await r.json();

    const payload = {
        name: p.name,
      };

    return Response.json(payload, { status: 200 });
  } catch (err) {
    console.error("GET /api/ failed:", err);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}
