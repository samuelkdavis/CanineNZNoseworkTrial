import { Table } from "@radix-ui/themes";
import DnDTable from "../../components/Table/DnDTable";
import React, { useEffect } from "react";
import { LineAxisOutlined } from "@mui/icons-material";
import useEffectAsync from "../../helpers/UseEffectAsync";
import axios from "axios";

function RunningOrder() {
    type Dog = {
        orderId: number;
        dogName: string;
        handlerName: string;
        class: string;
    };

    const [dogs, setDogs] = React.useState<Dog[]>([]);

    /*
    Payload example:
    [
        { "dogName": "Buddy", "handlerName": "Dennis Reynolds", "orderId": 1, "class": "Novice" },
        { "dogName": "Rum Ham", "handlerName": "Frank Reynolds", "orderId": 2, "class": "Intermediate" }
    ]
    */
    useEffectAsync(async () => {
        try {
            const result = await axios.get('https://localhost:7276/runningorder');
            console.log("Fetched dogs:", result.data);
            setDogs(result.data);
        }catch(error){
            console.error("Error fetching dogs:", error);
        }
    }, []);

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
                            <Table.Cell>{dog.orderId}</Table.Cell>
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