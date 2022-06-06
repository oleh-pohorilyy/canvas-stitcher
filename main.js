const root = document.querySelector('#root')
const gallery = document.querySelector('#gallery > .gallery-scroller')
const settings = document.querySelector('#settings')

const CANVA_SIZE = {
  width: 160,
  heigh: 90
}

const canva = new Canva({
  width: CANVA_SIZE.width,
  height: CANVA_SIZE.height,
  crossSize: 5,
  thickness: 4,
  padding: 1,
  root: document.getElementById('root')
})

const resourceManager = new ResourceManager()

resourceManager.subscribe((all) => {
  const elements = all.map((image) => {
    return galleryItem({ 
      image, 
      onclick: (event) => {
        if(event.target.classList.contains('selected')) return
        gallery.querySelector('.selected')?.classList.remove('selected')
        event.target.classList.add('selected')

        bitmapFromImage(image).then(canva.draw.bind(canva))
      } 
    })
  })

  gallery.innerHTML = ''
  gallery.append(...elements)
})

const fileInput = document.getElementById('file-input')
const crossPaddingInput = document.getElementById('cross-padding-input')
const crossSizeInput = document.getElementById('cross-size-input')
const thicknessInput = document.getElementById('thickness-input')

crossPaddingInput.value = canva._padding
crossSizeInput.value = canva._crossSize
thicknessInput.value = canva._thickness

fileInput.addEventListener('change', (event) => {
  for(const file of event.target.files) {
    resourceManager.add(file.name, file)
  }
})

crossPaddingInput.addEventListener('change', (event) => {
  const value = event.target.value

  canva.padding = Number(value)
})

crossSizeInput.addEventListener('change', (event) => {
  const value = event.target.value

  const prevSize = {
    width: canva.width,
    height: canva.height
  }

  canva.crossSize = Number(value)
  canva.x -= (canva.width - prevSize.width) / 2
  canva.y -= (canva.height - prevSize.height) / 2
})

thicknessInput.addEventListener('change', (event) => {
  const value = event.target.value

  canva.thickness = Number(value)
})

canva.canvas.addEventListener('wheel', (event) => {
  const layer = {
    x: event.pageX - canva.x,
    y: event.pageY - canva.y
  }

  const prevSize = {
    width: canva.width,
    height: canva.height
  }

  const sign = Math.sign(event.deltaX || event.deltaY)
  const value = canva.crossSize > 50 ? canva.crossSize - sign * 5 : sign < 1 ? Math.pow(canva.crossSize, 1.05) : Math.pow(canva.crossSize, 0.95)

  canva.crossSize = Math.max(1, value)
  canva.x = event.pageX - (canva.width / prevSize.width) * layer.x
  canva.y = event.pageY - (canva.height / prevSize.height) * layer.y
  // canva.y = 
})

root.addEventListener('mousedown', (event) => {
  const layer = {
    x: event.pageX - canva.x,
    y: event.pageY - canva.y
  }

  const moveHandler = (event) => {
    canva.x = event.pageX - layer.x
    canva.y = event.pageY - layer.y
  }

  const upHandler = (event) => {
    document.removeEventListener('mousemove', moveHandler)
    document.removeEventListener('mouseup', upHandler)
  }

  document.addEventListener('mousemove', moveHandler)
  document.addEventListener('mouseup', upHandler)
})