import { Flex, TabNav, Avatar, DropdownMenu } from "@radix-ui/themes";
import { useAuth } from "react-oidc-context";
import logo from "./logo backup.jpg"; // Adjust path if needed
import { signOutRedirect } from "../../Authorisation";
import { useLocation } from "react-router-dom";

export default function TopNav() {
    const auth = useAuth();

    // If we don't explicitly use the location, the location shows the last route visited
    const location = useLocation();

    return (
        <TabNav.Root>
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
                <TabNav.Link href="/" active={location.pathname === '/'}>
                    Home
                </TabNav.Link>
                <TabNav.Link href="/settings" active={location.pathname === '/settings'}>
                    Settings
                </TabNav.Link>
                <TabNav.Link href="/admin" active={location.pathname === '/admin'}>
                    Admin
                </TabNav.Link>
                <TabNav.Link href="/dogs" active={location.pathname === '/dogs'}>
                    Dogs
                </TabNav.Link>

                {/* Spacer to push auth section to the right */}
                <div style={{ flex: 1 }} />
                {/* Auth Section on the right */}
                {auth.isAuthenticated ? (
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
                            <DropdownMenu.Item onClick={() => signOutRedirect(auth)}>
                                Sign Out
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                ) : (
                    <TabNav.Link asChild>
                        <button onClick={() => auth.signinRedirect()}>Log In</button>
                    </TabNav.Link>
                )}
            </Flex>
        </TabNav.Root>
    );
}