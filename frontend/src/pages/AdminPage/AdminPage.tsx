import axios from "axios";
import DnDTable from "../../components/Table/DnDTable";
import React, { useRef } from "react";

function AdminPage() {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            console.error("No file selected");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        var headers = {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        };
        await axios.post("https://localhost:7276/runningorder/upload", formData, headers);
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