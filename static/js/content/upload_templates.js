class UploadTemplates {
    constructor(container) {
        this.container = container

        this.hd = new HistoryDirections({step: 1}, '?action=edit&step=1')

        this.uploadContainer = null

        this.supportFormats = ['image/jpeg', 'image/jpg', 'image/png']
    }

    init() {
        $('[data-action="upload_templates_btn"]').text('Вернуться')
        $('[data-action="upload_templates_btn"]').off('click').on('click', e => {
            this.hd.next()
        })

        let main = $('[data-action="main"]')
        main.append(this.container)
        this.container = $(main.find('section'))

        this.container.append('<section class="upload_container" style="font-size: 45px;"><span><i class="bi bi-upload" style="margin-right: 10px;"></i>Перетащите файл в контейнер</span></section>')

        this.uploadContainer = $('.upload_container')

        this.setEventListeners()
    }

    setEventListeners() {
        window.addEventListener('dragover', e => {
            e.preventDefault()
            e.stopPropagation()
        })

        this.uploadContainer.on('drop', e => {
            e.preventDefault()
            let files = e.originalEvent.dataTransfer.files
            console.log(e.originalEvent.dataTransfer.files)
            for (let i = 0; i < files.length; i++) {
                if (files[i].type.split('/')[0] === 'image') {
                    API.uploadTemplate(files[i]).then(res => {
                        this.container.append(`<section class="upload_image_container" style='background-image: url(${baseURI + res.url})' data-action="upload_files_item">
                                                    <i data-id="${res.id}" class="bi bi-trash" style="font-size: 40px; color: rgba(0, 0, 0, 0.7);"></i>
                                               </section>`)
                    })
                }
                else {
                    console.error(`Недопустимый формат файла ${files[i].type}.`)
                }
            }
        })

        this.uploadContainer.on('dragleave', e => {
            e.preventDefault()
            $(this).css({borderColor: 'rgba(0,0,0,0.5)'})
        })

        this.uploadContainer.on('dragover', e => {
            e.preventDefault()
            $(this).css({borderColor: 'rgba(0,0,0,0.7)'})
        })
    }
}