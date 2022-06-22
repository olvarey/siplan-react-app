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
import { LineaTrabajoService } from "../service/LineaTrabajoService";
import { UnidadPresupuestariaService } from "../service/UnidadPresupuestariaService";

const CrudLineasTrabajo = () => {
    let emptyIndicador = {
        idLineaTrabajo: null,
        nombreLineaTrabajo: "",
        unidadPresupuestaria: {
            idUnidadPresupuestaria: null,
        },
    };

    const [lineasTrabajo, setLineasTrabajo] = useState(null);
    const [unidadesPresupuestarias, setUnidadesPresupuestarias] = useState(null);
    const [lineaTrabajoDlg, setLineaTrabajoDlg] = useState(false);
    const [deleteLineaTrabajoDlg, setDeleteLineaTrabajoDlg] = useState(false);
    const [lineaTrabajo, setLineaTrabajo] = useState(emptyIndicador);
    const [selectedLineaTrabajo, setSelectedLineaTrabajo] = useState(null);
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
        const lineaTrabajoService = new LineaTrabajoService();
        lineaTrabajoService
            .getLineasTrabajo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setLineasTrabajo(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Lineas de trabajo cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Lineas de trabajo no han podido ser cargadas.", life: 3000 });
            });

        const unidadPresupuestariaService = new UnidadPresupuestariaService();
        unidadPresupuestariaService
            .getUnidadesPresupuestarias(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setUnidadesPresupuestarias(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipos de lineaTrabajo cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Unidades presupuestarias no han podido ser cargadas.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setLineaTrabajo(emptyIndicador);
        setSubmitted(false);
        setLineaTrabajoDlg(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setLineaTrabajoDlg(false);
    };

    const hideDeleteLineaTrabajoDlg = () => {
        setDeleteLineaTrabajoDlg(false);
    };

    const saveLineaTrabajo = () => {
        const lineaTrabajoService = new LineaTrabajoService();
        setSubmitted(true);

        if (lineaTrabajo.nombreLineaTrabajo.trim()) {
            //let _lineas_trabajo = [...lineasTrabajo];
            let _linea_trabajo = { ...lineaTrabajo };
            //UPDATE
            if (lineaTrabajo.idLineaTrabajo) {
                //const index = findIndexById(lineaTrabajo.idLineaTrabajo);
                lineaTrabajoService
                    .saveLineaTrabajo(_linea_trabajo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _linea_trabajo = { ...res.data };
                            // _lineas_trabajo[index] = { ..._linea_trabajo };
                            // setLineasTrabajo(_lineas_trabajo);
                            setLineaTrabajoDlg(false);
                            setLineaTrabajo(emptyIndicador);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Linea de trabajo actualizada", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Linea de trabajo no ha podido ser actualizada.", life: 3000 });
                    });
            }
            //CREATE
            else {
                lineaTrabajoService
                    .saveLineaTrabajo(_linea_trabajo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _linea_trabajo = { ...res.data };
                            // _lineas_trabajo.push(_linea_trabajo);
                            // setLineasTrabajo(_lineas_trabajo);
                            setLineaTrabajoDlg(false);
                            setLineaTrabajo(emptyIndicador);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Linea de trabajo creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Linea de trabajo no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editLineaTrabajo = (lineaTrabajo) => {
        setLineaTrabajo({ ...lineaTrabajo });
        setLineaTrabajoDlg(true);
    };

    const confirmDeleteLineaTrabajo = (lineaTrabajo) => {
        setLineaTrabajo(lineaTrabajo);
        setDeleteLineaTrabajoDlg(true);
    };

    const deleteLineaTrabajo = () => {
        const lineaTrabajoService = new LineaTrabajoService();
        let _lineas_trabajo = lineasTrabajo.filter((val) => val.idLineaTrabajo !== lineaTrabajo.idLineaTrabajo);
        lineaTrabajoService
            .deleteLineaTrabajo(lineaTrabajo, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setLineasTrabajo(_lineas_trabajo);
                    setDeleteLineaTrabajoDlg(false);
                    setLineaTrabajo(emptyIndicador);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Linea de trabajo borrada.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Linea de trabajo no ha podido ser borrada.", life: 3000 });
            });
    };

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < lineasTrabajo.length; i++) {
    //         if (lineasTrabajo[i].idLineaTrabajo === id) {
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
        let _linea_trabajo = { ...lineaTrabajo };
        _linea_trabajo[`${name}`] = val;

        setLineaTrabajo(_linea_trabajo);
    };

    const onUnidadPresupuestariaChange = (e) => {
        let _linea_trabajo = { ...lineaTrabajo };
        setLineaTrabajo({ ..._linea_trabajo, unidadPresupuestaria: { ..._linea_trabajo.unidadPresupuestaria, [e.target.name]: e.target.value } });
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editLineaTrabajo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteLineaTrabajo(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de lineas trabajo</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const lineaTrabajoDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveLineaTrabajo} />
        </>
    );

    const deleteLineaTrabajoDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteLineaTrabajoDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteLineaTrabajo} />
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
                        value={lineasTrabajo}
                        selection={selectedLineaTrabajo}
                        onSelectionChange={(e) => setSelectedLineaTrabajo(e.value)}
                        dataKey="idLineaTrabajo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} lineas trabajo"
                        globalFilter={globalFilter}
                        emptyMessage="No hay lineas trabajo encontradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idLineaTrabajo" header="ID" sortable></Column>
                        <Column field="nombreLineaTrabajo" header="Nombre" sortable></Column>
                        <Column field="unidadPresupuestaria.nombreUnidadPresupuestaria" header="Unidad presupuestaria" sortable></Column>
                        <Column field="unidadMedida.nombreUnidadMedida" header="Unidad de medida" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={lineaTrabajoDlg} style={{ width: "450px" }} header="Detalle de linea trabajo" modal className="p-fluid" footer={lineaTrabajoDlgFooter} onHide={hideDialog}>
                        {/* {JSON.stringify(lineaTrabajo)} */}
                        <div className="field">
                            <label htmlFor="nombreLineaTrabajo">Nombre</label>
                            <InputText id="nombreLineaTrabajo" value={lineaTrabajo.nombreLineaTrabajo} onChange={(e) => onInputChange(e, "nombreLineaTrabajo")} required autoFocus className={classNames({ "p-invalid": submitted && !lineaTrabajo.nombreLineaTrabajo })} />
                            {submitted && !lineaTrabajo.nombreLineaTrabajo && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idUnidadPresupuestaria">Unidad presupuestaria</label>
                            <Dropdown
                                id="idUnidadPresupuestaria"
                                name="idUnidadPresupuestaria"
                                value={lineaTrabajo.unidadPresupuestaria.idUnidadPresupuestaria}
                                onChange={onUnidadPresupuestariaChange}
                                options={unidadesPresupuestarias}
                                optionLabel="nombreUnidadPresupuestaria"
                                optionValue="idUnidadPresupuestaria"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !lineaTrabajo.unidadPresupuestaria.idUnidadPresupuestaria })}
                            />
                            {submitted && !lineaTrabajo.unidadPresupuestaria.idUnidadPresupuestaria && <small className="p-invalid">Indicador es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteLineaTrabajoDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteLineaTrabajoDlgFooter} onHide={hideDeleteLineaTrabajoDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {lineaTrabajo && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{lineaTrabajo.nombreLineaTrabajo}</b>?
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

export default React.memo(CrudLineasTrabajo, comparisonFn);
