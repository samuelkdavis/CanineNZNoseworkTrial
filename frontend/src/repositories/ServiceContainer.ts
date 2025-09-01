import DogRunOrderRepository from "./DogRunOrderRepository";

export class ServiceContainer {
    dogRunOrderRepository = new DogRunOrderRepository();
    // Add other repositories as needed
}