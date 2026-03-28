/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useRefreshAccessTkQuery } from "@redux/api/apis/authApi";
import { receivedMessage } from "@redux/api/slices/chatSlice";
import { chatApi } from "@redux/api/apis/chatApi";
import { AppDispatch } from "@redux/store";
import { Client } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Chat } from "@/types/Chat";
import { usePathname } from "next/navigation";


/**
 * React context for the STOMP WebSocket client.
 */
const WebSocketContext = createContext<Client | null>(null);


/**
 * Custom hook to access the WebSocket context.
 * @returns The STOMP client instance or null.
 */
export const useWebSocket = () => useContext(WebSocketContext);


/**
 * WebSocketProvider component establishes a STOMP WebSocket connection for chat messaging.
 * Provides the client via React context to child components.
 */
export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const { data: accessTk } = useRefreshAccessTkQuery(undefined);

  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const socketUrl = backendUrl.replace(/^http/, "ws") + "/ws";

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {

    if (!accessTk?.accessJwt) return;

    const client = new Client({
      brokerURL: socketUrl,
      connectHeaders: { Authorization: `Bearer ${accessTk.accessJwt}` },
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP Debug:", str),
      onConnect: () => {
        setStompClient(client);

        client.subscribe('/user/queue/messages', (payload) => {
          const msg = JSON.parse(payload.body);

          dispatch(receivedMessage(msg));

          // Needed to be able to still see the data after leaving the chat layout
          dispatch(
            chatApi.util.updateQueryData('getChat', msg.chatId, (draft: Chat) => {
              draft.messages.push(msg);
            })
          );

          dispatch(
            chatApi.util.updateQueryData('getChats', undefined, (draft: Chat[]) => {
              const chat = draft.find(c => c.id === msg.chatId);
              if (chat) {
                chat.lastMessage = msg;
                chat.unseenMessages++;
              }
            })
          );

          dispatch(
            chatApi.util.updateQueryData('getSilencedChats', undefined, (draft: Chat[]) => {
              const chat = draft.find(c => c.id === msg.chatId);
              if (chat) {
                chat.lastMessage = msg;
                chat.unseenMessages++;
              }
            })
          );

          console.log("Subscribed to the queue!", msg);
        });
      },
      onDisconnect: () => {
        setStompClient(null);
      }
    });

    client.activate();

    return () => {
      client.deactivate();
      setStompClient(null);
    };
  }, [accessTk, dispatch]);

  return (
    <WebSocketContext.Provider value={stompClient}>
      {children}
    </WebSocketContext.Provider>
  );
}