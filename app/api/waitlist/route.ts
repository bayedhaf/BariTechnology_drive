import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Demo storage: a JSON file. Works on a VPS / local server.
// On Vercel (read-only disk) swap this for Supabase, MongoDB, Google Sheets, etc.
const FILE = path.join(process.cwd(), "data", "waitlist.json");

async function read(): Promise<unknown[]> {
  try { return JSON.parse(await fs.readFile(FILE, "utf8")); } catch { return []; }
}

export async function GET() {
  return NextResponse.json({ count: (await read()).length });
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const name = String(b?.name ?? "").trim().slice(0, 80);
  const contact = String(b?.contact ?? "").trim().slice(0, 80);
  const role = String(b?.role ?? "youth");
  const lang = b?.lang === "en" ? "en" : "om";
  if (!name || !contact) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const list = (await read()) as { contact: string }[];
  if (!list.some((x) => x.contact === contact)) {
    list.push({ name, contact, role, lang, at: new Date().toISOString() } as never);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(list, null, 2));
  }
  return NextResponse.json({ ok: true, count: list.length });
}