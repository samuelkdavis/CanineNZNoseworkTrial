import axios from "axios";
import DnDTable from "../../components/Table/DnDTable";
import React, { useRef } from "react";
import { ServiceContext } from "../../repositories/ServiceContext";
import "./AdminPage.css";

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

    const handleClearTable = async () => {
        if (!window.confirm("Are you sure you want to clear all table data? This cannot be undone.")) return;
        try {
            await services?.dogRunOrderRepository.ClearAll();
            // Optionally, refresh table data here if needed
            window.location.reload(); // or trigger a state update to refresh the table
        } catch (err) {
            console.error("Failed to clear table:", err);
        }
    };

    return (
        <>
            <div className="csv-upload-container">Upload CSV here, view entries</div>
            <form className="csv-upload-form" onSubmit={handleFileUpload}>
                <label className="csv-upload-label">Choose CSV
                    <input type="file" style={{ display: "none" }} ref={fileInputRef} accept=".csv" />
                </label>

                <button type="submit" className="csv-upload-button">Upload</button>

                <button type="button" className="clear-table-button" onClick={handleClearTable}>
                    Clear Table
                </button>
            </form>
            <DnDTable />
        </>

    );
}

export default AdminPage;