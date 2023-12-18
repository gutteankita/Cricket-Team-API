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
  const getPlayerQuery = 'SELECT * FROM cricket_team ORDER BY player_id'
  const playerArray = await db.all(getPlayerQuery)
  response.send(playerArray)
})

// API 2 Method: POST

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addQuery = `
    INSERT INTO cricket_team (player_name, jersey_number, role)
    VALUES ('${playerName}', ${jerseyNumber}, '${role}')
  `
  await db.run(addQuery)
  response.send('Player Added to Team')
})

// API 3 Method: GET  By ID

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

// API 4 Method: PUT

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `
      UPDATE cricket_team SET 
      player_name = '${playerName}',
      jersey_number = ${jerseyNumber},
      role = '${role}'
      WHERE player_id = ${playerId}
    `
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const { playerId } = request.params;
    const deleteQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
    await db.run(deleteQuery);
  response.send('Player Removed');
})

module.exports = app
