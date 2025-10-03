import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';
import { CadUsuario } from '../Paginas/CadUsuario';
//render: renderiza a minha tela
//screen: eu vejo os elementos que estao sendo exibidos
//fireEvent: simula o que o usuário pode fazer em tela
//waitFor: espera o resultado do evento

describe("Cadstro de usuario", () => {
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

    it("deve mostrar erro quando o email tiver formato inválido", async () => {
        render(<CadUsuario />);

        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Maria Vitoria" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "emailinvalido" } });

        fireEvent.submit(screen.getByRole("form") || screen.getByRole("button", { name: /Cadastrar/i }));
        await waitFor(() => {
            expect(screen.getByText(/Formato de email inválido/i)).toBeTruthy();
        });
    });

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

    it("deve mostrar erro quando o nome tiver apenas espaços em branco", async () => {
        render(<CadUsuario />);

        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "     " } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "teste@email.com" } });

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeTruthy();
        });
    });
});