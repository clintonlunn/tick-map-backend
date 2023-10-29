import express, { json } from 'express'
import cors from 'cors'
import internalClimbsRoute from './routes/internalClimbs'
import openBetaClimbsRoute from './routes/openBetaClimbs'

const app = express()

app.use(json())
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
)
app.use('/internal-climbs', internalClimbsRoute)
app.use('/openbeta-climbs', openBetaClimbsRoute)

// Example of a route
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello from Tick Map Backend!')
// })

export default app
