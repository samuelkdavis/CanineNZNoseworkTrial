import { Table } from "@radix-ui/themes";
import DnDTable from "../../components/Table/DnDTable";
import React, { useEffect } from "react";
import { LineAxisOutlined } from "@mui/icons-material";
import useEffectAsync from "../../UseEffectAsync";
import axios from "axios";

// payload - {"dogName":"Buddy","age":4}
function DogsPage() {

    const [dogs, setDogs] = React.useState([]);

    useEffectAsync(async () => {
        try {
            const result = await axios.get('https://localhost:7276/weatherforecast');
            console.log("Fetched dogs:", result.data);
            setDogs(result.data);
        }catch(error){
            console.error("Error fetching dogs:", error);
        }

    }, []);

    return (
        <>
            <div style={{ padding: 24 }}>
                <h1>Dogs Page</h1>
                <p>This is the dogs page content.</p>
            </div>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
                        <Table.Cell>danilo@example.com</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
                        <Table.Cell>zahra@example.com</Table.Cell>
                        <Table.Cell>Admin</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>
                        <Table.Cell>jasper@example.com</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        </>

    );
}
export default DogsPage;