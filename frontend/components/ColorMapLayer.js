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
import * as d3 from "d3";
import { Circle as CircleStyle, RegularShape, Fill, Style } from "ol/style";
import { rgb } from "chroma-js";
import Image from "next/image";

export default function ColorMapLayer({ tempData }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  let map = null;

  const getColor = (temperature) => {
    if (temperature <= -43.5) {
      return rgb(132, 91, 149);
    } else if (temperature <= -41) {
      return rgb(117, 103, 115);
    } else if (temperature <= -36) {
      return rgb(119, 136, 178);
    } else if (temperature <= -31) {
      return rgb(124, 170, 201);
    } else if (temperature <= -26) {
      return rgb(141, 194, 221);
    } else if (temperature <= -21) {
      return rgb(221, 221, 221);
    } else if (temperature <= -16) {
      return rgb(246, 207, 98);
    } else if (temperature <= -11) {
      return rgb(236, 162, 101);
    } else if (temperature <= -6) {
      return rgb(232, 141, 98);
    } else if (temperature <= -1) {
      return rgb(229, 121, 95);
    } else if (temperature <= 1.5) {
      return rgb(225, 106, 96);
    } else if (temperature > 1.5) {
      return rgb(225, 0, 0);
    }
  };
  useEffect(() => {
    const divNode = mapRef.current;
    const childNode = divNode.firstChild;
    if (childNode !== null) {
      console.log(childNode, "llllll");
      divNode.removeChild(childNode);
    }
    if (
      // !mapInstanceRef.current &&
      mapRef.current &&
      tempData &&
      tempData.length > 0
    ) {
      // console.log(tempData, "prrrint it")
      map = new Map({
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

      // find the min, max and mean temperature values
      const tempValues = tempData.map((point) => point.t);
      const tempMax = Math.max(...tempValues);
      const tempMin = Math.min(...tempValues);

      // create a vector source and layer for the temperature points
      const temperatureSource = new VectorSource({
        attributions:
          'Weather data by <a href="http://www.rasdaman.org/">Rasdaman</a>',
        features:
          tempData &&
          tempData
            .filter((_, index) => index % 1 === 0) // only keep every 10th value
            .map((point) => {
              if (point && point.Long && point.Lat && point.t) {
                return new ol.Feature({
                  geometry: new Point(fromLonLat([point.Long, point.Lat])),
                  temperature: point.t,
                });
              }
            })

            .filter(Boolean),
      });

      // create the temperature layer with the dynamic color scale
      const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateViridis)
        .domain([tempMin, tempMax]);
      const temperatureLayer = new VectorLayer({
        source: temperatureSource,
        // opacity: 0.5,
        style: (feature) => {
          const temperature = feature.get("temperature");
          // const color = colorScale(temperature);
          const color = getColor(temperature);

          return new Style({
            image: new RegularShape({
              fill: new Fill({
                color: color,
              }),
              points: 4, // use 4 points to create a rectangle
              radius: 10, // half the height and width of the rectangle
              angle: Math.PI / 4, // rotate the rectangle 45 degrees
            }),
          });
        },
      });

      map.addLayer(temperatureLayer);
      mapInstanceRef.current = map;
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
      <Image
        style={{ position: "absolute", bottom: "118px" }}
        src="/colorMapLegend.png"
        width={996}
        height={25}
      ></Image>
    </>
  );
}
