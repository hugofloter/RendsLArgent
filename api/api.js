
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


var myfunctions = require('./functions.js')
var authentication = require('./authentication.js')

const join = require('path').join
const mustacheExpress = require('mustache-express')
app.use(cors())
//app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.engine('html', mustacheExpress())
app.set('view engine', 'html')
/*app.use('/api', function(req, res, next){
  if(!req.query.app_key){
    return res.json({error:'fuck you'});
  }
});*/

app.use(express.static(join(__dirname,'../public')))


app.set('views',join(__dirname,'../views'))




app.get('/', (req,res)=>{
  res.render('./index.html', {username:'guest', mail:'guest', name:'guest'})
})



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

//###########################################################################################################################################################################################################
//###########################################################################################################################################################################################################
//###########################################################################################################################################################################################################
//
//  API CALLS FOR RENDSLARGENT APPLICATION
//
//###########################################################################################################################################################################################################
//###########################################################################################################################################################################################################
//###########################################################################################################################################################################################################



//###########################################################################################################################################################################################################
// USERS API CALLS
//###########################################################################################################################################################################################################


//create user
app.post('/USERS/createUser', (req,res)=>{
  myfunctions.users.createUser(req.body.nom, req.body.prenom, req.body.email,
    (data)=>{if(data) res.send(data)},
    (err)=>{if(err) console.error(err)},
    req.body.login)
})

//get user by ID
app.post('/USERS/getUserById', (req,res)=>{
  myfunctions.users.getUserById(req.body.id, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.log(err)})
})

//get user by login
app.post('/USERS/getUserByLogin', (req,res)=>{
  myfunctions.users.getUserByLogin(req.body.login, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.log(err)})
})

//create preference User
app.post('/USERS/createPreferenceUser', (req,res)=>{
  myfunctions.users.createPreferenceUser(req.body.id, req.body.otherId,(data)=>{if(data) res.send(data)}, (err)=>{if(err)console.error(err)})
})

//get preference User
app.post('/USERS/getPreferenceUser', (req,res)=>{
  myfunctions.users.getPreferenceUser(req.body.id, req.body.otherId,(data)=>{if(data) res.send(data)}, (err)=>{if(err)console.error(err)})
})

//set Validation Auto true
app.post('/USERS/setValidationAuto', (req,res)=>{
  myfunctions.users.setValidationAuto(req.body.id, req.body.otherId, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})

//get All Users
app.get('/USERS/getAllUsers', (req, res)=>{
  myfunctions.users.getAllUsers((data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})

//set true the variable favoris between two users
app.post('/USERS/setFavoris', (req, res)=>{
  myfunctions.users.setFavoris(req.body.userId,req.body.otherUserId, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.log(err)})
})


//###########################################################################################################################################################################################################
//  RENDSLARGENT API CALL
//###########################################################################################################################################################################################################

//delete RendsLArgent
app.post('/RENDSLARGENT/deleteRendsLArgent', (req,res)=>{
  myfunctions.rendslargent.deleteRendsLArgent(req.body.id, (message)=>{if(message)res.send(message)}, (err)=>{if(err)console.error(err)})
})

//add user to RendsLArgent
app.post('/RENDSLARGENT/addUserRendslargent', (req,res)=>{
  myfunctions.rendslargent.addUserRendsLArgent(req.body.userId, req.body.rendslargentId, (data)=>{if(data)res.send(data)},(err)=>{if(err)console.error(err)})
})


//ajout de plusieurs personnes à un rendsLargent
app.post('/RENDSLARGENT/addMultipleUsersRendsLArgent', (req,res)=>{
  myfunctions.rendslargent.addMultipleUsersRendsLArgent(req.body.usersIds, req.body.rendslargentId, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})
//create RendsLArgent
app.post('/RENDSLARGENT/createRendsLArgent', (req, res)=>{
  myfunctions.rendslargent.createRendsLArgent(req.body.creatorId,req.body.usersIds,(data)=>{if(data)res.send(data)}, (err)=>{console.error(err)}, req.body.name)
})

//set rendsLargent terminated
app.post('/RENDSLARGENT/setTermine', (req,res)=>{
  myfunctions.rendslargent.setTermine(req.body.id,(data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})

})

//set rembourse auto true on a rendslargent
app.post('/RENDSLARGENT/setRembourseAuto', (req,res)=>{
  myfunctions.rendslargent.setRemourseAuto(req.body.idrendslargent, req.body.iduser, req.body.echeance,(success)=>{if(success)res.send(success)}, (err)=>{if(err)console.log(err)})
})

//get All the total of transactions that user1 paid to user2
app.post('/RENDSLARGENT/getAllTransaction', (req,res)=>{
  myfunctions.rendslargent.getAllTransaction(req.body.userId1,req.body.userId2,req.body.rendslargentId, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})


//get the balance between two usersIds
app.post('/RENDSLARGENT/getBalanceUser', (req,res)=>{
  myfunctions.rendslargent.getBalanceUser(req.body.idrendslargent,req.body.userId1,req.body.userId2, (data)=>{if(data) res.send(data)}, (err)=>{if(err)console.error(err)})
})

//create a transaction between user1 and user2 for a rendsLargent
app.post('/RENDSLARGENT/createTransaction', (req,res)=>{
  myfunctions.rendslargent.createTransaction(req.body.userId1,req.body.userId2,req.body.idrendslargent,req.body.articleId, req.body.prix, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})

//change the statut of the transaction to valide if statut =1, refuse if statut=0
app.post('/RENDSLARGENT/validerTransaction', (req,res)=>{
  myfunctions.rendslargent.validerTransaction(req.body.transactionId, req.body.statut, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})


})

app.post('/RENDSLARGENT/getUsersRendsLArgent', (req,res)=>{
  myfunctions.rendslargent.getUsersRendsLArgent(req.body.idrendslargent, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.log(err)})
})

app.post('/RENDSLARGENT/getBalanceRendsLArgent', (req,res)=>{
  myfunctions.rendslargent.getBalanceRendsLArgent(req.body.id, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)} )
})

app.post('/RENDSLARGENT/getAllTransactionForARendsLArgent', (req,res)=>{
  myfunctions.rendslargent.getAllTransactionForARendsLArgent(req.body.id, (data)=>{if(data)res.end(data)}, (err)=>{if(err)console.error(err)} )
})

app.post('/RENDSLARGENT/getRendsLArgentByUser', (req,res)=>{
  myfunctions.rendslargent.getRendsLArgentByUser(req.body.id, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})


app.post('/RENDSLARGENT/getAllTransactionUncheckedForAUser', (req,res)=>{
  myfunctions.rendslargent.getAllTransactionUncheckedForAUser(req.body.userId, req.body.rendslargentId, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})


app.post('/RENDSLARGENT/getAllTransactionUnpayedForAUser', (req,res)=>{
  myfunctions.rendslargent.getAllTransactionUnpayedForAUser(req.body.userId, req.body.rendslargentId, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})

app.post('/RENDSLARGENT/getBalance', (req,res)=>{
  myfunctions.rendslargent.getBalance(req.body.id, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})


//créer une dépense dont le prix se divise entre tous les utilisateurs écrits (dont le créateur)
app.post('/RENDSLARGENT/createTransactionMultipleUsers', (req,res)=>{
  myfunctions.rendslargent.createTransactionMultipleUsers(req.body.idUser,req.body.idsOtherUser,req.body.idrendslargent,req.body.idarticle, req.body.prix,(data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})

app.post('/RENDSLARGENT/updatePayeOnTransaction', (req, res)=>{
  myfunctions.rendslargent.updatePayeOnTransaction(req.body.idUser1, req.body.idUser2, req.body.idRendsLArgent, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})

})

app.post('/RENDSLARGENT/getTransactionsPayed', (req,res)=>{
  myfunctions.rendslargent.getTransactionsPayed(req.body.idRendsLArgent, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})

app.post('/RENDSLARGENT/getAllTransactionsForAUser', (req,res)=>{
  myfunctions.rendslargent.getAllTransactionsForAUser(req.body.idUser, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})


//###########################################################################################################################################################################################################
//  RENDSLARGENT API CALL
//###########################################################################################################################################################################################################

//get All Articles
app.get('/ARTICLES/getArticles', (req,res)=>{
  myfunctions.articles.getArticles((data)=>{if(data)res.send(data)},(err)=>{if(err) console.error(err)})
})


//create exterior article
app.post('/ARTICLES/createArticleExte', (req,res)=>{
  myfunctions.articles.createArticleExte(req.body.nom, req.body.prix, req.body.attr2, req.body.idrendslargent,  (data)=>{if(data)res.send(data)},(err)=>{if(err)console.error(err)})
})

app.post('/ARTICLES/getOneArticle', (req,res)=>{
  myfunctions.articles.getOneArticle(req.body.id, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})




//###########################################################################################################################################################################################################
//  USER API CALL
//###########################################################################################################################################################################################################

app.post('/USERS/getUserMoney', (req,res)=>{
  myfunctions.users.getUserMoney(req.body.login, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.error(err)})
})


app.post('/USERS/adminTransfert', (req,res)=>{
  myfunctions.users.adminTransfert(req.body.amount, req.body.loginSrc, req.body.loginDst, req.body.idrendslargent, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.log(err)})
})

app.post('/USERS/adminTransfertOneArticle', (req,res)=>{
  myfunctions.users.adminTransfertOneArticle(req.body.amount, req.body.loginSrc, req.body.loginDst, req.body.idtransaction, (data)=>{if(data)res.send(data)}, (err)=>{if(err)console.log(err)})
})
app.listen(3001, ()=>{console.log('app listening on port 3001!')})


/*
  payutc.config.setAppKey(config.APP_KEY)
  payutc.login.payuser({
    login:config.USERNAME,
    password:config.PASSWORD,
    callback: function(){
      payutc.users.adminTransfert({
        amount: 10,
        message : 'test',
        walletDst : 5677,
        walletSrc : 5593,
        callback : (data)=>{
          console.log(data)
        }})
  }})*/

//myfunctions.users.getUserByLogin('qrichard', (data)=>{console.log(data[0]['user_id'])}, (err)=>{if(err)console.log(err)})
//myfunctions.users.adminTransfert(4000, 'hpaignea','qrichard',(data)=>{if(data)console.log(data)}, (err)=>{if(err)console.log(err)})
//myfunctions.users.getUserMoney('hpaignea', (data)=>{if(data)console.log(data)}, (err)=>{if(err)console.error(err)})

//myfunctions.rendslargent.getBalanceRendsLArgent(1, (data)=>{console.log(data)}, (err)=>{if(err)console.log(err)})
//myfunctions.rendslargent.getRendsLArgentByUser(11, (data)=>{if(data)console.log(data)}, (err)=>{if(err)console.log(err)})
//myfunctions.users.createUser('test','test', 'test', (data)=>{if(data)console.log(data)}, (err)=>{if(err)console.log(err)}, 'test3')

//myfunctions.rendslargent.getAllTransactionForARendsLArgent(1, (data)=>{if(data)console.log(data)}, (err)=>{if(err)console.error(err)})
//myfunctions.rendslargent.getBalanceRendsLArgent(1, (data)=>{if(data)console.log(data)}, (err)=>{if(err)console.error(err)} )

//myfunctions.articles.addArticlesPayutc((succ)=>{if(succ)console.log(succ)}, (err)=>{if(err)console.log(err)})
//myfunctions.rendslargent.getAllTransaction(5,4,1, (data)=>{if(data)console.log(data)}, (err)=>{if(err)console.log(err)})
