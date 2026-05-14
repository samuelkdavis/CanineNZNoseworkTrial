import React, { useState } from "react";
import {
    Box, Button, Card, Flex, Heading, Text, Badge,
    TextField, Separator, IconButton, ScrollArea,
} from "@radix-ui/themes";
import { useGroupingStore } from "../../helpers/useGroupingStore";
import type { DogEntry, Grouping } from "../../helpers/useGroupingStore";

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

// ── Grouping Editor ───────────────────────────────────────────────────────────

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

            <Flex gap="4" align="start">
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
                                    <DogRow key={dog.dogName} dog={dog} onAdd={() => onAddDog(dog)} />
                                ))
                            )}
                        </Flex>
                    </ScrollArea>
                </Box>

                <Separator orientation="vertical" style={{ alignSelf: "stretch" }} />

                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text size="1" weight="bold" color="gray" mb="2"
                        style={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                        In this grouping
                    </Text>
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

// ── Manage Groups Page ────────────────────────────────────────────────────────

export default function ManageGroups() {
    const { groupings, setGroupings, dogs } = useGroupingStore();
    const [newGroupName, setNewGroupName] = useState("");

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
        setGroupings(gs => gs.map(g => g.id === id ? { ...g, dogs: [...g.dogs, dog] } : g));

    const removeDogFromGrouping = (id: string, dogName: string) =>
        setGroupings(gs =>
            gs.map(g => g.id === id ? { ...g, dogs: g.dogs.filter(d => d.dogName !== dogName) } : g)
        );

    return (
        <Box p="5">
            <Heading size="7" mb="1">Manage Groups</Heading>
            <Text color="gray" size="2" as="p" mb="5">
                Create groupings and assign dogs to them.
            </Text>

            {/* New grouping */}
            <Card size="2" mb="5" style={{ display: "inline-block" }}>
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
                    <Text size="1" color="gray" mt="1" as="p">Load a CSV on the Upload page first.</Text>
                )}
            </Card>

            {/* Grouping editors */}
            {groupings.length === 0 ? (
                <Card size="3" style={{ maxWidth: 520 }}>
                    <Text size="2" color="gray">
                        No groupings yet. Add one above once a CSV has been loaded.
                    </Text>
                </Card>
            ) : (
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
