export function Tarefa({tarefa}){
    return(
        <article>
            <h3 id={`tarefa: ${Tarefa.id}`}>{tarefa.descricao}</h3>
            <dl>
                <dt>Setor:</dt>
                <dd>{tarefa.setor}</dd>

                <dt>Prioride:</dt>
                <dd>{tarefa.prioridade}</dd>
            </dl>
            <button>Editar</button>
            <button>Excluir</button>
            <form>
                <label>Status:</label>
                <select id={tarefa.id} name="status">
                    <option value="">Selecione</option>
                    <option value="A Fazer">A fazer</option>
                    <option value="Fazendo">Fazendo</option>
                    <option value="Feito">Feito</option>
                </select>
                <button>Alterar Status</button>
            </form>
        </article>
    )
}

