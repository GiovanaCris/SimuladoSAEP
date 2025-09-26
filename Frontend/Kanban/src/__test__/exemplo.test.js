import { describe, it, expect } from "vitest";

//describe = como eu descrevo esse teste
describe("Matematica básica ", ()=>{
    //qual cenário de este estou executando
    it("soma 2 + 2", ()=>{
        //o que eu espero receber como respostas
        expect(2 + 2).toBe(4)
    });
});