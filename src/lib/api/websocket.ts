"use client";

import { config } from "@/lib/config";

type EventHandler = (data: unknown) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect(token: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(config.wsUrl);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.ws?.send(JSON.stringify({ type: "auth", token }));
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const handlers = this.handlers.get(msg.type);
        if (handlers) {
          for (const handler of handlers) {
            handler(msg.data);
          }
        }
      } catch {
        // Ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      this.scheduleReconnect(token);
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.reconnectAttempts = 0;
  }

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)?.add(handler);
  }

  unsubscribe(eventType: string, handler?: EventHandler): void {
    if (handler) {
      this.handlers.get(eventType)?.delete(handler);
    } else {
      this.handlers.delete(eventType);
    }
  }

  private scheduleReconnect(token: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.connect(token), delay);
  }
}

export const wsClient = new WebSocketClient();
