import express, { Request, Response } from 'express'
import db from '../database'
const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT username FROM user_ticks')
    res.json(result.rows)
  } catch (err) {
    res.status(500).send('Error fetching climbs')
  }
})

export default router
