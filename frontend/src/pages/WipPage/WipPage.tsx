import React, { useRef, useState } from "react";
import {
    Box, Button, Card, Flex, Heading, Text, Badge,
    TextField, Separator, IconButton, ScrollArea, Table, Checkbox,
} from "@radix-ui/themes";
import { useGroupingStore } from "../../helpers/useGroupingStore";
import type { DogEntry, Grouping } from "../../helpers/useGroupingStore";

// ── Types ─────────────────────────────────────────────────────────────────────
// DogEntry and Grouping are imported from the shared store

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

// ── Dog Row ───────────────────────────────────────────────────────────────────

function DogRow({
    dog,
    onAdd,
    onRemove,
    inGrouping,
}: {
    dog: DogEntry;
    onAdd?: () => void;
    onRemove?: () => void;
    inGrouping?: boolean;
}) {
    return (
        <Flex
            align="center"
            gap="2"
            px="3"
            py="2"
            style={{
                background: inGrouping ? "var(--purple-3)" : "var(--gray-2)",
                borderRadius: "var(--radius-2)",
                border: `1px solid ${inGrouping ? "var(--purple-6)" : "var(--gray-5)"}`,
            }}
        >
            <Box style={{ flex: 1, minWidth: 0 }}>
                <Text size="2" weight="bold" style={{ display: "block" }}>{dog.dogName}</Text>
                <Text size="1" color="gray">{dog.handlerName}</Text>
            </Box>
            {onAdd && (
                <IconButton size="1" variant="soft" color="purple" onClick={onAdd} title="Add to grouping">
                    +
                </IconButton>
            )}
            {onRemove && (
                <IconButton size="1" variant="ghost" color="red" onClick={onRemove} title="Remove">
                    ×
                </IconButton>
            )}
        </Flex>
    );
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
                            <Table.Cell>
                                <Text weight="bold">{dog.dogName}</Text>
                            </Table.Cell>
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

// ── Grouping Editor (two-panel layout) ───────────────────────────────────────

function GroupingEditor({
    grouping,
    allDogs,
    onRename,
    onDelete,
    onAddDog,
    onRemoveDog,
}: {
    grouping: Grouping;
    allDogs: DogEntry[];
    onRename: (name: string) => void;
    onDelete: () => void;
    onAddDog: (dog: DogEntry) => void;
    onRemoveDog: (dogName: string) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [nameInput, setNameInput] = useState(grouping.name);
    const [search, setSearch] = useState("");

    const assignedNames = new Set(grouping.dogs.map(d => d.dogName));
    const available = allDogs.filter(d => {
        if (assignedNames.has(d.dogName)) return false;
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return d.dogName.toLowerCase().includes(q) || d.handlerName.toLowerCase().includes(q);
    });

    const commitRename = () => {
        if (nameInput.trim()) onRename(nameInput.trim());
        setEditing(false);
    };

    return (
        <Card size="3">
            {/* Card header */}
            <Flex align="center" gap="2" mb="3">
                {editing ? (
                    <TextField.Root
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={e => e.key === "Enter" && commitRename()}
                        autoFocus
                        style={{ flex: 1 }}
                    />
                ) : (
                    <Heading
                        size="4"
                        style={{ flex: 1, cursor: "pointer" }}
                        onClick={() => setEditing(true)}
                        title="Click to rename"
                    >
                        {grouping.name}
                    </Heading>
                )}
                <Badge variant="soft" color="purple">{grouping.dogs.length} dogs</Badge>
                {grouping.estimatedStartTime && (
                    <Badge variant="soft" color="gray">🕐 {grouping.estimatedStartTime}</Badge>
                )}
                <IconButton size="1" variant="ghost" color="red" onClick={onDelete} title="Delete grouping">
                    ×
                </IconButton>
            </Flex>

            <Separator size="4" mb="3" />

            {/* Two-panel body */}
            <Flex gap="4" align="start">

                {/* Left — full dog list with search */}
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text size="1" weight="bold" color="gray" mb="2"
                        style={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                        All dogs
                    </Text>
                    <TextField.Root
                        placeholder="Search dog or handler…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        mb="2"
                    />
                    <ScrollArea style={{ height: 300 }}>
                        <Flex direction="column" gap="2" pr="2">
                            {available.length === 0 ? (
                                <Text size="2" color="gray">
                                    {search ? "No matches." : "All dogs assigned."}
                                </Text>
                            ) : (
                                available.map(dog => (
                                    <DogRow
                                        key={dog.dogName}
                                        dog={dog}
                                        onAdd={() => onAddDog(dog)}
                                    />
                                ))
                            )}
                        </Flex>
                    </ScrollArea>
                </Box>

                {/* Divider */}
                <Separator orientation="vertical" style={{ alignSelf: "stretch" }} />

                {/* Right — assigned dogs */}
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text size="1" weight="bold" color="gray" mb="2"
                        style={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                        In this grouping
                    </Text>
                    {/* Spacer to align with search box on the left */}
                    <Box mb="2" style={{ height: 32 }} />
                    <ScrollArea style={{ height: 300 }}>
                        <Flex direction="column" gap="2" pr="2">
                            {grouping.dogs.length === 0 ? (
                                <Text size="2" color="gray">Click + to add dogs from the left.</Text>
                            ) : (
                                grouping.dogs.map(dog => (
                                    <DogRow
                                        key={dog.dogName}
                                        dog={dog}
                                        inGrouping
                                        onRemove={() => onRemoveDog(dog.dogName)}
                                    />
                                ))
                            )}
                        </Flex>
                    </ScrollArea>
                </Box>
            </Flex>
        </Card>
    );
}

// ── WIP Page ──────────────────────────────────────────────────────────────────

export default function WipPage() {
    const { groupings, setGroupings, dogs, setDogs } = useGroupingStore();
    const [newGroupName, setNewGroupName] = useState("");
    const [csvError, setCsvError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── CSV upload ──────────────────────────────────────────────────────────

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
            const names = new Set(parsed.map(d => d.dogName));
            setGroupings(gs =>
                gs.map(g => ({ ...g, dogs: g.dogs.filter(d => names.has(d.dogName)) }))
            );
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    // ── Grouping actions ────────────────────────────────────────────────────

    const addGrouping = () => {
        const name = newGroupName.trim() || `Group ${groupings.length + 1}`;
        setGroupings(gs => [...gs, { id: crypto.randomUUID(), name, dogs: [] }]);
        setNewGroupName("");
    };

    const renameGrouping = (id: string, name: string) =>
        setGroupings(gs => gs.map(g => g.id === id ? { ...g, name } : g));

    const deleteGrouping = (id: string) =>
        setGroupings(gs => gs.filter(g => g.id !== id));

    const addDogToGrouping = (id: string, dog: DogEntry) =>
        setGroupings(gs =>
            gs.map(g => g.id === id ? { ...g, dogs: [...g.dogs, dog] } : g)
        );

    const removeDogFromGrouping = (id: string, dogName: string) =>
        setGroupings(gs =>
            gs.map(g => g.id === id ? { ...g, dogs: g.dogs.filter(d => d.dogName !== dogName) } : g)
        );

    const toggleReactive = (dogName: string, value: boolean) => {
        // Update the local dog list
        setDogs(prev =>
            prev.map(d => d.dogName === dogName ? { ...d, reactive: value } : d)
        );
        // Also update any copies of this dog already assigned to groupings
        setGroupings(gs =>
            gs.map(g => ({
                ...g,
                dogs: g.dogs.map(d => d.dogName === dogName ? { ...d, reactive: value } : d),
            }))
        );
    };

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <Box p="5">
            <Heading size="7" mb="1">Work In Progress</Heading>
            <Text color="gray" size="2" as="p" mb="5">
                Create groupings and assign dogs from a CSV file.
            </Text>

            {/* ── Top controls ── */}
            <Flex gap="4" mb="5" wrap="wrap" align="end">
                {/* Load CSV */}
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

                {/* Add grouping */}
                <Card size="2" style={{ flex: "0 0 auto" }}>
                    <Text size="1" weight="bold" color="gray" mb="2"
                        style={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                        New grouping
                    </Text>
                    <Flex gap="2">
                        <TextField.Root
                            placeholder="e.g. Ring 1, Morning Session…"
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && dogs.length > 0 && addGrouping()}
                            style={{ width: 240 }}
                            disabled={dogs.length === 0}
                        />
                        <Button onClick={addGrouping} disabled={dogs.length === 0}>
                            Add
                        </Button>
                    </Flex>
                    {dogs.length === 0 && (
                        <Text size="1" color="gray" mt="1" as="p">Load a CSV first.</Text>
                    )}
                </Card>
            </Flex>

            {/* ── Dog list table ── */}
            {dogs.length > 0 && (
                <DogListTable dogs={dogs} onToggleReactive={toggleReactive} />
            )}

            {/* ── Grouping editors ── */}
            {groupings.length > 0 && (
                <Flex direction="column" gap="5">
                    {groupings.map(g => (
                        <GroupingEditor
                            key={g.id}
                            grouping={g}
                            allDogs={dogs}
                            onRename={name => renameGrouping(g.id, name)}
                            onDelete={() => deleteGrouping(g.id)}
                            onAddDog={dog => addDogToGrouping(g.id, dog)}
                            onRemoveDog={dogName => removeDogFromGrouping(g.id, dogName)}
                        />
                    ))}
                </Flex>
            )}
        </Box>
    );
}
