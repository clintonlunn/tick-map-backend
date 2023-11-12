import express, { Request, Response } from 'express'
import {
  fetchUserTicksFromOpenBeta,
  fetchClimbDetails,
  saveTickToDatabase,
} from '../services/openBetaService'
import { Tick } from '../types/types'

// curl -X GET http://localhost:3001/openbeta-climbs/fetch-from-openbeta/:username
// GET all climbs from OpenBeta
const router = express.Router()
router.get(
  '/fetch-from-openbeta/:username',
  async (req: Request, res: Response) => {
    try {
      const username = req.params.username

      // Fetch user ticks from OpenBeta
      const userTicks = await fetchUserTicksFromOpenBeta(username)

      // Fetch lat/lng for each climb and enrich user ticks
      const enrichUserTicks = await Promise.all(
        userTicks.map(async (tick: Tick) => {
          const climbDetails = await fetchClimbDetails(tick.climbId)

          if (
            climbDetails !== null &&
            climbDetails !== undefined &&
            climbDetails.metadata !== null &&
            climbDetails.metadata !== undefined
          ) {
            tick.lat = climbDetails.metadata.lat
            tick.lng = climbDetails.metadata.lng
            // Enrich user ticks with username
            tick.username = username
          }

          //only save valid ticks to database
          if (tick.lat && tick.lng) {
            // Store enriched tick in your database
            await saveTickToDatabase(tick)
            return tick
          }
        })
      )

      // send enriched user ticks to client
      res.json(enrichUserTicks)
    } catch (error) {
      console.error('Error fetching climbs:', error)
      res.status(500).send('Internal Server Error')
    }
  }
)

export default router
