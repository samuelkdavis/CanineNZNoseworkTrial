/**
 * Shared session-storage backed store for WIP groupings.
 * Both WipPage and Admin2Page read/write the same key so changes
 * made in one page are immediately visible in the other.
 */

import { useState, useEffect } from "react";

const GROUPINGS_KEY = "wip-groupings";
const DOGS_KEY = "wip-dogs";

export type DogEntry = {
    dogName: string;
    handlerName: string;
    class: string;
    order: number;
    phoneNumber: string;
    email: string;
    hasFinished?: boolean;
    reactive?: boolean;
};

export type Grouping = {
    id: string;
    name: string;
    estimatedStartTime?: string; // "HH:MM" 24-hour format
    dogs: DogEntry[];
};

function loadGroupings(): Grouping[] {
    try {
        const raw = sessionStorage.getItem(GROUPINGS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveGroupings(groupings: Grouping[]) {
    sessionStorage.setItem(GROUPINGS_KEY, JSON.stringify(groupings));
}

function loadDogs(): DogEntry[] {
    try {
        const raw = sessionStorage.getItem(DOGS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveDogs(dogs: DogEntry[]) {
    sessionStorage.setItem(DOGS_KEY, JSON.stringify(dogs));
}

export function useGroupingStore() {
    const [groupings, setGroupingsState] = useState<Grouping[]>(loadGroupings);
    const [dogs, setDogsState] = useState<DogEntry[]>(loadDogs);

    useEffect(() => { saveGroupings(groupings); }, [groupings]);
    useEffect(() => { saveDogs(dogs); }, [dogs]);

    const setGroupings = (updater: Grouping[] | ((prev: Grouping[]) => Grouping[])) => {
        setGroupingsState(prev => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            saveGroupings(next);
            return next;
        });
    };

    const setDogs = (updater: DogEntry[] | ((prev: DogEntry[]) => DogEntry[])) => {
        setDogsState(prev => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            saveDogs(next);
            return next;
        });
    };

    return { groupings, setGroupings, dogs, setDogs };
}
