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
import { InputNumber } from "primereact/inputnumber";
import { AccionService } from "../service/AccionService";
import { FinanciamientoService } from "../service/FinanciamientoService";
import { LineaTrabajoService } from "../service/LineaTrabajoService";
import { ResultadoService } from "../service/ResultadoService";

const CrudAcciones = () => {
    let emptyAccion = {
        idAccion: null,
        nombreAccion: "",
        descripcionAccion: "",
        presupuestoAsignadoAccion: 0.0,
        nombreResponsableAccion: "",
        numeroAccionesAnualesAccion: 0,
        observacion: "",
        financiamiento: {
            idFinanciamiento: null,
        },
        lineaTrabajo: {
            idLineaTrabajo: null,
        },
        resultado: {
            idResultado: null,
        },
    };

    const [acciones, setAcciones] = useState(null);
    const [financiamientos, setFinanciamientos] = useState(null);
    const [lineasTrabajo, setLineasTrabajo] = useState(null);
    const [resultados, setResultados] = useState(null);
    const [accionDlg, setAccionDlg] = useState(false);
    const [deleteAccionDlg, setDeleteAccionDlg] = useState(false);
    const [accion, setAccion] = useState(emptyAccion);
    const [selectedAccion, setSelectedAccion] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const fetchToken = () => {
        const tokenString = localStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        const token = userToken?.data.access_token;
        return token;
    };

    useEffect(() => {
        const accionService = new AccionService();
        accionService
            .getAcciones(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setAcciones(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Acciones cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Acciones no han podido ser cargadas.", life: 3000 });
            });

        const financiamientoService = new FinanciamientoService();
        financiamientoService
            .getFinanciamientos(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setFinanciamientos(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipos de accion cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Financiamientos no han podido ser cargados.", life: 3000 });
            });

        const lineaTrabajoService = new LineaTrabajoService();
        lineaTrabajoService
            .getLineasTrabajo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setLineasTrabajo(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Lineas de trabajo no han podido ser cargadas.", life: 3000 });
            });

        const resultadoService = new ResultadoService();
        resultadoService
            .getResultados(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setResultados(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Resultados no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setAccion(emptyAccion);
        setSubmitted(false);
        setAccionDlg(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAccionDlg(false);
    };

    const hideDeleteAccionDialog = () => {
        setDeleteAccionDlg(false);
    };

    const saveAccion = () => {
        const accionService = new AccionService();
        setSubmitted(true);

        if (accion.nombreAccion.trim()) {
            //let _acciones = [...acciones];
            let _accion = { ...accion };
            //UPDATE
            if (accion.idAccion) {
                //const index = findIndexById(accion.idAccion);
                accionService
                    .saveAccion(_accion, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _accion = { ...res.data };
                            // _acciones[index] = { ..._accion };
                            // setAcciones(_acciones);
                            setAccionDlg(false);
                            setAccion(emptyAccion);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Acción actualizada", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Acción no ha podido ser actualizada.", life: 3000 });
                    });
            }
            //CREATE
            else {
                accionService
                    .saveAccion(_accion, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _accion = { ...res.data };
                            // _acciones.push(_accion);
                            // setAcciones(_acciones);
                            setAccionDlg(false);
                            setAccion(emptyAccion);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Acción creada.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Acción no ha podido ser creada.", life: 3000 });
                    });
            }
        }
    };

    const editAccion = (accion) => {
        setAccion({ ...accion });
        setAccionDlg(true);
    };

    const confirmDeleteAccion = (accion) => {
        setAccion(accion);
        setDeleteAccionDlg(true);
    };

    const deleteAccion = () => {
        const accionService = new AccionService();
        let _acciones = acciones.filter((val) => val.idAccion !== accion.idAccion);
        accionService
            .deleteAccion(accion, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setAcciones(_acciones);
                    setDeleteAccionDlg(false);
                    setAccion(emptyAccion);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Acción borrada.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Acción no ha podido ser borrada.", life: 3000 });
            });
    };

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < acciones.length; i++) {
    //         if (acciones[i].idAccion === id) {
    //             index = i;
    //             break;
    //         }
    //     }
    //     return index;
    // };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _accion = { ...accion };
        _accion[`${name}`] = val;

        setAccion(_accion);
    };

    const onFinanciamientoChange = (e) => {
        let _accion = { ...accion };
        setAccion({ ..._accion, financiamiento: { ..._accion.financiamiento, [e.target.name]: e.target.value } });
    };

    const onLineaTrabajoChange = (e) => {
        let _accion = { ...accion };
        setAccion({ ..._accion, lineaTrabajo: { ..._accion.lineaTrabajo, [e.target.name]: e.target.value } });
    };

    const onResultadoChange = (e) => {
        let _accion = { ...accion };
        setAccion({ ..._accion, resultado: { ..._accion.resultado, [e.target.name]: e.target.value } });
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editAccion(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteAccion(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de acciones</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const accionDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveAccion} />
        </>
    );

    const deleteAccionDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAccionDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteAccion} />
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
                        value={acciones}
                        selection={selectedAccion}
                        onSelectionChange={(e) => setSelectedAccion(e.value)}
                        dataKey="idAccion"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} acciones"
                        globalFilter={globalFilter}
                        emptyMessage="No hay acciones encontradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idAccion" header="ID" sortable></Column>
                        <Column field="nombreAccion" header="Acción" sortable></Column>
                        <Column field="resultado.nombreResultado" header="Resultado" sortable></Column>
                        <Column field="financiamiento.nombreFinanciamiento" header="Financiamiento" sortable></Column>
                        <Column field="lineaTrabajo.nombreLineaTrabajo" header="Linea de trabajo" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={accionDlg} style={{ width: "450px" }} header="Detalle de accion" modal className="p-fluid" footer={accionDlgFooter} onHide={hideDialog}>
                        {/* {JSON.stringify(accion)} */}
                        <div className="field">
                            <label htmlFor="idResultado">Resultado</label>
                            <Dropdown
                                id="idResultado"
                                name="idResultado"
                                value={accion.resultado.idResultado}
                                onChange={onResultadoChange}
                                options={resultados}
                                optionLabel="nombreResultado"
                                optionValue="idResultado"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !accion.resultado.idResultado })}
                            />
                            {submitted && !accion.resultado.idResultado && <small className="p-invalid">Resultado es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idFinanciamiento">Financiamiento</label>
                            <Dropdown
                                id="idFinanciamiento"
                                name="idFinanciamiento"
                                value={accion.financiamiento.idFinanciamiento}
                                onChange={onFinanciamientoChange}
                                options={financiamientos}
                                optionLabel="nombreFinanciamiento"
                                optionValue="idFinanciamiento"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !accion.financiamiento.idFinanciamiento })}
                            />
                            {submitted && !accion.financiamiento.idFinanciamiento && <small className="p-invalid">Financiamiento es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idLineaTrabajo">Linea de trabajo</label>
                            <Dropdown
                                id="idLineaTrabajo"
                                name="idLineaTrabajo"
                                value={accion.lineaTrabajo.idLineaTrabajo}
                                onChange={onLineaTrabajoChange}
                                options={lineasTrabajo}
                                optionLabel="nombreLineaTrabajo"
                                optionValue="idLineaTrabajo"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !accion.lineaTrabajo.idLineaTrabajo })}
                            />
                            {submitted && !accion.lineaTrabajo.idLineaTrabajo && <small className="p-invalid">Linea de trabajo es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombreAccion">Nombre</label>
                            <InputText id="nombreAccion" value={accion.nombreAccion} onChange={(e) => onInputChange(e, "nombreAccion")} required className={classNames({ "p-invalid": submitted && !accion.nombreAccion })} />
                            {submitted && !accion.nombreAccion && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcionAccion">Descripción</label>
                            <InputText id="descripcionAccion" value={accion.descripcionAccion} onChange={(e) => onInputChange(e, "descripcionAccion")} className={classNames({ "p-invalid": submitted && !accion.descripcionAccion })} />
                        </div>
                        <div className="field">
                            <label htmlFor="presupuestoAsignadoAccion">Presupuesto asignado</label>
                            <InputNumber id="presupuestoAsignadoAccion" value={accion.presupuestoAsignadoAccion} onValueChange={(e) => onInputChange(e, "presupuestoAsignadoAccion")} mode="currency" currency="USD" locale="en-US" />
                        </div>
                        <div className="field">
                            <label htmlFor="nombreResponsableAccion">Nombre responsable</label>
                            <InputText id="nombreResponsableAccion" value={accion.nombreResponsableAccion} onChange={(e) => onInputChange(e, "nombreResponsableAccion")} className={classNames({ "p-invalid": submitted && !accion.nombreResponsableAccion })} />
                        </div>
                        <div className="field">
                            <label htmlFor="numeroAccionesAnualesAccion">Número acciones anuales</label>
                            <InputNumber
                                inputId="numeroAccionesAnualesAccion"
                                value={accion.numeroAccionesAnualesAccion}
                                onValueChange={(e) => onInputChange(e, "numeroAccionesAnualesAccion")}
                                showButtons
                                min={0}
                                className={classNames({ "p-invalid": submitted && !accion.numeroAccionesAnualesAccion })}
                            />
                            {submitted && !accion.numeroAccionesAnualesAccion && <small className="p-invalid">Número de acciones anuales es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="observacion">Observación</label>
                            <InputText id="observacion" value={accion.observacion} onChange={(e) => onInputChange(e, "observacion")} className={classNames({ "p-invalid": submitted && !accion.observacion })} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAccionDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteAccionDlgFooter} onHide={hideDeleteAccionDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {accion && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{accion.nombreAccion}</b>?
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

export default React.memo(CrudAcciones, comparisonFn);
