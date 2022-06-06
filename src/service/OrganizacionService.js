import axios from "axios";

const api = "http://localhost:8080/api-siplan/v1/organizaciones";
const tokenString = localStorage.getItem("token");
const userToken = JSON.parse(tokenString);
const token = userToken?.data.access_token;

export class OrganizacionService {
    async getOrganizaciones(access_token) {
        const res = await axios.get(api, { headers: { Authorization: `Bearer ${access_token}` } });
        return res.data;
    }

    async saveOrganizacion(data) {
        const res = await axios.post(api, data, { headers: { Authorization: `Bearer ${token}` } });
        return res.data;
    }

    deleteOrganizacion(data) {
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
