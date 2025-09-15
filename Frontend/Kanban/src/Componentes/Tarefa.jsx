import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Tarefa({ tarefa }) {
    const [status, setStatus] = useState(tarefa.status || "");
    const navigate = useNavigate();

    async function excluirTarefa(id) {
        if (confirm("Tem certeza mesmo que quer excluir?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/reservas/${id}/`);
                alert("Tarefa excluída com sucesso");
                window.location.reload();
            } catch (error) {
                console.error("Erro ao excluir a tarefa", error);
                alert("Erro ao excluir");
            }
        }
    }

    async function alterarStatus() {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/reservas/${tarefa.id}/`, {
                status: status,
            });
            alert("Status alterado com sucesso!");
            window.location.reload();
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status.");
        }
    }

    return (
        <article className='card_tarefa'>
            <article className='info_tarefa'>
                <h3 id={`tarefa-${tarefa.id}`}>{tarefa.descricao_tarefa}</h3>
                <dl>
                    <dt>Setor:</dt>
                    <dd>{tarefa.nome_setor}</dd>

                    <dt>Prioridade:</dt>
                    <dd>{tarefa.prioridade}</dd>

                    <dt>Criado em:</dt>
                    <dd>{tarefa.data_cadastro}</dd>
                </dl>
            </article>

            <article className='button_del_edit'>
                <button onClick={() => navigate(`/editarTarefa/${tarefa.id}`)}>Editar</button>
                <button onClick={() => excluirTarefa(tarefa.id)}>Excluir</button>
            </article>

            <form onSubmit={(e) => { e.preventDefault(); alterarStatus(); }}>
                <label>Status:</label>
                <select
                    id={`status-${tarefa.id}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Selecione</option>
                    <option value="A FAZER">A fazer</option>
                    <option value="FAZENDO">Fazendo</option>
                    <option value="FEITO">Feito</option>
                </select>
                <button type="submit">Alterar Status</button>
            </form>
        </article>
    );
}