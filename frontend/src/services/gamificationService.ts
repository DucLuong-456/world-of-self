import { apiClient } from "@/lib/axios";

export interface CheckInStatus {
  checked_today: boolean;
  current_streak: number;
  today_reward: number;
  recent_checkins: Array<{
    id: string;
    checked_date: string;
    streak: number;
    gems_earned: number;
  }>;
}

export interface CheckInResult {
  streak: number;
  gems_earned: number;
  new_balance: number;
}

export interface SpinStatus {
  spun_today: boolean;
  slots: Array<{ gems: number; label: string }>;
  history: Array<{
    id: string;
    gems_earned: number;
    slot_index: number;
    created_at: string;
  }>;
}

export interface SpinResult {
  slot_index: number;
  gems_earned: number;
  label: string;
  new_balance: number;
}

export const getCheckInStatus = async (): Promise<CheckInStatus> => {
  const { data: res } = await apiClient.get("/daily-checkin/status");
  return res.data;
};

export const doCheckIn = async (): Promise<CheckInResult> => {
  const { data: res } = await apiClient.post("/daily-checkin");
  return res.data;
};

export const getSpinStatus = async (): Promise<SpinStatus> => {
  const { data: res } = await apiClient.get("/spin/status");
  return res.data;
};

export const doSpin = async (): Promise<SpinResult> => {
  const { data: res } = await apiClient.post("/spin");
  return res.data;
};
