import './styles/main.scss'; //Aqui já importa tudo
import { BrowserRouter } from 'react-router-dom';
import { Rotas } from '../Rotas/rotas';

function App() {
  
  return (
    <BrowserRouter>
      <Rotas/>
    </BrowserRouter>
  );
}
export default App
