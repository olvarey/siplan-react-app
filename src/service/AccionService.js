import axios from "axios";

const api = "http://localhost:8080/api-siplan/v1/acciones";

export class AccionService {
    async getAcciones(token) {
        let config = {
            method: "get",
            url: api,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        return axios(config);
    }

    async saveAccion(data, token) {
        let config = {
            method: "post",
            url: api,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: data,
        };

        return axios(config);
    }

    deleteAccion(data, token) {
        let config = {
            method: "delete",
            url: api,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: data,
        };

        return axios(config);
    }
}
