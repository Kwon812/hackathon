

import { NextResponse } from 'next/server'
import {getUser} from "@/service/user";
import {supabase} from "@/lib/db/supabase";

export async function middleware(request) {

    const {data}= await supabase.from('user_preference').select('id').single()
    if(!data){
        return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/home', request.url))
    // console.log(data)
    // console.log("Dsd")

    // return NextResponse.next()
}

// 이 미들웨어가 적용될 경로 지정
export const config = {
    matcher: ['/', ],
}