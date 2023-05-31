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

const HeatMapLayer = ({ tempData }) => {
  let map = null;
  const mapRef = useRef(null);
  const [heatlegend, setHeatlegend] = useState({ min: 0, mean: 0, max: 0 });
  useEffect(() => {
    const divNode = mapRef.current;
    const childNode = divNode.firstChild;
    if (childNode !== null) {
      console.log(childNode, "llllll");
      divNode.removeChild(childNode);
    }
    map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([20, 62]),
        zoom: 4,
      }),
    });

    let heatmapLayer;
    if (mapRef.current && tempData && tempData.length > 0) {
      // find the min, max and mean temperature values
      const tempValues = tempData?.map((point) => point.t);
      function getMax(arr) {
        let len = arr.length;
        let max = -Infinity;

        while (len--) {
          max = arr[len] > max ? arr[len] : max;
        }
        return max;
      }
      function getMin(arr) {
        let len = arr.length;
        let min = Infinity;

        while (len--) {
          min = arr[len] < min ? arr[len] : min;
        }
        return min;
      }
      const tempMax = getMax(tempValues);
      const tempMin = getMin(tempValues);
      const tempMean =
        tempValues.reduce((acc, val) => acc + val) / tempValues.length;
      setHeatlegend({ min: tempMin, mean: tempMean, max: tempMax });
      const heatmapSource = new VectorSource({
        features:
          tempData &&
          tempData
          .filter((_, index) => index % 2 === 0) // only keep every 10th value
            .map((point) => {
              if (point && point.Long && point.Lat && point.t) {
                // normalize weight value
                const weight = (point.t - tempMin) / (tempMax - tempMin);
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
        "rgba(0, 0, 255, 1.0)",
        "rgba(0, 255, 0, 1.0)",
        "rgba(255, 0, 0, 1.0)",
      ];

      if (!heatmapLayer) {
        heatmapLayer = new Heatmap({
          attributions:
            'Weather data by <a href="http://www.rasdaman.org/">Rasdaman</a>',
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
    <>
      <div
        // class="border border-3 border-light rounded"
        class="shadow shadow-dark mb-1 bg-body"
        style={{
          height: "72vh",
          width: "90%",
          backgroundColor: "#ffffff",
        }}
        ref={mapRef}
      ></div>
      <div
        class="heat-gradient-box rounded p-1 bg-light"
        style={{
          position: "absolute",
          bottom: "7vh",
          width: "40vw",
          height: "2vh",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "5vh",
            display: "flex",
            justifyContent: "space-between",
            position: "absolute",
            top: "2vh",
          }}
        >
          <div>{Math.round(heatlegend.min)}&deg; C</div>
          <div>{Math.round(heatlegend.mean)}&deg; C</div>
          <div>{Math.round(heatlegend.max)}&deg; C</div>
        </div>
      </div>
    </>
  );
};

export default HeatMapLayer;
