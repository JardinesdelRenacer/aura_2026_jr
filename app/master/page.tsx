"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// Se importan ubicaciones para el formulario de creación de sedes
import { ubicaciones } from "@/src/data/ubicaciones";
import { PantallaEscalada } from "./components/PantallaEscalada";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { DashboardTab } from "./components/DashboardTab";
import { SalasTab } from "./components/SalasTab";
import { UsuariosTab } from "./components/UsuariosTab";
import { ModalsManager } from "./components/ModalsManager";
import { ReportesTab } from "./components/ReportesTab";
import { TrasladosTab } from "./components/TrasladosTab";
import { ConfiguracionTab } from "./components/ConfiguracionTab";
import EditSedeForm from "./components/EditSedeForm";

import AdministrarPantallasModal from "./components/AdministrarPantallasModal";
import DetallePantallaModal from "./components/DetallePantallaModal";



export default function MasterDashboard() {
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [expandedSede, setExpandedSede] = useState<any>(null);

    // se agrega constantes para crear el administrador
    const [showModalAdmin, setShowModalAdmin] = useState(false);
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [cedula, setCedula] = useState("");
    const [telefono, setTelefono] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [nombreSede, setNombreSede] = useState("");

    // Estados para Gestión de Sedes
    const [sedes, setSedes] = useState<any[]>([]);

    const [showModalSede, setShowModalSede] = useState(false);
    const [nuevaSedeNombre, setNuevaSedeNombre] = useState("");
    const [nuevaSedeDepartamento, setNuevaSedeDepartamento] = useState("");
    const [nuevaSedeCiudad, setNuevaSedeCiudad] = useState("");
    const [nuevaSedeAdminId, setNuevaSedeAdminId] = useState("");
    const [nuevaSedeNumeroSalas, setNuevaSedeNumeroSalas] = useState("1");
    const [nuevaSedeVip, setNuevaSedeVip] = useState(false);
    const [sedeToEdit, setSedeToEdit] = useState<any | null>(null);

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        const enviarHeartbeat = async () => {
            try {
                await fetch("/api/auth/heartbeat", {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify({
                        userId: user.id,
                    }),
                });
            } catch (error) {
                console.error("Heartbeat usuario: ", error);
            }
        };

        enviarHeartbeat();

        const interval = setInterval(enviarHeartbeat, 5000);

        return () => clearInterval(interval);
    }, [user]);

    // Estado para confirmación de eliminación de usuario
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    // Estados nuevos para edición y suspensión
    const [userToEdit, setUserToEdit] = useState<any>(null);
    const [userToSuspend, setUserToSuspend] = useState<string | null>(null);

    //Nuevo modelo de AdministrarPantalla, se creo con el fin de una administración mas completa. la constante de abajo es del modelo antiguo(no se borra mientras se termina el modelo nuevo)
    const [administrarPantallasId, setAdministrarPantallasId] = useState<string | null>(null);

    //Nuevo modelo DetallePantalla en Dashboard
    const [pantallaDetalle, setPantallaDetalle] = useState<any | null>(null);    

    // Estado para modal de éxito
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Estado para Loader global (Spinner)
    const [isLoading, setIsLoading] = useState(false);

    // Estado para Notificaciones Toast (Diseño UI)
    const [notification, setNotification] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 4000); // Ocultar después de 4 segundos
    };

    const router = useRouter();

    const handleLogout = async () => {
        if (user?.id) {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ userId: user.id })
            });
        }
        
        sessionStorage.removeItem("user");

        router.push("/login");
    };

    // Menú de navegación Enterprise
    const menuItems = useMemo(() => [
        { id: "dashboard", label: "Dashboard Master", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { id: "salas", label: "Gestión de Salas", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
        { id: "usuarios", label: "Usuarios y Accesos", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        { id: "reportes", label: "Reportes y Analíticas", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        { id: "traslados", label: "Traslados y Control", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
        { id: "configuracion", label: "Configuración", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
    ], []);

    const crearAdministrador = async () => {
        try {
            const response = await fetch("/api/master/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombres,
                    apellidos,
                    cedula,
                    telefono,
                    email,
                    password,
                    departamento,
                    ciudad,
                }),
            });
            const data = await response.json();

            if (data.success) {
                setSuccessMessage("El usuario administrador ha sido creado exitosamente en el sistema.");
                setShowModalAdmin(false);
                await cargarUsuarios(); // Recargar usuarios
            } else {
                showToast("Error al crear administrador: " + data.error, "error");
            }
        } catch (error) {
            console.error("Error creating administrator:", error);
            showToast("Error de conexión al servidor", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const cargarUsuarios = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/master/users");
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const cargarSedes = async () => {
        try {
            const response = await fetch("/api/master/sedes");

            const result = await response.json();

            if (!result.success) return;

            setSedes(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
        cargarSedes();
    }, []);

    useEffect(() => {
        cargarSedes();

        const interval = setInterval(() => {
            cargarSedes();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const departamentos = Object.keys(ubicaciones);

    const ciudadesDisponibles = departamento ? ubicaciones[departamento as keyof typeof ubicaciones] : [];

    // Eliminar Usuario
    const eliminarUsuario = async () => {
        if (!userToDelete) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/master/users/${userToDelete}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage("Usuario eliminado exitosamente del sistema.");
                await cargarUsuarios(); // Recargar usuarios después de eliminar
            } else {
                showToast("Error al eliminar usuario: " + data.error, "error");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            showToast("Error de conexión al eliminar usuario", "error");
        } finally {
            setIsLoading(false);
            setUserToDelete(null);
        }
    };

    const guardarEdicionUsuario = async () => {
        if (!userToEdit) return;
        setIsLoading(true);
        try {
            const response = await fetch(`/api/master/users/${userToEdit.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombres: userToEdit.nombres,
                    apellidos: userToEdit.apellidos,
                    cedula: userToEdit.cedula,
                    telefono: userToEdit.telefono,
                    email: userToEdit.email,
                    password: userToEdit.password,
                    departamento: userToEdit.departamento,
                    ciudad: userToEdit.ciudad,
                    nombreSede: userToEdit.nombreSede,
                    estado: userToEdit.estado
                }),
            });
            const data = await response.json();
            
            if (data.success || response.ok) {
                setSuccessMessage("Usuario editado exitosamente en el sistema.");
                await cargarUsuarios(); // Recargar usuarios después de editar
            } else {
                showToast("Error al editar usuario: " + (data.error || "Error desconocido"), "error");
            }
        } catch (error) {
            console.error("Error editing user:", error);
            showToast("Error de conexión al editar usuario", "error");
        } finally {
            setIsLoading(false);
            setUserToEdit(null);
        }
    };

    const suspenderUsuario = async () => {
        if (!userToSuspend) return;
        setIsLoading(true);
        try {
            // Lógica pendiente para suspender el usuario en la base de datos (Ej: cambiar estado a INACTIVO)
            const response = await fetch(`/api/master/users/${userToSuspend}`,
                { method: "PATCH",}
            );
            
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Error al suspender usuario");
            }
            setSuccessMessage("Usuario suspendido exitosamente");
            await cargarUsuarios();
        } catch (error) {
            console.error("Error suspending user:", error);
            showToast("Error de conexión al suspender usuario", "error");
        } finally {
            setIsLoading(false);
            setUserToSuspend(null);
        }
    };

    const crearSede = async () => {
        if(!nuevaSedeNombre || !nuevaSedeDepartamento || !nuevaSedeCiudad) {
            showToast("Por favor complete todos los campos obligatorios.", "error");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch("/api/master/sedes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nuevaSedeNombre,
                    departamento: nuevaSedeDepartamento,
                    ciudad: nuevaSedeCiudad,
                    adminId: nuevaSedeAdminId || null,
                    numeroSalas: parseInt(nuevaSedeNumeroSalas),
                    salaVip: nuevaSedeVip
                }),
            });
            const data = await response.json();
            if (data.success || response.ok) {
                setSuccessMessage("Sede registrada y conectada exitosamente en el sistema.");
                setShowModalSede(false);
                setNuevaSedeNombre(""); setNuevaSedeDepartamento(""); setNuevaSedeCiudad(""); setNuevaSedeAdminId(""); setNuevaSedeVip(false);
                await cargarSedes();
                await cargarUsuarios(); // Refrescar en caso de actualización relacional
            } else {
                showToast("Error al crear sede: " + (data.error || "Desconocido"), "error");
            }
        } catch (error) {
            showToast("Error de conexión al crear sede", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditSede = async (sedeData: any) => {
        if (!sedeData || !sedeData.id) {
            showToast("No se ha seleccionado una sede para editar.", "error");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/master/sedes/${sedeData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sedeData),
            });
            const data = await response.json();
            if (data.success || response.ok) {
                setSuccessMessage("Sede actualizada correctamente.");
                await cargarSedes();
            } else {
                showToast("Error al actualizar la sede: " + (data.error || "Error desconocido"), "error");
            }
        } catch (error) {
            showToast("Error de conexión al actualizar la sede.", "error");
        } finally {
            setIsLoading(false);
            setSedeToEdit(null); // Cierra el modal
        }
    };

    const sedeAdministrar = sedes.find(
        (sede) => sede.id === administrarPantallasId
    );


    return (
        <div className="flex h-screen bg-[#EEF4FF] overflow-hidden font-sans text-slate-800">
            
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} menuItems={menuItems} user={user} handleLogout={handleLogout} />

            {/* ÁREA PRINCIPAL */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                <Topbar activeTab={activeTab} menuItems={menuItems} />

                {/* CONTENIDO DINÁMICO */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8 bg-[#EEF4FF]">
                    <div className="max-w-7xl mx-auto w-full">

                        {/* MÓDULO 1: DASHBOARD MASTER */}
                        {activeTab === "dashboard" && <DashboardTab mockSedes={sedes} setExpandedSede={setExpandedSede} setPantallaDetalle={setPantallaDetalle} setAdministrarPantallasModal={(sede) => setAdministrarPantallasId(sede.id)} />}

                        {/* MÓDULO 2: GESTIÓN DE SALAS */}
                        {activeTab === "salas" && <SalasTab sedes={sedes} setShowModalSede={setShowModalSede} setSedeToEdit={setSedeToEdit} />}

                        {/* MÓDULO 3: GESTIÓN DE USUARIOS */}
                        {activeTab === "usuarios" && <UsuariosTab usuarios={usuarios} setShowModalAdmin={setShowModalAdmin} setUserToEdit={setUserToEdit} setUserToSuspend={setUserToSuspend} setUserToDelete={setUserToDelete} />}

                        {/* MÓDULO 4: REPORTES Y ANALÍTICAS */}
                        {activeTab === "reportes" && <ReportesTab mockSedes={sedes} />}

                        {/* MÓDULO 5: TRASLADOS Y CONTROL */}
                        {activeTab === "traslados" && <TrasladosTab />}

                        {/* MÓDULO 6: CONFIGURACIÓN MASTER */}
                        {activeTab === "configuracion" && <ConfiguracionTab />}
                        
                    </div>
                </main>
            </div>
            
            <ModalsManager
                departamentos={departamentos} ciudadesDisponibles={ciudadesDisponibles} sedes={sedes} usuarios={usuarios}
                showModalAdmin={showModalAdmin} setShowModalAdmin={setShowModalAdmin}
                nombres={nombres} setNombres={setNombres} apellidos={apellidos} setApellidos={setApellidos}
                cedula={cedula} setCedula={setCedula} telefono={telefono} setTelefono={setTelefono}
                email={email} setEmail={setEmail} password={password} setPassword={setPassword}
                departamento={departamento} setDepartamento={setDepartamento} ciudad={ciudad} setCiudad={setCiudad}
                nombreSede={nombreSede} setNombreSede={setNombreSede} crearAdministrador={crearAdministrador}
                showModalSede={showModalSede} setShowModalSede={setShowModalSede}
                nuevaSedeNombre={nuevaSedeNombre} setNuevaSedeNombre={setNuevaSedeNombre}
                nuevaSedeDepartamento={nuevaSedeDepartamento} setNuevaSedeDepartamento={setNuevaSedeDepartamento}
                nuevaSedeCiudad={nuevaSedeCiudad} setNuevaSedeCiudad={setNuevaSedeCiudad}
                nuevaSedeAdminId={nuevaSedeAdminId} setNuevaSedeAdminId={setNuevaSedeAdminId}
                nuevaSedeNumeroSalas={nuevaSedeNumeroSalas} setNuevaSedeNumeroSalas={setNuevaSedeNumeroSalas}
                nuevaSedeVip={nuevaSedeVip} setNuevaSedeVip={setNuevaSedeVip} crearSede={crearSede}
                expandedSede={expandedSede} setExpandedSede={setExpandedSede}
                userToEdit={userToEdit} setUserToEdit={setUserToEdit} guardarEdicionUsuario={guardarEdicionUsuario}
                userToSuspend={userToSuspend} setUserToSuspend={setUserToSuspend} suspenderUsuario={suspenderUsuario}
                userToDelete={userToDelete} setUserToDelete={setUserToDelete} eliminarUsuario={eliminarUsuario}
                successMessage={successMessage} setSuccessMessage={setSuccessMessage}
                notification={notification} setNotification={setNotification} isLoading={isLoading}
            />

            {sedeToEdit && (
                <EditSedeForm
                    sede={sedeToEdit}
                    usuarios={usuarios}
                    onSave={handleEditSede}
                    onClose={() => setSedeToEdit(null)} />
            )}

            {pantallaDetalle && (
                <DetallePantallaModal
                    sede={pantallaDetalle}
                    onClose={() => setPantallaDetalle(null)}
                />
            )};

            {sedeAdministrar && (
                <AdministrarPantallasModal
                    sede={sedeAdministrar}
                    onClose={() => setAdministrarPantallasId(null)}
                    onActualizar={cargarSedes}
                />
            )}
        </div>
    );
}
