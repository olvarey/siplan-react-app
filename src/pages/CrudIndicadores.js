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
import { IndicadorService } from "../service/IndicadorService";
import { TipoIndicadorService } from "../service/TipoIndicadorService";
import { UnidadMedidaService } from "../service/UnidadMedidaService";

const CrudIndicadores = () => {
    let emptyIndicador = {
        idIndicador: null,
        nombreIndicador: "",
        tipoIndicador: {
            idTipoIndicador: null,
        },
        unidadMedida: {
            idUnidadMedida: null,
        },
    };

    const [indicadores, setIndicadores] = useState(null);
    const [tiposIndicador, setTiposIndicador] = useState(null);
    const [unidadesMedida, setUnidadesMedida] = useState(null);
    const [indicadorDialog, setIndicadorDialog] = useState(false);
    const [deleteIndicadorDialog, setDeleteIndicadorDialog] = useState(false);
    const [indicador, setIndicador] = useState(emptyIndicador);
    const [selectedIndicador, setSelectedIndicador] = useState(null);
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
        const indicadorService = new IndicadorService();
        indicadorService
            .getIndicadores(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setIndicadores(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Indicadores cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Indicadores no han podido ser cargados.", life: 3000 });
            });

        const tipoIndicadorService = new TipoIndicadorService();
        tipoIndicadorService
            .getTiposIndicador(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setTiposIndicador(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipos de indicador cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Tipos de indicador no han podido ser cargados.", life: 3000 });
            });

        const unidadMedidaService = new UnidadMedidaService();
        unidadMedidaService
            .getUnidadesMedida(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setUnidadesMedida(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
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
        setIndicador(emptyIndicador);
        setSubmitted(false);
        setIndicadorDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setIndicadorDialog(false);
    };

    const hideDeleteIndicadorDialog = () => {
        setDeleteIndicadorDialog(false);
    };

    const saveIndicador = () => {
        const indicadorService = new IndicadorService();
        setSubmitted(true);

        if (indicador.nombreIndicador.trim()) {
            let _indicadores = [...indicadores];
            let _indicador = { ...indicador };
            //UPDATE
            if (indicador.idIndicador) {
                const index = findIndexById(indicador.idIndicador);
                indicadorService
                    .saveIndicador(_indicador, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _indicador = { ...res.data };
                            // _indicadores[index] = { ..._indicador };
                            // setIndicadores(_indicadores);
                            setIndicadorDialog(false);
                            setIndicador(emptyIndicador);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Indicador actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Indicador no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                indicadorService
                    .saveIndicador(_indicador, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _indicador = { ...res.data };
                            // _indicadores.push(_indicador);
                            // setIndicadores(_indicadores);
                            setIndicadorDialog(false);
                            setIndicador(emptyIndicador);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Indicador creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Indicador no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editIndicador = (indicador) => {
        setIndicador({ ...indicador });
        setIndicadorDialog(true);
    };

    const confirmDeleteIndicador = (indicador) => {
        setIndicador(indicador);
        setDeleteIndicadorDialog(true);
    };

    const deleteIndicador = () => {
        const indicadorService = new IndicadorService();
        let _indicadores = indicadores.filter((val) => val.idIndicador !== indicador.idIndicador);
        indicadorService
            .deleteIndicador(indicador, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setIndicadores(_indicadores);
                    setDeleteIndicadorDialog(false);
                    setIndicador(emptyIndicador);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Indicador borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Indicador no ha podido ser borrado.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < indicadores.length; i++) {
            if (indicadores[i].idIndicador === id) {
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
        let _indicador = { ...indicador };
        _indicador[`${name}`] = val;

        setIndicador(_indicador);
    };

    const onTipoIndicadorChange = (e) => {
        let _indicador = { ...indicador };
        setIndicador({ ..._indicador, tipoIndicador: { ..._indicador.tipoIndicador, [e.target.name]: e.target.value } });
    };

    const onUnidadMedidaChange = (e) => {
        let _indicador = { ...indicador };
        setIndicador({ ..._indicador, unidadMedida: { ..._indicador.unidadMedida, [e.target.name]: e.target.value } });
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editIndicador(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteIndicador(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de indicadores</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const indicadorDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveIndicador} />
        </>
    );

    const deleteIndicadorDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteIndicadorDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteIndicador} />
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
                        value={indicadores}
                        selection={selectedIndicador}
                        onSelectionChange={(e) => setSelectedIndicador(e.value)}
                        dataKey="idIndicador"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} indicadores"
                        globalFilter={globalFilter}
                        emptyMessage="No hay indicadores encontradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idIndicador" header="ID" sortable></Column>
                        <Column field="nombreIndicador" header="Nombre" sortable></Column>
                        <Column field="tipoIndicador.nombreIndicador" header="Tipo indicador" sortable></Column>
                        <Column field="unidadMedida.nombreUnidadMedida" header="Unidad de medida" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={indicadorDialog} style={{ width: "450px" }} header="Detalle de indicador" modal className="p-fluid" footer={indicadorDialogFooter} onHide={hideDialog}>
                        {/* {JSON.stringify(indicador)} */}
                        <div className="field">
                            <label htmlFor="nombreIndicador">Nombre</label>
                            <InputText id="nombreIndicador" value={indicador.nombreIndicador} onChange={(e) => onInputChange(e, "nombreIndicador")} required autoFocus className={classNames({ "p-invalid": submitted && !indicador.nombreIndicador })} />
                            {submitted && !indicador.nombreIndicador && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idTipoIndicador">Tipo indicador</label>
                            <Dropdown
                                id="idTipoIndicador"
                                name="idTipoIndicador"
                                value={indicador.tipoIndicador.idTipoIndicador}
                                onChange={onTipoIndicadorChange}
                                options={tiposIndicador}
                                optionLabel="nombreIndicador"
                                optionValue="idTipoIndicador"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !indicador.tipoIndicador.idTipoIndicador })}
                            />
                            {submitted && !indicador.tipoIndicador.idTipoIndicador && <small className="p-invalid">Indicador es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idUnidadMedida">Unidad de medida</label>
                            <Dropdown
                                id="idUnidadMedida"
                                name="idUnidadMedida"
                                value={indicador.unidadMedida.idUnidadMedida}
                                onChange={onUnidadMedidaChange}
                                options={unidadesMedida}
                                optionLabel="nombreUnidadMedida"
                                optionValue="idUnidadMedida"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !indicador.unidadMedida.idUnidadMedida })}
                            />
                            {submitted && !indicador.unidadMedida.idUnidadMedida && <small className="p-invalid">Unidad de medida es requerida.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteIndicadorDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteIndicadorDialogFooter} onHide={hideDeleteIndicadorDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {indicador && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{indicador.nombreIndicador}</b>?
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

export default React.memo(CrudIndicadores, comparisonFn);
