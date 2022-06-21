import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { PeriodoService } from "../service/PeriodoService";

const CrudPeriodos = () => {
    let emptyPeriodo = {
        idPeriodo: null,
        anioInicio: null,
        anioFin: null,
        nombrePeriodo: "",
    };

    const [periodos, setPeriodos] = useState(null);
    const [periodoDialog, setPeriodoDialog] = useState(false);
    const [deletPeriodoDialog, setDeletPeriodoDialog] = useState(false);
    const [periodo, setPeriodo] = useState(emptyPeriodo);
    const [selectedPeriodo, setSelectedPeriodo] = useState(null);
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
        const periodoService = new PeriodoService();
        periodoService
            .getPeriodos(fetchToken())
            .then((res) => {
                console.log(res.data);
                if (res.status === 200) {
                    setPeriodos(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Periodos cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Periodos no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setPeriodo(emptyPeriodo);
        setSubmitted(false);
        setPeriodoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPeriodoDialog(false);
    };

    const hideDeletePeriodoDialog = () => {
        setDeletPeriodoDialog(false);
    };

    const savePeriodo = () => {
        const periodoService = new PeriodoService();
        setSubmitted(true);

        if (periodo.nombrePeriodo.trim()) {
            //let _periodos = [...periodos];
            let _periodo = { ...periodo };
            //UPDATE
            if (periodo.idPeriodo) {
                //const index = findIndexById(periodo.idPeriodo);
                periodoService
                    .savePeriodo(_periodo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _periodo = { ...res.data };
                            // _periodos[index] = { ..._periodo };
                            // setPeriodos(_periodos);
                            setPeriodoDialog(false);
                            setPeriodo(emptyPeriodo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Periodo actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Periodo no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                periodoService
                    .savePeriodo(_periodo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _periodo = { ...res.data };
                            // _periodos.push(_periodo);
                            // setPeriodos(_periodos);
                            setPeriodoDialog(false);
                            setPeriodo(emptyPeriodo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Periodo creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Periodo no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editPeriodo = (periodo) => {
        setPeriodo({ ...periodo });
        setPeriodoDialog(true);
    };

    const confirmDeletePeriodo = (periodo) => {
        setPeriodo(periodo);
        setDeletPeriodoDialog(true);
    };

    const deleteIndicador = () => {
        const periodoService = new PeriodoService();
        let _periodos = periodos.filter((val) => val.idPeriodo !== periodo.idPeriodo);
        periodoService
            .deleteIndicador(periodo, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setPeriodos(_periodos);
                    setDeletPeriodoDialog(false);
                    setPeriodo(emptyPeriodo);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Periodo borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Periodo no ha podido ser borrado.", life: 3000 });
            });
    };

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < periodos.length; i++) {
    //         if (periodos[i].idPeriodo === id) {
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
        let _periodo = { ...periodo };
        _periodo[`${name}`] = val;

        setPeriodo(_periodo);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPeriodo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeletePeriodo(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de periodos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const periodoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={savePeriodo} />
        </>
    );

    const deletePeriodoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePeriodoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteIndicador} />
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
                        value={periodos}
                        selection={selectedPeriodo}
                        onSelectionChange={(e) => setSelectedPeriodo(e.value)}
                        dataKey="idPeriodo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} periodos"
                        globalFilter={globalFilter}
                        emptyMessage="No hay periodos encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idPeriodo" header="ID" sortable></Column>
                        <Column field="nombrePeriodo" header="Nombre periodo" sortable></Column>
                        <Column field="anioInicio" header="Año inicio" sortable dataType="date"></Column>
                        <Column field="anioFin" header="Año fin" sortable dataType="date"></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={periodoDialog} style={{ width: "450px" }} header="Detalle de periodo" modal className="p-fluid" footer={periodoDialogFooter} onHide={hideDialog}>
                        {JSON.stringify(periodo)}
                        <div className="field">
                            <label htmlFor="nombrePeriodo">Nombre</label>
                            <InputText id="nombrePeriodo" value={periodo.nombrePeriodo} onChange={(e) => onInputChange(e, "nombrePeriodo")} required autoFocus className={classNames({ "p-invalid": submitted && !periodo.nombrePeriodo })} />
                            {submitted && !periodo.nombrePeriodo && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="anioInicio">Año inicio</label>
                            <Calendar id="anioInicio" value={periodo.anioInicio} onChange={(e) => onInputChange(e, "anioInicio")} required dateFormat="yy-mm-dd" autoFocus className={classNames({ "p-invalid": submitted && !periodo.anioInicio })} />
                            {submitted && !periodo.anioInicio && <small className="p-invalid">Año inicio es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="anioFin">Año inicio</label>
                            <Calendar id="anioFin" value={periodo.anioFin} onChange={(e) => onInputChange(e, "anioFin")} required dateFormat="dd/mm/yy" autoFocus className={classNames({ "p-invalid": submitted && !periodo.anioFin })} />
                            {submitted && !periodo.anioFin && <small className="p-invalid">Año fin es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletPeriodoDialog} style={{ width: "450px" }} header="Confirm" modal footer={deletePeriodoDialogFooter} onHide={hideDeletePeriodoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {periodo && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{periodo.nombrePeriodo}</b>?
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

export default React.memo(CrudPeriodos, comparisonFn);
