const config = require('./config.js')
const mysql = require('mysql')
const payutc = require('../payutc/payutc.js')
const XmlHttpRequest = require('xhr2')
const bodyParser = require('body-parser');
const moment = require('moment')
const cors = require('cors')
const express = require('express')
const app = express()
const request = require('request')
const join = require('path').join
const mustacheExpress = require('mustache-express')



module.exports.authenticate = ()=>{


  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended:true}))

  //initialisation du view engine Mustache pour gérer les views
  app.engine('html', mustacheExpress())
  app.set('view engine', 'html')


  //declaration du dossier static pour les fichiers html et js en front (equivalent de notre public_html)
  app.use(express.static('./public'))


  //declaration du dossier views
  app.set('views',join(__dirname,'../views'))



  //ce que renvoie le lien de base sur le port d'ecoute
  app.get('/', (req,res)=>{
    res.render('./index.html', {username:'guest', mail:'guest', name:'guest'})
  })

  //gestion du login => voir sur le index.html ou renvoie le lien login
  app.get('/login', (req,res, next)=>{

      let token = req.query.ticket
      if(req.query.ticket)
      {
        //console.log(token)
      request('https://cas.utc.fr/cas/serviceValidate?ticket='+token+'&service=http://vps528307.ovh.net:3001/login&format=JSON', (error,response, body)=>{

          data = JSON.parse(body)
          if(data.serviceResponse.authenticationSuccess)
          {

            mydata = data.serviceResponse.authenticationSuccess
            if(mydata.user && mydata.attributes.mail && mydata.attributes.displayName)
            {
              console.log(mydata.user)
              res.render('index.html',{
                username : mydata.user,
                 mail:mydata.attributes.mail,
                 name:mydata.attributes.displayName
                })
            }}
        })

      }else {
        res.render('index.html')
      }
  })



}
