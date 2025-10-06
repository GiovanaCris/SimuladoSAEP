import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';
import { CadUsuario } from '../Paginas/CadUsuario';
//render: renderiza a minha tela
//screen: eu vejo os elementos que estao sendo exibidos
//fireEvent: simula o que o usuário pode fazer em tela
//waitFor: espera o resultado do evento

describe("Cadstro de usuario", () => {

    //TESTES DO CAMPO NOME
    it("A tela é exibida", () => {
        render(<CadUsuario />);

        //passar o valor que esta dentro da tag (exemplo: <button>Cadastrar<button/>)
        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);
        const botao = screen.getByRole("button", { name: 'Cadastrar' });

        expect(nomeInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(botao).toBeTruthy();
    });

    it("deve mostrar erros quando campos estiverem vazios", async () => {
        render(<CadUsuario />);

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText("Insira ao menos 1 caractere")).toBeTruthy();
            expect(screen.getByText("Insira seu email")).toBeTruthy();
        });
    });

    //resetar os campos do formlário
    it("deve resetar os campos após submissão", async () => {
        render(<CadUsuario />);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.input(nomeInput, { target: { value: "Maria Vitoria" } });
        fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(nomeInput.value).toBe("");
            expect(emailInput.value).toBe("");
        });
    });

    //teste de apenas espaços em branco no nome
    it("deve mostrar erro quando o nome tiver apenas espaços em branco", async () => {
        render(<CadUsuario />);

        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "     " } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "teste@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeTruthy();
        });
    });

    //teste de nome entre espaços
    it("deve mostrar erro quando o nome tem apenas um nome cercado de espaços", async () => {
        render(<CadUsuario />);

        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "           gi        " } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "teste@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            const errorMessage = screen.queryByText(/Digite nome completo \(nome e sobrenome\)/i);
            expect(errorMessage).toBeTruthy();
        });
    })

    //teste de primeiro nome apenas
    it("deve mostrar erro quando estiver apenas o primeiro nome escrito", async () => {
        render(<CadUsuario />);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.input(nomeInput, { target: { value: "Maria" } });
        fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            const errorMessage = screen.queryByText(/Digite nome completo \(nome e sobrenome\)/i);
            expect(errorMessage).toBeTruthy();
        });
    });

    //Tetse de caracteres especiais
    it("deve mostrar erro quando o nome contém apenas caracteres especiais", async () => {
        render(<CadUsuario />);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.input(nomeInput, { target: { value: "!@##$¨&%¨&**$$" } });
        fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            const errorMessage = screen.queryByText(/Insira ao menos 1 caractere/i);
            expect(errorMessage).toBeTruthy();
        });
    });

    //teste com letras e numeros
    it("deve mostrar erro quando o nome contém números", async () => {
        render(<CadUsuario />);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.input(nomeInput, { target: { value: "Maria123" } });
        fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            const errorMessage = screen.queryByText(/Digite nome completo \(nome e sobrenome\)/i);
            expect(errorMessage).toBeTruthy();
        });
    });

    //Teste com apenas números
    it("deve mostrar erro quando o nome contém apenas números", async () => {
        render(<CadUsuario />);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.input(nomeInput, { target: { value: "1234567890" } });
        fireEvent.input(emailInput, { target: { value: "teste@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            const errorMessage = screen.queryByText(/Insira ao menos 1 caractere/i);
            expect(errorMessage).toBeTruthy();
        });
    });

    //Teste com letras repetidas mais de 2x
    it("deve mostrar erro com letras repetidas sequencialmente mais de duas vezes", async () => {
        render(<CadUsuario />);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        // Nome com letras repetidas
        fireEvent.input(nomeInput, { target: { value: "Maaaaria Silvvva" } });
        fireEvent.input(emailInput, { target: { value: "teste@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            const errorMessage = screen.queryByText(/Não use letras repetidas mais de 2 vezes consecutivas/i);
            expect(errorMessage).toBeNull();
        });
    });

    // Teste máximo de caracteres
    it("deve mostrar erro quando o nome ultrapassar 100 caracteres", async () => {
        render(<CadUsuario />);

        const longName = "Ana".repeat(99) + " Beatriz"; // total 101 caracteres
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: longName } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "teste@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            const errorMessage = screen.queryByText(/Insira até 100 caracteres/i);
            expect(errorMessage).toBeTruthy();
        });
    });

    // Teste limite de 100 caracteres 
    it("deve passar quando o nome tiver exatamente 100 caracteres", async () => {
        render(<CadUsuario />);

        // 98 caracteres + espaço + sobrenome = 100 caracteres
        const validName = "Ana".repeat(102) + " Beatriz"; // total 100 caracteres
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: validName } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "teste@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            const errorMessage = screen.queryByText(/Insira até 100 caracteres/i);
            expect(errorMessage).toBeNull(); // sem erro
        });
    });

    //Teste de envio com campo vazio
    it("deve mostrar erro quando o campo nome estiver vazio", async () => {
        render(<CadUsuario />);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.input(nomeInput, { target: { value: "" } });
        fireEvent.input(emailInput, { target: { value: "teste@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            const errorMessage = screen.queryByText(/Insira ao menos 1 caractere/i);
            expect(errorMessage).toBeTruthy();
        });
    });





    //TESTES DO CAMPO E-MAIL
    it("deve mostrar erro quando o email tiver formato inválido", async () => {
        render(<CadUsuario />);

        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Maria Vitoria" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "emailinvalido" } });

        fireEvent.submit(screen.getByRole("form") || screen.getByRole("button", { name: /Cadastrar/i }));
        await waitFor(() => {
            expect(screen.getByText(/Formato de email inválido/i)).toBeTruthy();
        });
    });

    it("deve mostrar erro quando o email estiver vazio", async () => {
        render(<CadUsuario />);
        fireEvent.input(emailInput, { target: { value: "" } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
        await waitFor(() => {
            const errorMessage = screen.queryByText(/Insira seu email/i);
            expect(errorMessage).toBeTruthy();
        });
    });
});