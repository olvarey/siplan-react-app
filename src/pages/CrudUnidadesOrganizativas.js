import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { UnidadOrganizativaService } from "../service/UnidadOrganizativaService";
import { OrganizacionService } from "../service/OrganizacionService";

const CrudUnidadesOrganizativas = () => {
    let emptyUnidadOrganizativa = {
        idUnidadOrganizativa: null,
        nombreUnidadOrganizativa: "",
        organizacion: {
            idOrganizacion: null,
        },
        unidadSuperior: {
            idUnidadOrganizativa: null,
        },
    };

    const [unidadesOrganizativas, setUnidadesOrganizativas] = useState(null);
    const [showItemDlg, setShowItemDlg] = useState(false);
    const [deleteItemDlg, setDeleteItemDlg] = useState(false);
    const [unidadOrganizativa, setUnidadOrganizativa] = useState(emptyUnidadOrganizativa);
    const [selectedUnidadOrganizativa, setSelectedUnidadOrganizativa] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    //Catalogs
    const [organizaciones, setOrganizaciones] = useState(null);

    const toast = useRef(null);
    const dt = useRef(null);

    const fetchToken = () => {
        const tokenString = localStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        const token = userToken?.data.access_token;
        return token;
    };

    useEffect(() => {
        const unidadOrganizativaService = new UnidadOrganizativaService();
        unidadOrganizativaService
            .getUnidadesOrganizativas(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setUnidadesOrganizativas(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades organizativas cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Unidades organizativas no han podido ser cargadas.", life: 3000 });
            });

        const organizacionService = new OrganizacionService();
        organizacionService
            .getOrganizaciones(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setOrganizaciones(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Organizaciones cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Organizaciones no han podido ser cargadas.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setUnidadOrganizativa(emptyUnidadOrganizativa);
        setSubmitted(false);
        setShowItemDlg(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setShowItemDlg(false);
    };

    const hideDeleteDlg = () => {
        setDeleteItemDlg(false);
    };

    const saveUnidadOrganizativa = () => {
        const unidadOrganizativaService = new UnidadOrganizativaService();
        setSubmitted(true);

        if (unidadOrganizativa.nombreUnidadOrganizativa.trim()) {
            let _unidades_organizativas = [...unidadesOrganizativas];
            let _unidad_organizativa = { ...unidadOrganizativa };
            //UPDATE
            if (unidadOrganizativa.idUnidadOrganizativa) {
                const index = findIndexById(unidadOrganizativa.idUnidadOrganizativa);
                unidadOrganizativaService
                    .saveUnidadOrganizativa(_unidad_organizativa, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _unidad_organizativa = { ...res.data };
                            _unidades_organizativas[index] = { ..._unidad_organizativa };
                            setUnidadesOrganizativas(_unidades_organizativas);
                            setShowItemDlg(false);
                            setUnidadOrganizativa(emptyUnidadOrganizativa);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidad organizativa actualizada.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Unidad organizativa no ha podido ser actualizada.", life: 3000 });
                    });
            }
            //CREATE
            else {
                unidadOrganizativaService
                    .saveUnidadOrganizativa(_unidad_organizativa, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _unidad_organizativa = { ...res.data };
                            _unidades_organizativas.push(_unidad_organizativa);
                            setUnidadesOrganizativas(_unidades_organizativas);
                            setShowItemDlg(false);
                            setUnidadOrganizativa(emptyUnidadOrganizativa);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidad organizativa creada.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Unidad organizativa no ha podido ser creada.", life: 3000 });
                    });
            }
        }
    };

    const editUnidadOrganizativa = (unidadOrganizativa) => {
        setUnidadOrganizativa({ ...unidadOrganizativa });
        setShowItemDlg(true);
    };

    const confirmDeleteUnidadOrganizativa = (unidadOrganizativa) => {
        setUnidadOrganizativa(unidadOrganizativa);
        setDeleteItemDlg(true);
    };

    const deleteUnidadOrganizativa = () => {
        const unidadOrganizativaService = new UnidadOrganizativaService();
        let _unidades_organizativas = unidadesOrganizativas.filter((val) => val.idUnidadOrganizativa !== unidadOrganizativa.idUnidadOrganizativa);
        unidadOrganizativaService
            .deleteUnidadOrganizativa(unidadOrganizativa, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setUnidadesOrganizativas(_unidades_organizativas);
                    setDeleteItemDlg(false);
                    setUnidadOrganizativa(emptyUnidadOrganizativa);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidad organizativa borrada.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Unidad organizativa no ha podido ser borrada.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < unidadesOrganizativas.length; i++) {
            if (unidadesOrganizativas[i].idUnidadOrganizativa === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _unidad_organizativa = { ...unidadOrganizativa };
        _unidad_organizativa[`${name}`] = val;

        setUnidadOrganizativa(_unidad_organizativa);
    };

    const onOrganizacionChange = (e) => {
        let _unidad_organizativa = { ...unidadOrganizativa };
        setUnidadOrganizativa({ ..._unidad_organizativa, organizacion: { ..._unidad_organizativa.organizacion, [e.target.name]: e.target.value } });
    };

    const onUnidadSuperiorChange = (e) => {
        let _unidad_organizativa = { ...unidadOrganizativa };
        setUnidadOrganizativa({ ..._unidad_organizativa, unidadSuperior: { ..._unidad_organizativa.unidadSuperior, [e.target.name]: e.target.value } });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Crear" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUnidadOrganizativa(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteUnidadOrganizativa(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de tipos de indicador</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const unidadOrganizativaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveUnidadOrganizativa} />
        </>
    );

    const deleteUnidadOrganizativaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteUnidadOrganizativa} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={unidadesOrganizativas}
                        selection={selectedUnidadOrganizativa}
                        onSelectionChange={(e) => setSelectedUnidadOrganizativa(e.value)}
                        dataKey="idUnidadOrganizativa"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} unidades organizativas"
                        globalFilter={globalFilter}
                        emptyMessage="No hay unidades organizativas encontradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idUnidadOrganizativa" header="ID" sortable></Column>
                        <Column field="organizacion.nombreOrganizacion" header="Institución" sortable></Column>
                        <Column field="unidadSuperior.nombreUnidadOrganizativa" header="Unidad superior" sortable></Column>
                        <Column field="nombreUnidadOrganizativa" header="Nombre" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={showItemDlg} style={{ width: "450px" }} header="Detalle de unidad organizativa" modal className="p-fluid" footer={unidadOrganizativaDialogFooter} onHide={hideDialog}>
                        {JSON.stringify(unidadOrganizativa)}
                        <div className="field">
                            <label htmlFor="idOrganizacion">Organización</label>
                            <Dropdown
                                id="idOrganizacion"
                                name="idOrganizacion"
                                value={unidadOrganizativa.organizacion.idOrganizacion}
                                onChange={onOrganizacionChange}
                                options={organizaciones}
                                optionLabel="nombreOrganizacion"
                                optionValue="idOrganizacion"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !unidadOrganizativa.idOrganizacion })}
                            />
                            {submitted && !unidadOrganizativa.idOrganizacion && <small className="p-invalid">Organización es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombreUnidadOrganizativa">Nombre</label>
                            <InputText
                                id="nombreUnidadOrganizativa"
                                value={unidadOrganizativa.nombreUnidadOrganizativa}
                                onChange={(e) => onInputChange(e, "nombreUnidadOrganizativa")}
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !unidadOrganizativa.nombreUnidadOrganizativa })}
                            />
                            {submitted && !unidadOrganizativa.nombreUnidadOrganizativa && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idUnidadSuperior">Unidad organizativa superior</label>
                            <Dropdown
                                id="idUnidadOrganizativa"
                                name="idUnidadOrganizativa"
                                value={unidadOrganizativa.unidadSuperior?.idUnidadOrganizativa}
                                onChange={onUnidadSuperiorChange}
                                options={unidadesOrganizativas}
                                optionLabel="nombreUnidadOrganizativa"
                                optionValue="idUnidadOrganizativa"
                                placeholder="Selecccione una opción"
                                autoFocus
                            />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteUnidadOrganizativaDialogFooter} onHide={hideDeleteDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {unidadOrganizativa && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{unidadOrganizativa.nombreUnidadOrganizativa}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CrudUnidadesOrganizativas, comparisonFn);
