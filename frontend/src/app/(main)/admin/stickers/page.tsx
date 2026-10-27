"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  useGetAdminStickerPacks,
  useCreateStickerPackMutation,
  useUpdateStickerPackMutation,
  useDeleteStickerPackMutation,
  useUploadStickersMutation,
  useDeleteStickerMutation,
} from "@/hooks/sticker/useStickers";
import { StickerPack } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Edit3,
  Upload,
  Loader2,
  Sticker as StickerIcon,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const resolveMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const endpoint =
    process.env.NEXT_PUBLIC_S3_ENDPOINT || "http://localhost:9000";
  return `${endpoint}/wos-bucket/${url}`;
};

export default function AdminStickersPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const { data: packs = [], isLoading } = useGetAdminStickerPacks(isAdmin);
  const createPackMutation = useCreateStickerPackMutation();
  const updatePackMutation = useUpdateStickerPackMutation();
  const deletePackMutation = useDeleteStickerPackMutation();
  const uploadStickersMutation = useUploadStickersMutation();
  const deleteStickerMutation = useDeleteStickerMutation();

  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<StickerPack | null>(null);

  const [packName, setPackName] = useState("");
  const [packDescription, setPackDescription] = useState("");
  const [packSortOrder, setPackSortOrder] = useState("0");
  const [packIconFile, setPackIconFile] = useState<File | null>(null);

  const stickerFilesInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <ShieldAlert className="h-12 w-12 text-destructive mb-3" />
        <h2 className="text-xl font-bold">Không có quyền truy cập</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Trang quản lý nhãn dán chỉ dành cho Quản trị viên (Admin).
        </p>
      </div>
    );
  }

  const activePack =
    packs.find((p) => p.id === selectedPackId) || packs[0] || null;

  const openCreateModal = () => {
    setEditingPack(null);
    setPackName("");
    setPackDescription("");
    setPackSortOrder("0");
    setPackIconFile(null);
    setIsPackModalOpen(true);
  };

  const openEditModal = (pack: StickerPack) => {
    setEditingPack(pack);
    setPackName(pack.name);
    setPackDescription(pack.description || "");
    setPackSortOrder(String(pack.sort_order ?? 0));
    setPackIconFile(null);
    setIsPackModalOpen(true);
  };

  const handleSavePack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packName.trim()) {
      toast.error("Vui lòng nhập tên bộ nhãn dán");
      return;
    }

    const formData = new FormData();
    formData.append("name", packName.trim());
    formData.append("description", packDescription.trim());
    if (packIconFile) {
      formData.append("icon", packIconFile);
    }

    try {
      if (editingPack) {
        formData.append("sort_order", packSortOrder);
        await updatePackMutation.mutateAsync({
          id: editingPack.id,
          formData,
        });
        toast.success("Cập nhật bộ nhãn dán thành công");
      } else {
        const created = await createPackMutation.mutateAsync(formData);
        setSelectedPackId(created.id);
        toast.success("Tạo bộ nhãn dán mới thành công");
      }
      setIsPackModalOpen(false);
    } catch {
      toast.error("Không thể lưu bộ nhãn dán. Vui lòng thử lại.");
    }
  };

  const handleToggleActive = async (pack: StickerPack) => {
    const formData = new FormData();
    formData.append("is_active", String(!pack.is_active));
    try {
      await updatePackMutation.mutateAsync({ id: pack.id, formData });
      toast.success(
        !pack.is_active
          ? `Đã bật hiển thị bộ "${pack.name}"`
          : `Đã ẩn bộ "${pack.name}"`
      );
    } catch {
      toast.error("Không thể cập nhật trạng thái bộ nhãn dán");
    }
  };

  const handleDeletePack = async (pack: StickerPack) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa bộ nhãn dán "${pack.name}" và toàn bộ sticker bên trong?`
      )
    ) {
      return;
    }
    try {
      await deletePackMutation.mutateAsync(pack.id);
      if (selectedPackId === pack.id) {
        setSelectedPackId(null);
      }
      toast.success("Đã xóa bộ nhãn dán");
    } catch {
      toast.error("Xóa bộ nhãn dán thất bại");
    }
  };

  const handleUploadStickers = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0 || !activePack) return;

    const filesArray = Array.from(filesList);
    try {
      const added = await uploadStickersMutation.mutateAsync({
        packId: activePack.id,
        files: filesArray,
      });
      toast.success(`Đã tải lên ${added.length} nhãn dán vào bộ "${activePack.name}"`);
    } catch {
      toast.error("Tải lên nhãn dán thất bại");
    } finally {
      if (stickerFilesInputRef.current) {
        stickerFilesInputRef.current.value = "";
      }
    }
  };

  const handleDeleteSticker = async (stickerId: string) => {
    try {
      await deleteStickerMutation.mutateAsync(stickerId);
      toast.success("Đã xóa nhãn dán");
    } catch {
      toast.error("Không thể xóa nhãn dán");
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <StickerIcon className="h-6 w-6 text-primary" />
            Quản lý Nhãn dán (Stickers)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tạo các bộ nhãn dán và tải ảnh lên cho người dùng sử dụng trong khung
            trò chuyện.
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo bộ nhãn dán mới
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Đang tải danh sách bộ nhãn dán...</span>
        </div>
      ) : packs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <StickerIcon className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="font-semibold">Chưa có bộ nhãn dán nào</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Bắt đầu bằng việc tạo bộ nhãn dán đầu tiên cho hệ thống.
            </p>
            <Button onClick={openCreateModal} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo bộ nhãn dán
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột trái: Danh sách các bộ sticker */}
          <div className="lg:col-span-4 space-y-3">
            {packs.map((pack) => {
              const isSelected = activePack?.id === pack.id;
              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPackId(pack.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:bg-accent/50"
                  }`}
                >
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border">
                    {pack.icon_url ? (
                      <img
                        src={resolveMediaUrl(pack.icon_url)}
                        alt={pack.name}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <StickerIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">
                        {pack.name}
                      </p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          pack.is_active
                            ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : "bg-zinc-500/15 text-zinc-500"
                        }`}
                      >
                        {pack.is_active ? "Đang bật" : "Đã ẩn"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {pack.stickers?.length || 0} nhãn dán
                      {pack.description ? ` • ${pack.description}` : ""}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={pack.is_active ? "Ẩn bộ này" : "Hiện bộ này"}
                      onClick={() => handleToggleActive(pack)}
                    >
                      {pack.is_active ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Chỉnh sửa"
                      onClick={() => openEditModal(pack)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Xóa bộ nhãn dán"
                      onClick={() => handleDeletePack(pack)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cột phải: Chi tiết các sticker trong bộ đang chọn */}
          <div className="lg:col-span-8">
            {activePack && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
                  <div>
                    <CardTitle className="text-lg">{activePack.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {activePack.description ||
                        "Quản lý danh sách các nhãn dán thuộc bộ này."}
                    </CardDescription>
                  </div>
                  <div>
                    <input
                      ref={stickerFilesInputRef}
                      type="file"
                      accept="image/webp,image/png,image/gif,image/jpeg"
                      multiple
                      className="hidden"
                      onChange={handleUploadStickers}
                    />
                    <Button
                      onClick={() => stickerFilesInputRef.current?.click()}
                      disabled={uploadStickersMutation.isPending}
                      size="sm"
                      className="gap-2"
                    >
                      {uploadStickersMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Tải lên nhãn dán
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {!activePack.stickers || activePack.stickers.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <p className="text-sm">
                        Bộ này chưa có nhãn dán nào. Hãy bấm &ldquo;Tải lên nhãn
                        dán&rdquo; (hỗ trợ chọn nhiều ảnh cùng lúc).
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {activePack.stickers.map((stk) => (
                        <div
                          key={stk.id}
                          className="group relative border border-border rounded-xl p-3 flex flex-col items-center justify-center bg-muted/20 hover:bg-accent/40 transition-colors aspect-square"
                        >
                          <img
                            src={resolveMediaUrl(stk.image_url)}
                            alt={stk.name || "Sticker"}
                            className="w-20 h-20 object-contain"
                          />
                          {stk.name && (
                            <span className="text-[11px] text-muted-foreground truncate max-w-full mt-1">
                              {stk.name}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteSticker(stk.id)}
                            title="Xóa nhãn dán này"
                            className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Dialog tạo / sửa bộ nhãn dán */}
      <Dialog open={isPackModalOpen} onOpenChange={setIsPackModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPack ? "Chỉnh sửa bộ nhãn dán" : "Tạo bộ nhãn dán mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePack} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pack-name">Tên bộ nhãn dán *</Label>
              <Input
                id="pack-name"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                placeholder="Ví dụ: Mèo Cute, Pepe..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pack-desc">Mô tả</Label>
              <Textarea
                id="pack-desc"
                value={packDescription}
                onChange={(e) => setPackDescription(e.target.value)}
                placeholder="Mô tả ngắn về bộ nhãn dán..."
                rows={3}
              />
            </div>

            {editingPack && (
              <div className="space-y-2">
                <Label htmlFor="pack-sort">Thứ tự hiển thị</Label>
                <Input
                  id="pack-sort"
                  type="number"
                  value={packSortOrder}
                  onChange={(e) => setPackSortOrder(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="pack-icon">Ảnh đại diện (Icon)</Label>
              <Input
                id="pack-icon"
                type="file"
                accept="image/webp,image/png,image/gif,image/jpeg"
                onChange={(e) =>
                  setPackIconFile(e.target.files?.[0] || null)
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPackModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={
                  createPackMutation.isPending || updatePackMutation.isPending
                }
              >
                {(createPackMutation.isPending ||
                  updatePackMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingPack ? "Lưu thay đổi" : "Tạo mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

