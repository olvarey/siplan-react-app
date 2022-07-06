import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { CategoriaRiesgoService } from "../service/CategoriaRiesgoService";

const CrudCategoriaRiesgo = () => {
    let emptyCategoriaRiesgo = {
        idCategoriaRiesgo: null,
        nombreCategoriaRiesgo: "",
    };

    const [categoriasRiesgo, setCategoriasRiesgo] = useState(null);
    const [categoriaRiesgoDlg, setCategoriaRiesgoDlg] = useState(false);
    const [deleteCategoriaRiesgoDlg, setDeleteCategoriaRiesgoDlg] = useState(false);
    const [categoriaRiesgo, setCategoriaRiesgo] = useState(emptyCategoriaRiesgo);
    const [selectedCategoriaRiesgo, setSelectedCategoriaRiesgo] = useState(null);
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
        const categoriaRiesgoService = new CategoriaRiesgoService();
        categoriaRiesgoService
            .getCategoriasRiesgo(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setCategoriasRiesgo(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Categoría riesgo cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Categoría riesgo no han podido ser cargados.", life: 3000 });
            });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setCategoriaRiesgo(emptyCategoriaRiesgo);
        setSubmitted(false);
        setCategoriaRiesgoDlg(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoriaRiesgoDlg(false);
    };

    const hideDeleteCategoriaRiesgoDlg = () => {
        setDeleteCategoriaRiesgoDlg(false);
    };

    const saveCategoriaRiesgo = () => {
        const categoriaRiesgoService = new CategoriaRiesgoService();
        setSubmitted(true);

        if (categoriaRiesgo.nombreCategoriaRiesgo.trim()) {
            let _categorias_riesgo = [...categoriasRiesgo];
            let _categoria_riesgo = { ...categoriaRiesgo };
            //UPDATE
            if (categoriaRiesgo.idCategoriaRiesgo) {
                const index = findIndexById(categoriaRiesgo.idCategoriaRiesgo);
                categoriaRiesgoService
                    .saveCategoriaRiesgo(_categoria_riesgo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _categoria_riesgo = { ...res.data };
                            _categorias_riesgo[index] = { ..._categoria_riesgo };
                            setCategoriasRiesgo(_categorias_riesgo);
                            setCategoriaRiesgoDlg(false);
                            setCategoriaRiesgo(emptyCategoriaRiesgo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Categoria riesgo actualizado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Categoria riesgo no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                categoriaRiesgoService
                    .saveCategoriaRiesgo(_categoria_riesgo, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _categoria_riesgo = { ...res.data };
                            _categorias_riesgo.push(_categoria_riesgo);
                            setCategoriasRiesgo(_categorias_riesgo);
                            setCategoriaRiesgoDlg(false);
                            setCategoriaRiesgo(emptyCategoriaRiesgo);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Categoria riesgo creado.", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Categoria riesgo no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editCategoriaRiesgo = (categoriaRiesgo) => {
        setCategoriaRiesgo({ ...categoriaRiesgo });
        setCategoriaRiesgoDlg(true);
    };

    const confirmDeleteCategoriaRiesgo = (categoriaRiesgo) => {
        setCategoriaRiesgo(categoriaRiesgo);
        setDeleteCategoriaRiesgoDlg(true);
    };

    const deleteCategoriaRiesgo = () => {
        const categoriaRiesgoService = new CategoriaRiesgoService();
        let _categorias_riesgo = categoriasRiesgo.filter((val) => val.idCategoriaRiesgo !== categoriaRiesgo.idCategoriaRiesgo);
        categoriaRiesgoService
            .deleteCategoriaRiesgo(categoriaRiesgo, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setCategoriasRiesgo(_categorias_riesgo);
                    setDeleteCategoriaRiesgoDlg(false);
                    setCategoriaRiesgo(emptyCategoriaRiesgo);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Categoria riesgo borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Categoria riesgo no ha podido ser borrado.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < categoriasRiesgo.length; i++) {
            if (categoriasRiesgo[i].idCategoriaRiesgo === id) {
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
        let _categoria_riesgo = { ...categoriaRiesgo };
        _categoria_riesgo[`${name}`] = val;

        setCategoriaRiesgo(_categoria_riesgo);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCategoriaRiesgo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteCategoriaRiesgo(rowData)} />
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

    const categoriaRiesgoDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveCategoriaRiesgo} />
        </>
    );

    const deleteCategoriaRiesgoDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoriaRiesgoDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteCategoriaRiesgo} />
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
                        value={categoriasRiesgo}
                        selection={selectedCategoriaRiesgo}
                        onSelectionChange={(e) => setSelectedCategoriaRiesgo(e.value)}
                        dataKey="idCategoriaRiesgo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías de riesgo"
                        globalFilter={globalFilter}
                        emptyMessage="No hay categorías de riesgo encontradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idCategoriaRiesgo" header="ID" sortable></Column>
                        <Column field="nombreCategoriaRiesgo" header="Categoría riesgo" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={categoriaRiesgoDlg} style={{ width: "450px" }} header="Detalle categoría de riesgo" modal className="p-fluid" footer={categoriaRiesgoDlgFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombreCategoriaRiesgo">Nombre</label>
                            <InputText id="nombreCategoriaRiesgo" value={categoriaRiesgo.nombreCategoriaRiesgo} onChange={(e) => onInputChange(e, "nombreCategoriaRiesgo")} required autoFocus className={classNames({ "p-invalid": submitted && !categoriaRiesgo.nombreCategoriaRiesgo })} />
                            {submitted && !categoriaRiesgo.nombreCategoriaRiesgo && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCategoriaRiesgoDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteCategoriaRiesgoDlgFooter} onHide={hideDeleteCategoriaRiesgoDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {categoriaRiesgo && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{categoriaRiesgo.nombreCategoriaRiesgo}</b>?
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

export default React.memo(CrudCategoriaRiesgo, comparisonFn);
