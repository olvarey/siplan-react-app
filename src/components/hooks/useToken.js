import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        return userToken?.data;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken) => {
        localStorage.setItem("token", JSON.stringify(userToken));
        setToken(userToken.data);
    };

    return {
        token,
        setToken: saveToken,
    };
}
