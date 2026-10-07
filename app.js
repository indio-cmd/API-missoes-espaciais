import express from "express";
const app = express();
app.use(express.json());

// app.js (trecho)
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const missao = [
    {
        id : 1,
        nome: "Apollo 11",
        ano: 1967,
        agencia: "NASA",
        status: "concluida"
    },
    {
         id : 2,
        nome: "Voyager 1",
        ano: 1977,
        agencia: "NASA",
        status: "em operação"
    },
    {
        id : 3,
        nome: "Artemis 2",
        ano: 2026,
        agencia: "NASA",
        status: "concluida"
    },
     {
          id : 4,
        nome: " SpaceShip",
        ano: 2004,
        agencia: "NASA",
        status: "concluida"
     }
]


/**
 * @openapi
 * /missões:
 *   get:
 *     summary: Listar missões
 *     description: Retorna a lista de missões, com filtro opcional por título
 *     parameters:
 *       - in: query
 *         name: titulo
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra as missões pelo título
 *     responses:
 *       200:
 *         description: Lista de missões retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                  nome:
 *                     type: string
 *                  ano:
 *                   type: integer
 *                   agencia:
 *                     type: string
 *                   status:
 *                     type: string
 */
app.get('/missao', (req, res) =>{
    const titulo = req.query?.titulo || null
    let missaoFiltrados = null
    if(titulo !== null){
      missaoFiltrados = missao.filter(item => item.titulo.toLowerCase()
                                                    .includes(titulo.toLowerCase()));
    }

    missaoFiltrados = missaoFiltrados ?? missao;
    res.status(200).json(missaoFiltrados);
});

/**
 * @openapi
 * /missoess/{id}:
 *   get:
 *     summary: Busca uma missão pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: missoes encontrado
 *       404:
 *         description: missoes não encontrado
 */
app.get('/missoess/:id', (req, res) =>{
    const id = Number(req.params?.id);

    const missoes = missao.find(item => item.id === id);

    if(!missoes){
        return res.status(404).json({error: "missão não encontrado"})
    }

    res.status(200).json(missoes);

});


/**
 * @openapi
 * /livros:
 *   post:
 *     summary: Cria uma nova missão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - agencia
 *               -ano
 *               -status
 *               properties:
 *               nome:
 *                 type: string
 *               agencia:
 *                 type: string
 *               ano:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Missão criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
app.post('/missao', (req, res)=>{

    const nome = req.body?.nome || null;
    const agencia = req.body?.agencia || null;
    const ano = req.body?.ano || null;
    const status = req.body?.status || null;

      if(!agencia){
        return res.status(400).json({error: "agencia é obrigatório"})
      }

      if(!ano){
        return res.status(400).json({error: "Ano é obrigatório"})
      }

      if(!status){
        return res.status(400).json({error: "status é obrigatório"})
      }

      if(!nome){
        return res.status(400).json({error: "Nome é obrigatório"})
      }

        const novamissao = {
            id: missao.length + 1,
            nome : nome,
            ano: ano,
            agencia : agencia,
            status: req.body?.status
        }

        missao.push(novamissao);

        res.status(201).json({message: "Missão criada com sucesso", missao: novamissao });

});

/**
 * @openapi
 * /missao/{id}:
 *   put:
 *     summary: Atualiza uma missão pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                nome:
 *                 type: string
 *               agencia:
 *                 type: string
 *               ano:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Missão atualizado com sucesso
 *       404:
 *         description: Missão não encontrado
 */
app.put('/missao/:id', (req, res) => {
    const id = Number(req.params.id);
    const missoes = missao.find(item => item.id === id);
    if(!missoes){
        return res.status(404).json({error: "Missão não encontrado"})
    }

    if(req?.body?.nome && req.body.nome !== ""){
        missoes.nome = req.body.titulo;
    }

    if(req?.body?.agencia && req.body.agencia !== ""){
        missoes.agencia = req.body.agencia;
    }

     if(req?.body?.ano && req.body.ano !== ""){
        missoes.ano = req.body.ano;
    }


    if(req?.body?.status && req.body.status !== ""){
        missoes.status = req.body.status;
    }

    res.status(200).json({message: "Missão atualizado com sucesso", missão: missoes})
});

/**
 * @openapi
 * /missao/{id}:
 *   delete:
 *     summary: Exclui uma missão pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: missao excluido com sucesso
 *       404:
 *         description: missao não encontrado
 */
app.delete('/missao/:id', (req, res) =>{
    const id = Number(req.params.id);
    const indice = missao.findIndex(item => item.id === id)

    if(indice === -1){
        return res.status(404).json({ error: "Missão não encontrado" })
    }

    missao.splice(indice, 1);

    res.status(204).send('')

});

app.get("/anime", async (req, res) => {
  const page = req.query.id

  const url = `https://api.jikan.moe/v4/anime/${page}`


  try {

      const resposta = await fetch(url)
      const dados = await resposta.json()

    const dados_para_retomar = {
      titulo : dados.data.title,
      duracao : dados.data.duration,
      resumo : dados.data.synopsis
    }
    
    res.status(200).json(dados_para_retomar)
  } catch (error) {
     res.status(502).json({ erro: 'Falha ao consultar serviço de anime' });
  }
})

export default app;