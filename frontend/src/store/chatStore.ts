import { createStore } from './createStore';
import { Message, Conversation } from '@/types/chat';

type StateChat = {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  unreadCounts: Record<string, number>;
  activeConversationId: string | null;
};

type ActionsChat = {
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  confirmMessage: (conversationId: string, tempId: string, realMessage: Message) => void;
  markAsRead: (conversationId: string) => void;
};

const initialStateChat: StateChat = {
  conversations: [],
  messages: {},
  unreadCounts: {},
  activeConversationId: null,
};

export const useChatStore = createStore<StateChat & ActionsChat>()((set, get) => ({
  ...initialStateChat,

  setConversations: (conversations) => {
    set({ conversations });
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    if (id) {
      get().markAsRead(id);
    }
  },

  setMessages: (conversationId, messages) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    }));
  },

  addMessage: (conversationId, message) => {
    set((state) => {
      const existing = state.messages[conversationId] || [];
      // Deduplication by id or temp_id
      if (existing.some(m => m.id === message.id || (message.temp_id && m.temp_id === message.temp_id))) {
        return state;
      }
      return {
        messages: {
          ...state.messages,
          [conversationId]: [message, ...existing],
        },
      };
    });
  },

  confirmMessage: (conversationId, tempId, realMessage) => {
    set((state) => {
      const existing = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: existing.map((m) =>
            m.temp_id === tempId || m.id === tempId ? realMessage : m
          ),
        },
      };
    });
  },

  markAsRead: (conversationId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: 0,
      },
    }));
  },
}));
