class HistoryDirections {
    constructor(data, url) {
        this.data = data

        this.nextButton = $('[data-type="next"]')
        this.previousButton = $('[data-type="previous"]')

        this.url = url
    }

    init() {
        this.setEventListeners()
    }

    next() {
        const step = new URLSearchParams(location.search).get('step')
        if(step) {
            let s = parseInt(step) + 1
            window.history.pushState({step: s, ...this.data}, document.title, this.url || '?action=edit&step=' + s)
            $('[data-action="main"] section').remove()
            this.setContent()
        }
        else {
            window.history.pushState({...this.data}, document.title, this.url)
            $('[data-action="main"] section').remove()
            this.setContent()
        }
    }

    previous() {
        let s = parseInt(new URLSearchParams(location.search).get('step')) - 1
        window.history.pushState({step: s, ...this.data}, document.title, this.url || '?action=edit&step=' + s)
        $('[data-action="main"] section').remove()
        this.setContent()
    }

    setContent() {
        if (location.pathname === '/editor/') {
            const s = new URLSearchParams(location.search)
            if (s.get('action') === 'edit') {
                switch (s.get('step')) {
                    case '1': {
                        $('[data-type="previous"]').prop('disabled', true)
                        const t = new ChooseDiplomaTemplate('<section class="select_diplomas_container"></section>')
                        t.init()
                        break
                    }

                    case '2': {
                        $('[data-type="previous"]').prop('disabled', false)
                        const de = new DiplomaEditor('<section data-action="edit_diploma" class="editor_container"></section>')
                        de.init()
                        de.setEventListeners()
                        break
                    }

                    case '3': {
                        $('[data-type="next"]').html("Завершить<i class=\"bi bi-check-lg\"></i>")
                        const pgd = new PreviewGenerateDiploma()
                        pgd.init()
                        break
                    }

                    default:
                        break
                }
            }
            else if (s.get('action') === 'upload') {
                switch (s.get('obj')) {
                    case 'template': {
                        let ut = new UploadTemplates('<section class="select_diplomas_container"></section>')
                        ut.init()
                        break
                    }

                    default:
                        break
                }
            }
        }
    }

    setData(data) {
        this.data = data
        window.history.replaceState(data, document.title)
    }

    setEventListeners() {
        this.nextButton.off('click')
        this.previousButton.off('click')

        this.nextButton.on('click', e => {
            this.next()
        })

        this.previousButton.on('click', e => {
            this.previous()
        })
    }
}

