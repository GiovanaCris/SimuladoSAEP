import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CadTarefa } from '../Paginas/CadTarefa';
import { act } from 'react-dom/test-utils';
import axios from "axios";
vi.mock("axios");
import '@testing-library/jest-dom';

describe("Cadastro de tarefas", () => {

    it("A tela é exibida", () => {
        render(<CadTarefa />);

        const setorInput = screen.getByPlaceholderText(/Digite o setor/i);
        const descricaoInput = screen.getByPlaceholderText(/Digite a descrição da tarefa/i);
        const prioridadeSelect = screen.getByLabelText(/Prioridade:/i);
        const statusSelect = screen.getByLabelText(/Status:/i);
        const usuarioSelect = screen.getByLabelText(/Usuário:/i);
        const botao = screen.getByRole("button", { name: /Cadastrar/i });

        expect(setorInput).toBeTruthy();
        expect(statusSelect).toBeTruthy();
        expect(descricaoInput).toBeTruthy();
        expect(usuarioSelect).toBeTruthy();
        expect(prioridadeSelect).toBeTruthy();
        expect(botao).toBeTruthy();
    });


    // TESTES DO CAMPO DESCRIÇÃO
    //Teste de campo vazio
    it("deve mostrar erro quando o campo estiver vazio", async () => {
        render(<CadTarefa />);

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText("Insira ao menos 1 caractere")).toBeTruthy();
        });
    });

    //Aceitar apenas interrogação e exclamação
    it("deve aceitar interrogação e exclamação", async () => {
        render(<CadTarefa />);

        fireEvent.change(screen.getByPlaceholderText(/Digite a descrição da tarefa/i), {
            target: { value: "Tarefa urgente!" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.queryByText(/A descrição só pode conter/i)).toBeNull();
        });
    });

    //Teste de caracteres especiais não permitidos 
    it("deve mostrar erro para caracteres especiais não permitidos", async () => {
        render(<CadTarefa />);

        fireEvent.change(screen.getByPlaceholderText(/Digite a descrição da tarefa/i), {
            target: { value: "Tarefa @ urgente #1" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/A descrição só pode conter/i)).toBeTruthy();
        });
    });

    //Teste de letras repetidas mais de 2 vezes
    it("deve mostrar erro quando houver letras repetidas mais de 2x seguidas", async () => {
        render(<CadTarefa />);

        fireEvent.change(screen.getByPlaceholderText(/Digite a descrição da tarefa/i), {
            target: { value: "Oiii tudo bem?" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Não repita o mesmo caractere/i)).toBeTruthy();
        });
    });

    //Teste de limite máximo
    it("deve mostrar erro se ultrapassar o limite de 255 caracteres", async () => {
        render(<CadTarefa />);

        const textoLongo = "a".repeat(256);
        fireEvent.change(screen.getByPlaceholderText(/Digite a descrição da tarefa/i), {
            target: { value: textoLongo },
        });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Insira até 255 caracteres/i)).toBeTruthy();
        });
    });

    //Teste de limite mínimo
    it("não deve mostrar erro se tiver exatamente 255 caracteres", async () => {
        render(<CadTarefa />);

        const textoLimite = "a".repeat(255);
        fireEvent.change(screen.getByPlaceholderText(/Digite a descrição da tarefa/i), {
            target: { value: textoLimite },
        });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.queryByText(/Insira até 255 caracteres/i)).toBeNull();
        });
    });

    //Teste de espaços no início e fim do texto
    it("deve remover espaços no início e no fim do texto", async () => {
        render(<CadTarefa />);

        fireEvent.change(screen.getByPlaceholderText(/Digite a descrição da tarefa/i), {
            target: { value: "   Teste de espaços   " },
        });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.queryByText(/A descrição não pode conter apenas espaços/i)).toBeNull();
        });
    });

    //TESTES CAMPO SETOR
    //Teste do campo vazio
    it("deve mostrar erro quando o campo estiver vazio", async () => {
        render(<CadTarefa />);
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Insira o nome do setor/i)).toBeTruthy();
        });
    });

    //Teste de caracteres especiais
    it("deve mostrar erro quando houver caracteres especiais", async () => {
        render(<CadTarefa />);
        const setorInput = screen.getByPlaceholderText(/Digite o setor/i);

        fireEvent.change(setorInput, { target: { value: "Setor@#%" } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            screen.getByText(/só pode conter letras e espaços/i)
        });
    });

    //Teste de números no campo
    it("deve mostrar erro quando houver números", async () => {
        render(<CadTarefa />);
        const setorInput = screen.getByPlaceholderText(/Digite o setor/i);

        fireEvent.change(setorInput, { target: { value: "Setor123" } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/só pode conter letras e espaços/i)).toBeTruthy();
        });
    });

    //Teste de letras repetidas mais de duas vezes
    it("deve mostrar erro quando houver letras repetidas mais de 2x", async () => {
        render(<CadTarefa />);
        const setorInput = screen.getByPlaceholderText(/Digite o setor/i);

        fireEvent.change(setorInput, { target: { value: "Seeeeetor" } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Não repita o mesmo caractere mais de duas vezes/i)).toBeTruthy();
        });
    });

    //Teste de limite máximo
    it("deve mostrar erro quando exceder o limite de caracteres (mais de 100)", async () => {
        render(<CadTarefa />);
        const setorInput = screen.getByPlaceholderText(/Digite o setor/i);
        const textoGrande = "A".repeat(101);

        fireEvent.change(setorInput, { target: { value: textoGrande } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Insira até 100 caracteres/i)).toBeTruthy();
        });
    });

    //Teste de espaços em branco
    it("deve permitir espaços antes e depois e ainda validar corretamente", async () => {
        render(<CadTarefa />);
        const setorInput = screen.getByPlaceholderText(/Digite o setor/i);

        fireEvent.change(setorInput, { target: { value: "   SetorTeste   " } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            // Se não houver erro, o teste passa (pode verificar que não há mensagem de erro)
            expect(screen.queryByText(/Insira/)).toBeNull();
            expect(screen.queryByText(/caracteres inválidos/)).toBeNull();
        });
    });

    //Teste ao colar um texto que excede a quantidade do campo
    it("deve mostrar erro ao colar um texto enorme", async () => {
        render(<CadTarefa />);
        const setorInput = screen.getByPlaceholderText(/Digite o setor/i);
        const textoEnorme = "A".repeat(1000);

        fireEvent.paste(setorInput, { clipboardData: { getData: () => textoEnorme } });
        fireEvent.change(setorInput, { target: { value: textoEnorme } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Insira até 100 caracteres/i)).toBeTruthy();
        });
    });

    //TESTES DO CAMPO PRIORIDADE
    it("deve ter uma prioridade pré-selecionada ao renderizar", () => {
        render(<CadTarefa />);
        const prioridadeSelect = screen.getByLabelText(/Prioridade:/i);

        // Verifica que a primeira opção selecionada é a que você definiu
        expect(prioridadeSelect.value).toBe(""); // "" porque a primeira opção é "Selecione uma opção"
    });

    it("deve atualizar a prioridade quando o usuário selecionar uma opção", async () => {
        render(<CadTarefa />);
        const prioridadeSelect = screen.getByLabelText(/Prioridade:/i);

        fireEvent.change(prioridadeSelect, { target: { value: "ALTA" } });

        await waitFor(() => {
            expect(prioridadeSelect.value).toBe("ALTA");
        });
    });

    it("deve reconhecer a prioridade pré-selecionada se o usuário não alterar", async () => {
        render(<CadTarefa />);
        const prioridadeSelect = screen.getByLabelText(/Prioridade:/i);
        expect(prioridadeSelect.value).toBe(""); // valor inicial
    });

    //TESTES DO CAMPO STATUS
    it("deve vir com o status padrão 'A FAZER'", () => {
        render(<CadTarefa />);
        const statusSelect = screen.getByLabelText(/Status:/i);

        expect(statusSelect.value).toBe("A FAZER");
    });

    it("deve atualizar o status quando o usuário selecionar outra opção", async () => {
        render(<CadTarefa />);
        const statusSelect = screen.getByLabelText(/Status:/i);

        fireEvent.change(statusSelect, { target: { value: "FEITO" } });

        await waitFor(() => {
            expect(statusSelect.value).toBe("FEITO");
        });
    });

    it("deve reconhecer o status padrão se o usuário não alterar", () => {
        render(<CadTarefa />);
        const statusSelect = screen.getByLabelText(/Status:/i);

        expect(statusSelect.value).toBe("A FAZER");
    });

    //TESTES DO CAMPO NOME DO USUÁRIO
    it("deve reconhecer o usuário selecionado", async () => {
        // Mock da lista de usuários
        const mockUsuarios = [{ id: 1, nome: "João" }, { id: 2, nome: "Maria" }];

        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockUsuarios)
            })
        );

        render(<CadTarefa />);

        // Espera a lista ser carregada
        await waitFor(() => expect(screen.getByText("João")).toBeTruthy());

        const usuarioSelect = screen.getByLabelText(/Usuário:/i);

        fireEvent.change(usuarioSelect, { target: { value: "2" } }); // seleciona Maria

        await waitFor(() => {
            expect(usuarioSelect.value).toBe("2");
        });
    });

    it("deve mostrar erro quando nenhum usuário for selecionado", async () => {
        render(<CadTarefa />);

        const botao = screen.getByRole("button", { name: /Cadastrar/i });
        fireEvent.click(botao);

        await waitFor(() => {
            expect(screen.getByText(/Escolha o usuário/i)).toBeTruthy();
        });
    });

    //resetar os campos do formulário
    it("deve resetar os campos após submissão", async () => {
        // Mock do backend
        axios.post.mockResolvedValueOnce({ data: { data_cadastro: "2025-10-10T10:00:00Z" } });

        render(<CadTarefa />);

        const setorInput = screen.getByPlaceholderText(/Digite o setor/i);
        const descricaoInput = screen.getByPlaceholderText(/Digite a descrição da tarefa/i);
        const prioridadeSelect = screen.getByLabelText(/Prioridade:/i);
        const statusSelect = screen.getByLabelText(/Status:/i);
        const usuarioSelect = screen.getByLabelText(/Usuário:/i);
        const botao = screen.getByRole("button", { name: /Cadastrar/i });

        // Preenche os campos
        fireEvent.change(setorInput, { target: { value: "SetorTeste" } });
        fireEvent.change(descricaoInput, { target: { value: "Descrição válida!" } });
        fireEvent.change(prioridadeSelect, { target: { value: "ALTA" } });
        fireEvent.change(statusSelect, { target: { value: "FEITO" } });
        fireEvent.change(usuarioSelect, { target: { value: "1" } });

        // Envia
        await act(async () => {
            fireEvent.click(botao);
        });

        await waitFor(() => {
            expect(setorInput.value).toBe("");
            expect(descricaoInput.value).toBe("");
            expect(prioridadeSelect.value).toBe("");
            expect(statusSelect.value).toBe("A FAZER");
            expect(usuarioSelect.value).toBe("");
        });
    });
});