import { useState, useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Heatmap from "ol/layer/Heatmap";
import Point from "ol/geom/Point";
import * as ol from "ol";
import { fromLonLat } from "ol/proj";

const CBLayer = ({ tempData }) => {
  let map = null;
  const mapRef = useRef(null);
  const [cbLegend, setCbLegend] = useState({ min: 0, mean: 0, max: 0 });
  useEffect(() => {
    const divNode = mapRef.current;
    const childNode = divNode.firstChild;
    if (childNode !== null) {
      divNode.removeChild(childNode);
    }
    map = new Map({
      attributions:
        'Weather data by <a href="http://www.rasdaman.org/">Rasdaman</a>',
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([20, 50]),
        zoom: 4.2,
      }),
    });

    let heatmapLayer;
    if (mapRef.current && tempData && tempData.length > 0) {
      // find the min, max and mean temperature values
      const tempValues = tempData?.map((point) => point.cb_top);
      const tempMax = Math.max(...tempValues);
      const tempMin = Math.min(...tempValues);
      const tempMean =
        tempValues.reduce((acc, val) => acc + val) / tempValues.length;
      setCbLegend({ min: tempMin, mean: tempMean, max: tempMax });
      const heatmapSource = new VectorSource({
        features:
          tempData &&
          tempData
            .map((point) => {
              if (point && point.Long && point.Lat && point.cb_top) {
                // normalize weight value
                const weight = (point.cb_top - tempMin) / (tempMax - tempMin);
                return new ol.Feature({
                  geometry: new Point(fromLonLat([point.Long, point.Lat])),
                  weight: weight,
                });
              }
            })
            .filter(Boolean),
      });

      // create the heatmap layer with the dynamic gradient
      const blur = 5;
      const radius = 5;
      // create the heatmap layer with the dynamic gradient

      const colorGradient = [
        "rgba(255, 255, 255, 1.0)",
        "rgba(128, 128, 128, 1.0)",
        "rgba(0, 0, 0, 1.0)",
      ];

      if (!heatmapLayer) {
        heatmapLayer = new Heatmap({
          source: heatmapSource,
          blur: blur,
          radius: radius,
          opacity: 0.5,
          gradient: colorGradient,
        });
        map.addLayer(heatmapLayer);
      } else {
        heatmapLayer.setSource(heatmapSource);
      }
    }
  }, [tempData]);

  return (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        class="shadow shadow-dark mb-1 bg-body"
        style={{
          height: "72vh",
          width: "90%",
          backgroundColor: "#ffffff",
        }}
        ref={mapRef}
      ></div>

      <div
        style={{
          position: "absolute",
          bottom: "22px",
          width: "50%",
          background: "white",
          padding: "20px 4px 20px 4px",
          color: "black",
          borderRadius: "4px",
        }}
      >
        <div class="gradient-box bg-secondary rounded p-1">
          <div
            style={{
              width: "95%",
              height: "5vh",
              position: "absolute",
              display: "flex",
              justifyContent: "space-between",
              top: "3.5vh",
              marginRight: "20px",
              fontWeight: "bolder",
            }}
          >
            <div>{Math.round(cbLegend.min * 3.28084)} ft</div>
            <div>{Math.round(cbLegend.mean * 3.28084)} ft</div>
            <div>{Math.round(cbLegend.max * 3.28084)} ft</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CBLayer;
