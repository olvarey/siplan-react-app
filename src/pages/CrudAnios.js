import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { AnioService } from "../service/AnioService";

const CrudAnios = () => {
    let emptyAnio = {
        idAnio: null,
        valorAnio: "",
    };

    const [anios, setAnios] = useState(null);
    const [anioDialog, setAnioDialog] = useState(false);
    const [deleteAnioDialog, setDeleteAnioDialog] = useState(false);
    const [anio, setAnio] = useState(emptyAnio);
    const [selectedAnio, setSelectedAnio] = useState(null);
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
        const anioService = new AnioService();
        anioService
            .getAnios(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setAnios(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Años cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Años no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setAnio(emptyAnio);
        setSubmitted(false);
        setAnioDialog(true);
    };

    const hideDlg = () => {
        setSubmitted(false);
        setAnioDialog(false);
    };

    const hideDeleteAnioDlg = () => {
        setDeleteAnioDialog(false);
    };

    const saveAnio = () => {
        const anioService = new AnioService();
        setSubmitted(true);

        if (anio.valorAnio.trim()) {
            let _anios = [...anios];
            let _anio = { ...anio };
            //UPDATE
            if (anio.idAnio) {
                const index = findIndexById(anio.idAnio);
                anioService
                    .saveAnio(_anio, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _anio = { ...res.data };
                            _anios[index] = { ..._anio };
                            setAnios(_anios);
                            setAnioDialog(false);
                            setAnio(emptyAnio);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Año actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Año no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                anioService
                    .saveAnio(_anio, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _anio = { ...res.data };
                            _anios.push(_anio);
                            setAnios(_anios);
                            setAnioDialog(false);
                            setAnio(emptyAnio);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Año creado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Año no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editAnio = (anio) => {
        setAnio({ ...anio });
        setAnioDialog(true);
    };

    const confirmDeleteAnio = (anio) => {
        setAnio(anio);
        setDeleteAnioDialog(true);
    };

    const deleteAnio = () => {
        const anioService = new AnioService();
        let _anios = anios.filter((val) => val.idAnio !== anio.idAnio);
        anioService
            .deleteAnio(anio, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setAnios(_anios);
                    setDeleteAnioDialog(false);
                    setAnio(emptyAnio);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Año borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Año no ha podido ser borrado.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < anios.length; i++) {
            if (anios[i].idAnio === id) {
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
        let _anio = { ...anio };
        _anio[`${name}`] = val;

        setAnio(_anio);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editAnio(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteAnio(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de años</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const anioDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDlg} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveAnio} />
        </>
    );

    const deleteAnioDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAnioDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteAnio} />
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
                        value={anios}
                        selection={selectedAnio}
                        onSelectionChange={(e) => setSelectedAnio(e.value)}
                        dataKey="idAnio"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} años"
                        globalFilter={globalFilter}
                        emptyMessage="No hay años encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idAnio" header="ID" sortable></Column>
                        <Column field="valorAnio" header="Año" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={anioDialog} style={{ width: "450px" }} header="Detalle de año" modal className="p-fluid" footer={anioDlgFooter} onHide={hideDlg}>
                        <div className="field">
                            <label htmlFor="valorAnio">Valor año</label>
                            <InputText id="valorAnio" value={anio.valorAnio} onChange={(e) => onInputChange(e, "valorAnio")} required autoFocus className={classNames({ "p-invalid": submitted && !anio.valorAnio })} />
                            {submitted && !anio.valorAnio && <small className="p-invalid">Año es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAnioDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteAnioDlgFooter} onHide={hideDeleteAnioDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {anio && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{anio.valorAnio}</b>?
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

export default React.memo(CrudAnios, comparisonFn);
