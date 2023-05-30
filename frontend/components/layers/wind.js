function Wind({ windData, fetchWindData }) {
  return (
    <div>
      <main>
        {" "}
        <button
          onClick={(e) => {
            fetchWindData();
          }}
        >
          Wind
        </button>
      </main>
      {windData
        ? windData.map((data, index) => {
            return (
              <div key={index}>
                <p>Latitude: {data[0]}</p>
                <p>Longitude: {data[1]}</p>
                <p>Wind Speed: {data[2]}</p>
                <p>Wind Direction: {data[3]}</p>
              </div>
            );
          })
        : ""}
    </div>
  );
}

export default Wind;
