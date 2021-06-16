class Loading {
    constructor(container) {
        this.container = container

        this.prevHTML = container.html()
    }

    startLoading() {
        this.container.prop('disabled', true)

        this.container.html('Loading...')
    }

    endLoading() {
        this.container.html(this.prevHTML)
        this.container.prop('disabled', false)
    }
}