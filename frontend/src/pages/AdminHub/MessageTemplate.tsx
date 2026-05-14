import React, { useState } from "react";
import { Box, Heading, Text, Card, Flex, Separator, Button, TextArea } from "@radix-ui/themes";
import type { DogEntry } from "../../helpers/useGroupingStore";

// ── Template helpers ──────────────────────────────────────────────────────────

export const TEMPLATE_STORAGE_KEY = "admin2-message-template";

export const DEFAULT_TEMPLATE =
    "Hi {handlerName}, this is a reminder that {dogName} is coming up soon in {groupName}. Please make your way to the ring.";

export const VARIABLES: { name: string; description: string }[] = [
    { name: "dogName", description: "Dog's name" },
    { name: "handlerName", description: "Handler's name" },
    { name: "groupName", description: "Grouping name" },
];

export function resolveTemplate(template: string, dog: DogEntry, groupName: string): string {
    return template
        .replace(/\{dogName\}/g, dog.dogName)
        .replace(/\{handlerName\}/g, dog.handlerName)
        .replace(/\{groupName\}/g, groupName);
}

export function HighlightedTemplate({ text }: { text: string }) {
    const parts = text.split(/(\{[^}]+\})/g);
    return (
        <Text size="2" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {parts.map((part, i) =>
                /^\{[^}]+\}$/.test(part) ? (
                    <span key={i} style={{
                        background: "var(--purple-4)",
                        color: "var(--purple-11)",
                        borderRadius: 4,
                        padding: "1px 4px",
                        fontWeight: 600,
                        fontFamily: "monospace",
                    }}>
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </Text>
    );
}

// ── Message Template page ─────────────────────────────────────────────────────

export default function MessageTemplate() {
    const [template, setTemplate] = useState<string>(() =>
        sessionStorage.getItem(TEMPLATE_STORAGE_KEY) ?? DEFAULT_TEMPLATE
    );
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(template);

    const saveTemplate = () => {
        setTemplate(draft);
        sessionStorage.setItem(TEMPLATE_STORAGE_KEY, draft);
        setEditing(false);
    };

    const cancelEdit = () => {
        setDraft(template);
        setEditing(false);
    };

    const insertVariable = (varName: string) => {
        setDraft(d => d + `{${varName}}`);
    };

    return (
        <Box p="5" style={{ maxWidth: 720 }}>
            <Heading size="7" mb="1">Message Template</Heading>
            <Text color="gray" size="2" as="p" mb="5">
                Define the SMS/email message sent to handlers. Use variables to personalise each message.
            </Text>

            <Card size="3">
                <Flex align="center" gap="2" mb="3">
                    <Heading size="4" style={{ flex: 1 }}>Template</Heading>
                    {!editing ? (
                        <Button size="1" variant="soft" onClick={() => { setDraft(template); setEditing(true); }}>
                            Edit
                        </Button>
                    ) : (
                        <Flex gap="2">
                            <Button size="1" variant="solid" onClick={saveTemplate}>Save</Button>
                            <Button size="1" variant="ghost" color="gray" onClick={cancelEdit}>Cancel</Button>
                        </Flex>
                    )}
                </Flex>

                <Separator size="4" mb="3" />

                {editing ? (
                    <>
                        <Flex gap="2" wrap="wrap" mb="3" align="center">
                            <Text size="1" color="gray" weight="bold">Insert variable:</Text>
                            {VARIABLES.map(v => (
                                <button
                                    key={v.name}
                                    onClick={() => insertVariable(v.name)}
                                    title={v.description}
                                    style={{
                                        background: "var(--purple-4)",
                                        color: "var(--purple-11)",
                                        border: "1px solid var(--purple-6)",
                                        borderRadius: 4,
                                        padding: "2px 8px",
                                        fontFamily: "monospace",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    {`{${v.name}}`}
                                </button>
                            ))}
                        </Flex>

                        <TextArea
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            rows={4}
                            style={{ fontFamily: "inherit", fontSize: 14, width: "100%" }}
                        />

                        <Box mt="3" p="3" style={{
                            background: "var(--gray-2)",
                            borderRadius: "var(--radius-2)",
                            border: "1px solid var(--gray-4)",
                        }}>
                            <Text size="1" color="gray" weight="bold" mb="1"
                                style={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                                Preview
                            </Text>
                            <HighlightedTemplate text={draft} />
                        </Box>
                    </>
                ) : (
                    <>
                        <Box p="3" style={{
                            background: "var(--gray-2)",
                            borderRadius: "var(--radius-2)",
                            border: "1px solid var(--gray-4)",
                        }}>
                            <HighlightedTemplate text={template} />
                        </Box>

                        <Box mt="3" p="3" style={{
                            background: "var(--purple-2)",
                            borderRadius: "var(--radius-2)",
                            border: "1px solid var(--purple-4)",
                        }}>
                            <Text size="1" color="purple" weight="bold" mb="1"
                                style={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                                Example output
                            </Text>
                            <Text size="2" color="gray" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                {resolveTemplate(template,
                                    { dogName: "Buddy", handlerName: "Jane Smith", class: "", order: 1, phoneNumber: "", email: "" },
                                    "Ring 1"
                                )}
                            </Text>
                        </Box>
                    </>
                )}
            </Card>
        </Box>
    );
}
