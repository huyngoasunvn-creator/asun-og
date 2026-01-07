export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getProductBySlug(slug: string) {
  const projectId = "droppii-electrohub";

  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    `/databases/(default)/documents/products` +
    `?pageSize=1&filter=slug%3D%3D%22${slug}%22`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.documents || data.documents.length === 0) return null;

  const fields = data.documents[0].fields;

  return {
    name: fields.name?.stringValue,
    image: fields.images?.arrayValue?.values?.[0]?.stringValue,
  };
}

export async function generateMetadata({ params }: any) {
  try {
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
  } catch (e) {
    console.error("OG ERROR:", e);
    return { title: "Lỗi hệ thống" };
  }
}

export default function ProductPage() {
  return null;
}
