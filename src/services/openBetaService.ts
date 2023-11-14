import axios from 'axios'
import { ClimbDetails, Tick } from '../types/types'
import db from '../database'

// sample response from OpenBeta
// {
//   "data": {
//     "userTicks": [
//       {
//          id: 'c3ac75ca-c950-5108-84da-482ff37a7de6',
//          metadata: { lat: 47.81847, lng: -121.57139 },
//          type: {
//            trad: true,
//           sport: null,
//           bouldering: null,
//           deepwatersolo: null,
//           snow: null,
//           ice: null,
//           mixed: null,
//           tr: null,
//           aid: null,
//           alpine: null
//         },
//         pathTokens: [
//           'USA',
//           'Washington',
//           'Central-West Cascades & Seattle',
//           'Skykomish Valley',
//           'Index',
//           'Lower Town Wall',
//           '(C) Main Wall, left side'
//         ],
//         ancestors: [
//           '1db1e8ba-a40e-587c-88a4-64f5ea814b8e',
//           'cfe129f6-5f60-5bc8-87b3-3d3bfaff9472',
//           '7e417346-4bea-5085-9f18-3c0f60efd272',
//           '0bb1bb37-18ee-5769-974b-2b238388e482',
//           'a701bef6-2ff8-5c72-9aea-afe92f0bc5fa',
//           '625dbab0-15ce-5fba-854d-523514c50c00',
//           'ec924cd1-1663-5700-a1a1-2a188db444a2'
//         ],
//         parent: {
//           id: '6368a60be80bff5a995c525c',
//           areaName: '(C) Main Wall, left side',
//           metadata: {
//             areaId: 'ec924cd1-1663-5700-a1a1-2a188db444a2',
//             bbox: [Array],
//             mp_id: '105790707'
//           }
//         }
//       }
//     ]
//   }
// }

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
    { query: query },
    { headers: { 'Content-Type': 'application/json' } }
  )

  return response.data.data.userTicks
}

export const fetchClimbDetails = async (
  climbId: string
): Promise<ClimbDetails> => {
  const query = `
    {
      climb(uuid: "${climbId}") {
        id
        metadata {
          lat
          lng
        }
        type {
          trad
          sport
          bouldering
          deepwatersolo
          snow
          ice
          mixed
          tr
          aid
          alpine
        }
        pathTokens
        ancestors
        parent {
          id
          areaName
          metadata {
            areaId
            bbox
            mp_id
          }
        }
      }
    }`

  const response = await axios.post(
    'https://api.openbeta.io/query',
    { query: query },
    { headers: { 'Content-Type': 'application/json' } }
  )
  return response.data.data.climb
}

export const saveTickToDatabase = async (tick: Tick) => {
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
    areaName,
    areaId,
    bbox,
    mp_id,
    climb_type,
    pathTokens,
    ancestors,
  } = tick

  const upsertQuery = `
    INSERT INTO user_ticks(
      _id, 
      user_id, 
      name, 
      notes, 
      climb_id, 
      style, 
      attempt_type, 
      date_climbed, 
      grade, 
      source, 
      lat, 
      lng, 
      username,
      area_name,
      area_id,
      bbox,
      mp_id,
      climb_type,
      path_tokens,
      ancestors
    )
    VALUES(
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::JSONB, $17, $18::JSONB, $19::TEXT[], $20::TEXT[]
    )
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
      username = $13,
      area_name = $14,
      area_id = $15,
      bbox = $16,
      mp_id = $17,
      climb_type = $18,
      path_tokens = $19,
      ancestors = $20;
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
    areaName,
    areaId,
    JSON.stringify(bbox),
    mp_id,
    JSON.stringify(climb_type),
    pathTokens,
    ancestors,
  ])
}
