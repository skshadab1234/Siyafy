import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define arrays for public, authenticated, and protected routes
const publicRoutes = ['/'];
const authRoutes = ['/admin-login'];
const protectedRoutes = ['/admin', '/vendors/all'];

// Added pattern matching for dynamic vendor setting route
const dynamicVendorSettingRoutePattern = /^\/vendor\/[^\/]+\/api$/;
const dynamicVendorManageCustomerRoutePattern = /^\/vendor\/[^\/]+\/managecustomer$/;

const vendorAuthRoutes = ['/vendor-login'];
// Including the dynamic route pattern in the protection logic, hence not listing it here as a string
const vendorProtectedRoutes = ['/vendor'];

export function middleware(request: NextRequest) {
    const tokenSagartech = request.cookies.get('tokenSagartech');
    const tokenVendorsSagartech = request.cookies.get('tokenVendorsSagartech');
    const { pathname } = request.nextUrl;

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    } else if (authRoutes.includes(pathname)) {
        if (tokenSagartech) {
            const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.hostname}${request.nextUrl.port ? `:${request.nextUrl.port}` : ''}${protectedRoutes[0]}`;
            return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next();
    } else if (protectedRoutes.includes(pathname)) {
        if (tokenSagartech) {
            return NextResponse.next();
        }
        const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.hostname}${request.nextUrl.port ? `:${request.nextUrl.port}` : ''}/admin-login`;
        return NextResponse.redirect(redirectUrl);
    } else if (vendorAuthRoutes.includes(pathname)) {
        if (tokenVendorsSagartech) {
            const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.hostname}${request.nextUrl.port ? `:${request.nextUrl.port}` : ''}${vendorProtectedRoutes[0]}`;
            return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next();
    } else if (vendorProtectedRoutes.includes(pathname) || dynamicVendorSettingRoutePattern.test(pathname) || dynamicVendorManageCustomerRoutePattern.test(pathname)) {
        // This now also checks if the pathname matches the dynamic route pattern
        if (tokenVendorsSagartech) {
            return NextResponse.next();
        }
        const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.hostname}${request.nextUrl.port ? `:${request.nextUrl.port}` : ''}/vendor-login`;
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}
