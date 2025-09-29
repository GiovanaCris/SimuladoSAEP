import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect } from 'react';

const schemaCadTarefa = z.object({
    descricao_tarefa: z
        .string()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres')
        .transform((val) => {
            let cleaned = val.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, "");
            cleaned = cleaned.replace(/\s{2,}/g, " ");
            return cleaned.trim();
        }),

    nome_setor: z
        .string()
        .min(1, 'Insira o nome do setor')
        .max(30, 'Insira até 30 caracteres')
        .transform((val) => {
            let cleaned = val.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, "");
            cleaned = cleaned.replace(/\s{2,}/g, " ");
            return cleaned.trim();
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
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schemaCadTarefa),
    });

    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/usuario/")
            .then((res) => res.json())
            .then((data) => setUsuarios(data))
            .catch((err) => console.log(err));
    }, []);

    const handleDescricaoChange = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, "");
        valor = valor.replace(/\s{2,}/g, " ");
        if (valor.length > 30) valor = valor.slice(0, 30);
        setValue("descricao_tarefa", valor);
    };

    const handleSetorChange = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, "");
        valor = valor.replace(/\s{2,}/g, " ");
        if (valor.length > 30) valor = valor.slice(0, 30);
        setValue("nome_setor", valor);
    };

    async function obterdados(data) {
        console.log("dados informados pelo user:", data);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/reservas/", data);
            alert(
                `Tarefa cadastrada com sucesso! 🥰\nData de cadastro: ${new Date(
                    response.data.data_cadastro
                ).toLocaleDateString("pt-BR")}`
            );
            reset();
        } catch (error) {
            alert("Não deu certo, tente novamente na próxima! ☹");
            console.log("Erros", error);
        }
    }

    return (
        <form onSubmit={handleSubmit(obterdados)} className="main" aria-labelledby="form-title">
            <h2 id="form-title">Cadastro de Tarefas</h2>

            <label htmlFor="descricao_tarefa">Descrição Tarefa:</label>
            <input
                type="text"
                id="descricao_tarefa"
                className="custom-input"
                placeholder="Digite a descrição da tarefa"
                {...register("descricao_tarefa")}
                onChange={handleDescricaoChange}
                aria-required="true"
                aria-invalid={errors.descricao_tarefa ? "true" : "false"}
                aria-describedby={errors.descricao_tarefa ? "descricao-error" : undefined}
            />
            {errors.descricao_tarefa && (
                <p id="descricao-error" className="errors">{errors.descricao_tarefa.message}</p>
            )}

            <label htmlFor="nome_setor">Nome do Setor:</label>
            <input
                type="text"
                id="nome_setor"
                className="custom-input"
                placeholder="Digite o setor"
                {...register("nome_setor")}
                onChange={handleSetorChange}
                aria-required="true"
                aria-invalid={errors.nome_setor ? "true" : "false"}
                aria-describedby={errors.nome_setor ? "setor-error" : undefined}
            />
            {errors.nome_setor && (
                <p id="setor-error" className="errors">{errors.nome_setor.message}</p>
            )}

            <label htmlFor="prioridade">Prioridade:</label>
            <select
                id="prioridade"
                className="custom-input"
                {...register("prioridade")}
                aria-required="true"
                aria-invalid={errors.prioridade ? "true" : "false"}
                aria-describedby={errors.prioridade ? "prioridade-error" : undefined}
            >
                <option value="">Selecione uma opção</option>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
            </select>
            {errors.prioridade && (
                <p id="prioridade-error" className="errors">{errors.prioridade.message}</p>
            )}

            <label htmlFor="status">Status:</label>
            <select
                id="status"
                className="custom-input"
                {...register("status")}
                defaultValue="A FAZER"
                aria-required="true"
                aria-invalid={errors.status ? "true" : "false"}
                aria-describedby={errors.status ? "status-error" : undefined}
            >
                <option value="A FAZER">A Fazer</option>
                <option value="FAZENDO">Fazendo</option>
                <option value="FEITO">Feito</option>
            </select>
            {errors.status && <p id="status-error" className="errors">{errors.status.message}</p>}

            <label htmlFor="usuario">Usuário:</label>
            <select
                id="usuario"
                {...register("usuario")}
                className="custom-input"
                aria-required="true"
                aria-invalid={errors.usuario ? "true" : "false"}
                aria-describedby={errors.usuario ? "usuario-error" : undefined}
            >
                <option value="">Selecione um usuário</option>
                {usuarios.map((u) => (
                    <option key={u.id} value={u.id.toString()}>
                        {u.nome}
                    </option>
                ))}
            </select>
            {errors.usuario && <p id="usuario-error" className="errors">{errors.usuario.message}</p>}

            <button type="submit" className="bottom-cad">Cadastrar</button>
        </form>
    );
}