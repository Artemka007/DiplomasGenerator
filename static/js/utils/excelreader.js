/**
 * Функция для чтения excel-файла
 * @param {File} src 
 * @returns {Promise<Array<string>>}
 */
function readXlsx(src) {
    if (readXlsxFile !== undefined) {
        let names = []
        return readXlsxFile(src).then((rows) => {
            rows.forEach(cells => {
                console.log(cells)
                let cell = cells[0]
                if (cell) names.push(cell)
            })
            return names
        })
    } else {
        throw new Error("Function 'readXlsxFile' is undefined.")
    }
}