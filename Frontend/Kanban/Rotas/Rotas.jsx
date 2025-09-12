import { Routes, Route } from 'react-router-dom';
import { Inicial } from '../src/Paginas/Inicial';
import { Quadro } from '../src/Componentes/Quadro';
import { CadUsuario } from '../src/Paginas/CadUsuario';
import { CadTarefa } from '../src/Paginas/CadTarefa';

export function Rotas(){
    return(
        <Routes>
            <Route path='/' element={<Inicial/>}> {/*Rota padrão*/}
                <Route index element={<Quadro/>}/>
                <Route path= 'cadUsuario' element={<CadUsuario/>}/> {/*Renderizando oq será exibido no Outlet*/}
                <Route path= 'cadTarefa' element={<CadTarefa/>}/>
            </Route>
        </Routes>
    )
}