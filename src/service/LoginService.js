import axios from "axios";

const api = "http://192.168.10.82:8080/api-siplan/v1/authenticate";

export class LoginService {
    async loginUser(credentials) {
        let config = {
            method: "post",
            url: api,
            headers: {
                "Content-Type": "application/json",
            },
            data: credentials,
        };

        return axios(config);
    }
}
