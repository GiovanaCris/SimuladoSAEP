import { useDrop } from "react-dnd"; // Hook para retornar um valor de drop
import { Tarefa } from "./Tarefa";   // Componente que representa cada tarefa unitariamente

export function Coluna({ titulo, tarefas = [], onMove }) {
  // Configura a coluna como alvo de drop de tarefas
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TAREFA", // Tipo de item que pode ser solto
    drop: (item) => {
      if (onMove) onMove(item.id, titulo); // Atualiza a tarefa para a coluna respectiva
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), // Informa se algo está sendo arrastado sobre a coluna
    }),
  }));

  return (
    <section ref={drop} className="coluna">
      <h2 className="titulo">{titulo}</h2>
      <article className="info-card">
        {/* Renderiza todas as tarefas da coluna */}
        {tarefas.map((tarefa) => (
          <Tarefa key={tarefa.id} tarefa={tarefa} />
        ))}
      </article>
    </section>
  );
}
