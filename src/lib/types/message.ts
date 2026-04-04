export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface MessageThread {
  roomId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}
