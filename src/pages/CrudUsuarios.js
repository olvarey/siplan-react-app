import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { UsuarioService } from "../service/UsuarioService";

const CrudUsuarios = () => {
    let emptyUsuario = {
        idUsuario: null,
        nombreUsuario: "",
        usuario: "",
        contrasenia: "",
        roles: [],
    };

    const [usuarios, setUsuarios] = useState(null);
    const [usuarioDlg, setUsuarioDlg] = useState(false);
    const [deleteUsuarioDlg, setDeleteUsuarioDlg] = useState(false);
    const [usuario, setUsuario] = useState(emptyUsuario);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
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
        const usuarioService = new UsuarioService();
        usuarioService
            .getUsuarios(fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setUsuarios(res.data);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Usuarios cargados con éxito", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Usuarios no han podido ser cargados.", life: 3000 });
            });

        // const rolService = new RolService();
        // rolService
        //     .getRoles(fetchToken())
        //     .then((res) => {
        //         if (res.status === 200) {
        //             setRoles(res.data);
        //             //toast.current.show({ severity: "success", summary: "Éxito", detail: "Roles cargados con éxito", life: 3000 });
        //         }
        //     })
        //     .catch((err) => {
        //         toast.current.show({ severity: "error", summary: "Falló", detail: "Roles no han podido ser cargados.", life: 3000 });
        //     });
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    // };

    const openNew = () => {
        setUsuario(emptyUsuario);
        setSubmitted(false);
        setUsuarioDlg(true);
    };

    const hideDlg = () => {
        setSubmitted(false);
        setUsuarioDlg(false);
    };

    const hideDeleteUsuarioDlg = () => {
        setDeleteUsuarioDlg(false);
    };

    const saveUsuario = () => {
        const usuarioService = new UsuarioService();
        setSubmitted(true);

        if (usuario.nombreUsuario.trim()) {
            let _usuarios = [...usuarios];
            let _usuario = { ...usuario };
            //UPDATE
            if (usuario.idUsuario) {
                const index = findIndexById(usuario.idUsuario);
                usuarioService
                    .saveUsuario(_usuario, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _usuario = { ...res.data };
                            _usuarios[index] = { ..._usuario };
                            setUsuarios(_usuarios);
                            setUsuarioDlg(false);
                            setUsuario(emptyUsuario);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Usuario actualizado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Usuario no ha podido ser actualizado.", life: 3000 });
                    });
            }
            //CREATE
            else {
                usuarioService
                    .saveUsuario(_usuario, fetchToken())
                    .then((res) => {
                        if (res.status === 200) {
                            _usuario = { ...res.data };
                            _usuarios.push(_usuario);
                            setUsuarios(_usuarios);
                            setUsuarioDlg(false);
                            setUsuario(emptyUsuario);
                            toast.current.show({ severity: "success", summary: "Éxito", detail: "Usuario creado", life: 3000 });
                        }
                    })
                    .catch((err) => {
                        toast.current.show({ severity: "error", summary: "Falló", detail: "Usuario no ha podido ser creado.", life: 3000 });
                    });
            }
        }
    };

    const editUsuario = (usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDlg(true);
    };

    const confirmDeleteUsuario = (usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDlg(true);
    };

    const deleteUsuario = () => {
        const usuarioService = new UsuarioService();
        let _usuarios = usuarios.filter((val) => val.idUsuario !== usuario.idUsuario);
        usuarioService
            .deleteUsuario(usuario, fetchToken())
            .then((res) => {
                if (res.status === 200) {
                    setUsuarios(_usuarios);
                    setDeleteUsuarioDlg(false);
                    setUsuario(emptyUsuario);
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Usuario borrado.", life: 3000 });
                }
            })
            .catch((err) => {
                toast.current.show({ severity: "error", summary: "Falló", detail: "Usuario no ha podido ser borrado.", life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].idUsuario === id) {
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
        let _usuario = { ...usuario };
        _usuario[`${name}`] = val;

        setUsuario(_usuario);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteUsuario(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administración de usuarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Búsqueda..." />
            </span>
        </div>
    );

    const usuarioDlgFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDlg} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveUsuario} />
        </>
    );

    const deleteUsuarioDlgFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsuarioDlg} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteUsuario} />
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
                        value={usuarios}
                        selection={selectedUsuario}
                        onSelectionChange={(e) => setSelectedUsuario(e.value)}
                        dataKey="idUsuario"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
                        globalFilter={globalFilter}
                        emptyMessage="No hay usuarios encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="idUsuario" header="ID" sortable></Column>
                        <Column field="nombreUsuario" header="Nombre" sortable></Column>
                        <Column field="usuario" header="Usuario" sortable></Column>
                        <Column header="Acciones" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={usuarioDlg} style={{ width: "450px" }} header="Detalle de usuario" modal className="p-fluid" footer={usuarioDlgFooter} onHide={hideDlg}>
                        <div className="field">
                            <label htmlFor="nombreUsuario">Nombre completo</label>
                            <InputText id="nombreUsuario" value={usuario.nombreUsuario} onChange={(e) => onInputChange(e, "nombreUsuario")} required autoFocus className={classNames({ "p-invalid": submitted && !usuario.nombreUsuario })} />
                            {submitted && !usuario.nombreUsuario && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="usuario">Usuario</label>
                            <InputText id="usuario" value={usuario.usuario} onChange={(e) => onInputChange(e, "usuario")} required className={classNames({ "p-invalid": submitted && !usuario.usuario })} />
                            {submitted && !usuario.usuario && <small className="p-invalid">Usuario es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="contrasenia">Contraseña</label>
                            <Password id="contrasenia" value={usuario.contrasenia} onChange={(e) => onInputChange(e, "contrasenia")} required className={classNames({ "p-invalid": submitted && !usuario.contrasenia })} feedback={false} />
                            {submitted && !usuario.contrasenia && <small className="p-invalid">Contraseña es requerida.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuarioDlg} style={{ width: "450px" }} header="Confirm" modal footer={deleteUsuarioDlgFooter} onHide={hideDeleteUsuarioDlg}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {usuario && (
                                <span>
                                    ¿Está seguro de eliminar el siguiente registro? <b>{usuario.nombreUsuario}</b>?
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

export default React.memo(CrudUsuarios, comparisonFn);
