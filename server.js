let express = require('express')
let app = express()
let mongoose = require('mongoose')
let morgan = require('morgan')
let bodyParser = require('body-parser')
var PORT = 8081
let HOST = '0.0.0.0'
let student = require('./controllers/routes/student')
let config = require('config') //we load the db location from the JSON filess

//db connection
// mongoose.Promise = global.Promise
// // mongoose.connect(config.DBHost, options)
// mongoose.connect(config.DBHost)
// let db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))
require('./data/database')

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
	PORT = 8080
	//process.env['MONGO_DB'] = 'TestStudentsDB'
	//DBHost = 'mongodb://localhost/TestStudentsDB'
	// mongoose.connect('mongodb://localhost/TestStudentsDB')
	// let db = mongoose.connection
	// db.on('error', console.error.bind(console, 'connection error:'))
	//use morgan to log at command line
	app.use(morgan('combined')) //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json' }))

app.get('/', (req, res) =>
	res.json({ message: 'Welcome to our Student enrolement REST API server!' })
)

app.route('/student').get(student.getStudents).post(student.postStudent)
app
	.route('/student/:id')
	.get(student.getStudent)
	.delete(student.deleteStudent)
	.put(student.updateStudent)

app.route('/fetchStudents').get(student.fetchStudents)

app.listen(PORT, HOST)
// console.log('Listening on port ' + PORT)
console.log(`Running on http://${HOST}:${PORT}`)

module.exports = app // for testing
