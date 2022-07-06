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
import { EstrategiaRiesgoService } from "../service/EstrategiaRiesgoService";
import { RiesgoService } from "../service/RiesgoService";

const CrudEstrategiasRiesgo = () => {
    let emptyEstrategiaRiesgo = {
        idEstrategiaRiesgo: null,
        nombreEstrategiaRiesgo: "",
        riesgo: {
            idRiesgo: null,
        },
    };

    const [estrategiasRiesgo, setEstrategiasRiesgo] = useState(null);
    const [showItemDlg, setShowItemDlg] = useState(false);
    const [deleteItemDlg, setDeleteItemDlg] = useState(false);
    const [estrategiaRiesgo, setEstrategiaRiesgo] = useState(emptyEstrategiaRiesgo);
    const [selectedEstrategiaRiesgo, setSelectedEstrategiaRiesgo] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    //Catalogs
    const [riesgos, setRiesgos] = useState(null);

    const toast = useRef(null);
    const dt = useRef(null);

    const fetchToken = () => {
        const tokenString = localStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        const token = userToken?.data.access_token;
        return token;
    };

    useEffect(() => {
        const estrategiaRiesgoService = new EstrategiaRiesgoService();
        estrategiaRiesgoService
            .getEstrategiasRiesgo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setEstrategiasRiesgo(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Estratégia riesgos cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Estratégia riesgos no han podido ser cargadas.", life: 3000 });
            });

        const riesgoService = new RiesgoService();
        riesgoService
            .getRiesgos(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setRiesgos(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Organizaciones cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Riesgos no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setEstrategiaRiesgo(emptyEstrategiaRiesgo);
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

    const saveEstrategiaRiesgo = () => {
        const estrategiaRiesgoService = new EstrategiaRiesgoService();
        setSubmitted(true);

        if (estrategiaRiesgo.nombreEstrategiaRiesgo.trim()) {
            //let _ejes = [...estrategiasRiesgo];
            let _estrategia_riesgo = { ...estrategiaRiesgo };
            //UPDATE
            if (estrategiaRiesgo.idEstrategiaRiesgo) {
                //const index = findIndexById(estrategiaRiesgo.idEstrategiaRiesgo);
                estrategiaRiesgoService
                    .saveEstrategiaRiesgo(_estrategia_riesgo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _estrategia_riesgo = { ...res.data };
                            // _ejes[index] = { ..._estrategia_riesgo };
                            // setEstrategiasRiesgo(_ejes);
                            setShowItemDlg(false);
                            setEstrategiaRiesgo(emptyEstrategiaRiesgo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Estratégia riesgo actualizada.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Estratégia riesgo no ha podido ser actualizada.", life: 3000 });
                    });
            }
            //CREATE
            else {
                estrategiaRiesgoService
                    .saveEstrategiaRiesgo(_estrategia_riesgo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _estrategia_riesgo = { ...res.data };
                            // console.log(_estrategia_riesgo);
                            // _ejes.push(_estrategia_riesgo);
                            // setEstrategiasRiesgo(_ejes);
                            setShowItemDlg(false);
                            setEstrategiaRiesgo(emptyEstrategiaRiesgo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Estratégia riesgo creada.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Estratégia riesgo no ha podido ser creada.", life: 3000 });
                    });
            }
        }
    };

    const editEstrategiaRiesgo = (estrategiaRiesgo) => {
        setEstrategiaRiesgo({ ...estrategiaRiesgo });
        setShowItemDlg(true);
    };

    const confirmDeleteEstrategiaRiesgo = (estrategiaRiesgo) => {
        setEstrategiaRiesgo(estrategiaRiesgo);
        setDeleteItemDlg(true);
    };

    const deleteEstrategiaRiesgo = () => {
        const estrategiaRiesgoService = new EstrategiaRiesgoService();
        let _ejes = estrategiasRiesgo.filter((val) => val.idEstrategiaRiesgo !== estrategiaRiesgo.idEstrategiaRiesgo);
        estrategiaRiesgoService
            .deleteEstrategiaRiesgo(estrategiaRiesgo, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setEstrategiasRiesgo(_ejes);
                    setDeleteItemDlg(false);
                    setEstrategiaRiesgo(emptyEstrategiaRiesgo);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Estratégia riesgo borrada.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Estratégia riesgo no ha podido ser borrada.", life: 3000 });
            });
    };

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < estrategiasRiesgo.length; i++) {
    //         if (estrategiasRiesgo[i].idEstrategiaRiesgo === id) {
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
        let _estrategia_riesgo = { ...estrategiaRiesgo };
        _estrategia_riesgo[`${name}`] = val;

        setEstrategiaRiesgo(_estrategia_riesgo);
    };

    const onRiesgoChange = (e) => {
        let _estrategia_riesgo = { ...estrategiaRiesgo };
        setEstrategiaRiesgo({ ..._estrategia_riesgo, riesgo: { ..._estrategia_riesgo.riesgo, [e.target.name]: e.target.value } });
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editEstrategiaRiesgo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteEstrategiaRiesgo(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de estrategias riesgo</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const estrategiaRiesgoDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveEstrategiaRiesgo} />
        </>
    );

    const deleteEstrategiaRiesgoDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteEstrategiaRiesgo} />
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
                        value={estrategiasRiesgo}
                        selection={selectedEstrategiaRiesgo}
                        onSelectionChange={(e) => setSelectedEstrategiaRiesgo(e.value)}
                        dataKey="idEstrategiaRiesgo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} estrategias riesgo"
                        globalFilter={globalFilter}
                        emptyMessage="No hay estrategias riesgo encontradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idEstrategiaRiesgo" header="ID" sortable></Column>
                        <Column field="nombreEstrategiaRiesgo" header="Estratégia riesgo" sortable></Column>
                        <Column field="riesgo.descripcionRiesgo" header="Riesgo" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={showItemDlg} style={{ width: "450px" }} header="Detalle de estrategia riesgo" modal className="p-fluid" footer={estrategiaRiesgoDlgFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="idRiesgo">Riesgo</label>
                            <Dropdown
                                id="idRiesgo"
                                name="idRiesgo"
                                value={estrategiaRiesgo.riesgo.idRiesgo}
                                onChange={onRiesgoChange}
                                options={riesgos}
                                optionLabel="descripcionRiesgo"
                                optionValue="idRiesgo"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !estrategiaRiesgo.riesgo.idRiesgo })}
                            />
                            {submitted && !estrategiaRiesgo.riesgo.idRiesgo && <small className="p-invalid">Riesgo es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombreEstrategiaRiesgo">Nombre</label>
                            <InputText id="nombreEstrategiaRiesgo" value={estrategiaRiesgo.nombreEstrategiaRiesgo} onChange={(e) => onInputChange(e, "nombreEstrategiaRiesgo")} required className={classNames({ "p-invalid": submitted && !estrategiaRiesgo.nombreEstrategiaRiesgo })} />
                            {submitted && !estrategiaRiesgo.nombreEstrategiaRiesgo && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteEstrategiaRiesgoDlgFooter} onHide={hideDeleteDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {estrategiaRiesgo && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{estrategiaRiesgo.nombreEstrategiaRiesgo}</b>?
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

export default React.memo(CrudEstrategiasRiesgo, comparisonFn);
