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
import { ObjetivoService } from "../service/ObjetivoService";
import { OrganizacionService } from "../service/OrganizacionService";
import { TipoObjetivoService } from "../service/TipoObjetivoService";

const CrudObjetivos = () => {
    let emptyObjetivo = {
        idObjetivo: null,
        nombreObjetivo: "",
        descripcionObjetivo: "",
        organizacion: {
            idOrganizacion: null,
        },
        tipoObjetivo: {
            idTipoObjetivo: null,
        },
    };

    const [objetivos, setObjetivos] = useState(null);
    const [organizaciones, setOrganizaciones] = useState(null);
    const [tiposObjetivo, setTiposObjetivo] = useState(null);
    const [objetivoDlg, setObjetivoDlg] = useState(false);
    const [deleteObjetivoDlg, setDeleteObjetivoDlg] = useState(false);
    const [objetivo, setObjetivo] = useState(emptyObjetivo);
    const [selectedObjetivo, setSelectedObjetivo] = useState(null);
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
        const objetivoService = new ObjetivoService();
        objetivoService
            .getObjetivos(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setObjetivos(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Objetivos cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Objetivos no han podido ser cargados.", life: 3000 });
            });

        const organizacionService = new OrganizacionService();
        organizacionService
            .getOrganizaciones(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setOrganizaciones(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipos de objetivo cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Organizaciones no han podido ser cargadas.", life: 3000 });
            });

        const tipoObjetivoService = new TipoObjetivoService();
        tipoObjetivoService
            .getTiposObjetivo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setTiposObjetivo(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
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
        setObjetivo(emptyObjetivo);
        setSubmitted(false);
        setObjetivoDlg(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setObjetivoDlg(false);
    };

    const hideDeleteObjetivoDialog = () => {
        setDeleteObjetivoDlg(false);
    };

    const saveObjetivo = () => {
        const objetivoService = new ObjetivoService();
        setSubmitted(true);

        if (objetivo.nombreObjetivo.trim()) {
            //let _objetivos = [...objetivos];
            let _objetivo = { ...objetivo };
            //UPDATE
            if (objetivo.idObjetivo) {
                //const index = findIndexById(objetivo.idObjetivo);
                objetivoService
                    .saveObjetivo(_objetivo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _objetivo = { ...res.data };
                            // _objetivos[index] = { ..._objetivo };
                            // setObjetivos(_objetivos);
                            setObjetivoDlg(false);
                            setObjetivo(emptyObjetivo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Objetivo actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Objetivo no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                objetivoService
                    .saveObjetivo(_objetivo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _objetivo = { ...res.data };
                            // _objetivos.push(_objetivo);
                            // setObjetivos(_objetivos);
                            setObjetivoDlg(false);
                            setObjetivo(emptyObjetivo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Objetivo creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Objetivo no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editObjetivo = (objetivo) => {
        setObjetivo({ ...objetivo });
        setObjetivoDlg(true);
    };

    const confirmDeleteObjetivo = (objetivo) => {
        setObjetivo(objetivo);
        setDeleteObjetivoDlg(true);
    };

    const deleteObjetivo = () => {
        const objetivoService = new ObjetivoService();
        let _objetivos = objetivos.filter((val) => val.idObjetivo !== objetivo.idObjetivo);
        objetivoService
            .deleteObjetivo(objetivo, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setObjetivos(_objetivos);
                    setDeleteObjetivoDlg(false);
                    setObjetivo(emptyObjetivo);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Objetivo borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Objetivo no ha podido ser borrado.", life: 3000 });
            });
    };

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < objetivos.length; i++) {
    //         if (objetivos[i].idObjetivo === id) {
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
        let _objetivo = { ...objetivo };
        _objetivo[`${name}`] = val;

        setObjetivo(_objetivo);
    };

    const onOrganizacionChange = (e) => {
        let _objetivo = { ...objetivo };
        setObjetivo({ ..._objetivo, organizacion: { ..._objetivo.organizacion, [e.target.name]: e.target.value } });
    };

    const onObjetivoChange = (e) => {
        let _objetivo = { ...objetivo };
        setObjetivo({ ..._objetivo, tipoObjetivo: { ..._objetivo.tipoObjetivo, [e.target.name]: e.target.value } });
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editObjetivo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteObjetivo(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de objetivos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const objetivoDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveObjetivo} />
        </>
    );

    const deleteObjetivoDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObjetivoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteObjetivo} />
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
                        value={objetivos}
                        selection={selectedObjetivo}
                        onSelectionChange={(e) => setSelectedObjetivo(e.value)}
                        dataKey="idObjetivo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} objetivos"
                        globalFilter={globalFilter}
                        emptyMessage="No hay objetivos encontradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idObjetivo" header="ID" sortable></Column>
                        <Column field="nombreObjetivo" header="Objetivo" sortable></Column>
                        <Column field="organizacion.nombreOrganizacion" header="Organización" sortable></Column>
                        <Column field="tipoObjetivo.nombreTipoObjetivo" header="Tipo objetivo" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={objetivoDlg} style={{ width: "450px" }} header="Detalle de objetivo" modal className="p-fluid" footer={objetivoDlgFooter} onHide={hideDialog}>
                        {/* {JSON.stringify(objetivo)} */}
                        <div className="field">
                            <label htmlFor="idOrganizacion">Organización</label>
                            <Dropdown
                                id="idOrganizacion"
                                name="idOrganizacion"
                                value={objetivo.organizacion.idOrganizacion}
                                onChange={onOrganizacionChange}
                                options={organizaciones}
                                optionLabel="nombreOrganizacion"
                                optionValue="idOrganizacion"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !objetivo.organizacion.idOrganizacion })}
                            />
                            {submitted && !objetivo.organizacion.idOrganizacion && <small className="p-invalid">Organización es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcionObjetivo">Descripción</label>
                            <InputText id="descripcionObjetivo" value={objetivo.descripcionObjetivo} onChange={(e) => onInputChange(e, "descripcionObjetivo")} className={classNames({ "p-invalid": submitted && !objetivo.descripcionObjetivo })} />
                        </div>
                        <div className="field">
                            <label htmlFor="idTipoObjetivo">Tipo objetivo</label>
                            <Dropdown
                                id="idTipoObjetivo"
                                name="idTipoObjetivo"
                                value={objetivo.tipoObjetivo.idTipoObjetivo}
                                onChange={onObjetivoChange}
                                options={tiposObjetivo}
                                optionLabel="nombreTipoObjetivo"
                                optionValue="idTipoObjetivo"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !objetivo.tipoObjetivo.idTipoObjetivo })}
                            />
                            {submitted && !objetivo.tipoObjetivo.idTipoObjetivo && <small className="p-invalid">Tipo de objetivo es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombreObjetivo">Nombre</label>
                            <InputText id="nombreObjetivo" value={objetivo.nombreObjetivo} onChange={(e) => onInputChange(e, "nombreObjetivo")} required autoFocus className={classNames({ "p-invalid": submitted && !objetivo.nombreObjetivo })} />
                            {submitted && !objetivo.nombreObjetivo && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteObjetivoDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteObjetivoDlgFooter} onHide={hideDeleteObjetivoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {objetivo && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{objetivo.nombreObjetivo}</b>?
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

export default React.memo(CrudObjetivos, comparisonFn);
