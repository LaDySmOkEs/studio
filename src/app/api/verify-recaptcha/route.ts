export async function POST(req: Request) {
  const { token } = await req.json();

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${token}`,
  });

  const data = await verifyRes.json();

  return Response.json(data);
}
