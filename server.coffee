settings = require './app/config/settings'
express = require 'express'

app = express()

app.configure () ->
	# Server static files in public/
	app.use express.static __dirname+'/public'
	app.use express.bodyParser()

# Send index file
app.get '/', (req, res) -> 
	res.header 'X-UA-Compatible', 'IE=edge'
	res.sendfile './public/index.html'

exports.startServer = (port, path, callback) ->
	app.listen port