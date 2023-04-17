import express, { NextFunction, Request, Response } from "express"
const app = express()
import dotenv from "dotenv"
import { prisma } from "./services/prisma"
import { userRegisterSchema, userSigninSchema } from "./schemas/users"
import { filterSensetiveInfoForClient } from "./helpers"
import { Prisma } from "@prisma/client"
import jwt from "jsonwebtoken"
dotenv.config()

app.use(express.json())

async function ensureAuth(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers["authorization"]
  if (!authorizationHeader)
    return res.status(401).json({ message: "Usuário não autenticado." })
  const [bearer, token] = authorizationHeader.split(" ")

  if (bearer.toLowerCase() !== "bearer") {
    return res.status(401).json({ message: "Formato de token inválido." })
  }

  try {
    if (!jwt.verify(token, process.env.SERVER_SECRET as string)) {
      return res.status(401).json({ message: "Token inválido." })
    }
  } catch (error) {
    return res.status(500).json(error)
  }

  const decodedToken = jwt.decode(token, {
    json: true,
  })
  if (decodedToken && decodedToken.sub) {
    req.username = decodedToken.sub
  }

  next()
}

app.get("/whoami", ensureAuth, async (req: Request, res: Response) => {
  const { username } = req

  return res.json({ username })
})

app.get("/users", ensureAuth, async (req: Request, res: Response) => {
  const usersFromDatabase = await prisma.user.findMany()

  const users = filterSensetiveInfoForClient(usersFromDatabase)

  return res.json(users)
})

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, password, profile_pic, username } = userRegisterSchema.parse(
      req.body
    )

    const databaseRawResponse = await prisma.user.create({
      data: {
        password,
        profile_pic: profile_pic ?? null,
        username,
        name: name ?? null,
      },
    })

    const clientDatabaseResponse =
      filterSensetiveInfoForClient(databaseRawResponse)

    return res.status(201).json(clientDatabaseResponse)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": {
          if (error.meta) {
            const target = error.meta.target as string[]
            const fields = target.join(", ")
            const singularField = `Já existe uma conta com o campo: ${fields}.`
            const multipleFields = `Já existem contas com os campos: ${fields}.`
            return res.status(400).json({
              message: target.length === 1 ? singularField : multipleFields,
            })
          }
          return
        }
      }
    }
  }
})

app.post("/signin", async (req: Request, res: Response) => {
  try {
    const { password, username } = userSigninSchema.parse(req.body)

    const userFromDatabase = await prisma.user.findFirstOrThrow({
      where: {
        username,
      },
    })

    const passwordMatch = userFromDatabase.password === password
    if (!passwordMatch) throw new Error("Senha incorreta.")

    const user = filterSensetiveInfoForClient(userFromDatabase)

    const accessToken = jwt.sign({}, process.env.SERVER_SECRET as string, {
      subject: username,
      expiresIn: "20m",
    })

    return res.json({
      accessToken,
      user,
    })
  } catch (error) {
    return res.status(400).json(error)
  }
})

app.listen(process.env.PORT, () =>
  console.log("[server] Server is running on port " + process.env.PORT)
)
