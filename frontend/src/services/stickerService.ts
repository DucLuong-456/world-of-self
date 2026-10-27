import { apiClient } from "@/lib/axios";
import { Sticker, StickerPack } from "@/types/chat";

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const stickerService = {
  getActiveStickerPacks: async (): Promise<StickerPack[]> => {
    const response = await apiClient.get<ApiResponse<StickerPack[]>>(
      "/chat/stickers"
    );
    return response.data.data || [];
  },

  getAdminStickerPacks: async (): Promise<StickerPack[]> => {
    const response = await apiClient.get<ApiResponse<StickerPack[]>>(
      "/admin/stickers/packs"
    );
    return response.data.data || [];
  },

  getAdminStickerPackById: async (id: string): Promise<StickerPack> => {
    const response = await apiClient.get<ApiResponse<StickerPack>>(
      `/admin/stickers/packs/${id}`
    );
    return response.data.data;
  },

  createStickerPack: async (formData: FormData): Promise<StickerPack> => {
    const response = await apiClient.post<ApiResponse<StickerPack>>(
      "/admin/stickers/packs",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.data;
  },

  updateStickerPack: async (
    id: string,
    formData: FormData
  ): Promise<StickerPack> => {
    const response = await apiClient.patch<ApiResponse<StickerPack>>(
      `/admin/stickers/packs/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.data;
  },

  deleteStickerPack: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/stickers/packs/${id}`);
  },

  uploadStickersToPack: async (
    packId: string,
    files: File[]
  ): Promise<Sticker[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    const response = await apiClient.post<ApiResponse<Sticker[]>>(
      `/admin/stickers/packs/${packId}/stickers`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.data || [];
  },

  deleteSticker: async (stickerId: string): Promise<void> => {
    await apiClient.delete(`/admin/stickers/${stickerId}`);
  },
};

