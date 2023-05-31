import { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import { fromLonLat, get, transformExtent } from "ol/proj";

export default function WCSTemperatureLayer({ temperatureImage }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const divNode = mapRef.current;
    const childNode = divNode.firstChild;
    let extent = [62.53125, 29.46875, -23.53125, 70.53125];
    var ovProj = get("EPSG:3857");
    if (childNode !== null) {
      console.log(childNode, "llllll");
      divNode.removeChild(childNode);
    }

    if (mapRef.current && temperatureImage) {
      const imageTemp = new ImageLayer({
        source: new ImageStatic({
          attributions:
          'Weather data by <a href="http://www.rasdaman.org/">Rasdaman</a>',
          url: temperatureImage,
          imageExtent: transformExtent(extent, "EPSG:4326", "EPSG:3857"),
          projection: ovProj,
        }),
      });
      const map = new Map({
        attributions:
        'Weather data by <a href="http://www.rasdaman.org/">Rasdaman</a>',
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          imageTemp,
        ],
        view: new View({
          center: fromLonLat([20, 50]),
          zoom: 4.2,
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
          center: fromLonLat([20, 50]),
          zoom: 4.2,
        }),
      });
    }
  }, [temperatureImage]);

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
              style={{ backgroundColor: "RGB(195, 116, 96)" }}
            ></span>
            &gt; 1.5°C
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(199, 128, 96)" }}
            ></span>
            &gt; -1.0°C
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(202, 143, 99)" }}
            ></span>
            &gt; -6.0°C
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(207, 159, 103)" }}
            ></span>
            &gt; -11.0°C
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(118, 110, 94)" }}
            ></span>
            &gt; -16.0°C
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(202, 202, 202)" }}
            ></span>
            &gt; -21.0°C
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(144, 178, 202)" }}
            ></span>
            &gt; -26.0°C
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(128, 158, 186)" }}
            ></span>
            &gt; -31.0°C
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(119, 130, 167)" }}
            ></span>
            &gt; -36.0°C
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(114, 148, 103)" }}
            ></span>
            &gt; -41.0°C
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: "RGB(125, 143, 94)" }}
            ></span>
            &gt; -43.5°C
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
