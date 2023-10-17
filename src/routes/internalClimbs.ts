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
    console.error('Error fetching climbs:', err)
    res.status(500).send('Internal Server Error')
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
  const getQuery = `
        SELECT * FROM user_ticks
        WHERE username = $1
    `
  try {
    const result = await db.query(getQuery, [req.params.username]) // Use req.params.username instead of req.params.id
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching climbs:', err)
    res.status(500).send('Internal Server Error')
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
* //     "id": "b648a2c0-f46e-4c2e-8d1a-c7df0e21802f",
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
* // }'
 */
router.post('/', async (req: Request, res: Response) => {
  console.log('POST /internal-climbs hit')
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
  } = req.body

  console.log('req.body:', req.body)

  try {
    const insertQuery = `
            INSERT INTO user_ticks(_id, user_id, name, notes, climb_id, style, attempt_type, date_climbed, grade, source, lat, lng)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `

    await db.query(insertQuery, [
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
    ])
    res.status(201).send('Climb data added successfully!')
  } catch (err) {
    console.error('Error inserting data:', err)
    res.status(500).send('Internal Server Error')
  }
})

/**
 * DELETE all climbs.
 *
 * @route DELETE /internal-climbs/all
 *
 * @returns {string} Success message.
 *
 * @example
 * // curl -X DELETE http://localhost:3001/internal-climbs/all
 */
router.delete('/all', async (req: Request, res: Response) => {
  const deleteAllQuery = `
        DELETE FROM user_ticks
    `

  try {
    await db.query(deleteAllQuery)
    res.status(200).send('All climbs deleted successfully!')
  } catch (err) {
    console.error('Error deleting all climbs:', err)
    res.status(500).send('Internal Server Error')
  }
})
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
  const deleteQuery = `
    DELETE FROM user_ticks
    WHERE _id = $1
    `

  try {
    const result = await db.query(deleteQuery, [req.params.id])
    if (result.rowCount === 0) {
      res.status(404).send('Climb not found!')
    } else {
      res.status(200).send('Climb deleted successfully!')
    }
  } catch (err) {
    console.error('Error deleting data:', err)
    res.status(500).send('Internal Server Error')
  }
})

export default router
