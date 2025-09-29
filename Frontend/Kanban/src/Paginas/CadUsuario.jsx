import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schemaCadUsuario = z.object({
    nome: z
        .string()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres')
        .transform((val) => {
            let cleaned = val.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, "");
            cleaned = cleaned.replace(/\s{2,}/g, " ");
            cleaned = cleaned.trim();
            return cleaned;
        })
        .refine(
            (val) =>
                /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/.test(val),
            "Digite nome completo (nome e sobrenome)"
        ),

    email: z
        .string()
        .min(1, 'Insira seu email')
        .max(50, 'Insira um endereço de email com até 50 caracteres')
        .email("Formato de email inválido")
        .transform((val) => val.trim()),
});

export function CadUsuario() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(schemaCadUsuario)
    });

    const handleNomeChange = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, "");
        valor = valor.replace(/\s{2,}/g, " ");
        setValue("nome", valor);
    };

    const handleEmailChange = (e) => {
        let valor = e.target.value.trim();
        if (valor.length > 50) valor = valor.slice(0, 50);
        setValue("email", valor);
    };

    async function obterdados(data) {
        console.log('dados informados pelo user:', data);
        try {
            await axios.post("http://127.0.0.1:8000/api/usuario/", data);
            alert("Usuário cadastrado com sucesso");
            reset();
        } catch (error) {
            alert("ÉÉE não rolou, tente da próxima vez");
            console.log("Erros", error);
        }
    }

    return (
        <form onSubmit={handleSubmit(obterdados)} className='main' aria-labelledby="form-title">
            <h2 id="form-title">Cadastro de Usuário</h2>

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

            <button type='submit' className='bottom-cad'>Cadastrar</button>
        </form>
    );
}
