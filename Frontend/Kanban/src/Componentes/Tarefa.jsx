import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Tarefa({ tarefa }){
    const [status, setStatus] = useState(tarefa.status || "");
    const navigate = useNavigate();

    //fazendo a exclusao de uma tarefa
    //async é pq eu nao sei exatamente o tempo de resposta  
    // as funções deve ter nome que remeta a sua funcionalidade
    async function excluirTarefa(id) {
        if(confirm("Tem certeza mesmo que quer excluir?")){
            try{
                await axios.delete(`http://127.0.0.1:8000/tarefa/${id}/`);
                alert("Tarefa excluida com sucesso");
                window.location.reload();//refrash
            }catch(error){
                console.error("Erro ao excluir a tarefa", error);
                alert("Erro ao excluir");
            }
        }        
    }

    async function alterarStatus() {
        try {
            await axios.patch(`http://127.0.0.1:8000/tarefa/${tarefa.id}/`, {
                status: status,
            });
            alert("Status alterado com sucesso!");
            window.location.reload();
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status.");
        }
    }


    return(
        <article>
            <h3 id={`tarefa: ${Tarefa.id}`}>{tarefa.descricao}</h3>
            <dl>
                <dt>Setor:</dt>
                <dd>{tarefa.setor}</dd>

                <dt>Prioridade:</dt>
                <dd>{tarefa.prioridade}</dd>
            </dl>            
            <button onClick={()=> navigate(`/editarTarefa/${tarefa.id}`)}>Editar</button>
            <button onClick={()=> excluirTarefa(tarefa.id)}>Excluir</button>
            <form>
                <label>Status:</label>
                 <select
                    id={`status-${tarefa.id}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Selecione </option>
                    <option value="A Fazer">A fazer</option>
                    <option value="Fazendo">Fazendo</option>
                    <option value="Pronto">Pronto</option>                    
                </select>
                <button onClick={alterarStatus}>Alterar Status</button>
            </form>
        </article>
    )

}