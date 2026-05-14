import React, { useEffect, useState, useContext } from "react";
import { Box, Card, Flex, Heading, Text, Badge, Separator } from "@radix-ui/themes";
import { ServiceContext } from "../../repositories/ServiceContext";
import type { Dog } from "../../repositories/Dog";
import axios from "axios";

// ── Running Order Card ────────────────────────────────────────────────────────

function RunningOrderCard() {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDogs() {
            try {
                const result = await axios.get("https://localhost:17276/runningorder");
                setDogs(result.data);
            } catch {
                // silently fail — backend may not be running
            } finally {
                setLoading(false);
            }
        }
        fetchDogs();
    }, []);

    return (
        <Card size="3" style={{ flex: 1, minWidth: 0 }}>
            <Flex align="center" justify="between" mb="3">
                <Heading size="5">Running Order</Heading>
                <Badge color="purple" variant="soft">{dogs.length} dogs</Badge>
            </Flex>
            <Separator size="4" mb="3" />

            {loading ? (
                <Text color="gray" size="2">Loading...</Text>
            ) : dogs.length === 0 ? (
                <Text color="gray" size="2">No dogs in the running order yet.</Text>
            ) : (
                <Box style={{ overflowY: "auto", maxHeight: 420 }}>
                    {dogs.map((dog, index) => (
                        <Flex
                            key={index}
                            align="center"
                            gap="3"
                            py="2"
                            px="1"
                            style={{
                                borderBottom: index < dogs.length - 1 ? "1px solid var(--gray-4)" : "none",
                            }}
                        >
                            <Box
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    background: "var(--purple-9)",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                {dog.order}
                            </Box>
                            <Box style={{ flex: 1, minWidth: 0 }}>
                                <Text size="3" weight="bold" style={{ display: "block" }}>
                                    {dog.dogName}
                                </Text>
                                <Text size="2" color="gray">{dog.handlerName}</Text>
                            </Box>
                            <Badge
                                color={
                                    dog.class === "Novice" ? "green" :
                                        dog.class === "Intermediate" ? "blue" : "orange"
                                }
                                variant="soft"
                                size="1"
                            >
                                {dog.class}
                            </Badge>
                        </Flex>
                    ))}
                </Box>
            )}
        </Card>
    );
}

// ── Call Board Card ───────────────────────────────────────────────────────────

function CallBoardCard() {
    const services = useContext(ServiceContext);
    const [dogs, setDogs] = useState<Dog[]>([]);

    useEffect(() => {
        async function fetchDogs() {
            const allDogs = await services?.dogRunOrderRepository.Get();
            setDogs(allDogs || []);
        }
        fetchDogs();
    }, [services]);

    let currentIndex = dogs.findIndex(dog => !dog.hasFinished);
    if (currentIndex === -1 && dogs.length > 0) currentIndex = 0;

    const currentDog = dogs[currentIndex];
    const nextDog = dogs[currentIndex + 1];
    const nextNextDog = dogs[currentIndex + 2];

    return (
        <Card
            size="3"
            style={{
                width: 320,
                flexShrink: 0,
                background: "linear-gradient(135deg, var(--purple-2) 0%, var(--purple-3) 100%)",
            }}
        >
            <Heading size="5" mb="3" align="center">Call Board</Heading>
            <Separator size="4" mb="4" />

            {/* Current */}
            <Box
                mb="4"
                p="4"
                style={{
                    background: "var(--purple-9)",
                    borderRadius: "var(--radius-3)",
                    textAlign: "center",
                }}
            >
                <Text size="1" weight="bold" style={{ color: "var(--purple-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Now Running
                </Text>
                <Text
                    as="p"
                    size="7"
                    weight="bold"
                    style={{ color: "white", marginTop: 4, lineHeight: 1.2 }}
                >
                    {currentDog ? currentDog.dogName : "—"}
                </Text>
                {currentDog && (
                    <Text size="2" style={{ color: "var(--purple-3)" }}>
                        {currentDog.handlerName}
                    </Text>
                )}
            </Box>

            {/* Next */}
            <Box
                mb="3"
                p="3"
                style={{
                    background: "var(--purple-4)",
                    borderRadius: "var(--radius-3)",
                    textAlign: "center",
                }}
            >
                <Text size="1" weight="bold" color="purple" style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Next
                </Text>
                <Text as="p" size="5" weight="bold" style={{ color: "var(--purple-12)", marginTop: 2 }}>
                    {nextDog ? nextDog.dogName : "—"}
                </Text>
                {nextDog && (
                    <Text size="2" color="gray">{nextDog.handlerName}</Text>
                )}
            </Box>

            {/* Up After */}
            <Box
                p="3"
                style={{
                    background: "var(--gray-3)",
                    borderRadius: "var(--radius-3)",
                    textAlign: "center",
                }}
            >
                <Text size="1" weight="bold" color="gray" style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Up After
                </Text>
                <Text as="p" size="4" weight="medium" style={{ color: "var(--gray-11)", marginTop: 2 }}>
                    {nextNextDog ? nextNextDog.dogName : "—"}
                </Text>
                {nextNextDog && (
                    <Text size="2" color="gray">{nextNextDog.handlerName}</Text>
                )}
            </Box>
        </Card>
    );
}

// ── Home Page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
    return (
        <Box p="5">
            <Heading size="7" mb="1">Today's Trial</Heading>
            <Text color="gray" size="2" mb="5" as="p">Live running order and call board.</Text>

            <Flex gap="4" align="start" wrap="wrap">
                <RunningOrderCard />
                <CallBoardCard />
            </Flex>
        </Box>
    );
}
