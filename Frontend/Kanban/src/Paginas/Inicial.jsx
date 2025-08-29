import { BarraNavegacao } from "../components/BarraNavegacao";
import { Cabecalho } from "../components/Cabecalho";
import { Outlet } from "react-router-dom"; //Aqui agrega conteúdos que são moldáveis, nesse caso o header e navbar ficaram fixos mas o conteudo da página (quadro) é auterável

export function Inicial(){
    return(
        <>
            <BarraNavegacao/>
            <Cabecalho/>    
            <Outlet/>
        </>
    )
}