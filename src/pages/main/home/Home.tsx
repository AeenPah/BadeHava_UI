import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import useHub from "@/hooks/useHub";
import FriendsList from "@/components/FriendsList";

type TMessage = { from: number; message: string; seen: boolean };

function Home() {
  /* -------------------------------------------------------------------------- */
  /*                              React Router Dom                              */
  /* -------------------------------------------------------------------------- */

  const [searchParams, setSearchParams] = useSearchParams();

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
    hubConnection?.on("RequestSent", (data) => {
      alert(data.message);
      setSearchParams({ room: data.roomId });
    });

    hubConnection?.on("Message", (data) =>
      setChatMessages((prev) => [{ ...data, seen: true }, ...prev])
    );
    return () => {};
  }, [hubConnection]);

  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<TMessage[]>([]);

  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

  function handleSubmit(event: FormEvent<HTMLFormElement>, roomId: string) {
    event.preventDefault();
    if (!chatMessage.trim()) return;
    hubConnection?.invoke("SendMessage", roomId, chatMessage);
    setChatMessage("");
  }

  return (
    <div
      style={{ backgroundColor: "lightblue" }}
      className="h-full rounded-t-2xl pt-4 px-2"
    >
      {/* Friend List */}
      <FriendsList />

      {/* Chat Sections */}
      <h4>Chat</h4>
      {hubConnection && searchParams.get("room") && (
        <div>
          Chat
          <h4>Messages</h4>
          {chatMessages.map((m) => (
            <>
              {m.message} // FROM:{m.from} <br />
            </>
          ))}
          <form onSubmit={(e) => handleSubmit(e, searchParams.get("room")!)}>
            <input
              type="text"
              name="message"
              id="message"
              value={chatMessage}
              autoComplete="off"
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <button>send</button>
          </form>
          <h4> chat room: {searchParams.get("room")}</h4>
        </div>
      )}
    </div>
  );
}

export default Home;
