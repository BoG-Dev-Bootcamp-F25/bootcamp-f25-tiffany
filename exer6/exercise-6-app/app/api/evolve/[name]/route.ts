type Evolution = {
  species: { name: string };
  evolves_to: Evolution[];
};

function findNext(
  node: Evolution,
  target: string
): { found: boolean; next: string | null } {
  if (node.species?.name === target) {
    const next = node.evolves_to?.[0]?.species?.name ?? null;
    return { found: true, next };
  }
  for (const child of node.evolves_to ?? []) {
    const r = findNext(child, target);
    if (r.found) return r;
  }
  return { found: false, next: null };
}

export async function GET(
  _req: Request,
  a: { params: Promise<{ name: string }> }
): Promise<Response> {
  try {
    const { name } = await a.params;
    const mon = name?.toLowerCase();
    if (!mon) return Response.json({ error: "missing name" }, { status: 400 });

    const pRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${mon}`, {
      cache: "no-store",
    });
    if (!pRes.ok)
      return Response.json({ error: "invalid pokemon name" }, { status: 400 });
    const p = await pRes.json();

    const sRes = await fetch(p.species?.url, { cache: "no-store" });
    if (!sRes.ok)
      return Response.json({ error: "species lookup failed" }, { status: 500 });
    const s = await sRes.json();

    const cRes = await fetch(s.evolution_chain?.url, { cache: "no-store" });
    if (!cRes.ok)
      return Response.json(
        { error: "evolution chain lookup failed" },
        { status: 500 }
      );
    const chain = await cRes.json();

    const current = p.species?.name as string;
    const { next } = findNext(chain.chain as Evolution, current);
    const nextStage = next ?? current;

    return Response.json({ current, next: nextStage }, { status: 200 });
  } catch (err) {
    console.error("GET /api/evolve/[name] failed:", err);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}
