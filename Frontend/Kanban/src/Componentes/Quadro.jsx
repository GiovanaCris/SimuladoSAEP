import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Coluna } from "./Coluna";
import {DndContext} from '@dnd-kit/core'; //É o uso da biblioteca de clicar e arrastar

export function Quadro() {
    const [tarefas, setTarefas] = useState([]);

    //o effect é um hook que permite a renderização de alguma coisa na tela
    //ele é o fofoqueiro do React, conta para todo mundo o que o state está armazenando
    //effect é composto de parametros. script (algoritmo) e depois as dependencias

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/reservas/")
            .then(response => response.json())
            .then(data => {
                console.log("Dados recebidos da API:", data);
                setTarefas(data);
            })
            .catch(error => console.error("Erro ao buscar tarefas:", error));
    }, [])

    //função de 

    //estou armazenando em variaveis o resultado de uma função callback que procura tarefas 
    // com certo status
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === 'A FAZER');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'FAZENDO');
    const tarefasFeito = tarefas.filter(tarefa => tarefa.status === 'FEITO');


    return (
        <main className="container">
            <h1>Meu Quadro</h1>
            <div className="colunas-container">
                <Coluna titulo="A FAZER" tarefas={tarefasAfazer} />
                <Coluna titulo='FAZENDO' tarefas={tarefasFazendo} />
                <Coluna titulo='FEITO' tarefas={tarefasFeito} />
            </div>
        </main>

    );
}