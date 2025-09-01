import axios from "axios";
import DnDTable from "../../components/Table/DnDTable";
import React, { useRef } from "react";
import { ServiceContext } from "../../repositories/ServiceContext";

function AdminPage() {
    const services = React.useContext(ServiceContext);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            console.error("No file selected");
            return;
        }
        console.log("Uploading file:", file.name);
        await services?.dogRunOrderRepository.Upload(file)
    };

    return (
        <>
            <div>Upload CSV here, view entries</div>
            <form onSubmit={handleFileUpload}>
                <input type="file" ref={fileInputRef} accept=".csv" />
                <button type="submit">Upload</button>
            </form>
            <button>Add dog</button>
            <DnDTable />
            <div style={{ padding: 24 }}>
                <h1>Admin Page</h1>
                <p>This is the admin page content.</p>
            </div>
        </>

    );
}

export default AdminPage;