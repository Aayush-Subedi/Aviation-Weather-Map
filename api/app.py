from flask import Flask, jsonify, request
import netCDF4
import numpy as np
import pandas as pd
import json
import requests
import base64
import config

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

username = config.username
password = config.password


@app.route('/', methods=['POST'])
def index():
    # set the URL of the Rasdaman service
    base_url = 'https://weather.cube4envsec.org/rasdaman/ows'

    # Parse the JSON data from the request body into a dictionary
    myData = request.get_json()

    # Use the dictionary to set the variables for the Rasdaman service
    service = myData.get('service', 'WCS')
    version = myData.get('version', '2.0.1')
    requestCoverage = myData.get('request', 'GetCoverage')
    coverage_id = myData.get('coverage_id', 'wind_plev_new')
    subset1 = myData.get('subset1', 'ansi("2022-11-24T00:00:00.000Z")')
    subset2 = myData.get('subset2', 'plev(11050)')
    subset3 = myData.get('subset3', 'Lat(50,70)')
    subset4 = myData.get('subset4', 'Long(-20,60)')
    format = myData.get('format', 'application/netcdf')

    # construct the complete URL from the URL components
    url = f"{base_url}?SERVICE={service}&VERSION={version}&REQUEST={requestCoverage}&COVERAGEID={coverage_id}&SUBSET={subset1}&SUBSET={subset2}&SUBSET={subset3}&SUBSET={subset4}&FORMAT={format}"

    auth = base64.b64encode(f"{username}:{password}".encode()).decode()

    # set the headers for the request
    headers = {
        'Authorization': f'Basic {auth}',
        'Content-Type': 'application/netcdf',
    }

    # send the request to the Rasdaman service
    response = requests.get(url, headers=headers)

    # open the NetCDF file using netCDF4
    data = netCDF4.Dataset('wind_data.nc', memory=response.content)

    # get the values of u and v variables
    u = data.variables['u'][:]
    v = data.variables['v'][:]
    lat = data.variables['Lat'][:]
    lon = data.variables['Long'][:]

    # create a pandas DataFrame from the NetCDF data
    df = pd.DataFrame({
        'u': u.flatten(),
        'v': v.flatten(),
        'Lat': lat.repeat(len(lon)),
        'Long': lon.tolist() * len(lat)
    })

    # calculate wind speed for valid data points
    mask = ~np.isnan(df['u']) & ~np.isnan(df['v'])
    df.loc[mask, 's'] = np.sqrt(
        df.loc[mask, 'u']**2 + df.loc[mask, 'v']**2)

    # calculate wind direction for valid data points
    df.loc[mask, 'd'] = np.degrees(
        np.arctan2(df.loc[mask, 'v'], df.loc[mask, 'u']))

    df = df.drop(['u', 'v'], axis=1)

    print(df.head)

    wind_json_data = df.to_json(orient='records')

    return (wind_json_data)


@app.route('/trying')
def trying():
    # set the URL of the Rasdaman service
    base_url = 'https://weather.cube4envsec.org/rasdaman/ows'
    service = 'WCS'
    version = '2.0.1'
    request = 'GetCoverage'
    coverage_id = 'wind_plev_new'
    subset1 = 'ansi("2022-11-24T00:00:00.000Z")'
    subset2 = 'plev(5000)'
    subset3 = 'Lat(35,40)'
    subset4 = 'Long(5,10)'
    format = 'application/netcdf'

    # construct the complete URL from the URL components
    url = f"{base_url}?SERVICE={service}&VERSION={version}&REQUEST={request}&COVERAGEID={coverage_id}&SUBSET={subset1}&SUBSET={subset2}&SUBSET={subset3}&SUBSET={subset4}&FORMAT={format}"

    # set the authorization credentials
    auth = base64.b64encode(f"{username}:{password}".encode()).decode()

    # set the headers for the request
    headers = {
        'Authorization': f'Basic {auth}',
        'Content-Type': 'application/netcdf'
    }

    # send the request to the Rasdaman service
    response = requests.get(url, headers=headers)

    # open the NetCDF file using netCDF4
    data = netCDF4.Dataset('wind_data.nc', memory=response.content)

    # get the values of u and v variables
    u = data.variables['u'][:]
    v = data.variables['v'][:]
    lat = data.variables['Lat'][:]
    lon = data.variables['Long'][:]

    # create a pandas DataFrame from the NetCDF data
    df = pd.DataFrame({
        'u': u.flatten(),
        'v': v.flatten(),
        'Lat': lat.repeat(len(lon)),
        'Long': lon.tolist() * len(lat)
    })

    # calculate wind speed for valid data points
    mask = ~np.isnan(df['u']) & ~np.isnan(df['v'])
    df.loc[mask, 'wind_speed'] = np.sqrt(
        df.loc[mask, 'u']**2 + df.loc[mask, 'v']**2)

    # calculate wind direction for valid data points
    df.loc[mask, 'wind_direction'] = np.degrees(
        np.arctan2(df.loc[mask, 'v'], df.loc[mask, 'u']))

    # convert dataframe to JSON
    json_data = df.to_json(orient='records')

    # Load JSON data from file
    data = json.loads(json_data)
    # Convert data to the format required by Leaflet.Wind
    wind_data = []
    for point in data:
        wind_data.append([point['Lat'], point['Long'],
                          point['wind_speed'], point['wind_direction']])

    # Return the wind data as JSON
    return jsonify(wind_data)


@app.route('/temp', methods=['POST'])
def temp():
    # set the URL of the Rasdaman service
    base_url = 'https://weather.cube4envsec.org/rasdaman/ows'

    # Parse the JSON data from the request body into a dictionary
    myData = request.get_json()

    print("myData", myData)

    # Use the dictionary to set the variables for the Rasdaman service
    service = myData.get('service', 'WCS')
    version = myData.get('version', '2.0.1')
    requestCoverage = myData.get('request', 'GetCoverage')
    coverage_id = myData.get('coverage_id', 'temperature_new')
    subset1 = myData.get('subset1', 'ansi("2022-11-24T00:00:00.000Z")')
    subset2 = myData.get('subset2', 'plev(11050)')
    subset3 = myData.get('subset3', 'Lat(50,55)')
    subset4 = myData.get('subset4', 'Long(10,15)')
    format = myData.get('format', 'application/netcdf')

    print("subset1", subset1)

    # construct the complete URL from the URL components
    url = f"{base_url}?SERVICE={service}&VERSION={version}&REQUEST={requestCoverage}&COVERAGEID={coverage_id}&SUBSET={subset1}&SUBSET={subset2}&SUBSET={subset3}&SUBSET={subset4}&FORMAT={format}"

    # set the authorization credentials
    auth = base64.b64encode(f"{username}:{password}".encode()).decode()

    # set the headers for the request
    headers = {
        'Authorization': f'Basic {auth}',
        'Content-Type': 'application/netcdf'
    }

    # send the request to the Rasdaman service
    response = requests.get(url, headers=headers)

    # open the NetCDF file using netCDF4
    data = netCDF4.Dataset('temp_data.nc', memory=response.content)

    # get the values of u and v variables
    t = data.variables['t'][:]
    lat = data.variables['Lat'][:]
    lon = data.variables['Long'][:]

    # convert temperature from Kelvin to Celsius
    t_celsius = t - 273.15

    # create a pandas DataFrame from the NetCDF data
    df = pd.DataFrame({
        't': t_celsius.flatten(),
        'Lat': lat.repeat(len(lon)),
        'Long': lon.tolist() * len(lat)
    })

    temp_json_data = df.to_json(orient='records')

    return (temp_json_data)


@app.route('/icing', methods=['POST'])
def icing():
    # set the URL of the Rasdaman service
    base_url = 'https://weather.cube4envsec.org/rasdaman/ows'

    # Parse the JSON data from the request body into a dictionary
    myData = request.get_json()

    print("myData", myData)

    # Use the dictionary to set the variables for the Rasdaman service
    service = myData.get('service', 'WCS')
    version = myData.get('version', '2.0.1')
    requestCoverage = myData.get('request', 'GetCoverage')
    coverage_id = myData.get('coverage_id', 'icing_degree_code_new')
    subset1 = myData.get('subset1', 'ansi("2022-11-24T00:00:00.000Z")')
    subset2 = myData.get('subset2', 'plev(22730)')
    subset3 = myData.get('subset3', 'Lat(50,70)')
    subset4 = myData.get('subset4', 'Long(55,60)')
    format = myData.get('format', 'application/netcdf')

    print("subset1", subset1)

    # construct the complete URL from the URL components
    url = f"{base_url}?SERVICE={service}&VERSION={version}&REQUEST={requestCoverage}&COVERAGEID={coverage_id}&SUBSET={subset1}&SUBSET={subset2}&SUBSET={subset3}&SUBSET={subset4}&FORMAT={format}"
    # url = 'https://weather.cube4envsec.org/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=icing_degree_code_new&SUBSET=ansi("2022-11-24T00:00:00.000Z")&SUBSET=plev(22730)&SUBSET=Lat(50,70)&SUBSET=Long(50,61)&FORMAT=application/netcdf'

    # set the authorization credentials
    auth = base64.b64encode(f"{username}:{password}".encode()).decode()

    # set the headers for the request
    headers = {
        'Authorization': f'Basic {auth}',
        'Content-Type': 'application/netcdf'
    }

    # send the request to the Rasdaman service
    response = requests.get(url, headers=headers)

    # open the NetCDF file using netCDF4
    data = netCDF4.Dataset('temp_data.nc', memory=response.content)

    # get the values of u and v variables
    icing_degree_code = data.variables['icing_degree_code'][:]
    lat = data.variables['Lat'][:]
    lon = data.variables['Long'][:]

    # create a pandas DataFrame from the NetCDF data
    df = pd.DataFrame({
        'icing_degree_code': icing_degree_code.flatten(),
        'Lat': lat.repeat(len(lon)),
        'Long': lon.tolist() * len(lat)
    })

    temp_json_data = df.to_json(orient='records')

    return (temp_json_data)


@app.route('/cb', methods=['POST'])
def cb():
    # set the URL of the Rasdaman service
    base_url = 'https://weather.cube4envsec.org/rasdaman/ows'

    # Parse the JSON data from the request body into a dictionary
    myData = request.get_json()

    print("myData", myData)

    # Use the dictionary to set the variables for the Rasdaman service
    service = myData.get('service', 'WCS')
    version = myData.get('version', '2.0.1')
    requestCoverage = myData.get('request', 'GetCoverage')
    coverage_id = myData.get('coverage_id', 'cb_top_new')
    subset1 = myData.get('subset1', 'ansi("2022-11-24T00:00:00.000Z")')
    subset3 = myData.get('subset3', 'Lat(30,70)')
    subset4 = myData.get('subset4', 'Long(20,60)')
    format = myData.get('format', 'application/netcdf')

    print("subset1", subset1)

    # construct the complete URL from the URL components
    url = f"{base_url}?SERVICE={service}&VERSION={version}&REQUEST={requestCoverage}&COVERAGEID={coverage_id}&SUBSET={subset1}&SUBSET={subset3}&SUBSET={subset4}&FORMAT={format}"
    # url ='https://weather.cube4envsec.org/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=cb_top_new&SUBSET=ansi("2022-11-24T01:00:00.000Z")&SUBSET=Lat(30,40)&SUBSET=Long(30,40)&FORMAT=application/netcdf'

    # set the authorization credentials
    auth = base64.b64encode(f"{username}:{password}".encode()).decode()

    # set the headers for the request
    headers = {
        'Authorization': f'Basic {auth}',
        'Content-Type': 'application/netcdf'
    }

    # send the request to the Rasdaman service
    response = requests.get(url, headers=headers)

    # open the NetCDF file using netCDF4
    data = netCDF4.Dataset('temp_data.nc', memory=response.content)

    # get the values of u and v variables
    cb_top = data.variables['cb_top'][:]
    lat = data.variables['Lat'][:]
    lon = data.variables['Long'][:]

    # create a pandas DataFrame from the NetCDF data
    df = pd.DataFrame({
        'cb_top': cb_top.flatten(),
        'Lat': lat.repeat(len(lon)),
        'Long': lon.tolist() * len(lat)
    })

    temp_json_data = df.to_json(orient='records')

    return (temp_json_data)


if __name__ == '__main__':
    app.run(debug=True)
