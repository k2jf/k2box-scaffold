import chroma from 'chroma-js'

/**
 * make a palette function based on the specified colorStops
 * @param colorStopArr { [{position: number, color: string}] } color stops
 * @param defaultColor { string } default color if value is illegal
 * @return {Function}
 */
export function makePalette (colorStopArr, defaultColor = '#ccc') {

  // see http://colorbrewer2.org/#type=diverging&scheme=Spectral&n=5
  const colorStop = colorStopArr || [
    {position: 0, color: '#d7191c'},
    {position: 20, color: '#fdae61'},
    {position: 40, color: '#ffffbf'},
    {position: 60, color: '#c9dd68'},
    {position: 90, color: '#5dcc60'}
  ];
  colorStop.sort((s1, s2) => s1.position - s2.position);
  const lastStop = colorStop[colorStop.length - 1];
  if (lastStop.position < 100) {
    colorStop.push({position: 100, color: lastStop.color});
  }

  return function (value) {
    if (isNaN(value) || value < 0 || value > 100) {
      return defaultColor;
    } else {
      for (let i = 0; i < colorStop.length - 1; i++) {
        const from = colorStop[i];
        const to = colorStop[i + 1];
        if (value === 100) {
          return lastStop.color;
        }
        if (from.position <= value && value < to.position) {
          const ratio = (value - from.position) / (to.position - from.position);
          return chroma.mix(from.color, to.color, ratio, 'lab').hex();
        }
      }
      return defaultColor;
    }
  }
}
