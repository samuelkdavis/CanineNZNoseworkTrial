import React, { useState } from "react";
import { Box, Flex, Text, Separator } from "@radix-ui/themes";
import WipPage from "../WipPage/WipPage";
import ManageCallboard from "./ManageCallboard";
import MessageTemplate from "./MessageTemplate";
import ManageGroups from "./ManageGroups";
import "./AdminHub.css";

// ── Sidebar nav items ─────────────────────────────────────────────────────────

type Section = "upload" | "groups" | "callboard" | "template";

const NAV_ITEMS: { id: Section; label: string }[] = [
    { id: "upload", label: "Upload Running Order" },
    { id: "groups", label: "Manage Groups" },
    { id: "callboard", label: "Manage Callboard" },
    { id: "template", label: "Message Template" },
];

// ── Admin Hub ─────────────────────────────────────────────────────────────────

export default function AdminHub() {
    const [active, setActive] = useState<Section>("upload");

    return (
        <Flex style={{ minHeight: "calc(100vh - 56px)" }}>
            {/* Sidebar */}
            <Box className="admin-sidebar">
                <Text size="1" weight="bold" color="gray"
                    style={{ textTransform: "uppercase", letterSpacing: "0.08em", padding: "16px 20px 8px" }}>
                    Admin
                </Text>
                <Separator size="4" mb="2" />
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        className={`admin-nav-item ${active === item.id ? "active" : ""}`}
                        onClick={() => setActive(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </Box>

            {/* Content — all panels stay mounted so local state is preserved */}
            <Box style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
                <Box style={{ display: active === "upload" ? "block" : "none" }}><WipPage /></Box>
                <Box style={{ display: active === "groups" ? "block" : "none" }}><ManageGroups /></Box>
                <Box style={{ display: active === "callboard" ? "block" : "none" }}><ManageCallboard /></Box>
                <Box style={{ display: active === "template" ? "block" : "none" }}><MessageTemplate /></Box>
            </Box>
        </Flex>
    );
}
