import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { MesService } from "../service/MesService";

const CrudMeses = () => {
    let emptyMes = {
        idMes: null,
        nombreMes: "",
    };

    const [meses, setMeses] = useState(null);
    const [mesDlg, setMesDlg] = useState(false);
    const [deleteMesDlg, setDeleteMesDlg] = useState(false);
    const [mes, setMes] = useState(emptyMes);
    const [selectedMes, setSelectedMes] = useState(null);
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
        const mesService = new MesService();
        mesService
            .getMeses(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setMeses(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Meses cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Meses no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setMes(emptyMes);
        setSubmitted(false);
        setMesDlg(true);
    };

    const hideDlg = () => {
        setSubmitted(false);
        setMesDlg(false);
    };

    const hideDeleteMesDlg = () => {
        setDeleteMesDlg(false);
    };

    const saveMes = () => {
        const mesService = new MesService();
        setSubmitted(true);

        if (mes.nombreMes.trim()) {
            let _meses = [...meses];
            let _mes = { ...mes };
            //UPDATE
            if (mes.idMes) {
                const index = findIndexById(mes.idMes);
                mesService
                    .saveMes(_mes, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _mes = { ...res.data };
                            _meses[index] = { ..._mes };
                            setMeses(_meses);
                            setMesDlg(false);
                            setMes(emptyMes);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Mes actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Mes no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                mesService
                    .saveMes(_mes, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _mes = { ...res.data };
                            _meses.push(_mes);
                            setMeses(_meses);
                            setMesDlg(false);
                            setMes(emptyMes);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Mes creado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Mes no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editMes = (mes) => {
        setMes({ ...mes });
        setMesDlg(true);
    };

    const confirmDeleteMes = (mes) => {
        setMes(mes);
        setDeleteMesDlg(true);
    };

    const deleteMes = () => {
        const mesService = new MesService();
        let _meses = meses.filter((val) => val.idMes !== mes.idMes);
        mesService
            .deleteMes(mes, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setMeses(_meses);
                    setDeleteMesDlg(false);
                    setMes(emptyMes);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Mes borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Mes no ha podido ser borrado.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < meses.length; i++) {
            if (meses[i].idMes === id) {
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
        let _mes = { ...mes };
        _mes[`${name}`] = val;

        setMes(_mes);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editMes(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteMes(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de meses</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const mesDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDlg} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveMes} />
        </>
    );

    const deleteMesDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMesDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteMes} />
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
                        value={meses}
                        selection={selectedMes}
                        onSelectionChange={(e) => setSelectedMes(e.value)}
                        dataKey="idMes"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} meses"
                        globalFilter={globalFilter}
                        emptyMessage="No hay meses encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idMes" header="ID" sortable></Column>
                        <Column field="nombreMes" header="Mes" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={mesDlg} style={{ width: "450px" }} header="Detalle de mes" modal className="p-fluid" footer={mesDlgFooter} onHide={hideDlg}>
                        <div className="field">
                            <label htmlFor="nombreMes">Nombre</label>
                            <InputText id="nombreMes" value={mes.nombreMes} onChange={(e) => onInputChange(e, "nombreMes")} required autoFocus className={classNames({ "p-invalid": submitted && !mes.nombreMes })} />
                            {submitted && !mes.nombreMes && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMesDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteMesDlgFooter} onHide={hideDeleteMesDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {mes && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{mes.nombreMes}</b>?
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

export default React.memo(CrudMeses, comparisonFn);
