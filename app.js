const express = require('express')
const app = express()
const port = 1400

var server = app.listen(1401)
var io = require('socket.io').listen(server);
//引入socket.js
require('./mode/socket')(io)

//引入live.js
// require('./model/live.js')(app);


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))