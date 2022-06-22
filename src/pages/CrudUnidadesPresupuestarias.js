import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { UnidadPresupuestariaService } from "../service/UnidadPresupuestariaService";

const CrudUnidadesPresupuestarias = () => {
    let emptyUnidadPresupuestaria = {
        idUnidadPresupuestaria: null,
        nombreUnidadPresupuestaria: "",
    };

    const [unidadesPresupuestarias, setUnidadesPresupuestarias] = useState(null);
    const [unidadPresupuestariaDlg, setUnidadPresupuestariaDlg] = useState(false);
    const [deleteUnidadPresupuestariaDlg, setDeleteUnidadPresupuestariaDlg] = useState(false);
    const [unidadPresupuestaria, setUnidadPresupuestaria] = useState(emptyUnidadPresupuestaria);
    const [selectedUnidadPresupuestaria, setSelectedUnidadPresupuestaria] = useState(null);
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
        const unidadPresupuestariaService = new UnidadPresupuestariaService();
        unidadPresupuestariaService
            .getUnidadesPresupuestarias(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setUnidadesPresupuestarias(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades presupuestarias cargadas con éxito", life: 3000 });
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
        setUnidadPresupuestaria(emptyUnidadPresupuestaria);
        setSubmitted(false);
        setUnidadPresupuestariaDlg(true);
    };

    const hideDlg = () => {
        setSubmitted(false);
        setUnidadPresupuestariaDlg(false);
    };

    const hideDeleteUnidadPresupuestariaDlg = () => {
        setDeleteUnidadPresupuestariaDlg(false);
    };

    const saveUnidadPresupuestaria = () => {
        const unidadPresupuestariaService = new UnidadPresupuestariaService();
        setSubmitted(true);

        if (unidadPresupuestaria.nombreUnidadPresupuestaria.trim()) {
            let _unidades_presupuestarias = [...unidadesPresupuestarias];
            let _unidad_presupuestaria = { ...unidadPresupuestaria };
            //UPDATE
            if (unidadPresupuestaria.idUnidadPresupuestaria) {
                const index = findIndexById(unidadPresupuestaria.idUnidadPresupuestaria);
                unidadPresupuestariaService
                    .saveUnidadPresupuestaria(_unidad_presupuestaria, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _unidad_presupuestaria = { ...res.data };
                            _unidades_presupuestarias[index] = { ..._unidad_presupuestaria };
                            setUnidadesPresupuestarias(_unidades_presupuestarias);
                            setUnidadPresupuestariaDlg(false);
                            setUnidadPresupuestaria(emptyUnidadPresupuestaria);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidad presupuestaria actualizada", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Unidad presupuestaria no ha podido ser actualizada.", life: 3000 });
                    });
            }
            //CREATE
            else {
                unidadPresupuestariaService
                    .saveUnidadPresupuestaria(_unidad_presupuestaria, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _unidad_presupuestaria = { ...res.data };
                            _unidades_presupuestarias.push(_unidad_presupuestaria);
                            setUnidadesPresupuestarias(_unidades_presupuestarias);
                            setUnidadPresupuestariaDlg(false);
                            setUnidadPresupuestaria(emptyUnidadPresupuestaria);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidad presupuestaria creada", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Unidad presupuestaria no ha podido ser creada.", life: 3000 });
                    });
            }
        }
    };

    const editUnidadPresupuestaria = (unidadPresupuestaria) => {
        setUnidadPresupuestaria({ ...unidadPresupuestaria });
        setUnidadPresupuestariaDlg(true);
    };

    const confirmDeleteUnidadPresupuestaria = (unidadPresupuestaria) => {
        setUnidadPresupuestaria(unidadPresupuestaria);
        setDeleteUnidadPresupuestariaDlg(true);
    };

    const deleteUnidadPresupuestaria = () => {
        const unidadPresupuestariaService = new UnidadPresupuestariaService();
        let _unidades_presupuestarias = unidadesPresupuestarias.filter((val) => val.idUnidadPresupuestaria !== unidadPresupuestaria.idUnidadPresupuestaria);
        unidadPresupuestariaService
            .deleteUnidadPresupuestaria(unidadPresupuestaria, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setUnidadesPresupuestarias(_unidades_presupuestarias);
                    setDeleteUnidadPresupuestariaDlg(false);
                    setUnidadPresupuestaria(emptyUnidadPresupuestaria);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidad presupuestaria borrada.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Unidad presupuestaria no ha podido ser borrada.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < unidadesPresupuestarias.length; i++) {
            if (unidadesPresupuestarias[i].idUnidadPresupuestaria === id) {
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
        let _unidad_presupuestaria = { ...unidadPresupuestaria };
        _unidad_presupuestaria[`${name}`] = val;

        setUnidadPresupuestaria(_unidad_presupuestaria);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUnidadPresupuestaria(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteUnidadPresupuestaria(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de unidades presupuestarias</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const unidadPresupuestariaDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDlg} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveUnidadPresupuestaria} />
        </>
    );

    const deleteUnidadPresupuestariaDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUnidadPresupuestariaDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteUnidadPresupuestaria} />
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
                        value={unidadesPresupuestarias}
                        selection={selectedUnidadPresupuestaria}
                        onSelectionChange={(e) => setSelectedUnidadPresupuestaria(e.value)}
                        dataKey="idUnidadPresupuestaria"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} unidades presupuestarias"
                        globalFilter={globalFilter}
                        emptyMessage="No hay unidades presupuestarias encontradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idUnidadPresupuestaria" header="ID" sortable></Column>
                        <Column field="nombreUnidadPresupuestaria" header="Nombre" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={unidadPresupuestariaDlg} style={{ width: "450px" }} header="Detalle de unidad presupuestaria" modal className="p-fluid" footer={unidadPresupuestariaDlgFooter} onHide={hideDlg}>
                        <div className="field">
                            <label htmlFor="nombreUnidadPresupuestaria">Unidad presupuestaria</label>
                            <InputText id="nombreUnidadPresupuestaria" value={unidadPresupuestaria.nombreUnidadPresupuestaria} onChange={(e) => onInputChange(e, "nombreUnidadPresupuestaria")} required autoFocus className={classNames({ "p-invalid": submitted && !unidadPresupuestaria.nombreUnidadPresupuestaria })} />
                            {submitted && !unidadPresupuestaria.nombreUnidadPresupuestaria && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUnidadPresupuestariaDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteUnidadPresupuestariaDlgFooter} onHide={hideDeleteUnidadPresupuestariaDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {unidadPresupuestaria && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{unidadPresupuestaria.nombreUnidadPresupuestaria}</b>?
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

export default React.memo(CrudUnidadesPresupuestarias, comparisonFn);
