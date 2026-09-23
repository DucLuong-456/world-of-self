export enum ItemRarity {
  COMMON = "common",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

export enum GemTxType {
  EARN_INVITE = "earn_invite",
  EARN_LOGIN = "earn_login",
  EARN_SPIN = "earn_spin",
  EARN_QUEST = "earn_quest",
  SPEND_BUY = "spend_buy",
  TRANSFER_SEND = "transfer_send",
  TRANSFER_RECV = "transfer_recv",
}

export interface Item {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  gem_price: number;
  rarity: ItemRarity;
  is_active: boolean;
  created_at: string;
}

export interface GemWallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
}

export interface GemTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  type: GemTxType;
  amount: number;
  balance_before: number;
  balance_after: number;
  ref_item_id: string | null;
  ref_user_id: string | null;
  note: string | null;
  created_at: string;
}

export interface GemTransactionsPage {
  transactions: GemTransaction[];
  paging: { page: number; limit: number; totalCount: number };
}

export interface UserItem {
  id: string;
  user_id: string;
  item_id: string;
  status: "owned" | "gifted";
  gifted_by: string | null;
  item?: Item;
  created_at: string;
}
