/**
 * Minimal Google Drive API v3 client (fetch-only, no extra deps).
 * Supports API key (public folders) or service-account JWT.
 */

const DRIVE_API = "https://www.googleapis.com/drive/v3";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
  imageMediaMetadata?: {
    width?: number;
    height?: number;
  };
}

export interface DriveListResult {
  files: DriveFile[];
  nextPageToken?: string;
}

interface ServiceAccountJson {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf.toString("base64url");
}

async function getServiceAccountAccessToken(
  serviceAccount: ServiceAccountJson
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = base64UrlEncode(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/drive.readonly",
      aud: serviceAccount.token_uri ?? "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const crypto = await import("node:crypto");
  const signatureInput = `${header}.${claimSet}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signatureInput);
  sign.end();
  const signature = sign.sign(serviceAccount.private_key, "base64url");
  const jwt = `${signatureInput}.${signature}`;

  const tokenRes = await fetch(serviceAccount.token_uri ?? "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Drive service-account auth failed: ${tokenRes.status} ${err}`);
  }

  const data = (await tokenRes.json()) as { access_token: string };
  return data.access_token;
}

function parseServiceAccount(): ServiceAccountJson | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ServiceAccountJson;
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON");
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const serviceAccount = parseServiceAccount();
  if (serviceAccount) {
    const token = await getServiceAccountAccessToken(serviceAccount);
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

function apiKeyParam(): string {
  const key = process.env.GOOGLE_DRIVE_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error(
      "Set GOOGLE_DRIVE_API_KEY (or GOOGLE_API_KEY) for public folder access, " +
        "or GOOGLE_SERVICE_ACCOUNT_JSON for private folders shared with the service account."
    );
  }
  return key;
}

async function driveFetch(path: string, params: Record<string, string>): Promise<Response> {
  const headers = await getAuthHeaders();
  const serviceAccount = parseServiceAccount();
  const url = new URL(`${DRIVE_API}${path}`);

  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  if (!serviceAccount) {
    url.searchParams.set("key", apiKeyParam());
  }

  return fetch(url.toString(), { headers });
}

export async function listDriveFilesInFolder(
  folderId: string,
  pageToken?: string
): Promise<DriveListResult> {
  const q = `'${folderId}' in parents and trashed=false`;
  const params: Record<string, string> = {
    q,
    fields: "nextPageToken,files(id,name,mimeType,createdTime,modifiedTime,imageMediaMetadata)",
    pageSize: "1000",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  };
  if (pageToken) params.pageToken = pageToken;

  const res = await driveFetch("/files", params);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Drive list failed (${res.status}): ${err}`);
  }

  return (await res.json()) as DriveListResult;
}

export async function listAllDriveFilesInFolder(folderId: string): Promise<DriveFile[]> {
  const all: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const page = await listDriveFilesInFolder(folderId, pageToken);
    all.push(...page.files);
    pageToken = page.nextPageToken;
  } while (pageToken);

  return all;
}

export function getDriveFolderId(): string {
  return (
    process.env.GOOGLE_DRIVE_FOLDER_ID ??
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID ??
    "1UZR_UhiZfVvcLUNvDJi3Rvw8udkfKgYM"
  );
}

export function shouldUseGoogleDrive(): boolean {
  if (process.env.MEDIA_PROVIDER === "google-drive") return true;
  if (process.env.GOOGLE_DRIVE_FOLDER_ID) return true;
  if (process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID) return true;
  if (process.env.MEDIA_SOURCE === "google-drive") return true;
  // Default production folder — public embed sync works without an API key
  if (getDriveFolderId() === "1UZR_UhiZfVvcLUNvDJi3Rvw8udkfKgYM") return true;
  return false;
}
