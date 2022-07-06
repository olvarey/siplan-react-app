import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { CodigoRiesgoService } from "../service/CodigoRiesgoService";

const CrudCodigoRiesgo = () => {
    let emptyCodigoRiesgo = {
        idCodigoRiesgo: null,
        nombreCodigoRiesgo: "",
    };

    const [codigosRiesgo, setCodigosRiesgo] = useState(null);
    const [codigoRiesgoDlg, setCodigoRiesgoDlg] = useState(false);
    const [deleteCodigoRiesgoDlg, setDeleteCodigoRiesgoDlg] = useState(false);
    const [codigoRiesgo, setCodigoRiesgo] = useState(emptyCodigoRiesgo);
    const [selectedCodigoRiesgo, setSelectedCodigoRiesgo] = useState(null);
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
        const codigoRiesgoService = new CodigoRiesgoService();
        codigoRiesgoService
            .getCodigosRiesgo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setCodigosRiesgo(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Códigos riesgo cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Códigos riesgo no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setCodigoRiesgo(emptyCodigoRiesgo);
        setSubmitted(false);
        setCodigoRiesgoDlg(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCodigoRiesgoDlg(false);
    };

    const hideDeleteCodigoRiesgoDialog = () => {
        setDeleteCodigoRiesgoDlg(false);
    };

    const saveCodigoRiesgo = () => {
        const codigoRiesgoService = new CodigoRiesgoService();
        setSubmitted(true);

        if (codigoRiesgo.nombreCodigoRiesgo.trim()) {
            let _codigos_riesgo = [...codigosRiesgo];
            let _codigo_riesgo = { ...codigoRiesgo };
            //UPDATE
            if (codigoRiesgo.idCodigoRiesgo) {
                const index = findIndexById(codigoRiesgo.idCodigoRiesgo);
                codigoRiesgoService
                    .saveCodigoRiesgo(_codigo_riesgo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _codigo_riesgo = { ...res.data };
                            _codigos_riesgo[index] = { ..._codigo_riesgo };
                            setCodigosRiesgo(_codigos_riesgo);
                            setCodigoRiesgoDlg(false);
                            setCodigoRiesgo(emptyCodigoRiesgo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Código riesgo actualizado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Código riesgo no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                codigoRiesgoService
                    .saveCodigoRiesgo(_codigo_riesgo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _codigo_riesgo = { ...res.data };
                            _codigos_riesgo.push(_codigo_riesgo);
                            setCodigosRiesgo(_codigos_riesgo);
                            setCodigoRiesgoDlg(false);
                            setCodigoRiesgo(emptyCodigoRiesgo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Código riesgo creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Código riesgo no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editCodigoRiesgo = (codigoRiesgo) => {
        setCodigoRiesgo({ ...codigoRiesgo });
        setCodigoRiesgoDlg(true);
    };

    const confirmDeleteCodigoRiesgo = (codigoRiesgo) => {
        setCodigoRiesgo(codigoRiesgo);
        setDeleteCodigoRiesgoDlg(true);
    };

    const deleteCodigoRiesgo = () => {
        const codigoRiesgoService = new CodigoRiesgoService();
        let _codigos_riesgo = codigosRiesgo.filter((val) => val.idCodigoRiesgo !== codigoRiesgo.idCodigoRiesgo);
        codigoRiesgoService
            .deleteCodigoRiesgo(codigoRiesgo, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setCodigosRiesgo(_codigos_riesgo);
                    setDeleteCodigoRiesgoDlg(false);
                    setCodigoRiesgo(emptyCodigoRiesgo);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Código riesgo borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Código riesgo no ha podido ser borrado.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < codigosRiesgo.length; i++) {
            if (codigosRiesgo[i].idCodigoRiesgo === id) {
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
        let _codigo_riesgo = { ...codigoRiesgo };
        _codigo_riesgo[`${name}`] = val;

        setCodigoRiesgo(_codigo_riesgo);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCodigoRiesgo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteCodigoRiesgo(rowData)} />
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

    const codigoRiesgoDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveCodigoRiesgo} />
        </>
    );

    const deletecodigoRiesgoDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCodigoRiesgoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteCodigoRiesgo} />
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
                        value={codigosRiesgo}
                        selection={selectedCodigoRiesgo}
                        onSelectionChange={(e) => setSelectedCodigoRiesgo(e.value)}
                        dataKey="idCodigoRiesgo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} códigos de riesgo"
                        globalFilter={globalFilter}
                        emptyMessage="No hay tipos de códigos de riesgo encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idCodigoRiesgo" header="ID" sortable></Column>
                        <Column field="nombreCodigoRiesgo" header="Código riesgo" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={codigoRiesgoDlg} style={{ width: "450px" }} header="Detalle código de riesgo" modal className="p-fluid" footer={codigoRiesgoDlgFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombreCodigoRiesgo">Nombre</label>
                            <InputText id="nombreCodigoRiesgo" value={codigoRiesgo.nombreCodigoRiesgo} onChange={(e) => onInputChange(e, "nombreCodigoRiesgo")} required autoFocus className={classNames({ "p-invalid": submitted && !codigoRiesgo.nombreCodigoRiesgo })} />
                            {submitted && !codigoRiesgo.nombreCodigoRiesgo && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCodigoRiesgoDlg} style={{ width: "450px" }} header="Confirm" modal footer={deletecodigoRiesgoDlgFooter} onHide={hideDeleteCodigoRiesgoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {codigoRiesgo && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{codigoRiesgo.nombreCodigoRiesgo}</b>?
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

export default React.memo(CrudCodigoRiesgo, comparisonFn);
