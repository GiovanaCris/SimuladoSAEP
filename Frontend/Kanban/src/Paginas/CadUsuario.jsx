//Alterar depois para o meu backend
//resolver junta o zod com o formulário do react
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

//validação de formulário
const schemaCadUsuario = z.object({
    nome: z.string()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres'),
    email: z.string()
        .min(1, 'Insira seu email')
        .max(30, 'Insira um endereço de email com até 30 caracteres')
        .email("Formato de email inválido"),
})

export function CadUsuario() {
    return (
        <form>
            <h2>Cadastro de  Usuário</h2>

            <label>Nome:</label>
            <input type='text' placeholder='Nome seu nome' required />

            <label>E-mail:</label>
            <input type='email' placeholder='Digite seu E-mail' required />

            <button type='submit'>Cadastrar</button>
        </form>
    )
}