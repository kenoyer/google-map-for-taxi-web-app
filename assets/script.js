var flag_pickUp = false;
var flag_drop = false;
var pickUpMarker;
var dropMarker;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;


function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer({
		suppressMarkers: true
	});
        var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
		directionsDisplay.setMap(map);
		google.maps.event.addListener(map, 'click', function(event) {
			if(!flag_pickUp){
    			pickUpMarker = new google.maps.Marker({
    				position: event.latLng,
    				map: map,
    				draggable:true,
    				animation: google.maps.Animation.DROP
				});

  				google.maps.event.addListener(pickUpMarker, 'drag', function(event){
  					if(flag_drop){
  						getDirection();
  					}
  				});
				flag_pickUp =true;
			}			
			else if(!flag_drop){
    			dropMarker = new google.maps.Marker({
    				position: event.latLng,
    				map: map,
    				draggable:true,
    				animation: google.maps.Animation.DROP,
				});
				flag_drop =true;

  				google.maps.event.addListener(pickUpMarker, 'drag', function(event){
  					getDirection();
  				});
				getDirection();
			}
  		});

}

function getDirection(){
  	var request = {
  	  origin:pickUpMarker.getPosition(),
  	  destination:dropMarker.getPosition(),
  	  travelMode: google.maps.TravelMode.DRIVING
  	};
  	directionsService.route(request, function(result, status) {
  	  if (status == google.maps.DirectionsStatus.OK) {
  	    directionsDisplay.setDirections(result);
  	    calculateTotalDistance(result);
  	  }
  	});
}

function calculateTotalDistance(result) {
	var total = 0;
  	var myroute = result.routes[0];
  	for (var i = 0; i < myroute.legs.length; i++) {
    	total += myroute.legs[i].distance.value;
  	}
  	total = total / 1000.0;
  	document.getElementById('distance').innerHTML = total + ' km';
}
 google.maps.event.addDomListener(window, 'load', initialize);