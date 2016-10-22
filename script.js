$.get(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(data,status){
    $(document).ready(function(){
    var featureArray = data.features;
    for (var i=0; i<featureArray.length;i++){
      featureArray[i].properties.time=new Date(featureArray[i].properties.time).toUTCString();
      featureArray[i].properties.tsunami=featureArray[i].properties.tsunami===1?"Yes":"No";
      featureArray[i].properties.alert=featureArray[i].properties.alert===null?"None":
        featureArray[i].properties.alert[0].toUpperCase()+featureArray[i].properties.alert.substr(1);

        var coordinates = featureArray[i].geometry.coordinates;
        var marker = new google.maps.Marker({
          position: {lat:coordinates[1], lng:coordinates[0]},
          map:window.map
        })

      var source   = $("#earthquake-data-template").html();
      var template = Handlebars.compile(source);
      var context = featureArray[i];
      var html    = template(context);
      $("#earthquake-data-table").append(html);
    }
    $(".earthquake-table-row").click(function(){
      var coordText = $(this).find("#coordinates").text().trim();
      window.map.panTo(parseCoords(coordText));
      window.map.setZoom(6);
    })
  })
})

  function parseCoords(coordString){
    var longitude = coordString.substring(0,coordString.indexOf(','));
    var latitude = coordString.substring(coordString.indexOf(',')+1,coordString.lastIndexOf(','));
    return new google.maps.LatLng(latitude,longitude);
  }
