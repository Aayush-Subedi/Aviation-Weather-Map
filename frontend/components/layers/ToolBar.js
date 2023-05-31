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
          marginBottom: "4px",
        }}
      >
        <div class="row">
          <div class="col-sm bg-light align-items-center">
            <ul class="nav nav-pills nav-flush mb-auto mx-auto d-flex pt-2 flex-sm-column flex-column flex-nowrap align-middle align-items-center">
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
                        selectedMap === "windvector"
                          ? "rgb(37, 134, 150)"
                          : "#000000",
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
                      color:
                        selectedMap === "windbarb"
                          ? "rgb(37, 134, 150)"
                          : "#000000",
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
                      color:
                        selectedMap === "wcs-cb"
                          ? "rgb(37, 134, 150)"
                          : "#000000",
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
                      color:
                        selectedMap === "wcs-icing"
                          ? "rgb(37, 134, 150)"
                          : "#000000",
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
                      color:
                        selectedMap === "wcs-temp"
                          ? "rgb(37, 134, 150)"
                          : "#000000",
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
                      color:
                        selectedMap === "cb" ? "rgb(37, 134, 150)" : "#000000",
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
                      color:
                        selectedMap === "icing"
                          ? "rgb(37, 134, 150)"
                          : "#000000",
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
                      color:
                        selectedMap === "heatmap"
                          ? "rgb(37, 134, 150)"
                          : "#000000",
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
                  color:
                    selectedMap === "windvector"
                      ? "rgb(37, 134, 150)"
                      : "#000000",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("windvector");
                }}
              >
                WCS-Wind Arrows
              </span>
              <span
                class=" pt-3"
                style={{
                  color:
                    selectedMap === "windbarb"
                      ? "rgb(37, 134, 150)"
                      : "#000000",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("windbarb");
                }}
              >
                WCS-Wind Barbs
              </span>
              <span
                class=" pt-3"
                style={{
                  color:
                    selectedMap === "wcs-cb" ? "rgb(37, 134, 150)" : "#000000",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("wcs-cb");
                }}
              >
                WCPS-Cb(CM)
              </span>
              <span
                class=" pt-3"
                style={{
                  color:
                    selectedMap === "wcs-icing"
                      ? "rgb(37, 134, 150)"
                      : "#000000",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("wcs-icing");
                }}
              >
                WCPS-Icing(CM)
              </span>
              <span
                class=" pt-3 text-nowrap"
                style={{
                  color:
                    selectedMap === "wcs-temp"
                      ? "rgb(37, 134, 150)"
                      : "#000000",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("wcs-temp");
                }}
              >
                WCPS-Temperature(CM)
              </span>
              <span
                class=" pt-3"
                style={{
                  color: selectedMap === "cb" ? "rgb(37, 134, 150)" : "#000000",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("cb");
                }}
              >
                WCS-Cb(HM)
              </span>
              <span
                class=" pt-3"
                style={{
                  color:
                    selectedMap === "icing" ? "rgb(37, 134, 150)" : "#000000",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("icing");
                }}
              >
                WCS-Icing(CM)
              </span>
              <span
                class=" pt-3"
                style={{
                  color:
                    selectedMap === "heatmap" ? "rgb(37, 134, 150)" : "#000000",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedMap("heatmap");
                }}
              >
                WCS-Temperature(HM)
              </span>
            </ul>
          </div>
          <div class="border border-1 border-dark rounded mt-2 mb-2"></div>
        </div>
      </div>
      <div class="col-sm bg-light text-dark align-items-center mt-2 pe-2 ps-1">
        <b class="mt-2">CM - ColorMap</b>
        <br />
        <b>HM - HeatMap</b>
        <br />
        <b>Cb - Cumulonimbus</b>
        <br />
      </div>
    </>
  );
}
export default ToolBar;
