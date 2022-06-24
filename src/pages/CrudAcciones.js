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
import { ResultadoService } from "../service/ResultadoService";
import { EjeService } from "../service/EjeService";
import { IndicadorService } from "../service/IndicadorService";
import { AnioService } from "../service/AnioService";

const CrudAcciones = () => {
    let emptyAccion = {
        idAccion: null,
        nombreAccion: "",
        descripcionAccion: "",
        presupuestoAsignadoAccion: 0.00,
        nombreResponsableAccion: "",
        numeroAccionesAnualesAccion: 0,
        observacion: "",
        eje: {
            idEje: null,
        },
        indicador: {
            idIndicador: null,
        },
        anio: {
            idAnio: null,
        },
    };

    const [resultados, setResultados] = useState(null);
    const [ejes, setEjes] = useState(null);
    const [indicadores, setIndicadores] = useState(null);
    const [anios, setAnios] = useState(null);
    const [resultadoDlg, setResultadoDlg] = useState(false);
    const [deleteResultadoDlg, setDeleteResultadoDlg] = useState(false);
    const [resultado, setResultado] = useState(emptyAccion);
    const [selectedResultado, setSelectedResultado] = useState(null);
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
        const resultadoService = new ResultadoService();
        resultadoService
            .getResultados(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setResultados(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Resultados cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Resultados no han podido ser cargados.", life: 3000 });
            });

        const ejeService = new EjeService();
        ejeService
            .getEjes(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setEjes(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Tipos de resultado cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Ejes no han podido ser cargados.", life: 3000 });
            });

        const indicadorService = new IndicadorService();
        indicadorService
            .getIndicadores(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setIndicadores(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Indicadores no han podido ser cargados.", life: 3000 });
            });

        const anioService = new AnioService();
        anioService
            .getAnios(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setAnios(res.data);
                    //toast.current.show({ severity: "success", summary: "Éxito", detail: "Unidades de medida cargadas con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Años no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setResultado(emptyAccion);
        setSubmitted(false);
        setResultadoDlg(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setResultadoDlg(false);
    };

    const hideDeleteResultadoDialog = () => {
        setDeleteResultadoDlg(false);
    };

    const saveResultado = () => {
        const resultadoService = new ResultadoService();
        setSubmitted(true);

        if (resultado.nombreAccion.trim()) {
            //let _resultados = [...resultados];
            let _resultado = { ...resultado };
            //UPDATE
            if (resultado.idAccion) {
                //const index = findIndexById(resultado.idAccion);
                resultadoService
                    .saveResultado(_resultado, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _resultado = { ...res.data };
                            // _resultados[index] = { ..._resultado };
                            // setResultados(_resultados);
                            setResultadoDlg(false);
                            setResultado(emptyAccion);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Resultado actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Resultado no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                resultadoService
                    .saveResultado(_resultado, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // _resultado = { ...res.data };
                            // _resultados.push(_resultado);
                            // setResultados(_resultados);
                            setResultadoDlg(false);
                            setResultado(emptyAccion);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Resultado creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Resultado no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editResultado = (resultado) => {
        setResultado({ ...resultado });
        setResultadoDlg(true);
    };

    const confirmDeleteResultado = (resultado) => {
        setResultado(resultado);
        setDeleteResultadoDlg(true);
    };

    const deleteResultado = () => {
        const resultadoService = new ResultadoService();
        let _resultados = resultados.filter((val) => val.idAccion !== resultado.idAccion);
        resultadoService
            .deleteResultado(resultado, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setResultados(_resultados);
                    setDeleteResultadoDlg(false);
                    setResultado(emptyAccion);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Resultado borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Resultado no ha podido ser borrado.", life: 3000 });
            });
    };

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < resultados.length; i++) {
    //         if (resultados[i].idAccion === id) {
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
        let _resultado = { ...resultado };
        _resultado[`${name}`] = val;

        setResultado(_resultado);
    };

    const onEjeChange = (e) => {
        let _resultado = { ...resultado };
        setResultado({ ..._resultado, eje: { ..._resultado.eje, [e.target.name]: e.target.value } });
    };

    const onIndicadorChange = (e) => {
        let _resultado = { ...resultado };
        setResultado({ ..._resultado, indicador: { ..._resultado.indicador, [e.target.name]: e.target.value } });
    };

    const onAnioChange = (e) => {
        let _resultado = { ...resultado };
        setResultado({ ..._resultado, anio: { ..._resultado.anio, [e.target.name]: e.target.value } });
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editResultado(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteResultado(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de resultados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const resultadoDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveResultado} />
        </>
    );

    const deleteResultadoDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteResultadoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteResultado} />
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
                        value={resultados}
                        selection={selectedResultado}
                        onSelectionChange={(e) => setSelectedResultado(e.value)}
                        dataKey="idAccion"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} resultados"
                        globalFilter={globalFilter}
                        emptyMessage="No hay resultados encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idAccion" header="ID" sortable></Column>
                        <Column field="nombreAccion" header="Resultado" sortable></Column>
                        <Column field="eje.nombreEje" header="Eje" sortable></Column>
                        <Column field="indicador.nombreIndicador" header="Indicador" sortable></Column>
                        <Column field="anio.valorAnio" header="Año" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={resultadoDlg} style={{ width: "450px" }} header="Detalle de resultado" modal className="p-fluid" footer={resultadoDlgFooter} onHide={hideDialog}>
                        {/* {JSON.stringify(resultado)} */}
                        <div className="field">
                            <label htmlFor="idEje">Eje</label>
                            <Dropdown
                                id="idEje"
                                name="idEje"
                                value={resultado.eje.idEje}
                                onChange={onEjeChange}
                                options={ejes}
                                optionLabel="nombreEje"
                                optionValue="idEje"
                                placeholder="Selecccione una opción"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !resultado.eje.idEje })}
                            />
                            {submitted && !resultado.eje.idEje && <small className="p-invalid">Eje es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idIndicador">Indicador</label>
                            <Dropdown
                                id="idIndicador"
                                name="idIndicador"
                                value={resultado.indicador.idIndicador}
                                onChange={onIndicadorChange}
                                options={indicadores}
                                optionLabel="nombreIndicador"
                                optionValue="idIndicador"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !resultado.indicador.idIndicador })}
                            />
                            {submitted && !resultado.indicador.idIndicador && <small className="p-invalid">Indicador es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="idAnio">Año</label>
                            <Dropdown
                                id="idAnio"
                                name="idAnio"
                                value={resultado.anio.idAnio}
                                onChange={onAnioChange}
                                options={anios}
                                optionLabel="valorAnio"
                                optionValue="idAnio"
                                placeholder="Selecccione una opción"
                                required
                                className={classNames({ "p-invalid": submitted && !resultado.anio.idAnio })}
                            />
                            {submitted && !resultado.anio.idAnio && <small className="p-invalid">Año es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombreAccion">Nombre</label>
                            <InputText id="nombreAccion" value={resultado.nombreAccion} onChange={(e) => onInputChange(e, "nombreAccion")} required autoFocus className={classNames({ "p-invalid": submitted && !resultado.nombreAccion })} />
                            {submitted && !resultado.nombreAccion && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteResultadoDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteResultadoDlgFooter} onHide={hideDeleteResultadoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {resultado && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{resultado.nombreAccion}</b>?
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

export default React.memo(CrudAcciones, comparisonFn);
