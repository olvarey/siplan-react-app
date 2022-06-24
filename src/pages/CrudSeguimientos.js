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
import { Checkbox } from 'primereact/checkbox';
import { SeguimientoService } from "../service/SeguimientoService";
import { AccionService } from "../service/AccionService";
import { MesService } from "../service/MesService";

const CrudSeguimientos = () => {
    let emptySeguimiento = {
        idSeguimiento: null,
        detalleSeguimiento: "",
        presupuestoEjecutado: 0.0,
        numeroAccionesMensuales: 0,
        ejecutado: false,
        fechaEjecucionSeguimiento: null,
        accion: {
            idAccion: null,
        },
        mes: {
            idMes: null,
        },
    };

    const [seguimientos, setSeguimientos] = useState(null);
    const [acciones, setAcciones] = useState(null);
    const [meses, setMeses] = useState(null);
    const [seguimientoDlg, setSeguimientoDlg] = useState(false);
    const [deleteSeguimientoDlg, setDeleteSeguimientoDlg] = useState(false);
    const [seguimiento, setSeguimiento] = useState(emptySeguimiento);
    const [selectedSeguimiento, setSelectedSeguimiento] = useState(null);
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
        const seguimientoService = new SeguimientoService();
        seguimientoService
            .getSeguimientos(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setSeguimientos(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Seguimientos cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Seguimientos no han podido ser cargados.", life: 3000 });
            });

        const accionService = new AccionService();
        accionService
            .getAcciones(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setAcciones(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipos de seguimiento cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Acciones no han podido ser cargadas.", life: 3000 });
            });

        const mesService = new MesService();
        mesService
            .getMeses(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setMeses(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Meses no han podido ser cargadas.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setSeguimiento(emptySeguimiento);
        setSubmitted(false);
        setSeguimientoDlg(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSeguimientoDlg(false);
    };

    const hideDeleteSeguimientoDlg = () => {
        setDeleteSeguimientoDlg(false);
    };

    const saveSeguimiento = () => {
        const seguimientoService = new SeguimientoService();
        setSubmitted(true);

        if (seguimiento.detalleSeguimiento.trim()) {
            //let _seguimientos = [...seguimientos];
            let _seguimiento = { ...seguimiento };
            //UPDATE
            if (seguimiento.idSeguimiento) {
                //const index = findIndexById(seguimiento.idSeguimiento);
                seguimientoService
                    .saveSeguimiento(_seguimiento, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _seguimiento = { ...res.data };
                            // _seguimientos[index] = { ..._seguimiento };
                            // setSeguimientos(_seguimientos);
                            setSeguimientoDlg(false);
                            setSeguimiento(emptySeguimiento);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Seguimiento actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Seguimiento no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                seguimientoService
                    .saveSeguimiento(_seguimiento, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _seguimiento = { ...res.data };
                            // _seguimientos.push(_seguimiento);
                            // setSeguimientos(_seguimientos);
                            setSeguimientoDlg(false);
                            setSeguimiento(emptySeguimiento);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Seguimiento creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Seguimiento no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editSeguimiento = (seguimiento) => {
        setSeguimiento({ ...seguimiento });
        setSeguimientoDlg(true);
    };

    const confirmDeleteSeguimiento = (seguimiento) => {
        setSeguimiento(seguimiento);
        setDeleteSeguimientoDlg(true);
    };

    const deleteSeguimiento = () => {
        const seguimientoService = new SeguimientoService();
        let _seguimientos = seguimientos.filter((val) => val.idSeguimiento !== seguimiento.idSeguimiento);
        seguimientoService
            .deleteSeguimiento(seguimiento, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setSeguimientos(_seguimientos);
                    setDeleteSeguimientoDlg(false);
                    setSeguimiento(emptySeguimiento);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Seguimiento borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Seguimiento no ha podido ser borrado.", life: 3000 });
            });
    };

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < seguimientos.length; i++) {
    //         if (seguimientos[i].idSeguimiento === id) {
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
        let _seguimiento = { ...seguimiento };
        _seguimiento[`${name}`] = val;

        setSeguimiento(_seguimiento);
    };

    const onAccionChange = (e) => {
        let _seguimiento = { ...seguimiento };
        setSeguimiento({ ..._seguimiento, accion: { ..._seguimiento.accion, [e.target.name]: e.target.value } });
    };

    const onMesChange = (e) => {
        let _seguimiento = { ...seguimiento };
        setSeguimiento({ ..._seguimiento, mes: { ..._seguimiento.mes, [e.target.name]: e.target.value } });
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editSeguimiento(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteSeguimiento(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de seguimientos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const accionDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveSeguimiento} />
        </>
    );

    const deleteAccionDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSeguimientoDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSeguimiento} />
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
                        value={seguimientos}
                        selection={selectedSeguimiento}
                        onSelectionChange={(e) => setSelectedSeguimiento(e.value)}
                        dataKey="idSeguimiento"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} seguimientos"
                        globalFilter={globalFilter}
                        emptyMessage="No hay seguimientos encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idSeguimiento" header="ID" sortable></Column>
                        <Column field="accion.resultado.nombreResultado" header="Resultado" sortable></Column>
                        <Column field="accion.nombreAccion" header="Acción" sortable></Column>
                        <Column field="mes.nombreMes" header="Mes" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={seguimientoDlg} style={{ width: "450px" }} header="Detalle de seguimiento" modal className="p-fluid" footer={accionDlgFooter} onHide={hideDialog}>
                        {/* {JSON.stringify(seguimiento)} */}
                        <div className="field">
                            <label htmlFor="idAccion">Acción</label>
                            <Dropdown
                                id="idAccion"
                                name="idAccion"
                                value={seguimiento.accion.idAccion}
                                onChange={onAccionChange}
                                options={acciones}
                                optionLabel="nombreAccion"
                                optionValue="idAccion"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !seguimiento.accion.idAccion })}
                            />
                            {submitted && !seguimiento.accion.idAccion && <small className="p-invalid">Acción es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idMes">Mes</label>
                            <Dropdown id="idMes" name="idMes" value={seguimiento.mes.idMes} onChange={onMesChange} options={meses} optionLabel="nombreMes" optionValue="idMes" placeholder="Selecccione una opción" required className={classNames({ "p-invalid": submitted && !seguimiento.mes.idMes })} />
                            {submitted && !seguimiento.mes.idMes && <small className="p-invalid">Mes es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="detalleSeguimiento">Detalle seguimiento</label>
                            <InputText id="detalleSeguimiento" value={seguimiento.detalleSeguimiento} onChange={(e) => onInputChange(e, "detalleSeguimiento")} required className={classNames({ "p-invalid": submitted && !seguimiento.detalleSeguimiento })} />
                            {submitted && !seguimiento.detalleSeguimiento && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcionAccion">Descripción</label>
                            <InputText id="descripcionAccion" value={seguimiento.descripcionAccion} onChange={(e) => onInputChange(e, "descripcionAccion")} className={classNames({ "p-invalid": submitted && !seguimiento.descripcionAccion })} />
                        </div>
                        <div className="field">
                            <label htmlFor="presupuestoEjecutado">Presupuesto ejecutado</label>
                            <InputNumber id="presupuestoEjecutado" value={seguimiento.presupuestoEjecutado} onValueChange={(e) => onInputChange(e, "presupuestoEjecutado")} mode="currency" currency="USD" locale="en-US" />
                        </div>
                        <div className="field">
                            <label htmlFor="numeroAccionesMensuales">Número acciones mensuales</label>
                            <InputNumber inputId="numeroAccionesMensuales" value={seguimiento.numeroAccionesMensuales} onValueChange={(e) => onInputChange(e, "numeroAccionesMensuales")} showButtons min={0} className={classNames({ "p-invalid": submitted && !seguimiento.numeroAccionesMensuales })} />
                            {submitted && !seguimiento.numeroAccionesMensuales && <small className="p-invalid">Número de seguimientos anuales es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="ejecutado">Observación</label>
                            <Checkbox id="ejecutado" onChange={(e) => onInputChange(e, "ejecutado")} className={classNames({ "p-invalid": submitted && !seguimiento.ejecutado })} checked={seguimiento.ejecutado}></Checkbox>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSeguimientoDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteAccionDlgFooter} onHide={hideDeleteSeguimientoDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {seguimiento && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{seguimiento.detalleSeguimiento}</b>?
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

export default React.memo(CrudSeguimientos, comparisonFn);
