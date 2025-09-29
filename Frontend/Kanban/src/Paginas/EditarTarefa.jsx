import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";

const schemaCadTarefa = z.object({
    descricao_tarefa: z
        .string()
        .min(1, "Insira ao menos 1 caractere")
        .max(30, "Insira até 30 caracteres")
        .regex(/^[^\d]+$/, "A descrição não pode conter números"),
    nome_setor: z
        .string()
        .min(1, "Insira o nome do setor")
        .max(30, "Insira até 30 caracteres"),
    prioridade: z.string().min(1, "Escolha a prioridade").max(30),
    status: z.enum(["A FAZER", "FAZENDO", "FEITO"], {
        errorMap: () => ({ message: "Escolha um status válido" }),
    }),
    usuario: z.string().min(1, "Escolha o usuário").max(20),
});

export function EditarTarefa() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaCadTarefa),
        defaultValues: { status: "A FAZER" },
    });

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTarefa = async (taskId) => {
        const base = "http://127.0.0.1:8000/api";
        const endpoints = [`${base}/tarefas/${taskId}/`, `${base}/reservas/${taskId}/`];

        for (const url of endpoints) {
            try {
                const res = await axios.get(url);
                console.log("GET", url, "->", res.data);
                return res.data;
            } catch (err) {
                console.warn("GET falhou:", url, err.response?.status || err.message);
            }
        }
        throw new Error("Nenhum endpoint retornou dados da tarefa.");
    };

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                const uRes = await axios.get("http://127.0.0.1:8000/api/usuario/");
                setUsuarios(uRes.data || []);
                const t = await fetchTarefa(id);
                const mapped = {
                    descricao_tarefa:
                        t.descricao_tarefa ?? t.descricao ?? t.title ?? t.name ?? "",
                    nome_setor:
                        t.nome_setor ?? t.setor ?? t.setor_nome ?? t.sector ?? "",
                    prioridade:
                        (t.prioridade ?? t.priority ?? "").toString().toUpperCase() ?? "",
                    status: (t.status ?? t.estado ?? "").toString().toUpperCase() || "A FAZER",
                    usuario:
                        t.usuario?.id ? String(t.usuario.id) : String(t.usuario ?? ""),
                };
                console.log("mapped para reset:", mapped);
                reset(mapped);
            } catch (err) {
                console.error("Erro ao carregar editar tarefa:", err);
                alert("Erro ao carregar dados da tarefa. Veja o console.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, reset]);

    async function onSubmit(data) {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/reservas/${id}/`, data);
            alert("Tarefa atualizada com sucesso!");
            navigate("/");
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error.response?.data || error);
            alert("Erro ao atualizar tarefa");
        }
    }

    if (loading) return <p>Carregando...</p>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="main" aria-labelledby="form-title">
            <h2 id="form-title">Editar Tarefa</h2>

            <label htmlFor="descricao_tarefa">Descrição Tarefa:</label>
            <input
                type="text"
                id="descricao_tarefa"
                className="custom-input"
                {...register("descricao_tarefa")}
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
                {...register("nome_setor")}
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
                    <option key={u.id} value={String(u.id)}>
                        {u.nome}
                    </option>
                ))}
            </select>
            {errors.usuario && <p id="usuario-error" className="errors">{errors.usuario.message}</p>}

            <button type="submit" className="bottom-cad">Salvar Alterações</button>
        </form>
    );
}