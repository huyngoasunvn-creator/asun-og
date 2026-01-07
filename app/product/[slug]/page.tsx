async function getProductBySlug(slug: string) {
  try {
    const projectId = "droppii-electrohub";
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;

    const body = {
      structuredQuery: {
        from: [{ collectionId: "products" }],
        where: {
          fieldFilter: {
            field: { fieldPath: "slug" },
            op: "EQUAL",
            value: { stringValue: slug },
          },
        },
        limit: 1,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    if (!Array.isArray(data)) return null;
    if (!data[0]?.document?.fields) return null;

    const fields = data[0].document.fields;

    return {
      name: fields.name?.stringValue ?? null,
      image:
        fields.images?.arrayValue?.values?.[0]?.stringValue ??
        null,
    };
  } catch (err) {
    console.error("Firestore error:", err);
    return null;
  }
}
