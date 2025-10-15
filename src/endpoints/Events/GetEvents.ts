import AXIOS from "@/lib/AxiosInstance";
import { getCookie } from "@/utils/cookiesManagement";

export type TEvent = {
  eventId: number;
  eventType: 0;
  status: 0;
  sender: {
    username: string;
    avatarPicUrl: string;
    userId: number;
  };
  seen: boolean;
  createdAt: string;
};

type TResponseEvents = { success: boolean; message: "Success"; data: TEvent[] };

function GetEvents(onSuccess: (res: TResponseEvents) => void) {
  AXIOS.get("event/", {
    headers: {
      Authorization: `Bearer ${getCookie("accessToken")}`,
    },
  }).then(({ data }) => {
    onSuccess(data);
  });
}

export default GetEvents;
