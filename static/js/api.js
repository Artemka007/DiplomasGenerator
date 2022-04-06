function getCookie(name) {
    var cookieValue = null;

    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');

        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);

            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookieValue;
}


const API = {
    getTemplates: function() {
        return $.get('/templates/')
    },

    generateDiploma: function(data) {
        return $.ajax('/generator/', {
            method: 'GET',
            data: data,
            dataType: 'json',
        })
    },

    getNames: function(data) {
        return $.ajax('/get_names/', {
            method: 'POST',
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            data: data,
            contentType: false,
            processData: false,
        })
    },

    uploadTemplate: function(data, method) {
        return $.ajax('/upload/', {
            method: method,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            data: data,
            contentType: false,
            processData: false,
        })
    },


    signUp: function(data) {
        return $.ajax('/account/sign_up/', {
            method: 'POST',
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            data: data
        })
    }
}