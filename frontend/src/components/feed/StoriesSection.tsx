"use client";

import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const stories = [
  {
    id: "create",
    name: "Tạo tin",
    image: "",
    isCreate: true,
  },
  {
    id: "1",
    name: "Sarah",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    hasStory: true,
  },
  {
    id: "2",
    name: "Mike",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    hasStory: true,
  },
  {
    id: "3",
    name: "Emily",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    hasStory: true,
  },
  {
    id: "4",
    name: "Alex",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    hasStory: false,
  },
];

export function StoriesSection() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Tin tức</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {stories.map((story) => (
          <button
            key={story.id}
            className="flex flex-col items-center gap-2 shrink-0 focus:outline-none group"
          >
            <div
              className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${
                story.hasStory
                  ? "bg-gradient-to-tr from-primary via-accent to-blue-500 p-[2.5px]"
                  : story.isCreate
                  ? ""
                  : "bg-muted p-[2px]"
              }`}
            >
              {story.isCreate ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/50 bg-muted/50 hover:bg-muted transition-colors">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
              ) : (
                <Avatar className="h-full w-full border-2 border-card">
                  <AvatarImage src={story.image} alt={story.name} />
                  <AvatarFallback>{story.name[0]}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <span className="max-w-[64px] truncate text-[11px] font-medium text-muted-foreground">
              {story.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
