/*

Genre si l'utilisateur n'a aucun tricount on affiche rien et au milieu ya un gros bouton Ajoute ton premier Rendslargent

Statistique :  Rankning des meilleurs et pire de l'utc


Easter egg OSSAPIK

*/




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
//       Requetes ajax
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
  var thune;
if($('#username').val()=='guest'){
  window.location.replace("https://cas.utc.fr/cas/login?service=http://vps528307.ovh.net:3001/login")
}

$.ajaxSetup({
async: false
});

function reload_affichage() {
  //Reaffichage des dettes
  $('#depense_resume tr').remove()
  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/getAllTransactionUnpayedForAUser',
  {userId: id_userco, rendslargentId: id_rendsl}, function(data){
          data.forEach((depenses)=>{
            if(depenses.valider=='en attente')
            $('#depense_resume').append("<tr><th scope=row>"+depenses.article_nom+"</th><td>"+depenses.prix/100+" € </td><td>payé par "+depenses.user_prenom+" "+depenses.user_nom+"</td><td><span class='badge badge-warning'>"+depenses.valider+"</span></td></tr>")
            if(depenses.valider=='valide')
            $('#depense_resume').append("<tr><th scope=row>"+depenses.article_nom+"</th><td>"+depenses.prix/100+" € </td><td>payé par "+depenses.user_prenom+" "+depenses.user_nom+"</td><td><span class='badge badge-success'>"+depenses.valider+"</span></td></tr>")
            if(depenses.valider=='refuse')
            $('#depense_resume').append("<tr><th scope=row>"+depenses.article_nom+"</th><td>"+depenses.prix/100+" € </td><td>payé par "+depenses.user_prenom+" "+depenses.user_nom+"</td><td><span class='badge badge-danger'>"+depenses.valider+"</span></td></tr>")
          })
  });
  //Reaffichage des balances
  $('#balance_rendslargent tr').remove()
  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/getBalanceRendsLArgent',
  {id: id_rendsl}, function(data){
          data.forEach((balance)=>{
            var payant = balance.user_payant
            var benef = balance.user_benef
            $.post('http://vps528307.ovh.net:3001/USERS/getUserById',
            {id: payant}, function(datab){
              $.post('http://vps528307.ovh.net:3001/USERS/getUserById',
              {id: benef}, function(datac){
                if(balance.paye!==0){
                  console.log(balance.paye)
                  if(datab[0].user_id==id_userco){
                //    if((balance.paye)>=thune){
                      $("#balance_rendslargent").append("<tr><td class='"+datab[0].user_login+"'><b>"+datab[0].user_prenom+" "+datab[0].user_nom+"</b></td><td>doit à</td><td class='"+datac[0].user_login+"'><b>"+datac[0].user_prenom+" "+datac[0].user_nom+"</b></td><td class='"+balance.paye+"'>"+(balance.paye/100).toFixed(2)+" €</td><td><button type='button' class='btn btn-info remboursage'>Rembourser</button></td></tr>");
                  //  }else{
                    // $("#balance_rendslargent").append("<tr><td class='"+datab[0].user_login+"'><b>"+datab[0].user_prenom+" "+datab[0].user_nom+"</b></td><td>doit à</td><td class='"+datac[0].user_login+"'><b>"+datac[0].user_prenom+" "+datac[0].user_nom+"</b></td><td class='"+balance.paye+"'>"+(balance.paye/100).toFixed(2)+" €</td><td><button type='button' class='btn btn-info disabled'>T'as pas assez frero</button></td></tr>");
                   //}
                  }else if(datab[0].user_id!==id_userco){
                    if(datac[0].user_id==id_userco){
                      $("#balance_rendslargent").append("<tr><td class='"+datab[0].user_login+"'><b>"+datab[0].user_prenom+" "+datab[0].user_nom+"</b></td><td>doit à</td><td class='"+datac[0].user_login+"'><b>"+datac[0].user_prenom+" "+datac[0].user_nom+"</b></td><td class='"+balance.paye+"'>"+(balance.paye/100).toFixed(2)+" €</td><td><button type='button' class='btn btn-warning quemendage'>Quemender</button></td></tr>");
                      }
                    }
                }
              });
            });
          })
  });

//Reaffichage du resume de sdepenses
  $('#resume_transactions tr').remove()
  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/getAllTransactionUnpayedForAUser',
  {userId: id_userco, rendslargentId: id_rendsl}, function(data){
          data.forEach((depenses)=>{
            if(depenses.valider=='valide')
            $('#resume_transactions').append("<tr><td class='"+depenses.user_login+"'><b>"+depenses.user_prenom+" "+depenses.user_nom+"</b></td><td class='"+$('#username').val()+"'> vous a payé </td><td class='"+depenses.prix+"'>"+depenses.prix/100+" € </td><td><button type='button' class='btn btn-info soloremboursage'>Rembourser l'article</button></td></tr>")
            if(depenses.valider=='en attente')
            $('#resume_transactions').append("<tr><td class='"+depenses.user_login+"'><b>"+depenses.user_prenom+" "+depenses.user_nom+"</b></td><td class='"+$('#username').val()+"'> vous a payé </td><td class='"+depenses.prix+"'>"+depenses.prix/100+" € </td><td><span class='badge badge-warning'>"+depenses.valider+"</span></td></tr>")
          })
  });


  $('.invalider_dette').click(function() {
    var idtrans = $(this).attr('id')
    $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/validerTransaction',
    {transactionId: idtrans, statut: 0}, function(data){
      reload_demande();
      reload_affichage();
    });
  });
  $('.valider_dette').click(function() {
    var idtrans = $(this).attr('id')
    $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/validerTransaction',
    {transactionId: idtrans, statut: 1}, function(data){
      reload_demande();
      reload_affichage();
    });
  });


  $('#paging li').remove()
  init();
  selectPage(1)


}

function reload_demande() {
  $('#liste_dette a').remove()
  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/getAllTransactionUncheckedForAUser',
  {userId: id_userco, rendslargentId: id_rendsl}, function(data){
          data.forEach((attente)=>{
            $('#liste_dette').append("<a class='dropdown-item'>"+attente.user_prenom+" "+attente.user_nom+" "+attente.article_nom+" "+attente.prix/100+" €<div class='float-right'> <button type='button' class='btn btn-success valider_dette' id='"+attente.transaction_id+"'>Valider</button><button type='button' class='btn btn-danger invalider_dette' id='"+attente.transaction_id+"'>Invalider</button></div></a>")
          })
  });
}


///////////////////////////////////////////////////////////////////////////////////////////////
  //   Initialisation
///////////////////////////////////////////////////////////////////////////////////////////////

var log = $('#username').val()
var id_rendsl;
var id_userco;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
//       remplissage page principale
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:

//ID et IDrendslargent de rang le plus faible
if(typeof id_userco=='undefined' && log!=='guest'){

  //Chopper l'ID de l'utilisateur connecté
  var nomtotal = $('#name').val().split(" ")
  var nomuser = nomtotal[1]
  var prenomuser = nomtotal[0]
  var mail = $('#mail').val();
  $.post('http://vps528307.ovh.net:3001/USERS/createUser', {nom: nomuser, prenom: prenomuser, email: mail, login: log}, function(data){
    console.log(data)
    log=data[0].login
    nomuser = data[0].user_nom
    prenomuser = data[0].user_prenom
    mail = data[0].user_mail
    id_userco = data[0].user_id
    $('#Bienvenue').text("Bienvenue sale chien de "+prenomuser+" "+nomuser)
  });

  //Selections des Rendslargent pour l'utilisateur connecté et Selection du Rendslargent actif
  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/getRendsLArgentByUser',
  {id: id_userco}, function(data){
          if(typeof data !== 'undefined' && data.length > 0){
            id_rendsl = data[0].rendslargent_id
            data.forEach((rends)=>{
              $('#choix_rendslargent').append("<a href='#' id='"+rends.rendslargent_id+"' class='list-group-item list-group-item-action list-group-item-warning'>"+rends.nom+"</a>")
            })
          }
          else{console.log("Aucun Rendslargent pour cet user")}
  });

  //Affichage des demande de dettes
  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/getAllTransactionUncheckedForAUser',
  {userId: id_userco, rendslargentId: id_rendsl}, function(data){
          data.forEach((attente)=>{
            $('#liste_dette').append("<a class='dropdown-item'>"+attente.user_prenom+" "+attente.user_nom+" "+attente.article_nom+" "+attente.prix/100+" €<div class='float-right'> <button type='button' class='btn btn-success valider_dette' id='"+attente.transaction_id+"'>Valider</button><button type='button' class='btn btn-danger invalider_dette' id='"+attente.transaction_id+"'>Invalider</button></div></a>")
          })
  });

  //Selection des Transactions pour l'user connecté
  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/getAllTransactionUnpayedForAUser',
  {userId: id_userco, rendslargentId: id_rendsl}, function(data){
          data.forEach((depenses)=>{
            if(depenses.valider=='en attente')
            $('#depense_resume').append("<tr><th scope=row>"+depenses.article_nom+"</th><td>"+depenses.prix/100+" € </td><td>payé par "+depenses.user_prenom+" "+depenses.user_nom+"</td><td><span class='badge badge-warning'>"+depenses.valider+"</span></td></tr>")
            if(depenses.valider=='valide')
            $('#depense_resume').append("<tr><th scope=row>"+depenses.article_nom+"</th><td>"+depenses.prix/100+" € </td><td>payé par "+depenses.user_prenom+" "+depenses.user_nom+"</td><td><span class='badge badge-success'>"+depenses.valider+"</span></td></tr>")
            if(depenses.valider=='refuse')
            $('#depense_resume').append("<tr><th scope=row>"+depenses.article_nom+"</th><td>"+depenses.prix/100+" € </td><td>payé par "+depenses.user_prenom+" "+depenses.user_nom+"</td><td><span class='badge badge-danger'>"+depenses.valider+"</span></td></tr>")
          })
  });

  //Affichage des balances
  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/getBalanceRendsLArgent',
  {id: id_rendsl}, function(data){
          data.forEach((balance)=>{
            var payant = balance.user_payant
            var benef = balance.user_benef
            $.post('http://vps528307.ovh.net:3001/USERS/getUserById',
            {id: payant}, function(datab){
              $.post('http://vps528307.ovh.net:3001/USERS/getUserById',
              {id: benef}, function(datac){
                  if(balance.paye!==0){
                    console.log(balance.paye)
                    if(datab[0].user_id==id_userco){
                  //    if((balance.paye)>=thune){
                        $("#balance_rendslargent").append("<tr><td class='"+datab[0].user_login+"'><b>"+datab[0].user_prenom+" "+datab[0].user_nom+"</b></td><td>doit à</td><td class='"+datac[0].user_login+"'><b>"+datac[0].user_prenom+" "+datac[0].user_nom+"</b></td><td class='"+balance.paye+"'>"+(balance.paye/100).toFixed(2)+" €</td><td><button type='button' class='btn btn-info remboursage'>Rembourser</button></td></tr>");
                    //  }else{
                      // $("#balance_rendslargent").append("<tr><td class='"+datab[0].user_login+"'><b>"+datab[0].user_prenom+" "+datab[0].user_nom+"</b></td><td>doit à</td><td class='"+datac[0].user_login+"'><b>"+datac[0].user_prenom+" "+datac[0].user_nom+"</b></td><td class='"+balance.paye+"'>"+(balance.paye/100).toFixed(2)+" €</td><td><button type='button' class='btn btn-info disabled'>T'as pas assez frero</button></td></tr>");
                     //}
                    }else if(datab[0].user_id!==id_userco){
                      if(datac[0].user_id==id_userco){
                        $("#balance_rendslargent").append("<tr><td class='"+datab[0].user_login+"'><b>"+datab[0].user_prenom+" "+datab[0].user_nom+"</b></td><td>doit à</td><td class='"+datac[0].user_login+"'><b>"+datac[0].user_prenom+" "+datac[0].user_nom+"</b></td><td class='"+balance.paye+"'>"+(balance.paye/100).toFixed(2)+" €</td><td><button type='button' class='btn btn-warning quemendage'>Quemender</button></td></tr>");
                        }
                      }
                  }
              });
            });
          })
  });

  //Affichage de toutes les transactions


  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/getAllTransactionUnpayedForAUser',
  {userId: id_userco, rendslargentId: id_rendsl}, function(data){
          data.forEach((depenses)=>{
            if(depenses.valider=='valide')
            $('#resume_transactions').append("<tr><td class='"+depenses.user_login+"'><b>"+depenses.user_prenom+" "+depenses.user_nom+"</b></td><td class='"+$('#username').val()+"'> vous a payé </td><td class='"+depenses.prix+"'>"+depenses.prix/100+" € </td><td class='"+depenses.transaction_id+"'>"+depenses.article_nom+"</td><td><button type='button' class='btn btn-info soloremboursage'>Rembourser l'article</button></td></tr>")
            if(depenses.valider=='en attente')
            $('#resume_transactions').append("<tr><td class='"+depenses.user_login+"'><b>"+depenses.user_prenom+" "+depenses.user_nom+"</b></td><td class='"+$('#username').val()+"'> vous a payé </td><td class='"+depenses.prix+"'>"+depenses.prix/100+" € </td><td><span class='badge badge-warning'>"+depenses.valider+"</span></td></tr>")
          })
  });






  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
  //      WAllet et Thunes
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////:

  let login_wallet = String($('#username').val())
  $.post('http://vps528307.ovh.net:3001/USERS/getUserMoney',
  {login: login_wallet}, function(data){
    console.log(data)
    thune=parseInt(data);
    $('#money').append("<u>Votre solde</u> : "+data/100+ " €")
  });

}

//Changer de Rendslargent
$('#choix_rendslargent a').click(function(){
  id_rendsl = $(this).attr('id');
  reload_demande();
  reload_affichage();
})

//Validité des dettes
$('.valider_dette').click(function() {
  var idtrans = $(this).attr('id')
  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/validerTransaction',
  {transactionId: idtrans, statut: 1}, function(data){
    reload_demande();
    reload_affichage();
  });
});

$('.invalider_dette').click(function() {
  var idtrans = $(this).attr('id')
  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/validerTransaction',
  {transactionId: idtrans, statut: 0}, function(data){
    reload_demande();
    reload_affichage();
  });
});



//Suppression Rendslargent
$('#suppr_rendsl').click(function(){


  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/deleteRendsLArgent',
  {id: id_rendsl}, function(data){
    console.log(data)
  });


window.location.replace("https://cas.utc.fr/cas/login?service=http://vps528307.ovh.net:3001/login");

})


$('.remboursage').click(function(){
  var ligne = $(this).closest("tr").find("td");
  var logg = ligne.map(function() {
    return $(this).attr('class');
  });
  $.post('http://vps528307.ovh.net:3001/USERS/adminTransfert',
  {amount: parseInt(logg[2]), loginSrc: String(logg[0]),loginDst: String(logg[1]), idrendslargent:id_rendsl}, function(data){
    console.log(data)
  });
  setTimeout(function(){
    window.location.replace("https://cas.utc.fr/cas/login?service=http://vps528307.ovh.net:3001/login");
  }, 100);
})

$('.soloremboursage').click(function(){
  var ligne = $(this).closest("tr").find("td");
  var logg = ligne.map(function() {
    return $(this).attr('class');
  });
  $.post('http://vps528307.ovh.net:3001/USERS/adminTransfertOneArticle',
  {amount: parseInt(logg[2]), loginSrc: String(logg[1]),loginDst: String(logg[0]), idtransaction: logg[3]}, function(data){
    console.log(data)
  });
  setTimeout(function(){
    window.location.replace("https://cas.utc.fr/cas/login?service=http://vps528307.ovh.net:3001/login");
  }, 100);
})




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
//       Liaisons
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:

//Liason ajoutdépense
$("#Ajout_depense").click(function() {
  $("#addtric").remove();
  var $cacher = $('#cacher')
  $cacher.hide();
  var $conteneur = $('.ajout').append("<div id='addtric'></div>")
  $.get('./adddepenses.html', function(data) {
    $('#addtric').html(data);
  });
});

//Liason de ajout tricount
$("#Ajout_Rendslargent").click(function() {
  $("#addtric").remove();
  var $cacher = $('#cacher')
  $cacher.hide();
  var $conteneur = $('.ajout').append("<div id='addtric'></div>")
  $.get('./addrendslargent.html', function(data) {
    $('#addtric').html(data);
  });
});

//Liaison de ajout article exte
$('#add_articleexte').click(function(){
  $("#addtric").remove();
  var $cacher = $('#cacher')
  $cacher.hide();
  var $conteneur = $('.ajout').append("<div id='addtric'></div>")
  $.get('./addarticleexte.html', function(data) {
    $('#addtric').html(data);
  });
})


//Liaison de ajout article exte
$('#add_usertorendsl').click(function(){
  $("#addtric").remove();
  var $cacher = $('#cacher')
  $cacher.hide();
  var $conteneur = $('.ajout').append("<div id='addtric'></div>")
  $.get('./adduserrendslargent.html', function(data) {
    $('#addtric').html(data);
  });
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
//       Pagination (pour les Dettes)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
var historique;
var rows;
var rowCount = 0;
var pageSize = 8;
var pageIndex = 0;
var pages = 0;

function init(){
  historique = $('#depense_resume');
  rows = $('#depense_resume tr')
  rowCount = rows.length;
  pages = Math.ceil(rowCount / pageSize);
  var paging = $('#paging')

  if(pages<=10)
  {
  //  paging.append("<li><a class='page-link'>" + "<<" + "</a></li>");
    for ( var i=1; i <= pages; i++){
            paging.append("<li class='page-item'><a onclick='selectPage(" + i + ");' class='page-link'>" + i + "</a></li>");
    }
  //  paging.append("<li><a class='page-link'>" + ">>" + "</a></li>");
  }else{


  }
}

init()
selectPage(1)

function selectPage(pageIndex){
  var current = (pageSize * (pageIndex - 1));
  var next = (current + pageSize < rowCount) ? current + pageSize : rowCount;
  var paging = $('#paging')

  if(pages<=10)
  {
    var button = $('#paging li')
    for(var i=0; i<pages; i++)
      button[i].className="";
    button[pageIndex-1].className="active";
  } else {
    posCurrent = 3;
    if(pageIndex<3)
      posCurrent = pageIndex;
    start = (pageIndex - 3 < 0) ? 0 : pageIndex - 3;
    if(start + 5 < pages) {
      end = start + 6;
    } else {
      start = pages - 5;
      end = pages + 1;
      posCurrent = 5 - (pages - pageIndex);
    }
    $('#paging li').remove()
    if(start == 0)
      paging.append("<li class='page-item'><a class='page-link'>" + "<<" + "</a></li>");
    else
      paging.append("<li class='page-item'><a onclick='selectPage(" + start + ");' class='page-link'>" + "<<" + "</a></li>");

    for ( var i=start+1; i < end; i++){
      var paging = $('#paging')
      paging.append("<li class='page-item'><a onclick='selectPage(" + i + ");' class='page-link'>" + i + "</a></li>");
    }

    if(end>pages)
      paging.append("<li class='page-item'><a class='page-link'>" + ">>" + "</a></li>");
    else
      paging.append("<li class='page-item'><a onclick='selectPage(" + end + ");' class='page-link'>" + ">>" + "</a></li>");

    var button = $('#paging li')
    for(var i=0; i<6; i++)
      button[i].className="";
    button[posCurrent].className="active";
    if(start==0)
      button[0].className="disabled";
    if(end>pages)
      button[6].className="disabled";
  }

  for (var idx =0; idx < current; idx++){
          rows[idx].style.display ='none';
  }

  for (var idx = current; idx < next; idx++){
          rows[idx].style.display = 'table-row';
  }


  for (var idx = next; idx < rowCount; idx++){
          rows[idx].style.display ='none';
  }
}



/*
<li class=" page-item">
  <a class="page-link" href="#" aria-label="Previous">
    <span aria-hidden="true">&laquo;</span>
    <span class="sr-only">Previous</span>
  </a>
</li>
<li class="page-item"><a class="page-link" href="#">1</a></li>
<li class="page-item"><a class="page-link" href="#">2</a></li>
<li class="page-item"><a class="page-link" href="#">3</a></li>
<li class="page-item"><a class="page-link" href="#">4</a></li>
<li class="page-item"><a class="page-link" href="#">5</a></li>
<li class="page-item">
  <a class="page-link" href="#" aria-label="Next">
    <span aria-hidden="true">&raquo;</span>
    <span class="sr-only">Next</span>
  </a>
</li>*/






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
//      Refresh
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:


$('#refresh').click(function(){

window.location.replace("https://cas.utc.fr/cas/login?service=http://vps528307.ovh.net:3001/login");


/*
$('#depense_resume tr').remove()
$('#balance_rendslargent tr').remove()
$('#liste_dette a').remove()
$('#choix_rendslargent a').remove()
$.getScript("./reload.js");*/


})

setTimeout(function(){
$(document).on('click','p',function(){
  console.log("Ossapik")
  $('#ossap').text("Ossapik règne en maître sur Compiègne")
});
}, 1500)
