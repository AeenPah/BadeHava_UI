import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import useHub from "@/hooks/useHub";
import FriendsList from "@/components/FriendsList";
import Chat from "@/components/Chat";

export type TMessage = { from: number; message: string; seen: boolean };

function Home() {
  /* -------------------------------------------------------------------------- */
  /*                              React Router Dom                              */
  /* -------------------------------------------------------------------------- */

  const [searchParams, setSearchParams] = useSearchParams();

  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [chatMessages, setChatMessages] = useState<TMessage[]>([]);

  /* -------------------------------------------------------------------------- */
  /*                                   useHub                                   */
  /* -------------------------------------------------------------------------- */

  const { hubConnection } = useHub();

  useEffect(() => {
    hubConnection?.on("FailedRequest", (_, msg) => alert(msg));
    hubConnection?.on("ChatReqRefused", (msg) => alert(msg));
    hubConnection?.on("ChatRequest", (msg) => JSON.stringify(msg));
    hubConnection?.on("JoinedRoom", (roomId) =>
      setSearchParams({ room: `${roomId}` })
    );
    hubConnection?.on("RequestSent", (_, data) => {
      console.log(data);
      alert(data.message);
      setSearchParams({ room: data.roomId });
    });

    hubConnection?.on("Message", (userId, data) => {
      setChatMessages((prev) => [
        { from: userId, message: data, seen: true },
        ...prev,
      ]);
    });
    hubConnection?.on("My-Message", (message) => {
      setChatMessages((prev) => [
        { from: 0, message: message, seen: false },
        ...prev,
      ]);
    });
    return () => {};
  }, [hubConnection]);

  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    roomId: string,
    chatMessage: string
  ) {
    event.preventDefault();

    hubConnection?.invoke("SendMessage", roomId, chatMessage);
  }

  return (
    <div className="bg-secondary h-full rounded-t-2xl pt-4 px-2">
      {/* Friend List */}
      <FriendsList />

      {/* Chat Sections */}
      {hubConnection && searchParams.get("room") && (
        <Chat
          chatMessages={chatMessages}
          handleSubmit={handleSubmit}
          chatRoom={searchParams.get("room")!}
        />
      )}
    </div>
  );
}

export default Home;
