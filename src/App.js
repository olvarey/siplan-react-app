import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Route, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { AppTopbar } from "./AppTopbar";
import { AppFooter } from "./AppFooter";
import Dashboard from "./components/Dashboard";

import PrimeReact from "primereact/api";
import { Tooltip } from "primereact/tooltip";
import { PanelMenu } from "primereact/panelmenu";

import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";
import "./App.scss";

import Login from "./components/Login";
import useToken from "./components/hooks/useToken";
import CrudOrganizaciones from "./pages/CrudOrganizaciones";
import CrudTiposObjetivo from "./pages/CrudTiposObjetivo";
import CrudTiposIndicador from "./pages/CrudTiposIndicador";
import CrudUnidadesMedida from "./pages/CrudUnidadesMedida";
import CrudUnidadesOrganizativas from "./pages/CrudUnidadesOrganizativas";
import CrudIndicadores from "./pages/CrudIndicadores";
import CrudAnios from "./pages/CrudAnios";
import CrudUnidadesPresupuestarias from "./pages/CrudUnidadesPresupuestarias";
import CrudFinanciamientos from "./pages/CrudFinanciamientos";
import CrudLineasTrabajo from "./pages/CrudLineasTrabajo";
import CrudUsuarios from "./pages/CrudUsuarios";
import CrudObjetivos from "./pages/CrudObjetivos";
import CrudEjes from "./pages/CrudEjes";
import CrudResultados from "./pages/CrudResultados";
import CrudAcciones from "./pages/CrudAcciones";
import CrudSeguimientos from "./pages/CrudSeguimientos";
import CrudCodigoRiesgo from "./pages/CrudCodigoRiesgo";
import CrudCategoriaRiesgo from "./pages/CrudCategoriaRiesgo";
import CrudEstrategiaRiesgo from "./pages/CrudEstrategiaRiesgo";
import CrudSeguimientosRiesgo from "./pages/CrudSeguimientosRiesgo";

const App = () => {
    const [layoutMode, setLayoutMode] = useState("static");
    const [layoutColorMode, setLayoutColorMode] = useState("light");
    const [inputStyle, setInputStyle] = useState("outlined");
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        //Set font size
        document.documentElement.style.fontSize = "14px";
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode);
    };

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode);
    };

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    };

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === "overlay") {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === "static") {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    };

    const onSidebarClick = () => {
        menuClick = true;
    };

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    };

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    };
    const isDesktop = () => {
        return window.innerWidth >= 992;
    };

    const onClickLogoutUser = (event) => {
        localStorage.clear();
        window.location.reload(false);
    };

    const items = [
        {
            label: "Inicio",
            icon: "pi pi-fw pi-globe",
            items: [
                {
                    label: "Inicio",
                    icon: "pi pi-fw pi-home",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
            ],
        },
        {
            label: "Administración",
            icon: "pi pi-fw pi-cog",
            items: [
                {
                    label: "Organizaciones",
                    icon: "pi pi-fw pi-building",
                    command: () => {
                        window.location.hash = "/organizaciones";
                    },
                },
                {
                    label: "Unidades organizativas",
                    icon: "pi pi-fw pi-clone",
                    command: () => {
                        window.location.hash = "/unidades-organizativas";
                    },
                },
                {
                    label: "Usuarios",
                    icon: "pi pi-fw pi-user",
                    command: () => {
                        window.location.hash = "/usuarios";
                    },
                },
            ],
        },
        {
            label: "Planificación",
            icon: "pi pi-fw pi-star",
            items: [
                {
                    label: "Objetivos",
                    icon: "pi pi-fw pi-compass",
                    command: () => {
                        window.location.hash = "/objetivos";
                    },
                },
                {
                    label: "Ejes",
                    icon: "pi pi-fw pi-arrows-h",
                    command: () => {
                        window.location.hash = "/ejes";
                    },
                },
                {
                    label: "Resultados",
                    icon: "pi pi-fw pi-arrow-circle-down",
                    command: () => {
                        window.location.hash = "/resultados";
                    },
                },
                {
                    label: "Acciones",
                    icon: "pi pi-fw pi-book",
                    command: () => {
                        window.location.hash = "/acciones";
                    },
                },
                {
                    label: "Seguimientos",
                    icon: "pi pi-fw pi-check-circle",
                    command: () => {
                        window.location.hash = "/seguimientos";
                    },
                },
            ],
        },
        {
            label: "Matríz riesgos",
            icon: "pi pi-fw pi-eye",
            items: [
                {
                    label: "Riesgos",
                    icon: "pi pi-fw pi-volume-up",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Estratégia sobre riesgo",
                    icon: "pi pi-fw pi-thumbs-up",
                    command: () => {
                        window.location.hash = "/estrategias-riesgo";
                    },
                },
                {
                    label: "Seguimientos riesgo",
                    icon: "pi pi-fw pi-sign-in",
                    command: () => {
                        window.location.hash = "/seguimientos-riesgo";
                    },
                },
                {
                    label: "Código riesgo",
                    icon: "pi pi-fw pi-qrcode",
                    command: () => {
                        window.location.hash = "/codigos-riesgo";
                    },
                },
                {
                    label: "Categoría riesgo",
                    icon: "pi pi-fw pi-flag",
                    command: () => {
                        window.location.hash = "/categorias-riesgo";
                    },
                },
            ],
        },
        {
            label: "Catálogos",
            icon: "pi pi-fw pi-tags",
            items: [
                {
                    label: "Años",
                    icon: "pi pi-fw pi-calendar",
                    command: () => {
                        window.location.hash = "/anios";
                    },
                },
                {
                    label: "Financiamientos",
                    icon: "pi pi-fw pi-dollar",
                    command: () => {
                        window.location.hash = "/financiamientos";
                    },
                },
                {
                    label: "Indicadores",
                    icon: "pi pi-fw pi-chart-bar",
                    command: () => {
                        window.location.hash = "/indicadores";
                    },
                },
                {
                    label: "Lineas de trabajo",
                    icon: "pi pi-fw pi-arrows-v",
                    command: () => {
                        window.location.hash = "/lineas-trabajo";
                    },
                },
                {
                    label: "Tipos de indicador",
                    icon: "pi pi-fw pi-chart-line",
                    command: () => {
                        window.location.hash = "/tipos-indicador";
                    },
                },
                {
                    label: "Tipos de objetivo",
                    icon: "pi pi-fw pi-list",
                    command: () => {
                        window.location.hash = "/tipos-objetivo";
                    },
                },
                {
                    label: "Unidades de medida",
                    icon: "pi pi-fw pi-filter-slash",
                    command: () => {
                        window.location.hash = "/unidades-medida";
                    },
                },
                {
                    label: "Unidades presupuestarias",
                    icon: "pi pi-fw pi-money-bill",
                    command: () => {
                        window.location.hash = "/unidades-presupuestarias";
                    },
                },
            ],
        },
    ];

    const addClass = (element, className) => {
        if (element.classList) element.classList.add(className);
        else element.className += " " + className;
    };

    const removeClass = (element, className) => {
        if (element.classList) element.classList.remove(className);
        else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };

    const wrapperClass = classNames("layout-wrapper", {
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-static-sidebar-inactive": staticMenuInactive && layoutMode === "static",
        "layout-overlay-sidebar-active": overlayMenuActive && layoutMode === "overlay",
        "layout-mobile-sidebar-active": mobileMenuActive,
        "p-input-filled": inputStyle === "filled",
        "p-ripple-disabled": ripple === false,
        "layout-theme-light": layoutColorMode === "light",
    });

    const { token, setToken } = useToken();
    if (!token) {
        return <Login setToken={setToken} />;
    }

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar onToggleMenuClick={onToggleMenuClick} mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} onClickLogoutUser={onClickLogoutUser} />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <div className="layout-menu-container">
                    <PanelMenu model={items} style={{ width: "auto" }} />
                </div>
            </div>

            <div className="layout-main-container">
                {/* {token.roles.map((rol, index) => (
                    <p key={index}>{rol}</p>
                ))} */}
                <div className="layout-main">
                    <Route path="/" exact render={() => <Dashboard colorMode={layoutColorMode} location={location} />} />
                    <Route path="/organizaciones" component={CrudOrganizaciones} />
                    <Route path="/tipos-objetivo" component={CrudTiposObjetivo} />
                    <Route path="/tipos-indicador" component={CrudTiposIndicador} />
                    <Route path="/unidades-medida" component={CrudUnidadesMedida} />
                    <Route path="/unidades-organizativas" component={CrudUnidadesOrganizativas} />
                    <Route path="/indicadores" component={CrudIndicadores} />
                    <Route path="/anios" component={CrudAnios} />
                    <Route path="/unidades-presupuestarias" component={CrudUnidadesPresupuestarias} />
                    <Route path="/financiamientos" component={CrudFinanciamientos} />
                    <Route path="/lineas-trabajo" component={CrudLineasTrabajo} />
                    <Route path="/usuarios" component={CrudUsuarios} />
                    <Route path="/objetivos" component={CrudObjetivos} />
                    <Route path="/ejes" component={CrudEjes} />
                    <Route path="/resultados" component={CrudResultados} />
                    <Route path="/acciones" component={CrudAcciones} />
                    <Route path="/seguimientos" component={CrudSeguimientos} />
                    <Route path="/codigos-riesgo" component={CrudCodigoRiesgo} />
                    <Route path="/categorias-riesgo" component={CrudCategoriaRiesgo} />
                    <Route path="/estrategias-riesgo" component={CrudEstrategiaRiesgo} />
                    <Route path="/seguimientos-riesgo" component={CrudSeguimientosRiesgo} />
                </div>

                <AppFooter />
            </div>

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>
        </div>
    );
};

export default App;
