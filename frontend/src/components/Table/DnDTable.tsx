import React, { useEffect } from "react";
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
import axios from "axios";
import useEffectAsync from "../../helpers/UseEffectAsync";
import type { Dog } from "../../repositories/Dog";

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
            <Table.Cell>{dog.dogName}</Table.Cell>
            <Table.Cell>{dog.orderId}</Table.Cell>
        </Table.Row>
    );
}

export default function DnDTable() {
    const [dogs, setDogs] = React.useState<Dog[]>([]);

    useEffectAsync(async () => {
        var response = await axios.get("https://localhost:7276/runningorder");

        setDogs(response.data);
        console.log(response.data);
    }, []);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = dogs.findIndex((dog) => dog.orderId === active.id);
            const newIndex = dogs.findIndex((dog) => dog.orderId === over.id);
            setDogs((dogs) => arrayMove(dogs, oldIndex, newIndex));
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={dogs.map((dog, idx) => dog.orderId)} strategy={verticalListSortingStrategy}>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Dog Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Age</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {dogs.map((dog, idx) => (
                            <SortableRow key={dog.orderId} dog={dog} index={idx} />
                        ))}
                    </Table.Body>
                </Table.Root></SortableContext>
        </DndContext>
    );
}