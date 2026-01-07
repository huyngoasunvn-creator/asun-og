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
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
    };
  }

  return {
    title: product.name,
    openGraph: {
      title: product.name,
      images: [product.images?.[0]],
    },
  };
}

export default function ProductPage() {
  return null;
}
