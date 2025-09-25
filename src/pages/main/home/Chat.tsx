import { useParams } from "react-router-dom";

function Chat() {
  /* -------------------------------------------------------------------------- */
  /*                              React Router Dom                              */
  /* -------------------------------------------------------------------------- */

  const { id: paramId } = useParams();

  return (
    <div>
      Chat
      <input type="text" name="message" id="message" /> <button>send</button>
      <h4> chat room: {paramId}</h4>
    </div>
  );
}

export default Chat;
