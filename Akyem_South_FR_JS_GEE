// Geometry
var geometry = ee.Geometry.Polygon(
        [[[-1.2457708351916397, 6.589909233325027],
          [-1.2457708351916397, 6.471549313463152],
          [-0.9996084206408584, 6.471549313463152],
          [-0.9996084206408584, 6.589909233325027]]], null, false);

// Select image collection
var dataset = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2')
  .filterBounds(geometry)
  .filterDate('2012-01-30', '2024-01-30');

// Apply scaling factors
function applyScaleFactors(image){
  var opticalBands = image
    .select('SR_B[1-7]')
    .multiply(0.0000275)
    .add(-0.2);
  return image.addBands(opticalBands, null, true);
}

// Cloud masking
function maskL7Clouds(image){
  var qa = image.select('QA_PIXEL');
  var cloud = qa.bitwiseAnd(1 << 3).eq(0);
  var cloudShadow = qa.bitwiseAnd(1 << 4).eq(0);
  var snow = qa.bitwiseAnd(1 << 5).eq(0);
  var radSat = image.select('QA_RADSAT').eq(0);
  return image
    .updateMask(cloud)
    .updateMask(cloudShadow)
    .updateMask(snow)
    .updateMask(radSat);
}

// Add NDVI band
function addNDVI(image){
  var ndvi = image
    .normalizedDifference(['SR_B4', 'SR_B3'])
    .rename('NDVI');
  return image.addBands(ndvi);
}

// Apply processing to dataset
dataset = dataset
  .map(applyScaleFactors)
  .map(maskL7Clouds)
  .map(addNDVI);

// Create median composite and clip
dataset = dataset.median().clip(geometry);

// Visualize NDVI
var ndviVis = {
  min: 0,
  max: 0.8,
  palette: ['yellow', 'green', 'darkgreen']
};

Map.addLayer(dataset.select('NDVI'), ndviVis, 'NDVI 2000–2012');
Map.setCenter(-1.0, 7.7, 6);

// Export NDVI
//Export.image.toDrive({
//  image: dataset.select('NDVI'),
//  description: 'NDVI_2012_2024',
//  fileNamePrefix: 'NDVI_2012_2024_LS7_SR_L2',
//  region: geometry,
//  scale: 30,
//  maxPixels: 1e13
//});
