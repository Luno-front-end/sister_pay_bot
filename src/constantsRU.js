require("dotenv").config();

const textRu = {
//   priceDays: `Тариф: Standart
// Стоимость: 50.00 💵USD
// Срок действия: 1 месяц

// ✅ Вы получите доступ к следующим ресурсам:
// Mind & Body Online Club`,

  moreInfo: `Что такое закрытый канал «INSIGHT ROOM»?

Это полноценный мир психологии и эзотерики моими глазами😍 

Здесь я делюсь самыми рабочими методами и способами, чтобы действительно изменить жизнь, наладить отношения и реализовать себя. Это всё то, что работает лично у меня и у моих клиентов. Проверено👌

Это место, в котором собраны все мои знания и опыт за 10 лет обучений и 8 лет практики)
И они тут будут постоянно пополняться😊

Все материалы на канале изложены в виде курсов, лекций и челленджей. Они разбиты на самые важные сферы: состояние и эмоции, отношения, реализация и деньги и др.

Как только ты попадаешь на канал, тебе открывается огромное количество упражнений, видео и аудио по разным темам) С их помощью ты научишься управлять своим состоянием, проработаешь свои страхи, поймёшь, как построить здоровые отношения.

Заходи и просто начинай решать свой вопрос🙏 Ты можешь проходить курсы и челленджи сразу, никого не дожидаясь)

И также, на канале регулярно проходят онлайн встречи "вопрос-ответ") Ты всегда сможешь задать мне вопросы и получить поддержку в выполнении заданий.

Это максимально комфортный способ проработать актуальные вопросы, найти ответы и наконец-то выйти на другой уровень своей жизни🙏 

В моём поле становится легче, появляется ясность и открываются пути) Давай расти вместе. Присоединяйся❤️`,

  // choice: `Выбери один из вариантов:`,
  caption: `Привет❤️
Я очень рада видеть тебя здесь!

Ведь это значит, что ты уже на шаг ближе к решению своего волнующего вопроса. Давай начнём этот путь)

Этот бот поможет тебе получить доступ к моему закрытому каналу «INSIGHT ROOM»

После оплаты бот пришлёт тебе ссылку с доступом в канал🌷

*подписка - ежемесячная, оплата принимается в гривне или евро

*отписаться можно в любой момент

Техподдержка 👉@yanina_brekhova`,

  caption_two: `Стоимость подписки:

▪️Подписка на месяц - 0000€ | 000грн
▪️Подписка на 3 месяца - 0000€ | 000грн

*оплата автоматически конвертируется по курсу валют в дату оплаты`,

//   mySubscription: `⌛️ У Вас отсутствует подписка.
  

// Ознакомьтесь с тарифами, нажав на соответствующую кнопку.`,

//   clubRules: `Правила группы:
// ❗️2 раза в неделю селфи отчет после тренировки
// ❗️Закрита группа.
// Вся информация и материалы внутри группы конфиденциальны и не разглашаются
// ❗️Минимальный срок подписки - 1 мес. Гарантия возврата денег, если в течение 1 недели вам 
// что-то не подходит
// ❗️Подписка продлевается автоматически, в соответствии с выбранным тарифом
// ❗️ Организатор может исключить из группы участника с частичной компенсацией стоимости абонемента.`,
//   descriptionClub: `MIND & BODY ONLINE 
// HEALTH CLUB 

// Закрытая группа в Telegram для: обучения, поддержки, мотивации, общения, совместных тренировок и практик.
// Мой личный коучинг в чате 24/7

// Абонемент включает :

// ✅ Моя поддержка,общение и коррекция техники online 24/7
// ✅ 2 тренировки / практики со мной еженедельно (можно выполнять в записи)
// ✅ 3 персональные тренировки/консультации в (абонементе vip)
// ✅ Домашние задания и дополнительные материалы 
// ✅ Полезные привычки,знания и понимание процессов 
// ✅Современная диетология,рекомендации по добавкам и superfoods
// ✅ Снятие стресса и эмоциональный баланс
// ✅ Мотивация  и ответственность к занятиям в общем поле`,

//   errorRePay: `Упс, произошла какая-то ошибка с продолжением подписки. Пожалуйста проверьте свой баланс,
// или обратитесь к администратору. Если вы не хотите оплачивать подписку, нажмите на "⌛️ Моя подписка" и отпишитесь`,
//   goodSub: "Подписка была продлена!🫡 🎉",

  successPayment: `Твоя оплата прошла успешно 🥳

Обязательно ознакомься с правилами сообщества👇

1. У тебя всё получается правильно!
Мы здесь для того, чтобы решить твой запрос. Здесь нет ошибок или неправильной работы. Все происходит по готовности твоей психики🙏
Не стоит сравнивать свои результаты с результатами других участников. Каждый приходит из своей точки А и двигается к изменениям в своем темпе)

---------------------

2. Мы с вами создаём одно поле. И я хочу, чтобы это поле было ресурсным и наполняющим для всех нас)

Поэтому в чате мы не общаемся через жалобы и тяжёлые энергии. Не впадаем в страдания и не уходим в негатив с головой. Мы не приходим сливать свой негатив на других участников! 

Мы здесь в первую очередь для ресурса! Чтобы наконец-то решить свои затыки и войти в совершенно другое состояние.

И чтобы это получилось, чтобы быстро и легко получать результаты - нам всем нужно создать определенный настрой)

Конечно, все эмоции ок - и грусть, и злость. Но говорить о них можно по-разному. И одна формулировка будет забирать энергию и у тебя в том числе, а другая - давать силу на ее решение. Я за второй в-т)

👉Как написать в чате экологично, если вам очень плохо:
опишите свою ситуацию, свои чувства/мысли и в конце обязательно задайте свой вопрос (для чего вы делитесь? Что хотите получить в обратной связи? Что для вас важно?)

Табу на фразу "помогите/спасите") Вы достаточно целостны и сильны, чтобы подобрать нужные слова.

Всё) Готово❤️

---------------------

3. Быть честным и открытым
Чтобы энергия хорошо закрутилась, чату нужна жизнь) 

Каждое ваше сообщение даёт энергию на исполнение ваших желаний, получение результатов и ускорение)

Делитесь инсайтами, задавайте вопросы, благодарите себя и других участников - чем больше эмоций в ваших словах, тем круче будет всем нам❤️

---------------------

4. Не "лечить" других участников без запроса
Это безопасное пространство.
Мы не ставим диагнозы, не даём советы и не пишем обратную связь через "тебе нужно...".
Мы пишем только через Я-послания: я чувствую от твоих слов; я думаю...; у меня было вот так...вдруг и тебе пригодится".
Пожалуйста давайте уважать друг друга и максимально бережно подбирать слова.

---------------------

‼️Оскорбления, проявление враждебности, ненависти, создание конфликтов, мат в сторону других участников - БАН без предупреждения.


❌ Прямая или нативная реклама запрещена: реклама своих услуг, посторонние ссылки, спам и прочее - БАН без предупреждения.

---------------------

Если принимаешь правила, нажимай кнопку ниже для перехода в канал👇`,
};

const btnTextRu = {
  month: "🔲 Оплатить подписку",
  more: "🔲 Узнать больше",
  // tariff: "💵 Тарифы",
  // mySubscription: "⌛️ Моя подписка",
  // buy: "Оплатить",
  // back: "Назад",
  // buySubscription: "☑️ КУПИТЬ ПОДПИСКУ",
  // clubRules: `Правила клуба 🚩`,
  // descriptionClub: "Описание клуба 🧾",
  // errPaymentBtn: "Что-то пошло не так. Нажмите эту кнопку для возврата",
  // acceptPayment: "У вас уже куплена подписка. Назад",
  // cencelProtectionPayment: "Вы уверены, что хотите отписаться? ❌",
  // cencelPayment: "Прекратить оплачивать и отписаться.",
  // acceptCencelPayment:
  //   "Вы были отписаны от автосписания средств. По завершении даты подписки вы будете автоматически удалены из группы.",
};

const paymentTilteRu = {
  titleStandart: "Подписка на абонемент 1 месяц Standard 50$",
  titleVIP: "Подписка на абонемент 1 месяц VIP 150$",
};

module.exports = { textRu, btnTextRu, paymentTilteRu };
