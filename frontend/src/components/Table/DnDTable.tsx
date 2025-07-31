import React from "react";
import { Table } from "@radix-ui/themes";
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

const initialDogs = [
    { id: "1", name: "Buddy", age: 3 },
    { id: "2", name: "Bella", age: 5 },
    { id: "3", name: "Charlie", age: 2 },
    { id: "4", name: "Lucy", age: 4 },
];

function SortableRow({ dog, index }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: dog.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? "#f0f0f0" : undefined,
        cursor: "grab",
    };

    return (
        <Table.Row ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Table.Cell>{dog.name}</Table.Cell>
            <Table.Cell>{dog.age}</Table.Cell>
        </Table.Row>
    );
}

export default function DnDTable() {
    const [dogs, setDogs] = React.useState(initialDogs);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = dogs.findIndex((dog) => dog.id === active.id);
            const newIndex = dogs.findIndex((dog) => dog.id === over.id);
            setDogs((dogs) => arrayMove(dogs, oldIndex, newIndex));
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={dogs.map((dog) => dog.id)} strategy={verticalListSortingStrategy}>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Dog Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Age</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {dogs.map((dog, idx) => (
                            <SortableRow key={dog.id} dog={dog} index={idx} />
                        ))}
                    </Table.Body>
                </Table.Root></SortableContext>
        </DndContext>
    );
}