import { BarraNavegacao } from "../Componentes/BarraNavegacao"
import { Cabecalho } from "../Componentes/Cabecalho";
import { Outlet } from "react-router-dom";

export function Inicial(){
    return(
        <>
            <BarraNavegacao/> {/*Rendezinha a barra de navegação*/}
            <Cabecalho/> {/*Rendezia o cabeçalho*/}
            <Outlet/> {/* Renderiza CadUsuario, CadTarefa, etc, dependendo da rota */}
        </>
    )
}