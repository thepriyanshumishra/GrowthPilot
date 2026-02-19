import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/onboarding/:path*",
        "/dashboard/:path*",
        "/chat/:path*",
        "/roadmap/:path*",
        "/focus/:path*",
        "/squad/:path*",
        "/settings/:path*"
    ],
}
