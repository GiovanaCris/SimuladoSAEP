import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect } from 'react';

// Validação com Zod (permitindo qualquer caractere)
const schemaCadTarefa = z.object({
    descricao_tarefa: z
        .string()
        .trim()
        .min(1, 'Insira ao menos 1 caractere')
        .max(255, 'Insira até 255 caracteres')
        .refine((val) => /^[a-zA-Z0-9\s?!]*$/.test(val), {
            message: 'A descrição só pode conter letras, números, espaços, "?" e "!"',
        })
        .refine((val) => !/(.)\1{2,}/.test(val), {
            message: 'Não repita o mesmo caractere mais de duas vezes seguidas',
        })

        //Valida espaços em branco com o trim
        .refine((val) => val.trim().length > 0, {
            message: 'A descrição não pode conter apenas espaços em branco',
        }),

    nome_setor: z
        .string()
        .min(1, 'Insira o nome do setor')
        .max(100, 'Insira até 100 caracteres')
        .refine((val) => val.trim().length > 0, { message: 'A descrição não pode conter apenas espaços em branco' })
        .refine((val) => !/(.)\1{2,}/.test(val), {
            message: 'Não repita o mesmo caractere mais de duas vezes',
        })
        .refine((val) => /^[a-zA-Z\s]*$/.test(val), {
            message: 'O nome do setor só pode conter letras e espaços',
        }),

    prioridade: z
        .string()
        .min(1, 'Escolha a prioridade')
        .max(30, 'Escolha apenas 1 prioridade'),

    status: z.enum(['A FAZER', 'FAZENDO', 'FEITO'], {
        errorMap: () => ({ message: 'Escolha um status válido' }),
    }),

    usuario: z
        .string()
        .min(1, 'Escolha o usuário')
        .max(10, 'Escolha apenas um usuário'),
});

export function CadTarefa() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schemaCadTarefa),
        defaultValues: {
            status: "A FAZER"
        }
    });

    const [usuarios, setUsuarios] = useState([]);

    // Busca lista de usuários
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/usuario/")
            .then((res) => res.json())
            .then((data) => setUsuarios(data))
            .catch((err) => console.log(err));
    }, []);

    // Envia dados ao backend
    async function obterdados(data) {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/reservas/", data);
            alert(
                `Tarefa cadastrada com sucesso! 🥰\nData de cadastro: ${new Date(
                    response.data.data_cadastro
                ).toLocaleDateString("pt-BR")}`
            );
            reset({ // passa novamente os valores padrão
                nome_setor: "",
                descricao_tarefa: "",
                prioridade: "",
                status: "A FAZER",
                usuario: ""
            });
        } catch (error) {
            alert("Não deu certo, tente novamente na próxima! ☹");
            console.log("Erros", error);
        }
    }

    return (
        <form onSubmit={handleSubmit(obterdados)} className="main" aria-labelledby="form-title">
            <h2 id="form-title">Cadastro de Tarefas</h2>

            {/* Nome do setor */}
            <input
                type="text"
                id="nome_setor"
                className="custom-input"
                placeholder="Digite o setor"
                {...register("nome_setor")}
            />
            {errors.nome_setor && <p className="errors">{errors.nome_setor.message}</p>}

            {/* Descrição da tarefa */}
            <textarea
                id="descricao_tarefa"
                className="custom-textarea"
                placeholder="Digite a descrição da tarefa"
                {...register("descricao_tarefa")}
            />
            {errors.descricao_tarefa && <p className="errors">{errors.descricao_tarefa.message}</p>}

            {/* Prioridade */}
            <label htmlFor="prioridade">Prioridade:</label>
            <select id="prioridade" className="custom-input" {...register("prioridade")}>
                <option value="">Selecione uma opção</option>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
            </select>
            {errors.prioridade && <p className="errors">{errors.prioridade.message}</p>}

            {/* Status */}
            <label htmlFor="status">Status:</label>
            <select id="status" className="custom-input" {...register("status")}>
                <option value="A FAZER">A Fazer</option>
                <option value="FAZENDO">Fazendo</option>
                <option value="FEITO">Feito</option>
            </select>
            {errors.status && <p className="errors">{errors.status.message}</p>}

            {/* Usuário */}
            <label htmlFor="usuario">Usuário:</label>
            <select id="usuario" {...register("usuario")} className="custom-input">
                <option value="">Selecione um usuário</option>
                {usuarios.map(u => (
                    <option key={u.id} value={u.id.toString()}>
                        {u.nome}
                    </option>
                ))}
            </select>
            {errors.usuario && <p className="errors">{errors.usuario.message}</p>}

            <button type="submit" className="bottom-cad">Cadastrar</button>
        </form>
    );
}