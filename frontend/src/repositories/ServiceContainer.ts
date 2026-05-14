import DogRunOrderRepository from "./DogRunOrderRepository";

export class ServiceContainer {
    dogRunOrderRepository: DogRunOrderRepository;

    constructor(getToken: () => string | undefined = () => undefined) {
        this.dogRunOrderRepository = new DogRunOrderRepository(getToken);
    }
}
