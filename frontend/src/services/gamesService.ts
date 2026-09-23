import { apiClient } from "@/lib/axios";

export interface MemoryMatchStartResponse {
  session_id: string;
  balance: number;
}

export interface MemoryMatchEndResponse {
  success: boolean;
  reward: number;
  balance: number;
  score?: number; // Dành cho Space Shooter
}

export const startGameSession = async (): Promise<MemoryMatchStartResponse> => {
  const { data: res } = await apiClient.post("/games/memory-match/start");
  return res.data;
};

export const endGameSession = async (
  sessionId: string,
): Promise<MemoryMatchEndResponse> => {
  const { data: res } = await apiClient.post("/games/memory-match/end", {
    session_id: sessionId,
  });
  return res.data;
};

export const startStrikersSession =
  async (): Promise<MemoryMatchStartResponse> => {
    const { data: res } = await apiClient.post("/games/strikers/start");
    return res.data;
  };

export const endStrikersSession = async (
  sessionId: string,
  score: number,
): Promise<MemoryMatchEndResponse> => {
  const { data: res } = await apiClient.post("/games/strikers/end", {
    session_id: sessionId,
    score,
  });
  return res.data;
};
