class Loading {
    constructor(container) {
        this.container = container

        this.prevHTML = $(container).html()
    }

    startLoading() {
        this.container = $(this.container)

        this.container.html('Loading...')
    }

    endLoading() {
        this.container.html(this.prevHTML)
    }
}