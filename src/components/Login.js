import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Image } from "primereact/image";
import { Toast } from "primereact/toast";
import { LoginService } from "../service/LoginService";
import "../assets/login/login.css";
import Avatar from "../assets/login/group.png";

const Login = ({ setToken }) => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const toast = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let credentials = {
            username: username,
            password: password,
        };
        const loginService = new LoginService();
        loginService
            .loginUser(credentials)
            .then((res) => {
                setToken(res);
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Autentificación", detail: "Usuario / Contraseña no válidos.", life: 3000 });
            });
    };

    return (
        <>
            <div className="wrapper fadeInDown">
                <Toast ref={toast} />
                <div id="formContent">
                    <h2 className="active"> SIPLAN </h2>
                    <h2 className="inactive underlineHover"> REGISTRO</h2>

                    <div className="fadeIn first">
                        <Image src={Avatar} id="icon" alt="User Icon" width="100" />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input type="text" id="login" className="fadeIn second" name="username" placeholder="usuario" onChange={(e) => setUserName(e.target.value)} />
                        <input type="password" id="password" className="fadeIn third" name="password" placeholder="contraseña" onChange={(e) => setPassword(e.target.value)} />
                        <input type="submit" className="fadeIn fourth" value="Ingresar" />
                    </form>

                    <div id="formFooter">CAJAMINED</div>
                </div>
            </div>
        </>
    );
};

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};

export default Login;
