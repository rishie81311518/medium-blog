import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
  
const body = await c.req.json();

const user = await prisma.user.create({
  data: {
    email: body.email,
    password: body.password
  }
})
 
const token = await sign({id: user.id}, "JWT_SECRET")

return c.json({
  jwt: token
})

 
})


app.post('/api/v1/signin', async (c) => {
const prisma = new PrismaClient({
  datasourceUrl: c.env?.DATABASE_URL,

}).$extends(withAccelerate());
const body = await c.req.