class UploadTemplates {
    constructor(container) {
        this.container = container

        this.hd = new HistoryDirections({ step: 1 }, '?action=edit&step=1')

        this.uploadContainer = null
    }

    init() {
        $('[data-action="upload_templates_btn"]').text('Вернуться')
        $('[data-action="upload_templates_btn"]').off('click').on('click', e => {
            this.hd.go()
        })

        let main = $('[data-action="main"]')
        main.append(this.container)
        this.container = $(main.find('section'))

        this.container.append(
            `<section class="upload_container" style="font-size: 45px;">
                <span style="user-select: none;">
                    <i class="bi bi-upload" style="margin-right: 10px;"></i>
                    Перетащите файл в контейнер
                </span>
            </section>`
        )

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
            for (let i = 0; i < files.length; i++) {
                if (files[i].type.split('/')[0] === 'image') {
                    let data = new FormData()
                    data.append('file', files[i])
                    API.uploadTemplate(data).then(res => {
                        this.container.append(
                            `<section class="upload_image_container" style='background-image: url(${baseURI + res.url})' data-action="upload_files_item">
                                <button data-action="delete_upload_file" style="background: rgba(0,0,0,0);border: none;outline: none;cursor: pointer;"><i data-id="${res.id}" class="bi bi-trash" style="font-size: 40px; color: rgba(0, 0, 0, 0.7);"></i></button>
                            </section>`
                        )
                    }).catch(err => {
                        alert(err.message)
                    })
                    $('[data-action="delete_upload_file"]').on('click', e => {
                        API.deleteTemplate({ id: $('[data-action="delete_upload_file"]').attr('data-id') })
                    })
                } else {
                    console.log(files[i])
                    console.error(`Недопустимый формат файла ${files[i].type}.`)
                    let mw = new ModalWindow(`Недопустимый формат файла ${files[i].type}.`, 'error')
                    mw.show()
                }
            }
        })

        this.uploadContainer.on('dragleave', e => {
            e.preventDefault()
            $(this).css({ borderColor: 'rgba(0,0,0,0.5)' })
        })

        this.uploadContainer.on('dragover', e => {
            e.preventDefault()
            $(this).css({ borderColor: 'rgba(0,0,0,0.7)' })
        })
    }
}