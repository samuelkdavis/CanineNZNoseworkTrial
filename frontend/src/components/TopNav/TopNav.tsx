import { Flex, TabNav, Avatar, DropdownMenu, Button } from "@radix-ui/themes";
import { useAuth } from "react-oidc-context";
import logo from "./logo backup.jpg"; // Adjust path if needed
import { signOutRedirect, clearAuthSession, IsAdmin } from "../../Authorisation";
import { useLocation } from "react-router-dom";

export default function TopNav() {
    const auth = useAuth();

    // If we don't explicitly use the location, the location shows the last route visited
    const location = useLocation();
    const isAdmin = IsAdmin(auth);

    return (
        <TabNav.Root>
            {auth.error && (
                <div
                    style={{
                        width: "100%",
                        padding: "8px 16px",
                        background: "#fff4e5",
                        color: "#663c00",
                        borderBottom: "1px solid #ffd8a8",
                        fontSize: 13,
                    }}
                >
                    Authentication error: {auth.error.message}
                </div>
            )}
            <Flex align="center" justify="between" px="4" py="2" style={{ width: "100%" }}>
                {/* Logo */}
                <Avatar
                    src={logo}
                    fallback="L"
                    size="3"
                    radius="full"
                    alt="Logo"
                    style={{ marginRight: "16px" }}
                />
                {/* Navigation Links */}
                <NavLink href="/">
                    Home
                </NavLink>
                <NavLink href="/running-order">
                    Running Order
                </NavLink>
                <NavLink href="/call-board">
                    Call Board
                </NavLink>
                <NavLink href="/running-order-2">
                    Running Order 2
                </NavLink>
                <NavLink href="/developer">
                    Developer
                </NavLink>
                {isAdmin && (
                    <NavLink href="/admin">
                        Admin
                    </NavLink>
                )}

                {/* Spacer to push auth section to the right */}
                <div style={{ flex: 1 }} />
                <NavLink href="/settings">
                    Settings
                </NavLink>
                {/* Auth Section on the right */}
                {auth.isAuthenticated || auth.error || auth.user ? (
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <span tabIndex={0} style={{ display: "inline-flex", cursor: "pointer" }}>
                                <Avatar
                                    src={auth.user?.profile?.picture}
                                    fallback={auth.user?.profile?.email?.[0]?.toUpperCase() || "U"}
                                    size="2"
                                    radius="full"
                                    alt="User"
                                />
                            </span>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <DropdownMenu.Label>
                                {auth.user?.profile?.email}
                            </DropdownMenu.Label>
                            <DropdownMenu.Item asChild>
                                <a href="/admin-hub" style={{ textDecoration: "none", color: "inherit" }}>
                                    Admin
                                </a>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item onClick={() => signOutRedirect(auth)}>
                                Sign Out
                            </DropdownMenu.Item>
                            {auth.isAuthenticated && (
                                <DropdownMenu.Item onClick={() => signOutRedirect(auth)}>
                                    Sign Out
                                </DropdownMenu.Item>
                            )}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                ) : (
                    <Button variant="solid" onClick={() => auth.signinRedirect()} disabled={auth.isLoading}>
                        {auth.isLoading ? "Loading…" : "Log In"}
                    </Button>
                )}
            </Flex>
        </TabNav.Root >
    );
}

function NavLink({ href, children, ...props }: React.ComponentProps<typeof TabNav.Link>) {
    const location = useLocation();
    return (
        <TabNav.Link href={href} active={location.pathname === href} {...props}>
            {children}
        </TabNav.Link>
    );
}