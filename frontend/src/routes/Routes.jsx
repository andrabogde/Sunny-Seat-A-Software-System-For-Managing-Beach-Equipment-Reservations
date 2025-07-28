import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import RoleProtectedRoute from '../components/RoleProtectedRoute';

// Importăm paginile aplicației existente
import HomePage from '../pages/HomePage';
import ManagerDashboard from '../pages/ManagerDashboard';

import PlajaPage from '../pages/PlajaPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import FavoritesPage from '../pages/FavoritesPage';
import ReservationPage from '../pages/ReservationPage';
import NotFoundPage from '../pages/NotFoundPage';
import PlajeListPage from '../pages/PlajeListPage';
import MapPage from '../pages/MapPage';
import DespreNoiPage from '../pages/DespreNoiPage';
import PoliticaCookies from '../pages/PoliticaCookies';
import TermeniConditii from '../pages/TermeniConditii';
import PoliticaConfidentialitate from '../pages/PoliticaConfidentialitate';
import RezervarileMele from '../pages/RezervarileMele';
import Oferte from '../pages/Oferte';
import NotificationsPage from '../pages/NotificationsPage ';
import ManagerRequestsPage from '../pages/ManagerRequestsPage';

// 🆕 IMPORTĂM PAGINA DE PLATĂ
import PaymentPage from '../pages/PaymentPage';

// Importăm paginile de blog existente
import AccesoriiEsentiale from '../pages/AccesoriiEsentiale';
import AlegereaSezlongului from '../pages/AlegereaSezlongului';
import ActivitatiGonflabile from '../pages/ActivitatiGonflabile';

// Importăm AdminDashboard și paginile de management
import AdminDashboard from '../pages/AdminDashboard';
import CompaniesManagement from '../pages/CompaniesManagement';
import BeachesManagement from '../pages/BeachesManagement';
import UsersManagement from '../pages/UsersManagement';
import ReservationsManagement from '../pages/ReservationsManagement';
import EquipmentManagement from '../pages/EquipmentManagement';
import SettingsManagement from '../pages/SettingsManagement';
import StatisticsManagement from '../pages/StatisticsManagement';
import EquipmentPricesManagement from '../pages/EquipmentPricesManagement';

// 🆕 IMPORTĂM PAGINILE PENTRU RESET PAROLĂ
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

// 🆕 IMPORTĂM PAGINA PENTRU ACTIVAREA CONTULUI
import ActivateAccountPage from '../pages/ActivateAccountPage';

// Pagină pentru acces neautorizat
import UnauthorizedPage from '../pages/UnauthorizedPage';
import CompanyForm from '../pages/CompanyForm';

// Componentă pentru protejarea rutelor simple (doar autentificare)
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Se încarcă...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: window.location.pathname }} />;
    }

    return children;
};

// COMPONENTĂ SMART PENTRU HOMEPAGE - previne flash-ul pentru admin
const SmartHomePage = () => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    console.log('🏠 SmartHomePage - Checking user state:', {
        isAuthenticated,
        loading,
        userRole: user?.role
    });

    // Dacă încă se încarcă, arată loading
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Se încarcă...</span>
                    </div>
                    <p className="text-muted">Se încarcă aplicația...</p>
                </div>
            </div>
        );
    }

    // Dacă este autentificat și este ADMIN, redirectează imediat
    if (isAuthenticated && user?.role === 'ADMIN') {
        console.log('🔴 SmartHomePage - ADMIN detectat, redirecting to dashboard');
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Dacă este autentificat și este alt tip de user, redirectează către dashboard-ul său
    if (isAuthenticated && user?.role === 'MANAGER') {
        console.log('🟡 SmartHomePage - MANAGER detectat, redirecting to manager dashboard');
        return <Navigate to="/manager/plaje" replace />;
    }

    if (isAuthenticated && (user?.role === 'USER' || user?.role === 'CLIENT')) {
        console.log('🟢 SmartHomePage - USER detectat, redirecting to user dashboard');
        return <Navigate to="/homepage" replace />;
    }

    // Pentru utilizatori neautentificați sau roluri necunoscute, arată HomePage normală
    console.log('📄 SmartHomePage - Showing normal HomePage');
    return <HomePage />;
};

// PLACEHOLDER COMPONENTS pentru secțiunile care nu au încă componente
const PlaceholderComponent = ({ title, description, icon = "🚧" }) => (
    <div className="container-fluid py-5">
        <div className="text-center">
            <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>{icon}</div>
            <h2 className="mb-3">{title}</h2>
            <p className="text-muted mb-4">{description}</p>
            <div className="alert alert-info d-inline-block">
                <strong>În dezvoltare:</strong> Această secțiune va fi implementată în curând.
            </div>
        </div>
    </div>
);

const AppRoutes = () => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    // Log detaliat pentru debugging
    console.log('📍 AppRoutes - RENDER CYCLE');
    console.log('   Current path:', location.pathname);
    console.log('   Context state:', { user: !!user, role: user?.role, isAuthenticated, loading });

    // Log special pentru ruta admin
    if (location.pathname.startsWith('/admin')) {
        console.log('🔴 ADMIN ROUTE DETECTED IN APPROUTES!');
        console.log('   Full path:', location.pathname);
        console.log('   User role:', user?.role);
        console.log('   Is authenticated:', isAuthenticated);
        console.log('   Loading state:', loading);
    }

    return (
        <Routes>
            {/* 🏠 HOMEPAGE SMART - previne flash-ul pentru admin */}
            <Route path="/" element={<SmartHomePage />} />

            {/* 🔐 RUTE PUBLICE PENTRU AUTENTIFICARE ȘI RESET PAROLĂ */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* 🆕 RUTA PENTRU ACTIVAREA CONTULUI - PUBLICĂ */}
            <Route path="/activate-account" element={<ActivateAccountPage />} />

            {/* 🎯 RUTA ADMIN DASHBOARD */}
            <Route path="/admin/dashboard" element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                </RoleProtectedRoute>
            } />

            {/* 👥 GESTIONARE UTILIZATORI */}
            <Route path="/admin/utilizatori" element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard>
                        <UsersManagement />
                    </AdminDashboard>
                </RoleProtectedRoute>
            } />

            {/* 🏖️ GESTIONARE PLAJE */}
            <Route path="/admin/plaje" element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard>
                        <BeachesManagement />
                    </AdminDashboard>
                </RoleProtectedRoute>
            } />

            {/* 🏖️ GESTIONARE PLAJE */}
            <Route path="/manager/plaje" element={
                <RoleProtectedRoute allowedRoles={['MANAGER']}>
                    <ManagerDashboard>
                        <BeachesManagement />
                    </ManagerDashboard>
                </RoleProtectedRoute>
            } />

            {/* 🏖️ GESTIONARE rezervari */}
            <Route path="/manager/rezervari" element={
                <RoleProtectedRoute allowedRoles={['MANAGER']}>
                    <ManagerDashboard>
                        <ReservationsManagement />
                    </ManagerDashboard>
                </RoleProtectedRoute>
            } />
            {/* ⛱️ GESTIONARE ECHIPAMENTE */}
            <Route path="/manager/echipamente" element={
                <RoleProtectedRoute allowedRoles={['MANAGER']}>
                    <ManagerDashboard>
                        <EquipmentManagement />
                        </ManagerDashboard>
                </RoleProtectedRoute>
            } />
 {/* ⛱️ GESTIONARE FIRMA */}
 <Route path="/manager/firme" element={
                <RoleProtectedRoute allowedRoles={['MANAGER']}>
                    <ManagerDashboard>
                        <CompanyForm />
                        </ManagerDashboard>
                </RoleProtectedRoute>
            } />

            {/* 💰 GESTIONARE PREȚURI ECHIPAMENTE - CORECTAT */}
            <Route path="/admin/preturi-echipamente" element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard>
                        <EquipmentPricesManagement />
                    </AdminDashboard>
                </RoleProtectedRoute>
            } />
            {/* 📋 CERERI MANAGERI - 🆕 ADAUGĂ ACEASTĂ RUTĂ */}
            <Route path="/admin/cereri-manageri" element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard>
                        <ManagerRequestsPage />
                    </AdminDashboard>
                </RoleProtectedRoute>
            } />

            {/* 📋 GESTIONARE REZERVĂRI */}
            <Route path="/admin/rezervari" element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard>
                        <ReservationsManagement />
                    </AdminDashboard>
                </RoleProtectedRoute>
            } />

            {/* ⛱️ GESTIONARE ECHIPAMENTE */}
            <Route path="/admin/echipamente" element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard>
                        <EquipmentManagement />
                    </AdminDashboard>
                </RoleProtectedRoute>
            } />

            {/* 🏢 GESTIONARE FIRME */}
            <Route path="/admin/firme" element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard>
                        <CompaniesManagement />
                    </AdminDashboard>
                </RoleProtectedRoute>
            } />

            {/* 📊 STATISTICI */}
            <Route path="/admin/statistici" element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard>
                        <StatisticsManagement />
                    </AdminDashboard>
                </RoleProtectedRoute>
            } />

            {/* ⚙️ SETĂRI SISTEM */}
            <Route path="/admin/setari" element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard>
                        <SettingsManagement />
                    </AdminDashboard>
                </RoleProtectedRoute>
            } />

            {/* 🔄 REDIRECȚIONĂRI PENTRU ADMIN */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            {/* 📱 DASHBOARD-URI PENTRU ALTE ROLURI */}
            {/* <Route

                path="/manager/plaje"
                element={
                    <RoleProtectedRoute allowedRoles={['MANAGER']}>
                      
                        <ManagerDashboard />
                    </RoleProtectedRoute>
                }

            /> */}

            <Route path="/homepage" element={
                <RoleProtectedRoute allowedRoles={['USER', 'CLIENT']}>
                    <HomePage />
                </RoleProtectedRoute>
            } />

            {/* 🌐 RUTE PUBLICE */}
            <Route path="/plaja/:id" element={<PlajaPage />} />
            <Route path="/plaje" element={<PlajeListPage />} />
            <Route path="/statiuni" element={<MapPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/despre-noi" element={<DespreNoiPage />} />
            <Route path="/politica-cookies" element={<PoliticaCookies />} />
            <Route path="/termeni-conditii" element={<TermeniConditii />} />
            <Route path="/politica-confidentialitate" element={<PoliticaConfidentialitate />} />
            <Route path="/oferte" element={<Oferte />} />

            {/* 📝 PAGINI BLOG */}
            <Route path="/accesorii-esentiale" element={<AccesoriiEsentiale />} />
            <Route path="/alegerea-sezlongului" element={<AlegereaSezlongului />} />
            <Route path="/activitati-gonflabile" element={<ActivitatiGonflabile />} />

            {/* 🔒 RUTE PROTEJATE PENTRU UTILIZATORI NORMALI */}
            <Route path="/profil" element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            } />
            <Route path="/favorite" element={
                <ProtectedRoute>
                    <FavoritesPage />
                </ProtectedRoute>
            } />
            <Route path="/notificari" element={
                <ProtectedRoute>
                    <NotificationsPage />
                </ProtectedRoute>
            } />
            <Route path="/rezervare/:id" element={
                <ProtectedRoute>
                    <ReservationPage />
                </ProtectedRoute>
            } />
            <Route path="/rezervari" element={
                <ProtectedRoute>
                    <RezervarileMele />
                </ProtectedRoute>
            } />

            {/* 💳 PAGINA DE PLATĂ - PROTEJATĂ */}
            <Route path="/payment" element={
                <ProtectedRoute>
                    <PaymentPage />
                </ProtectedRoute>
            } />

            {/* 💳 PAGINI DE REZULTAT PLATĂ */}
            <Route path="/payment/success" element={
                <ProtectedRoute>
                    <PlaceholderComponent
                        title="Plată Reușită"
                        description="Rezervarea ta a fost confirmată cu succes!"
                        icon="✅"
                    />
                </ProtectedRoute>
            } />
            <Route path="/payment/cancel" element={
                <ProtectedRoute>
                    <PlaceholderComponent
                        title="Plată Anulată"
                        description="Plata a fost anulată. Poți încerca din nou."
                        icon="❌"
                    />
                </ProtectedRoute>
            } />
            <Route path="/payment/error" element={
                <ProtectedRoute>
                    <PlaceholderComponent
                        title="Eroare Plată"
                        description="A apărut o eroare la procesarea plății."
                        icon="⚠️"
                    />
                </ProtectedRoute>
            } />

            {/* ❌ ACCES NEAUTORIZAT */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* 🔍 RUTE DE TEST (doar în development) */}
            {process.env.NODE_ENV === 'development' && (
                <Route path="/test-admin-simple" element={
                    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
                        <h1 style={{ color: 'green' }}>✅ TEST ADMIN ROUTE FUNCȚIONEAZĂ!</h1>
                        <p>Dacă vezi asta, ruta simplă funcționează.</p>
                        <p>User autentificat: {JSON.stringify(user)}</p>
                        <p>Is authenticated: {isAuthenticated ? 'DA' : 'NU'}</p>
                        <p>Loading: {loading ? 'DA' : 'NU'}</p>
                    </div>
                } />
            )}

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;