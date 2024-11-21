//TODO: add task query

import { NormalizeError } from "next/dist/shared/lib/utils";
import { NextRequest, NextResponse } from "next/server";

// create bare POST route
export async function POST(req: NextRequest) {
    console.log('PARAMS', req.nextUrl.searchParams);
    const searchParams= req.nextUrl.searchParams;
    const montantAPayer =  Number.parseFloat(searchParams.get('montantAPayer') as any);

    return NextResponse.json({
        message: 'Hello, world!',
        params: montantAPayer,
     }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
    
}