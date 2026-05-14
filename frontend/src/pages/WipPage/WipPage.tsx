import React, { useRef, useState } from "react";
import {
    Box, Button, Card, Flex, Heading, Text, Badge,
    Table, Checkbox,
} from "@radix-ui/themes";
import { useGroupingStore } from "../../helpers/useGroupingStore";
import type { DogEntry } from "../../helpers/useGroupingStore";

// ── CSV Parsing ───────────────────────────────────────────────────────────────

function parseCsv(text: string): DogEntry[] {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const idx = (name: string) => headers.indexOf(name);

    return lines.slice(1).map((line, i) => {
        const cols = line.split(",").map(c => c.trim());
        return {
            dogName: cols[idx("dogname")] ?? "",
            handlerName: cols[idx("handlername")] ?? "",
            class: cols[idx("class")] ?? "",
            order: parseInt(cols[idx("order")] ?? String(i + 1), 10),
            phoneNumber: cols[idx("phonenumber")] ?? "",
            email: cols[idx("email")] ?? "",
        };
    }).filter(d => d.dogName);
}

// ── Dog List Table ────────────────────────────────────────────────────────────

function DogListTable({
    dogs,
    onToggleReactive,
}: {
    dogs: DogEntry[];
    onToggleReactive: (dogName: string, value: boolean) => void;
}) {
    return (
        <Card size="3" mb="5">
            <Heading size="4" mb="3">Dog List</Heading>
            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Dog Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Handler</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Class</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Reactive</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {dogs.map(dog => (
                        <Table.Row key={dog.dogName}>
                            <Table.Cell><Text weight="bold">{dog.dogName}</Text></Table.Cell>
                            <Table.Cell>{dog.handlerName}</Table.Cell>
                            <Table.Cell>{dog.class}</Table.Cell>
                            <Table.Cell>{dog.phoneNumber}</Table.Cell>
                            <Table.Cell>{dog.email}</Table.Cell>
                            <Table.Cell style={{ textAlign: "center" }}>
                                <Checkbox
                                    checked={!!dog.reactive}
                                    onCheckedChange={checked =>
                                        onToggleReactive(dog.dogName, checked === true)
                                    }
                                    color="red"
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Card>
    );
}

// ── WIP Page ──────────────────────────────────────────────────────────────────

export default function WipPage() {
    const { dogs, setDogs, setGroupings } = useGroupingStore();
    const [csvError, setCsvError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCsvError(null);
        const reader = new FileReader();
        reader.onload = ev => {
            const text = ev.target?.result as string;
            const parsed = parseCsv(text);
            if (parsed.length === 0) {
                setCsvError("No dogs found — check the CSV format.");
                return;
            }
            setDogs(parsed);
            // Remove any dogs from groupings that are no longer in the CSV
            const names = new Set(parsed.map(d => d.dogName));
            setGroupings(gs =>
                gs.map(g => ({ ...g, dogs: g.dogs.filter(d => names.has(d.dogName)) }))
            );
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    const toggleReactive = (dogName: string, value: boolean) => {
        setDogs(prev =>
            prev.map(d => d.dogName === dogName ? { ...d, reactive: value } : d)
        );
        setGroupings(gs =>
            gs.map(g => ({
                ...g,
                dogs: g.dogs.map(d => d.dogName === dogName ? { ...d, reactive: value } : d),
            }))
        );
    };

    return (
        <Box p="5">
            <Heading size="7" mb="1">Upload Running Order</Heading>
            <Text color="gray" size="2" as="p" mb="5">
                Load a CSV file to populate the dog list.
            </Text>

            <Flex gap="4" mb="5" wrap="wrap" align="end">
                <Card size="2" style={{ flex: "0 0 auto" }}>
                    <Text size="1" weight="bold" color="gray" mb="2"
                        style={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                        Dog list
                    </Text>
                    <Flex align="center" gap="3">
                        <Button variant="soft" onClick={() => fileInputRef.current?.click()}>
                            {dogs.length > 0 ? "Replace CSV" : "Load CSV"}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            style={{ display: "none" }}
                            onChange={handleCsvUpload}
                        />
                        {dogs.length > 0 && (
                            <Badge color="green" variant="soft">{dogs.length} dogs loaded</Badge>
                        )}
                    </Flex>
                    {csvError && (
                        <Text size="2" color="red" mt="2" as="p">{csvError}</Text>
                    )}
                </Card>
            </Flex>

            {dogs.length > 0 && (
                <DogListTable dogs={dogs} onToggleReactive={toggleReactive} />
            )}
        </Box>
    );
}
