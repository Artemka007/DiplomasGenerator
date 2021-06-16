class SignUp {
    constructor(container) {
        this.container = container
    }

    init() {}

    submit(data) {
        API.signUp(data).then(res => {
            if (res.result) {
                window.location.href = res.redirect_to
            } else {
                let mw = new ModalWindow(res.message, 'error')
                mw.show()
            }
        })
    }
}