import { NextResponse } from 'next/server';

export function middleware(request) {
  const allowedMethods = ['GET', 'POST', 'DELETE', 'PUT'];

  if (!allowedMethods.includes(request.method)) {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  return NextResponse.next();
}
