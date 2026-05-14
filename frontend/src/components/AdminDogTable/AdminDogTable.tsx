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
import type { Dog } from "../../repositories/Dog";
import { ServiceContext } from "../../repositories/ServiceContext";
import "./AdminDogTable.css";

function SortableRow({ dog, index }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: dog.order });
    const services = React.useContext(ServiceContext);
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? "#f0f0f0" : undefined,
    };

    const handleSendText = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await services?.dogRunOrderRepository.SendText(dog.order);
            alert(`Text sent to ${dog.handlerName} (${dog.phoneNumber})`);
        } catch (err: any) {
            const detail = err?.response?.data || err?.message || "Unknown error";
            alert(`Failed to send text: ${detail}`);
        }
    };

    const handleSendEmail = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await services?.dogRunOrderRepository.SendEmail(dog.order);
    };

    const handleMarkFinished = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await services?.dogRunOrderRepository.MarkFinished(dog.order);
    };

    return (
        <Table.Row ref={setNodeRef} style={style}>
            <Table.Cell>
                <span
                    {...attributes}
                    {...listeners}
                    style={{
                        cursor: "grab",
                        userSelect: "none",
                        display: "inline-block",
                        padding: "2px 6px",
                    }}
                    title="Drag to reorder"
                    aria-label="Drag handle"
                >
                    ⠿
                </span>{" "}
                {dog.order}
            </Table.Cell>
            <Table.Cell>{dog.dogName}</Table.Cell>
            <Table.Cell>{dog.handlerName}</Table.Cell>
            <Table.Cell>{dog.class}</Table.Cell>
            <Table.Cell>{dog.phoneNumber}</Table.Cell>
            <Table.Cell>{dog.email}</Table.Cell>
            <Table.Cell className="actions-cell">                
                <button onClick={handleSendText} className="action-button text">Send Text</button>
                <button onClick={handleSendEmail} className="action-button email">Send Email</button>
                <button onClick={handleMarkFinished} className="action-button finished">Finished</button>
            </Table.Cell>
        </Table.Row>
    );
}

export default function AdminDogTable({ dogs, setDogs }: { dogs: Dog[], setDogs: (dogs: Dog[]) => void }) {
    const services = React.useContext(ServiceContext);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = dogs.findIndex((dog) => dog.order === active.id);
            const newIndex = dogs.findIndex((dog) => dog.order === over.id);
            setDogs(arrayMove(dogs, oldIndex, newIndex));
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={dogs.map((dog, idx) => dog.order)} strategy={verticalListSortingStrategy}>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Order</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Dog Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Handler Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Class</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Phone Number</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="actions-header">Actions</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {dogs.map((dog, idx) => (
                            <SortableRow key={dog.order} dog={dog} index={idx} />
                        ))}
                    </Table.Body>
                </Table.Root></SortableContext>
        </DndContext>
    );
}