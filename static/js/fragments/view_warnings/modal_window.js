class ModalWindow {
    constructor(message, type) {
        this.message = message
        this.type = type

        this.main = $('[data-action="main"]')

        this.main.append(`<aside class="warning_window ${this.type}"><div style="display: flex;">${this.message}</div><i class="bi bi-x-circle" style="cursor: pointer; margin-left: 15px;" onclick="$('.warning_window').remove()"></i></aside>`)
    }

    show() {
        let ww = $('.warning_window')
        ww.animate({ top: '69px', zIndex: 1 })
    }
}