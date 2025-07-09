import Logo from "./Logo";
import Navigation from "../Navigation/Navigation";

export default function Header({ auth }) {
    return (
        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
            <div className="flex lg:col-start-2 lg:justify-center">
                <Logo />
            </div>
            <Navigation auth={auth} />
        </header>
    );
}
