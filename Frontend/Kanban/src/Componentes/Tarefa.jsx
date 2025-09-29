import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrag } from 'react-dnd';

export function Tarefa({ tarefa }) {
    const [status, setStatus] = useState(tarefa.status || ""); // Estado do status da tarefa
    const navigate = useNavigate(); //Navega entre páginas

    // Hook do react-dnd para tornar a tarefa arrastável
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: "TAREFA", // Tipo usado pelas colunas para reconhecer o drop
        item: { id: tarefa.id }, // Dados enviados quando a tarefa é solta
        collect: (monitor) => ({
            isDragging: monitor.isDragging(), //Indica se a tarefa está sendo arrastada
        }),
    }));

    //Função para excluir a tarefa
    async function excluirTarefa(id) {
        if (confirm("Tem certeza mesmo que quer excluir?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/reservas/${id}/`);
                alert("Tarefa excluída com sucesso");
                window.location.reload(); //Atualiza a página para refletir a exclusão
            } catch (error) {
                console.error("Erro ao excluir a tarefa", error);
                alert("Erro ao excluir");
            }
        }
    }

    //Função para alterar o status da tarefa
    async function alterarStatus() {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/reservas/${tarefa.id}/`, {
                status: status,
            });
            alert("Status alterado com sucesso!");
            window.location.reload(); //Atualiza a página para refletir a alteração
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status.");
        }
    }

    return (
        <article
            ref={dragRef} //Torna a tarefa arrastável
            className='card_tarefa'
            style={{ opacity: isDragging ? 0.5 : 1 }} //Transparência ao arrastar
            aria-labelledby={`tarefa-${tarefa.id}`}
        >
            {/* Informações da tarefa */}
            <article className='info_tarefa'>
                <h3 id={`tarefa-${tarefa.id}`}>{tarefa.descricao_tarefa}</h3>
                <dl>
                    <dt>Setor:</dt> 
                    <dd>{tarefa.nome_setor}</dd>
        
                    <dt>Prioridade:</dt>
                    <dd>{tarefa.prioridade}</dd>

                    <dt>Criado em:</dt>
                    <dd>
                        {(() => {
                            const [ano, mes, dia] = tarefa.data_cadastro.split("-");
                            return `${dia}/${mes}/${ano}`; // Formata a data
                        })()}
                    </dd>
                </dl>
            </article>

            {/* Botões de editar e excluir */}
            <article className='button_del_edit'>
                <button onClick={() => navigate(`/editarTarefa/${tarefa.id}`)}>
                    Editar
                </button>
                <button onClick={() => excluirTarefa(tarefa.id)}>
                    Excluir
                </button>
            </article>

            {/* Formulário para alterar status */}
            <form
                onSubmit={(e) => { e.preventDefault(); alterarStatus(); }}
                aria-labelledby={`status-label-${tarefa.id}`}
            >
                <label id={`status-label-${tarefa.id}`} htmlFor={`status-${tarefa.id}`}>
                    Status:
                </label>
                <select
                    id={`status-${tarefa.id}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    aria-live="polite"
                >
                    <option value="A FAZER">A fazer</option>
                    <option value="FAZENDO">Fazendo</option>
                    <option value="FEITO">Feito</option>
                </select>
                <button type="submit">ALTERAR STATUS</button>
            </form>
        </article>
    );
}