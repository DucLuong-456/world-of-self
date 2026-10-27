"use client";

import { useState } from "react";
import { Smile, Loader2, Sticker as StickerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetActiveStickers } from "@/hooks/sticker/useStickers";
import { Sticker } from "@/types/chat";

interface StickerPickerProps {
  onSelectSticker: (sticker: Sticker) => void;
  disabled?: boolean;
}

const resolveMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const endpoint =
    process.env.NEXT_PUBLIC_S3_ENDPOINT || "http://localhost:9000";
  return `${endpoint}/wos-bucket/${url}`;
};

export function StickerPicker({
  onSelectSticker,
  disabled = false,
}: StickerPickerProps) {
  const [open, setOpen] = useState(false);
  const { data: packs = [], isLoading } = useGetActiveStickers(open);

  const handleSelect = (sticker: Sticker) => {
    onSelectSticker(sticker);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          title="Chọn nhãn dán (Sticker)"
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <Smile className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-80 p-0 overflow-hidden rounded-xl shadow-lg"
      >
        {isLoading ? (
          <div className="h-72 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Đang tải nhãn dán...</span>
          </div>
        ) : packs.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <StickerIcon className="h-10 w-10 mb-2 opacity-40" />
            <p className="text-sm font-medium">Chưa có bộ nhãn dán nào</p>
            <p className="text-xs mt-1">
              Quản trị viên chưa kích hoạt bộ nhãn dán nào.
            </p>
          </div>
        ) : (
          <Tabs defaultValue={packs[0]?.id} className="w-full flex flex-col">
            <div className="border-b border-border bg-muted/40 px-2 py-1.5">
              <TabsList className="h-10 w-full justify-start gap-1 bg-transparent p-0 overflow-x-auto">
                {packs.map((pack) => (
                  <TabsTrigger
                    key={pack.id}
                    value={pack.id}
                    title={pack.name}
                    className="h-9 w-9 p-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm shrink-0"
                  >
                    {pack.icon_url ? (
                      <img
                        src={resolveMediaUrl(pack.icon_url)}
                        alt={pack.name}
                        className="h-6 w-6 object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold">
                        {pack.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {packs.map((pack) => (
              <TabsContent
                key={pack.id}
                value={pack.id}
                className="m-0 focus-visible:ring-0"
              >
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border/50 bg-card">
                  {pack.name}
                </div>
                <ScrollArea className="h-64 p-2">
                  {!pack.stickers || pack.stickers.length === 0 ? (
                    <div className="h-52 flex items-center justify-center text-xs text-muted-foreground">
                      Bộ này chưa có nhãn dán nào
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {pack.stickers.map((sticker) => (
                        <button
                          key={sticker.id}
                          type="button"
                          onClick={() => handleSelect(sticker)}
                          title={sticker.name || pack.name}
                          className="group flex items-center justify-center p-1.5 rounded-lg hover:bg-accent transition-colors aspect-square"
                        >
                          <img
                            src={resolveMediaUrl(sticker.image_url)}
                            alt={sticker.name || "Sticker"}
                            className="w-14 h-14 object-contain group-hover:scale-110 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

