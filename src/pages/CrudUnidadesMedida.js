import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { UnidadMedidaService } from "../service/UnidadMedidaService";

const CrudUnidadesMedida = () => {
    let emptyUnidadMedida = {
        idUnidadMedida: null,
        nombreUnidadMedida: "",
    };

    const [unidadesMedida, setUnidadesMedida] = useState(null);
    const [showItemDlg, setShowItemDlg] = useState(false);
    const [deleteItemDlg, setDeleteItemDlg] = useState(false);
    const [unidadMedida, setUnidadMedida] = useState(emptyUnidadMedida);
    const [selectedUnidadMedida, setSelectedUnidadMedida] = useState(null);
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
        const unidadMedidaService = new UnidadMedidaService();
        unidadMedidaService
            .getUnidadesMedida(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setUnidadesMedida(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Unidades de medida no han podido ser cargadas.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setUnidadMedida(emptyUnidadMedida);
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

    const saveUnidadMedida = () => {
        const unidadMedidaService = new UnidadMedidaService();
        setSubmitted(true);

        if (unidadMedida.nombreUnidadMedida.trim()) {
            let _unidades_medida = [...unidadesMedida];
            let _unidad_medida = { ...unidadMedida };
            //UPDATE
            if (unidadMedida.idUnidadMedida) {
                const index = findIndexById(unidadMedida.idUnidadMedida);
                unidadMedidaService
                    .saveUnidadMedida(_unidad_medida, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _unidad_medida = { ...res.data };
                            _unidades_medida[index] = { ..._unidad_medida };
                            setUnidadesMedida(_unidades_medida);
                            setShowItemDlg(false);
                            setUnidadMedida(emptyUnidadMedida);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidad de medida actualizada.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Unidad de medida no ha podido ser actualizada.", life: 3000 });
                    });
            }
            //CREATE
            else {
                unidadMedidaService
                    .saveUnidadMedida(_unidad_medida, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _unidad_medida = { ...res.data };
                            _unidades_medida.push(_unidad_medida);
                            setUnidadesMedida(_unidades_medida);
                            setShowItemDlg(false);
                            setUnidadMedida(emptyUnidadMedida);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidad de medida creada.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Unidad de medida no ha podido ser creada.", life: 3000 });
                    });
            }
        }
    };

    const editUnidadMedida = (unidadMedida) => {
        setUnidadMedida({ ...unidadMedida });
        setShowItemDlg(true);
    };

    const confirmDeleteUnidadMedida = (unidadMedida) => {
        setUnidadMedida(unidadMedida);
        setDeleteItemDlg(true);
    };

    const deleteUnidadMedida = () => {
        const unidadMedidaService = new UnidadMedidaService();
        let _unidades_medida = unidadesMedida.filter((val) => val.idUnidadMedida !== unidadMedida.idUnidadMedida);
        unidadMedidaService
            .deleteUnidadMedida(unidadMedida, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setUnidadesMedida(_unidades_medida);
                    setDeleteItemDlg(false);
                    setUnidadMedida(emptyUnidadMedida);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidad de medida borrada.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Unidad de medida no ha podido ser borrada.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < unidadesMedida.length; i++) {
            if (unidadesMedida[i].idUnidadMedida === id) {
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
        let _unidad_medida = { ...unidadMedida };
        _unidad_medida[`${name}`] = val;

        setUnidadMedida(_unidad_medida);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUnidadMedida(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteUnidadMedida(rowData)} />
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

    const unidadMedidaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveUnidadMedida} />
        </>
    );

    const deleteUnidadMedidaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteUnidadMedida} />
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
                        value={unidadesMedida}
                        selection={selectedUnidadMedida}
                        onSelectionChange={(e) => setSelectedUnidadMedida(e.value)}
                        dataKey="idUnidadMedida"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} unidades de medida"
                        globalFilter={globalFilter}
                        emptyMessage="No hay unidades de medida encontradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idUnidadMedida" header="ID" sortable></Column>
                        <Column field="nombreUnidadMedida" header="Nombre" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={showItemDlg} style={{ width: "450px" }} header="Detalle de unidad de medida" modal className="p-fluid" footer={unidadMedidaDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombreUnidadMedida">Nombre</label>
                            <InputText id="nombreUnidadMedida" value={unidadMedida.nombreUnidadMedida} onChange={(e) => onInputChange(e, "nombreUnidadMedida")} required autoFocus className={classNames({ "p-invalid": submitted && !unidadMedida.nombreUnidadMedida })} />
                            {submitted && !unidadMedida.nombreUnidadMedida && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteUnidadMedidaDialogFooter} onHide={hideDeleteDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {unidadMedida && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{unidadMedida.nombreUnidadMedida}</b>?
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

export default React.memo(CrudUnidadesMedida, comparisonFn);
