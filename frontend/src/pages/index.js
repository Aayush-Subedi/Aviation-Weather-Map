// Import Starts
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import ToolBar from "../../components/layers/ToolBar";
import VerticalSlider from "../../components/layers/altitude";
import HorizontalSlider from "../../components/layers/dateTime";
import HeatMapLayer from "../../components/HeatMap";
import "ol/ol.css";
import ColorMapLayer from "../../components/ColorMapLayer";
import WindVectorLayer from "../../components/WindVectorLayer";
import WindBarbLayer from "../../components/WindBarbsLayer";
import IcingLayer from "../../components/IcingLayer";
import CBLayer from "../../components/CBLayer";
import "react-toastify/dist/ReactToastify.css";
import WCSIcingLayer from "../../components/WCSIcingLayer";
import WCSCBLayer from "../../components/WCSCBLayer";
import WCSTemperatureLayer from "../../components/WCSTempLayer";
import {
  ALL_ALTITUDE_OPTIONS,
  ICING_ALTITUDE_OPTIONS,
} from "../../constants/altitude";
import {
  getCBQuery,
  getIcingQuery,
  getTemperatureQuery,
} from "../../helpers/wcpsquery";
import { getFormmatedTime } from "../../helpers/date";

const baseUrl = "https://weather.cube4envsec.org/rasdaman/ows";
const username = process.env.NEXT_PUBLIC_USERNAME;
const password = process.env.NEXT_PUBLIC_PASSWORD;
const auth = btoa(`${username}:${password}`);

export default function Home() {
  const [selectedMap, setSelectedMap] = useState("windvector");
  const [windData, setWindData] = useState("");
  const [tempData, setTempData] = useState([]);
  const [icingData, setIcingData] = useState([]);
  const [cbData, setCBData] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  const [altitudeOptions, setAltitudeOptions] = useState(ALL_ALTITUDE_OPTIONS);
  const [icingImage, setIcingImage] = useState(null);
  const [temperatureImage, setTemperatureImage] = useState(null);
  const [cbImage, setCBImage] = useState(null);

  const [sliderValue, setSliderValue] = useState({
    value: 22730,
    label: "22730",
  });

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const fetchWindData = async () => {
    try {
      const requestBody = {};

      if (sliderValue.value) {
        requestBody.subset2 = `plev(${sliderValue.value})`;
      }

      if (selectedDateTime) {
        let sTime = getFormmatedTime(selectedDateTime);
        requestBody.subset1 = `ansi("${sTime}")`;
      }

      const response = await fetch("http://127.0.0.1:5000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        setWindData([]);
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        toast.dismiss();
      }

      const data = await response.json();
      let new_array = data.filter((data_wind) => {
        if (data_wind.Lat && data_wind.Long && data_wind.s && data_wind.d) {
          return true;
        }
        return false;
      });
      setWindData(new_array);
    } catch (error) {
      toast.error("Data Not Found. Please Select Different Time & plev");
      console.error("Error fetching wind data:", error);
    }
  };

  const fetchTempData = async () => {
    try {
      const requestBody = {};
      if (selectedMap === "icing" || selectedMap === "wcs-icing") {
        requestBody.coverage_id = `icing_degree_code_new`;
      }

      if (sliderValue.value) {
        requestBody.subset2 = `plev(${sliderValue.value})`;
      }

      if (selectedDateTime) {
        let sTime = getFormmatedTime(selectedDateTime);
        requestBody.subset1 = `ansi("${sTime}")`;
      }

      const response = await fetch("http://127.0.0.1:5000/temp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        setTempData([]);
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        toast.dismiss();
      }

      const data = await response.json();

      let new_array = data.filter((data_temp) => {
        if (data_temp.Lat && data_temp.Long && data_temp.t) {
          return true;
        }
        return false;
      });
      setTempData(new_array);
    } catch (error) {
      toast.error("Data Not Found. Please Select Different Time & plev");
      console.error("Error fetching wind data:", error);
    }
  };

  const fetchWCSIcingData = async () => {
    try {
      const sTime = getFormmatedTime(selectedDateTime);
      const url = `${baseUrl}?SERVICE=WCS&VERSION=2.0.1&REQUEST=ProcessCoverages&QUERY=${encodeURIComponent(
        getIcingQuery(sTime, sliderValue.value)
      )}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (response.ok) {
        toast.dismiss();
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        setIcingImage(imgUrl);
      } else if (response.status === 401 || response.status === 403) {
        throw new Error("Unauthorized request");
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      if (error.message === "Unauthorized request") {
        toast.error("Unauthorized");
        setIcingImage(null);
      } else {
        toast.error("Data Not Found. Please Select Different Time & plev");
      }
    }
  };

  const fetchWCSTemperatureData = async () => {
    try {
      const sTime = getFormmatedTime(selectedDateTime);
      const url = `${baseUrl}?SERVICE=WCS&VERSION=2.0.1&REQUEST=ProcessCoverages&QUERY=${encodeURIComponent(
        getTemperatureQuery(sTime, sliderValue.value)
      )}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (response.ok) {
        toast.dismiss();
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        setTemperatureImage(imgUrl);
      } else if (response.status === 401 || response.status === 403) {
        throw new Error("Unauthorized request");
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      if (error.message === "Unauthorized request") {
        toast.error("Unauthorized");
        setTemperatureImage(null);
      } else {
        toast.error("Data Not Found. Please Select Different Time & plev");
        console.log(error);
      }
    }
  };

  const fetchWCSCBData = async () => {
    try {
      const sTime = getFormmatedTime(selectedDateTime);
      const url = `${baseUrl}?SERVICE=WCS&VERSION=2.0.1&REQUEST=ProcessCoverages&QUERY=${encodeURIComponent(
        getCBQuery(sTime)
      )}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (response.ok) {
        toast.dismiss();
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        setCBImage(imgUrl);
      } else if (response.status === 401 || response.status === 403) {
        throw new Error("Unauthorized request");
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      if (error.message === "Unauthorized request") {
        toast.error("Unauthorized");
        setCBImage(null);
      } else {
        toast.error("Data Not Found. Please Select Different Time");
        console.log(error);
      }
    }
  };

  const fetchIcingData = async () => {
    try {
      const requestBody = {};

      if (sliderValue.value) {
        let altValue = ICING_ALTITUDE_OPTIONS[0];
        if (sliderValue.value in ICING_ALTITUDE_OPTIONS) {
          altValue = subsetData.altitude;
        }
        requestBody.subset2 = `plev(${altValue})`;
      }

      if (selectedDateTime) {
        let sTime = getFormmatedTime(selectedDateTime);
        requestBody.subset1 = `ansi("${sTime}")`;
      }

      const response = await fetch("http://127.0.0.1:5000/icing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        setIcingData([]);
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        toast.dismiss();
      }

      const data = await response.json();
      let new_array = data.filter((data_temp) => {
        if (
          data_temp.Lat &&
          data_temp.Long &&
          data_temp.icing_degree_code !== null
        ) {
          return true;
        }
        return false;
      });
      setIcingData(new_array);
    } catch (error) {
      toast.error("Data Not Found. Please Select Different Time & plev");
      console.error("Error fetching wind data:", error);
    }
  };

  const fetchCBData = async () => {
    try {
      const requestBody = {};

      if (selectedDateTime) {
        let sTime = getFormmatedTime(selectedDateTime);
        requestBody.subset1 = `ansi("${sTime}")`;
      }

      const response = await fetch("http://127.0.0.1:5000/cb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        setCBData([]);
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        toast.dismiss();
      }

      const data = await response.json();
      let new_array = data.filter((data_temp) => {
        if (data_temp.Lat && data_temp.Long && data_temp.cb_top) {
          return true;
        }
        return false;
      });
      setCBData(new_array);
    } catch (error) {
      toast.error("Data Not Found. Please Select Different Time");
      console.error("Error fetching wind data:", error);
    }
  };

  useEffect(() => {
    if (selectedMap === "icing" || selectedMap === "wcs-icing") {
      setAltitudeOptions(ICING_ALTITUDE_OPTIONS);
      checkIfAltitdueValueIsPresent(sliderValue.value, ICING_ALTITUDE_OPTIONS);
    } else {
      setAltitudeOptions(ALL_ALTITUDE_OPTIONS);
      checkIfAltitdueValueIsPresent(sliderValue.value, ALL_ALTITUDE_OPTIONS);
    }

    if (selectedMap === "heatmap" || selectedMap === "colormap") {
      fetchTempData();
    } else if (selectedMap === "windvector" || selectedMap === "windbarb") {
      fetchWindData();
    } else if (selectedMap === "icing") {
      fetchIcingData();
    } else if (selectedMap === "wcs-icing") {
      fetchWCSIcingData();
    } else if (selectedMap === "wcs-temp") {
      fetchWCSTemperatureData();
    } else if (selectedMap === "wcs-cb") {
      fetchWCSCBData();
    } else if (selectedMap === "cb") {
      fetchCBData();
    }
  }, [sliderValue.value, selectedDateTime, selectedMap]);

  const checkIfAltitdueValueIsPresent = (alt, altArray) => {
    let index = altArray.indexOf(alt);
    if (index == -1) {
      setSliderValue({
        value: 22730,
        label: "Select Altitude ",
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Aviation Weather Data</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/plane.png" />
        </Head>
        <main
          className={styles.main}
          style={{ backgroundColor: "#344955", minHeight: "100vh" }}
        >
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
            }}
          >
            <div class="position-absolute pt-2 ps-5 w-100 bg-dark">

                <h1>Aviation Weather Map</h1>

            </div>
            <div
              id="date-and-plev"
              style={{
                display: "flex",
                flexDirection: "row",
                paddingTop: "5%",
                paddingLeft: "20%",
                marginBottom: "0.5%",
                justifyContent: "space-around",
              }}
            >
              <div style={{}}>
                {!(selectedMap === "cb" || selectedMap === "wcs-cb") && (
                  <div>
                    <h6
                      style={{
                        display: "flex",
                        verticalAlign: "center",
                        alignItems: "center",
                        paddingRight: "10px",
                      }}
                    >
                      Current plev:
                    </h6>
                    <VerticalSlider
                      selectedMap={selectedMap}
                      altitudeOptions={altitudeOptions}
                      sliderValue={sliderValue}
                      handleSliderChange={handleSliderChange}
                    />
                  </div>
                )}
              </div>
              <div>
                <div>
                  <h6>Current Date and Time:</h6>
                  <HorizontalSlider
                    selectedDateTime={selectedDateTime}
                    setSelectedDateTime={setSelectedDateTime}
                  />
                </div>
              </div>
            </div>
            <div
              id="map-and-toolbar"
              style={{
                display: "flex",
                flexDirection: "row",
                paddingLeft: "2.5%",
                marginBottom: "0.5%",
              }}
            >
              <div style={{ paddingTop: "4%" }}>
                <ToolBar
                  selectedMap={selectedMap}
                  setSelectedMap={setSelectedMap}
                />
              </div>
              <div class="col-sm d-flex justify-content-center align-items-center">
                {selectedMap === "heatmap" && (
                  <HeatMapLayer tempData={tempData} />
                )}
                {selectedMap === "colormap" && (
                  <ColorMapLayer tempData={tempData} />
                )}
                {selectedMap === "windvector" && (
                  <WindVectorLayer windData={windData} />
                )}
                {selectedMap === "windbarb" && (
                  <WindBarbLayer windData={windData} />
                )}
                {selectedMap === "icing" && icingData && (
                  <IcingLayer tempData={icingData} />
                )}
                {selectedMap === "wcs-icing" && (
                  <WCSIcingLayer icingImage={icingImage} />
                )}
                {selectedMap === "wcs-temp" && (
                  <WCSTemperatureLayer temperatureImage={temperatureImage} />
                )}
                {selectedMap === "wcs-cb" && <WCSCBLayer cbImage={cbImage} />}

                {selectedMap === "cb" && <CBLayer tempData={cbData} />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
