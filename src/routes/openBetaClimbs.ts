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

      if (!userTicks || userTicks.length === 0) {
        return res
          .status(404)
          .send(
            'Climbs not found. You may need to import data into OpenBeta. \n'
          )
      }

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
            // Enrich user ticks with lat/lng
            tick.lat = climbDetails.metadata.lat
            tick.lng = climbDetails.metadata.lng

            // Enrich user ticks with username
            tick.username = username

            // Enrich user ticks with areaName and areaId
            tick.areaName = climbDetails.parent.areaName
            tick.areaId = climbDetails.parent.metadata.areaId

            // Enrich user ticks with bbox
            if (climbDetails.parent.metadata.bbox) {
              tick.bbox = climbDetails.parent.metadata.bbox
            }

            // Enrich user ticks with mp_id
            if (climbDetails.parent.metadata.mp_id) {
              tick.mp_id = climbDetails.parent.metadata.mp_id
            }

            // Enrich user ticks with climb_type
            if (climbDetails.type) {
              tick.climb_type = {
                trad: climbDetails.type?.trad ?? undefined,
                sport: climbDetails.type?.sport ?? undefined,
                bouldering: climbDetails.type?.bouldering ?? undefined,
                deepwatersolo: climbDetails.type?.deepwatersolo ?? undefined,
                snow: climbDetails.type?.snow ?? undefined,
                ice: climbDetails.type?.ice ?? undefined,
                mixed: climbDetails.type?.mixed ?? undefined,
                tr: climbDetails.type?.tr ?? undefined,
                aid: climbDetails.type?.aid ?? undefined,
                alpine: climbDetails.type?.alpine ?? undefined,
              }
            }

            // Enrich user ticks with pathTokens
            if (climbDetails.pathTokens) {
              tick.pathTokens = climbDetails.pathTokens
            }

            // Enrich user ticks with ancestors
            if (climbDetails.ancestors) {
              tick.ancestors = climbDetails.ancestors
            }
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
