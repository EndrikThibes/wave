import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { TemaProvider } from "./contextos/TemaContext.jsx";
import { AvisoProvider } from "./contextos/AvisoContext.jsx";
import { AuthProvider, useAuth } from "./contextos/AuthContext.jsx";
import { BibliotecaProvider } from "./contextos/BibliotecaContext.jsx";
import { PlayerProvider } from "./contextos/PlayerContext.jsx";
import Layout from "./componentes/Layout.jsx";
import Carregando from "./componentes/Carregando.jsx";
import Login from "./paginas/Login.jsx";

const Recuperar = lazy(() => import("./paginas/Recuperar.jsx"));
const Cadastro = lazy(() => import("./paginas/Cadastro.jsx"));
const Privacidade = lazy(() => import("./paginas/Privacidade.jsx"));
const Inicio = lazy(() => import("./paginas/Inicio.jsx"));
const Buscar = lazy(() => import("./paginas/Buscar.jsx"));
const Biblioteca = lazy(() => import("./paginas/Biblioteca.jsx"));
const Playlist = lazy(() => import("./paginas/Playlist.jsx"));
const Artista = lazy(() => import("./paginas/Artista.jsx"));
const Configuracoes = lazy(() => import("./paginas/Configuracoes.jsx"));
const NaoEncontrada = lazy(() => import("./paginas/NaoEncontrada.jsx"));

function RotaPrivada() {
  const { usuario, saiuAgora } = useAuth();
  const local = useLocation();
  if (usuario === null) {
    const origem = saiuAgora ? undefined : { de: local.pathname + local.search };
    return <Navigate to="/login" replace state={origem} />;
  }
  return (
    <BibliotecaProvider>
      <PlayerProvider>
        <Layout />
      </PlayerProvider>
    </BibliotecaProvider>
  );
}

function RotaPublica() {
  const { usuario } = useAuth();
  if (usuario !== null && !usuario.visitante) {
    return <Navigate to="/inicio" replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TemaProvider>
        <AvisoProvider>
          <AuthProvider>
            <Suspense fallback={<Carregando />}>
              <Routes>
                <Route element={<RotaPublica />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/recuperar" element={<Recuperar />} />
                </Route>
                <Route path="/privacidade" element={<Privacidade />} />
                <Route element={<RotaPrivada />}>
                  <Route path="/inicio" element={<Inicio />} />
                  <Route path="/buscar" element={<Buscar />} />
                  <Route path="/biblioteca" element={<Biblioteca />} />
                  <Route path="/playlist/:id" element={<Playlist />} />
                  <Route path="/artista/:id" element={<Artista />} />
                  <Route path="/configuracoes" element={<Configuracoes />} />
                </Route>
                <Route path="/" element={<Navigate to="/inicio" replace />} />
                <Route path="*" element={<NaoEncontrada />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </AvisoProvider>
      </TemaProvider>
    </BrowserRouter>
  );
}
