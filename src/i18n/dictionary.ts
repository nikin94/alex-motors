/* Custom i18n instead of a library: the copy is a fixed, hand-authored set of
   strings across three languages, so a typed dictionary object plus a context
   hook is smaller and simpler than i18next (~15 kB gzip) and pulls in nothing.
   Draft ga/ru are ours, pending a copy pass from the Content manager. */

export type Lang = 'en' | 'ga' | 'ru'

export type ServiceId =
  | 'servicing'
  | 'diagnostics'
  | 'engine'
  | 'timing'
  | 'brakes'
  | 'electrics'

/* Order and display labels of the switcher. Labels stay Latin in every
   language so the control reads the same and never needs the Cyrillic face. */
export const LANGS: { readonly code: Lang; readonly label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ga', label: 'GA' },
  { code: 'ru', label: 'RU' },
]

type ServiceCopy = { title: string; description: string }

export type Dictionary = {
  htmlLang: string
  tagline: { top: string; bottom: string }
  services: {
    heading: string
    preNct: { title: string; body: string }
    items: Record<ServiceId, ServiceCopy>
  }
  location: {
    heading: string
    workshop: string
    openingHours: string
    days: { weekdays: string; saturday: string; sunday: string; closed: string }
    callUs: string
    getDirections: string
  }
  a11y: {
    scrollToServices: string
    scrollToLocation: string
    selectLanguage: string
    mapLabel: string
    loadingMap: string
  }
}

const en: Dictionary = {
  htmlLang: 'en',
  tagline: { top: 'Motor Sport', bottom: 'Auto Repair & Service' },
  services: {
    heading: 'Our Services',
    preNct: {
      title: 'Pre-NCT Check & Repairs',
      body: 'Failed the NCT — or worried you might? We do a full pre-NCT inspection covering brakes, suspension, lights, emissions and tyres — and fix what needs fixing, so you go into the test ready to pass. Retest checks too.',
    },
    items: {
      servicing: {
        title: 'Car Servicing',
        description:
          'Full and interim services for all makes and models — oil and filters, fluids, and a health check that catches problems before they get expensive.',
      },
      diagnostics: {
        title: 'Diagnostics',
        description:
          'Dashboard warning light? We read fault codes with dealer-level tools, find the actual cause and explain your options before any work starts.',
      },
      engine: {
        title: 'Engine Repair',
        description:
          'From misfires and oil leaks to major engine work — honest assessment first, then a clear quote. Daily drivers, vans and sports cars alike.',
      },
      timing: {
        title: 'Timing Belt & Chain',
        description:
          'Belt and chain replacement at the right mileage — the job that protects your engine from the most expensive failure it can have.',
      },
      brakes: {
        title: 'Brakes & Suspension',
        description:
          'Pads, discs, shocks, springs and bushings — everything that keeps you stopping straight and riding smooth on Donegal roads.',
      },
      electrics: {
        title: 'Battery & Electrics',
        description:
          'Battery testing and replacement, alternators, starters and wiring faults — including the ones that only show up on cold mornings.',
      },
    },
  },
  location: {
    heading: 'Find Us',
    workshop: 'Workshop',
    openingHours: 'Opening Hours',
    days: { weekdays: 'Mon–Fri', saturday: 'Saturday', sunday: 'Sunday', closed: 'Closed' },
    callUs: 'Call Us',
    getDirections: 'Get Directions',
  },
  a11y: {
    scrollToServices: 'Scroll to services',
    scrollToLocation: 'Scroll to location',
    selectLanguage: 'Select language',
    mapLabel: 'Map showing the Alex Motors workshop',
    loadingMap: 'Loading map…',
  },
}

const ru: Dictionary = {
  htmlLang: 'ru',
  tagline: { top: 'Motor Sport', bottom: 'Автосервис и ремонт' },
  services: {
    heading: 'Наши услуги',
    preNct: {
      title: 'Подготовка к NCT и ремонт',
      body: 'Не прошли NCT или боитесь не пройти? Проводим полную проверку перед NCT — тормоза, подвеска, свет, выхлоп и шины — и устраняем всё необходимое, чтобы вы приехали на тест готовыми. Проверка перед пересдачей тоже.',
    },
    items: {
      servicing: {
        title: 'Техобслуживание',
        description:
          'Полное и промежуточное ТО для авто любых марок — масло и фильтры, жидкости и проверка состояния, которая находит проблемы до того, как они станут дорогими.',
      },
      diagnostics: {
        title: 'Диагностика',
        description:
          'Горит лампа на панели? Считываем коды ошибок дилерским оборудованием, находим настоящую причину и объясняем варианты до начала работ.',
      },
      engine: {
        title: 'Ремонт двигателя',
        description:
          'От пропусков зажигания и течей масла до капитального ремонта — сначала честная оценка, затем понятная смета. Легковые, фургоны и спорткары.',
      },
      timing: {
        title: 'Ремень и цепь ГРМ',
        description:
          'Замена ремня и цепи ГРМ на нужном пробеге — работа, которая защищает двигатель от самой дорогой поломки.',
      },
      brakes: {
        title: 'Тормоза и подвеска',
        description:
          'Колодки, диски, амортизаторы, пружины и сайлентблоки — всё, что обеспечивает уверенное торможение и плавный ход на дорогах Донегола.',
      },
      electrics: {
        title: 'Аккумулятор и электрика',
        description:
          'Проверка и замена аккумулятора, генераторы, стартеры и неисправности проводки — в том числе те, что проявляются только холодным утром.',
      },
    },
  },
  location: {
    heading: 'Как нас найти',
    workshop: 'Мастерская',
    openingHours: 'Часы работы',
    days: { weekdays: 'Пн–Пт', saturday: 'Суббота', sunday: 'Воскресенье', closed: 'Выходной' },
    callUs: 'Позвоните нам',
    getDirections: 'Построить маршрут',
  },
  a11y: {
    scrollToServices: 'Перейти к услугам',
    scrollToLocation: 'Перейти к контактам',
    selectLanguage: 'Выбрать язык',
    mapLabel: 'Карта с расположением мастерской Alex Motors',
    loadingMap: 'Загрузка карты…',
  },
}

const ga: Dictionary = {
  htmlLang: 'ga',
  tagline: { top: 'Motor Sport', bottom: 'Deisiú & Seirbhís Gluaisteán' },
  services: {
    heading: 'Ár Seirbhísí',
    preNct: {
      title: 'Seiceáil Réamh-NCT & Deisiúcháin',
      body: 'Theip ort san NCT — nó imníoch go dteipfeadh ort? Déanaimid iniúchadh iomlán réamh-NCT ar na coscáin, an crochadh, na soilse, na hastaíochtaí agus na boinn — agus deisímid a bhfuil le deisiú, ionas go mbeidh tú réidh le pasáil. Seiceálacha athtástála chomh maith.',
    },
    items: {
      servicing: {
        title: 'Seirbhísiú Gluaisteán',
        description:
          'Seirbhísí iomlána agus eatramhacha do gach déanamh agus múnla — ola agus scagairí, sreabháin, agus seiceáil sláinte a aimsíonn fadhbanna sula n-éiríonn siad costasach.',
      },
      diagnostics: {
        title: 'Diagnóisic',
        description:
          'Solas rabhaidh ar an bpainéal? Léimid cóid fabht le huirlisí ar leibhéal déileálaí, aimsímid an fíorchúis agus mínímid do roghanna sula dtosaíonn aon obair.',
      },
      engine: {
        title: 'Deisiú Innill',
        description:
          'Ó mhí-adhaint agus sceitheadh ola go mórobair innill — measúnú macánta ar dtús, ansin luachan shoiléir. Gluaisteáin laethúla, veaineanna agus spórtcharranna araon.',
      },
      timing: {
        title: 'Crios & Slabhra Ama',
        description:
          'Athsholáthar creasa agus slabhra ag an mhíleáiste ceart — an jab a chosnaíonn d’inneall ón teip is costasaí is féidir a bheith air.',
      },
      brakes: {
        title: 'Coscáin & Crochadh',
        description:
          'Pillíní, dioscaí, turraingí, spriongaí agus muileataí — gach rud a choinníonn ag stopadh díreach agus ag taisteal go réidh thú ar bhóithre Dhún na nGall.',
      },
      electrics: {
        title: 'Cadhnra & Leictreachas',
        description:
          'Tástáil agus athsholáthar cadhnra, ailtéarnóirí, tosaitheoirí agus fabhtanna sreangaithe — na cinn nach dtaispeánann iad féin ach ar maidin fhuar san áireamh.',
      },
    },
  },
  location: {
    heading: 'Aimsigh Sinn',
    workshop: 'Ceardlann',
    openingHours: 'Uaireanta Oscailte',
    days: { weekdays: 'Luan–Aoine', saturday: 'Satharn', sunday: 'Domhnach', closed: 'Dúnta' },
    callUs: 'Glaoigh Orainn',
    getDirections: 'Faigh Treoracha',
  },
  a11y: {
    scrollToServices: 'Scrollaigh go dtí na seirbhísí',
    scrollToLocation: 'Scrollaigh go dtí an suíomh',
    selectLanguage: 'Roghnaigh teanga',
    mapLabel: 'Léarscáil a thaispeánann ceardlann Alex Motors',
    loadingMap: 'Léarscáil á lódáil…',
  },
}

export const dictionaries: Record<Lang, Dictionary> = { en, ga, ru }
