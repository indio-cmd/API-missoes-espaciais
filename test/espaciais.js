import request from 'supertest'
import app from '../app.js'

describe("Testes da API de Missões Espaciais", () => {
    let id

    test("POST - deve criar uma missão", async () => {
        const resposta = await request(app)
    })
    .post("/missao")
    .send({
        nome: "Missão teste",
        ano: 2026,
        agencia: "NASA",
        status: "planejada"
    })

    expect(resposta.statusCode).toBe(201)
})