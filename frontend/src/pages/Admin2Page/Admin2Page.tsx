import React, { useContext, useState } from "react";
import { Box, Heading, Text, Card, Flex, Badge, Separator, TextField, Button, IconButton, TextArea } from "@radix-ui/themes";
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
import "./Admin2Page.css";

// ── Template helpers ──────────────────────────────────────────────────────────

const TEMPLATE_STORAGE_KEY = "admin2-message-template";

const DEFAULT_TEMPLATE =
    "Hi {handlerName}, this is a reminder that {dogName} is coming up soon in {groupName}. Please make your way to the ring.";

const VARIABLES: { name: string; description: string }[] = [
    { name: "dogName", description: "Dog's name" },
    { name: "handlerName", description: "Handler's name" },
    { name: "groupName", description: "Grouping name" },
];

function resolveTemplate(template: string, dog: DogEntry, groupName: string): string {
    return template
        .replace(/\{dogName\}/g, dog.dogName)
        .replace(/\{handlerName\}/g, dog.handlerName)
        .replace(/\{groupName\}/g, groupName);
}

// Highlight {variables} in the template preview
function HighlightedTemplate({ text }: { text: string }) {
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

// ── Template Box ──────────────────────────────────────────────────────────────

function TemplateBox() {
    const [template, setTemplate] = useState<string>(() => {
        return sessionStorage.getItem(TEMPLATE_STORAGE_KEY) ?? DEFAULT_TEMPLATE;
    });
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
        <Card size="3" mt="6">
            <Flex align="center" gap="2" mb="3">
                <Heading size="4" style={{ flex: 1 }}>Message Template</Heading>
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
                    {/* Variable chips */}
                    <Flex gap="2" wrap="wrap" mb="3">
                        <Text size="1" color="gray" weight="bold" style={{ alignSelf: "center" }}>
                            Insert variable:
                        </Text>
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

                    {/* Live preview */}
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

                    {/* Example resolved output */}
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
    );
}


// ── Sortable Dog Row ──────────────────────────────────────────────────────────

function SortableDogRow({ dog, groupingId }: { dog: DogEntry; groupingId: string }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: `${groupingId}-${dog.dogName}` });
    const services = useContext(ServiceContext);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? "var(--gray-4)" : "var(--gray-2)",
        borderRadius: "var(--radius-2)",
        border: "1px solid var(--gray-5)",
        padding: "8px 12px",
        marginBottom: "8px",
    };

    const handleSendText = async () => {
        // For now, just log — you can wire this to the repository later
        console.log(`Send text to ${dog.dogName} at ${dog.phoneNumber}`);
        // await services?.dogRunOrderRepository.SendText(dog.order);
    };

    const handleSendEmail = async () => {
        console.log(`Send email to ${dog.dogName} at ${dog.email}`);
        // await services?.dogRunOrderRepository.SendEmail(dog.order);
    };

    const handleMarkFinished = async () => {
        console.log(`Mark ${dog.dogName} as finished`);
        // await services?.dogRunOrderRepository.MarkFinished(dog.order);
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Flex align="center" gap="3">
                {/* Drag handle */}
                <span {...listeners} className="drag-handle" title="Drag to reorder">
                    ⠿
                </span>

                {/* Dog info */}
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text size="2" weight="bold" style={{ display: "block" }}>
                        {dog.dogName}
                    </Text>
                    <Text size="1" color="gray">
                        {dog.handlerName}
                    </Text>
                </Box>

                {/* Action buttons */}
                <Flex gap="2">
                    <button onClick={handleSendText} className="action-button text">
                        Send Text
                    </button>
                    <button onClick={handleSendEmail} className="action-button email">
                        Send Email
                    </button>
                    <button onClick={handleMarkFinished} className="action-button finished">
                        Finished
                    </button>
                </Flex>
            </Flex>
        </div>
    );
}

// ── Grouping List ─────────────────────────────────────────────────────────────

function GroupingList({ grouping }: { grouping: Grouping }) {
    const { setGroupings } = useGroupingStore();
    const [timeInput, setTimeInput] = useState(grouping.estimatedStartTime ?? "");

    const handleTimeChange = (value: string) => {
        setTimeInput(value);
        setGroupings(prev =>
            prev.map(g => g.id === grouping.id ? { ...g, estimatedStartTime: value || undefined } : g)
        );
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setGroupings(prev =>
            prev.map(g => {
                if (g.id !== grouping.id) return g;
                const oldIdx = g.dogs.findIndex(d => `${g.id}-${d.dogName}` === active.id);
                const newIdx = g.dogs.findIndex(d => `${g.id}-${d.dogName}` === over.id);
                if (oldIdx === -1 || newIdx === -1) return g;
                return { ...g, dogs: arrayMove(g.dogs, oldIdx, newIdx) };
            })
        );
    };

    if (grouping.dogs.length === 0) {
        return (
            <Card size="3" style={{ minWidth: 320, flex: "1 1 320px" }}>
                <Flex align="center" gap="2" mb="2">
                    <Heading size="4" style={{ flex: 1 }}>{grouping.name}</Heading>
                    <Badge variant="soft" color="gray">0 dogs</Badge>
                </Flex>
                <Flex align="center" gap="2" mb="3">
                    <Text size="1" color="gray" weight="bold" style={{ minWidth: 80 }}>Start time:</Text>
                    <TextField.Root
                        type="time"
                        value={timeInput}
                        onChange={e => handleTimeChange(e.target.value)}
                        placeholder="HH:MM"
                        size="1"
                        style={{ width: 100 }}
                    />
                </Flex>
                <Separator size="4" my="3" />
                <Text size="2" color="gray">No dogs in this grouping.</Text>
            </Card>
        );
    }

    return (
        <Card size="3" style={{ minWidth: 320, flex: "1 1 320px" }}>
            <Flex align="center" gap="2" mb="2">
                <Heading size="4" style={{ flex: 1 }}>{grouping.name}</Heading>
                <Badge variant="soft" color="purple">{grouping.dogs.length} dogs</Badge>
            </Flex>
            <Flex align="center" gap="2" mb="3">
                <Text size="1" color="gray" weight="bold" style={{ minWidth: 80 }}>Start time:</Text>
                <TextField.Root
                    type="time"
                    value={timeInput}
                    onChange={e => handleTimeChange(e.target.value)}
                    placeholder="HH:MM"
                    size="1"
                    style={{ width: 100 }}
                />
            </Flex>
            <Separator size="4" mb="3" />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={grouping.dogs.map(d => `${grouping.id}-${d.dogName}`)}
                    strategy={verticalListSortingStrategy}
                >
                    {grouping.dogs.map(dog => (
                        <SortableDogRow
                            key={dog.dogName}
                            dog={dog}
                            groupingId={grouping.id}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </Card>
    );
}

// ── Admin2 Page ───────────────────────────────────────────────────────────────

export default function Admin2Page() {
    const { groupings } = useGroupingStore();

    return (
        <Box p="5">
            <Heading size="7" mb="1">Admin 2 — Manage Groupings</Heading>
            <Text color="gray" size="2" as="p" mb="5">
                View and manage dogs in each grouping. Drag to reorder within a group.
            </Text>

            {groupings.length === 0 ? (
                <Card size="3" style={{ maxWidth: 520 }}>
                    <Text size="2" color="gray">
                        No groupings yet. Go to the <strong>WIP</strong> page to create groupings and assign dogs.
                    </Text>
                </Card>
            ) : (
                <Flex gap="4" wrap="wrap" align="start">
                    {groupings.map(g => (
                        <GroupingList key={g.id} grouping={g} />
                    ))}
                </Flex>
            )}

            <TemplateBox />
        </Box>
    );
}
