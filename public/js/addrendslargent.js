/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
//       Ajouter un rendslargent
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:

$.getJSON('http://vps528307.ovh.net:3001/USERS/getAllUsers', function (data) {
  data.forEach((users)=>{
    if(users.user_id!==id_userco){
      $('#choix_user').append("<option class='choix_user_rendsl' id='"+users.user_id+"' value='"+users.user_login+"'>"+users.user_prenom+" "+users.user_nom+"</option>")
    }
  })
});


//Ajout d'un rendslargent
$("#add_part").click(function() {
  var $test = $('.but').last()
    $test.after("<input type='text' class='form-control but' list='choix_user' style='margin-top: 5px' name='users' id='choix_login' placeholder='users'></input>")
});

$("#envoyer").click(function(){
  var users_add = []
  $('.but').each(function(){
    var log_user = $('option[value="'+$(this).val()+'"]');
    var users_toAdd = log_user.attr('id')
    users_add.push(parseInt(users_toAdd))
  })


  $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/createRendsLArgent',
  {creatorId: id_userco, usersIds: users_add, name: $("#nom").val()}, function(data){
          console.log('success');
        $('#addtric').remove()
        $('#cacher').show()
  });

});

//Sortir de l'ajoute
$("#sortir_rendslargent").click(function() {
  $("#addtric").remove();
  var $cacher = $('#cacher')
  $cacher.show()
});
