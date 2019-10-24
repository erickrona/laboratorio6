

const request = require('request')


if ( process.env.NODE_ENV === 'production') {
  var MAPBOX_TOKEN = process.env.MAPBOX_KEY
  var DARK_SKY_SECRET_KEY = process.env.DARKSKY_KEY
} else {
  const credentials = require('./credentials.js')
  var MAPBOX_TOKEN = credentials.MAPBOX_TOKEN
  var DARK_SKY_SECRET_KEY = credentials.DARK_SKY_SECRET_KEY
}


const mapBoxCity = function (ciudad, callback){
	//console.log('https://api.mapbox.com/geocoding/v5/mapbox.places/' + ciudad + '.json?access_token=' + credentials.MAPBOX_TOKEN)
	const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + ciudad + '.json?access_token=' + MAPBOX_TOKEN

	request({url, json: true}, function(error, response){
		if(error){
			callback(error, undefined)
		} else {
			const data = response.body
			if ( data.message ) {
        		callback(data.message, undefined)
      		} else if(data.features[0] == undefined) {			
					callback(data.query + ' was not found', undefined)
				}
				else
				{
					const info = {
						place_name: data.features[0].place_name,
				 		center: data.features[0].center 
					}
					callback(undefined, info)
				}
		}
	})
}

const weatherCity = function(latitude, longitude, callback) {
	//console.log('https://api.darksky.net/forecast/' + DARK_SKY_SECRET_KEY + '/' + latitude + ',' + longitude + '?exclude=minutely,daily,alerts,flags&lang=es&units=si')
	const url = 'https://api.darksky.net/forecast/' + DARK_SKY_SECRET_KEY + '/' + latitude + ',' + longitude + '?exclude=minutely,daily,alerts,flags&lang=es&units=si'
	request({url, json: true}, function(error, response) {
		if (error) {
      		callback(error, undefined)
    	} else {
    		const data = response.body
    		if ( data.code) {
        		callback(data.code + ' - ' + data.response, undefined)
      		} else {
      			const info = {
					summary: data.hourly.summary,
					temperature: data.currently.temperature.toFixed(1) + '°C',
					precipProbability: (data.currently.precipProbability * 100).toFixed(0) + '%'
				}
				callback(undefined, info)
      		}
    	}
	})
}

module.exports = {
	mapBoxCity : mapBoxCity,
	weatherCity : weatherCity
}

