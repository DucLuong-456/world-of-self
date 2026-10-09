"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageType,
  Message,
  SocketResponse,
  JoinRoomResponseData,
} from "@/types/chat";
import { User } from "@/types/user";
import { v4 as uuidv4 } from "uuid";
import { apiClient } from "@/lib/axios";
import Link from "next/link";
import {
  SquarePen,
  MessageSquareDashed,
  Search,
  Loader2,
  Home,
  ArrowLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const resolveAvatarUrl = (avatar?: string | null): string => {
  if (!avatar) return "";
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  const endpoint =
    process.env.NEXT_PUBLIC_S3_ENDPOINT || "http://localhost:9000";
  return `${endpoint}/wos-bucket/${avatar}`;
};

export default function MessagerPage() {
  const { socket, isConnected } = useSocket("/chat");
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstLoadRef = useRef<boolean>(true);
  const {
    conversations,
    activeConversationId,
    messages,
    setConversations,
    setActiveConversation,
    setMessages,
    addMessage,
    confirmMessage,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [isCreatingConv, setIsCreatingConv] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Fetch conversations on load
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await apiClient.get("/chat/conversations");
        setConversations(data.data || []);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      }
    };
    fetchConversations();
  }, [setConversations]);

  // Fetch users when New Chat dialog is open or search query changes
  useEffect(() => {
    if (!isNewChatOpen) return;

    const timer = setTimeout(async () => {
      setIsSearchingUsers(true);
      try {
        const { data } = await apiClient.get("/users", {
          params: { q: searchUserQuery || undefined },
        });
        const allUsers: User[] = data.data || [];
        // Filter out current logged in user
        setUsersList(allUsers.filter((u) => u.id !== user?.id));
      } catch (error) {
        console.error("Failed to search users", error);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isNewChatOpen, searchUserQuery, user?.id]);

  const handleStartConversation = async (targetUserId: string) => {
    try {
      setIsCreatingConv(true);
      const { data } = await apiClient.post("/chat/conversations", {
        targetUserId,
      });
      const newConv = data.data;
      if (newConv) {
        if (!conversations.some((c) => c.id === newConv.id)) {
          setConversations([newConv, ...conversations]);
        }
        setActiveConversation(newConv.id);
        setIsNewChatOpen(false);
        setSearchUserQuery("");
      }
    } catch (error) {
      console.error("Failed to start conversation", error);
    } finally {
      setIsCreatingConv(false);
    }
  };

  // Handle active conversation change
  useEffect(() => {
    if (!activeConversationId || !socket) return;

    // Join room via socket
    socket.emit(
      "chat:join_room",
      { roomId: activeConversationId },
      (res: SocketResponse<JoinRoomResponseData>) => {
        if (res.status === "success") {
          console.log("Joined room successfully:", res.data.roomId);
        } else {
          console.error("Failed to join room:", res?.message);
        }
      },
    );

    // Fetch messages for active conversation
    apiClient
      .get<{ data: Message[] }>(
        `/chat/conversations/${activeConversationId}/messages`
      )
      .then(({ data }: { data: { data: Message[] } }) => {
        // data.data is the array of messages based on our backend structure
        setMessages(activeConversationId, data.data || []);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch messages", err);
      });
  }, [activeConversationId, socket, setMessages]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (res: SocketResponse<Message>) => {
      console.log("Received chat:message_received event:", res);
      if (res.status === "success") {
        const msg = res.data;
        addMessage(msg.conversation_id, msg);
      }
    };

    socket.on("chat:message_received", handleNewMessage);

    return () => {
      socket.off("chat:message_received", handleNewMessage);
    };
  }, [socket, addMessage]);

  // Auto-scroll when switching conversations or when messages update
  useEffect(() => {
    isFirstLoadRef.current = true;
  }, [activeConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;
    const timeout = setTimeout(() => {
      if (isFirstLoadRef.current) {
        scrollToBottom("auto");
        isFirstLoadRef.current = false;
      } else {
        scrollToBottom("smooth");
      }
    }, 60);
    return () => clearTimeout(timeout);
  }, [activeConversationId, messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const contentToSend = newMessage.trim();
    if (!contentToSend || !activeConversationId || !user) {
      console.warn("handleSendMessage cancelled: missing required fields", {
        content: contentToSend,
        activeConversationId,
        user,
      });
      return;
    }

    if (!socket) {
      console.error("Socket instance is null");
      return;
    }

    const tempId = uuidv4();
    const messagePayload: Message = {
      id: tempId,
      temp_id: tempId,
      conversation_id: activeConversationId,
      sender_id: user.id,
      content: contentToSend,
      type: MessageType.TEXT,
      created_at: new Date().toISOString(),
      isTemp: true,
      sender: user,
    };

    // Optimistic Update
    addMessage(activeConversationId, messagePayload);
    setNewMessage("");
    setTimeout(() => {
      scrollToBottom("smooth");
    }, 50);

    console.log("Emitting chat:send_message to socket", {
      conversation_id: activeConversationId,
      content: contentToSend,
      temp_id: tempId,
    });

    // Emit event to server
    socket.emit(
      "chat:send_message",
      {
        conversation_id: activeConversationId,
        content: contentToSend,
        type: MessageType.TEXT,
        temp_id: tempId,
      },
      (res: SocketResponse<Message>) => {
        console.log("Server ack for chat:send_message:", res);
        if (res.status === "success") {
          // Confirm message
          confirmMessage(activeConversationId, tempId, res.data);
        } else {
          console.error(
            "Failed to send message according to server:",
            res?.message,
          );
        }
      },
    );
  };

  const activeMessages = activeConversationId
    ? messages[activeConversationId] || []
    : [];

  const displayMessages = [...activeMessages].reverse();

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  return (
    <div className="flex h-screen bg-background pt-16 lg:pt-0">
      {/* Sidebar: Danh sách chat */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
              title="Về trang chủ"
              className="hover:bg-accent text-muted-foreground hover:text-foreground h-9 w-9 -ml-1"
            >
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h2 className="text-xl font-bold">Messages</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              asChild
              title="Về trang chủ"
              className="hover:bg-accent text-muted-foreground hover:text-foreground h-9 w-9"
            >
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNewChatOpen(true)}
              title="Cuộc trò chuyện mới"
              className="hover:bg-accent h-9 w-9"
            >
              <SquarePen className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <MessageSquareDashed className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">Chưa có cuộc trò chuyện nào</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Hãy bắt đầu nhắn tin với bạn bè ngay!
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewChatOpen(true)}
              className="gap-2"
            >
              <SquarePen className="h-4 w-4" />
              Tạo hội thoại mới
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-accent transition-colors ${
                  activeConversationId === conv.id ? "bg-accent" : ""
                }`}
              >
                <Avatar>
                  <AvatarImage src={resolveAvatarUrl(conv.avatar_url)} />
                  <AvatarFallback>{conv.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {conv.name || "Conversation"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.last_message?.content || "Chưa có tin nhắn"}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}

        {/* User profile footer */}
        <div className="p-3 border-t border-border flex items-center gap-3 bg-card/60">
          <Avatar className="h-9 w-9">
            <AvatarImage src={resolveAvatarUrl(user?.avatar)} />
            <AvatarFallback>
              {user?.user_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {user?.user_name || "Tôi"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Main: Khung chat */}
      <div className="flex-1 flex flex-col">
        {activeConversationId ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between bg-card shadow-sm z-10">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={resolveAvatarUrl(activeConversation?.avatar_url)}
                  />
                  <AvatarFallback>
                    {activeConversation?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">
                    {activeConversation?.name || "Cuộc trò chuyện"}
                  </h3>
                  <p className="text-xs flex items-center gap-1.5 text-muted-foreground">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-zinc-400"
                      }`}
                    />
                    {isConnected ? "Đã kết nối" : "Mất kết nối"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-1.5 text-muted-foreground hover:text-foreground"
                title="Về trang chủ"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-medium">
                    Trang chủ
                  </span>
                </Link>
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4 bg-muted/20">
              <div className="flex flex-col gap-4">
                {displayMessages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}
                    >
                      {!isMe && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage
                            src={resolveAvatarUrl(msg.sender?.avatar)}
                          />
                          <AvatarFallback>
                            {msg.sender?.user_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isMe
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-card border border-border text-card-foreground rounded-tl-sm"
                        } ${msg.isTemp ? "opacity-70" : ""}`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                      </div>
                      {isMe && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={resolveAvatarUrl(user?.avatar)} />
                          <AvatarFallback>
                            {user?.user_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 bg-card border-t border-border pr-20">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-background"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  Gửi
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6">
            <MessageSquareDashed className="h-16 w-16 mb-4 opacity-30" />
            <h3 className="text-lg font-semibold text-foreground">
              Chọn một cuộc trò chuyện để bắt đầu
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              Hoặc tạo cuộc trò chuyện mới để nhắn tin với người dùng khác.
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={() => setIsNewChatOpen(true)} className="gap-2">
                <SquarePen className="h-4 w-4" />
                Tạo cuộc trò chuyện mới
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Về trang chủ
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog tạo cuộc trò chuyện mới */}
      <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tin nhắn mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <ScrollArea className="h-72 border rounded-md p-2">
              {isSearchingUsers ? (
                <div className="flex items-center justify-center h-full py-8 text-sm text-muted-foreground gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tìm kiếm...
                </div>
              ) : usersList.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Không tìm thấy người dùng nào
                </div>
              ) : (
                <div className="space-y-1">
                  {usersList.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      disabled={isCreatingConv}
                      onClick={() => handleStartConversation(u.id)}
                      className="w-full text-left flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={resolveAvatarUrl(u.avatar)} />
                        <AvatarFallback>
                          {u.user_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {u.user_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {u.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
