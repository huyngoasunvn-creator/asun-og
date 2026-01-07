export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getProductBySlug(slug: string) {
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

  if (!res.ok) return null;

  const data = await res.json();
  if (!Array.isArray(data) || !data[0]?.document) return null;

  const fields = data[0].document.fields;

  return {
    name: fields.name?.stringValue,
    image: fields.images?.arrayValue?.values?.[0]?.stringValue,
  };
}

export async function generateMetadata({ params }: any) {
  const cleanSlug = params.slug.split("-p-")[0];
  const product = await getProductBySlug(cleanSlug);

  if (!product) {
    return { title: "Sản phẩm không tồn tại" };
  }

  return {
    title: product.name,
    openGraph: {
      title: product.name,
      images: [product.image],
      url: `https://www.asun.vn/product/${params.slug}`,
      type: "product",
    },
  };
}

export default function ProductPage() {
  return null;
}
