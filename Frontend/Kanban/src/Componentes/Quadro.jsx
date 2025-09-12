import React, {useState, useEffect} from "react";
import axios from 'axios';
import { Coluna } from "./Coluna";

export function Quadro(){
    const [tarefas, setTarefas] = useState([]);

    //o effect é um hook que permite a renderização de alguma coisa na tela
    //ele é o fofoqueiro do React, conta para todo mundo o que o state está armazenando
    //effect é composto de parametros. script (algoritmo) e depois as dependencias

    useEffect(() =>{
        //Cosntruo uma variavel com o endereço da API
        const apiURL = 'http://127.0.0.1:8000/tarefa/';

        //axios permite a chamada do endereço
        axios.get(apiURL)
            //then é se a resposta der bom
            .then(response =>{ setTarefas(response.data)                
            })
            //catch se deu algum problema
            .catch(error => {
                console.error("Deu ruim hein", error)
            });
    },[])

    //estou armazenando em variaveis o resultado de uma função callback que procura tarefas 
    // com certo status
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status ==='A fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status ==='Fazendo');
    const tarefasPronto = tarefas.filter(tarefa => tarefa.status ==='Pronto');


    return(
        <main className="conteiner">
            <h1>Meu Quadro</h1>
            <Coluna titulo = "A fazer" tarefas={tarefasAfazer}/>
            <Coluna titulo = 'Fazendo' tarefas = {tarefasFazendo}/>
            <Coluna titulo = 'Pronto' tarefas = {tarefasPronto}/>
        </main>
    );
}