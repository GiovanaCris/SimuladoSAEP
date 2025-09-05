import React, {useState, useEffect} from "react";
import axios from 'axios';
import { Coluna } from "./Coluna";

export function Quadro(){
    const [tarefas, setTarefas] = useState([]);

    //O effect é um hook que permite a renderização de alguma coisa na tela
    //Ele é o fofoqueiro do React, conta pra todo mundo que o state está armazenado
    //Effect é composto de parametros. script (algoritmo) e depois as dependencias

    useEffect(()=>{
        //Construo uma variavel com o endereço da api
        const apiURL = 'http://127.0.0.1:8000/api/reservas/';

        //axios permite a chamada do endereço
        axios.get(apiURL)
            //then é se a resposta der bom
            .then(response =>{ setTarefas(response.data)
            })
            //catch se deu algum problema
            .catch(error => {
                console.error("Deu ruim ein", error)
            });
    },[])

    //Estou armazenando em variavei o resultado de uma função callback que procura taefas com certo status
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === 'A fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'Fazendo');
    const tarefasFeito = tarefas.filter(tarefa => tarefa.status === 'Feito');

    return(
        <>
        <main className="container">
            <h1>Meu Quadro</h1>
            <Coluna titulo = "A fazer" tarefas={tarefasAfazer}/>
            <Coluna titulo = 'Fazendo' tarefas={tarefasFazendo}/>
            <Coluna titulo = 'Feito' tarefas = {tarefasFeito} />
        </main>
        </>
    );
}