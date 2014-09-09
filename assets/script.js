
function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
		
		google.maps.event.addListener(map, 'click', function(event) {
    		var marker = new google.maps.Marker({
    			position: event.latLng,
    			map: map,
    			title:"Hello World!"
			});
  		});
}
 google.maps.event.addDomListener(window, 'load', initialize);