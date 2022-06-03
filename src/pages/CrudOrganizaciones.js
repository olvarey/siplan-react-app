import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { OrganizacionService } from "../service/OrganizacionService";

const CrudOrganizaciones = () => {
    let emptyOrganizacion = {
        idOrganizacion: null,
        nombreOrganizacion: "",
        descripcionOrganizacion: "",
        misionOrganizacion: "",
        visionOrganizacion: "",
    };

    const [organizaciones, setOrganizaciones] = useState(null);
    const [organizacionDialog, setOrganizacionDialog] = useState(false);
    const [deleteOrganizacionDialog, setDeleteOrganizacionDialog] = useState(false);
    const [organizacion, setOrganizacion] = useState(emptyOrganizacion);
    const [selectedOrganizacion, setSelectedOrganizacion] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const organizacionService = new OrganizacionService();
        organizacionService.getOrganizaciones().then((data) => setOrganizaciones(data));
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setOrganizacion(emptyOrganizacion);
        setSubmitted(false);
        setOrganizacionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setOrganizacionDialog(false);
    };

    const hideDeleteOrganizacionDialog = () => {
        setDeleteOrganizacionDialog(false);
    };

    const saveOrganizacion = () => {
        const organizacionService = new OrganizacionService();
        setSubmitted(true);

        if (organizacion.nombreOrganizacion.trim()) {
            let _organizaciones = [...organizaciones];
            let _organizacion = { ...organizacion };
            //UPDATE
            if (organizacion.idOrganizacion) {
                const index = findIndexById(organizacion.idOrganizacion);
                organizacionService.saveOrganizacion(_organizacion).then((data) => {
                    _organizacion = { ...data };
                    _organizaciones[index] = { ..._organizacion };
                    setOrganizaciones(_organizaciones);
                    setOrganizacionDialog(false);
                    setOrganizacion(emptyOrganizacion);
                });
                toast.current.show({ severity: "success", summary: "Éxito", detail: "Organización actualizada", life: 3000 });
            }
            //CREATE
            else {
                organizacionService.saveOrganizacion(_organizacion).then((data) => {
                    _organizacion = { ...data };
                    _organizaciones.push(_organizacion);
                    setOrganizaciones(_organizaciones);
                    setOrganizacionDialog(false);
                    setOrganizacion(emptyOrganizacion);
                });
                toast.current.show({ severity: "success", summary: "Éxito", detail: "Organización creada", life: 3000 });
            }
        }
    };

    const editOrganizacion = (organizacion) => {
        setOrganizacion({ ...organizacion });
        setOrganizacionDialog(true);
    };

    const confirmDeleteOrganizacion = (organizacion) => {
        setOrganizacion(organizacion);
        setDeleteOrganizacionDialog(true);
    };

    const deleteOrganizacion = () => {
        const organizacionService = new OrganizacionService();
        let _organizaciones = organizaciones.filter((val) => val.idOrganizacion !== organizacion.idOrganizacion);
        organizacionService
            .deleteOrganizacion(organizacion)
            .then((res) => {
                if (res.status === 200) {
                    setOrganizaciones(_organizaciones);
                    setDeleteOrganizacionDialog(false);
                    setOrganizacion(emptyOrganizacion);
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Organización no ha podido ser borrada.", life: 3000 });
            });
        toast.current.show({ severity: "success", summary: "Éxito", detail: "Organización borrada.", life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < organizaciones.length; i++) {
            if (organizaciones[i].idOrganizacion === id) {
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
        let _organizacion = { ...organizacion };
        _organizacion[`${name}`] = val;

        setOrganizacion(_organizacion);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editOrganizacion(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteOrganizacion(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de organizaciones</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const organizacionDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveOrganizacion} />
        </>
    );

    const deleteOrganizacionDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteOrganizacionDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteOrganizacion} />
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
                        value={organizaciones}
                        selection={selectedOrganizacion}
                        onSelectionChange={(e) => setSelectedOrganizacion(e.value)}
                        dataKey="idOrganizacion"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} organizaciones"
                        globalFilter={globalFilter}
                        emptyMessage="No hay organizaciones encontradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idOrganizacion" header="ID" sortable></Column>
                        <Column field="nombreOrganizacion" header="Nombre" sortable></Column>
                        <Column field="descripcionOrganizacion" header="Descripción" sortable></Column>
                        <Column field="misionOrganizacion" header="Misión" sortable></Column>
                        <Column field="visionOrganizacion" header="Visión" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={organizacionDialog} style={{ width: "450px" }} header="Detalle de organización" modal className="p-fluid" footer={organizacionDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombreOrganizacion">Nombre</label>
                            <InputText id="nombreOrganizacion" value={organizacion.nombreOrganizacion} onChange={(e) => onInputChange(e, "nombreOrganizacion")} required autoFocus className={classNames({ "p-invalid": submitted && !organizacion.nombreOrganizacion })} />
                            {submitted && !organizacion.nombreOrganizacion && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcionOrganizacion">Descripción</label>
                            <InputTextarea
                                id="descripcionOrganizacion"
                                value={organizacion.descripcionOrganizacion}
                                onChange={(e) => onInputChange(e, "descripcionOrganizacion")}
                                required
                                rows={3}
                                cols={20}
                                className={classNames({ "p-invalid": submitted && !organizacion.descripcionOrganizacion })}
                            />
                            {submitted && !organizacion.descripcionOrganizacion && <small className="p-invalid">Descripción es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="misionOrganizacion">Misión</label>
                            <InputTextarea id="misionOrganizacion" value={organizacion.misionOrganizacion} onChange={(e) => onInputChange(e, "misionOrganizacion")} required rows={3} cols={20} className={classNames({ "p-invalid": submitted && !organizacion.misionOrganizacion })} />
                            {submitted && !organizacion.misionOrganizacion && <small className="p-invalid">Misión es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="visionOrganizacion">Visión</label>
                            <InputTextarea id="visionOrganizacion" value={organizacion.visionOrganizacion} onChange={(e) => onInputChange(e, "visionOrganizacion")} required rows={3} cols={20} className={classNames({ "p-invalid": submitted && !organizacion.visionOrganizacion })} />
                            {submitted && !organizacion.visionOrganizacion && <small className="p-invalid">Visión es requerida.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteOrganizacionDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteOrganizacionDialogFooter} onHide={hideDeleteOrganizacionDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {organizacion && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{organizacion.nombreOrganizacion}</b>?
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

export default React.memo(CrudOrganizaciones, comparisonFn);
