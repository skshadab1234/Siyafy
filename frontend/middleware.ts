import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define arrays for public, authenticated, and protected routes
const publicRoutes = ['/'];
const authRoutes = ['/admin-login'];
const protectedRoutes = ['/admin', '/vendors/all'];


// ROUTES OF ARRAY FOR VENDORS SCREENS
// const vendorPublicRoute = ['/vendor']
const vendorAuthRoutes = ['/vendor-login']
const vendorProtectedRoutes = ['/vendor']

export function middleware(request: NextRequest) {
    // Check if the 'tokenSagartech' cookie exists
    const tokenSagartech = request.cookies.get('tokenSagartech');
    const tokenVendorsSagartech = request.cookies.get('tokenVendorsSagartech');

    // Check the request path against the arrays to decide the action
    if (publicRoutes.includes(request.nextUrl.pathname)) {
        // If the request is for a public route, continue with the request
        return NextResponse.next();
    } else if (authRoutes.includes(request.nextUrl.pathname)) {
        // If the request is for an authenticated route and the cookie exists, redirect to the first public route
        if (tokenSagartech) {
            // Construct an absolute URL for the redirect, excluding the port in production
            const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.hostname}${request.nextUrl.port ? `:${request.nextUrl.port}` : ''}${protectedRoutes[0]}`;
            return NextResponse.redirect(redirectUrl);
        } else {
            // If the cookie does not exist, continue with the request
            return NextResponse.next();
        }
    } else if (protectedRoutes.includes(request.nextUrl.pathname)) {
        // If the request is for a protected route and the cookie exists, continue with the request
        if (tokenSagartech) {
            return NextResponse.next();
        } else {
            // Construct an absolute URL for the redirect to the admin login page, excluding the port in production
            const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.hostname}${request.nextUrl.port ? `:${request.nextUrl.port}` : ''}/admin-login`;
            return NextResponse.redirect(redirectUrl);
        }
    } else if (vendorAuthRoutes.includes(request.nextUrl.pathname)) {
        // If the request is for an authenticated route and the cookie exists, redirect to the first public route
        if (tokenVendorsSagartech) {
            // Construct an absolute URL for the redirect, excluding the port in production
            const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.hostname}${request.nextUrl.port ? `:${request.nextUrl.port}` : ''}${vendorProtectedRoutes[0]}`;
            return NextResponse.redirect(redirectUrl);
        } else {
            // If the cookie does not exist, continue with the request
            return NextResponse.next();
        }
    } else if (vendorProtectedRoutes.includes(request.nextUrl.pathname)) {
        // If the request is for a protected route and the cookie exists, continue with the request
        if (tokenVendorsSagartech) {
            return NextResponse.next();
        } else {
            // Construct an absolute URL for the redirect to the admin login page, excluding the port in production
            const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.hostname}${request.nextUrl.port ? `:${request.nextUrl.port}` : ''}/vendor-login`;
            return NextResponse.redirect(redirectUrl);
        }
    } 

    // Default action if the request does not match any of the defined routes
    return NextResponse.next();
}
