//Importação dos componentes e páginas necessárias
import { Routes, Route} from 'react-router-dom';
import {Inicial} from '../Paginas/Inicial';
import { Quadro } from '../Componentes/Quadro';
import { CadUsuario} from '../Paginas/CadUsuario';
import { CadTarefa } from '../Paginas/CadTarefa';
import { EditarTarefa } from '../Paginas/EditarTarefa';

export function Rotas(){
    return(
        <Routes>
            <Route path='/' element={<Inicial/>}> {/*Rota inicial*/}
                <Route index element ={<Quadro/>}/> {/*Rota do quadro das tarefas*/}
                <Route path='cadUsuario' element={<CadUsuario/>}/> {/*Rota para cadastro de usuário*/}
                <Route path ='cadTarefa' element={<CadTarefa/>}/> {/*Rota para cadastro de tarefa*/}
                <Route path='editarTarefa/:id' element={<EditarTarefa/>}/> {/*Rota pata editar tarefas por ID*/}
            </Route>
        </Routes>

    )

}