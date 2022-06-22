import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FinanciamientoService } from "../service/FinanciamientoService";

const CrudFinanciamientos = () => {
    let emptyFinanciamiento = {
        idFinanciamiento: null,
        nombreFinanciamiento: "",
    };

    const [financiamientos, setFinanciamientos] = useState(null);
    const [financiamientoDlg, setFinanciamientoDlg] = useState(false);
    const [deleteFinanciamientoDlg, setDeleteFinanciamientoDlg] = useState(false);
    const [financiamiento, setFinanciamiento] = useState(emptyFinanciamiento);
    const [selectedFinanciamiento, setSelectedFinanciamiento] = useState(null);
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
        const financiamientoService = new FinanciamientoService();
        financiamientoService
            .getFinanciamientos(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setFinanciamientos(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Financiamentos con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Financiamentos no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setFinanciamiento(emptyFinanciamiento);
        setSubmitted(false);
        setFinanciamientoDlg(true);
    };

    const hideDlg = () => {
        setSubmitted(false);
        setFinanciamientoDlg(false);
    };

    const hideDeleteFinanciamientoDlg = () => {
        setDeleteFinanciamientoDlg(false);
    };

    const saveFinanciamiento = () => {
        const financiamientoService = new FinanciamientoService();
        setSubmitted(true);

        if (financiamiento.nombreFinanciamiento.trim()) {
            let _financiamientos = [...financiamientos];
            let _financiamiento = { ...financiamiento };
            //UPDATE
            if (financiamiento.idFinanciamiento) {
                const index = findIndexById(financiamiento.idFinanciamiento);
                financiamientoService
                    .saveFinanciamiento(_financiamiento, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _financiamiento = { ...res.data };
                            _financiamientos[index] = { ..._financiamiento };
                            setFinanciamientos(_financiamientos);
                            setFinanciamientoDlg(false);
                            setFinanciamiento(emptyFinanciamiento);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Financiamento actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Financiamento no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                financiamientoService
                    .saveFinanciamiento(_financiamiento, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _financiamiento = { ...res.data };
                            _financiamientos.push(_financiamiento);
                            setFinanciamientos(_financiamientos);
                            setFinanciamientoDlg(false);
                            setFinanciamiento(emptyFinanciamiento);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Financiamento creado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Financiamento no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editFinanciamiento = (financiamiento) => {
        setFinanciamiento({ ...financiamiento });
        setFinanciamientoDlg(true);
    };

    const confirmDeleteFinanciamiento = (financiamiento) => {
        setFinanciamiento(financiamiento);
        setDeleteFinanciamientoDlg(true);
    };

    const deleteFinanciamiento = () => {
        const financiamientoService = new FinanciamientoService();
        let _financiamientos = financiamientos.filter((val) => val.idFinanciamiento !== financiamiento.idFinanciamiento);
        financiamientoService
            .deleteFinanciamiento(financiamiento, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setFinanciamientos(_financiamientos);
                    setDeleteFinanciamientoDlg(false);
                    setFinanciamiento(emptyFinanciamiento);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Financiamento borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Financiamento no ha podido ser borrado.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < financiamientos.length; i++) {
            if (financiamientos[i].idFinanciamiento === id) {
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
        let _financiamiento = { ...financiamiento };
        _financiamiento[`${name}`] = val;

        setFinanciamiento(_financiamiento);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editFinanciamiento(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteFinanciamiento(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de financiamientos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const financiamientoDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDlg} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveFinanciamiento} />
        </>
    );

    const deleteFinanciamientoDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteFinanciamientoDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteFinanciamiento} />
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
                        value={financiamientos}
                        selection={selectedFinanciamiento}
                        onSelectionChange={(e) => setSelectedFinanciamiento(e.value)}
                        dataKey="idFinanciamiento"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} financiamentos"
                        globalFilter={globalFilter}
                        emptyMessage="No hay financiamentos encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idFinanciamiento" header="ID" sortable></Column>
                        <Column field="nombreFinanciamiento" header="Nombre" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={financiamientoDlg} style={{ width: "450px" }} header="Detalle de financiamiento" modal className="p-fluid" footer={financiamientoDlgFooter} onHide={hideDlg}>
                        <div className="field">
                            <label htmlFor="nombreFinanciamiento">Nombre</label>
                            <InputText id="nombreFinanciamiento" value={financiamiento.nombreFinanciamiento} onChange={(e) => onInputChange(e, "nombreFinanciamiento")} required autoFocus className={classNames({ "p-invalid": submitted && !financiamiento.nombreFinanciamiento })} />
                            {submitted && !financiamiento.nombreFinanciamiento && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteFinanciamientoDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteFinanciamientoDlgFooter} onHide={hideDeleteFinanciamientoDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {financiamiento && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{financiamiento.nombreFinanciamiento}</b>?
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

export default React.memo(CrudFinanciamientos, comparisonFn);
