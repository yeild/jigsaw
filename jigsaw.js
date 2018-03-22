(function (window) {
  const l = 42, // 滑块边长
    r = 10, // 滑块半径
    w = 310, // canvas宽度
    h = 155, // canvas高度
    PI = Math.PI
  const L = l + r * 2 // 滑块实际边长

  function getRandomNumberByRange(start, end) {
    return Math.round(Math.random() * (end - start) + start)
  }

  function setAttribute(target) {
  }

  function createCanvas(width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }

  function createImg(onload) {
    const img = document.createElement('img')
    img.onload = onload
    img.src = getRandomImg()
    return img
  }

  function getRandomImg() {
    return 'img.jpg'
  }
  function setStyle(el, style) {
    Object.assign(el.style, style)
  }

  function draw(ctx, operation, x, y) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + l / 2, y)
    ctx.arc(x + l / 2, y - r + 2, r, 0, 2 * PI)
    ctx.lineTo(x + l / 2, y)
    ctx.lineTo(x + l, y)
    ctx.lineTo(x + l, y + l / 2)
    ctx.arc(x + l + r - 2, y + l / 2, r, 0, 2 * PI)
    ctx.lineTo(x + l, y + l / 2)
    ctx.lineTo(x + l, y + l)
    ctx.lineTo(x, y + l)
    ctx.lineTo(x, y)
    ctx[operation]()
    ctx.beginPath()
    ctx.arc(x, y + l / 2, r, 1.5 * PI, 0.5 * PI)
    ctx.globalCompositeOperation = "xor"
    ctx.fill()
  }

  class jigsaw {

    init(element) {
      this.initDOM(element)
      this.initImg()
      this.draw()
      this.renderStyle()
    }

    initDOM(el) {
      const canvas = createCanvas(w, h) // 画布
      const block = canvas.cloneNode(true) // 滑块
      const barContainer = document.createElement('div')
      const barMask = document.createElement('div')
      const slider = document.createElement('div')
      slider.innerHTML = '→'
      const text = document.createElement('span')
      text.innerHTML = '向右滑动滑块填充拼图'

      el.appendChild(canvas)
      el.appendChild(block)
      barMask.appendChild(slider)
      barContainer.appendChild(barMask)
      barContainer.appendChild(text)
      el.appendChild(barContainer)

      Object.assign(this, {
        el,
        canvas,
        block,
        barContainer,
        barMask,
        slider,
        text,
        canvasCtx: canvas.getContext('2d'),
        blockCtx: block.getContext('2d')
      })

    }

    initImg() {
      const img = createImg(() => {
        this.canvasCtx.drawImage(img, 0, 0, w, h)
        this.blockCtx.drawImage(img, 0, 0, w, h)
        const y = this.y - r * 2 + 2
        const ImageData = this.blockCtx.getImageData(this.x, y, L, L)
        this.block.width = L
        this.blockCtx.putImageData(ImageData, 0, y)
      })
    }

    draw() {
      // 随机创建滑块的位置
      this.x = getRandomNumberByRange(L + 10, w - (L + 10))
      this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10))
      draw(this.canvasCtx, 'fill', this.x, this.y)
      draw(this.blockCtx, 'clip', this.x, this.y)
    }

    renderStyle() {
      this.el.style.position = 'relative'
      setStyle(this.block, {
        position: 'absolute',
        left: 0,
        top: 0
      })
      Object.assign(this.block.style, {
        position: 'absolute',
        left: 0,
        top: 0
      })
    }
  }
  window.jigsaw = {
    init: function (el) {
      new jigsaw().init(el)
    }
  }
}(window))