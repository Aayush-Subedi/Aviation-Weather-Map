# Aviation Weather Map
In this project, the weather data is obtained through the **Rasdaman server** and visualized on a two-dimensional map using **OpenLayers**. Different visualization techniques like wind barbs and a color map were implemented. To enhance user understanding, legends are included alongside the displayed information.  The data is retrieved using **Web Coverage Service (WCS)** and **Web Coverage Processing Service (WCPS)**. If required, data preprocessing is performed using Python Flask. The front end of the application is developed using **Next.js**.

## Table of Contents
- [Aviation Weather Map](#aviation-weather-map)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Backend (Python Flask)](#backend-python-flask)
    - [Frontend (Next.js)](#frontend-nextjs)
  - [Usage](#usage)
  - [Portability Considerations](#portability-considerations)
  - [License](#license)
  - [Project Screenshots](#project-screenshots)
  - [File structure](#file-structure)


## Installation


### Prerequisites
- Node.js (version 20.2.0 or higher)
- Python (version 3.9.6 or higher)
- pip (Python package installer)

### Backend (Python Flask)

  1. Clone the repository and navigate to the project directory:
     ```shell
     git clone <repository-url>
     cd thesis_codes
     ```
  2. Navigate to the api directory:
      ```shell
      cd api
      ```
  3. Create and activate a virtual environment:
      ```shell
      python -m venv venv
      source venv/bin/activate
      ```
  4. Install the required python packages:
      ```shell
      pip install -r requirements.txt
      ```
  ### Frontend (Next.js)

  1. Navigate to the frontend directory:
      ```shell
      cd ../frontend
      ```
  2. Install the dependencies:
      ```shell
      npm install
      ```
  ## Usage

  1. Start the backend server:
     ```shell
      cd ../api
      export FLASK_APP=app.py
      flask run
      ```
  2. Start the frontend server:
      ```shell
      cd ../frontend
      npm run dev
      ```
  3. Access the application in your browser:
  Open ```http://localhost:3000``` in your preferred web browser.


## Portability Considerations
Has been tested on Firefox (113.0.2), Chrome (113.0.5672.126), and Safari (16.4) on Intel Macbook Pro Ventura 13.3.1.


## License

Include a statement about the license and terms of use for the project.

## Project Screenshots
![Screenshot 1](screenshots/wind-vector-arrows.png?raw=true)
<!-- *Caption: Wind Vector Arrows* -->
*Wind Vector Arrows*

<br />

![Screenshot 2](screenshots/wind-barbs.png?raw=true)
<!-- *Caption: Wind Barbs* -->
*Wind Barbs*

<br />

![Screenshot 3](screenshots/cb-clouds.png?raw=true)
<!-- *Caption: Cumulonimbus Clouds* -->
*Cumulonimbus Clouds*

<br />

![Screenshot 4](screenshots/icing.png?raw=true)
<!-- *Caption: Icing* -->
*Icing*

<br />

![Screenshot 5](screenshots/temperature.png?raw=true)
<!-- *Caption: Temperature* -->
*Temperature*

## File structure

```
aviation_weather_map
├── README.md
├── api
│   ├── app.py
│   ├── config.example.py
│   ├── config.py
│   └── requirements.txt
├── frontend
│   ├── README.md
│   ├── components
│   │   ├── CBLayer.js
│   │   ├── ColorMapLayer.js
│   │   ├── HeatMap.js
│   │   ├── IcingLayer.js
│   │   ├── WCSCBLayer.js
│   │   ├── WCSIcingLayer.js
│   │   ├── WCSTempLayer.js
│   │   ├── WindBarbsLayer.js
│   │   ├── WindVectorLayer.js
│   │   └── layers
│   │       ├── ToolBar.js
│   │       ├── altitude.js
│   │       ├── cb_legend.js
│   │       ├── dateTime.js
│   │       ├── icing_legend.js
│   │       ├── temp.js
│   │       └── wind.js
│   ├── constants
│   │   └── altitude.js
│   ├── helpers
│   │   ├── date.js
│   │   └── wcpsquery.js
│   ├── jsconfig.json
│   ├── next.config.js
│   ├── package-lock.json
│   ├── package.json
│   └── src
│       ├── pages
│       │   ├── _app.js
│       │   ├── _document.js
│       │   └── index.js
│       └── styles
│           ├── Home.module.css
│           ├── HorizontalSlider.module.css
│           ├── VerticalSlider.module.css
│           └── globals.css
└── package-lock.json
```
