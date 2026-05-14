import { Table } from "@radix-ui/themes";
import AdminDogTable from "../../components/AdminDogTable/AdminDogTable";
import React from "react";
import useEffectAsync from "../../helpers/UseEffectAsync";
import type { Dog } from "../../repositories/Dog";
import { ServiceContext } from "../../repositories/ServiceContext";

function RunningOrder() {
    const services = React.useContext(ServiceContext);
    const [dogs, setDogs] = React.useState<Dog[]>([]);

    useEffectAsync(async () => {
        try {
            const result = await services?.dogRunOrderRepository.Get() ?? [];
            setDogs(result);
        } catch (error) {
            console.error("Error fetching dogs:", error);
        }
    }, [services]);

    return (
        <>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Order</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Dog Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Handler Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Class</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {dogs.map((dog, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{dog.order}</Table.Cell>
                            <Table.Cell>{dog.dogName}</Table.Cell>
                            <Table.Cell>{dog.handlerName}</Table.Cell>
                            <Table.Cell>{dog.class}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </>
    );
}

export default RunningOrder;