/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:
//       Ajouter d'un article
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////:

//Ajouter une dépense
$("#add_arti").click(function() {

  var newname = $('#name_article').val()
  var newprice = $('#price_article').val()*100


  if(newprice>0){
    $.post('http://vps528307.ovh.net:3001/ARTICLES/createArticleExte',
      {nom: newname,prix: newprice,attr2: id_rendsl,idrendslargent: id_rendsl}, (data)=> {
        console.log(data)
      });
  }
  $('#addtric').remove()
  $('#cacher').show()
})



//Sortir de l'ajout article
$("#sortir_addarticle").click(function() {
  $("#addtric").remove();
  var $cacher = $('#cacher')
  $cacher.show()
});
