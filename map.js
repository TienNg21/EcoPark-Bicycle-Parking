const mapboxapi = 'pk.eyJ1IjoicXVvY2h1c3QiLCJhIjoiY2t2Z3J6NWliYzRncTJwcTZkdm5hZTE4MiJ9.sZOhK-6OEJ55JR8oLDHBLA'

var mymap = L.map('map').setView([20.96200410887519, 105.93191368976271], 14);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mapboxapi
}).addTo(mymap);

var marker = L.marker([20.964863158156387, 105.93196210349998]).addTo(mymap);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
marker.on('click', (e)=>{
    window.location.href += "/5";
})

var polygon = L.polygon([
    [20.965051111889107, 105.9309375437072],
    [20.96560366994513, 105.93288678005399],
    [20.965083615360683, 105.9333392813488],
    [20.96365345592754, 105.93149446837771]
],
// {
//     // cursor: 'grab',
//     // fillColor: 'fff',
//     // color: 'red',
// }
).addTo(mymap);

L.control.locate().position('topleft').addTo(map);
// polygon.style.cursor = 'alias'