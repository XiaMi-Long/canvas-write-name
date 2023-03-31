/*
 * @Author: weiwenyu 2454150875@qq.com
 * @Date: 2023-03-31 15:55:47
 * @LastEditors: weiwenyu 2454150875@qq.com
 * @LastEditTime: 2023-03-31 17:40:40
 * @FilePath: \canvas写字板\canvas-write-name\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
class Write {
    /**
     * canvas 元素dom
     */
    canvasElement;

    /**
     * canvasContext对象
     */
    canvasContext;

    /**
     * canvas背景颜色
     */
    canvasBackgroundColor;
    /**
     * canvas 分辨率比率
     */
    scale = 1;

    /**
     * 每次点击事件时记录下的x坐标
     */
    clickOffsetX = 0;

    /**
     * 每次点击事件时记录下的y坐标
     */
    clickOffsetY = 0;

    /**
     * 画布原始高度
     */
    canvasHeight = 0;

    /**
     * 画布原始宽度
     */
    canvasWidth = 0;

    /**
     * 是否继续监听鼠标事件进行绘制
     */
    #isListenerMoveEvent = false;

    /**
     * 是否是首次点击
     */
    #isFirstClick = 0;

    /**
     * 初始化画布
     * @param {*} canvasElement 画布dom
     * @param {*} context 画布context对象
     * @param {*} canvasBackgroundColor 画布背景颜色
     */
    constructor(canvasElement, context, canvasBackgroundColor = '#f5f5dc') {
        let clickEventName = 'mousedown'
        let moveEventName = 'mousemove'
        let upEventName = 'mouseup'

        this.canvasElement = canvasElement
        this.canvasContext = context
        this.canvasBackgroundColor = canvasBackgroundColor

        this.scale = Write.getDevicePixelRatio()
        this.setCanvasWidth()

        if (Write.isMobile()) {
            clickEventName = 'touchstart'
            moveEventName = 'touchmove'
            clickEventName = 'touchend'
        }

        this.canvasElement.addEventListener(clickEventName, this.addMouseDownEvent.bind(this))
        this.canvasElement.addEventListener(moveEventName, this.addMouseMoveEvent.bind(this))
        this.canvasElement.addEventListener(upEventName, this.addMouseUpEvent.bind(this))
    }

    /**
     * 获取像素大小的比率
     * @returns number
     */
    static getDevicePixelRatio () {
        const scale = window.devicePixelRatio
        return scale || 1
    }

    /**
     * 获取鼠标位置
     * @param {*} event 鼠标事件对象
     * @param {*} scale 画布倍率
     * @returns 
     */
    static getMousePos (event, scale) {
        console.log(event.changedTouches);
        if (Write.isMobile()) {
            return {
                x: parseInt(event.changedTouches[0].screenX * scale, 10),
                y: parseInt(event.changedTouches[0].screenY * scale, 10)
            };
        }

        return {
            x: parseInt(event.offsetX * scale, 10),
            y: parseInt(event.offsetY * scale, 10)
        };
    }

    /**
     * 是否是手机端
     * @returns boolean
     */
    static isMobile () {
        return ('ontouchstart' in document.documentElement);
    }

    /**
     * 设置画布大小
     */
    setCanvasWidth () {
        this.canvasHeight = this.canvasElement.height;
        this.canvasWidth = this.canvasElement.width;
        this.canvasElement.style.width = this.canvasElement.width + 'px';
        this.canvasElement.style.height = this.canvasElement.height + 'px';

        this.canvasElement.width = this.canvasElement.width * this.scale;
        this.canvasElement.height = this.canvasElement.height * this.scale;
    }

    /**
     * 添加鼠标按下事件
     */
    addMouseDownEvent (e) {
        this.canvasContext.beginPath()
        if (this.isFirstClick === 0) {
            this.isFirstClick++
        }
        const { x, y } = Write.getMousePos(e, this.scale)
        this.clickOffsetX = x
        this.clickOffsetY = y
        this.isListenerMoveEvent = true
    }

    /**
     * 添加鼠标在布上移动事件
     */
    addMouseMoveEvent (e) {
        if (this.isListenerMoveEvent) {
            this.draw(e)
        }
    }

    /**
     * 添加鼠标松开事件
     */
    addMouseUpEvent () {
        this.isListenerMoveEvent = false
        this.canvasContext.closePath()

        this.canvasContext.save()
    }


    /**
     * 画
     * @param {*} event 鼠标事件对象
     */
    draw (event) {
        const { x, y } = Write.getMousePos(event, this.scale)
        this.canvasContext.lineWidth = 1

        if (this.isFirstClick === 1) {
            this.isFirstClick = 0
            this.canvasContext.moveTo(this.clickOffsetX, this.clickOffsetY)
        }
        this.canvasContext.lineTo(x, y)
        this.canvasContext.moveTo(x, y)
        this.canvasContext.stroke()
    }

    /**
     * 清空画布
     */
    clear () {
        this.canvasContext.fillStyle = this.canvasBackgroundColor
        this.canvasContext.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height)
    }

    /**
     * 导出为图片
     */
    export () {
        const url = this.canvasElement.toDataURL()
        const el = document.createElement('a');
        el.href = url
        el.download = '签名';
        const event = new MouseEvent('click');
        el.dispatchEvent(event);
    }

}