export async function POST(req: Request): Promise<Response> {
  try {
    
    const body = await req.json().catch(() => ({}));
    const pokemon1 = String(body?.pokemon1 || "").toLowerCase();
    const pokemon2 = String(body?.pokemon2 || "").toLowerCase();

    if (!pokemon1 || !pokemon2) {
      return Response.json(
        { error: "pokemon1 and pokemon2 are required (strings)" },
        { status: 400 }
      );
    }

    const [poke1, poke2] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon1}`, {
        cache: "no-store",
      }),
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon2}`, {
        cache: "no-store",
      }),
    ]);

    if (!poke1.ok || !poke2.ok) {
      return Response.json(
        { error: "invalid pokemon name(s)" },
        { status: 400 }
      );
    }

    const [p1, p2] = await Promise.all([poke1.json(), poke2.json()]);

    const total1 = (p1.stats ?? []).reduce(
      (s: number, st: any) => s + (st?.base_stat ?? 0),
      0
    );
    const total2 = (p2.stats ?? []).reduce(
      (s: number, st: any) => s + (st?.base_stat ?? 0),
      0
    );

    const winner =
      total1 > total2 ? p1.name : total2 > total1 ? p2.name : "tie";

    return Response.json(
      {
        winner,
        pokemon1: { name: p1.name, total: total1 },
        pokemon2: { name: p2.name, total: total2 },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/battle failed:", err);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}
