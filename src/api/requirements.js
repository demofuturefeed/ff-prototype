export async function fetchRequirements() {
  const res = await fetch("http://localhost:8080/api/requirements");
  return res.json();
}

export async function saveCategory(catId, payload) {
  const res = await fetch(`http://localhost:8080/api/categories/${catId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Save failed");
  return res.json();
}