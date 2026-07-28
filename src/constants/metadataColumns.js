import { FilterMatchMode } from 'primevue/api'

export const metadataColumns = [

    {
        field: 'uuid',
        header: 'UUID',
        type: 'text',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
        },
        visible: true,
    },

    {
        field: 'rfc_emisor',
        header: 'RFC Emisor',
        type: 'text',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
        },
        visible: true,
    },

    {
        field: 'nombre_emisor',
        header: 'Nombre Emisor',
        type: 'text',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
        },
        visible: true,
    },

    {
        field: 'rfc_receptor',
        header: 'RFC Receptor',
        type: 'text',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
        },
        visible: true,
    },

    {
        field: 'nombre_receptor',
        header: 'Nombre Receptor',
        type: 'text',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
        },
        visible: true,
    },

    {
        field: 'pac_certifico',
        header: 'PAC Certificó',
        type: 'text',
        sortable: false,
        filter: {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
        },
        visible: false,
    },

    {
        field: 'fecha_emision',
        header: 'Fecha Emisión',
        type: 'date',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.DATE_IS,
        },
        visible: true,
    },

    {
        field: 'fecha_certificacion_sat',
        header: 'Fecha Certificación SAT',
        type: 'date',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.DATE_IS,
        },
        visible: true,
    },

    {
        field: 'monto',
        header: 'Monto',
        type: 'currency',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.EQUALS,
        },
        visible: true,
    },

    {
        field: 'iva',
        header: 'IVA',
        type: 'currency',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.EQUALS,
        },
        visible: false,
    },

    {
        field: 'sub_total',
        header: 'Subtotal',
        type: 'currency',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.EQUALS,
        },
        visible: false,
    },

    {
        field: 'efecto_comprobante',
        header: 'Efecto Comprobante',
        type: 'text',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
        },
        visible: false,
    },

    {
        field: 'estatus',
        header: 'Estatus',
        type: 'enum',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.EQUALS,
        },
        visible: true,
    },

    {
        field: 'fecha_cancelacion',
        header: 'Fecha Cancelación',
        type: 'date',
        sortable: true,
        filter: {
            value: null,
            matchMode: FilterMatchMode.DATE_IS,
        },
        visible: false,
    },

]