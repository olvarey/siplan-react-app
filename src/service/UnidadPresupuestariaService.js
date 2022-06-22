import axios from "axios";

const api = "http://localhost:8080/api-siplan/v1/unidades-presupuestarias";

export class UnidadPresupuestariaService {
    async getUnidadesPresupuestarias(token) {
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

    async saveUnidadPresupuestaria(data, token) {
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

    deleteUnidadPresupuestaria(data, token) {
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
