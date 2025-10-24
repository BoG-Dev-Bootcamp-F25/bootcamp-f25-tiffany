export async function GET(
  _req: Request,
  a: { params: Promise<{ type: string }> }
): Promise<Response> {
  try {
    const { type } = await a.params;
    const res = await fetch(
      `https://pokeapi.co/api/v2/type/${type.toLowerCase()}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return Response.json({ error: "invalid pokemon type" }, { status: 400 });
    }

    const data = await res.json();
    const names: string[] = (data.pokemon ?? [])
      .map((p: any) => p?.pokemon?.name)
      .filter(Boolean);
    return Response.json({ type: data.name, pokemon: names }, { status: 200 });
  } catch (err) {
    console.error("GET /api/types/[type] failed:", err);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}
