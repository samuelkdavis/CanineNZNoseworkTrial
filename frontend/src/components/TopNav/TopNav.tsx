import { Flex, TabNav, Avatar, DropdownMenu } from "@radix-ui/themes";
import { useAuth } from "react-oidc-context";
import logo from "./logo backup.jpg"; // Adjust path if needed

export default function TopNav() {
    const auth = useAuth();
    const signOutRedirect = () => {
        auth.removeUser();
        const clientId = "7sn205necoj0cmj5u3mrc1cjee";
        const logoutUri = "http://localhost:5173";
        const cognitoDomain = "https://ap-southeast-2rgeisywkm.auth.ap-southeast-2.amazoncognito.com";
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };
    return (
        <TabNav.Root>
            <Flex align="center" gap="4" px="4" py="2">
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
                <TabNav.Link href="#" active>
                    Account
                </TabNav.Link>
                <TabNav.Link href="#">Documents</TabNav.Link>
                <TabNav.Link href="#">Settings</TabNav.Link>
                {/* Spacer */}
                <div style={{ flex: 1 }} />
                {/* Auth Section */}
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
                            <DropdownMenu.Item onClick={() => signOutRedirect()}>
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