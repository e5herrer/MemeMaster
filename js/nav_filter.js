var filter = 'keyword';
$('#filter-drop li a').click(function(){
  filter = $(this).html();
  $('#filter-drop li a').css("font-weight", "normal");
  $(this).css("font-weight", "bold");
  console.log(filter);
  $('#invis_filter').attr("value", filter);
});