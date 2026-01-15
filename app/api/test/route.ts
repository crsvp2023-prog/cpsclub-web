export async function GET() {
  return Response.json({ message: 'API test working' }, { status: 200 });
}

export async function POST() {
  return Response.json({ message: 'POST test working' }, { status: 200 });
}
