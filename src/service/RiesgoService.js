import axios from "axios";

const api = "http://localhost:8080/api-siplan/v1/riesgos";

export class RiesgoService {
    async getRiesgos(token) {
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

    async saveRiesgo(data, token) {
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

    deleteRiesgo(data, token) {
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
