import { NextResponse, type NextRequest } from "next/server";
import { isLocale, locales, type Locale } from "@/lib/i18n";

function bestLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get("preferred-locale")?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const accepted = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const preferred = accepted
    .split(",")
    .map((part) => part.trim().split(";")[0].split("-")[0])
    .find((language) => locales.includes(language as Locale));

  return preferred && isLocale(preferred) ? preferred : "en";
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") return NextResponse.next();
  return NextResponse.redirect(new URL(`/${bestLocale(request)}`, request.url));
}

export const config = { matcher: ["/"] };
