//TODO: add task query

import { NextRequest, NextResponse } from "next/server";

// create bare POST route
export async function POST(req: NextRequest) {
    console.log('PARAMS', req.nextUrl.searchParams);
    const searchParams= req.nextUrl.searchParams;
    const montantAPayer =  searchParams.get('montantAPayer');

    return NextResponse.json({
        message: 'Hello, world!',
        params: montantAPayer,
     }, { status: 200 });
}