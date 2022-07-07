import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { SeguimientoRiesgoService } from "../service/SeguimientoRiesgoService";
import { EstrategiaRiesgoService } from "../service/EstrategiaRiesgoService";

const CrudSeguimientosRiesgo = () => {
    let emptySeguimiento = {
        idSeguimientoRiesgo: null,
        detalleSeguimientoRiesgo: "",
        presupuestoEjecutado: 0.0,
        numeroAccionesMensuales: 0,
        ejecutado: false,
        fechaEjecucionSeguimiento: null,
        mes: "",
        estrategiaRiesgo: {
            idEstrategiaRiesgo: null,
        },
    };

    const [checked, setChecked] = useState(false);
    const [seguimientosRiesgo, setSeguimientosRiesgo] = useState(null);
    const [seguimientoRiesgoDlg, setSeguimientoRiesgoDlg] = useState(false);
    const [deleteSeguimientoRiesgoDlg, setDeleteSeguimientoRiesgoDlg] = useState(false);
    const [seguimientoRiesgo, setSeguimientoRiesgo] = useState(emptySeguimiento);
    const [selectedSeguimiento, setSelectedSeguimiento] = useState(null);
    //Catalogs
    const [estrategiasRiesgo, setEstrategiasRiesgo] = useState(null);
    const [meses, setMeses] = useState(null);

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
        const seguimientoRiesgoService = new SeguimientoRiesgoService();
        seguimientoRiesgoService
            .getSeguimientosRiesgo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setSeguimientosRiesgo(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Seguimientos cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Seguimientos no han podido ser cargados.", life: 3000 });
            });

        const estrategiaRiesgoService = new EstrategiaRiesgoService();
        estrategiaRiesgoService
            .getEstrategiasRiesgo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setEstrategiasRiesgo(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipos de seguimientoRiesgo cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Estratégias riesgo no han podido ser cargadas.", life: 3000 });
            });

        seguimientoRiesgoService
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
        setSeguimientoRiesgo(emptySeguimiento);
        setSubmitted(false);
        setSeguimientoRiesgoDlg(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSeguimientoRiesgoDlg(false);
    };

    const hideDeleteSeguimientoDlg = () => {
        setDeleteSeguimientoRiesgoDlg(false);
    };

    const saveSeguimiento = () => {
        const seguimientoRiesgoService = new SeguimientoRiesgoService();
        setSubmitted(true);

        if (seguimientoRiesgo.detalleSeguimientoRiesgo.trim()) {
            //let _seguimientos = [...seguimientosRiesgo];
            let _seguimiento = { ...seguimientoRiesgo };
            //UPDATE
            if (seguimientoRiesgo.idSeguimientoRiesgo) {
                //const index = findIndexById(seguimientoRiesgo.idSeguimientoRiesgo);
                seguimientoRiesgoService
                    .saveSeguimiento(_seguimiento, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _seguimiento = { ...res.data };
                            // _seguimientos[index] = { ..._seguimiento };
                            // setSeguimientosRiesgo(_seguimientos);
                            setSeguimientoRiesgoDlg(false);
                            setSeguimientoRiesgo(emptySeguimiento);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Seguimiento actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Seguimiento no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                seguimientoRiesgoService
                    .saveSeguimiento(_seguimiento, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _seguimiento = { ...res.data };
                            // _seguimientos.push(_seguimiento);
                            // setSeguimientosRiesgo(_seguimientos);
                            setSeguimientoRiesgoDlg(false);
                            setSeguimientoRiesgo(emptySeguimiento);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Seguimiento creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Seguimiento no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editSeguimiento = (seguimientoRiesgo) => {
        setSeguimientoRiesgo({ ...seguimientoRiesgo });
        setSeguimientoRiesgoDlg(true);
    };

    const confirmDeleteSeguimiento = (seguimientoRiesgo) => {
        setSeguimientoRiesgo(seguimientoRiesgo);
        setDeleteSeguimientoRiesgoDlg(true);
    };

    const deleteSeguimiento = () => {
        const seguimientoRiesgoService = new SeguimientoRiesgoService();
        let _seguimientos = seguimientosRiesgo.filter((val) => val.idSeguimientoRiesgo !== seguimientoRiesgo.idSeguimientoRiesgo);
        seguimientoRiesgoService
            .deleteSeguimiento(seguimientoRiesgo, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setSeguimientosRiesgo(_seguimientos);
                    setDeleteSeguimientoRiesgoDlg(false);
                    setSeguimientoRiesgo(emptySeguimiento);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Seguimiento borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Seguimiento no ha podido ser borrado.", life: 3000 });
            });
    };

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < seguimientosRiesgo.length; i++) {
    //         if (seguimientosRiesgo[i].idSeguimientoRiesgo === id) {
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
        let _seguimiento = { ...seguimientoRiesgo };
        _seguimiento[`${name}`] = val;
        setSeguimientoRiesgo(_seguimiento);
    };

    const onCheckboxChange = (e) => {
        setChecked(e.checked);
        let _seguimiento = { ...seguimientoRiesgo };
        _seguimiento["ejecutado"] = e.checked;
        setSeguimientoRiesgo(_seguimiento);
    };

    const onEstrategiaRiesgoChange = (e) => {
        let _seguimiento = { ...seguimientoRiesgo };
        setSeguimientoRiesgo({ ..._seguimiento, estrategiaRiesgo: { ..._seguimiento.estrategiaRiesgo, [e.target.name]: e.target.value } });
    };

    // const onMesChange = (e) => {
    //     console.log(e.target.value);
    //     let _seguimiento = { ...seguimientoRiesgo };
    //     setSeguimientoRiesgo({ ..._seguimiento, mes: { ..._seguimiento.mes, [e.target.name]: e.target.value } });
    // };

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
            <h5 className="m-0">Administración de seguimientosRiesgo</h5>
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
                        value={seguimientosRiesgo}
                        selection={selectedSeguimiento}
                        onSelectionChange={(e) => setSelectedSeguimiento(e.value)}
                        dataKey="idSeguimientoRiesgo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} seguimientos riesgo"
                        globalFilter={globalFilter}
                        emptyMessage="No hay seguimientos riesgo encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idSeguimientoRiesgo" header="ID" sortable></Column>
                        <Column field="estrategiaRiesgo.riesgo.descripcionRiesgo" header="Riesgo" sortable></Column>
                        <Column field="estrategiaRiesgo.nombreEstrategiaRiesgo" header="Estratégia" sortable></Column>
                        <Column field="mes.nombreMes" header="Mes" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={seguimientoRiesgoDlg} style={{ width: "450px" }} header="Detalle de seguimiento riesgo" modal className="p-fluid" footer={accionDlgFooter} onHide={hideDialog}>
                        {/* {JSON.stringify(seguimientoRiesgo)} */}
                        <div className="field">
                            <label htmlFor="idEstrategiaRiesgo">Estratégia de riesgo</label>
                            <Dropdown
                                id="idEstrategiaRiesgo"
                                name="idEstrategiaRiesgo"
                                value={seguimientoRiesgo.estrategiaRiesgo.idEstrategiaRiesgo}
                                onChange={onEstrategiaRiesgoChange}
                                options={estrategiasRiesgo}
                                optionLabel="nombreEstrategiaRiesgo"
                                optionValue="idEstrategiaRiesgo"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !seguimientoRiesgo.estrategiaRiesgo.idEstrategiaRiesgo })}
                            />
                            {submitted && !seguimientoRiesgo.estrategiaRiesgo.idEstrategiaRiesgo && <small className="p-invalid">Estratégia de riesgo es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idMes">Mes</label>
                            <Dropdown
                                id="idMes"
                                name="idMes"
                                value={seguimientoRiesgo.idMes}
                                onChange={(e) => onInputChange(e, "mes")}
                                options={meses}
                                optionLabel="nombreMes"
                                optionValue="nombreMes"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !seguimientoRiesgo.mes })}
                            />
                            {submitted && !seguimientoRiesgo.mes && <small className="p-invalid">Mes es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="detalleSeguimientoRiesgo">Detalle seguimiento riesgo</label>
                            <InputTextarea
                                id="detalleSeguimientoRiesgo"
                                rows={5}
                                cols={30}
                                value={seguimientoRiesgo.detalleSeguimientoRiesgo}
                                onChange={(e) => onInputChange(e, "detalleSeguimientoRiesgo")}
                                required
                                className={classNames({ "p-invalid": submitted && !seguimientoRiesgo.detalleSeguimientoRiesgo })}
                            />
                            {submitted && !seguimientoRiesgo.detalleSeguimientoRiesgo && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="presupuestoEjecutado">Presupuesto ejecutado</label>
                            <InputNumber id="presupuestoEjecutado" value={seguimientoRiesgo.presupuestoEjecutado} onValueChange={(e) => onInputChange(e, "presupuestoEjecutado")} mode="currency" currency="USD" locale="en-US" />
                        </div>
                        <div className="field">
                            <label htmlFor="numeroAccionesMensuales">Número estratégias riesgo mensuales</label>
                            <InputNumber
                                inputId="numeroAccionesMensuales"
                                value={seguimientoRiesgo.numeroAccionesMensuales}
                                onValueChange={(e) => onInputChange(e, "numeroAccionesMensuales")}
                                showButtons
                                min={0}
                                className={classNames({ "p-invalid": submitted && !seguimientoRiesgo.numeroAccionesMensuales })}
                            />
                            {submitted && !seguimientoRiesgo.numeroAccionesMensuales && <small className="p-invalid">Número de seguimientos riesgo anuales es requerido.</small>}
                        </div>
                        <div className="field-checkbox">
                            <Checkbox id="ejecutado" checked={checked} onChange={(e) => onCheckboxChange(e)}></Checkbox>
                            <label htmlFor="ejecutado">Ejecutado</label>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSeguimientoRiesgoDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteAccionDlgFooter} onHide={hideDeleteSeguimientoDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {seguimientoRiesgo && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{seguimientoRiesgo.detalleSeguimientoRiesgo}</b>?
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

export default React.memo(CrudSeguimientosRiesgo, comparisonFn);
