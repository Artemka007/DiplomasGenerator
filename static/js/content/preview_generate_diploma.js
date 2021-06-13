class PreviewGenerateDiploma {
    constructor() {
        this.container = '<section class="select_diplomas_container"></section>'

        this.data = {...window.history.state}

        this.d = {
            image: baseURI + this.data['selectedTemplate'],
            names: JSON.stringify(["Иван Иванов"]),
            x: this.data['x1'],
            y: this.data['y1'],
            bold: this.data['selectedBold'],
            color: this.data['selectedColor'],
            size: this.data['selectedSize'],
        }
    }

    init() {
        API.generateDiploma({...this.d, isTest: true}).then(res => {
            $('[data-action="main"]').append(this.container)
            this.container = $('[data-action="main"]').find('.select_diplomas_container')
            this.container.append(`<img src="${res.url}" alt=""/>`)
            this.container.find('img').on('load', e => {
                let left = window.innerWidth / 2 - this.container[0].clientWidth / 2
                this.container.css({'top': 300, 'left': left - 8})
            })
        })

        $('[data-type="next"]').off('click')
        $('[data-type="next"]').on('click', e => {
            let fd = new FormData()
            fd.append('file', this.data.file)
            API.generateAllDiplomas(fd).then(res => {
                this.d.names = JSON.stringify(res.names)
                API.generateDiploma(this.d).then(res => {
                    window.location.href = res.url
                })
            })
        })
    }
}