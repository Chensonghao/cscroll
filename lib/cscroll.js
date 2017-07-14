;(function() {
	'use strict'
	/*
  @param {Object} [options={}]
  */
	function CScroll(options) {
		this.el = document.querySelector(options.el)
		this.elastic = !!options.elastic
		if (!this.el) return
		document.body.addEventListener(
			'touchmove',
			function(e) {
				e.preventDefault()
			},
			{
				capture: false,
				passive: false,
				once: false
			}
		)
		this._init()
	}
	CScroll.prototype = {
		_init: function() {
			var el = this.el
			var elastic = this.elastic
			var elastic
			var elParent = el.parentNode
			elParent.style.overflow = 'hidden'
			var containerHeight = elParent.offsetHeight
			var maxTranslate = 0
			var translateY = 0
			var lastY = 0
			var isOver = false
			var st = 0
			var speed = 0
			var direction = 'up'
			var timer = null
			var touchstart = function(e) {
				e.preventDefault()
				clearTimeout(timer)
				var newTS = this._getTranslateY(el)
				newTS && (translateY = newTS)
				lastY = e.targetTouches[0].pageY
				maxTranslate = el.offsetHeight - containerHeight + 10
				st = new Date() * 1
			}.bind(this)
			var touchmove = function(e) {
				e.preventDefault()
				var currentY = e.targetTouches[0].pageY
				var offsetY = currentY - lastY
				var newTans = translateY + offsetY
				direction = offsetY > 0 ? 'down' : 'up'
				el.style.transitionTimingFunction = 'cubic-bezier(0.23, 1, 0.32, 1)'
				el.style.transitionDuration = '0ms'
				if (newTans <= 0 && Math.abs(newTans) <= maxTranslate) {
					translateY = newTans
					speed = offsetY / (new Date() * 1 - st)
					isOver = false
					st = new Date()
					el.style.transform = 'translate3d(0,' + translateY + 'px,0)'
				} else if (elastic) {
					var asd = translateY + offsetY / 3.5
					if (asd > 0 || asd < maxTranslate) {
						isOver = true
						translateY = asd
					} else {
						translateY = newTans
					}
					el.style.transform = 'translate3d(0,' + translateY + 'px,0)'
				}
				lastY = currentY
			}
			var touchend = function(e) {
				e.preventDefault()
				var huitan = function() {
					isOver = false
					el.style.transitionDuration = '600ms'
					translateY = translateY > 0 ? 0 : -maxTranslate
					el.style.transitionTimingFunction =
						'cubic-bezier(0.165, 0.84, 0.44, 1)'
					el.style.transform = 'translate3d(0,' + translateY + 'px,0)'
				}
				if (isOver) {
					huitan()
				} else {
					var ay = speed * 400
					var fz = 0
					if (direction === 'up') {
						fz = Math.abs(ay) - maxTranslate + Math.abs(translateY)
					} else {
						fz = Math.abs(ay) - Math.abs(translateY)
					}
					// 到达边界
					if (fz > 0) {
						if (elastic && fz > Math.abs(ay) / 4) {
							// 有回弹效果
							el.style.transitionDuration = '800ms'
							el.style.transitionTimingFunction = 'esae-out'
							fz = fz / 2 > 130 ? 130 : fz / 2
							if (direction === 'up') {
								translateY = -fz - maxTranslate
							} else {
								translateY = fz
							}
							timer = setTimeout(huitan, 300)
						} else {
							translateY = direction === 'down' ? 0 : -maxTranslate
							el.style.transitionDuration = '800ms'
							el.style.transitionTimingFunction = 'esae-out'
						}
					} else {
						el.style.transitionDuration = '2000ms'
						translateY += ay
					}
					el.style.transform = 'translate3d(0,' + translateY + 'px,0)'
				}
			}
			el.addEventListener('touchstart', touchstart)
			el.addEventListener('touchmove', touchmove)
			el.addEventListener('touchend', touchend)
		},
		_getTranslateY: function(elem) {
			var view = elem.ownerDocument.defaultView
			if (!view || !view.opener) {
				view = window
			}
			var transf = view.getComputedStyle(elem)['transform']
			if (/^matrix/.test(transf)) {
				var vals = transf.split(',')
				var newTans = vals.pop().replace(')', '')
				return parseFloat(newTans)
			}
			return ''
		}
	}
	CScroll.attach = function(opts) {
		return new CScroll(opts)
	}
	if (
		typeof define === 'function' &&
		typeof define.amd === 'object' &&
		define.amd
	) {
		define(function() {
			return CScroll
		})
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = CScroll.attach
		module.exports.CScroll = CScroll
	} else {
		window.CScroll = CScroll
	}
})()
