import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js'

//import routes
import viewsRouter from './routes/views.router.js'
import sessionsRouter from './routes/sessions.router.js'

import config from './config/config.js'


//import mongoose 
import mongoose from 'mongoose';


const app = express();

const PORT = config.app.PORT
const server = app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`)
})

console.log(config.mongo)



const connection = mongoose.connect((`mongodb+srv://${config.mongo.USER}:${config.mongo.PASSWORD}@ecommerce1.dxk6fgr.mongodb.net/${config.mongo.DB}?retryWrites=true&w=majority`)
  ,err =>{
  if(err) console.log(err);
  else console.log('Base conectada a Atlas');
  })



app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views');
app.set('view engine', 'handlebars');





//use routes 
app.use('/', viewsRouter)
app.use('/api/sessions', sessionsRouter)
