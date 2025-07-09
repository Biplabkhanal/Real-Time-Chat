import ThemeDropdown from "./ThemeDropdown";
import UserDropdown from "./UserDropdown";
import GuestNavigation from "./GuestNavigation";

export default function Navigation({ auth }) {
    return (
        <nav className="-mx-3 flex flex-1 justify-end">
            <ThemeDropdown />
            {auth.user ? <UserDropdown /> : <GuestNavigation />}
        </nav>
    );
}
