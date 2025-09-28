import type { TMessage } from "@/pages/main/home/Home";
import { useState, type FormEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";

function Chat({
  chatMessages,
  chatRoom,
  handleSubmit,
}: {
  chatMessages: TMessage[];
  chatRoom: string;
  handleSubmit: (
    event: FormEvent<HTMLFormElement>,
    chatRoom: string,
    chatMessage: string
  ) => void;
}) {
  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [chatMessage, setChatMessage] = useState<string>("");

  return (
    <div className="border-2 rounded-t-lg p-2">
      <h4>Chat room: {chatRoom}</h4>
      <h4>Messages</h4>

      <div className="flex flex-col gap-1.5 m-2">
        {chatMessages.map((m) => (
          <div className={`flex gap-1 ${m.from == 0 ? "justify-end" : ""}`}>
            <div className="bg-gray-500 text-black px-1.5 rounded-[8px]">
              {m.message}
            </div>
          </div>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          if (!chatMessage.trim()) return;
          handleSubmit(e, chatRoom, chatMessage);
          setChatMessage("");
        }}
      >
        <Input
          type="text"
          name="message"
          id="message"
          value={chatMessage}
          autoComplete="off"
          onChange={(e) => setChatMessage(e.target.value)}
        />
        <Button size="icon">
          <SendIcon />
        </Button>
      </form>
    </div>
  );
}

export default Chat;
