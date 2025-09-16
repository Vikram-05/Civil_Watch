import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'

import en from '../src/locales/en/translation.json'
import ka from '../src/locales/ka/translation.json'

i18n.use(initReactI18next).init({
    resources:{
        en:{translation:en},
        ka:{translation:ka}
    },
    fallbackLng:'en',
    interpolation:{
        escapeValue:false
    }
})
export default i18n;