// Title: Probability of hard-commodity (mining) driven forest loss, Ghana
// Dataset: WRI/Google Global Drivers of Forest Loss, 1 km, 2001-2024
// Note: probability bands are rescaled to 0-1 (x 0.004)
// Region of interest: Ghana
var ghana = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'Ghana'));
var geometry = ghana.geometry();
Map.setCenter(-1,7.7,6)

var drivers = ee.Image('projects/landandcarbon/assets/wri_gdm_drivers_forest_loss_1km/v1_2_2001_2024')
.clip(geometry);

// Apply band scale to image
function applyScaleFactors(image){
  var hard_scale = image
    .select('probability_2')
    .multiply(0.004)
  return image.addBands(hard_scale, null, true);
}

//Apply function and select probability band for hard commodities (mining)
drivers = applyScaleFactors(drivers);

var Hc_prob = drivers.select(['probability_2']).selfMask();

//visualize layer
var probVis = { 
  min: 0,
  max: 1,
  palette: ['red']
};

Map.addLayer(Hc_prob, probVis, 'Probability of hard commodities');

// Export Hard commodities for region of interest
//Export.image.toDrive({
//  image: Hc_prob,
//  description: 'Drivers_Of_Forest_Loss_Mining',
//  fileNamePrefix: 'Drivers_Of_Forest_Loss_Hard_Commodities_Mining',
//  region: geometry,
//  scale: 1000,
//  crs: 'EPSG:2136',
//  maxPixels: 1e13
//});
