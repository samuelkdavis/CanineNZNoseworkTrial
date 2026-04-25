import axios from "axios";
import type { Dog } from "./Dog";

export default class DogRunOrderRepository {
    async Get(): Promise<Dog[]> {
        var response = await axios.get("https://localhost:7276/runningorder");

        return response.data;
    }


    async Upload(file: File): Promise<Dog[]> {
        const formData = new FormData();
        formData.append("file", file);

        var headers = {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        };
        const response = await axios.post("https://localhost:7276/runningorder/upload", formData, headers);
        return response.data;
    }

    async SendText(orderId: string) {
        await axios.post(`https://localhost:7276/runningorder/sendtext`, { orderId });
    }

    async SendEmail(orderId: string) {
        await axios.post(`https://localhost:7276/runningorder/sendemail`, { orderId });
    }

    async MarkFinished(orderId: string) {
        await axios.post(`https://localhost:7276/runningorder/markfinished`, { orderId });
    }

    async ClearAll() {
        await axios.delete("https://localhost:7276/runningorder/delete?areYouSure=yes");
    }
}