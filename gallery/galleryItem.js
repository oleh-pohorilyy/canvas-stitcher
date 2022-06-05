const galleryItem = (options) => {

  const container = document.createElement('div')
  container.className = 'gallery-item'

  const name = document.createElement('span')
  name.textContent = options.image.name
  name.className = 'gallery-item__name'
  const image = document.createElement('img')
  image.className = 'gallery-item__img'

  const fr = new FileReader();
  fr.onload = function () {
    image.src = fr.result;
  }
  fr.readAsDataURL(options.image);

  container.onclick = options.onclick

  container.append(image, name)

  return container
}