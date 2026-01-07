import { NextResponse } from "next/server";

export const runtime = "nodejs";

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
  });

  const data = await res.json();
  if (!Array.isArray(data) || !data[0]?.document?.fields) return null;

  const f = data[0].document.fields;
  return {
    name: f.name?.stringValue,
    image: f.images?.arrayValue?.values?.[0]?.stringValue,
  };
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const cleanSlug = params.slug.split("-p-")[0];
  const product = await getProductBySlug(cleanSlug);

  if (!product) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(
    `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${product.name}</title>
<meta property="og:title" content="${product.name}" />
<meta property="og:image" content="${product.image}" />
<meta property="og:type" content="product" />
<meta property="og:url" content="https://www.asun.vn/product/${params.slug}" />
</head>
<body></body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
