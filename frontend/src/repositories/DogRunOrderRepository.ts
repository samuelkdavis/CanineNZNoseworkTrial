import axios from "axios";
import type { Dog } from "./Dog";

export default class DogRunOrderRepository {
    async Get(): Promise<Dog[]> {
        var response = await axios.get("https://localhost:7276/runningorder");

        return response.data;
    }


    async Upload(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        var headers = {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        };
        await axios.post("https://localhost:7276/runningorder/upload", formData, headers);
    }
}