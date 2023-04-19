import express, { NextFunction, Request, Response } from "express"
import { prisma } from "./services/prisma"
import { userRegisterSchema, userSigninSchema } from "./schemas/users"
import { filterSensetiveInfoForClient } from "./helpers"
import { Prisma } from "@prisma/client"
import { postSchemaBody } from "./schemas/posts"
import { getCronTime } from "./helpers/getCronTime"
import cron from "node-cron"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Server } from "socket.io"
import http from "http"
import cors from "cors"
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
const serverHTTP = http.createServer(app)
const io = new Server(serverHTTP, {
  cors: {
    origin: "*",
  },
})

const scheduledJobs = new Map()

io.on("connection", socket => {
  socket.on("join_room", room => {
    socket.join(room)
  })
})

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
    req.user_id = decodedToken.sub
  }

  next()
}

app.get("/run-query", async (req: Request, res: Response) => {
  // await prisma.$queryRaw`
  //   ALTER TABLE
  // `

  // await prisma.post.deleteMany()

  return res.end()
})

app.post("/posts", ensureAuth, async (req: Request, res: Response) => {
  try {
    const { text, announcement_date } = postSchemaBody.parse(req.body)
    const { user_id } = req

    const databaseRawResponse = await prisma.post.create({
      data: {
        text,
        user_id,
        announcement_date,
      },
    })

    const scheduleDate = getCronTime(new Date(announcement_date))

    const job = cron.schedule(scheduleDate, async () => {
      console.log("[cron] Job running for post ID:", databaseRawResponse.id)

      try {
        await prisma.post
          .update({
            where: {
              id: databaseRawResponse.id,
            },
            data: {
              active: false,
            },
          })
          .then(() =>
            console.log("Atualizado o status do post " + databaseRawResponse.id)
          )
      } catch (e) {
        console.log({
          msg: "errooo",
          e,
        })
      }
    })

    scheduledJobs.set(databaseRawResponse.id, job)
    job.start()
    console.log("[cron] Job started for post ID:", databaseRawResponse.id)
    console.log("[cron] This job will run at:", scheduleDate)

    return res.status(201).json({
      databaseRawResponse,
    })
  } catch (error) {
    return res.json(error)
  }
})

app.get("/posts", ensureAuth, async (req: Request, res: Response) => {
  const postsFromDatabase = await prisma.post.findMany()

  return res.json(postsFromDatabase)
})

app.get("/whoami", ensureAuth, async (req: Request, res: Response) => {
  const { user_id } = req

  return res.json({ user_id })
})

app.get("/users", async (req: Request, res: Response) => {
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

    const userSession = filterSensetiveInfoForClient(databaseRawResponse)

    const accessToken = generateAccessToken(databaseRawResponse.id)

    return res.status(201).json({
      accessToken,
      user: userSession,
    })
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

    const userFromDatabase = await prisma.user.findFirst({
      where: {
        username,
      },
    })

    if (!userFromDatabase) {
      return res
        .status(404)
        .json({ message: "Verifique os dados inseridos e tente novamente." })
    }

    const passwordMatch = userFromDatabase.password === password
    if (!passwordMatch) {
      return res.status(404).json({ message: "Usuário ou senha incorretos." })
    }

    const user = filterSensetiveInfoForClient(userFromDatabase)

    const accessToken = generateAccessToken(userFromDatabase.id)

    return res.json({
      accessToken,
      user,
    })
  } catch (error) {
    return res.status(400).json(error)
  }
})

function generateAccessToken(sub: string | number, expiresIn: string = "20m") {
  const subject = typeof sub === "number" ? String(sub) : sub
  return jwt.sign({}, process.env.SERVER_SECRET as string, {
    subject,
    expiresIn,
  })
}

serverHTTP.listen(process.env.PORT, () =>
  console.log("[server] Server is running on port " + process.env.PORT)
)
