/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useRefreshAccessTkQuery } from "@redux/api/apis/authApi";
import { receivedMessage } from "@redux/api/slices/chatSlice";
import { AppDispatch } from "@redux/store";
import { Client } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const WebSocketContext = createContext<Client | null>(null);

export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const { data: accessTk } = useRefreshAccessTkQuery(undefined);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: { Authorization: `Bearer ${accessTk.accessJwt}` },
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP Debug:", str),
      onConnect: () => {

        setStompClient(client);

        client.subscribe('/user/queue/messages', (payload) => {
          const msg = JSON.parse(payload.body);

          dispatch(receivedMessage(msg));

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