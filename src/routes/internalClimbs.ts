import express, { Request, Response } from 'express'
import db from '../database'
const router = express.Router()

/**
 * GET all climbs.
 *
 * @route GET /internal-climbs/
 *
 * @returns {Array} List of all climbs.
 *
 * @example
 * // curl -X GET http://localhost:3001/internal-climbs/
 */
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM user_ticks')
    res.json(result.rows)
  } catch (err) {
    res.status(500).send('Error fetching climbs')
  }
})

/**
 * GET climbs by username.
 *
 * @route GET /internal-climbs/{username}
 * @param {string} req.params.username - The username to look up.
 *
 * @returns {Array} List of climbs associated with a specific username.
 *
 * @example
 * // curl -X GET http://localhost:3001/internal-climbs/{username}
 * // Replace {username} with an actual username
 */
router.get('/:username', async (req: Request, res: Response) => {
  const getQuery = `SELECT * FROM user_ticks WHERE username = $1`

  try {
    const result = await db.query(getQuery, [req.params.username])
    if (result.rowCount === 0) {
      res
        .status(404)
        .send('Climbs not found. You may need to import data from OpenBeta. \n')
    }
    res.json(result.rows)
  } catch (err) {
    res.status(500).send('Error fetching climbs')
  }
})

/**
 * POST a new climb.
 *
 * @route POST /internal-climbs/
 * @param {Object} req.body - The climb data.
 *
 * @returns {string} Success message.
 *
 * @example
 // curl -X POST http://localhost:3001/internal-climbs -H "Content-Type: application/json" -d '{
* //     "id": "f46e4c2e8d1ac7df0e21802f",
* //     "userId": "30f71f16-39bf-4b57-93c2-b10495f60125",
* //     "name": "Dummy Climb Name",
* //     "notes": "Dummy Notes",
* //     "climbId": "3be738f8-0603-44ea-9ab8-7828c57a5067",
* //     "style": "Lead",
* //     "attemptType": "Lead",
* //     "dateClimbed": 1695772800000,
* //     "grade": "5.10a",
* //     "source": "MP",
* //     "lat": 40.44548,
* //     "lng": -111.69298
* //     "username": "Dummy Username"
* // }'
 */
router.post('/', async (req: Request, res: Response) => {
  const {
    id,
    userId,
    name,
    notes,
    climbId,
    style,
    attemptType,
    dateClimbed,
    grade,
    source,
    lat,
    lng,
    username,
  } = req.body

  const upsertQuery = `
            INSERT INTO user_ticks(_id, user_id, name, notes, climb_id, style, attempt_type, date_climbed, grade, source, lat, lng, username)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            ON CONFLICT (_id) 
            DO UPDATE SET
                user_id = $2, 
                name = $3, 
                notes = $4, 
                climb_id = $5, 
                style = $6, 
                attempt_type = $7, 
                date_climbed = $8, 
                grade = $9, 
                source = $10, 
                lat = $11, 
                lng = $12,
                username = $13;
        `

  try {
    await db.query(upsertQuery, [
      id,
      userId,
      name,
      notes,
      climbId,
      style,
      attemptType,
      dateClimbed,
      grade,
      source,
      lat,
      lng,
      username,
    ])
    res.status(201).send('Climb data added successfully! \n')
  } catch (err) {
    res.status(500).send('Error adding climb')
  }
})

// /**
//  * DELETE all climbs.
//  *
//  * @route DELETE /internal-climbs/all
//  *
//  * @returns {string} Success message.
//  *
//  * @example
//  * // curl -X DELETE http://localhost:3001/internal-climbs/all
//  */
// router.delete('/all', async (req: Request, res: Response) => {
//   const deleteAllQuery = `DELETE FROM user_ticks`
//   try {
//     await db.query(deleteAllQuery)
//     res.status(200).send('All climbs deleted successfully! \n')
//   } catch (err) {
//     res.status(500).send('Error deleting climbs')
//   }
// })

/**
 * DELETE a climb by ID.
 *
 * @route DELETE /internal-climbs/{id}
 * @param {string} req.params.id - The ID of the climb to delete.
 *
 * @returns {string} Success message.
 *
 * @example
 * // curl -X DELETE http://localhost:3001/internal-climbs/{id}
 * // Replace {id} with an actual climb ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const deleteQuery = `DELETE FROM user_ticks WHERE _id = $1`
  try {
    const result = await db.query(deleteQuery, [req.params.id])
    if (result.rowCount === 0) {
      res.status(404).send('Climb not found')
    } else {
      res.status(200).send('Climb deleted successfully! \n')
    }
  } catch (err) {
    res.status(500).send('Error deleting climb')
  }
})

export default router
