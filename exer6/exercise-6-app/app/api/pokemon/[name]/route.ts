export async function GET(
  _req: Request,
  a: { params: Promise<{ name: string }> }
): Promise<Response> {
  try {
    const { name } = await a.params;
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return Response.json({ error: "invalid pokemon name" }, { status: 400 });
    }

    const p = await res.json();
    return Response.json(
      {
        name: p.name,
        sprite: p.sprites?.front_default ?? null,
        types: (p.types ?? []).map((t: any) => t.type.name),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/pokemon/[name] failed:", err);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}
