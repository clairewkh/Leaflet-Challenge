// Load in geojson data
var allQuakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//Grabbing data from d3
// Perform a GET request to the query URL
d3.json(allQuakes, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function(feature, latlng){
        if(feature.properties.mag < 1){
            color =  "#CCFF66" //bright yellow
        }
        else if(feature.properties.mag < 2){
            color = "#00FF00" //neon green
        }
        else if(feature.properties.mag < 3){
            color = "#FF9933" //Orange
        }
        else if(feature.properties.mag < 4){
            color = "#FF00CC" //pink
        }
        else if(feature.properties.mag < 5){
            color = "#9900CC"  //purple
        }
        else{
            color = "#990000" //Red
        }
        var geoJsonMarker = {
            radius: feature.properties.mag * 8,
            fillColor: color,
            color: color,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        };
        return L.circleMarker(latlng, geoJsonMarker); 
      }
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(map){
        var div = L.DomUtil.create('div', 'info legend');
        grades = [0, 1, 2, 3, 4, 5];

    //Legend Label Earthquake <break> Magnitude  
    div.innerHTML = 'Eathquake<br>Magnitude<br><hr>'

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        //HTML code with nbs(non-breaking space) and ndash
        '<i style="background:' + legend_col(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

        return div;
    };
    
    legend.addTo(myMap);

    }
  
  function legend_col(magnitude){
    switch (true) {
        case magnitude < 1:
          return "#CCFF66";
        case magnitude < 2:
          return "#00FF00";
        case magnitude < 3:
          return "#FF9933";
        case magnitude < 4:
          return "#FF00CC";
        case magnitude < 5:
          return "#9900CC";
        default:
          return "#990000";
      }
  }




