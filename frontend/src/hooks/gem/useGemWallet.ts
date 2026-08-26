import { getMyWallet } from "@/services/gemWalletService";
import { useQuery } from "@tanstack/react-query";

export const useGemWallet = () => {
  return useQuery({
    queryKey: ["gem-wallet"],
    queryFn: getMyWallet,
    staleTime: 30_000,
  });
};
