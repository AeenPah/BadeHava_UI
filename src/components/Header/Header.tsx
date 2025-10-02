import UserInfo from "./components/UserInfo";
import SearchDialog from "./components/SearchDialog";
import NotificationPopover from "./components/NotificationPopover";
import LogoutButton from "./components/LogoutButton";

function Header() {
  return (
    <div className="row-span-1 flex justify-between py-2 px-1">
      <UserInfo />
      <div className="flex items-center gap-1.5">
        {/* Search Users */}
        <SearchDialog />

        {/* Notification */}
        <NotificationPopover />

        {/* Logout */}
        <LogoutButton />
      </div>
    </div>
  );
}

export default Header;
