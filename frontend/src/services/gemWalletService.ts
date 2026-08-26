import { apiClient } from "@/lib/axios";
import { GemWallet, GemTransactionsPage } from "@/types/gem";

export const getMyWallet = async (): Promise<GemWallet> => {
  const { data: res } = await apiClient.get("/gem-wallet/me");
  return res.data;
};

export const getMyTransactions = async (
  page = 1,
  limit = 20,
): Promise<GemTransactionsPage> => {
  const { data: res } = await apiClient.get("/gem-wallet/me/transactions", {
    params: { page, limit },
  });
  return { transactions: res.data, paging: res.paging };
};

export const redeemInviteCode = async (
  code: string,
): Promise<{ balance: number; earned: number }> => {
  const { data: res } = await apiClient.post("/gem-wallet/redeem", { code });
  return res.data;
};

export const transferGems = async (
  to_user_id: string,
  amount: number,
): Promise<{ balance: number; transferred: number }> => {
  const { data: res } = await apiClient.post("/gem-wallet/transfer", {
    to_user_id,
    amount,
  });
  return res.data;
};
