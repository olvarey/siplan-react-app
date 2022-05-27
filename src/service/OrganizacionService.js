import axios from "axios";

const api = "http://localhost:8080/api-siplan/v1/organizaciones";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbHZhcmV5IiwiZXhwIjoxNjUzNjk1Mjg1LCJpYXQiOjE2NTM2NTkyODV9.apZpm6t7M73FdgGX4U-TURFOhjgvokpkMZ1vthf4PFQ";

export class OrganizacionService {
    getOrganizaciones() {
        return axios.get(api, { headers: {"Authorization" : `Bearer ${token}`} }).then((res) => res.data);
    }
}
