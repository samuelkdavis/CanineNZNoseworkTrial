import { useState } from "react";
import { Box, Card, Flex, Heading, Text, Badge, Separator, Button } from "@radix-ui/themes";
import { useGroupingStore } from "../../helpers/useGroupingStore";
import type { Grouping, DogEntry } from "../../helpers/useGroupingStore";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Flatten all dogs across all groupings into a single ordered list with group context. */
type FlatDog = DogEntry & { groupName: string; groupId: string; flatIdx: number };

function flattenDogs(groupings: Grouping[]): FlatDog[] {
    const result: FlatDog[] = [];
    for (const g of groupings) {
        for (const dog of g.dogs) {
            result.push({ ...dog, groupName: g.name, groupId: g.id, flatIdx: result.length });
        }
    }
    return result;
}

// ── Call Board Panel ──────────────────────────────────────────────────────────

function CallBoardPanel({ allDogs }: { allDogs: FlatDog[] }) {
    const currentIdx = allDogs.findIndex(d => !d.hasFinished);
    const current = currentIdx >= 0 ? allDogs[currentIdx] : null;
    const next = currentIdx >= 0 ? allDogs[currentIdx + 1] : null;
    const upAfter = currentIdx >= 0 ? allDogs[currentIdx + 2] : null;

    return (
        <Card
            size="3"
            style={{
                width: 280,
                flexShrink: 0,
                position: "sticky",
                top: 16,
                alignSelf: "flex-start",
                background: "linear-gradient(135deg, var(--purple-2) 0%, var(--purple-3) 100%)",
            }}
        >
            <Heading size="5" mb="3" align="center">Call Board</Heading>
            <Separator size="4" mb="4" />

            {/* Now Running */}
            <Box mb="4" p="4" style={{
                background: "var(--purple-9)",
                borderRadius: "var(--radius-3)",
                textAlign: "center",
            }}>
                <Text size="1" weight="bold"
                    style={{ color: "var(--purple-3)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>
                    Now Running
                </Text>
                <Text size="7" weight="bold"
                    style={{ color: "white", marginTop: 4, lineHeight: 1.2, display: "block" }}>
                    {current ? current.dogName : "—"}
                </Text>
                {current && (
                    <>
                        <Text size="2" style={{ color: "var(--purple-3)", display: "block" }}>
                            {current.handlerName}
                        </Text>
                        <Badge variant="soft" color="purple" mt="2" style={{ background: "var(--purple-7)" }}>
                            {current.groupName}
                        </Badge>
                    </>
                )}
            </Box>

            {/* Next */}
            <Box mb="3" p="3" style={{
                background: "var(--purple-4)",
                borderRadius: "var(--radius-3)",
                textAlign: "center",
            }}>
                <Text size="1" weight="bold" color="purple"
                    style={{ letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>
                    Next
                </Text>
                <Text size="5" weight="bold"
                    style={{ color: "var(--purple-12)", marginTop: 2, display: "block" }}>
                    {next ? next.dogName : "—"}
                </Text>
                {next && <Text size="2" color="gray">{next.handlerName}</Text>}
            </Box>

            {/* Up After */}
            <Box p="3" style={{
                background: "var(--gray-3)",
                borderRadius: "var(--radius-3)",
                textAlign: "center",
            }}>
                <Text size="1" weight="bold" color="gray"
                    style={{ letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>
                    Up After
                </Text>
                <Text size="4" weight="medium"
                    style={{ color: "var(--gray-11)", marginTop: 2, display: "block" }}>
                    {upAfter ? upAfter.dogName : "—"}
                </Text>
                {upAfter && <Text size="2" color="gray">{upAfter.handlerName}</Text>}
            </Box>

            {/* Progress */}
            {allDogs.length > 0 && (
                <Text size="1" color="gray" align="center" mt="3" style={{ display: "block" }}>
                    {allDogs.filter(d => d.hasFinished).length} / {allDogs.length} finished
                </Text>
            )}
        </Card>
    );
}

// ── Grouping Card ─────────────────────────────────────────────────────────────

function GroupingCard({
    grouping,
    allDogs,
}: {
    grouping: Grouping;
    allDogs: FlatDog[];
}) {
    const currentIdx = allDogs.findIndex(d => !d.hasFinished);
    const currentDog = currentIdx >= 0 ? allDogs[currentIdx] : null;

    return (
        <Card size="3">
            <Flex align="baseline" gap="3" mb="3">
                <Heading size="5" style={{ flex: 1 }}>{grouping.name}</Heading>
                {grouping.estimatedStartTime ? (
                    <Badge size="2" variant="soft" color="purple">🕐 {grouping.estimatedStartTime}</Badge>
                ) : (
                    <Badge size="2" variant="soft" color="gray">No start time</Badge>
                )}
                <Badge size="2" variant="soft" color="gray">{grouping.dogs.length} dogs</Badge>
            </Flex>

            <Separator size="4" mb="3" />

            {grouping.dogs.length === 0 ? (
                <Text size="2" color="gray">No dogs in this grouping.</Text>
            ) : (
                <Flex direction="column" gap="2">
                    {grouping.dogs.map((dog, idx) => {
                        const isCurrent = currentDog?.dogName === dog.dogName && currentDog?.groupId === grouping.id;
                        const isFinished = !!dog.hasFinished;

                        return (
                            <Flex
                                key={dog.dogName}
                                align="center"
                                gap="3"
                                px="3"
                                py="2"
                                style={{
                                    background: isCurrent
                                        ? "var(--purple-3)"
                                        : isFinished ? "var(--gray-2)" : "var(--gray-2)",
                                    borderRadius: "var(--radius-2)",
                                    border: isCurrent
                                        ? "2px solid var(--purple-7)"
                                        : "1px solid var(--gray-4)",
                                    opacity: isFinished ? 0.5 : 1,
                                }}
                            >
                                {/* Position number */}
                                <Text size="2" color="gray"
                                    style={{ minWidth: 24, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                                    {idx + 1}
                                </Text>

                                {/* Dog info */}
                                <Box style={{ flex: 1, minWidth: 0 }}>
                                    <Flex align="center" gap="2">
                                        <Text size="3" weight="bold"
                                            style={{ textDecoration: isFinished ? "line-through" : "none" }}>
                                            {dog.dogName}
                                        </Text>
                                        {isCurrent && (
                                            <Badge color="purple" variant="solid" size="1">Running</Badge>
                                        )}
                                        {dog.reactive && (
                                            <Badge color="red" variant="solid" size="1">🎀 Reactive</Badge>
                                        )}
                                        {isFinished && (
                                            <Badge color="gray" variant="soft" size="1">✓ Done</Badge>
                                        )}
                                    </Flex>
                                    <Text size="2" color="gray">{dog.handlerName}</Text>
                                </Box>

                                {/* Mark finished button removed — use Admin → Manage Callboard */}
                            </Flex>
                        );
                    })}
                </Flex>
            )}
        </Card>
    );
}

// ── Running Order 2 Page ──────────────────────────────────────────────────────

export default function RunningOrder2Page() {
    const { groupings, setGroupings } = useGroupingStore();

    const allDogs = flattenDogs(groupings);

    const handleReset = () => {
        setGroupings(prev =>
            prev.map(g => ({
                ...g,
                dogs: g.dogs.map(d => ({ ...d, hasFinished: false })),
            }))
        );
    };

    return (
        <Box p="5">
            <Flex align="center" gap="3" mb="1">
                <Heading size="7" style={{ flex: 1 }}>Running Order</Heading>
                {allDogs.some(d => d.hasFinished) && (
                    <Button size="1" variant="soft" color="gray" onClick={handleReset}>
                        Reset All
                    </Button>
                )}
            </Flex>
            <Text color="gray" size="2" as="p" mb="5">
                All groupings in order with estimated start times.
            </Text>

            {groupings.length === 0 ? (
                <Card size="3" style={{ maxWidth: 520 }}>
                    <Text size="2" color="gray">
                        No groupings yet. Go to <strong>Admin → Upload Running Order</strong> to create groupings and assign dogs.
                    </Text>
                </Card>
            ) : (
                <Flex gap="5" align="start">
                    {/* Running order list */}
                    <Flex direction="column" gap="4" style={{ flex: 1, minWidth: 0 }}>
                        {groupings.map(g => (
                            <GroupingCard
                                key={g.id}
                                grouping={g}
                                allDogs={allDogs}
                            />
                        ))}
                    </Flex>

                    {/* Sticky call board */}
                    <CallBoardPanel allDogs={allDogs} />
                </Flex>
            )}
        </Box>
    );
}
