"use client"

import { useCreateChatMutation } from "@redux/api/apis/chatApi";
import { useRouter } from "next/navigation";

export const useChat = () => {
  const router = useRouter();

  const [createChat] = useCreateChatMutation();

  const handleCreateChat = async (username: string) => {
    try {
      const res = await createChat(username).unwrap();
      console.log(res);
      router.push(`/chat/messages/${res.id}`);
    } catch (error: any) {
      const errorMessage = error?.message || "An error occurred while creating a new chat.";
      console.error(errorMessage);
    }
  };

  return {handleCreateChat};
};