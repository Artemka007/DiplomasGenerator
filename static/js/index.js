const baseURI = "http://192.168.2.153:8080"

$(function() {
    const hd = new HistoryDirections({})
    location.pathname === '/editor/' && history.pushState({ step: 1 }, document.title, '?action=edit&step=' + 1)
    $('[data-type="previous"]').prop('disabled', true)
    hd.setContent()
    window.onpopstate = e => {
        $('[data-action="main"]').find('section').remove()
        hd.setContent()
    }
})