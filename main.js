var crimeObject = [];
var houseObject = [];
var polygons = [];
var foundFeatureGeo = [];
var districtCenters = [];
var geoData;
var addedMarker = [];
var addedShape = [];
var closestDistricts =[];
var datasets,dataManager,idsDataBases,initialPos;
var map;
var nyucoor = {lat: 40.7291, lng: -73.9965};



$(document).ready(function(){


	$("#nhButton").click(function(){
		updateData(1);
	});

	$("#geoButton").click(function(){
		updateData(2);
	});
    $("#clearButton").click(function(){
        clearMarkers();
    });

    getDataURL();


})

function getDataURL() {

    dataManager = new DataManager();
    idsDataBases = dataManager.getKeysURLS();
    datasets = dataManager.getDataFromURLS();

}


function updateData(number){

		switch (number)
		{
			case 1:
            console.log(datasets['neighborhood']);
			getNeighbourhoodData(datasets['neighborhood']);
			break;
			case 2:
            console.log(datasets['districts']);
			getGeoData(datasets['districts']);
			break;
			case 3:
			break;
			case 4:
			break;
			default:
			break;
		}
}


function getNeighbourhoodData(data){

	nhObject = [];
    nhJSON = data;
    var num;
    console.log(data);


	for(var i=0;i<data.length;i++){
            var num = data[i][9].split(/[\s+()]/);
            nhObject.push([data[i][10],data[i][16],num[3],num[2]]);

		 }


    if(addedShape.length == 0)
    {
        districtShapes(datasets['districts']);
    }


    for(var j = 0; j< 175;j++){
        findCenter(addedShape[j].getPaths().getArray()[0].b,addedShape[j].Name)
        console.log(addedShape[j].Name);
    }


    findClosest(closestDistricts);

}

//-----------------------Utility Functions---------------------------------------------------------------------------


function findCenter(polygonCoords,tag){
    var bounds = new google.maps.LatLngBounds();


    for (var i = 0; i < polygonCoords.length; i++) {
      bounds.extend(polygonCoords[i]);
    }

    addMarker(bounds.getCenter(),tag)

}

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137;
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};



function getGeoData(data){

	geoObject = [];
	districtNumber = [];
	geoObjectJSON = {};

    for(var j=0; j < data.length;j++){
        loadGeoJson(data[j]);
    }

}


function findClosest(districtArray){

    var topDistricts = [];
    var rounds = 0;
    var position = 1;
    var completed = false;

    districtArray.sort(function(a, b){
      return a.dis -  b.dis;
    });

    while(!completed){

        console.log((topDistricts.indexOf(districtArray[rounds].mk.title)));
        console.log(districtArray[rounds].mk.title);

        if(!(topDistricts.indexOf(districtArray[rounds].mk.title) >= 0))
        {
            districtArray[rounds].mk.setVisible(true);
            topDistricts.push(districtArray[rounds].mk.title);
            districtArray[rounds].mk.setTitle("Rank #"+position);
            position++;
            rounds++;
        }
        else{
            rounds++;
        }

        if(topDistricts.length == 10){
            completed = true;
        }

    }

    console.log(districtArray);

}

function addCoordinates(){

        for(var key in NYC_DISTRICTS){
            NYC_DISTRICTS[key].push(geoObjectJSON[key]);
        }

}

function printDistrictNumbers(){

	$("#tableBody").empty();
	var tableReference=$("#tableBody")[0]
	var newRow,district;
	districtNumber.sort();
	for(var j=0;j<districtNumber.length;j++){
			newRow=tableReference.insertRow(tableReference.rows.length);
			district=newRow.insertCell();
			district.innerHTML=districtNumber[j];
	}

}



function initMap(){

    initialPos = {lat: 40.729100, lng: -73.996500};

	map = new google.maps.Map(document.getElementById('map'), {
    center : initialPos,
    zoom: 10
	});

  var marker = new google.maps.Marker({
    position: initialPos,
    map: map,
    title : "NYU Stern School of Bussiness"
  });

  cityCircle = new google.maps.Circle({
    strokeColor: '#57058b',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#57058b',
    fillOpacity: 0.35,
    map: map,
    center: initialPos,
    radius: 300*myRange1.value
  });


}


function loadGeoJson(obj){

    map.data.addGeoJson(obj);

	map.data.setStyle(function(feature) {


    var boro = feature.getProperty('BoroCD');
		var color;

		if(boro < 113 ){color = '#2571ea';}
		else if(200 <= boro && boro < 213){color = '#e85c17';}
		else if(300 <= boro && boro < 319){color = '#e81515';}
		else if(400 <= boro && boro < 415){color = '#b715e8';}
		else if(500 <= boro && boro < 504){color = '#14e8e4';}
		else{color = 'green';}


		map.data.addListener('mouseover', function(event) {


		var br = event.feature.getProperty('BoroCD');
		var text;

		if(NYC_DISTRICTS[br] != null  && br < 113 ){
			text = "Manhattan";
		}else if (NYC_DISTRICTS[br] != null && 200 <= br && br < 213){
			text = "Brooklyn";
		}
		else if(NYC_DISTRICTS[br] != null && 300 <= boro && boro < 319){
			text = "Bronx";
		}
		else if(NYC_DISTRICTS[br] != null && 400 <= boro && boro < 415){
			text = "Queens";
		}
		else if(NYC_DISTRICTS[br] != null && 500 <= boro && boro < 504){
			text ="Staten Island";
		}
		else{
			text = "Non-livable";
		}
    });


        return {
        fillColor: color,
        strokeWeight: 1,
        };

    });


}

function addMarker(obj,tag){

    var name = String(tag);

    var marker = new google.maps.Marker({
        position: obj,
        visible : false,
        title : name
    });

    marker.setMap(map);
    addedMarker.push(marker);

    var lt = marker.getPosition().lat();
    var ln = marker.getPosition().lng();
    myLatlng = {lat: lt, lng: ln};

    var distance = getDistance(initialPos,myLatlng);

    closestDistricts.push({mk : marker,dis: distance});

}




function districtShapes (data) {
  for (let i = 0; i < data.length; i++) {
    let coordinates = data[i]['geometry']['coordinates'];
    let name = data[i]['properties']['BoroCD'];
    let color = 'black;';

    for (let j = 0; j < coordinates.length; j++) {
      let fCoordinates;
      if (coordinates.length > 1) {
        fCoordinates = formatCoordinates(coordinates[j][0]);
      } else {
        fCoordinates = formatCoordinates(coordinates[j]);
      }
      let polygon = drawPolygon(fCoordinates, color,name);
      addedShape.push(polygon);
    }
  }
}


function drawPolygon(coordinate, color,name) {
  let district = new google.maps.Polygon({
    paths: coordinate,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35,
    Name : name
  });

  return district;
}


function formatCoordinates(coordinate) {
  let r = [];
  for (let i = 0; i < coordinate.length; i++) {
    r[i] = {
      lng: Number(coordinate[i][0]),
      lat: Number(coordinate[i][1])
    };
  }

  return r;
}



function clearElementsInMap(elements) {
  for (let v of elements) {
    v.setMap(null);
  }
}


function clearMarkers() {
  clearMarkers();
  clearShapes();

}

function clearMarkers() {
  clearElementsInMap(addedMarker);
  closestDistricts = [];
}

function clearShapes() {
  clearElementsInMap(addedShape);


}

function openCity(evt, cityName) {

  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
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

  var NYC_DISTRICTS = {

    "101" :[],
  	"102" :[],
  	"103" :[],
  	"104" :[],
  	"105" :[],
  	"106" :[],
  	"107" :[],
  	"108" :[],
  	"109" :[],
  	"110" :[],
  	"111" :[],
  	"112" :[],
    "201" : [],
  	"202" : [],
  	"203" : [],
  	"204" : [],
  	"205" : [],
  	"206" : [],
  	"207" : [],
  	"208" : [],
  	"209" : [],
  	"210" : [],
  	"211" : [],
  	"212" : [],
    "301" : [],
  	"302" : [],
  	"303" : [],
  	"304" : [],
  	"305" : [],
  	"306" : [],
  	"307" : [],
  	"308" : [],
  	"309" : [],
  	"310" : [],
  	"311" : [],
  	"312" : [],
  	"313" : [],
  	"314" : [],
  	"315" : [],
  	"316" : [],
  	"317" : [],
  	"318" : [],
    "401" : [],
  	"402" : [],
  	"403" : [],
  	"404" : [],
  	"405" : [],
  	"406" : [],
  	"407" : [],
  	"408" : [],
  	"409" : [],
  	"410" : [],
  	"411" : [],
  	"412" : [],
  	"413" : [],
  	"414" : [],
  	"501" : [],
  	"502" : [],
  	"503" : []

  };
