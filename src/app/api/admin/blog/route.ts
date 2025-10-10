import { NextRequest } from "next/server";
import { POST as blogPOST } from "../../blog/route";

export async function POST(req: NextRequest) {
  // Backward-compat: forward admin POST to the Sanity-backed blog POST
  return blogPOST(req);
}


