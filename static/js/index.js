const baseURI = "http://192.168.0.103:8000"

$(function () {
    const hd = new HistoryDirections({})
    location.pathname === '/editor/' && history.pushState({step: 1}, document.title, '?action=edit&step=' + 1)
    $('[data-type="previous"]').prop('disabled', true)
    hd.setContent()
    window.onpopstate = e => {
        hd.setContent()
    }
})