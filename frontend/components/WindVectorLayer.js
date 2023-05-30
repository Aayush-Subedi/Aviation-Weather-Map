import { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, RegularShape, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

const colors = [
  "#00008B", // Dark blue (0-5)
  "#8A2BE2", // Blue violet (40-45)
  "#0000FF", // Blue (10-15)
  "#006400", // Dark green (0-5)
  "#8B0000", // Dark red (35-40)
  "#FF0000", // Red (35-40)
];

const arrow_style = (speed) => {
  let colorIndex = Math.floor(speed / 5); // Calculate the color index based on speed
  if (colorIndex >= colors.length) {
    colorIndex = colors.length - 1; // Set the color index to the last color
  }
  const color = colors[colorIndex];
  console.log(colorIndex + "," + color);

  return [
    new Style({
      image: new RegularShape({
        points: 2,
        radius: 5,
        stroke: new Stroke({
          width: 2,
          color: color,
        }),
        rotateWithView: true,
      }),
    }),

    new Style({
      image: new RegularShape({
        points: 3,
        radius: 5,
        fill: new Fill({
          color: color,
        }),
        rotateWithView: true,
      }),
    }),
  ];
};

export default function WindVectorLayer({ windData }) {
  const mapRef = useRef(null);
  const printValue = useRef(1000);
  const [zoomValue, setZoomValue] = useState(4.2);

  useEffect(() => {
    const divNode = mapRef.current;
    const childNode = divNode.firstChild;

    if (childNode !== null) {
      divNode.removeChild(childNode);
    }
    if (mapRef.current && windData && windData.length > 0) {
      const vectorSource = new VectorSource({
        attributions:
          'Weather data by <a href="http://www.rasdaman.org/">Rasdaman</a>',
        features: windData
          .filter((_, index) => index % printValue.current === 0) // only keep every 10th value
          .map((data_wind) => {
            const lonLat = [data_wind.Long, data_wind.Lat];
            const windFeature = new Feature({
              geometry: new Point(fromLonLat(lonLat)),
              wind: {
                speed: data_wind.s,
                deg: data_wind.d,
              },
            });
            return windFeature;
          }),
      });

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: vectorSource,
            style: function (feature) {
              const zoomLevel = map.getView().getZoom();
              if (zoomLevel < 3.6) {
                printValue.current = 10000;
                setZoomValue(zoomLevel);
              } else if (zoomLevel >= 3.6) {
                printValue.current = 1000;
                setZoomValue(zoomLevel);
              }
              const wind = feature.get("wind");
              const angle = ((wind.deg - 180) * Math.PI) / 180;
              const scale = wind.speed / 10;
              const styleFunction = arrow_style(wind.speed);
              styleFunction[0].getImage().setScale([1, scale]);
              styleFunction[0].getImage().setRotation(angle);
              styleFunction[1]
                .getImage()
                .setDisplacement([
                  0,
                  styleFunction[1].getImage().getRadius() / 2 +
                    styleFunction[0].getImage().getRadius() * scale,
                ]);
              styleFunction[1].getImage().setRotation(angle);
              return styleFunction;
            },
          }),
        ],
        view: new View({
          center: fromLonLat([20, 61]),
          zoom: zoomValue,
        }),
      });
    } else {
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([20, 61]),
          zoom: zoomValue,
        }),
      });
    }
  }, [windData, printValue.current]);
  return (
    <div className="container">
      <div
        className="shadow shadow-dark mb-1 bg-body"
        style={{
          height: "70vh",
          width: "90%",
          backgroundColor: "#ffffff",
        }}
        ref={mapRef}
      ></div>
      <div className="legend">
        <ul className="legend-list">
          {colors.map((color, index) => (
            <li key={index}>
              <span
                className="legend-color"
                style={{ backgroundColor: color }}
              ></span>
              {index == colors.length - 1
                ? `${index * 5}+`
                : `${index * 5} - ${(index + 1) * 5}`}{" "}
              ms<sup>-1</sup>
            </li>
          ))}
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
