import express, { json, Request, Response } from 'express'
// import { query } from './database'
import internalClimbsRoute from './routes/internalClimbs'
import openBetaClimbsRoute from './routes/openBetaClimbs'

const app = express()

app.use(json())
app.use('/internal-climbs', internalClimbsRoute)
app.use('/openbeta-climbs', openBetaClimbsRoute)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Tick Map Backend!')
})

// app.get('/user-ticks', async (req: Request, res: Response) => {
//   try {
//     const result = await query('SELECT * FROM user_ticks')
//     res.json(result.rows)
//   } catch (err: unknown) {
//     console.error('Error fetching data:', err)
//     res.status(500).send('Internal Server Error')
//   }
// })

export default app
