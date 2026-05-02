import { NextResponse, type NextRequest } from "next/server";
import { createServerClient as createSsrClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = ["/v/", "/staff/", "/regie/", "/poste/", "/admin/", "/hub"];

export async function middleware(req: NextRequest) {
  if (process.env["MAINTENANCE_MODE"] === "true" && !req.nextUrl.pathname.startsWith("/maintenance") && !req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  const path = req.nextUrl.pathname;

  // Legacy redirect /r and /r/* → /regie/* (308 = permanent + preserve method/body)
  if (path === "/r" || path === "/r/" || path.startsWith("/r/")) {
    const rest = path === "/r" || path === "/r/" ? "" : path.substring(2); // garde le leading "/"
    const target = new URL("/regie" + rest + req.nextUrl.search, req.url);
    return NextResponse.redirect(target, 308);
  }

  const needsAuth = PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const res = NextResponse.next();
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  if (!url || !anonKey) return res;

  const supabase = createSsrClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          req.cookies.set(name, value);
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Force 1er passage par setup-password si password_set !== true
  // Exempt : la page elle-même + logout + APIs (pour ne pas casser l'export RGPD etc.)
  const isSetupPath = path === "/account/setup-password";
  const isLogout = path === "/auth/logout" || path.startsWith("/auth/logout/");
  const isApi = path.startsWith("/api/");
  const passwordSet = data.user.user_metadata?.["password_set"] === true;

  if (!passwordSet && !isSetupPath && !isLogout && !isApi) {
    return NextResponse.redirect(new URL("/account/setup-password", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|fonts|manifest.json|robots.txt).*)"],
};
