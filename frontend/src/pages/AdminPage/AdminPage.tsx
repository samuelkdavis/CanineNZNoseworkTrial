import axios from "axios";
import AdminDogTable from "../../components/AdminDogTable/AdminDogTable";
import React, { useRef } from "react";
import { ServiceContext } from "../../repositories/ServiceContext";
import type { Dog } from "../../repositories/Dog";
import useEffectAsync from "../../helpers/UseEffectAsync";
import "./AdminPage.css";

function AdminPage() {
    const services = React.useContext(ServiceContext);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dogs, setDogs] = React.useState<Dog[]>([]);

    useEffectAsync(async () => {
        try {
            const dogsResponse: Dog[] = await services?.dogRunOrderRepository.Get() ?? [];
            setDogs(dogsResponse);
            console.log("Loaded dogs:", dogsResponse);
        } catch (err) {
            console.error("Failed to load dogs:", err);
        }
    }, []);

    const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            console.error("No file selected");
            return;
        }
        console.log("Uploading file:", file.name);
        try {
            const updatedDogs = await services?.dogRunOrderRepository.Upload(file);
            console.log("Upload response:", updatedDogs);
            // Ensure it's always an array
            const dogsArray = Array.isArray(updatedDogs) ? updatedDogs : [];
            setDogs(dogsArray);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error("Failed to upload file:", err);
        }
    };

    const handleClearTable = async () => {
        if (!window.confirm("Are you sure you want to clear all table data? This cannot be undone.")) return;
        try {
            await services?.dogRunOrderRepository.ClearAll();
            setDogs([]);
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
            <AdminDogTable dogs={dogs} setDogs={setDogs} />
        </>

    );
}

export default AdminPage;