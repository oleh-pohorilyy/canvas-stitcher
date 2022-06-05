class Canva {

	_width
	get width() {
		return this._width
	}

	_height
	get height() {
		return this._height
	}

  _canvaWidth
	get canvaWidth() {
		return this._canvaWidth
	}

  _canvaHeight
	get canvaHeight() {
		return this._canvaHeight
	}

  _crossSize
  get crossSize() {
    return this._crossSize
  }
  set crossSize(value) {
    this._crossSize = value
    this._width = Math.floor(this._canvaWidth * value)
    this._height = Math.floor(this._canvaHeight * value)
    this.invalidate()
  }

  _padding
  get padding() {
    return this._padding
  }
  set padding(value) {
    this._padding = value
    this.invalidate()
  }

  _thickness
  get thickness() {
    return this._thickness
  }
  set thickness(value) {
    this._thickness = value
    this.invalidate()
  }

  _canvas
  get canvas() {
    return this._canvas
  }

  _root
  get root() {
    return this._root
  }

  _canvaData
  get canvaData() {
    return this._canvaData
  }

	constructor(options) {
    this._root = options.root
		this._canvaWidth = options.width ?? 100
		this._canvaHeight = options.height ?? 100
		this._crossSize = options.crossSize ?? 1
    this._thickness = options.thickness ?? 2
    this._padding = options.padding ?? 1
    this._width = Math.floor(this._canvaWidth * this._crossSize)
    this._height = Math.floor(this._canvaHeight * this._crossSize)
    this._offset = { 
      x: Math.floor(this._root.clientWidth / 2 - this._width / 2), 
      y: Math.floor(this._root.clientHeight / 2 - this._height / 2) 
    }

    this._canvas = document.createElement('canvas')
    this._canvas.style.display = 'block'
    this._canvas.style.position = 'absolute'
    this._canvas.style.top = this._offset.y + 'px'
    this._canvas.style.left = this._offset.x + 'px'
    this._canvas.width = this._width
    this._canvas.height = this._height
    this._root.appendChild(this._canvas)
	}

  invalidate() {
    const context = this._canvas.getContext('2d')

    context.clearRect(0, 0, this._canvas.width, this._canvas.height)

    context.lineWidth = this._thickness
    context.fillStyle = 'white'
    context.fillRect(0, 0, this._canvas.width, this._canvas.height)

    for(let y = 0; y < this._canvaData.length; y++) {
      for(let x = 0; x < this._canvaData[y].length; x++) {
        const color = this._canvaData[y][x]
        if(!color) continue
  
        context.strokeStyle = color
  
        const x1 = x * this._crossSize
        const y1 = y * this._crossSize
  
        context.beginPath()
  
        context.moveTo(x1 + this._padding, y1 + this._padding)
        context.lineTo(x1 + this._crossSize - this._padding, y1 + this._crossSize - this._padding)
        context.moveTo(x1 + this._crossSize - this._padding, y1 + this._padding)
        context.lineTo(x1 + this._padding, y1 + this._crossSize - this._padding)
        context.stroke()
      }
    }
  }

  _getImageData(image) {
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    tempCanvas.width = image.width
    tempCanvas.height = image.height
    tempCtx.drawImage(image, 0, 0)
    return tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
  }

  _recalculate(buffer) {
    this.draw(buffer)
  }

	draw(image) {
    const imageData = this._getImageData(image)
    this._canvaData = Array.from({length: imageData.height}, _ => Array(imageData.width).fill(''))

		let skip = 0

		if(imageData.width > this._canvaWidth) {
			skip = imageData.width / this._canvaWidth
		}

		if(imageData.height > this._canvaHeight) {
			skip = Math.max(skip, imageData.height / this._canvaHeight)
		}

		for(let y = 0; y < imageData.height / skip; y++) {
			for(let x = 0; x < imageData.width / skip; x++) {
				const idx = Math.floor(y*skip) * imageData.width + Math.floor(x * skip)

				const i = idx * 4
				const r = imageData.data[i]
				const g = imageData.data[i + 1]
				const b = imageData.data[i + 2]
				const a = imageData.data[i + 3]

				this.canvaData[y][x] = `rgba(${r}, ${g}, ${b}, ${a})`
			}
		}

    this.invalidate()
	}
}