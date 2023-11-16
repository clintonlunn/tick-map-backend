import express, { json } from 'express'
import cors from 'cors'
import internalClimbsRoute from './routes/internalClimbs'
import openBetaClimbsRoute from './routes/openBetaClimbs'
import userRoute from './routes/users'

const app = express()

app.use(json())
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
)
app.use('/internal-climbs', internalClimbsRoute)
app.use('/openbeta-climbs', openBetaClimbsRoute)
app.use('/users', userRoute)

export default app
