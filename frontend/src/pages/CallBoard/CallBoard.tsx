import React, { useEffect, useState, useContext } from "react";
import { ServiceContext } from "../../repositories/ServiceContext";
import type { Dog } from "../../repositories/Dog";

export default function CallBoard() {
    const services = useContext(ServiceContext);
    const [dogs, setDogs] = useState<Dog[]>([]);

    useEffect(() => {
        async function fetchDogs() {
            const allDogs = await services?.dogRunOrderRepository.Get();
            setDogs(allDogs || []);
        }
        fetchDogs();
        // Optionally, poll or use websockets for live updates
    }, [services]);

    console.log(services);

    // Find the first dog that has not finished
    let currentIndex = dogs.findIndex(dog => !dog.hasFinished);
    console.log(currentIndex);

    // If all dogs have finished or none have the property, show the first dog
    if (currentIndex === -1 && dogs.length > 0) {
        currentIndex = 0;
    }

    console.log(currentIndex);
    console.log(dogs);

    const currentDog = dogs[currentIndex];
    const nextDog = dogs[currentIndex + 1];
    const nextNextDog = dogs[currentIndex + 2];

    return (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <h1>Call Board</h1>
            <div style={{ margin: "2rem 0", fontSize: "2rem" }}>
                <div>
                    <strong>Current:</strong>
                    <div style={{ fontSize: "2.5rem", color: "#1976d2", margin: "1rem 0" }}>
                        {currentDog ? currentDog.dogName : "No dog currently running"}
                    </div>
                </div>
                <div>
                    <strong>Next:</strong>
                    <div style={{ fontSize: "2rem", color: "#388e3c" }}>
                        {nextDog ? nextDog.dogName : "-"}
                    </div>
                </div>
                <div>
                    <strong>Up After:</strong>
                    <div style={{ fontSize: "1.5rem", color: "#fbc02d" }}>
                        {nextNextDog ? nextNextDog.dogName : "-"}
                    </div>
                </div>
            </div>
        </div>
    );
}