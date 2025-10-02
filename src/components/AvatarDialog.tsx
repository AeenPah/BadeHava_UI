import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "@/utils/cookiesManagement";
import AXIOS from "@/lib/AxiosInstance";

function AvatarDialog() {
  /* -------------------------------------------------------------------------- */
  /*                                   Consts                                   */
  /* -------------------------------------------------------------------------- */

  const AVATARS = [
    "/avatars/hades.jpg",
    "/avatars/morty.jpg",
    "/avatars/mushu.jpg",
    "/avatars/patrick.jpg",
    "/avatars/rick.jpg",
    "/avatars/scar.jpg",
    "/avatars/shrek.jpg",
  ];

  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [avatarPickerDialog, setAvatarPickerDialog] = useState<boolean>(true);

  useEffect(() => {
    const avatarPic = getCookie("avatar");
    console.log(avatarPic);
    if (avatarPic) setAvatarPickerDialog(false);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                  */
  /* -------------------------------------------------------------------------- */

  function onClickAvatarPic(avatarUrl: string) {
    setAvatarPickerDialog(false);
    const data = { avatarUrl };
    AXIOS.post("user/avatar", data, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    }).then(({ data }) => {
      alert(data.message);
      setCookie("avatar", avatarUrl);
    });
  }
  return (
    <Dialog open={avatarPickerDialog}>
      <DialogTrigger asChild>hi</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Pick an avatar</DialogTitle>
          <DialogDescription>
            Click an avatar to select it. The dialog will close automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 flex-wrap">
          {AVATARS.map((a) => (
            <Avatar
              key={a}
              className="size-20 cursor-pointer"
              onClick={() => onClickAvatarPic(a)}
            >
              <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition" />
              <AvatarImage src={a} />
            </Avatar>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AvatarDialog;
