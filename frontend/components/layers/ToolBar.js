import React from "react";
import { BsCloudsFill } from "react-icons/bs";
import { BsSnow } from "react-icons/bs";

function ToolBar({ selectedMap, setSelectedMap }) {
  return (
    <>
      <div
        class="container"
        style={{
          float: "left",
          paddingTop: "10px",
          paddingBottom: "0px",
        }}
      >
        <div class="row">
          <div class="col-sm bg-transparent align-items-center border border-3 border-light rounded">
            <ul class="nav nav-pills nav-flush mb-auto mx-auto d-flex flex-sm-column flex-column flex-nowrap align-middle align-items-center">
              <li>
                <span
                  class="nav-link  px-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-original-title="Home"
                  onClick={() => {
                    setSelectedMap("windvector");
                  }}
                >
                  <i
                    class="fa-solid fa-wind"
                    style={{
                      color:
                        selectedMap === "windvector" ? "yellow" : "#ffffff",
                      cursor: "pointer",
                    }}
                  ></i>
                </span>
              </li>
              <li>
                <span
                  class="nav-link  px-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-original-title="Home"
                  onClick={() => {
                    setSelectedMap("windbarb");
                  }}
                >
                  <i
                    class="fa-solid fa-wind"
                    style={{
                      color: selectedMap === "windbarb" ? "yellow" : "#ffffff",
                      cursor: "pointer",
                    }}
                  ></i>
                </span>
              </li>
              <li>
                <span
                  class="nav-link  px-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-original-title="Products"
                  onClick={() => {
                    setSelectedMap("wcs-cb");
                  }}
                >
                  <BsSnow
                    style={{
                      color: selectedMap === "wcs-cb" ? "yellow" : "#ffffff",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </li>
              <li>
                <span
                  class="nav-link  px-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-original-title="Products"
                  onClick={() => {
                    setSelectedMap("wcs-icing");
                  }}
                >
                  <BsSnow
                    style={{
                      color: selectedMap === "wcs-icing" ? "yellow" : "#ffffff",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </li>
              <li>
                <span
                  class="nav-link  px-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-original-title="Products"
                  onClick={() => {
                    setSelectedMap("wcs-temp");
                  }}
                >
                  <BsSnow
                    style={{
                      color: selectedMap === "wcs-temp" ? "yellow" : "#ffffff",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </li>
              <li>
                <span
                  class="nav-link  px-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-original-title="Orders"
                  onClick={() => {
                    setSelectedMap("cb");
                  }}
                >
                  <BsCloudsFill
                    style={{
                      color: selectedMap === "cb" ? "yellow" : "#ffffff",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </li>
              <li>
                <span
                  class="nav-link  px-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-original-title="Products"
                  onClick={() => {
                    setSelectedMap("icing");
                  }}
                >
                  <BsSnow
                    style={{
                      color: selectedMap === "icing" ? "yellow" : "#ffffff",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </li>

              <li class="nav-item">
                <span
                  class="nav-link  px-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-original-title="Dashboard"
                  onClick={() => {
                    setSelectedMap("heatmap");
                  }}
                >
                  <i
                    class="fa-solid fa-temperature-quarter"
                    style={{
                      color: selectedMap === "heatmap" ? "yellow" : "#ffffff",
                      cursor: "pointer",
                    }}
                  ></i>
                </span>
              </li>
            </ul>
          </div>
          <div class="col-sm d-flex flex-sm-column flex-row bg-opacity-100 fw-bold">
            <ul class="nav nav-pills nav-flush mb-auto mx-auto d-flex flex-sm-column flex-row flex-nowrap align-items-start">
              <span
                class="pt-3"
                style={{
                  color: selectedMap === "windvector" ? "yellow" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("windvector");
                }}
              >
                Wind Arrows
              </span>
              <span
                class=" pt-3"
                style={{
                  color: selectedMap === "windbarb" ? "yellow" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("windbarb");
                }}
              >
                Wind Barbs
              </span>
              <span
                class=" pt-3"
                style={{
                  color: selectedMap === "wcs-cb" ? "yellow" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("wcs-cb");
                }}
              >
                W-Cb
              </span>
              <span
                class=" pt-3"
                style={{
                  color: selectedMap === "wcs-icing" ? "yellow" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("wcs-icing");
                }}
              >
                W-Icing
              </span>
              <span
                class=" pt-3 text-nowrap"
                style={{
                  color: selectedMap === "wcs-temp" ? "yellow" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("wcs-temp");
                }}
              >
                W-Temperature
              </span>
              <span
                class=" pt-3"
                style={{
                  color: selectedMap === "cb" ? "yellow" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("cb");
                }}
              >
                Cb
              </span>
              <span
                class=" pt-3"
                style={{
                  color: selectedMap === "icing" ? "yellow" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("icing");
                }}
              >
                Icing
              </span>
              <span
                class=" pt-3"
                style={{
                  color: selectedMap === "heatmap" ? "yellow" : "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("heatmap");
                }}
              >
                Temperature
              </span>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
export default ToolBar;
