export {auth as proxy} from "@/auth"
// protect each routes without manually putting the getServerSessions()
export const config = {
    matcher: ['/dashboard', '/budget/:path*', '/expenses/:path*', '/income/:path*', '/savings-goals/:path*', '/settings/:path*', '/financial-accounts/:path*']
}