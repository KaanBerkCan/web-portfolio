import { NextRequest, NextResponse } from "next/server";

const SIGN_API = "https://cerulean-act-73f.notion.site/api/v3/getSignedFileUrls";

const slugToPageId: Record<string, string> = {
  "harvey-park": "3746b680-64b8-8034-9e46-c4ae7a46cc85",
  "birth-of-miracle": "3256b680-64b8-8092-b7f7-db8b5a18c00d",
  "miracle-born-dead": "3256b680-64b8-8013-968a-fafefb647147",
  "dekrawler": "3256b680-64b8-802d-9f70-c29121044cdd",
  "miracle-board-game": "3296b680-64b8-80dd-8d3a-c73659ceef40",
  "moods-of-istanbul": "3296b680-64b8-803c-ace7-df4b17f24453",
  "mikapoly": "3256b680-64b8-8076-b405-ee43261c67e4",
  "sown-in-silence": "3296b680-64b8-8051-9664-d3f2498885d7",
  "gears-of-behemoth": "3296b680-64b8-80c4-a4e4-fa4c42dc4c52",
  "dissonance-ward": "3296b680-64b8-805c-9e8b-e87aff194657",
  "idle-incrementation": "3296b680-64b8-800a-b35d-d75eae4c5914",
  "human-vs-ai": "3296b680-64b8-8017-9c5f-d088ea7ca2a7",
  "player-thoughts-review": "3826b680-64b8-809b-b20f-f12e32d62f43",
  "settlers-of-catan": "3826b680-64b8-80b1-89d7-db4d2699db13",
  "bartle-poe": "3826b680-64b8-801f-ad3d-d3bb9a69d3a8",
};

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  const blockId = request.nextUrl.searchParams.get("blockId");
  const slug = request.nextUrl.searchParams.get("slug");

  if (!ref) {
    return NextResponse.json({ error: "Missing ref" }, { status: 400 });
  }

  if (ref.startsWith("/assets/") || ref.startsWith("http")) {
    return NextResponse.redirect(new URL(ref, request.url));
  }

  const permissionId = blockId || (slug ? slugToPageId[slug] : null);
  if (!permissionId || !ref.startsWith("attachment:")) {
    return NextResponse.json({ error: "Cannot resolve file" }, { status: 400 });
  }

  try {
    const res = await fetch(SIGN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        urls: [
          {
            url: ref,
            permissionRecord: { table: "block", id: permissionId },
          },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Sign failed" }, { status: 502 });
    }

    const data = (await res.json()) as { signedUrls: string[] };
    const signed = data.signedUrls?.[0];
    if (!signed) {
      return NextResponse.json({ error: "No signed URL" }, { status: 404 });
    }

    return NextResponse.redirect(signed);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
