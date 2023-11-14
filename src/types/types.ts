export type Tick = {
  _id: string
  userId: string
  name: string
  notes: string
  climbId: string
  style: string
  attemptType: string
  dateClimbed: number
  grade: string
  source: string
  lat: number
  lng: number
  username: string
  areaName?: string
  areaId?: string
  bbox?: number[]
  mp_id?: string
  climb_type?: {
    trad?: boolean
    sport?: boolean
    bouldering?: boolean
    deepwatersolo?: boolean
    snow?: boolean
    ice?: boolean
    mixed?: boolean
    tr?: boolean
    aid?: boolean
    alpine?: boolean
  }
  pathTokens?: string[]
  ancestors?: string[]
}
export interface ClimbDetails {
  id: string
  metadata: {
    lat: number
    lng: number
  }
  type: {
    trad: boolean | null
    sport: boolean | null
    bouldering: boolean | null
    deepwatersolo: boolean | null
    snow: boolean | null
    ice: boolean | null
    mixed: boolean | null
    tr: boolean | null
    aid: boolean | null
    alpine: boolean | null
  }
  pathTokens: string[]
  ancestors: string[]
  parent: {
    id: string
    areaName: string
    metadata: {
      areaId: string
      bbox: number[]
      mp_id: string
    }
  }
}
