/*
IL FAUT FAIRE:

send Message

ADD ARTICLE PAYUTC
*/



const config = require('./config.js')
const mysql = require('mysql')
const payutc = require('../payutc/payutc.js')
const XmlHttpRequest = require('xhr2')
const bodyParser = require('body-parser');
const moment = require('moment')
const cors = require('cors')

const mySqlConnection = mysql.createConnection({
  host: config.BDD_HOST,
  user: config.BDD_USERNAME,
  password: config.BDD_PASSWORD,
  database: config.BDD
});

setInterval(function () {
    mySqlConnection.query('SELECT 1');
}, 5000);

var exports = module.exports = {
  users : {},
  rendslargent : {},
  articles : {}
}




//USERS FUNCTIONS
exports.users.createUser = (user_nom, user_prenom, user_mail, success, error, user_login='guest')=>{
  exports.users.getUserByLogin(user_login,
    (myuser)=>{
      {
        if(myuser.length >0)
        {
          success(myuser)
        }
        else {
          const insertQuery = "insert into USERS (user_nom, user_prenom, user_mail, user_login) values("+mySqlConnection.escape(user_nom)+","+mySqlConnection.escape(user_prenom)+","+mySqlConnection.escape(user_mail)+","+mySqlConnection.escape(user_login)+")"
          mySqlConnection.query(
            insertQuery,
            (err, result)=>{
              if(err) error(err)
              //success(result['insertId'])
              else exports.users.getUserById(result['insertId'], (data)=>{if(data)success(data)}, (er)=>{if(er)error(er)})

            })
        }
      }
})
}

exports.users.getUserByLogin = (user_login, success, err)=>{
  const selectQuery = "select * from USERS where user_login="+mySqlConnection.escape(user_login)
  mySqlConnection.query(
    selectQuery,
    (error, result)=>
    {
      if(error) err(error);
      else
      {
        success(result)
      }
    })
}

exports.users.getUserById = (user_id, success, err)=>{
  const selectQuery = "(select * from USERS where user_id="+mySqlConnection.escape(user_id)+")"
  mySqlConnection.query(
    selectQuery,
    (error, result)=>
    {
      if(error) err(error);
      else success(result)
    })
}

exports.users.createPreferenceUser = (user_id, fk_user_id, success, err)=>{
  exports.users.getPreferenceUser(user_id, fk_user_id, (data)=>{
    if(data)
    {
      if(data.length>0) err('preference deja établie')
      else {
        const insertQuery = "insert into PREFERENCES_USER (fk_user, fk_otheruser) values("+mySqlConnection.escape(user_id)+","+mySqlConnection.escape(fk_user_id)+")"
          mySqlConnection.query(
            insertQuery,
            (error,result)=>
            {
              if(error) err(error)
              else success('Preference user inséré')
            })
      }
    }
  },
  (error)=>{if(error) err(error)})
}

exports.users.getPreferenceUser = (user_id, fk_user_id, success, err)=>{
  const selectQuery = "select * from PREFERENCES_USER where fk_user="+mySqlConnection.escape(user_id)+" and fk_otheruser="+mySqlConnection.escape(fk_user_id)
  mySqlConnection.query(
    selectQuery,
    (error, result)=>
    {
      if(error) err(error)
      else success(result)
    })
}

exports.users.setValidationAuto = (user_id, fk_user_id, success, error)=>{
  exports.users.getPreferenceUser(user_id,fk_user_id,
    (data)=>{
      if(data)
      {
        if(data.length>0)
        {
          const updateQuery = "update PREFERENCES_USER set validation_auto=1 where fk_user ="+mySqlConnection.escape(user_id)+" and fk_otheruser="+mySqlConnection.escape(fk_user_id)
          mySqlConnection.query(
            updateQuery,
            (err,result)=>
            {
              if(err) error(err)
              else success('validation update')
            })
        }
        else {
          exports.users.createPreferenceUser(user_id, fk_user_id,(data)=>{
            const updateQuery = "update PREFERENCES_USER set validation_auto=1 where fk_user ="+mySqlConnection.escape(user_id)+" and fk_otheruser="+mySqlConnection.escape(fk_user_id)
            mySqlConnection.query(
              updateQuery,
              (err,result)=>
              {
                if(err) error(err)
                else success('validation update')
              })
          },(err)=>{error(err)})
        }
      }
    }, (err)=>{error(err)}
  )
}

exports.users.getAllUsers = (success, error)=>{
  let selectQuery = "select * from USERS"
  mySqlConnection.query(
    selectQuery,
    (err, result)=>
    {
      if(err) error(err)
      else success(result)
    })
}

exports.users.setFavoris = (idMyUser, idOtherUser, success, error)=>{
  exports.users.getPreferenceUser(idMyUser, idOtherUser, (pref)=>{
    if(pref)
    {
      var updateQuery;
      var creation= 0;
      if (pref.length===0)
      {
        exports.users.createPreferenceUser(idMyUser, idOtherUser, ()=>{
        updateQuery="UPDATE PREFERENCES_USER SET favoris = 1 WHERE fk_user= "+mySqlConnection.escape(idMyUser)+" and fk_otheruser="+mySqlConnection.escape(idOtherUser)
        mySqlConnection.query(
          updateQuery,
          (err, result)=>{
            if(err) error(err);
            else success(result);
          });

        }, (err)=>{if(err)error(err)})
      }
      else
      {
        //console.log(pref[0]);
        if (pref[0]['favoris'])
        {
          updateQuery="UPDATE PREFERENCES_USER SET favoris = 0 WHERE fk_user= "+mySqlConnection.escape(idMyUser)+" and fk_otheruser="+mySqlConnection.escape(idOtherUser)
        }
        else {
          updateQuery="UPDATE PREFERENCES_USER SET favoris = 1 WHERE fk_user= "+mySqlConnection.escape(idMyUser)+" and fk_otheruser="+mySqlConnection.escape(idOtherUser)
        }
        mySqlConnection.query(
          updateQuery,
          (err, result)=>{
            if(err) error(err);
            else success(result);
          });
      }

    }

  }, (err)=>{if(err)error(err)})
}



//RENDSLARGENT FUNCTIONS
exports.rendslargent.deleteRendsLArgent = (id_rendslargent, success, error)=>{
  const deleteQuery ="delete from RENDSLARGENT where rendslargent_id="+mySqlConnection.escape(id_rendslargent)+""
  mySqlConnection.query(
    deleteQuery,
    (err,result)=>
    {
      if(err) error(err)
      else{
        mySqlConnection.query(
        "DELETE FROM ARTICLES WHERE id_rendsl="+mySqlConnection.escape(id_rendslargent),
        (er,resul)=>{
          if(er) error(er)
          else success("Le rendslargent a bien été supprimé !")
        })
      }
    })
}
/*exports.rendslargent.deleteRendsLArgent = (id_rendslargent, success, error)=>{
  const deleteQuery ="delete from RENDSLARGENT where rendslargent_id="+mySqlConnection.escape(id_rendslargent)+""
  mySqlConnection.query(
    deleteQuery,
    (err,result)=>
    {
      if(err) error(err)
      else success('Le rendslargent a bien ete supprime')
    })
}*/

exports.rendslargent.addUserRendsLArgent = (id_user, id_rendslargent, success, error)=>{
  let sql = "INSERT INTO APPARTIENT (fk_user,fk_rendslargent) VALUES ("+mySqlConnection.escape(id_user)+","+mySqlConnection.escape(id_rendslargent)+")"
  mySqlConnection.query(sql,
    (err,result)=>{
      if(err) error(err)
      success(result)
    })
}

exports.rendslargent.getUsersRendsLArgent =(idRendsLArgent, success, error)=>{
  selectQuery="SELECT fk_user FROM APPARTIENT WHERE fk_rendslargent="+mySqlConnection.escape(idRendsLArgent);
  mySqlConnection.query(
    selectQuery,
    (err, result)=>{
      if(err) error(err);
      else success({result, idRendsLArgent}) ;
    });
}


exports.rendslargent.createRendsLArgent = (id_user, id_users, success, error, nom = 'Rendslargent')=>{
  const today = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const sql = "INSERT INTO RENDSLARGENT (nom,date_debut,fk_creator) VALUES ("+mySqlConnection.escape(nom)+","+mySqlConnection.escape(today)+","+mySqlConnection.escape(id_user)+")"
  mySqlConnection.query(sql,
    (err,results)=>{
      if(err) error(err)
      else {
        let id = results.rendslargent_id;
        console.log(id);
          mySqlConnection.query(
          "SELECT rendslargent_id FROM RENDSLARGENT WHERE fk_creator="+mySqlConnection.escape(id_user)+" AND nom="+mySqlConnection.escape(nom)+" ORDER BY rendslargent_id DESC",
          (err,result)=>{
            exports.rendslargent.addUserRendsLArgent(id_user,result[0].rendslargent_id,
              (cascade)=>{if(cascade)console.log(cascade)},
              (er)=>{if(er)error(er)})
            exports.rendslargent.addMultipleUsersRendsLArgent(id_users, result[0].rendslargent_id,(succ)=>{if(succ)success(succ)}, (er)=>{if(er)error(er)} )
          })

      }
    })
}

exports.rendslargent.getRendsLArgentByUser =(idUser, success, error)=>{
  const selectQuery = "select * from RENDSLARGENT inner join APPARTIENT on RENDSLARGENT.rendslargent_id=APPARTIENT.fk_rendslargent and APPARTIENT.fk_user="+mySqlConnection.escape(idUser)
  mySqlConnection.query(
    selectQuery,
    (err,result)=>{
      if(err)error(err)
      else success(result)
    })
}

exports.rendslargent.addMultipleUsersRendsLArgent = (users_ids, id_rendslargent, success, error)=>{
  new Promise(
    (result, reject)=>{
      for(i=0; i<users_ids.length; i++)
      {
        let insertQuery = "INSERT INTO APPARTIENT (fk_user,fk_rendslargent) VALUES ("+mySqlConnection.escape(users_ids[i])+","+mySqlConnection.escape(id_rendslargent)+")"
        mySqlConnection.query(
          insertQuery,
          (err,result)=>{
            if(err) reject(err)
            console.log(result)
          })
      }
      result('terminé')

    }).then((data)=>{success(data)}).catch((err)=>{error(err)})
}

exports.rendslargent.setTermine = (id_rendslargent, success, error)=>{
  const sql = "UPDATE RENDSLARGENT SET termine=true WHERE rendslargent_id="+mySqlConnection.escape(id_rendslargent)+""
  mySqlConnection.query(sql,
    (err,result)=>{
      if(err) error(err)
      success(result)
    })
}

exports.rendslargent.setRemourseAuto = (id_rendslargent, id_user, echeance, success, error)=>{
  let today = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  if(echeance>today){
    const sql = "UPDATE APPARTIENT SET rembourse_auto=true, echeance="+mySqlConnection.escape(echeance)+" WHERE fk_user="+mySqlConnection.escape(id_user)+" AND fk_rendslargent="+mySqlConnection.escape(id_rendslargent)+""
    mySqlConnection.query(sql,
      (err,result)=>{
        if(err) error(err)
        success(result)
      })
  }else{
    error('date inférieure a date actuelle')
  }
}

exports.rendslargent.getAllTransaction =(id_user1, id_user2, id_rendslargent, success, error)=>{
  var sql = "select SUM(tpm.prix) as total from ARTICLES,(SELECT fk_article, prix FROM TRANSACTIONS WHERE user_payeur="+mySqlConnection.escape(id_user1)+" AND user_devant="+mySqlConnection.escape(id_user2)+" AND fk_rendslargent="+mySqlConnection.escape(id_rendslargent)+" AND valider='valide' AND paye=false ORDER BY fk_article ASC) as tpm where ARTICLES.article_id=tpm.fk_article";
  mySqlConnection.query(sql,
    (err,result)=>{
      if(err) error(err)
      success({user: id_user1, total: result[0].total});
    })
}

exports.rendslargent.getBalanceUser = (id_rendslargent, id_user1, id_user2, success, error)=>{
  let promises = [
      new Promise(
        (result, reject)=>{
        exports.rendslargent.getAllTransaction(id_user1,id_user2,id_rendslargent,(cascada)=>{
          if(cascada)result(cascada)
        }, (err)=>{if(err)reject(err)})
      }
    ),
    new Promise(
      (result, reject)=>{
      exports.rendslargent.getAllTransaction(id_user2,id_user1,id_rendslargent,(cascada)=>{
          if(cascada) result(cascada)
        }, (err)=>{if(err)reject(err)})
    })
  ]
    Promise.all(promises).then(
      (res)=>{
          if(res[0].total>=res[1].total){
            let du = res[0].total-res[1].total
            let benef = res[0].user
            let payant = res[1].user
            success({paye: du, user_benef: benef, user_payant: payant})
          }else{
            let du = res[1].total-res[0].total
            let benef = res[1].user
            let payant = res[0].user
            success({paye: du, user_benef: benef, user_payant: payant})
          }
        }
    ).catch((err)=>{error(err)})
}

exports.rendslargent.createTransaction = (idMyUser, idOtherUser, idRendsLargent, idArticle, prix, transaction_callbck, error) =>{
    if (idMyUser!==idOtherUser)
    {
    exports.users.getPreferenceUser(idMyUser, idOtherUser, (row)=>{
      if (row.length===0)
      {
        const insertQuery="INSERT INTO TRANSACTIONS (paye, valider, fk_rendslargent, user_payeur, user_devant, fk_article, prix) VALUES (0,'en attente', "+mySqlConnection.escape(idRendsLargent)+", "+mySqlConnection.escape(idMyUser)+", "+mySqlConnection.escape(idOtherUser)+", "+mySqlConnection.escape(idArticle)+","+mySqlConnection.escape(prix)+")"
        mySqlConnection.query(
          insertQuery,
          (err, result)=>{
            if(err) console.log(err);
            else transaction_callbck('transaction créée')
          });
      }
      else {
        if (row[0]["validation_auto"])
        {
          const insertQuery="INSERT INTO TRANSACTIONS (valider, fk_rendslargent, user_payeur, user_devant, fk_article, prix) VALUES ('valide', "+mySqlConnection.escape(idRendsLargent)+", "+mySqlConnection.escape(idMyUser)+", "+mySqlConnection.escape(idOtherUser)+", "+mySqlConnection.escape(idArticle)+","+mySqlConnection.escape(prix)+")";
          mySqlConnection.query(
            insertQuery,
            (err, result)=>{
              if(err) console.log(err);
              else transaction_callbck('transaction créée')
            });
        }
        else {
          const insertQuery="INSERT INTO TRANSACTIONS (valider, fk_rendslargent, user_payeur, user_devant, fk_article, prix) VALUES ('en attente', '"+idRendsLargent+"', '"+idMyUser+"', '"+idOtherUser+"', '"+idArticle+","+mySqlConnection.escape(prix)+")";
          mySqlConnection.query(
            insertQuery,
            (err, result)=>{
              if(err) console.log(err);
              else transaction_callbck('transaction créée')
            });
        }
      }
    }, (err)=>{if(err)error(err)} )
  }
}

exports.rendslargent.createTransactionMultipleUsers =  (idMyUser, idsOtherUser, idRendsLargent, idArticle, prix, success, error) =>{
  let myprice = prix/(idsOtherUser.length)
  new Promise(
    (result, reject)=>{
      idsOtherUser.forEach(function(userss) {
          exports.rendslargent.createTransaction(idMyUser, userss, idRendsLargent, idArticle, myprice, (data)=>{if(data){console.log(data)}}, (err)=>{if(err)reject(err)})
      });
      result('travail terminé')
    }).then((data)=>{success(success)}).catch((er)=>{error(er)})

}
exports.rendslargent.validerTransaction = (idTransaction, statut, success, error)=>{
  if(statut ==0)
  {
    const insertQuery="UPDATE TRANSACTIONS SET valider = 'refuse' WHERE transaction_id="+mySqlConnection.escape(idTransaction)
    mySqlConnection.query(
      insertQuery,
      (err, result)=>{
        if(err) error(err);
        else success(statut)
      });
  }
  else if(statut ==1)
   {
     const insertQuery="UPDATE TRANSACTIONS SET valider = 'valide' WHERE transaction_id="+mySqlConnection.escape(idTransaction);
     mySqlConnection.query(
       insertQuery,
       (err, result)=>{
         if(err) error(err);
         else success(statut)
       });
   }
}

exports.rendslargent.getBalanceRendsLArgent = (idRendsLargent, success, error)=>{
  exports.rendslargent.getUsersRendsLArgent(idRendsLargent, (data)=>{
    if(data)
    {
      let promises = []
      let indice = 0;

      for(i=0; i<data.result.length; i++)
      {
        for(j=i+1; j<data.result.length; j++)
        {
          promises[indice] = new Promise(
            (result,reject)=>{
              exports.rendslargent.getBalanceUser(idRendsLargent, data.result[i]['fk_user'], data.result[j]['fk_user'],
              (res)=>{
                if(res)
                {
                  result(res)
                }

              },(err)=>{if(err)reject(err)}  )
            }
          )
          indice++;

        }
      }
      Promise.all(promises).then(
        (balance)=>{success(balance)}
      ).catch((err)=>{error(err)})

    }

  }, (err)=>{if(err)error(err)})
}

exports.rendslargent.getAllTransactionForARendsLArgent = (idRendsLArgent, success, error)=>{
  const selectQuery = "select * from TRANSACTIONS where valider='valide' and paye=0 and fk_rendslargent="+mySqlConnection.escape(idRendsLArgent)
  mySqlConnection.query(
    selectQuery,
    (err, result)=>{
      if(err) error(err);
      success(result);
    });
}

exports.rendslargent.getTotal =(idRendsLArgent, success, error)=>{
  exports.rendslargent.getBalanceRendsLArgent(idRendsLArgent, (data)=>{
    if(data){
      console.log(data)

    let user = []
    let positif = []
    let negatif = []
    new Promise(
    (result, reject)=>{
    for(i=0; i<data.length; i++)
    {

      if(user.filter((e)=>{ return e.user === data[i]['user_benef']}).length>0){
        console.log('le tab a ce user benef')
        for(j =0; j<user.length; j++)
        {
          if(user[j]['user']===data[i]['user_benef'])
                  user[j]['paye'] += data[i]['paye']
        }

      }
      else {
        console.log('le tab n a  pas ce user benef')

        us = data[i]['user_benef']
        ar =data[i]['paye']
        user.push({user:us, paye : ar})
      }
      if(user.filter((e)=>{ return e.user === data[i]['user_payant']}).length>0){
        console.log('le tab a ce user payant')


        for(j =0; j<user.length; j++)
        {
          if(user[j]['user']===data[i]['user_payant'])
                  user[j]['paye'] -= data[i]['paye']
        }
      }
      else {
        console.log('le tab n a pas ce user payant')

        us = data[i]['user_payant']
        ar =data[i]['paye']
        user.push({user:us, paye : -ar})
      }

      }

    result(user)



  }).then((data)=>{
    new Promise(
      (result,reject)=>{
        for(i=0; i<user.length; i++)
        {
          if(data[i]['paye']<0) negatif.push({user: data[i]['user'], paye:-data[i]['paye']})
          if(data[i]['paye']>0) positif.push({user: data[i]['user'], paye:data[i]['paye']})

        }
        result({positif, negatif})
      }).then((data)=>{success(data)})


  })
  }
  },(err)=>{if(err)error(err)})
}

exports.rendslargent.getBalance = (idRendsLArgent, success, error)=>{
  exports.rendslargent.getTotal(idRendsLArgent, (data)=>{
    if(data)
    {
      let positif = data['positif']
      let negatif = data['negatif']
      let transaction = []
      indiceNeg =0
      indicePos = 0
      new Promise(
        (result, reject)=>{
          while(indicePos < positif.length && indiceNeg<negatif.length)
          {
            if(positif[indicePos]['paye']>=negatif[indiceNeg]['paye'])
            {
              transaction.push({user_benef:positif[indicePos]['user'], user_payant:negatif[indiceNeg]['user'], paye:negatif[indiceNeg]['paye']})
              indiceNeg ++;
            }
            else {
              transaction.push({user_benef:positif[indicePos]['user'], user_payant:negatif[indiceNeg]['user'], paye:positif[indicePos]['paye']})
              negatif[indiceNeg]['paye']-=positif[indicePos]['paye']
              indicePos ++;
            }
          }
          result(transaction)
        }).then((data)=>{success(data)})

    }

  }, (err)=>{if(err)error(err)})
}



//Liste des transaction non payé (même celles en cours, c a d non validé ou invalidé par l'utilisateur) => pour afficher les dettes de l'utilisateur
exports.rendslargent.getAllTransactionUnpayedForAUser = (id_user, id_rendslargent, success, error)=>{
  var sql = "select A.article_prix, A.article_nom, tpm.valider, tpm.user_payeur, U.user_nom, tpm.prix, tpm.transaction_id, U.user_prenom, U.user_login from ARTICLES A,(SELECT valider, fk_article, user_payeur, prix, transaction_id FROM TRANSACTIONS WHERE user_devant="+mySqlConnection.escape(id_user)+" AND fk_rendslargent="+mySqlConnection.escape(id_rendslargent)+" AND paye=false ORDER BY fk_article ASC) tpm, (SELECT user_id,user_nom, user_prenom, user_login FROM USERS) AS U where A.article_id=tpm.fk_article AND tpm.user_payeur=U.user_id";
  mySqlConnection.query(sql,
    (err,result)=>{
      if(err) error(err)
      else success(result);
    })
}

//getAllTransactionUnpayedForAUser(6, 1, (cascade)=>{console.log(cascade)})

//Liste des transaction non validé/invalidé par l'utilisateur => pour la partie valider/invalider la transaction demandée
exports.rendslargent.getAllTransactionUncheckedForAUser = (id_user, id_rendslargent, success, error)=>{
  var sql = "select A.article_prix, A.article_nom, tpm.valider, tpm.user_payeur, tpm.transaction_id, tpm.prix, U.user_nom, U.user_prenom, U.user_login from ARTICLES A,(SELECT valider, fk_article, user_payeur, transaction_id, prix FROM TRANSACTIONS WHERE user_devant="+mySqlConnection.escape(id_user)+" AND fk_rendslargent="+mySqlConnection.escape(id_rendslargent)+" AND paye=false AND valider='en attente' ORDER BY fk_article ASC) tpm, (SELECT user_id,user_nom, user_prenom, user_login FROM USERS) AS U where A.article_id=tpm.fk_article AND tpm.user_payeur=U.user_id";
  mySqlConnection.query(sql,
    (err,result)=>{
      if(err) error(err)
      else success(result);
    })
}

exports.rendslargent.getTransactionsPayed =(id_user, success, error)=>{
  selectQuery="select A.article_prix, A.article_nom, tpm.valider, tpm.user_payeur, tpm.transaction_id, tpm.prix, U.user_nom, U.user_prenom from ARTICLES A,(SELECT valider, fk_article, user_payeur, transaction_id, prix FROM TRANSACTIONS WHERE user_devant="+mySqlConnection.escape(id_user)+" AND fk_rendslargent="+mySqlConnection.escape(id_rendslargent)+" AND paye=true ORDER BY fk_article ASC) tpm, (SELECT user_id,user_nom, user_prenom FROM USERS) AS U where A.article_id=tpm.fk_article AND tpm.user_payeur=U.user_id";;
  mySqlConnection.query(
    selectQuery,
    (err, result)=>{
      if(err) error(err);
      else success({result, idRendsLArgent}) ;
    });
}

exports.rendslargent.getAllTransactionsForAUser =(id_user, success, error)=>{
  selectQuery="select A.article_prix, A.article_nom, tpm.valider, tpm.user_payeur, tpm.transaction_id, tpm.prix, U.user_nom, U.user_prenom from ARTICLES A,(SELECT valider, fk_article, user_payeur, transaction_id, prix FROM TRANSACTIONS WHERE user_devant="+mySqlConnection.escape(id_user)+" AND fk_rendslargent="+mySqlConnection.escape(id_rendslargent)+" ORDER BY fk_article ASC) tpm, (SELECT user_id,user_nom, user_prenom FROM USERS) AS U where A.article_id=tpm.fk_article AND tpm.user_payeur=U.user_id";;
  mySqlConnection.query(
    selectQuery,
    (err, result)=>{
      if(err) error(err);
      else success({result, idRendsLArgent}) ;
    });
}

exports.rendslargent.updatePayeOnTransaction = (idUser1, idUser2, idRendsLArgent, success, error)=>{
  let promTab =[
    new Promise(
      (res,reject)=>{
        const updateQuery = "update TRANSACTIONS set paye=1 where (valider='valide' or valider='refuse') and user_payeur="+mySqlConnection.escape(idUser1)+" and user_devant="+mySqlConnection.escape(idUser2)+" and fk_rendslargent="+mySqlConnection.escape(idRendsLArgent)
        mySqlConnection.query(
          updateQuery,
          (err,result)=>{
            if(err)reject(err)
            else res(result)
          })

      }),

    new Promise(
      (res, reject)=>{
        const updateQuery2 = "update TRANSACTIONS set paye=1 where (valider='valide' or valider='refuse') and user_payeur="+mySqlConnection.escape(idUser2)+" and user_devant="+mySqlConnection.escape(idUser1)+" and fk_rendslargent="+mySqlConnection.escape(idRendsLArgent)
        mySqlConnection.query(
          updateQuery2,
          (err,result)=>{
            if(err)reject(err)
            else res(result)
          })

      })
  ]
  Promise.all(promTab).then((data)=>{success(data)}).catch((err)=>{error(err)})
}

exports.rendslargent.updatePayeOnOneTransaction = (idTransaction, success, error)=>{
        const updateQuery = "update TRANSACTIONS set paye=1 where transaction_id="+mySqlConnection.escape(idTransaction)
        mySqlConnection.query(
          updateQuery,
          (err,result)=>{
            if(err)error(err)
            else success(result)
          })

      }


//###############################################################################
// ARTICLES FUNCTIONS
//###############################################################################

exports.articles.addArticlesPayutc = (success, error)=>{
    payutc.config.setAppKey(config.APP_KEY)
    payutc.login.payuser({
      login:config.USERNAME,
      password:config.PASSWORD,
      callback: function(){
        exports.articles.getProductsList(
          (succ)=>{

                  for(i=0;i<succ.length; i++)
                  {
                                exports.articles.createArticlePayutc(succ[i]['name'], succ[i]['price'], succ[i]['id'],
                              (value)=>{success(value)},
                            (err)=>{error(err)})
                          }
          },
          (err)=>{if(err)error(err)}
        )

      }
    })

}

exports.articles.getProductsList = (success, err)=>{
  payutc.articles.getArticles({funId:2, callback: (data)=>{
    if(data.error) err(data.error)
    else {
      const content = JSON.parse(data)

      let mypromise = new Promise(
        (resolve, reject)=>
        {
          mydata = []
          for(i=0; i<content.length; i++)
          {

            mydata[i]={id : content[i]['id'], name : content[i]['name'], price : content[i]['price']}
          }
          if(mydata.length>0)
            resolve(mydata)
          else reject('ERREUR PRODUCT LIST')
        }
      ).then((post)=>{success(post)}).catch((error)=>{err(error)})

    }
  }})
}

exports.articles.getArticles =(success, error)=>{
  var selectQuery = "SELECT * FROM ARTICLES";
  mySqlConnection.query(
    selectQuery,
    (err, result)=>{
      if(err) error(err);
      success(result);
    });
}

exports.articles.getPayutArticle= (idArticle, success, error)=>{
  let selectQuery = "select * from ARTICLES_PAYUT where id_payut="+mySqlConnection.escape(idArticle)
  mySqlConnection.query(
    selectQuery,
    (err, result)=>
    {
      if(err) error(err)
      else success(result)
    })
}

exports.articles.getPayutArticle2= (information, idArticle, success, error)=>{
  let selectQuery = "select * from ARTICLES_PAYUT where id_payut="+mySqlConnection.escape(idArticle)
  mySqlConnection.query(
    selectQuery,
    (err, result)=>
    {
      if(err) error(err)
      else success({information, result})
    })
}

exports.articles.createArticle = (nom_article, prix_article, attr2, success, error, attr3=null)=>{
  const insertQuery="INSERT INTO ARTICLES (article_nom, article_prix, id_rendsl) VALUES ("+mySqlConnection.escape(nom_article)+", "+mySqlConnection.escape(prix_article)+", "+mySqlConnection.escape(attr3)+")";
  mySqlConnection.query(
    insertQuery,
    (err, result)=>{
      if(err) error(err);
      else success({result, attr2})
    });
}

exports.articles.createArticleExte = (nom_article, prix_article, attr2, attr3, success, error)=>{
  exports.articles.createArticle(nom_article, prix_article, attr2,
    (data)=>{
      const insertQuery ="INSERT INTO ARTICLES_EXTE (fk_article, fk_rendslargent) VALUES ("+mySqlConnection.escape(data.result['insertId'])+", "+mySqlConnection.escape(attr3)+")"
      mySqlConnection.query(
        insertQuery,
        (err, result)=>{
          if(err) error(err);
          else success(result)
        });


  }, (err)=>{if(err)console.log(err)}, attr3)
}

exports.articles.createArticlePayutc = (nom_article, prix_article, attr2, success, error)=>{
  exports.articles.createArticle(nom_article, prix_article, attr2,
    (data)=>{
      const insertQuery ="INSERT INTO ARTICLES_PAYUT (article_id, id_payut) VALUES ("+mySqlConnection.escape(data.result['insertId'])+", "+mySqlConnection.escape(data['attr2'])+")"
      mySqlConnection.query(
        insertQuery,
        (err, result)=>{
          if(err) error(err);
          else success(result)
        });


  }, (err)=>{if(err)console.log(err)})
}

exports.articles.getOneArticle= (idArticle, success, error)=>{
  let selectQuery = "select article_nom, article_prix from ARTICLES where article_id="+mySqlConnection.escape(idArticle)
  mySqlConnection.query(
    selectQuery,
    (err, result)=>
    {
      if(err) error(err)
      else success(result)
    })
}





//###############################################################################
// USERS FUNCTIONS
//###############################################################################

//INFOS GENERALES DU USER
exports.users.getUserInfo = (login, success, error)=>{
  payutc.config.setAppKey(config.APP_KEY)
  payutc.login.payuser({
    login:config.USERNAME,
    password:config.PASSWORD,
    callback: function(){
      payutc.users.getUserInfo({
        queryString : login,
        wallet_config:1,
        callback : (data)=>{
        success(data)
        }})
  }})
}


//CREDIT DU USER
exports.users.getUserMoney = (login, success, error)=>{
  exports.users.getUserInfo(login, (data)=>{
    if(data)
    {
      const content = JSON.parse(data)
      console.log(content[0]['id'])

          payutc.users.wallet({
            wallet : content[0]['id'],
            callback : (data)=>{
              let mycontent = JSON.parse(data)
              for (i=0; i<mycontent.length; i++)
              {
                if(mycontent[i]['id']===content[0]['id'])
                {
                  let sendContent = JSON.stringify(mycontent[i]['credit'])
                  success(sendContent)
                }}
      }})
    }
  }, (err)=>{if(err)error(err)})
}


exports.users.adminTransfert = (amount, loginSrc, loginDst, idrendslargent, success, error)=>{
  let protab = [
    proUserSrc = new Promise(
      (result, reject)=>{
        exports.users.getUserInfo(loginSrc, (data)=>{
          if(data)
          {
            let myContent = JSON.parse(data)
            result(myContent[0]['id'])
          }
          }, (err)=>{if(err)reject(err)})
      }),

      proUserDst = new Promise(
          (result, reject)=>{
            exports.users.getUserInfo(loginDst, (data)=>{
              if(data)
              {
                let myContent = JSON.parse(data)
                result(myContent[0]['id'])

              }
              }, (err)=>{if(err)reject(err)})
          }),

          proMoney = new Promise(
            (result, reject)=>{
              exports.users.getUserMoney(loginSrc, (data)=>{
                if(data) result(data)
              })
            }
          ),

          proUser1 = new Promise(
            (result, reject)=>{
              exports.users.getUserByLogin(loginSrc, (data)=>{if(data)result(data[0]['user_id'])}, (err)=>{if(err)reject(err)})
            }

          ),

          proUser2 = new Promise(
            (result,reject)=>{
              exports.users.getUserByLogin(loginDst, (data)=>{if(data)result(data[0]['user_id'])}, (err)=>{if(err)reject(err)})

            })
  ]

  Promise.all(protab).then((data)=>{
    console.log(data)
    console.log('my account'+data[2])
    let myacount = data[2]

    console.log(amount)
    if(myacount<(amount/100))
    {
      success('transaction impossible, vous n avez pas assez')
    }
    else {
      exports.rendslargent.updatePayeOnTransaction(data[3], data[4], idrendslargent, (data)=>{
        if(data)
        {
          console.log(data)

        }

      }, (err)=>{if(err)error(err)})

      payutc.config.setAppKey(config.APP_KEY)
      payutc.login.payuser({
        login:config.USERNAME,
        password:config.PASSWORD,
        callback: function(){
          payutc.users.adminTransfert({
            amount: amount,
            message : 'Transfert RendsLArgent',
            walletDst : data[1],
            walletSrc : data[0],
            callback : (response)=>{
              success(response)
            }})
          }})



    }

  }).catch((echec)=>{error(echec)})
}


exports.users.adminTransfertOneArticle = (amount, loginSrc, loginDst, idTransaction, success, error)=>{
  let protab = [
    proUserSrc = new Promise(
      (result, reject)=>{
        exports.users.getUserInfo(loginSrc, (data)=>{
          if(data)
          {
            let myContent = JSON.parse(data)
            result(myContent[0]['id'])
          }
          }, (err)=>{if(err)reject(err)})
      }),

      proUserDst = new Promise(
          (result, reject)=>{
            exports.users.getUserInfo(loginDst, (data)=>{
              if(data)
              {
                let myContent = JSON.parse(data)
                result(myContent[0]['id'])

              }
              }, (err)=>{if(err)reject(err)})
          }),

          proMoney = new Promise(
            (result, reject)=>{
              exports.users.getUserMoney(loginSrc, (data)=>{
                if(data) result(data)
              })
            }
          )
  ]

  Promise.all(protab).then((data)=>{
    console.log(data)
    console.log('my account'+data[2])
    let myacount = data[2]

    console.log(amount)
    if(myacount<(amount/100))
    {
      success('transaction impossible, vous n avez pas assez')
    }
    else {
      exports.rendslargent.updatePayeOnOneTransaction(idTransaction, (data)=>{
        if(data)
        {
          console.log(data)

        }

      }, (err)=>{if(err)error(err)})

      payutc.config.setAppKey(config.APP_KEY)
      payutc.login.payuser({
        login:config.USERNAME,
        password:config.PASSWORD,
        callback: function(){
          payutc.users.adminTransfert({
            amount: amount,
            message : 'Transfert RendsLArgent',
            walletDst : data[1],
            walletSrc : data[0],
            callback : (response)=>{
              success(response)
            }})
          }})



    }

  }).catch((echec)=>{error(echec)})
}
