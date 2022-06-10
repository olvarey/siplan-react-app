import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TipoIndicadorService } from "../service/TipoIndicadorService";

const CrudTiposIndicador = () => {
    let emptyTipoIndicador = {
        idTipoIndicador: null,
        nombreIndicador: "",
    };

    const [tiposIndicador, setTiposIndicador] = useState(null);
    const [tipoIndicadorDialog, setTipoIndicadorDialog] = useState(false);
    const [deleteTipoIndicadorDialog, setDeleteTipoIndicadorDialog] = useState(false);
    const [tipoIndicador, setTipoIndicador] = useState(emptyTipoIndicador);
    const [selectedTipoIndicador, setSelectedTipoIndicador] = useState(null);
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
        const tipoIndicadorService = new TipoIndicadorService();
        tipoIndicadorService
            .getTiposIndicador(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setTiposIndicador(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipos de indicador cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Tipos de indicador no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setTipoIndicador(emptyTipoIndicador);
        setSubmitted(false);
        setTipoIndicadorDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTipoIndicadorDialog(false);
    };

    const hideDeleteTipoIndicadorDialog = () => {
        setDeleteTipoIndicadorDialog(false);
    };

    const saveTipoIndicador = () => {
        const tipoIndicadorService = new TipoIndicadorService();
        setSubmitted(true);

        if (tipoIndicador.nombreIndicador.trim()) {
            let _tipos_indicador = [...tiposIndicador];
            let _tipo_indicador = { ...tipoIndicador };
            //UPDATE
            if (tipoIndicador.idTipoIndicador) {
                const index = findIndexById(tipoIndicador.idTipoIndicador);
                tipoIndicadorService
                    .saveTipoIndicador(_tipo_indicador, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _tipo_indicador = { ...res.data };
                            _tipos_indicador[index] = { ..._tipo_indicador };
                            setTiposIndicador(_tipos_indicador);
                            setTipoIndicadorDialog(false);
                            setTipoIndicador(emptyTipoIndicador);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipo de indicador actualizado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Tipo de indicador no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                tipoIndicadorService
                    .saveTipoIndicador(_tipo_indicador, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _tipo_indicador = { ...res.data };
                            _tipos_indicador.push(_tipo_indicador);
                            setTiposIndicador(_tipos_indicador);
                            setTipoIndicadorDialog(false);
                            setTipoIndicador(emptyTipoIndicador);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipo de indicador creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Tipo de indicador no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editTipoIndicador = (tipoIndicador) => {
        setTipoIndicador({ ...tipoIndicador });
        setTipoIndicadorDialog(true);
    };

    const confirmDeleteTipoIndicador = (tipoIndicador) => {
        setTipoIndicador(tipoIndicador);
        setDeleteTipoIndicadorDialog(true);
    };

    const deleteTipoIndicador = () => {
        const tipoIndicadorService = new TipoIndicadorService();
        let _tipos_indicador = tiposIndicador.filter((val) => val.idTipoIndicador !== tipoIndicador.idTipoIndicador);
        tipoIndicadorService
            .deleteTipoIndicador(tipoIndicador, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setTiposIndicador(_tipos_indicador);
                    setDeleteTipoIndicadorDialog(false);
                    setTipoIndicador(emptyTipoIndicador);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipo de indicador borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Tipo de indicador no ha podido ser borrado.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < tiposIndicador.length; i++) {
            if (tiposIndicador[i].idTipoIndicador === id) {
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
        let _tipo_indicador = { ...tipoIndicador };
        _tipo_indicador[`${name}`] = val;

        setTipoIndicador(_tipo_indicador);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editTipoIndicador(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteTipoIndicador(rowData)} />
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

    const tipoIndicadorDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveTipoIndicador} />
        </>
    );

    const deleteTipoIndicadorDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTipoIndicadorDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteTipoIndicador} />
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
                        value={tiposIndicador}
                        selection={selectedTipoIndicador}
                        onSelectionChange={(e) => setSelectedTipoIndicador(e.value)}
                        dataKey="idTipoIndicador"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} tipos de indicador"
                        globalFilter={globalFilter}
                        emptyMessage="No hay tipos de indicador encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idTipoIndicador" header="ID" sortable></Column>
                        <Column field="nombreIndicador" header="Nombre" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={tipoIndicadorDialog} style={{ width: "450px" }} header="Detalle de tipo de indicador" modal className="p-fluid" footer={tipoIndicadorDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombreIndicador">Nombre</label>
                            <InputText id="nombreIndicador" value={tipoIndicador.nombreIndicador} onChange={(e) => onInputChange(e, "nombreIndicador")} required autoFocus className={classNames({ "p-invalid": submitted && !tipoIndicador.nombreIndicador })} />
                            {submitted && !tipoIndicador.nombreIndicador && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTipoIndicadorDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteTipoIndicadorDialogFooter} onHide={hideDeleteTipoIndicadorDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipoIndicador && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{tipoIndicador.nombreIndicador}</b>?
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

export default React.memo(CrudTiposIndicador, comparisonFn);
