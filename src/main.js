import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue)

app.use(ToastService)
app.use(ConfirmationService)

app.directive('tooltip', Tooltip)

app.component('Button', Button)
app.component('InputText', InputText)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)

app.mount('#app')