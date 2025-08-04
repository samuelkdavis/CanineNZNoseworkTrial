import DnDTable from "../../components/Table/DnDTable";

function AdminPage() {
    return (
        <>
        <input
            type="text"
            placeholder="Dog Name"
            style={{ padding: "8px", marginBottom: "16px", width: "100%" }}
        />
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