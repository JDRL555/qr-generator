export interface QRDocument {
  _id: string;
  code_id: string;
  target: string;
  scan_path: string;
  scan_url: string;
  generated_count: number;
  scan_count: number;
  created_at: string;
}

export interface GenerateRequest {
  target: string;
}
