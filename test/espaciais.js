import request from "supertest"
import app from "./app.js"

describe("Testes da API de Missões Espaciais", () => {

    let id

    test("POST - deve criar uma missão", async () => {
        const resposta = await request(app)
            .post("/missao")
            .send({
                nome: "Missão Teste",
                ano: 2026,
                agencia: "NASA",
                status: "planejada"
            })

        expect(resposta.statusCode).toBe(201)

        expect(resposta.body).toHaveProperty("id")

        id = resposta.body.id
    })

    test("GET - deve buscar todas as missões", async () => {
        const resposta = await request(app)
            .get("/missao")

        expect(resposta.statusCode).toBe(200)

        expect(Array.isArray(resposta.body)).toBe(true)
    })

    test("GET - deve buscar uma missão pelo ID", async () => {
        const resposta = await request(app)
            .get(`/missoess/${id}`)

        expect(resposta.statusCode).toBe(200)

        expect(resposta.body).toHaveProperty("id", id)
    })

    test("PUT - deve alterar uma missão", async () => {
        const resposta = await request(app)
            .put(`/missao/${id}`)
            .send({
                nome: "Missão Teste Alterada",
                ano: 2027,
                agencia: "SpaceX",
                status: "em andamento"
            })

        expect(resposta.statusCode).toBe(200)
    })

    test("GET - deve confirmar que a missão foi alterada", async () => {
        const resposta = await request(app)
            .get(`/missoess/${id}`)

        expect(resposta.statusCode).toBe(200)

        expect(resposta.body.nome).toBe("Missão Teste Alterada")
    })

    test("DELETE - deve deletar uma missão", async () => {
        const resposta = await request(app)
            .delete(`/missao/${id}`)

        expect(resposta.statusCode).toBe(200)
    })

    test("GET - deve retornar 404 para missão deletada", async () => {
        const resposta = await request(app)
            .get(`/missoess/${id}`)

        expect(resposta.statusCode).toBe(404)
    })

})