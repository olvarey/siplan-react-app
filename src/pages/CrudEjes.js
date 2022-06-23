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
import { EjeService } from "../service/EjeService";
import { ObjetivoService } from "../service/ObjetivoService";

const CrudEjes = () => {
    let emptyEje = {
        idEje: null,
        nombreEje: "",
        descripcionEje: "",
        objetivo: {
            idObjetivo: null,
        },
    };

    const [ejes, setEjes] = useState(null);
    const [showItemDlg, setShowItemDlg] = useState(false);
    const [deleteItemDlg, setDeleteItemDlg] = useState(false);
    const [eje, setEje] = useState(emptyEje);
    const [selectedEje, setSelectedEje] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    //Catalogs
    const [objetivos, setObjetivos] = useState(null);

    const toast = useRef(null);
    const dt = useRef(null);

    const fetchToken = () => {
        const tokenString = localStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        const token = userToken?.data.access_token;
        return token;
    };

    useEffect(() => {
        const ejeService = new EjeService();
        ejeService
            .getEjes(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setEjes(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Ejes cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Ejes no han podido ser cargados.", life: 3000 });
            });

        const objetivoService = new ObjetivoService();
        objetivoService
            .getObjetivos(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setObjetivos(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Organizaciones cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Objetivos no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setEje(emptyEje);
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

    const saveEje = () => {
        const ejeService = new EjeService();
        setSubmitted(true);

        if (eje.nombreEje.trim()) {
            //let _ejes = [...ejes];
            let _eje = { ...eje };
            //UPDATE
            if (eje.idEje) {
                //const index = findIndexById(eje.idEje);
                ejeService
                    .saveEje(_eje, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _eje = { ...res.data };
                            // _ejes[index] = { ..._eje };
                            // setEjes(_ejes);
                            setShowItemDlg(false);
                            setEje(emptyEje);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Eje actualizado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Eje no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                ejeService
                    .saveEje(_eje, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _eje = { ...res.data };
                            // console.log(_eje);
                            // _ejes.push(_eje);
                            // setEjes(_ejes);
                            setShowItemDlg(false);
                            setEje(emptyEje);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Eje creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Eje no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editEje = (eje) => {
        setEje({ ...eje });
        setShowItemDlg(true);
    };

    const confirmDeleteEje = (eje) => {
        setEje(eje);
        setDeleteItemDlg(true);
    };

    const deleteEje = () => {
        const ejeService = new EjeService();
        let _ejes = ejes.filter((val) => val.idEje !== eje.idEje);
        ejeService
            .deleteEje(eje, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setEjes(_ejes);
                    setDeleteItemDlg(false);
                    setEje(emptyEje);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Eje borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Eje no ha podido ser borrado.", life: 3000 });
            });
    };

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < ejes.length; i++) {
    //         if (ejes[i].idEje === id) {
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
        let _eje = { ...eje };
        _eje[`${name}`] = val;

        setEje(_eje);
    };

    const onEjeChange = (e) => {
        let _eje = { ...eje };
        setEje({ ..._eje, objetivo: { ..._eje.objetivo, [e.target.name]: e.target.value } });
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editEje(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteEje(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de ejes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const ejeDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveEje} />
        </>
    );

    const deleteEjeDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteEje} />
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
                        value={ejes}
                        selection={selectedEje}
                        onSelectionChange={(e) => setSelectedEje(e.value)}
                        dataKey="idEje"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ejes"
                        globalFilter={globalFilter}
                        emptyMessage="No hay ejes encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idEje" header="ID" sortable></Column>
                        <Column field="nombreEje" header="Eje" sortable></Column>
                        <Column field="objetivo.nombreObjetivo" header="Objetivo" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={showItemDlg} style={{ width: "450px" }} header="Detalle de eje" modal className="p-fluid" footer={ejeDlgFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="idObjetivo">Objetivo</label>
                            <Dropdown
                                id="idObjetivo"
                                name="idObjetivo"
                                value={eje.objetivo.idObjetivo}
                                onChange={onEjeChange}
                                options={objetivos}
                                optionLabel="nombreObjetivo"
                                optionValue="idObjetivo"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !eje.objetivo.idObjetivo })}
                            />
                            {submitted && !eje.objetivo.idObjetivo && <small className="p-invalid">Eje es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombreEje">Nombre</label>
                            <InputText id="nombreEje" value={eje.nombreEje} onChange={(e) => onInputChange(e, "nombreEje")} required className={classNames({ "p-invalid": submitted && !eje.nombreEje })} />
                            {submitted && !eje.nombreEje && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteEjeDlgFooter} onHide={hideDeleteDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {eje && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{eje.nombreEje}</b>?
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

export default React.memo(CrudEjes, comparisonFn);
