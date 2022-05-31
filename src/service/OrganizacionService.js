import axios from "axios";

const api = "http://localhost:8080/api-siplan/v1/organizaciones";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbHZhcmV5IiwiZXhwIjoxNjU0MDUxNjcxLCJpYXQiOjE2NTQwMTU2NzF9.HwCr5AuyCmSHJZw6qiMIyTBCeEhqarBw5uJQtWmx5JE";

export class OrganizacionService {
    async getOrganizaciones() {
        const res = await axios.get(api, { headers: { Authorization: `Bearer ${token}` } });
        return res.data;
    }

    async saveOrganizacion(data) {
        const res = await axios.post(api, data, { headers: { Authorization: `Bearer ${token}` } });
        return res.data;
    }

    async deleteOrganizacion(data) {
        const res = await axios.post(api, data, { headers: { Authorization: `Bearer ${token}` } });
        return res.data;
    }
}
