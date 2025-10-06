import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Validação do formulário com Zod
const schemaCadUsuario = z.object({
  nome: z
    .string()
    .trim() 
    .min(1, 'Insira ao menos 1 caractere')
    .max(100, 'Insira até 100 caracteres')
    .refine(
      (val) => /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/.test(val),
      "Digite nome completo (nome e sobrenome)"
    )
    .refine(
      (val) => !/(.)\1\1/.test(val),
      "Não use letras repetidas mais de 2 vezes consecutivas"
    ),

  email: z
    .string()
    .min(1, 'Insira seu email')
    .max(50, 'Insira um endereço de email com até 50 caracteres')
    .email("Formato de email inválido")
    .transform((val) => val.trim()),
});

export function CadUsuario() {
    // Hook do React Hook Form com validação Zod
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schemaCadUsuario)
    });

    // Atualiza valor do nome enquanto o usuário digita
    const handleNomeChange = (e) => {
        let valor = e.target.value;

        // Remove caracteres que não são letras ou espaços
        valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, "");

        // Substitui espaços consecutivos por 1
        valor = valor.replace(/\s{2,}/g, " ");

        // Remove letras repetidas mais de 2 vezes consecutivas
        valor = valor.replace(/(.)\1\1+/g, "$1$1"); // AAA -> AA
        setValue("nome", valor);
    };


    // Atualiza valor do email enquanto o usuário digita
    const handleEmailChange = (e) => {
        let valor = e.target.value.trim();
        if (valor.length > 50) valor = valor.slice(0, 50);
        setValue("email", valor);
    };

    // Envia dados para o backend
    async function obterdados(data) {
        console.log('dados informados pelo user:', data);
        try {
            await axios.post("http://127.0.0.1:8000/api/usuario/", data);
            alert("Usuário cadastrado com sucesso");
            reset(); // limpa o formulário
        } catch (error) {
            alert("ÉÉE não rolou, tente da próxima vez");
            console.log("Erros", error);
        }
    }

    return (
        <form onSubmit={handleSubmit(obterdados)} className='main' aria-labelledby="form-title">
            <h2 id="form-title">Cadastro de Usuário</h2>

            {/* Input nome */}
            <label htmlFor='nome'>Nome:</label>
            <input
                type='text'
                id='nome'
                className='custom-input'
                placeholder='Digite seu nome completo'
                {...register("nome")}
                onChange={handleNomeChange}
                aria-required="true"
                aria-invalid={errors.nome ? "true" : "false"}
                aria-describedby={errors.nome ? "nome-error" : undefined}
            />
            {errors.nome && <p id="nome-error" className='errors'>{errors.nome.message}</p>}

            {/* Input email */}
            <label htmlFor='email'>E-mail:</label>
            <input
                type='email'
                id='email'
                className='custom-input'
                placeholder='Digite seu E-mail'
                {...register("email")}
                onChange={handleEmailChange}
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <p id="email-error" className='errors'>{errors.email.message}</p>}

            {/* Botão de envio */}
            <button type='submit' className='bottom-cad'>Cadastrar</button>
        </form>
    );
}