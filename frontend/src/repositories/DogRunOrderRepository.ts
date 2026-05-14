import axios from "axios";
import type { Dog } from "./Dog";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class DogRunOrderRepository {
    private getToken: () => string | undefined;

    constructor(getToken: () => string | undefined = () => undefined) {
        this.getToken = getToken;
    }

    private authHeaders() {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async Get(): Promise<Dog[]> {
        const response = await axios.get(`${BASE_URL}/runningorder`);
        return response.data;
    }

    async Upload(file: File): Promise<Dog[]> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${BASE_URL}/runningorder/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data", ...this.authHeaders() }
        });
        return response.data;
    }

    async SendText(orderId: number): Promise<{ orderId: number; sentTo: string }> {
        const response = await axios.post(`${BASE_URL}/runningorder/sendtext`, { orderId }, {
            headers: this.authHeaders()
        });
        return response.data;
    }

    async SendEmail(orderId: number) {
        await axios.post(`${BASE_URL}/runningorder/sendemail`, { orderId }, {
            headers: this.authHeaders()
        });
    }

    async MarkFinished(orderId: number) {
        await axios.post(`${BASE_URL}/runningorder/markfinished`, { orderId }, {
            headers: this.authHeaders()
        });
    }

    async ClearAll() {
        await axios.delete(`${BASE_URL}/runningorder/delete?areYouSure=yes`, {
            headers: this.authHeaders()
        });
    }
}
