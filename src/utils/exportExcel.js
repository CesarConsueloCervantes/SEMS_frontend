import ExcelJS from 'exceljs'

export async function exportExcel(data, columns, fileName = 'metadatos.xlsx') {

    const workbook = new ExcelJS.Workbook()

    workbook.creator = 'SEMS'
    workbook.created = new Date()

    const worksheet = workbook.addWorksheet('Metadatos')

    worksheet.columns = columns.map(column => ({
        header: column.header,
        key: column.field
    }))

    worksheet.getRow(1).font = {
        bold: true
    }

    data.forEach(item => {
        worksheet.addRow(item)
    })

    worksheet.columns.forEach(column => {

        let maxLength = column.header.length

        column.eachCell({ includeEmpty: true }, cell => {
            const length = cell.value ? cell.value.toString().length : 0

            if (length > maxLength) {
                maxLength = length
            }
        })

        column.width = maxLength + 3
    })

    worksheet.views = [
        {
            state: 'frozen',
            ySplit: 1
        }
    ]

    const buffer = await workbook.xlsx.writeBuffer()

    const blob = new Blob(
        [buffer],
        {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    )

    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.download = fileName

    link.click()

    window.URL.revokeObjectURL(url)
}