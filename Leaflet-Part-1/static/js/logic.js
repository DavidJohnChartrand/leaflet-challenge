var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(url).then(function(data){
    console.log(data.features)
    createFeatures(data.features);
});



function createFeatures(earthquakeData) {
    

    function getColor(d) {
        
        return  d > 90 ? "#EA2C2C" :
                d > 70 ? "#EA822C" :
                d > 50 ? "#EE9C00" :
                d > 30 ? "#EECC00" :
                d > 10 ? "#D4EE00" :
                         "#98EE00" ;
      }


    function markerSize(data) {
        return Math.sqrt(data)*10;
    }
    
    function style(geoJsonFeature){
        return {color:'black',
        fillOpacity:0.5,
        fillColor: getColor(geoJsonFeature.geometry.coordinates[2]),
        weight: 0.5

    };
    }


    function pointToLayer(geoJsonPoint, latlng) {
        return L.circleMarker(latlng, {
            radius:markerSize(geoJsonPoint.properties.mag)
        });
    }
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        // console.log(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
        // L.circle(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer,
      style: style
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }


function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
    Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

    

//       // Set up the legend.
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = geojson.options.limits;
//     var colors = geojson.options.colors;
//     var labels = [];

//     // Add the minimum and maximum.
//     var legendInfo = "<h1>Population with Children<br />(ages 6-17)</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

  // Adding the legend to the map
//   legend.addTo(myMap);

function getColor(d) {
        
    return  d > 90 ? "#EA2C2C" :
            d > 70 ? "#EA822C" :
            d > 50 ? "#EE9C00" :
            d > 30 ? "#EECC00" :
            d > 10 ? "#D4EE00" :
                     "#98EE00" ;
  }
//Create the legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'info legend');
        grades = [90, 70, 50, 30, 10];
        // colors = ["red", "red", "red", "red","red","red"];
        colors = ["#EA2C2C", "#EA822C", "#EE9C00", "#EECC00","#D4EE00","#98EE00"];
        labels =[];

        // loop through intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
            "<i style='background: " 
            + colors[i] 
            + "'></i> " 
            + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
            
        }    
        console.log(div);
        return div;

    }
    legend.addTo(myMap);

}