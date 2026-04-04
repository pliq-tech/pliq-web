import { api } from "./client";
import type { Message, MessageThread } from "@/lib/types/message";

export async function getConversations(): Promise<MessageThread[]> {
  return api.get("/api/v1/messages");
}

export async function getMessages(threadId: string): Promise<Message[]> {
  return api.get(`/api/v1/messages/${threadId}`);
}

export async function sendMessage(threadId: string, content: string): Promise<Message> {
  return api.post(`/api/v1/messages/${threadId}`, { content });
}
