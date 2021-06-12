const API = {
    getTemplates: function () {
        return $.get('/templates/')
    },

    generateDiploma: function (data) {
        return $.ajax('/generator/', {
            method: 'GET',
            data: data,
            dataType: 'json',
        })
    },

    uploadExcel: function (file) {
        let fd = new FormData()
        fd.append('excel', file)

        return $.ajax('/upload/excel/', {
            data: fd
        })
    }
}