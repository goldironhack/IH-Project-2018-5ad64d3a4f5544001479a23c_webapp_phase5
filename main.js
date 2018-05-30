const API_KEY = "AIzaSyBePmbVuBJxe-uCYZYOGoeROdGOVpAHam0";
const NAMES_URL ="https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const GEOSHAPES_URL ="http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const CRIME_URL ="https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json";
const HOUSING_URL ="https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
var map;
var nyucoor = {lat: 40.7291, lng: -73.9965};
var markernyu;
var cityCircle;
var distriCenters = [];
var distridis = [];



function initMap() {
       map = new google.maps.Map(document.getElementById('map'), {
         zoom: 10,
         center: nyucoor
       });

       cityCircle = new google.maps.Circle({
           strokeColor: '#57058b',
           strokeOpacity: 0.8,
           strokeWeight: 2,
           fillColor: '#57058b',
           fillOpacity: 0.35,
           map: map,
           center: nyucoor,
           radius: 300*myRange1.value
         });

        map.data.loadGeoJson(GEOSHAPES_URL);
        map.data.setStyle(function(feature) {
          var color = '#cf8ff7';
          return /** @type {google.maps.Data.StyleOptions} */({
            fillColor: getColor(feature.getProperty("BoroCD")),
            strokeColor: 'black',
            strokeWeight: 0.5,
            visible : true
          });
        });
        map.data.addListener('mouseover', function(event) {
          map.data.revertStyle();
          map.data.overrideStyle(event.feature, {strokeWeight: 2});
        });

        map.data.addListener('mouseout', function(event) {
          map.data.revertStyle();
        });

       markernyu = new google.maps.Marker({
         position: nyucoor,
         map: map
       });
       
       
     }

function getColor(id){

  var valBoro=Math.floor(id/100);

  if(valBoro == 1)return"#2571ea";
  if(valBoro == 2)return"#e85c17";
  if(valBoro == 3)return"#24e816";
  if(valBoro == 4)return"#b715e8";
  if(valBoro == 5)return"#14e8e4";

}

function addMarker(obj){

  var marker = new google.maps.Marker({
       position: obj,
       visible : false,
   });

   marker.setMap(map);

}

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1) {
  R = 6371000;
  var dLat = R*rad(nyucoor.lat - p1.lat);
  var dLong = R*rad(nyucoor.lng - p1.lng);
  var d = Math.sqrt(dLat^2 + dLong^2);
  return d;
};



function drawPolygon(polygon,color){
      polygon = new google.maps.Polygon({
      paths: triangleCoords,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35
    });
    polygon.setMap(map);
  }

function distCircle() {
    cityCircle.setMap(null);
    cityCircle = new google.maps.Circle({
        strokeColor: '#57058b',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#57058b',
        fillOpacity: 0.35,
        map: map,
        center: nyucoor,
        radius: 300*myRange1.value
      });

      var diff = 300*myRange1.value;

      if(distridis.length == 0){
        districtdisca();}

        for(var i=0;i<distridis.length;i++){
          if(diff > distridis[i]){
            addMarker(distriCenter[i]);}
    		 }
  }

  function districtdisca(){

    if(distriCenters.length == 0){
          districtCenterca();}

    for(var i=0;i<distriCenters.length;i++){
            var num =getDistance(distriCenters[i]);
            distridist.push(num);
		 }

  }

  function districtCenterca() {
//calculo de los centros
//formato centros

  }


function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}


document.getElementById("defaultOpen").click();

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");




function Crimeclas1() {
    //mas seguros
  }

function Crimeclas1() {
  //regulares
  }

function Crimeclas1() {
    //malos
  }

function borrar() {

  }

function exportar() {

  }