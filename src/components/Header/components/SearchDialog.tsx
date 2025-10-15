import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { SearchIcon } from "lucide-react";
import SearchUsers from "@/components/Header/components/SearchUsers";
import useHub from "@/hooks/useHub";

function SearchDialog() {
  /* -------------------------------------------------------------------------- */
  /*                                   useHub                                   */
  /* -------------------------------------------------------------------------- */

  const { hubConnection } = useHub();

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary" size="icon">
          <SearchIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-16 translate-y-[0] max-h-[500px]">
        <h3>Search User</h3>
        <SearchUsers
          friendRequestOnclick={(userId) =>
            hubConnection?.invoke("FriendRequest", userId)
          }
        />
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;
