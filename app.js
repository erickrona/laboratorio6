
const express = require('express')
const mapBox = require('./weather.js')

const app = express()

const port = process.env.PORT || 3000

app.get('/', function(req, res) {
  res.send({
    greeting: 'Hola Mundo!'
  })
})


app.get('/weather', function(req, res) {
  if ( !req.query.search ) {
    return res.send({
      error: 'Debes enviar una ciudad a consultar /weather?search=CIUDAD'
    })
  }
  mapBox.mapBoxCity( req.query.search, function(error, response) {
    if ( error ) {
      return res.send({
        error: 'Se ha presentado un error intentado obtener localización ' + error
      })
    }
    var city = response.place_name
    var center = response.center
    var location = '['+center[1]+','+center[0]+']'
    mapBox.weatherCity(center[1],center[0], function(error, response){
      if ( error ) {
        return res.send({
          error: 'Se ha presentado un error al obtener el pronostico ' +error
        })
      }
      res.send({ 
        city,
        location,
        summary: response.summary,
        temperature: response.temperature,
        precipProbability: response.precipProbability,
        string: 'The weather in (' + city + ' , ' + location + ') is ' + response.summary +
            ' The current temperature is ' + response.temperature +
            'ºC there is ' + response.precipProbability + ' chance of rain.'
      })
    })
  })
})


app.get('*', function(req, res) {
  res.send({
    error: 'Ruta no valida'
  })
})


app.listen(port, function() {
  console.log('Up and running!')
})
