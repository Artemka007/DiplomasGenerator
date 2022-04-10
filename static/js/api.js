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


const apiversion = "v1"
const API = {
    baseURI: `/api/${apiversion}`,

    getTemplates: function() {
        return fetch(`${API.baseURI}/templates/get/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                "Content-Type": "application/json;charset=utf-8"
            },
            contentType: false,
            processData: false,
        }).then(res => res.json())
    },

    uploadTemplate: function(data) {
        return fetch(`${API.baseURI}/templates/create/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ data }),
            contentType: false,
            processData: false,
        }).then(res => res.json())
    },

    deleteTemplate: function(data) {
        return fetch(`${API.baseURI}/templates/delete/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ data }),
        }).then(res => res.json())
    },

    generateDiploma: function(data) {
        return fetch(`${API.baseURI}/generator/`, {
            method: 'POST',
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ data }),
        }).then(res => res.json())
    }
}