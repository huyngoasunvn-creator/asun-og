import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCSfBzCx3InrnMNtSVknr9VSbBmK7OV20",
  authDomain: "droppii-electrohub.firebaseapp.com",
  projectId: "droppii-electrohub",
};

function getFirebase() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
}

async function getProductBySlug(slug: string) {
  const app = getFirebase();
  const db = getFirestore(app);

  const q = query(
    collection(db, "products"),
    where("slug", "==", slug)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  return snapshot.docs[0].data();
}

export async function generateMetadata({ params }: any) {
  const rawSlug = params.slug;
  const cleanSlug = rawSlug.split("-p-")[0]; // QUAN TRỌNG

  const product = await getProductBySlug(cleanSlug);

  // ❗ KHÔNG CÓ PRODUCT
  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
    };
  }

  // ✅ CÓ PRODUCT
  return {
    title: product.name,
    openGraph: {
      title: product.name,
      images: [product.images?.[0]],
      url: `https://www.asun.vn/product/${params.slug}`,
      type: "product",
    },
  };
}

export default function ProductPage() {
  return null; // CHỦ ĐÍCH: OG-only
}
