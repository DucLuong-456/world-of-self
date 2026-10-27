import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@/hooks/keys";
import { stickerService } from "@/services/stickerService";

export const useGetActiveStickers = (enabled = true) => {
  return useQuery({
    queryKey: [QueryKey.stickers],
    queryFn: () => stickerService.getActiveStickerPacks(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAdminStickerPacks = (enabled = true) => {
  return useQuery({
    queryKey: [QueryKey.adminStickers],
    queryFn: () => stickerService.getAdminStickerPacks(),
    enabled,
  });
};

export const useCreateStickerPackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      stickerService.createStickerPack(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.adminStickers] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.stickers] });
    },
  });
};

export const useUpdateStickerPackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      stickerService.updateStickerPack(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.adminStickers] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.stickers] });
    },
  });
};

export const useDeleteStickerPackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => stickerService.deleteStickerPack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.adminStickers] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.stickers] });
    },
  });
};

export const useUploadStickersMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ packId, files }: { packId: string; files: File[] }) =>
      stickerService.uploadStickersToPack(packId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.adminStickers] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.stickers] });
    },
  });
};

export const useDeleteStickerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stickerId: string) => stickerService.deleteSticker(stickerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.adminStickers] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.stickers] });
    },
  });
};

