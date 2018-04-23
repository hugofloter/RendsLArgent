
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
//       Ajouter d'une dépense
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:

//Chargement des données
$.getJSON('http://vps528307.ovh.net:3001/ARTICLES/getArticles', function (data) {
  data.forEach((articles)=>{
    if(!articles.id_rendsl || articles.id_rendsl==id_rendsl){
      $('#choix_item').append($('<option id="'+articles['article_id']+'"value="'+articles['article_nom']+'"></option>'))
    }
  })
});
$.post('http://vps528307.ovh.net:3001/RENDSLARGENT/getUsersRendsLArgent',
  {idrendslargent: id_rendsl}, (data)=> {
    console.log(data)
    data.result.forEach((user)=>{
      $.post('http://vps528307.ovh.net:3001/USERS/getUserById', {id: user.fk_user}, (mydata)=>{
         $('#choix_user').append("<option class='choix_user_rendsl' id='"+mydata[0].user_id+"' value='"+mydata[0].user_login+"'>"+mydata[0].user_nom+" "+mydata[0].user_prenom+"</option>")
     })
   })
    /*$('.choix_user_depense').each(function() {
      if ($(this).val() == id_userco) {
          $(this).remove();
      }
    });*/
  });

//ajouter un participant
  $("#add_part").click(function() {
    var $test = $('.but').last()
      $test.after("<input type='text' class='form-control but' list='choix_user' style='margin-top: 5px' name='users' id='choix_login' placeholder='users'></input>")
  } );


  //Ajouter une dépense
  $("#add_depe").click(function() {
    //Selection de.s l'user endetté
    var users_add = []
    $('.but').each(function(){
      var log_user = $('option[value="'+$(this).val()+'"]');
      var users_toAdd = log_user.attr('id')
      users_add.push(parseInt(users_toAdd))
    })
    //Selection de l'id article choisi
    var nom_arti = $('option[value="'+$('#article_choisi').val()+'"]');
    var article = nom_arti.attr('id')
    $.post('http://vps528307.ovh.net:3001/ARTICLES/getOneArticle',
      {id: article}, (data)=> {
        var precio = data[0].article_prix
        $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/createTransactionMultipleUsers',
          {idUser: id_userco, idsOtherUser: users_add, idrendslargent: id_rendsl, idarticle: article, prix: precio}, (datab)=> {
            console.log("successssss")
          });
      });
      $('#addtric').remove()
      $('#cacher').show()
  });

  //Sortir de l'ajout dépense
  $("#sortir_adddepense").click(function() {
    $("#addtric").remove();
    var $cacher = $('#cacher')
    $cacher.show()
  });
