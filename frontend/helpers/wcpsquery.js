export const getTemperatureQuery = (time, plev) => {
  const temperature_query = `for $c in (temperature_new) 
let $var := [Lat(30:70), Long(-20: 60), ansi("${time}"), plev(${plev})]

return 
	encode(
    	(
        switch
        	case $c = -9.0 * pow(10.0, 33.0) return {red: 0; blue: 0; green: 0; alpha: 0}
        	case $c > (1.5 + 273.15) return {red: 195; green: 116; blue: 96; alpha: 150}
            case $c > (-1.0 + 273.15) return {red: 199; green: 128; blue: 96; alpha: 150}
            case $c > (-6.0 + 273.15) return {red: 202; green: 143; blue: 99; alpha: 150}
            case $c > (-11.0 + 273.15) return {red: 207; green: 159; blue: 103; alpha: 150}
            case $c > (-16.0 + 273.15) return {red: 118; green: 110; blue: 94; alpha: 150}
            case $c > (-21.0 + 273.15) return {red: 202; green: 202; blue: 202; alpha: 150}
        	case $c > (-26.0 + 273.15) return {red: 144; green: 178; blue: 202; alpha: 150}
            case $c > (-31.0 + 273.15) return {red: 128; green: 158; blue: 186; alpha: 150} 
            case $c > (-36 + 273.15) return {red: 119; green: 130; blue: 167; alpha: 150}
            case $c > (-41 + 273.15) return {red: 114; blue: 148; green: 103; alpha: 150}
            case $c > (-43.5 + 273.15) return {red: 125; blue: 143; green: 94; alpha: 150}
            default return {red: 0; blue: 0; green: 0; alpha: 0} 
      )[$var],
    	"image/png"
  )
`;
  return temperature_query;
};

export const getIcingQuery = (time, plev) => {
  const icing_query = `
for $c in (icing_degree_code_new) 
let $var := [Lat(30:70), Long(-20: 60), ansi("${time}"), plev(${plev})]

return 
	encode(
    	(switch
            case $c = 3.0		return {red: 255; blue: 0; green: 0; alpha: 1000}
        	case $c = 2.0		return {red: 255; blue: 255; green: 0; alpha: 1000}
            case $c = 1.0		return {red: 0; blue:255; green: 0; alpha: 1000}
            default				return {red: 255; blue: 255; green: 255; alpha: 0}
        )[$var],
    	"image/png"
    )
`;
  return icing_query;
};

export const getCBQuery = (time) => {
  const cb_query = `
for $c in (cb_top_new) 
let $var := [Lat(30:70), Long(-20: 60), ansi("${time}")]

return 
	encode( 
    	(switch
        case $c >= 900		return {red: 255; blue: 0; green: 0;alpha:1000}
        case $c > 650		return {red: 0; blue: 255; green: 0;alpha:1000}
        case $c > 500		return {red: 0; blue:0; green: 255;alpha:1000}
        default				return {red: 255; blue: 255; green: 255;alpha:0}
        )[$var],
    	"image/png"
    )
`;

  return cb_query;
};
