import { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import { fromLonLat, get, transformExtent } from "ol/proj";

export default function WCSIcingLayer({ icingImage }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const divNode = mapRef.current;
    const childNode = divNode.firstChild;
    let extent = [62.53125, 29.46875, -23.53125, 70.53125];
    var ovProj = get("EPSG:3857");
    if (childNode !== null) {
      divNode.removeChild(childNode);
    }

    if (mapRef.current && icingImage) {
      const imageIcing = new ImageLayer({
        source: new ImageStatic({
          attributions:
            'Weather data by <a href="http://www.rasdaman.org/">Rasdaman</a>',
          url: icingImage,
          imageExtent: transformExtent(extent, "EPSG:4326", "EPSG:3857"),
          projection: ovProj,
        }),
      });
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          imageIcing,
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
  }, [icingImage]);

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
