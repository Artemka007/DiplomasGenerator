class HistoryDirections {
    constructor(data) {
        this.data = data

        this.nextButton = $('[data-type="next"]')
        this.previousButton = $('[data-type="previous"]')
    }

    init() {
        this.setEventListeners()
    }

    next() {
        let s = parseInt(new URLSearchParams(location.search).get('step')) + 1
        window.history.pushState({step: s, ...this.data}, document.title, '?step=' + s)
        $('[data-action="main"] section').remove()
        this.setContent()
    }

    previous() {
        $('[data-action="main"] section').remove()
        window.history.back()
    }

    setContent() {
        if (location.pathname === '/editor/') {
            if (new URLSearchParams(location.search).get('step') === '1') {
                $('[data-type="previous"]').prop('disabled', true)
                const t = new ChooseDiplomaTemplate('<section class="select_diplomas_container"></section>')
                t.init()
            } else if (new URLSearchParams(location.search).get('step') === '2') {
                $('[data-type="previous"]').prop('disabled', false)
                const de = new DiplomaEditor($('[data-action="edit_diploma"]'))
                de.init()
                de.setActionListeners()
            } else if (new URLSearchParams(location.search).get('step') === '3') {
                $('[data-type="next"]').prop('disabled', true)
                const pgd = new PreviewGenerateDiploma()
                pgd.init()
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

