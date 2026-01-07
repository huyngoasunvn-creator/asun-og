import admin from "firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT as string
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function getProductBySlug(slug: string) {
  const snap = await db
    .collection("products")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snap.empty) return null;

  const data = snap.docs[0].data();
  return {
    name: data.name,
    image: data.images?.[0],
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
