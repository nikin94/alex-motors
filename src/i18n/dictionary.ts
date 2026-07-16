/* Custom i18n instead of a library: the copy is a fixed, hand-authored set of
   strings across three languages, so a typed dictionary object plus a context
   hook is smaller and simpler than i18next (~15 kB gzip) and pulls in nothing. */

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
    subtitle: string
    preNct: { title: string; body: string }
    items: Record<ServiceId, ServiceCopy>
  }
  location: {
    workshop: string
    openingHours: string
    days: { weekdays: string; saturday: string; sunday: string; closed: string }
    callUs: string
    getDirections: string
  }
  reviews: {
    heading: string
    /* Draft quotes written in-house (owner to swap in real ones); names are
       proper nouns and stay identical across languages. Kept out of the
       LocalBusiness JSON-LD on purpose: schema.org reviews must be verifiably
       real or Google can flag the whole structured-data block. */
    items: { name: string; text: string }[]
  }
  faq: {
    heading: string
    /* In-house draft Q&A built on owner-confirmed facts (services copy, hours,
       call-outs, address). No FAQPage JSON-LD: Google restricted FAQ rich
       results to government/health sites, so the markup would be dead weight. */
    items: { q: string; a: string }[]
  }
  contact: {
    heading: string
    subtitle: string
    /* Micro-CTA under the phone number: names the free assessment to defuse
       the "what will this cost me" fear right where the call decision happens. */
    freeQuote: string
    name: string
    phone: string
    email: string
    message: string
    placeholders: { name: string; phone: string; email: string; message: string }
    /* Sits at the card's very bottom; * marks the required labels. */
    requiredNote: string
    /* Client-side validation messages (`error` below is the send failure). */
    validation: { required: string; phone: string; email: string }
    submit: string
    sending: string
    success: string
    error: string
  }
  a11y: {
    scrollToServices: string
    scrollToReviews: string
    scrollToFaq: string
    scrollToContact: string
    selectLanguage: string
    prevService: string
    nextService: string
    prevReview: string
    nextReview: string
  }
}

const en: Dictionary = {
  htmlLang: 'en',
  tagline: { top: 'Motor Sport', bottom: 'Auto Repair & Service' },
  services: {
    heading: 'Our Services',
    subtitle:
      'All makes and models — from daily drivers to sports cars. Call-outs across Donegal & Derry.',
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
          'Pads, discs, shocks, springs and bushings — everything that keeps you stopping straight and riding smooth on Irish roads.',
      },
      electrics: {
        title: 'Battery & Electrics',
        description:
          'Battery testing and replacement, alternators, starters and wiring faults — including the ones that only show up on cold mornings.',
      },
    },
  },
  location: {
    workshop: 'Workshop',
    openingHours: 'Opening Hours',
    days: { weekdays: 'Mon–Fri', saturday: 'Saturday', sunday: 'Sunday', closed: 'Closed' },
    callUs: 'Call Us',
    getDirections: 'Get Directions',
  },
  reviews: {
    heading: 'What Customers Say',
    items: [
      {
        name: 'Seán O’Doherty',
        text: 'Failed the NCT on brakes and a headlight. Alex had it sorted in a day and it flew through the retest. Fair price, no messing.',
      },
      {
        name: 'Niamh',
        text: 'Had a warning light two other garages couldn’t figure out. Alex found a wiring fault within the hour and explained everything before touching a thing.',
      },
      {
        name: 'Patrick Doyle',
        text: 'Timing belt done on my Passat. Kept me posted the whole way and the price matched the quote to the cent. Highly recommend.',
      },
      {
        name: 'Mary Brennan',
        text: 'Car wouldn’t start on a Monday morning and Alex came out to me. Genuinely sound, and honest about what actually needed doing.',
      },
      {
        name: 'John',
        text: 'Been to plenty of garages around Derry over the years — this is the first one I actually trust. No invented extras, just did the job.',
      },
      {
        name: 'Ciarán McLaughlin',
        text: 'Booked in for a full service before a long run down to Dublin. He spotted a worn belt that would have left me stranded and sorted it there and then.',
      },
      {
        name: 'Emma',
        text: 'Clutch started slipping on the way to work. Dropped the car in on Tuesday, had it back Thursday — and the bill came in under what I had braced myself for.',
      },
      {
        name: 'Michael Harkin',
        text: 'Brakes were squealing something awful. He showed me the worn pads, said the discs were still grand, and only charged for what was actually needed.',
      },
      {
        name: 'Aoife Doherty',
        text: 'Battery kept dying on cold mornings. Turned out to be the alternator — found and fixed the same day. Great to deal with, explains everything as he goes.',
      },
    ],
  },
  faq: {
    heading: 'Common Questions',
    items: [
      {
        q: 'Do you work on all makes?',
        a: 'Yes — all makes and models: daily drivers, vans and sports cars alike.',
      },
      {
        q: 'What does a pre-NCT check cover?',
        a: 'Brakes, suspension, lights, emissions and tyres — and we fix what needs fixing before the test. Retest checks too.',
      },
      {
        q: 'How do I book?',
        a: "Just call or WhatsApp — no forms, no waiting list. We'll agree a time that suits you.",
      },
      {
        q: 'How much will it cost?',
        a: 'You get an honest assessment and a clear quote before any work starts — no surprises on the invoice.',
      },
      {
        q: "My car won't start — can you come out?",
        a: "Yes, we do call-outs across Donegal and the Derry border area. Call us and we'll get to you.",
      },
      {
        q: 'Where exactly are you?',
        a: 'Killea, Co. Donegal — minutes from Derry. Get Directions on the next screen opens the route in Google Maps.',
      },
    ],
  },
  contact: {
    heading: 'Contact Us',
    subtitle: "Tell us what's wrong — we'll call you back.",
    freeQuote: 'Free assessment — just give us a call.',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    message: 'Message',
    placeholders: {
      name: 'John Murphy',
      phone: '+353 85 123 4567',
      email: 'you@example.com',
      message: 'e.g. Warning light is on — need a diagnostic',
    },
    requiredNote: 'Fields marked * are required.',
    validation: {
      required: 'This field is required.',
      phone: 'Enter a valid phone number.',
      email: 'Enter a valid email address.',
    },
    submit: 'Send',
    sending: 'Sending…',
    success: "Thanks! We'll get back to you soon.",
    error: 'Could not send — please call or WhatsApp us instead.',
  },
  a11y: {
    scrollToServices: 'Scroll to services',
    scrollToReviews: 'Scroll to reviews',
    scrollToFaq: 'Scroll to common questions',
    scrollToContact: 'Scroll to contact details',
    selectLanguage: 'Select language',
    prevService: 'Previous service',
    nextService: 'Next service',
    prevReview: 'Previous review',
    nextReview: 'Next review',
  },
}

const ru: Dictionary = {
  htmlLang: 'ru',
  tagline: { top: 'Motor Sport', bottom: 'Автосервис и ремонт' },
  services: {
    heading: 'Наши услуги',
    subtitle:
      'Все марки и модели — от повседневных авто до спорткаров. Выезд по Донеголу и Дерри.',
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
          'Колодки, диски, амортизаторы, пружины и сайлентблоки — всё, что обеспечивает уверенное торможение и плавный ход на ирландских дорогах.',
      },
      electrics: {
        title: 'Аккумулятор и электрика',
        description:
          'Проверка и замена аккумулятора, генераторы, стартеры и неисправности проводки — в том числе те, что проявляются только холодным утром.',
      },
    },
  },
  location: {
    workshop: 'Мастерская',
    openingHours: 'Часы работы',
    days: { weekdays: 'Пн–Пт', saturday: 'Суббота', sunday: 'Воскресенье', closed: 'Выходной' },
    callUs: 'Позвоните нам',
    getDirections: 'Построить маршрут',
  },
  reviews: {
    heading: 'Что говорят клиенты',
    items: [
      {
        name: 'Seán O’Doherty',
        text: 'Не прошёл NCT из-за тормозов и фары. Alex всё исправил за день, и пересдачу машина прошла влёгкую. Цена честная, без фокусов.',
      },
      {
        name: 'Niamh',
        text: 'Горела лампа, с которой не разобрались два других сервиса. Alex за час нашёл неисправность в проводке и всё объяснил до начала работ.',
      },
      {
        name: 'Patrick Doyle',
        text: 'Менял ремень ГРМ на Passat. Держал в курсе на каждом шаге, а цена совпала со сметой до цента. Очень рекомендую.',
      },
      {
        name: 'Mary Brennan',
        text: 'Машина не завелась в понедельник утром — Alex приехал сам. Порядочный человек, честно говорит, что действительно нужно делать.',
      },
      {
        name: 'John',
        text: 'За годы объездил немало сервисов вокруг Дерри — это первый, которому по-настоящему доверяю. Никаких выдуманных доплат, просто сделал работу.',
      },
      {
        name: 'Ciarán McLaughlin',
        text: 'Записался на полное ТО перед дальней поездкой в Дублин. Он заметил изношенный ремень, из-за которого я бы застрял на трассе, и заменил его сразу же.',
      },
      {
        name: 'Emma',
        text: 'По дороге на работу начало буксовать сцепление. Отдала машину во вторник, в четверг забрала — и счёт вышел меньше, чем я готовилась заплатить.',
      },
      {
        name: 'Michael Harkin',
        text: 'Тормоза скрипели ужасно. Он показал мне стёртые колодки, сказал, что диски ещё в порядке, и взял только за то, что действительно было нужно.',
      },
      {
        name: 'Aoife Doherty',
        text: 'Аккумулятор садился каждое холодное утро. Оказалось, дело в генераторе — нашёл и починил в тот же день. Приятно иметь дело: объясняет всё по ходу.',
      },
    ],
  },
  faq: {
    heading: 'Частые вопросы',
    items: [
      {
        q: 'Берёте любые марки?',
        a: 'Да — любые марки и модели: повседневные авто, фургоны и спорткары.',
      },
      {
        q: 'Что входит в проверку перед NCT?',
        a: 'Тормоза, подвеска, свет, выхлоп и шины — и устраняем всё, что нужно, до теста. Проверка перед пересдачей тоже.',
      },
      {
        q: 'Как записаться?',
        a: 'Просто позвоните или напишите в WhatsApp — без форм и очередей. Подберём удобное время.',
      },
      {
        q: 'Сколько это будет стоить?',
        a: 'Сначала честная диагностика и понятная смета — работы начинаются только после согласования, без сюрпризов в счёте.',
      },
      {
        q: 'Машина не заводится — приедете?',
        a: 'Да, выезжаем по Донеголу и приграничью Дерри. Позвоните — приедем.',
      },
      {
        q: 'Где вы находитесь?',
        a: 'Killea, графство Донегол — в нескольких минутах от Дерри. Кнопка «Построить маршрут» на следующем экране откроет путь в Google Maps.',
      },
    ],
  },
  contact: {
    heading: 'Контакты',
    subtitle: 'Опишите проблему — мы перезвоним.',
    freeQuote: 'Бесплатная оценка — просто позвоните.',
    name: 'Имя',
    phone: 'Телефон',
    email: 'Почта',
    message: 'Сообщение',
    placeholders: {
      name: 'Иван Петров',
      phone: '+353 85 123 4567',
      email: 'you@example.com',
      message: 'напр. Горит лампа на панели — нужна диагностика',
    },
    requiredNote: 'Поля, отмеченные *, обязательны для заполнения.',
    validation: {
      required: 'Обязательное поле.',
      phone: 'Введите корректный номер телефона.',
      email: 'Введите корректный адрес почты.',
    },
    submit: 'Отправить',
    sending: 'Отправляем…',
    success: 'Спасибо! Мы скоро свяжемся с вами.',
    error: 'Не удалось отправить — позвоните или напишите в WhatsApp.',
  },
  a11y: {
    scrollToServices: 'Перейти к услугам',
    scrollToReviews: 'Перейти к отзывам',
    scrollToFaq: 'Перейти к частым вопросам',
    scrollToContact: 'Перейти к контактам',
    selectLanguage: 'Выбрать язык',
    prevService: 'Предыдущая услуга',
    nextService: 'Следующая услуга',
    prevReview: 'Предыдущий отзыв',
    nextReview: 'Следующий отзыв',
  },
}

const ga: Dictionary = {
  htmlLang: 'ga',
  tagline: { top: 'Motor Sport', bottom: 'Deisiú & Seirbhís Gluaisteán' },
  services: {
    heading: 'Ár Seirbhísí',
    subtitle:
      'Gach déanamh agus múnla — ó ghluaisteáin laethúla go spórtcharranna. Glaonna amach ar fud Dhún na nGall agus Dhoire.',
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
          'Pillíní, dioscaí, turraingí, spriongaí agus muileataí — gach rud a choinníonn ag stopadh díreach agus ag taisteal go réidh thú ar bhóithre na hÉireann.',
      },
      electrics: {
        title: 'Cadhnra & Leictreachas',
        description:
          'Tástáil agus athsholáthar cadhnra, ailtéarnóirí, tosaitheoirí agus fabhtanna sreangaithe — na cinn nach dtaispeánann iad féin ach ar maidin fhuar san áireamh.',
      },
    },
  },
  location: {
    workshop: 'Ceardlann',
    openingHours: 'Uaireanta Oscailte',
    days: { weekdays: 'Luan–Aoine', saturday: 'Satharn', sunday: 'Domhnach', closed: 'Dúnta' },
    callUs: 'Glaoigh Orainn',
    getDirections: 'Faigh Treoracha',
  },
  reviews: {
    heading: 'Céard a Deir Custaiméirí',
    items: [
      {
        name: 'Seán O’Doherty',
        text: 'Theip orm san NCT mar gheall ar na coscáin agus ceannsolas. Bhí sé curtha ina cheart ag Alex in aon lá amháin agus d’éirigh go breá leis an atástáil. Praghas cothrom, gan aon chur i gcéill.',
      },
      {
        name: 'Niamh',
        text: 'Bhí solas rabhaidh ann nach raibh dhá gharáiste eile in ann a dhéanamh amach. D’aimsigh Alex locht sreangaithe laistigh d’uair an chloig agus mhínigh sé gach rud sula ndearna sé tada.',
      },
      {
        name: 'Patrick Doyle',
        text: 'Crios ama déanta ar mo Passat. Choinnigh sé ar an eolas mé an bealach ar fad agus bhí an praghas díreach mar a gealladh. Mholfainn go mór é.',
      },
      {
        name: 'Mary Brennan',
        text: 'Ní thosódh an carr maidin Dé Luain agus tháinig Alex amach chugam. Fear ionraic, macánta faoina raibh le déanamh i ndáiríre.',
      },
      {
        name: 'John',
        text: 'Bhí mé i neart garáistí thart ar Dhoire thar na blianta — seo an chéad cheann a bhfuil muinín agam as i ndáiríre. Gan aon bhreiseáin chumtha, rinneadh an jab.',
      },
      {
        name: 'Ciarán McLaughlin',
        text: 'Chuir mé isteach é le haghaidh seirbhís iomlán roimh thuras fada go Baile Átha Cliath. Thug sé faoi deara crios caite a d’fhágfadh sáinnithe mé, agus dheisigh sé láithreach é.',
      },
      {
        name: 'Emma',
        text: 'Thosaigh an crág ag sleamhnú ar an mbealach chun na hoibre. D’fhág mé isteach Dé Máirt é agus bhí sé ar ais agam Déardaoin — agus bhí an bille níos lú ná mar a raibh súil agam leis.',
      },
      {
        name: 'Michael Harkin',
        text: 'Bhí na coscáin ag díoscán go huafásach. Thaispeáin sé na pillíní caite dom, dúirt sé go raibh na dioscaí fós ceart go leor, agus níor ghearr sé ach as an méid a bhí ag teastáil.',
      },
      {
        name: 'Aoife Doherty',
        text: 'Bhí an ceallra ag fáil bháis gach maidin fhuar. Ba é an t-ailtéarnóir ba chúis leis — aimsíodh agus deisíodh é an lá céanna. Iontach le déileáil leis, míníonn sé gach rud.',
      },
    ],
  },
  faq: {
    heading: 'Ceisteanna Coitianta',
    items: [
      {
        q: 'An oibríonn sibh ar gach déanamh?',
        a: 'Oibrímid — gach déanamh agus múnla: gluaisteáin laethúla, veaineanna agus carranna spóirt.',
      },
      {
        q: 'Cad a chlúdaíonn seiceáil réamh-NCT?',
        a: 'Coscáin, crochadh, soilse, astaíochtaí agus boinn — agus deisímid a bhfuil le deisiú roimh an tástáil. Seiceálacha atástála freisin.',
      },
      {
        q: 'Conas a chuirim in áirithe?',
        a: 'Glaoigh orainn nó seol WhatsApp — gan foirmeacha, gan liosta feithimh. Socróimid am a fheileann duit.',
      },
      {
        q: 'Cé mhéad a chosnóidh sé?',
        a: 'Gheobhaidh tú measúnú macánta agus luachan shoiléir sula dtosaíonn aon obair — gan aon iontas ar an sonrasc.',
      },
      {
        q: 'Ní thosaíonn mo charr — an dtiocfaidh sibh amach?',
        a: 'Tiocfaimid — déanaimid cuairteanna ar fud Dhún na nGall agus cheantar teorann Dhoire. Glaoigh orainn.',
      },
      {
        q: 'Cá bhfuil sibh go díreach?',
        a: 'Killea, Co. Dhún na nGall — cúpla nóiméad ó Dhoire. Osclaíonn "Faigh Treoracha" ar an gcéad scáileán eile an bealach in Google Maps.',
      },
    ],
  },
  contact: {
    heading: 'Déan Teagmháil Linn',
    subtitle: 'Inis dúinn cad atá cearr — glaofaimid ar ais ort.',
    freeQuote: 'Measúnú saor in aisce — níl le déanamh ach glaoch orainn.',
    name: 'Ainm',
    phone: 'Guthán',
    email: 'Ríomhphost',
    message: 'Teachtaireacht',
    placeholders: {
      name: 'Seán Ó Murchú',
      phone: '+353 85 123 4567',
      email: 'you@example.com',
      message: 'm.sh. Tá solas rabhaidh ar lasadh — teastaíonn diagnóisic',
    },
    requiredNote: 'Tá réimsí atá marcáilte le * riachtanach.',
    validation: {
      required: 'Tá an réimse seo riachtanach.',
      phone: 'Cuir isteach uimhir ghutháin bhailí.',
      email: 'Cuir isteach seoladh ríomhphoist bailí.',
    },
    submit: 'Seol',
    sending: 'Á sheoladh…',
    success: 'Go raibh maith agat! Beimid i dteagmháil leat go luath.',
    error: 'Níorbh fhéidir é a sheoladh — glaoigh orainn nó úsáid WhatsApp.',
  },
  a11y: {
    scrollToServices: 'Scrollaigh go dtí na seirbhísí',
    scrollToReviews: 'Scrollaigh go dtí na léirmheasanna',
    scrollToFaq: 'Scrollaigh go dtí na ceisteanna coitianta',
    scrollToContact: 'Scrollaigh go dtí na sonraí teagmhála',
    selectLanguage: 'Roghnaigh teanga',
    prevService: 'Seirbhís roimhe seo',
    nextService: 'An chéad seirbhís eile',
    prevReview: 'An léirmheas roimhe seo',
    nextReview: 'An chéad léirmheas eile',
  },
}

export const dictionaries: Record<Lang, Dictionary> = { en, ga, ru }
