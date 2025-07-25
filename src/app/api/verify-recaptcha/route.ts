import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token } = await req.json();

  const secret = process.env.6LetrokrAAAAAMmF0514E5DS4LS-JvEQfr1XApdR;

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await res.json();

  return NextResponse.json({
    success: data.success,
    score: data.score,
    message: data['error-codes'] || null,
  });
}
