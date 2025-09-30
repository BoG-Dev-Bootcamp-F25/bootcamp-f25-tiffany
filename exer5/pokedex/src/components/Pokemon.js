// src/components/Pokemon.js
import React, { useEffect, useState } from "react";

export default function Pokemon({ id, onData }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        setData(null);

        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
            String(id)
          )}/`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || `Request failed with status ${res.status}`);
        }

        const json = await res.json();
        setData(json);
        if (onData) onData(json); // pass the latest data back up
      } catch (e) {
        if (e.name !== "AbortError")
          setError(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [id, onData]);

  if (loading) return <div>loading...</div>;
  if (error) return <div style={{ color: "crimson" }}>{error}</div>;
  if (!data) return null;

  const sprite = data?.sprites?.front_default;
  const name = data?.name;

  return (
    <div>
      {sprite ? (
        <img src={sprite} alt={`${name} sprite`} />
      ) : (
        <div>No image available for “{name}”.</div>
      )}
    </div>
  );
}
