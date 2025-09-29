import { Link } from "react-router-dom";

export function BarraNavegacao() {
  return (
    <nav className="barra">
      <ul>
        <li><Link to="/cadUsuario">Cadastro de Usuário</Link></li> {/*Link para a página de cadastro de usuário*/}
        <li><Link to="/cadTarefa">Cadastro de Tarefa</Link></li> {/*Link para a página de cadastro de tarefa*/}
        <li><Link to="/">Gerenciamento de Tarefas</Link></li> {/*Link para a página de gerenciamento de tarefas*/}
      </ul>
    </nav>
  );
}