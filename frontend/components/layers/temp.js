function Temperature({ tempData, fetchTempData }) {
  return (
    <>
      <div>
        <button
          onClick={(e) => {
            fetchTempData();
          }}
        >
          Temperature
        </button>
        {tempData
          ? tempData.map((data, index) => {
              return (
                <div key={index}>
                  <p>Latitude: {data.Lat}</p>
                  <p>Longitude: {data.Long}</p>
                  <p>Temperature: {data.t}</p>
                </div>
              );
            })
          : ""}
      </div>
    </>
  );
}

export default Temperature;
