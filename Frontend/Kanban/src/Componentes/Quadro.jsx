import React, { useState, useEffect } from "react"; // React e hooks
import axios from "axios"; // Para requisições HTTP
import { Coluna } from "./Coluna"; // Componente Coluna
import { DndProvider } from "react-dnd"; // Provedor do drag-and-drop
import { HTML5Backend } from "react-dnd-html5-backend"; // Backend para HTML5 drag-and-drop

export function Quadro() {
  const [tarefas, setTarefas] = useState([]); // Estado para armazenar as tarefas

  // useEffect para buscar as tarefas da API quando o componente monta
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/reservas/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados recebidos da API:", data);
        setTarefas(data); // Atualiza o estado com os dados da API
      })
      .catch((error) => console.error("Erro ao buscar tarefas:", error));
  }, []);

  // Função para mover a tarefa para uma nova coluna/status
  async function moverTarefa(id, novoStatus) {
    try {
      // Atualiza o status no backend
      await axios.patch(`http://127.0.0.1:8000/api/reservas/${id}/`, {
        status: novoStatus,
      });

      // Atualiza o estado local, alterando apenas a tarefa movida
      setTarefas((prev) =>
        prev.map((tarefa) =>
          tarefa.id === id ? { ...tarefa, status: novoStatus } : tarefa
        )
      );
    } catch (error) {
      console.error("Erro ao mover tarefa:", error);
    }
  }

  // Filtra as tarefas por status para cada coluna
  const tarefasAfazer = tarefas.filter((t) => t.status === "A FAZER");
  const tarefasFazendo = tarefas.filter((t) => t.status === "FAZENDO");
  const tarefasFeito = tarefas.filter((t) => t.status === "FEITO");

  return (
    // DndProvider envolve o quadro para permitir drag-and-drop
    <DndProvider backend={HTML5Backend}>
      <main className="container">
        <h1>Meu Quadro</h1>

        {/* Container das colunas */}
        <div className="colunas-container" style={{ display: "flex", gap: "16px" }}>
          {/* Cada coluna recebe o título, as tarefas filtradas e a função moverTarefa */}
          <Coluna titulo="A FAZER" tarefas={tarefasAfazer} onMove={moverTarefa} />
          <Coluna titulo="FAZENDO" tarefas={tarefasFazendo} onMove={moverTarefa} />
          <Coluna titulo="FEITO" tarefas={tarefasFeito} onMove={moverTarefa} />
        </div>
      </main>
    </DndProvider>
  );
}