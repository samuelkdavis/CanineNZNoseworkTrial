import React, { useContext, useState } from "react";
import { Box, Heading, Text, Card, Flex, Badge, Separator, TextField, Button } from "@radix-ui/themes";
import { useGroupingStore } from "../../helpers/useGroupingStore";
import type { DogEntry, Grouping } from "../../helpers/useGroupingStore";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ServiceContext } from "../../repositories/ServiceContext";
import "../Admin2Page/Admin2Page.css";

// ── Sortable Dog Row ──────────────────────────────────────────────────────────

function SortableDogRow({
    dog,
    groupingId,
    onMarkFinished,
    onUndoFinished,
}: {
    dog: DogEntry;
    groupingId: string;
    onMarkFinished: (dogName: string, groupId: string) => void;
    onUndoFinished: (dogName: string, groupId: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: `${groupingId}-${dog.dogName}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? "var(--gray-4)" : "var(--gray-2)",
        borderRadius: "var(--radius-2)",
        border: "1px solid var(--gray-5)",
        padding: "8px 12px",
        marginBottom: "8px",
        opacity: dog.hasFinished ? 0.55 : 1,
    };

    const handleSendText = () => console.log(`Send text to ${dog.dogName} at ${dog.phoneNumber}`);
    const handleSendEmail = () => console.log(`Send email to ${dog.dogName} at ${dog.email}`);

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Flex align="center" gap="3">
                <span {...listeners} className="drag-handle" title="Drag to reorder">⠿</span>
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Flex align="center" gap="2">
                        <Text size="2" weight="bold"
                            style={{ textDecoration: dog.hasFinished ? "line-through" : "none" }}>
                            {dog.dogName}
                        </Text>
                        {dog.hasFinished && <Badge color="gray" variant="soft" size="1">✓ Done</Badge>}
                        {dog.reactive && <Badge color="red" variant="solid" size="1">🎀 Reactive</Badge>}
                    </Flex>
                    <Text size="1" color="gray">{dog.handlerName}</Text>
                </Box>
                <Flex gap="2">
                    <button onClick={handleSendText} className="action-button text">Send Text</button>
                    <button onClick={handleSendEmail} className="action-button email">Send Email</button>
                    {dog.hasFinished ? (
                        <button
                            onClick={() => onUndoFinished(dog.dogName, groupingId)}
                            className="action-button undo"
                        >
                            ↩ Undo
                        </button>
                    ) : (
                        <button
                            onClick={() => onMarkFinished(dog.dogName, groupingId)}
                            className="action-button finished"
                        >
                            Finished
                        </button>
                    )}
                </Flex>
            </Flex>
        </div>
    );
}

// ── Grouping List ─────────────────────────────────────────────────────────────

function GroupingList({
    grouping,
    onMarkFinished,
    onUndoFinished,
    onTimeChange,
    onReorder,
}: {
    grouping: Grouping;
    onMarkFinished: (dogName: string, groupId: string) => void;
    onUndoFinished: (dogName: string, groupId: string) => void;
    onTimeChange: (groupId: string, value: string) => void;
    onReorder: (groupId: string, oldIdx: number, newIdx: number) => void;
}) {
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIdx = grouping.dogs.findIndex(d => `${grouping.id}-${d.dogName}` === active.id);
        const newIdx = grouping.dogs.findIndex(d => `${grouping.id}-${d.dogName}` === over.id);
        if (oldIdx !== -1 && newIdx !== -1) onReorder(grouping.id, oldIdx, newIdx);
    };

    const finishedCount = grouping.dogs.filter(d => d.hasFinished).length;

    if (grouping.dogs.length === 0) {
        return (
            <Card size="3">
                <Flex align="center" gap="2" mb="2">
                    <Heading size="4" style={{ flex: 1 }}>{grouping.name}</Heading>
                    <Badge variant="soft" color="gray">0 dogs</Badge>
                </Flex>
                <Flex align="center" gap="2" mb="3">
                    <Text size="1" color="gray" weight="bold" style={{ minWidth: 80 }}>Start time:</Text>
                    <TextField.Root type="time" value={grouping.estimatedStartTime ?? ""}
                        onChange={e => onTimeChange(grouping.id, e.target.value)}
                        placeholder="HH:MM" size="1" style={{ width: 100 }} />
                </Flex>
                <Separator size="4" my="3" />
                <Text size="2" color="gray">No dogs in this grouping.</Text>
            </Card>
        );
    }

    return (
        <Card size="3">
            <Flex align="center" gap="2" mb="2">
                <Heading size="4" style={{ flex: 1 }}>{grouping.name}</Heading>
                <Badge variant="soft" color="gray">{finishedCount}/{grouping.dogs.length} done</Badge>
                <Badge variant="soft" color="purple">{grouping.dogs.length} dogs</Badge>
            </Flex>
            <Flex align="center" gap="2" mb="3">
                <Text size="1" color="gray" weight="bold" style={{ minWidth: 80 }}>Start time:</Text>
                <TextField.Root type="time" value={grouping.estimatedStartTime ?? ""}
                    onChange={e => onTimeChange(grouping.id, e.target.value)}
                    placeholder="HH:MM" size="1" style={{ width: 100 }} />
            </Flex>
            <Separator size="4" mb="3" />

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={grouping.dogs.map(d => `${grouping.id}-${d.dogName}`)}
                    strategy={verticalListSortingStrategy}
                >
                    {grouping.dogs.map(dog => (
                        <SortableDogRow
                            key={dog.dogName}
                            dog={dog}
                            groupingId={grouping.id}
                            onMarkFinished={onMarkFinished}
                            onUndoFinished={onUndoFinished}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </Card>
    );
}

export default function ManageCallboard() {
    const { groupings, setGroupings } = useGroupingStore();

    const handleMarkFinished = (dogName: string, groupId: string) => {
        setGroupings(prev =>
            prev.map(g => g.id !== groupId ? g : {
                ...g,
                dogs: g.dogs.map(d => d.dogName === dogName ? { ...d, hasFinished: true } : d),
            })
        );
    };

    const handleUndoFinished = (dogName: string, groupId: string) => {
        setGroupings(prev =>
            prev.map(g => g.id !== groupId ? g : {
                ...g,
                dogs: g.dogs.map(d => d.dogName === dogName ? { ...d, hasFinished: false } : d),
            })
        );
    };

    const handleTimeChange = (groupId: string, value: string) => {
        setGroupings(prev =>
            prev.map(g => g.id === groupId ? { ...g, estimatedStartTime: value || undefined } : g)
        );
    };

    const handleReorder = (groupId: string, oldIdx: number, newIdx: number) => {
        setGroupings(prev =>
            prev.map(g => g.id !== groupId ? g : {
                ...g,
                dogs: arrayMove(g.dogs, oldIdx, newIdx),
            })
        );
    };

    return (
        <Box p="5">
            <Heading size="7" mb="1">Manage Callboard</Heading>
            <Text color="gray" size="2" as="p" mb="5">
                Mark dogs as finished to advance the call board. Drag to reorder within a group.
            </Text>

            {groupings.length === 0 ? (
                <Card size="3" style={{ maxWidth: 520 }}>
                    <Text size="2" color="gray">
                        No groupings yet. Go to <strong>Upload Running Order</strong> to create groupings and assign dogs.
                    </Text>
                </Card>
            ) : (
                <Flex direction="column" gap="4">
                    {groupings.map(g => (
                        <GroupingList
                            key={g.id}
                            grouping={g}
                            onMarkFinished={handleMarkFinished}
                            onUndoFinished={handleUndoFinished}
                            onTimeChange={handleTimeChange}
                            onReorder={handleReorder}
                        />
                    ))}
                </Flex>
            )}
        </Box>
    );
}
