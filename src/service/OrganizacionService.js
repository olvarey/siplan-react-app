import axios from "axios";

const api = "http://localhost:8080/api-siplan/v1/organizaciones";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbHZhcmV5IiwiZXhwIjoxNjU0MjI4MjMxLCJpYXQiOjE2NTQxOTIyMzF9.IMgiFKtb6CCMJV9eoxarrEXezYxr-4ntA1gnfHJf93A";

export class OrganizacionService {
    async getOrganizaciones() {
        const res = await axios.get(api, { headers: { Authorization: `Bearer ${token}` } });
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
