import request from 'supertest'
import express from 'express'
import router from '../internalClimbs'
import db from '../../database'

jest.mock('../../database') // Mock the database

const app = express()
app.use(express.json())
app.use('/internal-climbs', router)

describe('climbs routes', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('GET / - should fetch all climbs', async () => {
    const mockedClimbs = [{ id: '123', name: 'test climb' }]
    ;(db.query as jest.Mock).mockResolvedValueOnce({ rows: mockedClimbs })

    const res = await request(app).get('/internal-climbs/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual(mockedClimbs)
  })

  it('GET /:username - should handle errors', async () => {
    ;(db.query as jest.Mock).mockRejectedValueOnce(new Error('Test error'))

    const res = await request(app).get('/internal-climbs/john')
    expect(res.status).toBe(500)
    expect(res.text).toContain('Error fetching climbs')
  })

  it('should add a new climb', async () => {
    const newClimb = {
      id: 'f46e4c2e8d1ac7df0e21802f',
      userId: '30f71f16-39bf-4b57-93c2-b10495f60125',
      name: 'Dummy Climb Name',
      lng: -111.69298,
      username: 'Dummy Username',
    }
    ;(db.query as jest.Mock).mockResolvedValueOnce({})

    const res = await request(app).post('/internal-climbs/').send(newClimb)

    expect(res.status).toBe(201)
    expect(res.text).toBe('Climb data added successfully! \n')
  })

  // it('should delete all climbs', async () => {
  //   ;(db.query as jest.Mock).mockResolvedValueOnce({})

  //   const res = await request(app).delete('/internal-climbs/all')

  //   expect(res.status).toBe(200)
  //   expect(res.text).toBe('All climbs deleted successfully! \n')
  // })

  it('should delete a climb by ID', async () => {
    const climbId = 'f46e4c2e8d1ac7df0e21802f'
    ;(db.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 }) // Indicate that 1 record was affected/removed

    const res = await request(app).delete(`/internal-climbs/${climbId}`)

    expect(res.status).toBe(200)
    expect(res.text).toBe('Climb deleted successfully! \n')
  })

  it('should return 404 if climb ID not found', async () => {
    const invalidClimbId = 'invalid-id'
    ;(db.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 }) // Indicate no records were affected/removed

    const res = await request(app).delete(`/internal-climbs/${invalidClimbId}`)

    expect(res.status).toBe(404)
    expect(res.text).toBe('Climb not found')
  })
})
