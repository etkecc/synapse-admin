import { RaRecord } from "react-admin";

export interface ImportLine {
  id: string;
  displayname: string;
  user_type?: string;
  name?: string;
  deactivated?: boolean;
  is_guest?: boolean;
  admin?: boolean;
  is_admin?: boolean;
  password?: string;
  avatar_url?: string;
}

export interface ParsedStats {
  user_types: { [key: string]: number };
  is_guest: number;
  admin: number;
  deactivated: number;
  password: number;
  avatar_url: number;
  id: number;
  total: number;
}

export interface ChangeStats {
  total: number;
  id: number;
  is_guest: number;
  admin: number;
  password: number;
}

export type Progress = {
  done: number;
  limit: number;
} | null;

export interface ImportResult {
  skippedRecords: RaRecord[];
  erroredRecords: RaRecord[];
  succeededRecords: RaRecord[];
  totalRecordCount: number;
  changeStats: ChangeStats;
  wasDryRun: boolean;
}