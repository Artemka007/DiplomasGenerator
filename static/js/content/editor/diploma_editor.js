class DiplomaEditor {
    /**
     * @param {string} container html-элемент, в котором находится редактор диплома
     */
    constructor(container) {
        this.container = $(container)
        this.diploma = window.history.state.selectedTemplate

        this.containerX = 0
        this.containerY = 0

        /**
         * Нижняя координата по оси x
         * @type {number}
         */
        this.x1 = window.history.state.x1

        /**
         * Верхняя координата по оси x
         * @type {number}
         */
        this.x2 = window.history.state.x2

        /**
         * Нижняя координата по оси y
         * @type {number}
         */
        this.y1 = window.history.state.y1

        /**
         * Верхняя координата по оси y
         * @type {number}
         */
        this.y2 = window.history.state.y2

        /**
         * Координаты по оси x посередине между двумя крайними точкам по оси x
         * @type {number}
         */
        this.resultX = window.history.state.resultX

        this.data = {...window.history.state }

        this.hd = new HistoryDirections(this.data, "", () => { this.setData() })

        // координаты мыши
        this.currentX = 0
        this.currentY = 0

        this.isSelectingPlace = false
        this.selectedPlaceIsMoving = false
        this.isResizeSelectedPlace = false
    }

    init() {
        $('[data-action="to_upload"]').remove()
        this.hd.init()

        this.hd.setEventListeners()
        $('[data-action="main"]').append(this.container)
        this.container.html(this.container.html() + `<img src="${this.diploma.url}" alt=""/>`)

        this.managePanel = new DiplomaEditorManagePanel(mP, this.container, () => { this.rerenderSelectedPlace() })
        this.managePanel.init()

        this.container.css({ 'margin-top': '250px' })
        this.container.find('img').on('load', e => {
            this.containerX = this.container[0].offsetLeft
            this.containerY = this.container[0].offsetTop - window.scrollY
        })

        this.x1 && this.x2 && this.renderSelectedPlace()

        if (!this.getSelectedPlace() || !this.managePanel.data.file) {
            $('[data-type="next"]').prop('disabled', true)
        } else {
            $('[data-type="next"]').prop('disabled', false)
        }
    }

    setEventListeners() {
        this.container.on('mousedown', e => {
            this.overrideEventListener(e)
            this.isSelectingPlace = true
            if (!this.checkSelectedPlace()) {
                this.setCoordinates(e.clientX, e.clientX, e.clientY + window.scrollY, e.clientY + window.scrollY)
                this.renderSelectedPlace()
            } else if (!this.isResizeSelectedPlace) {
                this.setCoordinates(this.x1, e.clientX, this.y1, e.clientY + window.scrollY)
                this.rerenderSelectedPlace()
            }
        })

        this.container.on('mouseup', () => {
            this.isSelectingPlace = false
            this.isResizeSelectedPlace = false
        })

        this.container.on('mousemove', e => {
            if (this.isSelectingPlace && !this.isResizeSelectedPlace && !this.selectedPlaceIsMoving) {
                this.overrideEventListener(e)
                this.setCoordinates(this.x1, e.clientX, this.y1, e.clientY + window.scrollY)
            }
        })
    }

    renderSelectedPlace() {
        let selectedStyle = this.managePanel.selectedStyle

        let fWeight = ""
        let fStyle = ""
        let fSize = (this.managePanel.selectedSize || "24") + 'px'
        let foregound = this.managePanel.selectedColor

        switch (selectedStyle) {
            case "italic":
                {
                    fStyle = "italic"
                    break
                }
            case "bold":
                {
                    fWeight = "bold"
                    break
                }
            case "bolditalic":
                {
                    fWeight = "bold"
                    fStyle = "italic"
                    break
                }
        }

        let el = `
        <div data-action="resize-container"
            style='
                position: absolute; 
                display: flex; 
                flex-direction: row;
                justify-content: center;
                color: ${foregound};
                font-size: ${fSize};
                font-style: ${fStyle};
                font-weight: ${fWeight};
                font-family: "Arial", sans-serif;
                border: rgb(8,30,170) dashed 2px; 
                width: ${this.x2 > this.x1 ? this.x2 - this.x1 + 'px' : this.x1 - this.x2 + 'px'}; 
                height: ${this.y2 > this.y1 ? this.y2 - this.y1 + 'px' : this.y1 - this.y2 + 'px'};
                top: ${this.y1 < this.y2 ? this.y1 - this.containerY + 'px' : this.y2 - this.containerY + 'px'};
                left: ${this.x1 < this.x2 ? this.x1 - this.containerX + 'px' : this.x2 - this.containerX + 'px'};
                cursor: ${!this.selectedPlaceIsMoving ? 'grab !important' : 'grabbing !important'}
            '
        >
            <div data-action="name-container">Иван Иванов</div>
        </div>`

        let resizeHelpers = [
            `<span class="resize_helper" data-id="1" style="top: ${this.y1 - this.containerY - 2 + 'px'};left: ${this.x1 - this.containerX - 4 + 'px'};"></span>`,
            `<span class="resize_helper" data-id="2" style="top: ${this.y1 - this.containerY - 2 + 'px'};left: ${this.x2 - this.containerX - 4 + 'px'};"></span>`,
            `<span class="resize_helper" data-id="3" style="top: ${this.y2 - this.containerY - 2 + 'px'};left: ${this.x2 - this.containerX - 4 + 'px'};"></span>`,
            `<span class="resize_helper" data-id="4" style="top: ${this.y2 - this.containerY - 2 + 'px'};left: ${this.x1 - this.containerX - 4 + 'px'};"></span>`,
        ]

        this.container.html(this.container.html() + el)

        for (let i = 0; i < resizeHelpers.length; i++) this.container.html(this.container.html() + resizeHelpers[i])

        this.container.find('span').on('mousedown', e => {
            this.overrideEventListener(e)
            this.isResizeSelectedPlace = true
        })

        this.container.find('span').on('mousemove', e => {
            if (this.isResizeSelectedPlace && !this.isSelectingPlace && !this.selectedPlaceIsMoving) {
                this.overrideEventListener(e)
                let $this = $(e.currentTarget)
                if ($this.attr('data-id').toString() === '1') {
                    this.setCoordinates(e.clientX, this.x2, e.clientY + window.scrollY, this.y2)
                } else if ($this.attr('data-id').toString() === '2') {
                    this.setCoordinates(this.x1, e.clientX, e.clientY + window.scrollY, this.y2)
                } else if ($this.attr('data-id').toString() === '3') {
                    this.setCoordinates(this.x1, e.clientX, this.y1, e.clientY + window.scrollY)
                } else if ($this.attr('data-id').toString() === '4') {
                    this.setCoordinates(e.clientX, this.x2, this.y1, e.clientY + window.scrollY)
                }
            }
        })

        this.container.find('span').on('mouseup', e => {
            this.overrideEventListener(e)
            this.isResizeSelectedPlace = false
            this.isSelectingPlace = false
        })

        this.setSelectedPlaceActionListeners()

        this.managePanel.rerender = () => {
            this.container.find('div').remove()
            this.container.find('span').remove()

            this.renderSelectedPlace()
        }

        this.resultX = this.x1 + ($('[data-action="resize-container"]').width() - $('[data-action="name-container"]').width()) / 2
    }

    getSelectedPlace() {
        return this.container.find('div')[0]
    }

    removeSelectedPlace() {
        this.container.find('div').remove()
        this.container.find('span').remove()
    }

    checkSelectedPlace() {
        return !!this.container.find('aside')[0]
    }

    rerenderSelectedPlace() {
        this.removeSelectedPlace()
        this.renderSelectedPlace()

        if (!this.getSelectedPlace() || !this.managePanel.data.file) {
            $('[data-type="next"]').prop('disabled', true)
        } else {
            $('[data-type="next"]').prop('disabled', false)
        }
    }

    /**
     * Функция отрисовывает выделенное поле по 4 координатам
     * @param {number} x1 
     * @param {number} x2 
     * @param {number} y1 
     * @param {number} y2 
     */
    setCoordinates(x1, x2, y1, y2) {
        this.x1 = x1
        this.x2 = x2
        this.y1 = y1
        this.y2 = y2

        this.rerenderSelectedPlace()
    }

    setSelectedPlaceActionListeners() {
        let s = $(this.getSelectedPlace())

        document.addEventListener('keydown', e => {
            if (e.code === 'Delete') this.removeSelectedPlace()
        })

        s.on('mousedown', e => {
            this.overrideEventListener(e)
            this.selectedPlaceIsMoving = true

            this.currentX = e.clientX
            this.currentY = e.clientY
        })

        s.on('mousemove', e => {
            if (this.selectedPlaceIsMoving && !this.isSelectingPlace) {
                this.overrideEventListener(e)

                let x = this.currentX,
                    y = this.currentY

                this.x1 += e.clientX - x
                this.x2 += e.clientX - x
                this.y1 += e.clientY - y
                this.y2 += e.clientY - y

                this.rerenderSelectedPlace()

                this.currentX = e.clientX
                this.currentY = e.clientY
            }
        })

        s.on('mouseup', () => {
            this.selectedPlaceIsMoving = false
            this.rerenderSelectedPlace()
        })
    }

    setData() {
        this.data = {
            selectedTemplate: window.history.state.selectedTemplate,
            x1: this.x1 - this.containerX,
            x2: this.x2 - this.containerX,
            resultX: this.resultX - this.containerX,
            y1: this.y1 - this.containerY,
            y2: this.y2 - this.containerY,
            names: window.history.state.names,
            ...this.managePanel.data,
        }

        this.hd.setData(this.data)
    }

    overrideEventListener(e) {
        e.preventDefault()
        e.stopPropagation()
    }
}

class DiplomaEditorManagePanel {
    constructor(container, mainContainer) {
        this.container = container
        this.mainContainer = mainContainer

        this.fontParams = {
            family: [],
            style: ['auto', 'italic', 'bold', 'bolditalic'],
        }

        this.fontColorParam = $('[data-param="fontColor"]')
        this.fontSizeParam = $('[data-param="fontSize"]')
        this.fontStyleParam = $('[data-param="fontStyle"]')

        this.selectedColor = window.history.state.selectedColor
        this.selectedSize = window.history.state.selectedSize
        this.selectedStyle = window.history.state.selectedStyle
        this.selectedTemplate = window.history.state.selectedTemplate

        this.file = null

        this.data = {
            selectedColor: this.selectedColor,
            selectedSize: this.selectedSize,
            selectedStyle: this.selectedStyle,
            selectedTemplate: window.history.state.selectedTemplate,
            file: this.file,
        }
    }

    init() {
        this.setData()

        $('[data-action="main"]').append(this.container)
        this.container = $('[data-action="main"]').find('[data-action="editor_panel"]')

        this.fontColorParam = $('[data-param="fontColor"]')
        this.fontSizeParam = $('[data-param="fontSize"]')
        this.fontStyleParam = $('[data-param="fontStyle"]')

        this.fontSizeParam.val(this.selectedSize || 24)
        this.fontColorParam.val(this.selectedColor || "#000000")

        let fp = this.fontParams
        for (let i = 0; i < fp.style.length; i++) {
            this.fontStyleParam.html(`${this.fontStyleParam.html()}<option value="${fp.style[i]}">${fp.style[i]}</option>`)
        }

        let cP = $(`option[value=${this.selectedStyle || null}]`)
        cP.prop('selected', true)

        this.container.css({ width: this.mainContainer[0].clientWidth + 'px' })
        this.setActionListeners()
    }

    setActionListeners() {
        this.fontColorParam.on('change', e => {
            this.overrideEventListener(e)
            this.selectedColor = $(e.currentTarget).val()
            this.setEventData()
        })

        this.fontSizeParam.on('change', e => {
            this.overrideEventListener(e)
            this.selectedSize = e.currentTarget.value
            this.setEventData()
        })

        this.fontStyleParam.on('change', e => {
            this.overrideEventListener(e)
            this.selectedStyle = e.currentTarget.value
            this.setEventData()
        })

        $('[data-action="chooseFile"]').on('click', e => {
            $('[data-action="fileInput"]').click()
        })

        $('[data-action="fileInput"]').on('change', e => {
            this.fd = new FormData()
            let f = e.currentTarget.files
            this.file = f[0]
            this.setData()
            $('[data-action="chooseFile"]').html(f[0].name)
        })
    }

    setEventData() {
        this.setData()
        this.rerender()
    }

    setData() {
        this.data = {
            selectedColor: this.selectedColor,
            selectedSize: this.selectedSize,
            selectedStyle: this.selectedStyle,
            selectedTemplate: this.selectedTemplate,
            file: this.file,
        }
    }

    overrideEventListener(e) {
        e.stopPropagation()
        e.preventDefault()
    }
}

const mP = `
    <section data-action="editor_panel" class="editor_panel" style="display: flex; flex-direction: row; z-index: 1000;">
        <div class="editor_panel__params">
            <label style="margin-bottom: 5px;">Параметры текста</label>
            <input class="editor_panel__params__item" style="width: 100%;" type="number" step="2" min="8" max="92"
                   value="24" data-param="fontSize">
            <input class="editor_panel__params__item" style="width: 100%;" type="color" data-param="fontColor">
            <select class="editor_panel__params__item" style="width: 100%;" data-param="fontStyle">
                <option value>Стиль шрифта</option>
            </select>
        </div>
        <div class="editor_panel__params">
            <label style="margin-bottom: 5px; align-items: center">Excel файл</label>
            <input data-action="fileInput" class="editor_panel__params__item" style="width: 130px; display: none;" type="file" value="16" data-param="excelFile">
            <button data-action="chooseFile" class="btn_default">Загрузить</button>
        </div>
    </section>
`