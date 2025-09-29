import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";

// ...mantém importações, schema e useForm como antes

const schemaEditar = z.object({
    prioridade: z.string().min(1, "Escolha a prioridade").max(30),
    status: z.enum(["A FAZER", "FAZENDO", "FEITO"], {
        errorMap: () => ({ message: "Escolha um status válido" }),
    }),
});

export function EditarTarefa() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaEditar),
        defaultValues: { status: "A FAZER", prioridade: "" },
    });

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tarefaOriginal, setTarefaOriginal] = useState({}); // para exibir campos não editáveis

    const fetchTarefa = async (taskId) => {
        const base = "http://127.0.0.1:8000/api";
        const endpoints = [`${base}/tarefas/${taskId}/`, `${base}/reservas/${taskId}/`];

        for (const url of endpoints) {
            try {
                const res = await axios.get(url);
                return res.data;
            } catch (err) { }
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
                const t = await fetchTarefa(id);
                setTarefaOriginal(t); // guarda para exibir

                // Apenas status e prioridade entram no formulário
                const mapped = {
                    prioridade: (t.prioridade ?? t.priority ?? "").toString().toUpperCase(),
                    status: (t.status ?? t.estado ?? "A FAZER").toString().toUpperCase(),
                };
                reset(mapped);
            } catch (err) {
                alert("Erro ao carregar dados da tarefa.");
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
            alert("Erro ao atualizar tarefa");
        }
    }

    if (loading) return <p>Carregando...</p>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="main">
            <h2>Editar Tarefa</h2>

            {/* Campos apenas de visualização */}
            <label>Descrição Tarefa:</label>
            <input type="text" className="custom-input" value={tarefaOriginal.descricao_tarefa ?? tarefaOriginal.descricao ?? ""} readOnly />

            <label>Nome do Setor:</label>
            <input type="text" className="custom-input" value={tarefaOriginal.nome_setor ?? tarefaOriginal.setor ?? ""} readOnly />

            <label>Usuário:</label>
            <input
                type="text"
                className="custom-input"
                value={tarefaOriginal.usuario?.nome ?? tarefaOriginal.usuario ?? ""}
                readOnly
            />

            {/* Campos editáveis */}
            <label>Prioridade:</label>
            <select {...register("prioridade")} className="custom-input">
                <option value="">Selecione</option>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
            </select>
            {errors.prioridade && <p className="errors">{errors.prioridade.message}</p>}

            <label>Status:</label>
            <select {...register("status")} className="custom-input">
                <option value="A FAZER">A Fazer</option>
                <option value="FAZENDO">Fazendo</option>
                <option value="FEITO">Feito</option>
            </select>
            {errors.status && <p className="errors">{errors.status.message}</p>}

            <button type="submit" className="bottom-cad">Salvar Alterações</button>
        </form>
    );
}