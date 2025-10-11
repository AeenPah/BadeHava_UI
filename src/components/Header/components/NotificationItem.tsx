import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TNotification } from "./NotificationPopover";
import { Button } from "@/components/ui/button";

type Props = {
  notification: TNotification;
  onFriendRespond: (eventId: number, action: "Accept" | "Decline") => void;
  onChatRespond: (
    eventId: number,
    action: "AcceptChatRequest" | "RefuseChatRequest"
  ) => void;
  labelMap: Record<number, string>;
};

function NotificationItem({
  notification,
  onFriendRespond,
  onChatRespond,
  labelMap,
}: Props) {
  const { eventId, eventType, sender, createdAt } = notification;

  const formattedDate = new Date(createdAt)
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");

  const actions =
    eventType === 0
      ? [
          {
            label: "Accept",
            onClick: () => onFriendRespond(eventId, "Accept"),
          },
          {
            label: "Decline",
            onClick: () => onFriendRespond(eventId, "Decline"),
          },
        ]
      : [
          {
            label: "Let's chat",
            onClick: () => onChatRespond(eventId, "AcceptChatRequest"),
          },
          {
            label: "Refuse",
            onClick: () => onChatRespond(eventId, "RefuseChatRequest"),
          },
        ];

  return (
    <div className="mb-2 flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Avatar className="size-7">
          <AvatarImage src={sender.avatarPicUrl} />
          <AvatarFallback>
            {sender.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-bold">{sender.username}</span>
        <span>{labelMap[eventType]}</span>
      </div>

      <p className="text-xs text-gray-500">{formattedDate}</p>

      <div className="flex gap-2">
        {actions.map((a, i) => (
          <Button key={i} className="h-6 text-[10px] px-2" onClick={a.onClick}>
            {a.label}
          </Button>
        ))}
      </div>

      <hr className="mt-2" />
    </div>
  );
}

export default NotificationItem;
