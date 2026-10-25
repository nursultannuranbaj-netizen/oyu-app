// Oyu course content: Modules 1–2. Every text is [KAZ, RUS, ENG].
// Source of truth for the texts: the course doc "Oyu: курс казахского орнамента".

export type Tri = [string, string, string];
export type TaskType = 'meaning' | 'category' | 'context';
export interface Task { t: TaskType; q: Tri; o: [Tri, Tri, Tri]; a: number }
export interface Ornament { kz: string; tr: string; gl: Tri; art: string; d: Tri; s: Tri; tasks: Task[] }
export interface CheckpointItem { q: Tri; o: [string, string, string] }
export interface Unit { title: Tri; lessons: string[] }
export interface Module { id: number; title: Tri; units: Unit[]; checkpoint: CheckpointItem[] }
export interface Course { modules: Module[]; orn: Record<string, Ornament> }

import { MORE_MODULES, MORE_ORN } from './content_more';

export const COURSE: Course = {
  modules: [
    {
      id: 1,
      title: ['Мүйіз бен мал', 'Рога и скот', 'Horns & Herds'],
      units: [
        { title: ['Мүйіз', 'Рога', 'Horns'], lessons: ['ZOO-001', 'ZOO-002', 'ZOO-003', 'ZOO-004'] },
        { title: ['Түйе мен жылқы', 'Верблюд и конь', 'Camel & Horse'], lessons: ['ZOO-005', 'ZOO-006', 'ZOO-007', 'ZOO-008'] },
        { title: ['Жануар сұлбасы', 'Силуэт животного', "The Animal's Frame"], lessons: ['ZOO-009', 'ZOO-010', 'ZOO-011'] }
      ],
      checkpoint: [
        { q: ['Текеметтің шетін қай оюмен көмкересің?', 'Каким узором ты обрамишь край текемета?', 'Which pattern will you use to frame the edge of a tekemet?'], o: ['ZOO-004', 'ZOO-002', 'ZOO-011'] },
        { q: ['Досың сапарға шығып барады. Қай ою оған «жолың болсын» дейді?', 'Друг отправляется в дальнюю дорогу. Какой узор пожелает ему доброго пути?', 'A friend is setting off on a long trip. Which pattern wishes them a safe journey?'], o: ['ZOO-006', 'ZOO-010', 'ZOO-001'] },
        { q: ['Өрмекке бейімделген, түзу сызықтардан құралған мүйізді тап.', 'Найди рог, собранный из прямых линий для ткацкого станка.', 'Find the horn built from straight lines for the loom.'], o: ['ZOO-003', 'ZOO-001', 'ZOO-007'] },
        { q: ['Сырмақтың ортасына үйге толық береке тілейтін ою салғың келеді.', 'Ты украшаешь центр сырмака и хочешь пожелать дому полного достатка.', "You're decorating the centre of a syrmak and want to wish the home complete well-being."], o: ['ZOO-011', 'ZOO-009', 'ZOO-005'] },
        { q: ['Қай ою киіз үйдің дөдегесінде жиі кездеседі?', 'Какой узор часто встречается на дөдеге юрты?', "Which pattern often appears on a yurt's dödege?"], o: ['ZOO-008', 'ZOO-003', 'ZOO-010'] }
      ]
    },
    {
      id: 2,
      title: ['Қанаттылар мен жәндіктер', 'Птицы и малые существа', 'Wings & Small Creatures'],
      units: [
        { title: ['Құстар', 'Птицы', 'Birds'], lessons: ['ZOO-012', 'ZOO-013', 'ZOO-014'] },
        { title: ['Іздер', 'Следы', 'Tracks'], lessons: ['ZOO-015', 'ZOO-016', 'ZOO-017'] },
        { title: ['Жәндіктер', 'Малые существа', 'Tiny Creatures'], lessons: ['ZOO-018', 'ZOO-019'] }
      ],
      checkpoint: [
        { q: ['Қыздың орамалының шетіне еркіндік пен бақыт тілейтін ою таңда.', 'Выбери для края девичьего платка узор, желающий свободы и счастья.', "Pick a pattern for the edge of a girl's headscarf that wishes freedom and happiness."], o: ['ZOO-012', 'ZOO-016', 'ZOO-017'] },
        { q: ['Аңшы орманда адаспау үшін қай таңбаны қашайды?', 'Какой знак охотник вырежет на дереве, чтобы не заблудиться?', 'Which mark will a hunter carve on a tree to avoid getting lost?'], o: ['ZOO-015', 'ZOO-018', 'ZOO-013'] },
        { q: ['Ағаш есікке қай оюды оюға болады?', 'Какой узор традиционно вырезали на деревянной двери юрты?', "Which pattern was traditionally carved on a yurt's wooden door?"], o: ['ZOO-017', 'ZOO-014', 'ZOO-019'] },
        { q: ['Үйдегілерді тіл-көзден қорғайтын оюды тап.', 'Найди узор-оберег от сглаза для всей семьи.', 'Find the pattern that protects the whole family from the evil eye.'], o: ['ZOO-019', 'ZOO-012', 'ZOO-015'] },
        { q: ['Баласын «қанатым» деп еркелететін анаға қай ою жарасады?', 'Какой узор подойдёт маме, которая зовёт ребёнка «қанатым»?', 'Which pattern suits a mother who calls her child qanatym?'], o: ['ZOO-013', 'ZOO-016', 'ZOO-018'] }
      ]
    }
  ],

  // t: meaning | category | context. o: options, a: index of the correct one.
  orn: {
    'ZOO-001': {
      kz: 'Мүйіз', tr: 'Müyiz', gl: ['мүйіз', 'рог', 'Horn'], art: 'muyiz',
      d: ['Қазақ оюының әліппесі: күрделі өрнектердің көбі осы қарапайым иірімнен құралады. Оны текемет пен сырмақтан, кілем мен шиден, тіпті ғимарат қасбетінен де көресіз.',
          'Азбука казахского узора: из этого простого завитка складывается большинство сложных орнаментов. Его встретишь на войлоках, коврах, циновках-ши и даже на фасадах зданий.',
          "The ABC of Kazakh ornament: most complex patterns grow out of this simple curl. You'll find it on felt rugs, carpets, reed screens and even building facades."],
      s: ['Мүйіз — мал байлығының, молшылық пен өмір күшінің белгісі.', 'Рог — знак богатых стад, изобилия и жизненной силы.', 'The horn stands for thriving herds, abundance and life force.'],
      tasks: [
        { t: 'meaning', q: ['Мүйіз оюы нені білдіреді?', 'Что означает мүйіз?', 'What does müyiz mean?'],
          o: [['Малдың молдығы мен береке', 'Изобилие и благополучие стада', 'Abundance and a thriving herd'], ['Үйге қайтар жол', 'Дорогу домой', 'The road home'], ['Жаңбырдан қорғану', 'Защиту от дождя', 'Protection from rain']], a: 0 },
        { t: 'category', q: ['Мүйіз қай топқа жатады?', 'К какой группе относится мүйіз?', 'Which group does müyiz belong to?'],
          o: [['Өсімдік', 'Растительный', 'Floral'], ['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Аспан денелері', 'Космогонический', 'Celestial']], a: 1 },
        { t: 'context', q: ['Мүйіз оюын қай бұйымнан жиі көреміз?', 'На каком предмете чаще всего встречается мүйіз?', 'Where are you most likely to see müyiz?'],
          o: [['Текемет', 'Войлочный ковёр текемет', 'A tekemet felt rug'], ['Қыш ыдыс', 'Кирпичная посуда', 'Brick pottery'], ['Мыс тиын', 'Медная монета', 'A copper coin']], a: 0 }
      ]
    },
    'ZOO-002': {
      kz: 'Қошқармүйіз', tr: 'Qoshqar müyiz', gl: ['қошқармүйіз', 'бараний рог', "Ram's Horn"], art: 'qoshqar',
      d: ['Қошқардың мүйізіне ұқсас екі ширатылған иірім — ең танымал қазақ оюы. Әдетте ол бұйымның ортасын алады: киіз, кілем, құрақ көрпе, күміс әшекей.',
          'Две тугие спирали, похожие на рога барана, — самый узнаваемый казахский мотив. Обычно он занимает центр изделия: войлока, ковра, лоскутного одеяла, серебряного украшения.',
          "Two tight spirals shaped like a ram's horns — the most recognisable Kazakh motif. It usually takes centre stage: on felt, carpets, patchwork quilts and silver jewellery."],
      s: ['Отбасының ырысы, күші мен берекесі.', 'Достаток, сила и процветание семьи.', 'Prosperity, strength and a flourishing family.'],
      tasks: [
        { t: 'meaning', q: ['Қошқармүйіз не тілейді?', 'Чего желает қошқармүйіз?', 'What does qoshqar müyiz wish for?'],
          o: [['Қайғы мен айрылыс', 'Печали и разлуки', 'Sorrow and parting'], ['Молшылық пен күш', 'Достатка и силы', 'Prosperity and strength'], ['Жауын-шашын', 'Дождя', 'Rain']], a: 1 },
        { t: 'category', q: ['Қошқармүйіз — қай топтағы ою?', 'К какой группе относится қошқармүйіз?', 'Which group is qoshqar müyiz in?'],
          o: [['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Геометриялық', 'Геометрический', 'Geometric'], ['Өсімдік', 'Растительный', 'Floral']], a: 0 },
        { t: 'context', q: ['Қошқармүйіз бұйымның қай жеріне жиі салынады?', 'Где на изделии чаще всего располагают қошқармүйіз?', 'Where on an object is qoshqar müyiz usually placed?'],
          o: [['Ортасына', 'В центре', 'In the centre'], ['Тек астарына', 'Только на подкладке', 'Only on the lining'], ['Тек түбіне', 'Только на дне', 'Only on the bottom']], a: 0 }
      ]
    },
    'ZOO-003': {
      kz: 'Сынықмүйіз', tr: 'Synyq müyiz', gl: ['сынықмүйіз', 'ломаный рог', 'Broken Horn'], art: 'synyq',
      d: ['Сол мүйіз иірімі, бірақ түзу сызықтар мен тік бұрыштардан құралған. Онымен кілем, ши, алаша, басқұр, қалта мен қоржындарды әшекейлеген.',
          'Тот же роговой завиток, но собранный из прямых отрезков и прямых углов. Им украшали ковры, ши, алаши, ленты-басқұр, сумки и қоржын.',
          'The same horn curl, rebuilt from straight segments and right angles. It decorated carpets, reed screens, flat-woven rugs, yurt bands, bags and saddlebags.'],
      s: ['Өрмекке бейімделген мүйіз: түзу сызықтар жіп торына оңай түседі.', 'Рог, приспособленный к ткацкому станку: прямые линии легко ложатся на сетку нитей.', 'A horn adapted to the loom: straight lines sit easily on the grid of threads.'],
      tasks: [
        { t: 'meaning', q: ['Неге бұл мүйіз «сынық» деп аталады?', 'Почему этот рог называют «сломанным»?', 'Why is this horn called "broken"?'],
          o: [['Ол шынымен сынған', 'Он правда сломан', 'It is actually broken'], ['Ол дөңгелектерден тұрады', 'Он состоит из кругов', 'It is made of circles'], ['Ол түзу сызықтар мен бұрыштардан құралған', 'Он собран из прямых линий и углов', 'It is built from straight lines and angles']], a: 2 },
        { t: 'category', q: ['Бұл ою жануардан алынған, бірақ сынық сызықпен салынған. Оны қалай саралаймыз?', 'Мотив пришёл из мира животных, но нарисован ломаными линиями. Как его классифицировать?', 'The motif comes from the animal world but is drawn with angular lines. How do we classify it?'],
          o: [['Тегі зооморфтық, пішіні геометриялық', 'Зооморфный по происхождению, геометрический по форме', 'Zoomorphic in origin, geometric in form'], ['Өсімдік', 'Растительный', 'Floral'], ['Аспан денелері', 'Космогонический', 'Celestial']], a: 0 },
        { t: 'context', q: ['Сынықмүйіз қай бұйымдарда кездеседі?', 'Где встречается сынықмүйіз?', 'Where do you find synyq müyiz?'],
          o: [['Қарудың сабында', 'На рукояти оружия', 'On weapon handles'], ['Кілем, ши мен қоржында', 'На коврах, ши и қоржыне', 'On carpets, reed screens and saddlebags'], ['Алтын сақинада', 'На золотых кольцах', 'On gold rings']], a: 1 }
      ]
    },
    'ZOO-004': {
      kz: 'Сыңармүйіз', tr: 'Syngar müyiz', gl: ['сыңармүйіз', 'одиночный рог', 'Single Horn'], art: 'syngar',
      d: ['Қос иірімнің бір жартысы тізбектеліп қайталанады. Бұл — жиек оюдың негізгі өрнегі: текемет пен сырмақтың шетін көмкереді немесе ортадағы оюды қоршайды.',
          'Половинка парного завитка, повторённая цепочкой. Это главный мотив каймы: он обрамляет текемет и сырмак или обводит центральный узор.',
          "One half of the paired curl, repeated in a chain. It's the go-to border motif, framing felt rugs or encircling the central design."],
      s: ['Жақтау: тізбектелген сыңар мүйіз бүкіл өрнекті біріктіріп тұрады.', 'Рамка: цепочка одиночных рогов собирает весь узор воедино.', 'A frame: a chain of single horns holds the whole pattern together.'],
      tasks: [
        { t: 'meaning', q: ['«Сыңармүйіз» дегеніміз не?', 'Сыңармүйіз — это…', 'Syngar müyiz is…'],
          o: [['Қос мүйіздің біреуі, тізбек болып қайталанады', 'Один рог из пары, повторённый цепочкой', 'One horn of a pair, repeated in a chain'], ['Тау ешкінің мүйізі', 'Рог горного козла', "A mountain goat's horn"], ['Сынған мүйіз', 'Сломанный рог', 'A broken horn']], a: 0 },
        { t: 'category', q: ['Сыңармүйіз қай топқа жатады?', 'К какой группе относится сыңармүйіз?', 'Which group is syngar müyiz in?'],
          o: [['Тұрмыстық', 'Бытовой', 'Household'], ['Өсімдік', 'Растительный', 'Floral'], ['Зооморфтық', 'Зооморфный', 'Zoomorphic']], a: 2 },
        { t: 'context', q: ['Сыңармүйіз текеметтің қай жеріне жиі салынады?', 'Где на текемете чаще всего идёт сыңармүйіз?', 'Where on a tekemet does syngar müyiz usually go?'],
          o: [['Жиегіне', 'По краю, в кайме', 'Along the edge, as a border'], ['Тек ортасына', 'Только в центре', 'Only in the centre'], ['Еш жеріне салынбайды', 'Нигде', 'Nowhere']], a: 0 }
      ]
    },
    'ZOO-005': {
      kz: 'Түйеөркеш', tr: 'Tüye örkesh', gl: ['түйеөркеш', 'верблюжий горб', "Camel's Hump"], art: 'tuyeorkesh',
      d: ['Түйе — төрт түліктің бірі, көш-қонда жүк артатын сенімді көлік. Шеберлер оның өркешін, мойнын, ізін, тіпті ботасының көзін оюға айналдырған; түйеөркеш көбіне жиек пен орта оюда кездеседі.',
          'Верблюд — одно из четырёх священных животных степи и надёжный «транспорт» кочевья. Мастера превратили в узор его горб, шею, след и даже глаза верблюжонка; горб чаще всего живёт в кайме и центральном орнаменте.',
          "The camel is one of the steppe's four sacred animals and the caravan's trusty transport. Artisans turned its hump, neck, footprint and even a calf's eyes into patterns; the hump lives in borders and central designs."],
      s: ['Төзімділік пен ұзақ жолдағы адал серік.', 'Выносливость и верный спутник в долгом пути.', 'Endurance and a faithful companion on the long road.'],
      tasks: [
        { t: 'meaning', q: ['Түйеөркеш ненің белгісі?', 'Что символизирует түйеөркеш?', 'What does tüye örkesh symbolise?'],
          o: [['Төзімділік пен адал серік', 'Выносливость и верного спутника', 'Endurance and a faithful companion'], ['Көктемгі гүлдеу', 'Весеннее цветение', 'Spring blossom'], ['Жұлдызды аспан', 'Звёздное небо', 'The starry sky']], a: 0 },
        { t: 'category', q: ['Түйеөркеш қай топқа жатады?', 'К какой группе относится түйеөркеш?', 'Which group is tüye örkesh in?'],
          o: [['Жер-суға байланысты', 'Природный (земля и вода)', 'Landscape (earth & water)'], ['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Тұрмыстық', 'Бытовой', 'Household']], a: 1 },
        { t: 'context', q: ['Түйеөркеш бұйымның қай бөлігінде жиі кездеседі?', 'Где чаще всего встречается түйеөркеш?', 'Where is tüye örkesh most often found?'],
          o: [['Жиек пен орта оюда', 'В кайме и центральном узоре изделий', 'In borders and central designs'], ['Тек зергерлік бұйымда', 'Только на ювелирных украшениях', 'Only on jewellery'], ['Тек қару-жарақта', 'Только на оружии', 'Only on weapons']], a: 0 }
      ]
    },
    'ZOO-006': {
      kz: 'Түйетабан', tr: 'Tüye taban', gl: ['түйетабан', 'верблюжья стопа', "Camel's Foot"], art: 'tuyetaban',
      d: ['Түйенің жалпақ жұмсақ табанының ізі. Шеберлер оны ағашқа ойып, теріге бедер салып, кестеде және киіз бұйымдарда кеңінен қолданған.',
          'Отпечаток широкой мягкой стопы верблюда. Мастера вырезали его по дереву, тиснили на коже, вышивали и выкладывали на войлоке.',
          "The print of a camel's broad, soft foot. Artisans carved it in wood, tooled it into leather, embroidered it and laid it into felt."],
      s: ['Жолаушылар мен керуеншілердің оюы — «жолың болсын» деген тілек.', 'Узор путников и караванщиков — пожелание доброго пути.', "The travellers' and caravan drivers' motif — a wish for a safe journey."],
      tasks: [
        { t: 'meaning', q: ['Түйетабан қандай тілекті білдіреді?', 'Какое пожелание несёт түйетабан?', 'What wish does tüye taban carry?'],
          o: [['Жолың болсын', 'Доброго пути', 'A safe journey'], ['Тіл-көзден сақтану', 'Защиты от сглаза', 'Protection from the evil eye'], ['Мол өнім', 'Богатого урожая', 'A rich harvest']], a: 0 },
        { t: 'category', q: ['Түйетабан қай топқа жатады?', 'К какой группе относится түйетабан?', 'Which group is tüye taban in?'],
          o: [['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Геометриялық', 'Геометрический', 'Geometric'], ['Аспан денелері', 'Космогонический', 'Celestial']], a: 0 },
        { t: 'context', q: ['Түйетабанды қандай тәсілдермен жасаған?', 'В каких техниках выполняли түйетабан?', 'Which techniques were used for tüye taban?'],
          o: [['Тек шыныға сурет салу', 'Только роспись по стеклу', 'Only glass painting'], ['Ағаш оюы, теріге бедер салу, кесте', 'Резьба по дереву, тиснение по коже, вышивка', 'Woodcarving, leather tooling, embroidery'], ['Тек темір соғу', 'Только ковка железа', 'Only ironwork']], a: 1 }
      ]
    },
    'ZOO-007': {
      kz: 'Ботамойын', tr: 'Bota moyyn', gl: ['ботамойын', 'шея верблюжонка', "Camel Calf's Neck"], art: 'botamoyin',
      d: ['Ботаның иілген нәзік мойны. Қазақ оюы иілген, бұралған, еңкейген пішінді жақсы көреді, сондықтан өрнек әрдайым қозғалыста тұрғандай.',
          'Мягко изогнутая тонкая шея верблюжонка. Казахский узор любит гибкие, склонённые, закрученные формы, поэтому кажется, что он всегда в движении.',
          'The gently bent, slender neck of a camel calf. Kazakh ornament loves curving, bowing, twisting shapes, so its patterns always seem to be in motion.'],
      s: ['Тынымсыз қозғалыс пен икемділік.', 'Непрерывное движение и гибкость.', 'Never-ending motion and flexibility.'],
      tasks: [
        { t: 'meaning', q: ['Ботамойын нені бейнелейді?', 'Что передаёт ботамойын?', 'What does bota moyyn express?'],
          o: [['Қаталдық пен қозғалмастық', 'Строгость и неподвижность', 'Severity and stillness'], ['Қозғалыс пен икемділік', 'Движение и гибкость', 'Motion and flexibility'], ['Түн', 'Ночь', 'Night']], a: 1 },
        { t: 'category', q: ['Ботамойын қай топқа жатады?', 'К какой группе относится ботамойын?', 'Which group is bota moyyn in?'],
          o: [['Өсімдік', 'Растительный', 'Floral'], ['Тұрмыстық', 'Бытовой', 'Household'], ['Зооморфтық', 'Зооморфный', 'Zoomorphic']], a: 2 },
        { t: 'context', q: ['Ботамойынға қандай түстер тән?', 'Какие цвета традиционны для ботамойын?', 'Which colours are traditional for bota moyyn?'],
          o: [['Қызыл, қан қызыл, қоңыр', 'Красный, багровый, коричневый', 'Red, crimson, brown'], ['Күміс пен алтын', 'Серебро и золото', 'Silver and gold'], ['Күлгін', 'Сиреневый', 'Lilac']], a: 0 }
      ]
    },
    'ZOO-008': {
      kz: 'Атбасы', tr: 'At basy', gl: ['атбасы, жүген', 'голова коня, уздечка', "Horse's Head, Bridle"], art: 'atbasy',
      d: ['Жылқының басын бейнелейтін өрнек; оны «жүген» деп те атайды. Ол алаша, кілем, төсек жапқышта және киіз үйдің дөдегесінде жиі кездеседі.',
          'Стилизованная голова коня, её ещё называют «жүген» (уздечка). Узор часто встречается на алаше, коврах, покрывалах и на дөдеге — войлочной полосе, опоясывающей верх юрты.',
          "A stylised horse's head, also called jügen (bridle). It often appears on flat-woven rugs, carpets, bedspreads and the dödege — the felt band that crowns the top of a yurt."],
      s: ['Жылқы — көшпелінің қанаты: жолдағы серігі, батырдың досы, алысты жақын ететін күш.', 'Конь — крылья кочевника: спутник в дороге, друг воина и сила, сокращающая расстояния.', "The horse is the nomad's wings: a road companion, a warrior's friend and the power that shrinks distances."],
      tasks: [
        { t: 'meaning', q: ['Атбасы немен байланысты?', 'С чем связан атбасы?', 'What is at basy linked to?'],
          o: [['Өзенмен', 'С рекой', 'A river'], ['Жолдағы серік, көшпелінің қанаты — жылқымен', 'С конём — спутником и «крыльями» кочевника', 'The horse — the nomad\'s companion and "wings"'], ['Ағашпен', 'С деревом', 'A tree']], a: 1 },
        { t: 'category', q: ['Атбасы қай топқа жатады?', 'К какой группе относится атбасы?', 'Which group is at basy in?'],
          o: [['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Аспан денелері', 'Космогонический', 'Celestial'], ['Өсімдік', 'Растительный', 'Floral']], a: 0 },
        { t: 'context', q: ['Киіз үйдің қай жерінен атбасы оюын көруге болады?', 'Где на юрте можно увидеть атбасы?', 'Where on a yurt can you see at basy?'],
          o: [['Ошақтан', 'На очаге', 'On the hearth'], ['Дөдегеден', 'На дөдеге — войлочной полосе вверху юрты', 'On the dödege, the felt band at the top'], ['Есік алдындағы еденнен', 'На полу у порога', 'On the floor by the door']], a: 1 }
      ]
    },
    'ZOO-009': {
      kz: 'Жіліншік', tr: 'Jilinshik', gl: ['жіліншік', 'голенная кость', 'Shin Bone'], art: 'jilinshik',
      d: ['Малдың жіліншік сүйегінің пішінінен алынған өрнек. Онымен алаша, киіз тысқап, көрпеқап, басқұр мен бауларды безендірген.',
          'Узор повторяет форму голенной кости животного. Им украшали алашу, войлочные чехлы, чехлы для одеял, ленты-басқұр и тесьму юрты.',
          "This motif copies the shape of an animal's shin bone. It adorned flat-woven rugs, felt cases, quilt covers and woven yurt bands."],
      s: ['Беріктік пен күш; айтуынша, ертеде мұндай сүйек шоқпар ретінде де қолданылған.', 'Крепость и сила; по преданию, в древности такая кость служила боевой дубинкой.', 'Sturdiness and strength; legend has it such a bone once served as a war club.'],
      tasks: [
        { t: 'meaning', q: ['Жіліншік ненің белгісі?', 'Что символизирует жіліншік?', 'What does jilinshik symbolise?'],
          o: [['Беріктік пен күш', 'Крепость и силу', 'Sturdiness and strength'], ['Нәзіктік', 'Нежность', 'Tenderness'], ['Көктем', 'Весну', 'Spring']], a: 0 },
        { t: 'category', q: ['Жіліншік жануардың дене бітімінен алынған. Ол қай топқа жатады?', 'Жіліншік взят из строения тела животного. К какой группе он относится?', "Jilinshik comes from an animal's anatomy. Which group is it in?"],
          o: [['Тұрмыстық', 'Бытовой', 'Household'], ['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Өсімдік', 'Растительный', 'Floral']], a: 1 },
        { t: 'context', q: ['Жіліншік оюымен нені безендірген?', 'Что украшали жіліншіком?', 'What was decorated with jilinshik?'],
          o: [['Тек тиындарды', 'Только монеты', 'Only coins'], ['Басқұр мен киіз тысқаптарды', 'Ленты-басқұр и войлочные чехлы', 'Woven yurt bands and felt cases'], ['Тек қаруды', 'Только оружие', 'Only weapons']], a: 1 }
      ]
    },
    'ZOO-010': {
      kz: 'Қаңқа', tr: 'Qangqa', gl: ['қаңқа', 'скелет', 'Skeleton'], art: 'kanka',
      d: ['Далада жыртқыштар жеп кеткен малдан қалған сүйек. Шеберлер мұны да байқап, өнерге айналдырған: өрнек алаша, басқұр және кестеде кездеседі.',
          'Кости животного, оставшиеся в степи после хищников. Мастера подметили даже это и превратили в искусство: узор встречается на алаше, басқұре и в вышивке.',
          'The bones a herd animal left on the steppe after predators. Artisans noticed even this and turned it into art: the motif appears on flat-woven rugs, yurt bands and embroidery.'],
      s: ['Шебердің зейінділігі: айналадағының бәрі — шабыт көзі.', 'Наблюдательность мастера: вдохновение — во всём, что вокруг.', "The artisan's keen eye: inspiration is in everything around."],
      tasks: [
        { t: 'meaning', q: ['Қаңқа оюы шебер туралы не айтады?', 'Что рассказывает қаңқа о мастере?', 'What does qangqa tell us about the artisan?'],
          o: [['Оның зейінділігін', 'О его наблюдательности', 'Their keen eye'], ['Егіннің молдығын', 'О богатом урожае', 'A rich harvest'], ['Тойды', 'О свадьбе', 'A wedding']], a: 0 },
        { t: 'category', q: ['Қаңқа бұтаққа ұқсас. Шынында ол қай топқа жатады?', 'Қаңқа похож на веточку. К какой группе он относится на самом деле?', 'Qangqa looks like a twig. Which group does it really belong to?'],
          o: [['Өсімдік', 'Растительный', 'Floral'], ['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Аспан денелері', 'Космогонический', 'Celestial']], a: 1 },
        { t: 'context', q: ['Қаңқа қай бұйымдарда кездеседі?', 'Где встречается қаңқа?', 'Where is qangqa found?'],
          o: [['Алаша, басқұр, кесте', 'Алаша, басқұр, вышивка', 'Flat-woven rugs, yurt bands, embroidery'], ['Сырға', 'Серьги', 'Earrings'], ['Ер-тұрман', 'Сёдла и сбруя', 'Saddles and tack']], a: 0 }
      ]
    },
    'ZOO-011': {
      kz: 'Төртқұлақ', tr: 'Tört qulaq', gl: ['төртқұлақ', 'четыре уха', 'Four Ears'], art: 'tortkulak',
      d: ['Қошқармүйіз үлгісімен жасалған, төрт жаққа тараған өрнек. Ол кілем, алаша, тұскиіз бен сырмақтың ортасында, сәулет өнерінде қабырға қаптауда кездеседі.',
          'Крестообразный узор из бараньих рогов, расходящихся на четыре стороны. Он занимает центр ковров, алаши, тұскиіза и сырмака, а в архитектуре украшает облицовку стен.',
          'A cross of ram\'s-horn curls spreading in four directions. It takes the centre of carpets, flat-woven rugs, wall hangings and felt mosaics, and decorates wall cladding in architecture.'],
      s: ['Дүниенің төрт бұрышы және «төрт құбыласы тең» толықтық — молшылық пен береке.', 'Четыре стороны света и полнота во всём: изобилие и достаток.', 'The four corners of the world and completeness on every side: abundance and well-being.'],
      tasks: [
        { t: 'meaning', q: ['Төртқұлақ нені білдіреді?', 'Что означает төртқұлақ?', 'What does tört qulaq mean?'],
          o: [['Жалғыздықты', 'Одиночество', 'Loneliness'], ['Дүниенің төрт бұрышын және толық берекені', 'Четыре стороны света и полный достаток', 'The four corners of the world and complete well-being'], ['Ұзақ жолды', 'Долгую дорогу', 'A long road']], a: 1 },
        { t: 'category', q: ['Төртқұлақ мүйізден құралған, бірақ дүниенің төрт жағын бейнелейді. Онда қай екі топ тоғысады?', 'Төртқұлақ собран из рогов, но рассказывает о сторонах света. Какие две группы в нём встречаются?', 'Tört qulaq is built from horns but speaks of the cardinal directions. Which two groups meet in it?'],
          o: [['Зооморфтық пен аспан-ғарыштық', 'Зооморфная и космогоническая', 'Zoomorphic and celestial'], ['Өсімдік пен тұрмыстық', 'Растительная и бытовая', 'Floral and household'], ['Тек геометриялық', 'Только геометрическая', 'Geometric only']], a: 0 },
        { t: 'context', q: ['Төртқұлақ сырмақтың қай жеріне салынады?', 'Куда на сырмаке помещают төртқұлақ?', 'Where on a syrmak is tört qulaq placed?'],
          o: [['Ортасына', 'В центр', 'In the centre'], ['Тек жиегіне', 'Только в кайму', 'Only in the border'], ['Астарына', 'На изнанку', 'On the back']], a: 0 }
      ]
    },
    'ZOO-012': {
      kz: 'Құс оюлары', tr: 'Qus oyulary', gl: ['құс оюлары', 'птичьи узоры', 'Bird Patterns'], art: 'qus',
      d: ['Құстұмсық, қазмойын, аққу, қырғауыл, қараторғай — қазақ оюында құс бейнесі көп. Олар көбіне қыз-келіншектердің киімінде, тұскиіз бен төсек жапқышта, орамалдың шетінде кездеседі.',
          'Клюв, гусиная шея, лебедь, фазан, скворец — птиц в казахском узоре много. Чаще всего они живут на одежде девушек и молодых женщин, на тұскиізах, покрывалах и по краю платков.',
          "Beak, goose neck, swan, pheasant, starling — Kazakh ornament is full of birds. They mostly appear on girls' and young women's clothing, wall hangings, bedspreads and along the edges of headscarves."],
      s: ['Еркіндік пен бақыт.', 'Свобода и счастье.', 'Freedom and happiness.'],
      tasks: [
        { t: 'meaning', q: ['Құс оюлары нені білдіреді?', 'Что означают птичьи узоры?', 'What do bird patterns mean?'],
          o: [['Еркіндік пен бақыт', 'Свободу и счастье', 'Freedom and happiness'], ['Малдың молдығы', 'Богатство стада', 'A rich herd'], ['Батырдың күші', 'Силу воина', "A warrior's strength"]], a: 0 },
        { t: 'category', q: ['Құс оюлары қай топқа жатады?', 'К какой группе относятся птичьи узоры?', 'Which group do bird patterns belong to?'],
          o: [['Өсімдік', 'Растительный', 'Floral'], ['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Тұрмыстық', 'Бытовой', 'Household']], a: 1 },
        { t: 'context', q: ['Құс оюлары қайда жиі кездеседі?', 'Где чаще всего встречаются птичьи узоры?', 'Where are bird patterns most common?'],
          o: [['Қару-жарақта', 'На оружии', 'On weapons'], ['Ерлердің етігінде', 'На мужских сапогах', "On men's boots"], ['Қыз-келіншектердің киімінде, тұскиіз бен орамалда', 'На женской одежде, тұскиізах и платках', 'On women\'s clothing, wall hangings and headscarves']], a: 2 }
      ]
    },
    'ZOO-013': {
      kz: 'Құс қанаты', tr: 'Qus qanaty', gl: ['құс қанаты', 'птичье крыло', "Bird's Wing"], art: 'qanat',
      d: ['Жайылған қанат пішіні. Шеберлер оны балаға айтылатын «қанатым» деген ерке сөзден алып, кілем мен тұскиізге, қыздардың киіміне салған.',
          'Раскрытое крыло. Мастера вдохновились ласковым словом «қанатым» («моё крылышко»), которым казахи зовут детей, и перенесли образ на ковры, тұскиізы и девичью одежду.',
          'An open wing. Artisans drew on the tender word qanatym ("my little wing"), which Kazakhs use for children, and carried the image onto carpets, wall hangings and girls\' clothing.'],
      s: ['Балалар — ата-ананың қанаты: тірегі, қуаты және биікке ұшатын үміті.', 'Дети — крылья родителей: опора, сила и надежда, что они взлетят выше.', "Children are their parents' wings: their support, their strength and the hope that they'll fly higher."],
      tasks: [
        { t: 'meaning', q: ['«Құс қанаты» кімді бейнелейді?', 'Кого олицетворяет «птичье крыло»?', 'Who does the "bird\'s wing" stand for?'],
          o: [['Ата-ананың тірегі болатын балаларды', 'Детей — опору родителей', "Children — their parents' support"], ['Аңшыларды', 'Охотников', 'Hunters'], ['Қонақтарды', 'Гостей', 'Guests']], a: 0 },
        { t: 'category', q: ['Құс қанаты қай топқа жатады?', 'К какой группе относится құс қанаты?', 'Which group is qus qanaty in?'],
          o: [['Аспан денелері', 'Космогонический', 'Celestial'], ['Геометриялық', 'Геометрический', 'Geometric'], ['Зооморфтық', 'Зооморфный', 'Zoomorphic']], a: 2 },
        { t: 'context', q: ['Құс қанаты қай бұйымдарда кездеседі?', 'Где встречается құс қанаты?', 'Where is qus qanaty found?'],
          o: [['Кілем, тұскиіз, қыздардың киімі', 'Ковры, тұскиізы, девичья одежда', "Carpets, wall hangings, girls' clothing"], ['Найзаның ұшы', 'Наконечники копий', 'Spearheads'], ['Қазан', 'Котлы', 'Cauldrons']], a: 0 }
      ]
    },
    'ZOO-014': {
      kz: 'Қарлығаш', tr: 'Qarlyghash', gl: ['қарлығаш', 'ласточка', 'Swallow'], art: 'qarlygash',
      d: ['Қарлығаш — көктемнің хабаршысы. Қыздарына оның атын қойған халық бұл құсты оюларында да жиі бейнелеген.',
          'Ласточка — вестница весны. Её именем называли девочек, и её же мастера часто вплетали в узоры.',
          "The swallow is spring's messenger. Kazakhs named daughters after it, and artisans often wove it into their patterns."],
      s: ['Көктем мен жақсылық; қарлығаш ұя салған үйге береке қонады деп сенген.', 'Весна и добро; верили, что дом, где ласточка свила гнездо, ждёт благополучие.', 'Spring and goodness; people believed a home where a swallow nests will prosper.'],
      tasks: [
        { t: 'meaning', q: ['Қарлығаш ұя салған үй туралы не деп сенген?', 'Во что верили, если ласточка свила гнездо у дома?', 'What did people believe about a home where a swallow nests?'],
          o: [['Ол үйге береке қонады', 'В доме будет благополучие', 'It will prosper'], ['Құрғақшылық болады', 'Будет засуха', 'A drought will come'], ['Иелері көшіп кетеді', 'Хозяева уедут', 'The owners will move away']], a: 0 },
        { t: 'category', q: ['Қарлығаш қай топқа жатады?', 'К какой группе относится қарлығаш?', 'Which group is qarlyghash in?'],
          o: [['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Өсімдік', 'Растительный', 'Floral'], ['Жер-суға байланысты', 'Природный (земля и вода)', 'Landscape (earth & water)']], a: 0 },
        { t: 'context', q: ['Қарлығаш оюына қандай түстер тән?', 'Какие цвета традиционны для қарлығаш?', 'Which colours are traditional for qarlyghash?'],
          o: [['Алтын мен күміс', 'Золото и серебро', 'Gold and silver'], ['Көк, көгілдір, қара, қоңыр', 'Синий, голубой, чёрный, коричневый', 'Blue, light blue, black, brown'], ['Қызғылт', 'Розовый', 'Pink']], a: 1 }
      ]
    },
    'ZOO-015': {
      kz: 'Қарғатұяқ', tr: 'Qargha tuyaq', gl: ['қарғатұяқ', 'воронья лапа', "Crow's Foot"], art: 'qargatuyaq',
      d: ['Қарғаның аяқ ізі. Бұл өрнекте геометриялық пен зооморфтық үлгі тоғысады; ол негізінен тақыр кілем мен алашаны безендіреді.',
          'След вороны. В этом узоре встречаются геометрия и мир животных; им в основном украшают безворсовые ковры и алашу.',
          "A crow's footprint. Geometry meets the animal world in this motif; it mainly decorates flat-weave carpets and flat-woven rugs."],
      s: ['Бағыт табу; айтуынша, аңшылар орманда адаспау үшін ағашқа қарға ізінің таңбасын қашап отырған.', 'Умение найти дорогу; по преданию, охотники вырезали этот знак на деревьях, чтобы не заблудиться в лесу.', "Finding your way; legend has it hunters carved this mark on trees so they wouldn't get lost in the forest."],
      tasks: [
        { t: 'meaning', q: ['Қарғатұяқ нені білдіреді?', 'Что означает қарғатұяқ?', 'What does qargha tuyaq mean?'],
          o: [['Бағыт табуды', 'Умение найти дорогу', 'Finding your way'], ['Нәзіктікті', 'Нежность', 'Tenderness'], ['Мол өнімді', 'Богатый урожай', 'A rich harvest']], a: 0 },
        { t: 'category', q: ['Қарғатұяқта қай екі топ тоғысады?', 'Какие две группы встречаются в қарғатұяқе?', 'Which two groups meet in qargha tuyaq?'],
          o: [['Өсімдік пен тұрмыстық', 'Растительная и бытовая', 'Floral and household'], ['Аспан денелері мен су', 'Космогоническая и водная', 'Celestial and water'], ['Геометриялық пен зооморфтық', 'Геометрическая и зооморфная', 'Geometric and zoomorphic']], a: 2 },
        { t: 'context', q: ['Қарғатұяқ негізінен нені безендіреді?', 'Что в основном украшает қарғатұяқ?', 'What does qargha tuyaq mainly decorate?'],
          o: [['Тақыр кілем мен алашаны', 'Безворсовые ковры и алашу', 'Flat-weave carpets and flat-woven rugs'], ['Сырғаны', 'Серьги', 'Earrings'], ['Ағаш есікті', 'Деревянные двери', 'Wooden doors']], a: 0 }
      ]
    },
    'ZOO-016': {
      kz: 'Тышқан ізі', tr: 'Tyshqan izi', gl: ['тышқан ізі', 'мышиный след', 'Mouse Tracks'], art: 'tyshqan',
      d: ['Тышқанның ұсақ іздерінің тізбегі. Онымен кілем, қоржын, аяққап сияқты тұрмыстық бұйымдарды әшекейлеген, көбіне шет оюда кездеседі.',
          'Цепочка крошечных отпечатков. Им украшали ковры, қоржын, чехлы для посуды и другие бытовые вещи, чаще всего в кайме.',
          'A chain of tiny prints. It decorated carpets, saddlebags, dish cases and other household items, mostly in borders.'],
      s: ['Тышқан әрдайым адаммен қатар өмір сүрген; мүшел жылнамасы да тышқан жылынан басталады.', 'Мышь всегда жила рядом с человеком; с года Мыши начинается и двенадцатилетний цикл мүшел.', 'The mouse has always lived alongside people; it also opens the Kazakh twelve-year müshel cycle.'],
      tasks: [
        { t: 'meaning', q: ['Бұл оюда тышқан бен адамды не байланыстырады?', 'Что связывает мышь и человека в этом узоре?', 'What links the mouse and people in this pattern?'],
          o: [['Тышқан малды күзетеді', 'Мышь охраняет стада', 'The mouse guards the herds'], ['Тышқан әрдайым адаммен қатар өмір сүрген', 'Мышь всегда жила рядом с человеком', 'The mouse has always lived alongside people'], ['Тышқан жаңбыр алып келеді', 'Мышь приносит дождь', 'The mouse brings rain']], a: 1 },
        { t: 'category', q: ['Тышқан ізі қай топқа жатады?', 'К какой группе относится тышқан ізі?', 'Which group is tyshqan izi in?'],
          o: [['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Өсімдік', 'Растительный', 'Floral'], ['Аспан денелері', 'Космогонический', 'Celestial']], a: 0 },
        { t: 'context', q: ['Тышқан ізі бұйымның қай жерінде жиі кездеседі?', 'Где на изделии обычно идёт тышқан ізі?', 'Where on an object does tyshqan izi usually go?'],
          o: [['Орта медальонда', 'В центральном медальоне', 'In the central medallion'], ['Астарында', 'На подкладке', 'On the lining'], ['Шет оюда', 'В кайме', 'In the border']], a: 2 }
      ]
    },
    'ZOO-017': {
      kz: 'Итқұйрық', tr: 'It quyryq', gl: ['итқұйрық', 'собачий хвост', "Dog's Tail"], art: 'itquyryk',
      d: ['Иттің бұралған құйрығы. Өрнек көбіне сүйек пен ағаш бұйымдарда — киіз үйдің есігі мен төсекте, сондай-ақ төсек жапқышта, киіз бұйым мен етікте кездеседі.',
          'Закрученный хвост пса. Узор чаще всего встречается на изделиях из кости и дерева — двери юрты и кровати, — а ещё на покрывалах, войлоке и сапогах.',
          "A dog's curled tail. The motif mostly appears on bone and wooden objects — the yurt door and bed — as well as on bedspreads, felt and boots."],
      s: ['Шебердің табиғатқа зейіні: ит құйрығының иірімі де өрнекке айналған.', 'Внимание мастера к живой природе: даже завиток собачьего хвоста стал узором.', "The artisan's eye for nature: even the curl of a dog's tail became a pattern."],
      tasks: [
        { t: 'meaning', q: ['Итқұйрық шебер туралы не айтады?', 'Что итқұйрық говорит о мастере?', 'What does it quyryq tell us about the artisan?'],
          o: [['Оның табиғатқа зейінін', 'О его внимании к живой природе', 'Their eye for living nature'], ['Оның байлығын', 'О его богатстве', 'Their wealth'], ['Оның сапарын', 'О его путешествии', 'Their journey']], a: 0 },
        { t: 'category', q: ['Итқұйрық қай топқа жатады?', 'К какой группе относится итқұйрық?', 'Which group is it quyryq in?'],
          o: [['Тұрмыстық', 'Бытовой', 'Household'], ['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Жер-суға байланысты', 'Природный (земля и вода)', 'Landscape (earth & water)']], a: 1 },
        { t: 'context', q: ['Итқұйрықты көбіне қай бұйымдарға ойып салған?', 'На чём чаще всего вырезали итқұйрық?', 'Where was it quyryq most often carved?'],
          o: [['Сырғаға', 'На серьгах', 'On earrings'], ['Қазанға', 'На котлах', 'On cauldrons'], ['Киіз үйдің ағаш есігі мен төсегіне', 'На деревянной двери и кровати юрты', 'On the wooden yurt door and bed']], a: 2 }
      ]
    },
    'ZOO-018': {
      kz: 'Өрмекші', tr: 'Örmekshi', gl: ['өрмекші', 'паук', 'Spider'], art: 'ormekshi',
      d: ['Аяқтары төрт жаққа тарамдалған өрмекші сұлбасы. Өрнек басқұр мен тақыр кілемде, желбау, алаша және қоржындарда жиі кездеседі.',
          'Силуэт паука с лапками, расходящимися на четыре стороны. Узор часто встречается на басқұрах, безворсовых коврах, лентах-желбау, алашах и қоржынах.',
          "A spider's silhouette with legs spreading in four directions. It often appears on yurt bands, flat-weave carpets, decorative hangings, flat-woven rugs and saddlebags."],
      s: ['Байлық пен береке; үлкендер үйдегі өрмекшіні өлтірме, обал деп ескерткен.', 'Богатство и благополучие; старшие учили не убивать паука в доме — это грех (обал).', 'Wealth and blessing; elders taught never to kill a spider in the home — it was a sin (obal).'],
      tasks: [
        { t: 'meaning', q: ['Өрмекші оюы ненің белгісі?', 'Чего символ өрмекші?', 'What does örmekshi symbolise?'],
          o: [['Қауіп-қатердің', 'Опасности', 'Danger'], ['Байлық пен берекенің', 'Богатства и благополучия', 'Wealth and blessing'], ['Қыстың', 'Зимы', 'Winter']], a: 1 },
        { t: 'category', q: ['Өрмекші қай топқа жатады?', 'К какой группе относится өрмекші?', 'Which group is örmekshi in?'],
          o: [['Зооморфтық', 'Зооморфный', 'Zoomorphic'], ['Тұрмыстық', 'Бытовой', 'Household'], ['Өсімдік', 'Растительный', 'Floral']], a: 0 },
        { t: 'context', q: ['Өрмекші оюы қай бұйымдарда кездеседі?', 'Где встречается өрмекші?', 'Where is örmekshi found?'],
          o: [['Сақинада', 'На кольцах', 'On rings'], ['Қаруда', 'На оружии', 'On weapons'], ['Басқұр, алаша мен қоржында', 'На басқұрах, алашах и қоржынах', 'On yurt bands, flat-woven rugs and saddlebags']], a: 2 }
      ]
    },
    'ZOO-019': {
      kz: 'Құмырсқа', tr: 'Qumyrsqa', gl: ['құмырсқа', 'муравей', 'Ant'], art: 'qumyrsqa',
      d: ['Құрт-құмырсқа оюлары тобына жатады. Ол тақыр кілем, желбау, басқұр, алаша мен қоржында жиі кездеседі, ал торлы кілемде тұтас алаңды толтыра алады.',
          'Из семейства узоров о насекомых. Он часто встречается на безворсовых коврах, желбау, басқұрах, алашах и қоржынах, а в сетчатом ковре может заполнять всё поле.',
          'From the family of insect patterns. It often appears on flat-weave carpets, hangings, yurt bands, flat-woven rugs and saddlebags, and in lattice carpets it can fill the whole field.'],
      s: ['Отбасын тіл-көзден, ауру-сырқаудан қорғайтын ою; құмырсқа — табиғаттың тазалықшысы.', 'Оберег семьи от сглаза и болезней; муравей — санитар природы.', "A charm that protects the family from the evil eye and illness; the ant is nature's cleaner."],
      tasks: [
        { t: 'meaning', q: ['Құмырсқа оюы не үшін салынған?', 'Зачем изображали құмырсқа?', 'Why was qumyrsqa depicted?'],
          o: [['Отбасын тіл-көзден және аурудан қорғау үшін', 'Чтобы защитить семью от сглаза и болезней', 'To protect the family from the evil eye and illness'], ['Жолға шыққанда', 'Перед дальней дорогой', 'Before a long journey'], ['Тойға арнап', 'К свадьбе', 'For a wedding']], a: 0 },
        { t: 'category', q: ['Құмырсқа қай топқа жатады?', 'К какой группе относится құмырсқа?', 'Which group is qumyrsqa in?'],
          o: [['Өсімдік', 'Растительный', 'Floral'], ['Аспан денелері', 'Космогонический', 'Celestial'], ['Зооморфтық', 'Зооморфный', 'Zoomorphic']], a: 2 },
        { t: 'context', q: ['Құмырсқа оюы қай бұйымдарда кездеседі?', 'Где встречается құмырсқа?', 'Where is qumyrsqa found?'],
          o: [['Тақыр кілем, алаша, қоржын', 'Безворсовые ковры, алаша, қоржын', 'Flat-weave carpets, flat-woven rugs, saddlebags'], ['Сырға', 'Серьги', 'Earrings'], ['Пышақ', 'Ножи', 'Knives']], a: 0 }
      ]
    }
  }
};

COURSE.modules.push(...MORE_MODULES);
Object.assign(COURSE.orn, MORE_ORN);
