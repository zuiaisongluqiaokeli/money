export function copyOption (option) {
  const t = Object.assign({}, option)
  delete t.chart
  return JSON.parse(JSON.stringify(t))
}

export function getImage (url) {
  return 'http://'+window.location.host+'/server-app/api/gbasemanage/rest/manager/graph/db/pic/find-one?imgFile='+url
}

export function getFieldListByType (fieldList, data, type) {
  fieldList = Object.assign([], fieldList)
  const res = []
  for (let i = 0; i < fieldList.length; i++) {
    const field = fieldList[i]
    if (typeof data[field] === type) {
      res.push(field)
    }
  }
  return res.length > 0 ? res : fieldList
}

export function canvasToBase64 (canvas, imgType) {
  return canvas.toDataURL('image/' + imgType)
}

export function downloadImage (canvas, imgType, filename) {
  const mimeType = 'image/' + imgType
  const base64 = canvas.toDataURL(mimeType)
  downloadBase64File(base64, mimeType, filename)
}

export function downloadBase64File (base64, mimeType, filename) {
  const a = document.createElement('a')
  a.download = filename
  a.href = base64
  a.dataset.downloadurl = [mimeType, a.download, a.href].join(':')
  a.click()
}

export function downloadString (str, type, filename) {
  const a = document.createElement('a')
  a.download = filename
  a.href = URL.createObjectURL(new Blob([str], { type }))
  a.click()
}

export function defaultColorList () {
  return ['#5B8FF9', '#BDD2FD', '#5AD8A6', '#BDEFDB', '#5D7092', '#C2C8D5', '#F6BD16', '#FBE5A2', '#E8684A', '#F6C3B7', '#6DC8EC', '#B6E3F5', '#9270CA', '#D3C6EA', '#FF9D4D', '#FFD8B8', '#269A99', '#AAD8D8', '#FF99C3', '#FFD6E7']
}

export function updateSeriesList (optionForm, context) {
  const key = optionForm.fieldKey
  const prop = optionForm[key]
  if (prop) {
    const res = new Set()
    if (context.isWaterfall) {
      res.push('正值柱形', '负值柱形', '总计值柱形')
    } else {
      optionForm.data.forEach(val => res.add(val[prop]))
    }
    let seriesList = Array.from(res), changed
    if (context.isStackBar) {
      seriesList = seriesList.reverse()
      changed = !isSame(seriesList, optionForm.seriesList)
      optionForm.seriesList = seriesList
    } else {
      changed = !isSame(seriesList, optionForm.seriesList)
      optionForm.seriesList = seriesList
    }
    return changed
  }
}

export function removeItem (array, item) {
  const index = array.indexOf(item)
  index >= 0 && array.splice(index, 1)
}

export function formatJSON (text, space = 2, extraSpace = 0, identifier = ' ') {
  let deep = 0, res = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    switch (c) {
      case ',':
        res += c + '\n' + identifier.repeat(deep * space + extraSpace)
        break
      case '{':
      case '[':
        deep++
        if (text[i + 1] === '}' || text[i + 1] === ']') {
          res += c
          continue
        }
        res += c + '\n' + identifier.repeat(deep * space + extraSpace)
        break
      case '}':
      case ']':
        deep--
        res += '\n' + identifier.repeat(deep * space + extraSpace) + c
        break
      default:
        res += c
    }
  }
  return res
}

export function getDefaultCommonOption () {
  return {
    id        : 'dasa',
    type      : '',
    multi     : false,
    fields    : [],
    chart     : null,
    seriesList: [],
    fieldKey  : null,

    renderer    : 'canvas',
    theme       : false,
    padding     : [50, 50, 50, 50],
    width       : 750,
    height      : 450,
    title       : {
      visible: true,
      alignTo: 'left',
      text   : '',
      style  : createTextStyle(18, '#000000')
    },
    description : {
      visible: true,
      alignTo: 'left',
      text   : '',
      style  : createTextStyle(12, '#585b62')
    },
    legend      : {
      visible : true,
      position: '',
      flipPage: false,
      offsetX : 0,
      offsetY : 0,
      marker  : {
        visible: true,
        symbol : 'circle',
        style  : {
          r: 3
        }
      },
      title   : {
        visible: true,
        text   : '',
        style  : {
          fontSize  : 12,
          textAlign : 'center',
          fontWeight: 700
        }
      }
    },
    data        : [],
    color       : [''],
    tooltip     : {
      visible       : true,
      shared        : true,
      showCrosshairs: true,
      crosshairs    : {
        type: 'x'
      },
      offset        : 20,
    },
    interactions: [],
  }
}

export function isSame (obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

function createTextStyle (fontSize, fill) {
  return {
    fontSize,
    lineHeight: 20,
    fill,
    fontWeight: 400
  }
}

export function getHTMLCode (option) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${option.type} Chart</title>
    <script src="https://unpkg.com/@antv/g2plot@latest/dist/g2plot.js"></script>
  </head>
  <body>
  <div id="app"></div>
  <script>
    const container = document.getElementById('app');
    const config = ${formatJSON(JSON.stringify(option), 2, 4)}
    const plot = new G2Plot.${option.type}(container, config);
    plot.render();
  </script>
  </body>
</html>
`
}

export function getJSCode (option) {
  return `
import * as G2Plot from '@antv/g2plot'
const container = document.getElementById('app');
const config = ${formatJSON(JSON.stringify(option), 2)}
const plot = new G2Plot.${option.type}(container, config);
plot.render();
  `
}
