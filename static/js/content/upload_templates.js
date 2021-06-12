class UploadTemplates {
    constructor(container) {
        this.container = container
    }

    init() {
        let main = $('[data-action="main"]')
        main.append(this.container)
        this.container = main.find('section')


    }

    setEventListeners() {

    }
}