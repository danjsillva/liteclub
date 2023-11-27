import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("u");

  if (!url) {
    return new Response("URL not found", { status: 404 });
  }

  const response = await axios.get(url);
  const data = response.data;

  return Response.json(data);
}
