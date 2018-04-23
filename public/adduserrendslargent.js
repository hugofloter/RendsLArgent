/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
//       Ajouter d'un user au rendsalrgent
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:

$.getJSON('http://vps528307.ovh.net:3001/USERS/getAllUsers', function (data) {
  data.forEach((users)=>{
    if(users.user_id!==id_userco){
      $('#choix_user').append("<option class='choix_user_rendsl' id='"+users.user_id+"' value='"+users.user_login+"'>"+users.user_prenom+" "+users.user_nom+"</option>")
    }
  })
});

//Ajout d'un user
$("#add_part").click(function() {
  var $test = $('.but').last()
    $test.after("<input type='text' class='form-control but' list='choix_user' style='margin-top: 5px' name='users' id='choix_login' placeholder='users'></input>")
});


$("#add_userToRendslargent").click(function(){
  var users_add = []
  $('.but').each(function(){
    var log_user = $('option[value="'+$(this).val()+'"]');
    var users_toAdd = log_user.attr('id')
    users_add.push(parseInt(users_toAdd))
  })
  if(users_add){
    $.post('http://vps528307.ovh.net:3001/RENDSLARGENT/addMultipleUsersRendsLArgent',
    {usersIds: users_add, rendslargentId: id_rendsl}, function(data){
            console.log('success');
        //  reload_rendsl()
          $('#addtric').remove()
          $('#cacher').show()
    });
  }
});






//Sortir de l'ajoute
$("#sortir_rendslargent").click(function() {
  $("#addtric").remove();
  var $cacher = $('#cacher')
  $cacher.show()
});
