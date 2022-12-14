import passport from "passport";
import local from "passport-local";
import { usersService, cartsService } from '../services/index.js'
import { createHash, isValidPassword } from '../utils.js'
import logger from '../middleware/logger.js'
import config from '../config/config.js'

const LocalStrategy = local.Strategy;



const initializePassport = () => {
  passport.use('register', new LocalStrategy({passReqToCallback:true, usernameField:'email'},
  async (req,email,password,done) => {
    
    try {
      const {name,last_name,age,nickname,avatar} = req.body;
  
      if(!email||!name||!last_name||!age||!nickname||!avatar||!password) return done(null,false,{message:'Incomplete values'})
   
      logger.info(`Email de persona registrada ${req.method} ${req.url} ${req.body.email}`);
      const user = await usersService.getUserByEmail(req.body.email)
      logger.info(user, `${req.method} ,${req.url} `)
    

      if(user) return done(null,false,{message:'User already exists'})
      const cart = await cartsService.createCart();
      

      const newUser={
        email,
        name,
        last_name,
        age,
        nickname,
        avatar,
        password:createHash(password),
        cart:cart._id
      }
      let result = await usersService.saveUser(newUser);
      return done(null,result)

    }catch(error) {
      done(error)
    }
  }))

  passport.use('login',new LocalStrategy({usernameField:'email'},async (email,password,done) => {
   
    logger.info(`Email de persona logeada  ${email} `)
  
		if(!email || !password) return done(null,false,{message:'Incomplete values'})
    
    //antes 1:35
    if(email===config.session.ADMIN_EMAIL&&password===config.session.ADMIN_PASSWORD){
    
      passport.serializeUser((email, done) => {
        done(null,email)
      })
      passport.deserializeUser((password, done) => {
        let result =  config.session.ADMIN_PASSWORD(password)
        return done(null,result)
    
      })
      
   
    }
	
		let user = await usersService.getByEmail(email)
    logger.info(user)

    if(!user) return done(null,false,{message:'Incorrect credentials'})
    
    if(!isValidPassword(user,password)) return done(null,false,{message:'Incorrect password'})
   
    return done(null, user);

		
  }))


  passport.serializeUser((user, done) => {
    done(null,user._id)
  })
  passport.deserializeUser(async(id, done) => {
    let result = await usersService.getById({_id:id})
    return done(null,result)

  })

}

export default initializePassport;
