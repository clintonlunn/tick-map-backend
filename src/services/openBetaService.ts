// const express = require('express');
// const axios = require('axios');
// const router = express.Router();
// const db = require('../database'); // Assuming you've set up a connection to your database

import axios from 'axios'
import { Tick } from '../types/types'
import db from '../database'

// // curl -X GET http://localhost:3001/openbeta-climbs/fetch-from-openbeta/:username

// // GET all climbs from OpenBeta
// router.get('/fetch-from-openbeta/:username', async (req, res) => {
//     console.log("asdfghjkl111");
//     try {
//         const username = req.params.username;

//         // Fetch user ticks from OpenBeta
//         const userTicks = await fetchUserTicksFromOpenBeta(username);

//         // Fetch lat/lng for each climb and enrich user ticks
//         const enrichedUserTicks = await Promise.all(userTicks.map(async (tick) => {
//             const climbDetails = await fetchClimbDetails(tick.climbId);
//             tick.lat = climbDetails.metadata.lat;
//             tick.lng = climbDetails.metadata.lng;

//             // Store enriched tick in your database
//             await saveTickToDatabase(tick);

//             return tick;
//         }));

//         console.log(res.json(enrichedUserTicks));

//         res.json(enrichedUserTicks);

//     } catch (error) {
//         console.error('Error fetching climbs:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// module.exports = router;

export const fetchUserTicksFromOpenBeta = async (username: string) => {
  const query = `
    {
        userTicks(username:"${username}") {
            _id
            userId
            name
            notes
            climbId
            style
            attemptType
            dateClimbed
            grade
            source
        }
    }`

  const response = await axios.post(
    'https://api.openbeta.io/query',
    {
      query: query,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data.data.userTicks
}

export const fetchClimbDetails = async (climbId: string) => {
  const query = `
    {
      climb(uuid: "${climbId}") {
        id
        metadata {
          lat
          lng
        }
      }
    }`

  const response = await axios.post(
    'https://api.openbeta.io/query',
    {
      query: query,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data.data.climb
}

export const saveTickToDatabase = async (tick: Tick) => {
  console.log('Saving tick to database:', tick)
  // Insert the enriched tick into your database
  const {
    _id,
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
  } = tick

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

  await db.query(upsertQuery, [
    _id,
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
}
