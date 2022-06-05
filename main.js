const root = document.querySelector('#root')
const gallery = document.querySelector('#gallery > .gallery-scroller')
const settings = document.querySelector('#settings')

const canva = new Canva({
  width: 160 * 2,
  height: 90 * 2,
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

  canva.crossSize = Number(value)
})

thicknessInput.addEventListener('change', (event) => {
  const value = event.target.value

  canva.thickness = Number(value)
})