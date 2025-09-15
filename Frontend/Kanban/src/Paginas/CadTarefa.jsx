import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect } from 'react';

const schemaCadTarefa = z.object({
    descricao_tarefa: z.string()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres'),

    nome_setor: z.string()
        .min(1, 'Insira seu email')
        .max(30, 'Insira um endereço de email com até 30 caracteres'),

    prioridade: z.string()
        .min(1, 'Escolha a prioridade')
        .max(30, 'Escolha apenas 1 prioridade'),

    status: z.enum(['A FAZER', 'FAZENDO', 'FEITO'], { 
    errorMap: () => ({ message: 'Escolha um status válido' })
}),

    usuario: z.string()
        .min(1, 'Escolha o usuário')
        .max(10, 'Escolha apensas um usuário')
})
export function CadTarefa() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(schemaCadTarefa)
    })

    const [usuarios, setUsuarios] = useState([]); // ✅

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/usuario/")
            .then(res => res.json())
            .then(data => setUsuarios(data))
            .catch(err => console.log(err));
    }, []);

    async function obterdados(data) {
        console.log('dados informados pelo user:', data)

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/reservas/", data);
            alert(`Tarefa cadastrada com sucesso! 🥰\nData de cadastro: ${new Date(response.data.data_cadastro).toLocaleDateString('pt-BR')}`);
            reset();
        } catch (error) {
            alert("Não deu certo, tente novamente na próxima! ☹")
            console.log("Erros", error)
        }
    }

    return (
        <form onSubmit={handleSubmit(obterdados)} className='main'>
            <h2>Cadastro de Tarefas</h2>

            <label>Descrição Tarefa:</label>
            <input type='text' className='custom-input' placeholder='Digite a descrição da tarefa:' {...register("descricao_tarefa")} />
            {errors.descricao_tarefa && <p className='errors'>{errors.descricao_tarefa.message}</p>}

            <label>Nome do Setor:</label>
            <input type='text' className='custom-input' placeholder='Digite o setor:' {...register("nome_setor")} />
            {errors.nome_setor && <p className='errors'>{errors.nome_setor.message}</p>}

            <label>Prioridade:</label>
            <select
                className='custom-input'
                {...register("prioridade")}
            >
                <option value="">Selecione uma opção</option>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
            </select>
            {errors.prioridade && <p className='errors'>{errors.prioridade.message}</p>}

            <label>Status:</label>
            <select
                className='custom-input'
                {...register("status")}
                defaultValue="A FAZER"
            >
                <option value="A FAZER">A Fazer</option>
                <option value="FAZENDO">Fazendo</option>
                <option value="FEITO">Feito</option>
            </select>
            {errors.status && <p className='errors'>{errors.status.message}</p>}

            <label>Usuário:</label>
            <select {...register("usuario")} className="custom-input">
                <option value="">Selecione um usuário</option>
                {usuarios.map(u => (
                    <option key={u.id} value={u.id.toString()}>{u.nome}</option>
                ))}
            </select>
            {errors.usuario && <p className="errors">{errors.usuario.message}</p>}

            <button type='submit' className='bottom-cad'>Cadastrar</button>
        </form>
    )
}