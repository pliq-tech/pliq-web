import type { Message } from "@/lib/types/message";

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}
