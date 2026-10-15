export type ScanMode = "subdomains" | "directories";

export interface SubdomainResult {
  type: "found";
  found_count: number;
  subdomain: string;
  url: string;
  ip: string | null;
  status: number | null;
}

export interface DirectoryResult {
  type: "found";
  found_count: number;
  path: string;
  url: string;
  status: number;
  size: number;
}

export type ScanResult = SubdomainResult | DirectoryResult;

export interface ScanState {
  status: "idle" | "connecting" | "scanning" | "complete" | "error" | "stopped";
  target: string;
  results: ScanResult[];
  error?: string;
}
