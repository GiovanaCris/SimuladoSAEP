import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';
import { CadTarefa } from '../Paginas/CadTarefa';
import axios from "axios";
vi.mock("axios");

describe("Cadstro de tarefas", () => {

    it("A tela é exibida", () => {
        render(<CadTarefa />);

        const nomeSetor = screen.getByLabelText(/Nome/i);
        const descricaoTarefa = screen.getByLabelText(/E-mail/i);
        const prioridade = screen.getByLabelText(/E-mail/i);
        const status = screen.getByLabelText(/E-mail/i);
        const usuario = screen.getByLabelText(/E-mail/i);
        const botao = screen.getByRole("button", { name: 'Cadastrar' });

        expect(nomeInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(botao).toBeTruthy();   
    });
})