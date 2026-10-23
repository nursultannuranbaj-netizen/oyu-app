import type { Tri } from './content';

export type Lang = 0 | 1 | 2; // 0 = Kazakh, 1 = Russian, 2 = English
export const LANG_LABELS = ['ҚАЗ', 'РУС', 'ENG'] as const;

export const T = {
  path: ['Жол', 'Путь', 'Path'],
  collection: ['Жинақ', 'Коллекция', 'Collection'],
  start: ['Бастау', 'Начать', 'Start'],
  next: ['Әрі қарай', 'Дальше', 'Continue'],
  check: ['Тексеру', 'Проверить', 'Check'],
  correct: ['Дұрыс!', 'Верно!', 'Correct!'],
  wrong: ['Қате', 'Неверно', 'Not quite'],
  rightAnswer: ['Дұрыс жауап:', 'Правильный ответ:', 'Correct answer:'],
  symbol: ['Мәні', 'Символ', 'Meaning'],
  newOrn: ['Жаңа ою', 'Новый орнамент', 'New ornament'],
  lessonDone: ['Сабақ аяқталды!', 'Урок пройден!', 'Lesson complete!'],
  cpDone: ['Бақылау нүктесі өтілді!', 'Чекпоинт пройден!', 'Checkpoint cleared!'],
  xpEarned: ['Ұпай', 'Опыт', 'XP earned'],
  accuracy: ['Дәлдік', 'Точность', 'Accuracy'],
  noHearts: ['Жүректер таусылды', 'Сердца закончились', 'Out of hearts'],
  noHeartsTxt: ['Жүректер әр 30 минут сайын бір-бірден қалпына келеді.', 'Сердца восстанавливаются по одному каждые 30 минут.', 'Hearts refill one by one every 30 minutes.'],
  refill: ['Жүректерді толтыру', 'Восстановить сердца', 'Refill hearts'],
  locked: ['Алдымен алдыңғы сабақты өт', 'Сначала пройди предыдущий урок', 'Finish the previous lesson first'],
  checkpoint: ['Бақылау нүктесі', 'Чекпоинт', 'Checkpoint'],
  module: ['Модуль', 'Модуль', 'Module'],
  whichOne: ['Қайсысы — «{n}»?', 'Где здесь «{n}»?', 'Which one is “{n}”?'],
  meaning: ['Мағынасын тап', 'Найди смысл', 'Match the meaning'],
  category: ['Тобын анықта', 'Определи группу', 'Name the group'],
  context: ['Қайда қолданылады?', 'Где применяется?', 'Where is it used?'],
  visual: ['Оюды таңда', 'Выбери узор', 'Pick the pattern'],
  settings: ['Баптаулар', 'Настройки', 'Settings'],
  language: ['Оқу тілі', 'Язык обучения', 'Learning language'],
  reset: ['Прогресті тазалау', 'Сбросить прогресс', 'Reset progress'],
  resetSure: ['Тағы бір рет бас — прогресс өшеді', 'Нажми ещё раз — прогресс сотрётся', 'Tap again to erase progress'],
  close: ['Жабу', 'Закрыть', 'Close'],
  notYet: ['Әлі ашылмаған', 'Ещё не открыт', 'Not unlocked yet'],
  learned: ['{n} / {t} ою үйренілді', 'Изучено {n} из {t}', '{n} of {t} learned'],
  added: ['Жинаққа қосылды:', 'В коллекции:', 'Added to collection:'],
  days: ['күн', 'дн.', 'days'],
  account: ['Аккаунт', 'Аккаунт', 'Account'],
  accountHint: ['Кіріңіз — прогресс барлық құрылғыда сақталады.', 'Войдите, чтобы прогресс сохранялся на всех устройствах.', 'Sign in to keep your progress on every device.'],
  email: ['Электрондық пошта', 'Электронная почта', 'Email'],
  sendCode: ['Код жіберу', 'Получить код', 'Send code'],
  codeSent: ['{e} адресіне код жібердік. Оны осында енгізіңіз.', 'Мы отправили код на {e}. Введите его здесь.', 'We sent a code to {e}. Enter it here.'],
  code: ['Хаттағы код', 'Код из письма', 'Code from the email'],
  signIn: ['Кіру', 'Войти', 'Sign in'],
  signOut: ['Шығу', 'Выйти', 'Sign out'],
  signedInAs: ['Кірген: {e}', 'Вы вошли как {e}', 'Signed in as {e}'],
  synced: ['Прогресс синхрондалды', 'Прогресс синхронизирован', 'Progress synced'],
  syncFailed: ['Синхрондау сәтсіз: интернетті тексеріңіз', 'Не удалось синхронизировать: проверьте интернет', "Couldn't sync: check your connection"],
  badEmail: ['Пошта адресін тексеріңіз', 'Проверьте адрес почты', 'Check the email address'],
  badCode: ['Код қате немесе ескірген', 'Код неверный или устарел', 'The code is wrong or expired'],
  syncOff: ['Синхрондау әлі қосылмаған (.env файлында Supabase кілттері жоқ).', 'Синхронизация не настроена: в .env нет ключей Supabase.', 'Sync is not set up: the .env file has no Supabase keys.'],
  quit: ['Шығу', 'Выйти', 'Quit'],
} satisfies Record<string, Tri>;

export type TKey = keyof typeof T;

export function makeT(lang: Lang) {
  return (k: TKey, vars?: Record<string, string | number>) => {
    let s = T[k][lang];
    if (vars) for (const v of Object.keys(vars)) s = s.replace('{' + v + '}', String(vars[v]));
    return s;
  };
}
export const tri = (a: Tri, lang: Lang) => a[lang];
