/* Custom i18n instead of a library: the copy is a fixed, hand-authored set of
   strings across three languages, so a typed dictionary object plus a context
   hook is smaller and simpler than i18next (~15 kB gzip) and pulls in nothing.
   Draft ru/uk are ours, pending a copy pass from the Content manager. */

export type Lang = 'en' | 'ru' | 'uk'

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
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UK' },
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
      body: 'Не прошли NCT или боитесь не пройти? Проводим полную предпроверку — тормоза, подвеска, свет, выхлоп и шины — и устраняем всё необходимое, чтобы вы приехали на тест готовыми. Проверка перед пересдачей тоже.',
    },
    items: {
      servicing: {
        title: 'Техобслуживание',
        description:
          'Полное и промежуточное ТО для авто любых марок — масло и фильтры, жидкости и диагностика, которая находит проблемы до того, как они станут дорогими.',
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
          'Колодки, диски, амортизаторы, пружины и сайлентблоки — всё, что держит уверенное торможение и плавный ход на дорогах Донегола.',
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

const uk: Dictionary = {
  htmlLang: 'uk',
  tagline: { top: 'Motor Sport', bottom: 'Автосервіс і ремонт' },
  services: {
    heading: 'Наші послуги',
    preNct: {
      title: 'Підготовка до NCT та ремонт',
      body: 'Не пройшли NCT або боїтеся не пройти? Проводимо повну передперевірку — гальма, підвіска, світло, викиди та шини — й усуваємо все потрібне, щоб ви приїхали на тест готовими. Перевірка перед перескладанням теж.',
    },
    items: {
      servicing: {
        title: 'Техобслуговування',
        description:
          'Повне та проміжне ТО для авто будь-яких марок — олива й фільтри, рідини та перевірка, яка виявляє проблеми, поки вони не стали дорогими.',
      },
      diagnostics: {
        title: 'Діагностика',
        description:
          'Світиться лампа на панелі? Зчитуємо коди помилок дилерським обладнанням, знаходимо справжню причину й пояснюємо варіанти до початку робіт.',
      },
      engine: {
        title: 'Ремонт двигуна',
        description:
          'Від пропусків запалювання й течі оливи до капітального ремонту — спершу чесна оцінка, потім зрозумілий кошторис. Легкові, фургони та спорткари.',
      },
      timing: {
        title: 'Ремінь і ланцюг ГРМ',
        description:
          'Заміна ременя й ланцюга ГРМ на потрібному пробігу — робота, що захищає двигун від найдорожчої поломки.',
      },
      brakes: {
        title: 'Гальма та підвіска',
        description:
          'Колодки, диски, амортизатори, пружини та сайлентблоки — усе, що забезпечує впевнене гальмування й плавний хід на дорогах Донеголу.',
      },
      electrics: {
        title: 'Акумулятор та електрика',
        description:
          'Перевірка й заміна акумулятора, генератори, стартери та несправності проводки — зокрема ті, що з’являються лише холодного ранку.',
      },
    },
  },
  location: {
    heading: 'Як нас знайти',
    workshop: 'Майстерня',
    openingHours: 'Години роботи',
    days: { weekdays: 'Пн–Пт', saturday: 'Субота', sunday: 'Неділя', closed: 'Вихідний' },
    callUs: 'Зателефонуйте нам',
    getDirections: 'Прокласти маршрут',
  },
  a11y: {
    scrollToServices: 'Перейти до послуг',
    scrollToLocation: 'Перейти до контактів',
    selectLanguage: 'Вибрати мову',
    mapLabel: 'Карта з розташуванням майстерні Alex Motors',
    loadingMap: 'Завантаження карти…',
  },
}

export const dictionaries: Record<Lang, Dictionary> = { en, ru, uk }
