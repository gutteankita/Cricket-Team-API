const express = require('express')
const app = express()
app.use(express.json())

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')
const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
  }
}
initializeDBAndServer()

// API 1  Method: GET

app.get('/players/', async (request, response) => {
  const getPlayerQuery = `select * from cricket_team order by player_id`
  const playerArray = await db.all(getPlayerQuery)
  response.send(playerArray)
})

// API 2 Method: POST

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addQuery = `INSERT INTO cricket_team (player_name, jersey_number, role)
                    VALUES (
                      '${playerName}',
                      ${jerseyNumber},
                      '${role}'
                    )`
  const dbResponse = await db.run(addQuery)
  const playerId = dbResponse.lastId
  console.log(playerId)
  response.send({playerId: playerId})
})

// API 3 Method: GET

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `select * from cricket_team where player_id = ${playerId}`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

// API 4 Method: PUT

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `update cricket_team set 
     player_name = ${playerName},
     jersey_number = ${jerseyNumber},
     role = ${role}
     where player_id = ${playerId}`
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `delete from cricket_team wherer player_id = ${playerId}`
  await db.run(deleteQuery)
  response.send('Player Removed')
})

module.exports = app
