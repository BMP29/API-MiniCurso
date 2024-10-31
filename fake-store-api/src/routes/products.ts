import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function productsRoutes(app: FastifyInstance) {
    app.post('/products', async (request, reply) => {
        // Define o esquema de validação para o corpo da requisição
        const bodyValidationSchema = z.object({
            title: z.string().min(1),
            price: z.number().positive(),
            category: z.string().min(1),
        })
        
        // Extrai os dados do produto no corpo da requisição e valida com o esquema
        const { title, price, category } = bodyValidationSchema.parse(request.body)

		// Cria um registro na tabela de produtos do banco de dados
        await prisma.product.create({
            data: {
                title,
                price,
                category
            }
        })

		// Retorna uma resposta com o código 201 (created)
        return reply.status(201).send()
    })

    app.get('/products', async (request, reply) => {
        // Busca todos os produtos no banco de dados
        const products = await prisma.product.findMany()

        // Retorna o array de produtos dentro de um objeto como resposta
        return reply.send({ products })
    })

    app.get('/products/:id', async (request, reply) => {
        // Define o esquema de validação para o corpo da requisição
        const paramsValidationSchema = z.object({
            id: z.coerce.number()
        })

	      // Extrai o id do produto dos parametros da rota da requisição e valida com o esquema
        const { id } = paramsValidationSchema.parse(request.params)

        // Busca o produto pelo id
        const product = await prisma.product.findUnique({
            where: {
                id
            }
        })

        // Se o produto não for encontrada, retorna um erro 404
        if (!product) {
            return reply.status(404).send({ error: 'Product not found' })
        }

        // Retorna o produto
        return reply.send({ product })
    })

    app.put('/products/:id', async (request, reply) => {
        // Define o esquema de validação para os parâmetros da rota
        const paramsValidationSchema = z.object({
            id: z.coerce.number()
        })

        // Define o esquema de validação para o corpo da requisição
        const bodyValidationSchema = z.object({
            title: z.string().min(1),
            price: z.number().positive(),
            category: z.string().min(1),
        })

        // Extrai o id do produto dos parametros da rota da requisição e valida com o esquema
        const { id } = paramsValidationSchema.parse(request.params)

        // Extrai os dados do produto no corpo da requisição e valida com o esquema
        const { title, price, category } = bodyValidationSchema.parse(request.body)

        // Busca o produto pelo id
        const product = await prisma.product.findUnique({
            where: {
                id
            }
        })

        // Se o produto não for encontrado, retorna um erro 404
        if (!product) {
            return reply.status(404).send({ error: 'Product not found' })
        }

        // Atualiza o produto no banco de dados
        await prisma.product.update({
            where: {
                id,
            },
            data: {
                title,
                price,
                category
            },
        })

        // Retorna uma resposta com o código 200 (OK)
        return reply.send()
    })

    app.delete('/products/:id', async (request, reply) => {
        // Define o esquema de validação para o corpo da requisição
        const paramsValidationSchema = z.object({
            id: z.coerce.number()
        })

	    // Extrai o id do produto dos parametros da rota da requisição e valida com o esquema
        const { id } = paramsValidationSchema.parse(request.params)
        
        // Deleta o produto do banco de dados
        const product = await prisma.product.delete({
            where: {
                id
            }
        })

        // Se o produto não for encontrado, retorna um erro 404
        if (!product) {
            return reply.status(404).send({ error: 'Product not found' })
        }

        // Retorna uma resposta de sucesso
        return reply.status(204).send() // Status 204 indica que a operação foi bem-sucedida sem conteúdo de retorno
    })

	// outras rotas...
}