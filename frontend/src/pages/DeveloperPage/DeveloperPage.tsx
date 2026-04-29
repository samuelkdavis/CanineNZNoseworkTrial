import { useAuth } from "react-oidc-context";
import { Card, Heading, Text, Box, Flex, Badge, Separator } from "@radix-ui/themes";

function TokenBlock({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    return (
        <Box mb="4">
            <Flex align="center" gap="2" mb="1">
                <Text size="2" weight="bold" color="gray">{label}</Text>
                <Badge color="purple" variant="soft" size="1">JWT</Badge>
            </Flex>
            <Box
                style={{
                    background: "var(--gray-3)",
                    borderRadius: "var(--radius-2)",
                    padding: "12px",
                    overflowX: "auto",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    wordBreak: "break-all",
                    lineHeight: 1.6,
                    color: "var(--gray-12)",
                }}
            >
                {value}
            </Box>
        </Box>
    );
}

export default function DeveloperPage() {
    const auth = useAuth();

    if (!auth.isAuthenticated) {
        return (
            <Flex align="center" justify="center" style={{ minHeight: "60vh" }}>
                <Card size="3" style={{ maxWidth: 400, textAlign: "center" }}>
                    <Heading size="5" mb="2">Developer Tools</Heading>
                    <Text color="gray">You must be logged in to view token information.</Text>
                </Card>
            </Flex>
        );
    }

    return (
        <Box p="6" style={{ maxWidth: 900, margin: "0 auto" }}>
            <Heading size="7" mb="1">Developer Tools</Heading>
            <Text color="gray" size="2">Auth token inspection for development purposes.</Text>
            <Separator size="4" my="4" />

            <Card size="3" mb="4">
                <Heading size="4" mb="3">Session Info</Heading>
                <Flex gap="4" wrap="wrap">
                    <Box>
                        <Text size="1" color="gray" weight="bold">EMAIL</Text>
                        <Text as="p" size="3">{auth.user?.profile.email ?? "—"}</Text>
                    </Box>
                    <Box>
                        <Text size="1" color="gray" weight="bold">SUBJECT</Text>
                        <Text as="p" size="3" style={{ fontFamily: "monospace" }}>{auth.user?.profile.sub ?? "—"}</Text>
                    </Box>
                    <Box>
                        <Text size="1" color="gray" weight="bold">EXPIRES</Text>
                        <Text as="p" size="3">
                            {auth.user?.expires_at
                                ? new Date(auth.user.expires_at * 1000).toLocaleString()
                                : "—"}
                        </Text>
                    </Box>
                </Flex>
            </Card>

            <Card size="3">
                <Heading size="4" mb="3">Tokens</Heading>
                <TokenBlock label="ID Token" value={auth.user?.id_token} />
                <TokenBlock label="Access Token" value={auth.user?.access_token} />
                <TokenBlock label="Refresh Token" value={auth.user?.refresh_token} />
            </Card>
        </Box>
    );
}
