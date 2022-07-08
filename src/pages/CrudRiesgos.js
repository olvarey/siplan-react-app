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
import { RiesgoService } from "../service/RiesgoService";
import { CodigoRiesgoService } from "../service/CodigoRiesgoService";
import { CategoriaRiesgoService } from "../service/CategoriaRiesgoService";
import { ObjetivoService } from "../service/ObjetivoService";
import { UnidadOrganizativaService } from "../service/UnidadOrganizativaService";

const CrudRiesgos = () => {
    let emptyRiesgo = {
        idRiesgo: null,
        descripcionRiesgo: "",
        descripcionResultado: "",
        frecuenciaDescripcion: "",
        impactoDescripcion: "",
        exposicionDescripcion: "",
        codigoRiesgo: {
            idCodigoRiesgo: null,
        },
        categoriaRiesgo: {
            idCategoriaRiesgo: null,
        },
        objetivo: {
            idObjetivo: null,
        },
        unidadOrganizativa: {
            idUnidadOrganizativa: null,
        },
    };

    const [riesgos, setRiesgos] = useState(null);
    const [riesgoDlg, setRiesgoDlg] = useState(false);
    const [deleteRiesgoDlg, setDeleteRiesgoDlg] = useState(false);
    const [riesgo, setRiesgo] = useState(emptyRiesgo);
    const [selectedRiesgo, setSelectedRiesgo] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    //Catalogs
    const [codigosRiesgo, setCodigosRiesgo] = useState(null);
    const [categoriasRiesgo, setCategoriasRiesgo] = useState(null);
    const [objetivos, setObjetivos] = useState(null);
    const [unidadesOrganizativas, setunidadesOrganizativas] = useState(null);
    const [frecuencias, setFrecuencias] = useState(null);
    const [impactos, setImpactos] = useState(null);
    const [exposiciones, setExposiciones] = useState(null);

    const fetchToken = () => {
        const tokenString = localStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        const token = userToken?.data.access_token;
        return token;
    };

    useEffect(() => {
        const riesgoService = new RiesgoService();
        riesgoService
            .getRiesgos(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setRiesgos(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Riesgos cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Riesgos no han podido ser cargados.", life: 3000 });
            });

        riesgoService
            .getFrecuencias(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setFrecuencias(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Frecuencias cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Frecuencias no han podido ser cargadas.", life: 3000 });
            });

        riesgoService
            .getImpactos(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setImpactos(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Impactos cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Impactos no han podido ser cargados.", life: 3000 });
            });

        riesgoService
            .getExposiciones(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setExposiciones(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Exposiciones cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Exposiciones no han podido ser cargadas.", life: 3000 });
            });

        const codigoRiesgoService = new CodigoRiesgoService();
        codigoRiesgoService
            .getCodigosRiesgo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setCodigosRiesgo(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Objetivos no han podido ser cargados.", life: 3000 });
            });

        const objetivoService = new ObjetivoService();
        objetivoService
            .getObjetivos(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setObjetivos(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Objetivos no han podido ser cargados.", life: 3000 });
            });

        const categoriaRiesgoService = new CategoriaRiesgoService();
        categoriaRiesgoService
            .getCategoriasRiesgo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setCategoriasRiesgo(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipos de riesgo cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Categorias riesgo no han podido ser cargadas.", life: 3000 });
            });

        const unidadOrganizativaService = new UnidadOrganizativaService();
        unidadOrganizativaService
            .getUnidadesOrganizativas(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setunidadesOrganizativas(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Unidades organizativas no han podido ser cargadas.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setRiesgo(emptyRiesgo);
        setSubmitted(false);
        setRiesgoDlg(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRiesgoDlg(false);
    };

    const hideDeleteRiesgoDlg = () => {
        setDeleteRiesgoDlg(false);
    };

    const saveRiesgo = () => {
        const riesgoService = new RiesgoService();
        setSubmitted(true);

        if (riesgo.descripcionRiesgo.trim()) {
            //let _riesgos = [...riesgos];
            let _riesgo = { ...riesgo };
            //UPDATE
            if (riesgo.idRiesgo) {
                //const index = findIndexById(riesgo.idRiesgo);
                riesgoService
                    .saveRiesgo(_riesgo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _riesgo = { ...res.data };
                            // _riesgos[index] = { ..._riesgo };
                            // setRiesgos(_riesgos);
                            setRiesgoDlg(false);
                            setRiesgo(emptyRiesgo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Riesgo actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Riesgo no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                riesgoService
                    .saveRiesgo(_riesgo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _riesgo = { ...res.data };
                            // _riesgos.push(_riesgo);
                            // setRiesgos(_riesgos);
                            setRiesgoDlg(false);
                            setRiesgo(emptyRiesgo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "ResuRiesgoltado creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Riesgo no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editRiesgo = (riesgo) => {
        setRiesgo({ ...riesgo });
        setRiesgoDlg(true);
    };

    const confirmDeleteRiesgo = (riesgo) => {
        setRiesgo(riesgo);
        setDeleteRiesgoDlg(true);
    };

    const deleteRiesgo = () => {
        const riesgoService = new RiesgoService();
        let _riesgos = riesgos.filter((val) => val.idRiesgo !== riesgo.idRiesgo);
        riesgoService
            .deleteRiesgo(riesgo, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setRiesgos(_riesgos);
                    setDeleteRiesgoDlg(false);
                    setRiesgo(emptyRiesgo);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Riesgo borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Riesgo no ha podido ser borrado.", life: 3000 });
            });
    };

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < riesgos.length; i++) {
    //         if (riesgos[i].idRiesgo === id) {
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
        let _riesgo = { ...riesgo };
        _riesgo[`${name}`] = val;

        setRiesgo(_riesgo);
    };

    const onCodigoRiesgoChange = (e) => {
        let _riesgo = { ...riesgo };
        setRiesgo({ ..._riesgo, codigoRiesgo: { ..._riesgo.codigoRiesgo, [e.target.name]: e.target.value } });
    };

    const onCategoriaRiesgoChange = (e) => {
        let _riesgo = { ...riesgo };
        setRiesgo({ ..._riesgo, categoriaRiesgo: { ..._riesgo.categoriaRiesgo, [e.target.name]: e.target.value } });
    };

    const onObjetivoChange = (e) => {
        let _riesgo = { ...riesgo };
        setRiesgo({ ..._riesgo, objetivo: { ..._riesgo.objetivo, [e.target.name]: e.target.value } });
    };

    const onUnidadOrganizativaChange = (e) => {
        let _riesgo = { ...riesgo };
        setRiesgo({ ..._riesgo, unidadOrganizativa: { ..._riesgo.unidadOrganizativa, [e.target.name]: e.target.value } });
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editRiesgo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteRiesgo(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de riesgos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const riesgoDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveRiesgo} />
        </>
    );

    const deleteRiesgoDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteRiesgoDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteRiesgo} />
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
                        value={riesgos}
                        selection={selectedRiesgo}
                        onSelectionChange={(e) => setSelectedRiesgo(e.value)}
                        dataKey="idRiesgo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} riesgos"
                        globalFilter={globalFilter}
                        emptyMessage="No hay riesgos encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idRiesgo" header="ID" sortable></Column>
                        <Column field="descripcionRiesgo" header="Resultado" sortable></Column>
                        <Column field="codigoRiesgo.nombreCodigoRiesgo" header="Código riesgo" sortable></Column>
                        <Column field="categoriaRiesgo.nombreCategoriaRiesgo" header="Categoría riesgo" sortable></Column>
                        <Column field="objetivo.nombreObjetivo" header="Objetivo" sortable></Column>
                        <Column field="unidadOrganizativa.nombreUnidadOrganizativa" header="Unidad responsable" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={riesgoDlg} style={{ width: "450px" }} header="Detalle de riesgo" modal className="p-fluid" footer={riesgoDlgFooter} onHide={hideDialog}>
                        {/* {JSON.stringify(riesgo)} */}
                        <div className="field">
                            <label htmlFor="idObjetivo">Objetivo</label>
                            <Dropdown
                                id="idObjetivo"
                                name="idObjetivo"
                                value={riesgo.objetivo.idObjetivo}
                                onChange={onObjetivoChange}
                                options={objetivos}
                                optionLabel="nombreObjetivo"
                                optionValue="idObjetivo"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !riesgo.objetivo.idObjetivo })}
                            />
                            {submitted && !riesgo.objetivo.idObjetivo && <small className="p-invalid">Objetivo es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idCategoriaRiesgo">Categoría riesgo</label>
                            <Dropdown
                                id="idCategoriaRiesgo"
                                name="idCategoriaRiesgo"
                                value={riesgo.categoriaRiesgo.idCategoriaRiesgo}
                                onChange={onCategoriaRiesgoChange}
                                options={categoriasRiesgo}
                                optionLabel="nombreCategoriaRiesgo"
                                optionValue="idCategoriaRiesgo"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !riesgo.categoriaRiesgo.idCategoriaRiesgo })}
                            />
                            {submitted && !riesgo.categoriaRiesgo.idCategoriaRiesgo && <small className="p-invalid">Categoría riesgo es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idCodigoRiesgo">Código riesgo</label>
                            <Dropdown
                                id="idCodigoRiesgo"
                                name="idCodigoRiesgo"
                                value={riesgo.codigoRiesgo.idCodigoRiesgo}
                                onChange={onCodigoRiesgoChange}
                                options={codigosRiesgo}
                                optionLabel="nombreCodigoRiesgo"
                                optionValue="idCodigoRiesgo"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !riesgo.codigoRiesgo.idCodigoRiesgo })}
                            />
                            {submitted && !riesgo.codigoRiesgo.idCodigoRiesgo && <small className="p-invalid">Código riesgo es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idUnidadOrganizativa">Unidad organizativa</label>
                            <Dropdown
                                id="idUnidadOrganizativa"
                                name="idUnidadOrganizativa"
                                value={riesgo.unidadOrganizativa.idUnidadOrganizativa}
                                onChange={onUnidadOrganizativaChange}
                                options={unidadesOrganizativas}
                                optionLabel="nombreUnidadOrganizativa"
                                optionValue="idUnidadOrganizativa"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !riesgo.unidadOrganizativa.idUnidadOrganizativa })}
                            />
                            {submitted && !riesgo.unidadOrganizativa.idUnidadOrganizativa && <small className="p-invalid">Unidad organizativa es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idFrecuencia">Frecuencia</label>
                            <Dropdown
                                id="idFrecuencia"
                                name="idFrecuencia"
                                value={riesgo.idFrecuencia}
                                onChange={(e) => onInputChange(e, "frecuenciaDescripcion")}
                                options={frecuencias}
                                optionLabel="nombreFrecuencia"
                                optionValue="nombreFrecuencia"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !riesgo.frecuenciaDescripcion })}
                            />
                            {submitted && !riesgo.frecuenciaDescripcion && <small className="p-invalid">Frecuencia es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idImpacto">Impacto</label>
                            <Dropdown
                                id="idImpacto"
                                name="idImpacto"
                                value={riesgo.idImpacto}
                                onChange={(e) => onInputChange(e, "impactoDescripcion")}
                                options={impactos}
                                optionLabel="nombreImpacto"
                                optionValue="nombreImpacto"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !riesgo.impactoDescripcion })}
                            />
                            {submitted && !riesgo.impactoDescripcion && <small className="p-invalid">Impacto es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idExposicion">Exposición</label>
                            <Dropdown
                                id="idExposicion"
                                name="idExposicion"
                                value={riesgo.idExposicion}
                                onChange={(e) => onInputChange(e, "exposicionDescripcion")}
                                options={exposiciones}
                                optionLabel="nombreExposicion"
                                optionValue="nombreExposicion"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !riesgo.exposicionDescripcion })}
                            />
                            {submitted && !riesgo.exposicionDescripcion && <small className="p-invalid">Exposición es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcionRiesgo">Nombre</label>
                            <InputText id="descripcionRiesgo" value={riesgo.descripcionRiesgo} onChange={(e) => onInputChange(e, "descripcionRiesgo")} required className={classNames({ "p-invalid": submitted && !riesgo.descripcionRiesgo })} />
                            {submitted && !riesgo.descripcionRiesgo && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRiesgoDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteRiesgoDlgFooter} onHide={hideDeleteRiesgoDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {riesgo && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{riesgo.descripcionRiesgo}</b>?
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

export default React.memo(CrudRiesgos, comparisonFn);
