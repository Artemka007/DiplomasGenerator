class SignUp {
    constructor() {
        this.data = {
            username: null,
            email: null,
            first_name: null,
            last_name: null,
            password1: null,
            password2: null,
        }
    }

    setData(username, email, first_name, last_name, password1, password2) {
        this.data = {
            username,
            email,
            first_name,
            last_name,
            password1,
            password2,
        }
    }

    submit(loading) {
        API.signUp(this.data).then(res => {
            if (res.result) {
                window.location.href = res.redirect_to
            } else {
                let mw = new ModalWindow(res.message, 'error', 0)
                mw.show()
                loading.endLoading()
            }
        })
    }
}