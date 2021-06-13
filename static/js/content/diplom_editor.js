class DiplomaEditor {
    constructor(container) {
        // containers and image src
        this.container = $(container)
        this.diploma = window.history.state.selectedTemplate

        // container coordinates
        this.containerX = 0
        this.containerY = 0

        // selected place coordinates
        this.x1 = window.history.state.x1
        this.x2 = window.history.state.x2
        this.y1 = window.history.state.y1
        this.y2 = window.history.state.y2
        this.resultX = window.history.state.resultX

        this.data = {
            x1: window.history.state.x1,
            x2: window.history.state.x2,
            y1: window.history.state.y1,
            y2: window.history.state.y2,
            resultX: window.history.state.resultX,

        }

        this.hd = new HistoryDirections(this.data)

        // coordinates for move selected place
        this.currentX = 0
        this.currentY = 0

        // any flags
        this.isSelectingPlace = false
        this.selectedPlaceIsMoving = false
        this.isResizeSelectedPlace = false
    }

    init() {
        if (!this.getSelectedPlace()) {
            $('[data-type="next"]').prop('disabled', true)
        } else {
            $('[data-type="next"]').prop('disabled', false)
        }
        this.hd.init()
        this.hd.next = () => {
            this.setData()
            let s = parseInt(new URLSearchParams(location.search).get('step')) + 1
            window.history.pushState({step: s, ...this.data}, document.title, this.hd.url || '?action=edit&step=' + s)
            $('[data-action="main"] section').remove()
            this.hd.setContent()
        }
        this.hd.previous = () => {
            this.setData()
            let s = parseInt(new URLSearchParams(location.search).get('step')) - 1
            window.history.pushState({step: s, ...this.data}, document.title, this.hd.url || '?action=edit&step=' + s)
            $('[data-action="main"] section').remove()
            this.hd.setContent()
        }
        this.hd.setEventListeners()
        $('[data-action="main"]').append(this.container)
        this.container.html(this.container.html() + `<img src="${this.diploma}" alt=""/>`)
        this.managePanel = new DiplomaEditorManagePanel(mP, this.container)
        this.managePanel.init()
        this.container.css({'margin-top': '250px'})
        this.container.find('img').on('load', e => {
            this.containerX = this.container[0].offsetLeft
            this.containerY = this.container[0].offsetTop - window.scrollY
        })

        this.x1 && this.x2 && this.createSelectedPlace()
    }

    setEventListeners() {
        window.onscroll = e => {
            this.containerY = this.container[0].offsetTop - window.scrollY
        }

        this.container.on('mousedown', e => {
            this.overrideEventListener(e)
            this.isSelectingPlace = true
            if (!this.checkSelectedPlace()) {
                this.setCoordinates(e.clientX, e.clientX, e.clientY, e.clientY)
                this.createSelectedPlace()
            } else if (!this.isResizeSelectedPlace) {
                this.setCoordinates(this.x1, e.clientX, this.y1, e.clientY)
                this.rerenderSelectedPlace()
            }
        })

        this.container.on('mouseup', () => {
            this.isSelectingPlace = false
            this.isResizeSelectedPlace = false
        })

        this.container.on('mousemove', e => {
            if (this.isSelectingPlace && !this.selectedPlaceIsMoving && !this.isResizeSelectedPlace) {
                this.overrideEventListener(e)
                this.setCoordinates(this.x1, e.clientX, this.y1, e.clientY)
            }
        })
    }

    createSelectedPlace() {
        let el = `<div data-action="resize-container" style='position: absolute; 
                              display: flex; 
                              flex-direction: row;
                              justify-content: center;
                              color: ${this.managePanel.selectedColor};
                              font-size: ${this.managePanel.selectedSize + 'px'};
                              font-style: ${this.managePanel.selectedBold};
                              font-weight: ${this.managePanel.selectedBold};
                              font-family: Roboto;
                              border: rgb(8,30,170) dashed 2px; 
                              width: ${this.x2 > this.x1 ? this.x2 - this.x1 + 'px' : this.x1 - this.x2 + 'px'}; 
                              height: ${this.y2 > this.y1 ? this.y2 - this.y1 + 'px' : this.y1 - this.y2 + 'px'};
                              top: ${this.y1 < this.y2 ? this.y1 - this.containerY + 'px' : this.y2 - this.containerY + 'px'};
                              left: ${this.x1 < this.x2 ? this.x1 - this.containerX + 'px' : this.x2 - this.containerX + 'px'};
                              cursor: ${!this.selectedPlaceIsMoving ? 'grab !important' : 'grabbing !important'}'><div data-action="name-container">Иван Иванов</div></div>`

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
            if (this.isResizeSelectedPlace && !this.selectedPlaceIsMoving) {
                this.overrideEventListener(e)
                let $this = $(e.currentTarget)
                if ($this.attr('data-id').toString() === '1') {
                    this.setCoordinates(e.clientX, this.x2, e.clientY, this.y2)
                } else if ($this.attr('data-id').toString() === '2') {
                    this.setCoordinates(this.x1, e.clientX, e.clientY, this.y2)
                } else if ($this.attr('data-id').toString() === '3') {
                    this.setCoordinates(this.x1, e.clientX, this.y1, e.clientY)
                } else if ($this.attr('data-id').toString() === '4') {
                    this.setCoordinates(e.clientX, this.x2, this.y1, e.clientY)
                }
            }
        })

        this.container.find('span').on('mouseup', e => {
            this.overrideEventListener(e)
            this.isResizeSelectedPlace = false
        })

        this.setSelectedPlaceActionListeners()

        this.managePanel.rerender = () => {
            this.container.find('div').remove()
            this.container.find('span').remove()

            this.createSelectedPlace()
        }

        this.resultX = this.x1 + ($('[data-action="resize-container"]').width() - $('[data-action="name-container"]').width()) / 2
        console.log({resultX: this.resultX, x1: this.x1})
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
        this.createSelectedPlace()
        $('[data-type="next"]').prop('disabled', false)
    }

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
            ...this.managePanel.data
        }

        this.hd.setData(this.data)
    }

    overrideEventListener(e) {
        e.preventDefault()
        e.stopPropagation()
    }
}

class DiplomaEditorManagePanel {
    constructor(container, mainContainer, rerender) {
        this.container = container
        this.mainContainer = mainContainer

        this.fontParams = {
            Size: [8, 10, 12, 14, 16, 18, 20, 28, 56, 72, 92],
            Family: [],
            Bold: ['auto', 'italic', 'bold'],
        }

        this.fontColorParam = $('[data-param="fontColor"]')
        this.fontSizeParam = $('[data-param="fontSize"]')
        this.fontBoldParam = $('[data-param="fontBold"]')

        this.selectedColor = window.history.state.selectedColor
        this.selectedSize = window.history.state.selectedSize
        this.selectedBold = window.history.state.selectedBold
        this.selectedTemplate = window.history.state.selectedTemplate

        this.file = null

        this.rerender = rerender

        this.data = {
            selectedColor: this.selectedColor,
            selectedSize: this.selectedSize,
            selectedBold: this.selectedBold,
            selectedTemplate: window.history.state.selectedTemplate,
            file: this.file,
        }
    }

    init() {
        this.setData()

        $('[data-action="main"]').append(this.container)
        this.container = $('[data-action="main"]').find('section')

        this.fontColorParam = $('[data-param="fontColor"]')
        this.fontSizeParam = $('[data-param="fontSize"]')
        this.fontBoldParam = $('[data-param="fontBold"]')

        this.fontSizeParam.val(this.selectedSize || 16)
        this.fontColorParam.val(this.selectedColor || "#000000")

        let fp = this.fontParams
        for (let i = 0; i < fp.Bold.length; i++) this.fontBoldParam.html(this.fontBoldParam.html() + `<option value="${fp.Bold[i]}">${fp.Bold[i]}</option>`)

        let cP = $(`option[value=${this.selectedBold || '16px'}]`)
        cP.prop('selected', true)

        this.container.css({width: this.mainContainer[0].clientWidth + 'px'})
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

        this.fontBoldParam.on('change', e => {
            this.overrideEventListener(e)
            this.selectedBold = e.currentTarget.value
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
            selectedBold: this.selectedBold,
            selectedTemplate: this.selectedTemplate,
            file: this.file,
        }
    }

    overrideEventListener(e) {
        e.stopPropagation()
        e.preventDefault()
    }
}

const mP = '' +
    '<section data-action="editor_panel" class="editor_panel" style="display: flex; flex-direction: row; z-index: 1000;">' +
    '    <div class="editor_panel__params">' +
    '        <label style="margin-bottom: 5px;">Параметры текста</label>' +
    '        <input class="editor_panel__params__item" style="width: 100%;" type="number" step="2" min="8" max="92"' +
    '               value="16" data-param="fontSize">' +
    '        <input class="editor_panel__params__item" style="width: 100%;" type="color" data-param="fontColor">' +
    '        <select class="editor_panel__params__item" style="width: 100%;" data-param="fontBold">' +
    '            <option value="16px">Стиль шрифта</option>' +
    '        </select>' +
    '    </div>' +
    '    <div class="editor_panel__params">' +
    '        <label style="margin-bottom: 5px; align-items: center">Excel файл</label>' +
    '        <input data-action="fileInput" class="editor_panel__params__item" style="width: 130px; display: none;" type="file" value="16" data-param="excelFile">' +
    '        <button data-action="chooseFile" class="btn_default">Загрузить</button>' +
    '    </div>' +
    '</section>'