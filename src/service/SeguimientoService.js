import axios from "axios";

const api = "http://localhost:8080/api-siplan/v1/seguimientos";

export class SeguimientoService {
    async getSeguimientos(token) {
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

    async getMeses(token) {
        let config = {
            method: "get",
            url: api + "/meses",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        return axios(config);
    }

    async saveSeguimiento(data, token) {
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

    deleteSeguimiento(data, token) {
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