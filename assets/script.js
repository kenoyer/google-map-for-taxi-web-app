var pickUpMarker;
var dropMarker;
var geocoder;
var directionsDisplay;
var map;
var flag_pickUp = false;
var flag_drop = false;
var directionsService = new google.maps.DirectionsService();
var pickUpInfowindow = new google.maps.InfoWindow();
var dropInfowindow = new google.maps.InfoWindow();


function initialize() {
  	geocoder = new google.maps.Geocoder();
	directionsDisplay = new google.maps.DirectionsRenderer({
		suppressMarkers: true
	});
        var mapOptions = {
          center: new google.maps.LatLng(11.108390425124341, 77.34211921691895),
          zoom: 8
        };
        map = new google.maps.Map(document.getElementById("map-canvas"),
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
    			latLngToAddress(event.latLng, pickUpMarker);
  				google.maps.event.addListener(pickUpMarker, 'drag', function(event){
  					if(flag_drop){
  						getDirection();
  					}
  				});
  				google.maps.event.addListener(pickUpMarker, 'dragend', function(event){
  					if(flag_drop){
    					latLngToAddress(event.latLng, pickUpMarker);
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
    			latLngToAddress(event.latLng, dropMarker);
				flag_drop =true;

  				google.maps.event.addListener(dropMarker, 'drag', function(event){
  					getDirection();
  				});
  				google.maps.event.addListener(dropMarker, 'dragend', function(event){
  					if(flag_drop){
    					latLngToAddress(event.latLng, pickUpMarker);
  					}
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
  	calculateEstimatedFare(total);
}

function latLngToAddress(latLng, marker) {
  	geocoder.geocode({'latLng': latLng}, function(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
      		if (results[1]) {
        		if(marker == pickUpMarker){
        			pickUpInfowindow.setContent(results[1].formatted_address);
        			pickUpInfowindow.open(map, marker);
        			document.getElementById('pickup').innerHTML = results[1].formatted_address;
        		}
        		else if(marker == dropMarker){
        			dropInfowindow.setContent(results[1].formatted_address);
        			dropInfowindow.open(map, marker);
        			document.getElementById('drop').innerHTML = results[1].formatted_address;
        		}
      		} else {
        		alert('No results found');
      		}
    	} else {
      		alert('Geocoder failed due to: ' + status);
    	}
  	});
}

function calculateEstimatedFare(distance){
	var farePerKm = 5;
	var estimatedFare = distance * farePerKm;
    document.getElementById('fare').innerHTML = estimatedFare;
}

google.maps.event.addDomListener(window, 'load', initialize);