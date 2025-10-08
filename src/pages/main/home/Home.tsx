import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import useHub from "@/hooks/useHub";
import FriendsList from "@/components/FriendsList";
import Chat from "@/components/Chat";
import AvatarDialog from "@/components/AvatarDialog";

export type TMessage = { from: number; message: string; seen: boolean };

type THubResponse<T = null> = {
  success: boolean;
  message: string;
  data: T;
};
type TChatUser = {
  userId: string;
  username: string;
  userAvatarUrl?: string;
};
type TChatRoom = {
  roomId: string;
  roomsUsers: TChatUser[];
};
type TChatMessage = {
  message: string;
  from: number;
  seen: boolean;
};

function Home() {
  /* -------------------------------------------------------------------------- */
  /*                              React Router Dom                              */
  /* -------------------------------------------------------------------------- */

  const [searchParams, setSearchParams] = useSearchParams();

  /* -------------------------------------------------------------------------- */
  /*                                   useHub                                   */
  /* -------------------------------------------------------------------------- */

  const { hubConnection } = useHub();

  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [chatMessages, setChatMessages] = useState<TMessage[]>([]);

  useEffect(() => {
    /* --------------------------------- Failed --------------------------------- */
    hubConnection?.on("FailedRequest", (res: THubResponse) =>
      alert(res.message)
    );

    /* ------------------------------ Chat Requests ----------------------------- */
    hubConnection?.on("ChatRequest", (res: THubResponse<TChatUser>) => {
      // TODO: show the sender username and avatar
      alert(res.message);
    });
    hubConnection?.on("RequestSent", (res: THubResponse) => {
      alert(res.message);
      // setSearchParams({ room: data.roomId });
    });
    hubConnection?.on("ChatReqRefused", (res: THubResponse) =>
      alert(res.message)
    );
    hubConnection?.on("ChatReqRefusedBy", (res: THubResponse<TChatUser>) =>
      // TODO: show the sender username and avatar
      alert(res.message)
    );
    hubConnection?.on(
      "UserAcceptChatRequest",
      (res: THubResponse<TChatRoom>) => {
        // TODO: show the sender username and avatar
        alert(res.message);
        setSearchParams({ room: `${res.data.roomId}` });
      }
    );
    hubConnection?.on("JoinedRoom", (res: THubResponse<TChatRoom>) => {
      // TODO: show the sender username and avatar
      alert(res.message);
      setSearchParams({ room: `${res.data.roomId}` });
    });

    /* ----------------------------- Join Chat Room ----------------------------- */
    hubConnection?.on("JoinedChatRoom", (res: THubResponse<TChatUser[]>) => {
      // TODO: show the sender username and avatar
      alert(res.message);
    });

    /* -------------------------------- Messages -------------------------------- */
    hubConnection?.on("Message", (res: THubResponse<TChatMessage>) => {
      setChatMessages((prev) => [
        ...prev,
        { from: res.data.from, message: res.data.message, seen: false },
      ]);
    });
    hubConnection?.on("My-Message", (res: THubResponse<TChatMessage>) => {
      setChatMessages((prev) => [
        ...prev,
        { from: 0, message: res.data.message, seen: false },
      ]);
    });
    return () => {};
  }, [hubConnection]);

  useEffect(() => {
    const roomId = searchParams.get("room");
    if (roomId && hubConnection) {
      console.log({ roomId });
      // Try to join group or something and get data
      hubConnection?.invoke("JoinChatRoom", roomId);
    }
  }, [searchParams, hubConnection]);

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
