class PreviewGenerateDiploma {
    constructor() {
        this.container = '<section class="select_diplomas_container"></section>'

        this.data = {...window.history.state }

        this.d = {
            template: baseURI + this.data['selectedTemplate'],
            names: JSON.stringify(["Иван Иванов"]),
            x: this.data['resultX'],
            y: this.data['y1'],
            font_weight: this.data['selectedBold'],
            font_size: this.data['selectedSize'],
            foreground: this.data['selectedColor'],
        }
    }

    init() {
        API.generateDiploma({...this.d, isTest: true }).then(res => {
            if (res.result) {
                $('[data-action="main"]').append(this.container)
                this.container = $('[data-action="main"]').find('.select_diplomas_container')
                this.container.append(`<img src="${res.url}" alt=""/>`)
                this.container.find('img').on('load', e => {
                    let left = window.innerWidth / 2 - this.container[0].clientWidth / 2
                    this.container.css({ 'top': 300, 'left': left - 8 })
                })

                (new ModalWindow(res.message, 'ok')).show()
            } else {
                new ModalWindow(res.message, 'error')
            }
        })

        $('[data-type="next"]').off('click')
        $('[data-type="next"]').on('click', e => {
            readXlsx(this.data.file).then(names => {
                this.d.names = JSON.stringify(names)
                API.generateDiploma(this.d).then(res => {
                    if (res.result) {
                        window.location.href = res.url
                    } else {
                        let mw = new ModalWindow(res.message, 'error')
                        mw.show()
                    }
                })
            })
        })
    }
}