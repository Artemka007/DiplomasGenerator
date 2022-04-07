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


let apiversion = "v1"
const API = {
    baseURI: `/api/${apiversion}`,

    getTemplates: function() {
        return $.get(`${API.baseURI}/templates/`)
    },

    /**
     * @param {*} data 
     * @returns {Promise<any>}
     */
    uploadTemplate: function(data) {
        return $.ajax(`${API.baseURI}/templates/`, {
            method: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            data: data,
            contentType: false,
            processData: false,
        })
    },

    deleteTemplate: function(data) {
        return $.ajax(`${API.baseURI}/templates/`, {
            method: "DELETE",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            data: data,
        })
    },

    generateDiploma: function(data) {
        return $.ajax(`${API.baseURI}/generator/`, {
            method: 'GET',
            data: data,
            dataType: 'json',
        })
    },

    getNames: function(data) {
        return $.ajax(`${API.baseURI}/get_names/`, {
            method: 'POST',
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