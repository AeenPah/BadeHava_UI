import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import useHub from "@/hooks/useHub";
import FriendsList from "@/components/FriendsList";
import Chat from "@/components/Chat";
import AvatarDialog from "@/components/AvatarDialog";

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

  useEffect(() => {
    const roomId = searchParams.get("room");
    if (roomId) {
      // Try to join group or something and get data
    }
  }, [searchParams]);

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
        ...prev,
        { from: userId, message: data, seen: true },
      ]);
    });
    hubConnection?.on("My-Message", (message) => {
      setChatMessages((prev) => [
        ...prev,
        { from: 0, message: message, seen: false },
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
    <div className="row-start-2 row-end-9 bg-secondary  rounded-t-2xl pt-4 px-2 flex flex-col gap-2.5">
      {/* Avatar Picker */}
      <AvatarDialog />

      {/* Friend List */}
      <FriendsList />

      {/* Chat Sections */}
      {hubConnection && searchParams.get("room") && (
        <Chat
          user={{
            avatarUrl: "",
            username: "",
          }}
          chatMessages={chatMessages}
          handleSubmit={handleSubmit}
          chatRoom={searchParams.get("room")!}
        />
      )}
    </div>
  );
}

export default Home;
