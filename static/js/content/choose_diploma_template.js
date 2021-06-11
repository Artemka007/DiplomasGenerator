class ChooseDiplomaTemplate {
    constructor(container) {
        this.container = container

        this.templates = []

        this.selectedTemplate = window.history.state.selectedTemplate

        this.data = {
            selectedTemplate: this.selectedTemplate
        }

        this.hd = new HistoryDirections(this.data)
    }

    init() {
        this.hd.init()

        $('[data-action="main"] section').remove()

        let m = $('[data-action="main"]').append(this.container)

        this.container = $(m.find('section'))

        API.getTemplates().then(res => {
            if (res.result) {
                this.templates = res.templates
                this.drawingTemplates()
            } else {
                console.error(res.message)
            }
        })
    }

    setActionListeners() {
        const el = $('.select_diploma_template')
        const c = $('[data-action="select_diploma_actions"]')
        c.mouseenter(e => {
            this.overrideEventListener(e)
            $(e.currentTarget).css({background: 'rgba(0,0,0,0.5)'})
        }).mouseleave(e => {
            this.overrideEventListener(e)
            $(e.currentTarget).css({background: 'rgba(0,0,0,0)'})
        })
        el.on('click', e => {
            this.overrideEventListener(e)
            this.selectedTemplate = $(e.currentTarget).data('url')
            this.drawingTemplates()
            this.setData()
            window.history.replaceState({step: 1, ...this.data}, document.title, '')
        })
    }

    drawingTemplates() {
        this.container.html('')
        for (let i = 0; i < this.templates.length; i++) {
            this.container.append(`<section id="${this.templates[i]['id']}" data-url="${this.templates[i]['diploma']}" class="select_diploma_template" style="background-image: url(${this.templates[i]['diploma']}); margin: 10px; border: ${this.selectedTemplate === this.templates[i]['diploma'] ? 'rgb(17,25,227) solid 2px' : 'aqua solid 2px'}">
                                    <div data-action="select_diploma_actions" style="cursor: pointer; background-color: rgba(0,0,0,0); width: 100%; height: 100%; border-radius: 10px;"></div>
                                    </section>`)
            this.setActionListeners()
        }
    }

    setData() {
        this.data = {
            selectedTemplate: this.selectedTemplate
        }
        this.hd.setData(this.data)
    }

    overrideEventListener(e) {
        e.stopPropagation()
        e.preventDefault()
    }
}

