class PreviewGenerateDiploma{
    constructor() {
        this.container = '<section class="select_diplomas_container"></section>'

        this.data = {...window.history.state}
    }

    init() {
        const d = {
            image: baseURI + this.data['selectedTemplate'],
            text: "Иван Иванов",
            x: this.data['x1'],
            y: this.data['y1'],
            bold: this.data['selectedBold'],
            color: this.data['selectedColor'],
            size: this.data['selectedSize'],
        }

        API.generateDiploma(d).then(res => {
            $('[data-action="main"]').append(this.container)
            this.container = $('[data-action="main"]').find('.select_diplomas_container')
            this.container.append(`<img src="${res.url}" alt=""/>`)
            this.container.find('img').on('load', e => {
                let left = window.innerWidth / 2 - this.container[0].clientWidth / 2
                this.container.css({'top': 300, 'left': left - 8})
            })
        })
    }
}