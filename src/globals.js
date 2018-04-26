var Cesium;
var viewer = new Cesium.Viewer('cesiumContainer', {
    // imageryProvider: new Cesium.BingMapsImageryProvider({
    //     url: 'http://dev.virtualearth.net',
    //     mapStyle: Cesium.BingMapsStyle.AERIAL //AERIAL_WITH_LABELS
    // }),
    imageryProvider: Cesium.createTileMapServiceImageryProvider({
        url: 'https://cesiumjs.org/blackmarble',
        credit: 'Black Marble imagery courtesy NASA Earth Observatory',
        flipXY: true // Only old gdal2tile.py generated tilesets need this flag.
    }),
    // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
    //     url: 'http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer'
    // }),
    // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
    //     url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
    //     layer: "tdtBasicLayer",
    //     style: "default",
    //     format: "image/jpeg",
    //     tileMatrixSetID: "GoogleMapsCompatible",
    //     show: false
    // }),

    baseLayerPicker: false,
    homeButton: false,
    navigationHelpButton: false,
    // geocoder: true,
    geocoder: new OpenStreetMapNominatimGeocoder(),
    sceneModePicker: false,
    //  timeline: false,
    animation: false,
    vrButton: true
});
// var imageryLayers = viewer.imageryLayers;
// imageryLayers.get(0).brightness = 0;

function OpenStreetMapNominatimGeocoder() {}
OpenStreetMapNominatimGeocoder.prototype.geocode = function(input) {
    var endpoint = 'http://nominatim.openstreetmap.org/search?';
    var query = 'format=json&q=' + input;
    var requestString = endpoint + query;
    return Cesium.loadJson(requestString)
        .then(function(results) {
            var bboxDegrees;
            return results.map(function(resultObject) {
                bboxDegrees = resultObject.boundingbox;
                return {
                    displayName: resultObject.display_name,
                    destination: Cesium.Rectangle.fromDegrees(
                        bboxDegrees[2],
                        bboxDegrees[0],
                        bboxDegrees[3],
                        bboxDegrees[1]
                    )
                };
            });
        });
};
//viewer.scene.globe.enableLighting = true;

// viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
//     url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
//     requestVertexNormals: true
// });

function changeBaseMap(map) {
    var url = '';
    viewer.imageryLayers.removeAll();
    switch (map) {
        case 'tdt':


            viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                layer: "tdtBasicLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                show: false,
                maximumLevel: 16
            }));

            console.log(map);
            break;

        case 'arcgis':
            viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                enablePickFeatures: false
            }));

            console.log(map);
            break;
        case 'bing':

            viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
                url: 'https://dev.virtualearth.net',
                key: 'get-yours-at-https://www.bingmapsportal.com/',
                mapStyle: Cesium.BingMapsStyle.AERIAL
            }));
            console.log(map);
            break;
        case 'dark':
            viewer.imageryLayers.addImageryProvider(new Cesium.createTileMapServiceImageryProvider({
                url: 'https://cesiumjs.org/blackmarble',
                credit: 'Black Marble imagery courtesy NASA Earth Observatory',
                flipXY: true // Only old gdal2tile.py generated tilesets need this flag.
            }));
            break;

    }

}
// viewer.scene.globe.depthTestAgainstTerrain = true;

//viewer.extend(Cesium.viewerCesiumInspectorMixin);
var tileset;
var scene = viewer.scene;
var ellipsoid = scene.globe.ellipsoid;
var entity;
var newPolygon;
var newOutline;
var canvas = document.getElementById("canvas");
var setBaseHeight = 5;
var watchableSettings = {
    maxLength: 50,
    height: 3,
    perAngle: 3,
    perLength: 2
};