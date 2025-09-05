import {Tarefa} from '../components/Tarefas';
export function Coluna({titulo, tarefas = []}){
    return(
        <>
        <section className="coluna">
            <h2 className="titulo">{titulo}</h2>
            {/*Map manipula uma lista (array)*/}
            {tarefas.map(tarefa => {
                console.log("Renderizando", tarefa);
                return<Tarefa key={tarefa.id} tarefa={tarefa}/>; //Key vai mostrar os valores
            })}
        </section>
        </>
    );
}