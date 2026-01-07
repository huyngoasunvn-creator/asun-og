export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   FIRESTORE FETCH (AN TOÀN)
========================= */
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

/* =========================
   SEO / OG METADATA
========================= */
export async function generateMetadata({ params }: any) {
  const cleanSlug = params.slug.split("-p-")[0];
  const product = await getProductBySlug(cleanSlug);

  if (!product || !product.name) {
    return {
      title: "Sản phẩm không tồn tại",
      robots: { index: false },
    };
  }

  return {
    title: product.name,
    openGraph: {
      title: product.name,
      images: product.image ? [product.image] : [],
      url: `https://www.asun.vn/product/${params.slug}`,
      type: "product",
    },
  };
}

/* =========================
   PAGE (KHÔNG NULL)
========================= */
export default function ProductPage() {
  return <div />;
}
