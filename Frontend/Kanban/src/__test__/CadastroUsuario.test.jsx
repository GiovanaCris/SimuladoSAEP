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
        const nomeInput = screen.getByLabelText(/nome/i);
        const emailInput = screen.getByLabelText(/e-mail/i);
        const botao = screen.getByRole("button", { name: 'Cadastrar' });

        expect(nomeInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(botao).toBeTruthy();
    })
})