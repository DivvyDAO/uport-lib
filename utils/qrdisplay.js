import qrImage from 'qr-image'

function QRDisplay () {}

QRDisplay.prototype.openQr = function (data) {
  var uportQR = this.getUportQRDisplay()
  uportQR.style.display = 'block'

  var pngBuffer = qrImage.imageSync(data, {type: 'png'})
  var dataUri = 'data:image/png;charset=utf-8;base64, ' + pngBuffer.toString('base64')
  var qrImg = uportQR.children[0].children[0]
  qrImg.setAttribute('src', dataUri)
}

QRDisplay.prototype.closeQr = function () {
  var uportQR = this.getUportQRDisplay()
  uportQR.style.display = 'none'
}

QRDisplay.prototype.getUportQRDisplay = function () {
  let bg = document.getElementById('uport-qr')
  if (bg) return bg

  bg = document.createElement('div')
  bg.setAttribute('id', 'uport-qr')
  bg.setAttribute('style', 'position:fixed;top: 0;width:100%;height:100%;z-index:100;background-color:rgba(0,0,0,0.5);text-align:center;')

  var box = document.createElement('div')
  box.setAttribute('style', 'position:relative;top:50%;display:inline-block;z-index:101;background:#fff;transform:translateY(-50%);margin:0 auto;padding:20px')

  var text = document.createElement('p')
  text.innerHTML = 'Please scan with uport app'

  var qrImg = document.createElement('img')
  qrImg.setAttribute('style', 'z-index:102;')

  box.appendChild(qrImg)
  box.appendChild(text)
  bg.appendChild(box)
  document.body.appendChild(bg)
  return bg
}

export default QRDisplay
