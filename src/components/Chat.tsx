import type { TMessage } from "@/pages/main/home/Home";
import { useState, type FormEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowLeftIcon, SendIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSearchParams } from "react-router-dom";

function Chat({
  user,
  chatMessages,
  chatRoom,
  handleSubmit,
}: {
  user: { username: string; avatarUrl: string | null };
  chatMessages: TMessage[];
  chatRoom: string;
  handleSubmit: (
    event: FormEvent<HTMLFormElement>,
    chatRoom: string,
    chatMessage: string
  ) => void;
}) {
  /* -------------------------------------------------------------------------- */
  /*                              React Router Dom                              */
  /* -------------------------------------------------------------------------- */

  const [, setSearchParams] = useSearchParams();

  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [chatMessage, setChatMessage] = useState<string>("");

  return (
    <div className="border-2 h-full rounded-t-lg flex flex-col mb-5">
      <div className="bg-sidebar flex justify-between rounded-t-lg p-2">
        <div className="flex gap-2 items-center">
          <Avatar className="size-10">
            <AvatarImage src={user.avatarUrl || ""} />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{user.username}</span>
          <h4>Chat room: {chatRoom}</h4>
        </div>
        <Button variant="outline" onClick={() => setSearchParams("")}>
          <ArrowLeftIcon />
        </Button>
      </div>

      <div className="grow flex flex-col gap-1.5 m-2 relative overflow-auto">
        {chatMessages.length === 0 ? (
          <h4 className="text-center justify-self-center m-auto">
            No messages yet!
          </h4>
        ) : (
          chatMessages.map((m) => (
            <div className={`flex gap-1 ${m.from == 0 ? "justify-end" : ""}`}>
              <div className="bg-gray-500 text-black px-1.5 rounded-[8px]">
                {m.message}
              </div>
            </div>
          ))
        )}
      </div>

      <form
        className="flex gap-2 m-3"
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
