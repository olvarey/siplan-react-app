import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TipoObjetivoService } from "../service/TipoObjetivoService";

const CrudTiposObjetivos = () => {
    let emptyTipoObjetivo = {
        idTipoObjetivo: null,
        nombreTipoObjetivo: "",
    };

    const [tiposObjetivo, setTiposObjetivo] = useState(null);
    const [tipoObjetivoDialog, setTipoObjetivoDialog] = useState(false);
    const [deleteTipoObjetivoDialog, setDeleteTipoObjetivoDialog] = useState(false);
    const [tipoObjetivo, setTipoObjetivo] = useState(emptyTipoObjetivo);
    const [selectedTipoObjetivo, setSelectedTipoObjetivo] = useState(null);
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
        const tipoObjetivoService = new TipoObjetivoService();
        tipoObjetivoService
            .getTiposObjetivo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setTiposObjetivo(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipos de objetivos cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Tipos de objetivos no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setTipoObjetivo(emptyTipoObjetivo);
        setSubmitted(false);
        setTipoObjetivoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTipoObjetivoDialog(false);
    };

    const hideDeleteTipoObjetivoDialog = () => {
        setDeleteTipoObjetivoDialog(false);
    };

    const saveTipoObjetivo = () => {
        const tipoObjetivoService = new TipoObjetivoService();
        setSubmitted(true);

        if (tipoObjetivo.nombreTipoObjetivo.trim()) {
            let _tipos_objetivo = [...tiposObjetivo];
            let _tipo_objetivo = { ...tipoObjetivo };
            //UPDATE
            if (tipoObjetivo.idTipoObjetivo) {
                const index = findIndexById(tipoObjetivo.idTipoObjetivo);
                tipoObjetivoService
                    .saveTipoObjetivo(_tipo_objetivo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _tipo_objetivo = { ...res.data };
                            _tipos_objetivo[index] = { ..._tipo_objetivo };
                            setTiposObjetivo(_tipos_objetivo);
                            setTipoObjetivoDialog(false);
                            setTipoObjetivo(emptyTipoObjetivo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipo de objetivo actualizado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Tipo de objetivo no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                tipoObjetivoService
                    .saveTipoObjetivo(_tipo_objetivo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _tipo_objetivo = { ...res.data };
                            _tipos_objetivo.push(_tipo_objetivo);
                            setTiposObjetivo(_tipos_objetivo);
                            setTipoObjetivoDialog(false);
                            setTipoObjetivo(emptyTipoObjetivo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipo de objetivo creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Tipo de objetivo no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editTipoObjetivo = (tipoObjetivo) => {
        setTipoObjetivo({ ...tipoObjetivo });
        setTipoObjetivoDialog(true);
    };

    const confirmDeleteTipoObjetivo = (tipoObjetivo) => {
        setTipoObjetivo(tipoObjetivo);
        setDeleteTipoObjetivoDialog(true);
    };

    const deleteTipoObjetivo = () => {
        const tipoObjetivoService = new TipoObjetivoService();
        let _tipos_objetivo = tiposObjetivo.filter((val) => val.idTipoObjetivo !== tipoObjetivo.idTipoObjetivo);
        tipoObjetivoService
            .deleteTipoObjetivo(tipoObjetivo, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setTiposObjetivo(_tipos_objetivo);
                    setDeleteTipoObjetivoDialog(false);
                    setTipoObjetivo(emptyTipoObjetivo);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipo de objetivo borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Tipo de objetivo no ha podido ser borrado.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < tiposObjetivo.length; i++) {
            if (tiposObjetivo[i].idTipoObjetivo === id) {
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
        let _tipo_objetivo = { ...tipoObjetivo };
        _tipo_objetivo[`${name}`] = val;

        setTipoObjetivo(_tipo_objetivo);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editTipoObjetivo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteTipoObjetivo(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de tipos de objetivo</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const tipoObjetivoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveTipoObjetivo} />
        </>
    );

    const deleteTipoObjetivoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTipoObjetivoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteTipoObjetivo} />
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
                        value={tiposObjetivo}
                        selection={selectedTipoObjetivo}
                        onSelectionChange={(e) => setSelectedTipoObjetivo(e.value)}
                        dataKey="idTipoObjetivo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} tipos de objetivo"
                        globalFilter={globalFilter}
                        emptyMessage="No hay tipos de objetivo encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idTipoObjetivo" header="ID" sortable></Column>
                        <Column field="nombreTipoObjetivo" header="Nombre" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={tipoObjetivoDialog} style={{ width: "450px" }} header="Detalle de tipo de objetivo" modal className="p-fluid" footer={tipoObjetivoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombreTipoObjetivo">Nombre</label>
                            <InputText id="nombreTipoObjetivo" value={tipoObjetivo.nombreTipoObjetivo} onChange={(e) => onInputChange(e, "nombreTipoObjetivo")} required autoFocus className={classNames({ "p-invalid": submitted && !tipoObjetivo.nombreTipoObjetivo })} />
                            {submitted && !tipoObjetivo.nombreTipoObjetivo && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTipoObjetivoDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteTipoObjetivoDialogFooter} onHide={hideDeleteTipoObjetivoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipoObjetivo && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{tipoObjetivo.nombreTipoObjetivo}</b>?
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

export default React.memo(CrudTiposObjetivos, comparisonFn);
