//Alterar depois para o meu backend
//resolver junta o zod com o formulário do react
import axios from 'axios'; //É o hook que faz a comunicação com a internet (Http)
//São hooks que permite a validação de interação com o usuário... NUNCA DUVIDE DA CAPACIDADE DO USUÁRIO
//React é comum ver o zod
import { useForm } from 'react-hook-form'; //Hook (use) aqui permite a validação de formulário
import { z } from 'zod'; //Zod é uma descrição de como eu validar, quais seriam as regras
import { zodResolver } from '@hookform/resolvers/zod'; //É o que liga o hook form com o zod

//validação de formulário -- estou usando as regras do zod, que pode ser consultada na web
const schemaCadUsuario = z.object({
    nome: z.string()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres')
        .regex(
            /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
            "Digite nome completo (nome e sobrenome), sem números ou símbolos, sem espaços no início/fim"),


    email: z.string()
        .min(1, 'Insira seu email')
        .max(30, 'Insira um endereço de email com até 30 caracteres')
        .email("Formato de email inválido")
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Formato de email inválido"),
})

export function CadUsuario() {
    // Tratamento para o campo nome (apenas para prevenir entrada inválida antes do submit)
    const handleNomeChange = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, ""); // só letras e espaço
        valor = valor.replace(/\s{2,}/g, " "); // evita espaços duplos
        if (valor.length > 30) valor = valor.slice(0, 30); // máximo 30 chars
        setValue("name", valor);
    };

    // Tratamento para o campo email
    const handleEmailChange = (e) => {
        let valor = e.target.value.trim();
        if (valor.length > 50) valor = valor.slice(0, 50); // máximo 50 chars
        setValue("email", valor);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(schemaCadUsuario)
    })


    async function obterdados(data) {
        console.log('dados informafdos pelo user:', data)

        try {
            await axios.post("http://127.0.0.1:8000/api/usuario/", data);
            alert("Usuário cadastrado com sucesso");
            reset();
        } catch (error) {
            alert("ÉÉE não rolou, tente da proxima vez")
            console.log("Erros", error)
        }
    }

    return (
        <form onSubmit={handleSubmit(obterdados)} className='main'>
            <h2>Cadastro de  Usuário</h2>

            <label htmlFor='nome'>Nome:</label>
            <input type='text' id='nome' className='custom-input' placeholder='Nome seu nome' {...register("nome")} />
            {/*Aqui eu vejo a vaiavel erros no campo nome e exibo a mensagem para o usuario*/}
            {errors.nome && <p className='errors'>{errors.nome.message}</p>}

            <label htmlFor='email'>E-mail:</label>
            <input type='email' id='email' className='custom-input' placeholder='Digite seu E-mail' {...register("email")} />
            {/*Aqui eu vejo a vaiavel erros no campo nome e exibo a mensagem para o usuario*/}
            {errors.email && <p className='errors'>{errors.email.message}</p>}

            <button type='submit' className='bottom-cad'>Cadastrar</button>
        </form>
    )
}