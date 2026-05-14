import axios from "axios";
import type { Dog } from "./Dog";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class DogRunOrderRepository {
    async Get(): Promise<Dog[]> {
        const response = await axios.get(`${BASE_URL}/runningorder`);
        return response.data;
    }

    async Upload(file: File): Promise<Dog[]> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${BASE_URL}/runningorder/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    }

    async SendText(orderId: number): Promise<{ orderId: number; sentTo: string }> {
        const response = await axios.post(`${BASE_URL}/runningorder/sendtext`, { orderId });
        return response.data;
    }

    async SendEmail(orderId: number) {
        await axios.post(`${BASE_URL}/runningorder/sendemail`, { orderId });
    }

    async MarkFinished(orderId: number) {
        await axios.post(`${BASE_URL}/runningorder/markfinished`, { orderId });
    }

    async ClearAll() {
        await axios.delete(`${BASE_URL}/runningorder/delete?areYouSure=yes`);
    }
}
