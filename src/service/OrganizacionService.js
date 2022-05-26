import axios from "axios";

const api = "http://localhost:8080/api-siplan/v1/organizaciones";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbHZhcmV5IiwiZXhwIjoxNjUzNjIyNDczLCJpYXQiOjE2NTM1ODY0NzN9.6G2QDHqOU_Y2JotUAontdBKGp8ua7Pk3ulPjCUfp7XI";

export class OrganizacionService {
    getOrganizaciones() {
        return axios.get(api, { headers: {"Authorization" : `Bearer ${token}`} }).then((res) => res.data);
    }
}
