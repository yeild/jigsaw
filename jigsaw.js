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

  function createCanvas(width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }

  function createImg(onload) {
    const img = document.createElement('img')
    img.crossOrigin = "Anonymous"
    img.onload = onload
    img.onerror = () => {
      img.src = getRandomImg()
    }
    img.src = getRandomImg()
    return img
  }

  function getRandomImg() {
    return 'https://picsum.photos/300/150/?image=' + getRandomNumberByRange(0, 1084)
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
    ctx.fillStyle = '#fff'
    ctx[operation]()
    ctx.beginPath()
    ctx.arc(x, y + l / 2, r, 1.5 * PI, 0.5 * PI)
    ctx.globalCompositeOperation = "xor"
    ctx.fill()
  }

  function sum(x, y) {
    return x + y
  }

  function square(x) {
    return x * x
  }

  class jigsaw {
    constructor(el, success, fail) {
      this.el = el
      this.success = success
      this.fail = fail
    }

    init() {
      this.initDOM()
      this.initImg()
      this.draw()
      this.renderStyle()
      this.bindEvents()
    }

    initDOM() {
      const canvas = createCanvas(w, h) // 画布
      const block = canvas.cloneNode(true) // 滑块
      const barContainer = document.createElement('div')
      const barMask = document.createElement('div')
      const slider = document.createElement('div')
      slider.innerHTML = '→'
      const text = document.createElement('span')
      text.innerHTML = '向右滑动滑块填充拼图'

      const el = this.el
      el.appendChild(canvas)
      el.appendChild(block)
      barMask.appendChild(slider)
      barContainer.appendChild(barMask)
      barContainer.appendChild(text)
      el.appendChild(barContainer)

      Object.assign(this, {
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
      const img = createImg((e) => {
        this.canvasCtx.drawImage(img, 0, 0, w, h)
        this.blockCtx.drawImage(img, 0, 0, w, h)
        const y = this.y - r * 2 + 2
        const ImageData = this.blockCtx.getImageData(this.x, y, L, L)
        this.block.width = L
        this.blockCtx.putImageData(ImageData, 0, y)
      })
      this.img = img
    }

    draw() {
      // 随机创建滑块的位置
      this.x = getRandomNumberByRange(L + 10, w - (L + 10))
      this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10))
      draw(this.canvasCtx, 'fill', this.x, this.y)
      draw(this.blockCtx, 'clip', this.x, this.y)
    }

    clean() {
      this.canvasCtx.clearRect(0, 0, w, h)
      this.blockCtx.clearRect(0, 0, w, h)
      this.block.width = w
    }

    renderStyle() {
      setStyle(this.block, {
        position: 'absolute',
        left: 0,
        top: 0
      })
      setStyle(this.barContainer, {
        position: 'relative',
        textAlign: 'center',
        width: '310px',
        height: '40px',
        lineHeight: '40px',
        marginTop: '15px',
        background: '#f7f9fa',
        color: '#45494c',
        border: '1px solid #e4e7eb'
      })
      setStyle(this.slider, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '40px',
        height: '40px',
        background: '#fff',
        boxShadow: '0 0 3px rgba(0,0,0,.3)',
        cursor: 'pointer',
        transition: 'background .2s linear'
      })
    }

    bindEvents() {
      this.el.onselectstart = () => false

      let originX, originY, trail = [], isMouseDown = false
      this.slider.addEventListener('mousedown', function (e) {
        originX = e.x, originY = e.y
        isMouseDown = true
      })
      document.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return false
        const moveX = e.x - originX
        const moveY = e.y - originY
        if (moveX < 0 || moveX + 38 >= w) return false
        this.slider.style.left = moveX + 'px'
        var blockLeft = (w - 40 - 20) / (w - 40) * moveX
        this.block.style.left = blockLeft + 'px'
        this.text.setAttribute('hidden', 'hidden')
        trail.push(moveY)
      })
      document.addEventListener('mouseup', (e) => {
        if (!isMouseDown) return false
        isMouseDown = false
        if (e.x == originX) return false

        this.trail = trail
        const {spliced, TuringTest} = this.verify()
        if (spliced) {
          if (TuringTest) {
            this.slider.innerHTML = '√'
            this.success && this.success()
          } else {
            this.slider.innerHTML = '?'
            this.text.innerHTML = '再试一次'
            this.reset()
          }
        } else {
          this.slider.innerHTML = 'x'
          this.fail && this.fail()
          this.reset()
        }
      })
    }

    verify() {
      const arr = this.trail // 拖动时y轴的移动距离
      const average = arr.reduce(sum) / arr.length // 平均值
      const deviations = arr.map(x => x - average) // 偏差数组
      const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length) // 标准差
      const left = parseInt(this.block.style.left)
      return {
        spliced: Math.abs(left - this.x) < 10,
        TuringTest: average !== stddev, // 只是简单的验证拖动轨迹，相等时一般为0，表示可能非人为操作
      }
    }

    reset() {
      setTimeout(() => {
        this.slider.innerHTML = '→'
        this.text.removeAttribute('hidden')
        this.slider.style.left = 0
        this.block.style.left = 0
        this.clean()
        this.img.src = getRandomImg()
        this.draw()
      }, 1000)
    }

  }

  window.jigsaw = {
    init: function (element, success, fail) {
      new jigsaw(element, success, fail).init()
    }
  }
}(window))