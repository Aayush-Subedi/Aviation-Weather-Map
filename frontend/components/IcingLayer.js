import { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import * as ol from "ol";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, RegularShape, Fill, Style } from "ol/style";

export default function IcingLayer({ tempData }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  let map = null;

  function getIcingColor(icingCode = 1) {
    const icingColors = {
      1: "rgb(0, 255, 0)", // green
      2: "rgb(255, 255, 0)", // orange
      3: "rgb(255, 0, 0)", // red
    };

    return icingColors[icingCode] || "rgb(0, 0, 0)"; // default to black if icing code is invalid
  }

  useEffect(() => {
    const divNode = mapRef.current;
    const childNode = divNode.firstChild;
    if (childNode !== null) {
      console.log(childNode, "llllll");
      divNode.removeChild(childNode);
    }
    if (mapRef.current && tempData && tempData.length > 0) {
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

      // find the min, max and mean temperature values
      const tempValues = tempData.map((point) => point.t);
      // const tempMax = Math.max(...tempValues);
      // const tempMin = Math.min(...tempValues);
      // create a vector source and layer for the temperature points
      const temperatureSource = new VectorSource({
        attributions:
          'Weather data by <a href="http://www.rasdaman.org/">Rasdaman</a>',
        features:
          tempData &&
          tempData
            .filter((_, index) => index % 180 === 0) // only keep every 10th value
            .map((point) => {
              if (point && point.Long && point.Lat && point.icing_degree_code) {
                return new ol.Feature({
                  geometry: new Point(fromLonLat([point.Long, point.Lat])),
                  temperature: point.icing_degree_code,
                });
              }
            })

            .filter(Boolean),
      });

      

      // create the temperature layer with the dynamic color scale
      const temperatureLayer = new VectorLayer({
        source: temperatureSource,
        // opacity: 0.5,
        style: (feature) => {
          const temperature = feature.get("temperature");
          // const color = colorScale(temperature);
          const color = getIcingColor(temperature);

          return new Style({
            image: new RegularShape({
              fill: new Fill({
                color: color,
              }),
              points: 6, // use 4 points to create a rectangle
              radius: 7, // half the height and width of the rectangle
              angle: Math.PI / 6, // rotate the rectangle 45 degrees
            }),
          });
        },
      });

      map.addLayer(temperatureLayer);
      mapInstanceRef.current = map;
    } else {
      const map = new Map({
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

      mapInstanceRef.current = map;
    }
  }, [tempData]);

  return (
    <div className="container">
      <div
        class="shadow shadow-dark mb-1 bg-body"
        style={{
          height: "72vh",
          width: "90%",
          backgroundColor: "#ffffff",
        }}
        ref={mapRef}
      ></div>
      <div className="legend">
        <ul className="legend-list">
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(255,0,0)" }}
            ></span>
            Severe
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(255,255,0)" }}
            ></span>
            Moderate
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(0,255,0)" }}
            ></span>
            Light
          </li>
        </ul>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .legend {
          margin-top: 10px;
          background: white;
          color: black;
          font-weight: bolder;
          padding-left: 8px;
          border-radius: 4px;
          margin-bottom: 0px;
          padding-top: 5px;
        }
        .legend h3 {
          margin-bottom: 5px;
        }
        .legend-list {
          display: flex;
          padding: 0;
          list-style-type: none;
        }
        .legend li {
          margin-right: 20px;
          display: flex;
          align-items: center;
        }
        .legend-color {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin-right: 5px;
        }
      `}</style>
    </div>
  );
}
