import { useState, useEffect, useRef } from "react";
import { D3WindBarb, ConversionFactors } from "d3-wind-barbs";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, RegularShape, Stroke, Style, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

// import { Plane } from "../public/windbarb.png";

export default function WindBarbLayer({ windData }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const printValue = useRef(2000);
  const [zoomValue, setZoomValue] = useState(4.2);

  useEffect(() => {
    const divNode = mapRef.current;
    const childNode = divNode.firstChild;

    if (childNode !== null) {
      // console.log(childNode, "llllll");
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
              if (zoomLevel < 3.7) {
                printValue.current = 10000;
                setZoomValue(zoomLevel);
              } else if (zoomLevel >= 3.7) {
                printValue.current = 2000;
                setZoomValue(zoomLevel);
              }
              const wind = feature.get("wind");
              // console.log(wind.deg, ":wind direction");
              // console.log(wind.speed, ":wind speed");
              const windBarb = new D3WindBarb(
                wind.speed, // In knots. If your data is in other units you shuld pass de correct conversionFactor
                wind.deg, // in degrees
                // All this configuration is optional. Change it  or comment it to check its effects
                {
                  bar: {
                    angle: 30,
                    fullBarClassName: "",
                    padding: 6,
                    shortBarClassName: "",
                    stroke: "#000",
                    width: 2,
                  },
                  circle: {
                    fill: "#FFFFFF",
                    stroke: "#000",
                    radius: 5,
                    strokeWidth: 2,
                    className: "wind-barb-zero-knots-circle",
                  },
                  conversionFactor: 1.94384, //1 meter per second (m/s) is equivalent to 1.94384 knots (kt) approximately.
                  rootBarClassName: "",
                  size: {
                    width: 80,
                    height: 40,
                  },
                  svgId: "",
                  triangle: {
                    fill: "#000",
                    stroke: "#000",
                    padding: 6,
                    className: "wind-barb-triangle",
                  },
                  baseCircle: {
                    className: "wind-barb-base-circle",
                    fill: "#000",
                    radius: 5,
                    stroke: "#000",
                    strokeWidth: 1,
                  },
                }
              ).draw();

              windBarb.setAttribute("xmlns", "http://www.w3.org/2000/svg");
              windBarb.setAttribute("xmlns:svg", "http://www.w3.org/2000/svg");
              windBarb.setAttribute("width", "40");
              windBarb.setAttribute("height", "80");
              const style = new Style({
                image: new Icon({
                  opacity: 1,
                  src:
                    "data:image/svg+xml;utf8," +
                    window.encodeURIComponent(windBarb.outerHTML),
                }),
              });
              return style;
            },
          }),
        ],
        view: new View({
          center: fromLonLat([20, 61]),
          zoom: zoomValue,
        }),
      });

      // var svg = new D3WindBarb(86, 45).draw();

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
          center: fromLonLat([20, 61]),
          zoom: zoomValue,
        }),
      });
    }
  }, [windData, printValue.current]);

  return (
    <div className="container">
      <div
        // class="border border-3 border-light rounded"
        id="map-and-barb"
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
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_0.png"></img>
              <span>0 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_1.png"></img>
              <span>5 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_2.png"></img>
              <span>10 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_3.png"></img>
              <span>15 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_4.png"></img>
              <span>20 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_5.png"></img>
              <span>25 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_6.png"></img>
              <span>30 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_8.png"></img>
              <span>40 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_10.png"></img>
              <span>50 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_11.png"></img>
              <span>55 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_12.png"></img>
              <span>60 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_20.png"></img>
              <span>100 kts</span>
            </div>
          </li>
          <li>
            <div
              className="barbs"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img className="barb-bkg" src="arrows/wind_25.png"></img>
              <span>125 kts</span>
            </div>
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
        .barb-bkg {
          background: white;
          margin-right: 2px;
          height: 30px;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}
