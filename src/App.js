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
import CrudOrganizaciones from "./pages/CrudOrganizaciones";
import Login from "./components/Login";
import useToken from "./components/hooks/useToken";
import CrudTiposObjetivo from "./pages/CrudTiposObjetivo";

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
                    label: "Usuarios",
                    icon: "pi pi-fw pi-user",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
            ],
        },
        {
            label: "Plan estratégico",
            icon: "pi pi-fw pi-star",
            items: [
                {
                    label: "Objetivos",
                    icon: "pi pi-fw pi-compass",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Ejes",
                    icon: "pi pi-fw pi-arrows-h",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Resultados",
                    icon: "pi pi-fw pi-arrow-circle-down",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Acciones",
                    icon: "pi pi-fw pi-book",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Seguimientos",
                    icon: "pi pi-fw pi-check-circle",
                    command: () => {
                        window.location.hash = "/";
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
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Meses",
                    icon: "pi pi-fw pi-calendar-plus",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Financiamientos",
                    icon: "pi pi-fw pi-dollar",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Indicadores",
                    icon: "pi pi-fw pi-chart-bar",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Lineas de trabajo",
                    icon: "pi pi-fw pi-arrows-v",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Organizaciones",
                    icon: "pi pi-fw pi-building",
                    command: () => {
                        window.location.hash = "/organizaciones";
                    },
                },
                {
                    label: "Periodos",
                    icon: "pi pi-fw pi-clock",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Tipos de indicador",
                    icon: "pi pi-fw pi-chart-line",
                    command: () => {
                        window.location.hash = "/";
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
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Unidades organizativas",
                    icon: "pi pi-fw pi-clone",
                    command: () => {
                        window.location.hash = "/";
                    },
                },
                {
                    label: "Unidades presupuestarias",
                    icon: "pi pi-fw pi-money-bill",
                    command: () => {
                        window.location.hash = "/";
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
