export async function generateMetadata({ params }: any) {
  const image =
    "https://cdn.droppii.com/droppii-production-public/product/b06f4ea0-cbf3-42bc-9ada-22d1e1518b06.jpeg";

  return {
    title: params.slug,
    openGraph: {
      title: params.slug,
      images: [image],
    },
  };
}

export default function ProductPage() {
  return <div>Product OG</div>;
}
