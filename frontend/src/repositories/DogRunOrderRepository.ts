import axios from "axios";

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

    async ClearAll() {
        await axios.delete("https://localhost:7276/runningorder/delete?areYouSure=yes");
    }
}

export type Dog = {
    orderId: number;
    dogName: string;
    handlerName: string;
    class: string;
    hasFinished: boolean;
};