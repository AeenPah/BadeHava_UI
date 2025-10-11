import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { SearchIcon } from "lucide-react";
import SearchUsers from "@/components/Header/components/SearchUsers";
import AXIOS from "@/lib/AxiosInstance";
import { getCookie } from "@/utils/cookiesManagement";

function SearchDialog() {
  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

  function friendRequest(userId: number) {
    const data = {
      receiverUserId: userId.toString(),
    };
    AXIOS.post("event/friend-request", data, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    }).then((res) => alert(res.data.message));
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary" size="icon">
          <SearchIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-16 translate-y-[0] max-h-[500px]">
        <h3>Search User</h3>
        <SearchUsers friendRequestOnclick={(userId) => friendRequest(userId)} />
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;
