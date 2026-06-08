import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

interface LeadPayload {
  eventType: string;
  budget: string;
  guests: string;
  date: string;
  location?: string;
  name: string;
  email: string;
  phone: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;

    if (!body.name || !body.email || !body.phone || !body.eventType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lead = {
      ...body,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: "luxury-planner",
    };

    await mkdir(DATA_DIR, { recursive: true });

    let leads: unknown[] = [];
    try {
      const existing = await readFile(LEADS_FILE, "utf-8");
      leads = JSON.parse(existing);
    } catch {
      leads = [];
    }

    leads.push(lead);
    await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));

    return NextResponse.json({ success: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
