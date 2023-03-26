const $ = (el) => document.querySelector(el)
const All = (el) => document.querySelectorAll(el)
const id = (el) => document.getElementById(el)

let questionArray = 0,
    questionQuantity = 0,
    student = '',
    timerInterval,
    timer = 0

function timerStart() {
    timerInterval = setInterval(function () {
        timer += 1/60;
        let second = Math.floor(timer) - Math.floor(timer/60)*60,
            minute = Math.floor(timer/60);
        $('.timer').innerHTML = `<p>Потрачено времени ${minute < 10 ? "0" + minute.toString():second}:${second < 10 ? "0" + second.toString():second}</p>`
    })
}

function timerStop() {
    clearInterval(timerInterval)
}

function notAnswered() {
    let notAnsweredQuantity = 0
    for (let i = 0; i < questionQuantity; i++) {
        let obj = All(`input[name="ag${i+1}"]`),
            a = false
        for (let key = 0; key < obj.length; key++) {
            if (obj[key].checked) {
                a = true
                break
            }
        }
        if (a == false)
        {
            $(`.n${i+1}`).classList.toggle('notAnswered')
            notAnsweredQuantity++
        }
    }
    $('.omitted').innerHTML = `<p>Пропущено вопросов ${notAnsweredQuantity}</p>`
} // Количество вопросов без ответа

$('.questionQuantity').value = 5 // Количество вопросов при загрузке страницы

$('.questionQuantity').addEventListener("change", ()=> {
    let quantity = $('.questionQuantity').value
    if (quantity < 5) {
        $('.questionQuantity').value = 5
    }
    if (quantity > arrayQ.questions.length) {
        $('.questionQuantity').value = arrayQ.questions.length
    }
}) // Диапазон количества вопросов

function testStart() {
    student = $('.name').value
    $('.start').classList.toggle('hidden')
    $('.end').classList.toggle('hidden')
    $('.name').setAttribute('disabled', 'disabled')
    $('.questionQuantity').setAttribute('disabled', 'disabled')
    questionQuantity = $('.questionQuantity').value

    let xhr = new XMLHttpRequest()
    xhr.open('GET', "questions.json")
    xhr.responseType = "json"
    xhr.send()

    xhr.addEventListener("load", () => {
        $('.workspace').innerHTML = ""

        let responseObj = xhr.response
        questionArray = responseObj.questions.sort(() => Math.random() - 0.5).slice(0, questionQuantity)

        for (let i = 0; i < questionQuantity; i++) {
            let title = questionArray[i].title,
                answers = questionArray[i].answers
            $('.workspace').innerHTML += `<div class="question n${i + 1}"><p>${title}</p></div>`
            for (let a = 0; a < answers.length; a++) {
                if (answers[a].isTrue === true) {
                    $(`.n${i + 1}`).innerHTML += `<label><input class="test true" type="radio" id="true${i+1}" name="ag${i + 1}">${answers[a].answer}</label>`
                } else {
                    $(`.n${i + 1}`).innerHTML += `<label><input class="test false" type="radio" id="false" name="ag${i + 1}">${answers[a].answer}</label>`
                }
            }
        }
    })
} // Загрузить вопросы из документа

function localStart() {
    student = $('.name').value
    $('.start').classList.toggle('hidden')
    $('.end').classList.toggle('hidden')
    $('.name').setAttribute('disabled', 'disabled')
    $('.questionQuantity').setAttribute('disabled', 'disabled')
    questionQuantity = $('.questionQuantity').value

    $('.workspace').innerHTML = ""

    let responseObj = arrayQ
    questionArray = responseObj.questions.sort(() => Math.random() - 0.5).slice(0, questionQuantity)

    for (let i = 0; i < questionQuantity; i++) {
        let title = questionArray[i].title,
            answers = questionArray[i].answers
        $('.workspace').innerHTML += `<div class="question n${i + 1}"><p>${i+1}. ${title}</p></div>`
        for (let a = 0; a < answers.length; a++) {
            if (answers[a].isTrue === true) {
                $(`.n${i + 1}`).innerHTML += `<label><input class="test true" type="radio" id="true${i+1}" name="ag${i + 1}">${answers[a].answer}</label>`
            } else {
                $(`.n${i + 1}`).innerHTML += `<label><input class="test false" type="radio" id="false${i+1}" name="ag${i + 1}">${answers[a].answer}</label>`
            }
        }
    }
} // Загрузить вопросы из массива

$('.start').addEventListener('click', ()=> {
    if ($('.name').value != '') {
        localStart()
        timerStart()
    }
    else {
        alert('Вы не ввели ФИО!')
    }
}) // Начать тест

$('.end').addEventListener('click', ()=> {
    notAnswered()
    timerStop()
    let points = 0
    for (let i = 0; i < questionQuantity; i++) {
        if (id(`true${i+1}`).checked) {
            points++
        }
        id(`true${i+1}`).closest('label').classList.toggle('green')
    }
    All('input[class="test false"]:checked').forEach((item, key) => {
        item.closest('label').classList.toggle('red')
    })
    All('.test').forEach((item, key) => {
        item.setAttribute('disabled', 'disabled')
    })
    $('.points').innerHTML = `<p>Количество баллов: ${points}</p>`
    $('.interest').innerHTML = `<p>Процент правильных ответов: ${Math.round(points*100/questionQuantity)}%</p>`
    $('.student').innerHTML = `<p>ФИО: ${student}</p>`
    $('.end').classList.toggle('hidden')
    $('.restart').classList.toggle('hidden')
    id('header').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
}) // Закончить тест

$('.restart').addEventListener('click', ()=> {
    $('.points').innerHTML = ``
    $('.interest').innerHTML = ``
    $('.student').innerHTML = ``
    $('.restart').classList.toggle('hidden')
    $('.start').classList.toggle('hidden')
    $('.workspace').innerHTML = ""
    $('.name').removeAttribute('disabled', 'disabled')
    $('.questionQuantity').removeAttribute('disabled', 'disabled')
    $('.name').value = ''
    $('.timer').innerHTML = '<p>00:00</p>'
}) // Перезапустить тест

let arrayQ = {
    "questions": [
        {
            "title": "Вязкость жидкости – это свойство жидкости, проявляющееся",
            "answers": [
                {
                    "answer": "в покоящейся жидкости",
                    "isTrue": false
                },
                {
                    "answer": "при протекании жидкости",
                    "isTrue": true
                },
                {
                    "answer": "у идеальных жидкостей",
                    "isTrue": false
                },
                {
                    "answer": "только у крови",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Вязкость жидкости",
            "answers": [
                {
                    "answer": "это динамическое свойство жидкостей",
                    "isTrue": true
                },
                {
                    "answer": "это свойство, зависящее от плотности",
                    "isTrue": false
                },
                {
                    "answer": "это статическое свойство жидкостей",
                    "isTrue": false
                },
                {
                    "answer": "это свойство жидкости сохранять свой объем",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Ньютоновская жидкость - это",
            "answers": [
                {
                    "answer": "жидкость, вязкость которой зависит от её природы и от градиента давления",
                    "isTrue": false
                },
                {
                    "answer": "жидкость, вязкость которой зависит от её природы и от температуры",
                    "isTrue": true
                },
                {
                    "answer": "жидкость, вязкость которой зависит от её природы и от режима протекания",
                    "isTrue": false
                },
                {
                    "answer": "жидкость, вязкость которой зависит только от её природы",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Неньютоновская жидкость - это",
            "answers": [
                {
                    "answer": "жидкость, вязкость которой зависит от её природы и от температуры",
                    "isTrue": false
                },
                {
                    "answer": "жидкость, вязкость которой зависит только от её природы",
                    "isTrue": false
                },
                {
                    "answer": "жидкость, вязкость которой зависит от её природы, температуры и режима течения",
                    "isTrue": true
                },
                {
                    "answer": "жидкость, вязкость которой зависит только от её температуры",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какие жидкости можно отнести к ньютоновским?",
            "answers": [
                {
                    "answer": "коллоидные растворы",
                    "isTrue": false
                },
                {
                    "answer": "эмульсии",
                    "isTrue": false
                },
                {
                    "answer": "суспензии",
                    "isTrue": false
                },
                {
                    "answer": "истинные растворы",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Укажите пример неньютоновской жидкости ",
            "answers": [
                {
                    "answer": "вода",
                    "isTrue": false
                },
                {
                    "answer": "коллоидный раствор",
                    "isTrue": true
                },
                {
                    "answer": "истинныый раствор",
                    "isTrue": false
                },
                {
                    "answer": "расплав металла",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Турбулентное течение жидкости – это",
            "answers": [
                {
                    "answer": "течение, при котором скорость остается постоянной в данной точке",
                    "isTrue": false
                },
                {
                    "answer": "течение, при котором скорость хаотически изменяется ",
                    "isTrue": true
                },
                {
                    "answer": "течение, при котором скорость изменяется при переходе от одного слоя жидкости к другому",
                    "isTrue": false
                },
                {
                    "answer": "течение, при котором скорость остается постоянной во всех точках потока",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Ламинарное течение жидкости – это",
            "answers": [
                {
                    "answer": "течение, при котором скорость хаотически изменяется",
                    "isTrue": false
                },
                {
                    "answer": "течение, при котором скорость остается постоянной в данной точке",
                    "isTrue": true
                },
                {
                    "answer": "течение, при котором скорость одинакова во всех точках русла",
                    "isTrue": false
                },
                {
                    "answer": "течение, при котором скорость медленно изменяется со временем",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "При течении жидкости по трубе, скорость молекул  по сечению трубы",
            "answers": [
                {
                    "answer": "одинаковая во всех точках",
                    "isTrue": false
                },
                {
                    "answer": "изменяется по параболическому закону",
                    "isTrue": true
                },
                {
                    "answer": "изменяется по линейному закону",
                    "isTrue": false
                },
                {
                    "answer": "изменяется по экспоненциальному закону",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Вязкость крови в клинических условиях определяют с помощью",
            "answers": [
                {
                    "answer": "вискозиметра Гесса",
                    "isTrue": true
                },
                {
                    "answer": "вискозиметра Оствальда",
                    "isTrue": false
                },
                {
                    "answer": "метода Стокса",
                    "isTrue": false
                },
                {
                    "answer": "метода Холла",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Кровь человека по природе – это",
            "answers": [
                {
                    "answer": "ньютоновская жидкость",
                    "isTrue": false
                },
                {
                    "answer": "неньютоновская жидкость",
                    "isTrue": false
                },
                {
                    "answer": "жидкость, которая при определенных условиях может рассматриваться как ньютоновская",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Плазма крови человека – это",
            "answers": [
                {
                    "answer": "жидкость, которая при определенных условиях может рассматриваться как ньютоновская",
                    "isTrue": false
                },
                {
                    "answer": "ньютоновская жидкость",
                    "isTrue": true
                },
                {
                    "answer": "неньютоновская жидкость",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Закон Пуазейля для линейной скорости описывается формулой:",
            "answers": [
                {
                    "answer": "V=URT (dC/dx)",
                    "isTrue": false
                },
                {
                    "answer": "V=R²ΔP /(8ηl)",
                    "isTrue": true
                },
                {
                    "answer": "V=Dρ/8ηl ",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Линейная скорость при переходе от отдела к отделу в кровеносной системе",
            "answers": [
                {
                    "answer": "остается постоянной во всех отделах",
                    "isTrue": false
                },
                {
                    "answer": "от аорты к капиллярам уменьшается, а затем возрастает",
                    "isTrue": true
                },
                {
                    "answer": "от аорты к капиллярам возрастает, а затем уменьшается",
                    "isTrue": false
                },
                {
                    "answer": "постепенно уменьшается во всех отделах",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Объемная скорость при переходе от отдела к отделу в кровеносной системе",
            "answers": [
                {
                    "answer": "остается постоянной во всех отделах",
                    "isTrue": true
                },
                {
                    "answer": "от аорты к капиллярам уменьшается, а затем возрастает",
                    "isTrue": false
                },
                {
                    "answer": "от аорты к капиллярам возрастает, а затем уменьшается",
                    "isTrue": false
                },
                {
                    "answer": "постепенно уменьшается во всех отделах",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите отдел кровеносного русла, представленный  резистивными сосудами",
            "answers": [
                {
                    "answer": "аорта",
                    "isTrue": false
                },
                {
                    "answer": "вены",
                    "isTrue": false
                },
                {
                    "answer": "артериолы",
                    "isTrue": true
                },
                {
                    "answer": "венулы",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите отдел кровеносного русла, представленный ёмкостными сосудами",
            "answers": [
                {
                    "answer": "аорта",
                    "isTrue": false
                },
                {
                    "answer": "вены",
                    "isTrue": false
                },
                {
                    "answer": "артериолы",
                    "isTrue": false
                },
                {
                    "answer": "венулы",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Укажите отдел кровеносного русла, в котором средняя линейная скорость крови наибольшая",
            "answers": [
                {
                    "answer": "аорта",
                    "isTrue": true
                },
                {
                    "answer": "вены",
                    "isTrue": false
                },
                {
                    "answer": "артериолы",
                    "isTrue": false
                },
                {
                    "answer": "венулы",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите отдел кровеносного русла, в котором средняя линейная скорость крови наименьшая",
            "answers": [
                {
                    "answer": "аорта",
                    "isTrue": false
                },
                {
                    "answer": "вены",
                    "isTrue": false
                },
                {
                    "answer": "артериолы",
                    "isTrue": true
                },
                {
                    "answer": "венулы",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите сосуды, в которых гидравлическое сопротивление крови наибольшее",
            "answers": [
                {
                    "answer": "аорта",
                    "isTrue": false
                },
                {
                    "answer": "вены",
                    "isTrue": true
                },
                {
                    "answer": "артериолы",
                    "isTrue": false
                },
                {
                    "answer": "венулы",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите сосуды, в которых гидравлическое сопротивление крови наименьшее",
            "answers": [
                {
                    "answer": "аорта",
                    "isTrue": true
                },
                {
                    "answer": "вены",
                    "isTrue": false
                },
                {
                    "answer": "артериолы",
                    "isTrue": false
                },
                {
                    "answer": "венулы",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "В каком отделе кровеносного русла происходит наибольшее падение давления крови?",
            "answers": [
                {
                    "answer": "аорта",
                    "isTrue": false
                },
                {
                    "answer": "артериолы",
                    "isTrue": true
                },
                {
                    "answer": "капилляры",
                    "isTrue": false
                },
                {
                    "answer": "венулы",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите физическую основу клинического метода измерения давления крови (по Короткову)",
            "answers": [
                {
                    "answer": "вязкость крови",
                    "isTrue": false
                },
                {
                    "answer": "характер течения крови",
                    "isTrue": true
                },
                {
                    "answer": "скорость крови",
                    "isTrue": false
                },
                {
                    "answer": "показатель гематокрита крови",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "В какой момент регистрируется систолическое артериальное давление крови (по Короткову)?",
            "answers": [
                {
                    "answer": "при появлении признаков ламинарного течения",
                    "isTrue": false
                },
                {
                    "answer": "при появлении признаков турбулентного течения",
                    "isTrue": true
                },
                {
                    "answer": "при появления признаков прекращения движения крови",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "В какой момент регистрируется диастолическое артериальное давление крови (по Короткову)?",
            "answers": [
                {
                    "answer": "при появлении признаков ламинарного течения",
                    "isTrue": true
                },
                {
                    "answer": "при появлении признаков турбулентного течения",
                    "isTrue": false
                },
                {
                    "answer": "при появления признаков прекращения движения крови",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Гальванизация – это метод воздействия",
            "answers": [
                {
                    "answer": "переменным электрическим током",
                    "isTrue": false
                },
                {
                    "answer": "постоянным электрическим током",
                    "isTrue": true
                },
                {
                    "answer": "импульсным электрическим током",
                    "isTrue": false
                },
                {
                    "answer": "электромагнитными волнами",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Постоянный электрический ток это",
            "answers": [
                {
                    "answer": "Упорядоченное движение нейтронов",
                    "isTrue": false
                },
                {
                    "answer": "ток не меняющийся со временем ни по величине ни по направлению",
                    "isTrue": true
                },
                {
                    "answer": "следующие друг за другом электрические импульсы",
                    "isTrue": false
                },
                {
                    "answer": "ток меняющийся со временем по величине и направлению по закону синуса или косинуса",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Постоянный электрический ток это",
            "answers": [
                {
                    "answer": "Упорядоченное движение нейтронов",
                    "isTrue": false
                },
                {
                    "answer": "ток не меняющийся со временем ни по величине ни по направлению",
                    "isTrue": true
                },
                {
                    "answer": "следующие друг за другом электрические импульсы",
                    "isTrue": false
                },
                {
                    "answer": "ток меняющийся со временем по величине и направлению по закону синуса или косинуса",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Гальванизация вызывает в биотканях тепловой эффект?",
            "answers": [
                {
                    "answer": "да",
                    "isTrue": false
                },
                {
                    "answer": "нет",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Какой электрический ток используется в методе лечебного электрофореза",
            "answers": [
                {
                    "answer": "переменный",
                    "isTrue": false
                },
                {
                    "answer": "постоянный",
                    "isTrue": true
                },
                {
                    "answer": "импульсный",
                    "isTrue": false
                },
                {
                    "answer": "электрический ток не используется",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какие ионы раствора лекарственного препарата вводятся при лечебном электрофорезе из-под катода?",
            "answers": [
                {
                    "answer": "анионы",
                    "isTrue": true
                },
                {
                    "answer": "катионы",
                    "isTrue": false
                },
                {
                    "answer": "катионы и анионы",
                    "isTrue": false
                },
                {
                    "answer": "этим методом ионы не вводят",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какие ионы раствора лекарственного препарата вводятся при лечебном электрофорезе из-под анода?",
            "answers": [
                {
                    "answer": "анионы",
                    "isTrue": false
                },
                {
                    "answer": "катионы",
                    "isTrue": true
                },
                {
                    "answer": "катионы и анионы",
                    "isTrue": false
                },
                {
                    "answer": "этим методом ионы не вводят",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Как изменяется во времени сила тока при прохождении через большинство биологических тканей?",
            "answers": [
                {
                    "answer": "возрастает",
                    "isTrue": false
                },
                {
                    "answer": "убывает",
                    "isTrue": true
                },
                {
                    "answer": "не изменяется",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Что такое порог ощутимого тока?",
            "answers": [
                {
                    "answer": "Максимальная сила тока, раздражающее действие которого ощущается человеком",
                    "isTrue": false
                },
                {
                    "answer": "Минимальная сила тока, раздражающее действие которого ощущается человеком",
                    "isTrue": true
                },
                {
                    "answer": "Ток при котором могут наступить серьёзные последствия для здоровья человека",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Поляризация, характерная для полярных молекул вещества",
            "answers": [
                {
                    "answer": "Электронная",
                    "isTrue": false
                },
                {
                    "answer": "Макроструктурная",
                    "isTrue": false
                },
                {
                    "answer": "Электролитическая",
                    "isTrue": false
                },
                {
                    "answer": "Ориентационная",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Поляризация, характерная для не полярных молекул вещества",
            "answers": [
                {
                    "answer": "Поверхностная",
                    "isTrue": false
                },
                {
                    "answer": "Макроструктурная",
                    "isTrue": false
                },
                {
                    "answer": "Электронная",
                    "isTrue": true
                },
                {
                    "answer": "Ориентационная",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Электролитической диссоциацией называется",
            "answers": [
                {
                    "answer": "Распад молекул электролита на ионы под действием электрического тока",
                    "isTrue": false
                },
                {
                    "answer": "Распад молекул электролита на ионы под действием электрического поля полярных молекул воды",
                    "isTrue": true
                },
                {
                    "answer": "Распад молекул электролита на ионы под действием потока фотонов",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "что такое \"петля тока\"?",
            "answers": [
                {
                    "answer": "путь в организме с наибольшим сопротивлением",
                    "isTrue": false
                },
                {
                    "answer": "путь в организме с наименьшим сопротивлением",
                    "isTrue": true
                },
                {
                    "answer": "путь в организме левая рука- правая рука",
                    "isTrue": false
                },
                {
                    "answer": "путь в организме левая рука- левая нога",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Каким сопротивлением не обладают биологические ткани?",
            "answers": [
                {
                    "answer": "емкостным",
                    "isTrue": false
                },
                {
                    "answer": "индуктивным",
                    "isTrue": true
                },
                {
                    "answer": "омическим",
                    "isTrue": false
                },
                {
                    "answer": "емкостным и омическим",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Импеданс – это полное сопротивление биотканей",
            "answers": [
                {
                    "answer": "постоянному электрическому току",
                    "isTrue": false
                },
                {
                    "answer": "переменному электрическому току",
                    "isTrue": true
                },
                {
                    "answer": "импульсному электрическому току",
                    "isTrue": false
                },
                {
                    "answer": "электромагнитным волнам",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "единицы измерения электрического импеданса",
            "answers": [
                {
                    "answer": "Ампер",
                    "isTrue": false
                },
                {
                    "answer": "Вольт",
                    "isTrue": false
                },
                {
                    "answer": "Герц",
                    "isTrue": false
                },
                {
                    "answer": "Ом",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Дисперсией электропроводности называется",
            "answers": [
                {
                    "answer": "зависимость силы тока от приложенного к биоткани напряжения",
                    "isTrue": false
                },
                {
                    "answer": "зависимость электрических свойств биоткани от частоты переменного тока",
                    "isTrue": true
                },
                {
                    "answer": "зависимость пороговой силы тока от длительности импульса",
                    "isTrue": false
                },
                {
                    "answer": "зависимость механических свойств биоткани от приложенного напряжения",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "единицы измерения силы электрического тока",
            "answers": [
                {
                    "answer": "Ампер в секунду",
                    "isTrue": false
                },
                {
                    "answer": "Вольт",
                    "isTrue": true
                },
                {
                    "answer": "Ампер",
                    "isTrue": false
                },
                {
                    "answer": "Ватт",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Электрический ток, изменяющийся во времени и по величине и по направлению, называется",
            "answers": [
                {
                    "answer": "переменный электрический ток",
                    "isTrue": true
                },
                {
                    "answer": "импульсный электрический ток",
                    "isTrue": false
                },
                {
                    "answer": "постоянный электрический ток",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Электрический ток, изменяющийся во времени по величине, но не по направлению, называется",
            "answers": [
                {
                    "answer": "переменный электрический ток",
                    "isTrue": false
                },
                {
                    "answer": "импульсный электрический ток",
                    "isTrue": true
                },
                {
                    "answer": "постоянный электрический ток",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Единицы измерения электрической мощности",
            "answers": [
                {
                    "answer": "Ватт",
                    "isTrue": true
                },
                {
                    "answer": "Джоуль",
                    "isTrue": false
                },
                {
                    "answer": "Ватт в секунду",
                    "isTrue": false
                },
                {
                    "answer": "Ампер",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "С увеличением крутизны фронта отдельного импульса его раздражающий эффект",
            "answers": [
                {
                    "answer": "возрастает",
                    "isTrue": true
                },
                {
                    "answer": "убывает",
                    "isTrue": false
                },
                {
                    "answer": "не меняется",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Хронаксиметрия – это метод исследования функционального состояния легковозбудимых биотканей при действии на них",
            "answers": [
                {
                    "answer": "постоянным током",
                    "isTrue": false
                },
                {
                    "answer": "импульсным током",
                    "isTrue": true
                },
                {
                    "answer": "переменным и постоянным током",
                    "isTrue": false
                },
                {
                    "answer": "электромагнитными волнами",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Кривая электровозбудимости – это зависимость",
            "answers": [
                {
                    "answer": "порогового значения импульсного тока от длительности импульса",
                    "isTrue": true
                },
                {
                    "answer": "мембранного потенциала аксона кальмара от времени",
                    "isTrue": false
                },
                {
                    "answer": "импеданса биоткани от частоты переменного тока",
                    "isTrue": false
                },
                {
                    "answer": "электропроводности биоткани от температуры",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите количественные характеристики хронаксиметрии.",
            "answers": [
                {
                    "answer": "реобаза и хронаксия",
                    "isTrue": true
                },
                {
                    "answer": "импеданс и электропроводность",
                    "isTrue": false
                },
                {
                    "answer": "реобаза и импеданс",
                    "isTrue": false
                },
                {
                    "answer": "хронаксия и электропроводность",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какой из параметров, измеряемых в хронаксиметрии, является пороговым значением импульсного тока?",
            "answers": [
                {
                    "answer": "хронаксия",
                    "isTrue": false
                },
                {
                    "answer": "реобаза",
                    "isTrue": true
                },
                {
                    "answer": "импеданс",
                    "isTrue": false
                },
                {
                    "answer": "электропроводность",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какой из параметров, измеряемых в хронаксиметрии, измеряется в миллисекундах?",
            "answers": [
                {
                    "answer": "хронаксия",
                    "isTrue": true
                },
                {
                    "answer": "реобаза",
                    "isTrue": false
                },
                {
                    "answer": "подвижность ионов",
                    "isTrue": false
                },
                {
                    "answer": "период импульсного тока",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какой из параметров, измеряемых в хронаксиметрии, измеряется в миллиамперах?",
            "answers": [
                {
                    "answer": "хронаксия",
                    "isTrue": true
                },
                {
                    "answer": "реобаза",
                    "isTrue": false
                },
                {
                    "answer": "электропроводность",
                    "isTrue": false
                },
                {
                    "answer": "подвижность ионов",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Импульсный ток с частотой в пределах 50 –100 Гц вызывает в биотканях",
            "answers": [
                {
                    "answer": "раздражающее действие",
                    "isTrue": true
                },
                {
                    "answer": "тепловое действие",
                    "isTrue": false
                },
                {
                    "answer": "не оказывает никакого действия",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Переменный ток с частотой свыше 500 Кгц вызывает в биотканях",
            "answers": [
                {
                    "answer": "раздражающее действие",
                    "isTrue": false
                },
                {
                    "answer": "тепловое действие",
                    "isTrue": true
                },
                {
                    "answer": "не оказывает никакого действия",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Под действием переменного тока высоких частот  (диатермия) лучше прогреваются",
            "answers": [
                {
                    "answer": "биоткани- проводники",
                    "isTrue": true
                },
                {
                    "answer": "биоткани- диэлектрики",
                    "isTrue": false
                },
                {
                    "answer": "тепловой эффект отсутствует",
                    "isTrue": false
                },
                {
                    "answer": "одинаково биоткани - проводники и диэлектрики",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Вынужденные колебания происходят с частотой, равной",
            "answers": [
                {
                    "answer": "собственной частоте колебаний тела",
                    "isTrue": false
                },
                {
                    "answer": "частоте вынуждающей силы",
                    "isTrue": true
                },
                {
                    "answer": "механической частоте колебаний",
                    "isTrue": false
                },
                {
                    "answer": "внутренней частоте колебаний тела",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Затухающие колебания – это колебания, у которых амплитуда",
            "answers": [
                {
                    "answer": "меняется по гармоническому закону",
                    "isTrue": false
                },
                {
                    "answer": "меняется по синусоидальному закону",
                    "isTrue": false
                },
                {
                    "answer": "увеличивается с течением времени",
                    "isTrue": false
                },
                {
                    "answer": "уменьшается с течением времени",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Какая величина является энергетической характеристикой механической волны?",
            "answers": [
                {
                    "answer": "интенсивность",
                    "isTrue": false
                },
                {
                    "answer": "частота",
                    "isTrue": false
                },
                {
                    "answer": "фаза",
                    "isTrue": false
                },
                {
                    "answer": "декремент",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Вектор Умова определяет",
            "answers": [
                {
                    "answer": "плотность потока частиц",
                    "isTrue": false
                },
                {
                    "answer": "плотность потока энергии",
                    "isTrue": true
                },
                {
                    "answer": "плотность среды",
                    "isTrue": false
                },
                {
                    "answer": "плотность вакуумной среды",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Звук – это волна",
            "answers": [
                {
                    "answer": "длинномерная",
                    "isTrue": false
                },
                {
                    "answer": "механическая",
                    "isTrue": true
                },
                {
                    "answer": "электромагнитная",
                    "isTrue": false
                },
                {
                    "answer": "корпускулярнаяs",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Звук – это волна упругих колебаний",
            "answers": [
                {
                    "answer": "продольная",
                    "isTrue": false
                },
                {
                    "answer": "поперечная",
                    "isTrue": true
                },
                {
                    "answer": "скользящая",
                    "isTrue": false
                },
                {
                    "answer": "экспоненциальная",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Распространение колебаний в упругих средах в пределах частот от 16 Гц до 20кГц называется",
            "answers": [
                {
                    "answer": "инфразвук",
                    "isTrue": false
                },
                {
                    "answer": "звук",
                    "isTrue": true
                },
                {
                    "answer": "киберзвук",
                    "isTrue": false
                },
                {
                    "answer": "ультразвук",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Распространение колебаний в упругих средах в пределах частот ниже 16 Гц называется",
            "answers": [
                {
                    "answer": "инфразвук",
                    "isTrue": true
                },
                {
                    "answer": "звук",
                    "isTrue": false
                },
                {
                    "answer": "киберзвук",
                    "isTrue": false
                },
                {
                    "answer": "ультразвук",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Распространение колебаний в упругих средах в пределах частот свыше 20 кГц  называется",
            "answers": [
                {
                    "answer": "инфразвук",
                    "isTrue": false
                },
                {
                    "answer": "звук",
                    "isTrue": false
                },
                {
                    "answer": "киберзвук",
                    "isTrue": false
                },
                {
                    "answer": "ультразвук",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "С увеличением плотности среды скорость звука",
            "answers": [
                {
                    "answer": "не изменяется",
                    "isTrue": false
                },
                {
                    "answer": "возрастает",
                    "isTrue": true
                },
                {
                    "answer": "убывает",
                    "isTrue": false
                },
                {
                    "answer": "убывает экспоненциально",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Выберите физическую характеристику звука",
            "answers": [
                {
                    "answer": "громкость",
                    "isTrue": false
                },
                {
                    "answer": "частота",
                    "isTrue": true
                },
                {
                    "answer": "тембр",
                    "isTrue": false
                },
                {
                    "answer": "высота",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Выберите характеристику слухового ощущения",
            "answers": [
                {
                    "answer": "акустический спектр",
                    "isTrue": false
                },
                {
                    "answer": "интенсивность",
                    "isTrue": false
                },
                {
                    "answer": "частота",
                    "isTrue": false
                },
                {
                    "answer": "высота",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Какой звук представляет собой периодический процесс?",
            "answers": [
                {
                    "answer": "тон",
                    "isTrue": false
                },
                {
                    "answer": "шум",
                    "isTrue": true
                },
                {
                    "answer": "звуковой удар",
                    "isTrue": false
                },
                {
                    "answer": "звуковое давление",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Гармоническим законом описывается",
            "answers": [
                {
                    "answer": "сложный тон",
                    "isTrue": false
                },
                {
                    "answer": "простой тон",
                    "isTrue": true
                },
                {
                    "answer": "низкий тон",
                    "isTrue": false
                },
                {
                    "answer": "высокий тон",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Тембр звука как слуховое ощущение определяется",
            "answers": [
                {
                    "answer": "интенсивностью",
                    "isTrue": false
                },
                {
                    "answer": "акустическим спектром",
                    "isTrue": true
                },
                {
                    "answer": "громкостью",
                    "isTrue": false
                },
                {
                    "answer": "частотой",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Интенсивность как физическая характеристика звука определяет его",
            "answers": [
                {
                    "answer": "громкость",
                    "isTrue": true
                },
                {
                    "answer": "тембр",
                    "isTrue": false
                },
                {
                    "answer": "частоту",
                    "isTrue": false
                },
                {
                    "answer": "высоту",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Высота звука как слуховое ощущение определяется",
            "answers": [
                {
                    "answer": "интенсивностью",
                    "isTrue": false
                },
                {
                    "answer": "громкостью",
                    "isTrue": false
                },
                {
                    "answer": "акустическим спектром",
                    "isTrue": false
                },
                {
                    "answer": "частотой",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Частота как физическая характеристика звука определяет его",
            "answers": [
                {
                    "answer": "тембр",
                    "isTrue": false
                },
                {
                    "answer": "тембр",
                    "isTrue": false
                },
                {
                    "answer": "высоту",
                    "isTrue": true
                },
                {
                    "answer": "громкость",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Громкость звука как слуховое ощущение определяется",
            "answers": [
                {
                    "answer": "частотой",
                    "isTrue": false
                },
                {
                    "answer": "интенсивностью",
                    "isTrue": true
                },
                {
                    "answer": "акустическим спектром",
                    "isTrue": false
                },
                {
                    "answer": "высотой",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какие из перечисленных методов медицинской диагностики являются акустическими?",
            "answers": [
                {
                    "answer": "реография",
                    "isTrue": false
                },
                {
                    "answer": "компьютерная томография",
                    "isTrue": true
                },
                {
                    "answer": "аускультация",
                    "isTrue": false
                },
                {
                    "answer": "реокардиография",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какие из перечисленных методов медицинской диагностики являются акустическими?",
            "answers": [
                {
                    "answer": "реография",
                    "isTrue": false
                },
                {
                    "answer": "компьютерная томография",
                    "isTrue": false
                },
                {
                    "answer": "аускультация",
                    "isTrue": true
                },
                {
                    "answer": "реокардиография",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Величина, обратная периоду колебаний называется",
            "answers": [
                {
                    "answer": "фазой колебаний",
                    "isTrue": false
                },
                {
                    "answer": "частотой колебаний",
                    "isTrue": true
                },
                {
                    "answer": "амплитудой колебаний",
                    "isTrue": false
                },
                {
                    "answer": "интенсивностью колебаний",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Величина, обратная периоду колебаний называется",
            "answers": [
                {
                    "answer": "фазой колебаний",
                    "isTrue": false
                },
                {
                    "answer": "частотой колебаний",
                    "isTrue": true
                },
                {
                    "answer": "амплитудой колебаний",
                    "isTrue": false
                },
                {
                    "answer": "интенсивностью колебаний",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Расстояние, проходимое волной за время, равное периоду колебаний, называется",
            "answers": [
                {
                    "answer": "фазой волны",
                    "isTrue": false
                },
                {
                    "answer": "длиной волны",
                    "isTrue": true
                },
                {
                    "answer": "амплитудой волны",
                    "isTrue": false
                },
                {
                    "answer": "спектром волны",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Акустический спектр как физическая характеристика звука определяет его",
            "answers": [
                {
                    "answer": "широту",
                    "isTrue": false
                },
                {
                    "answer": "громкость",
                    "isTrue": false
                },
                {
                    "answer": "модуляцию",
                    "isTrue": false
                },
                {
                    "answer": "тембр",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Какие колебания могут вызвать резонанс в организме?",
            "answers": [
                {
                    "answer": "инфразвуковые",
                    "isTrue": true
                },
                {
                    "answer": "ультразвуковые",
                    "isTrue": false
                },
                {
                    "answer": "сверхзвуковые",
                    "isTrue": false
                },
                {
                    "answer": "надтональные",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "В медицине для массажа используют колебания",
            "answers": [
                {
                    "answer": "сверхзвуковые",
                    "isTrue": false
                },
                {
                    "answer": "инфразвуковые",
                    "isTrue": true
                },
                {
                    "answer": "ультразвуковые",
                    "isTrue": false
                },
                {
                    "answer": "надтональные",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите природу рентгеновского излучения",
            "answers": [
                {
                    "answer": "поток электронов",
                    "isTrue": true
                },
                {
                    "answer": "поток нейтрино",
                    "isTrue": false
                },
                {
                    "answer": "электромагнитная волна",
                    "isTrue": false
                },
                {
                    "answer": "поток антинейтрино",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Жесткое рентгеновское излучение – это излучение",
            "answers": [
                {
                    "answer": "с малой длиной волны и малой проникающей способностью",
                    "isTrue": false
                },
                {
                    "answer": "с большой длиной волны и большой проникающей способностью",
                    "isTrue": false
                },
                {
                    "answer": "с малой длиной волны и большой проникающей способностью",
                    "isTrue": true
                },
                {
                    "answer": "с большой длиной волны и малой проникающей способностью",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Мягкое рентгеновское излучение – это излучение",
            "answers": [
                {
                    "answer": "с малой длиной волны и малой проникающей способностью",
                    "isTrue": false
                },
                {
                    "answer": "с большой длиной волны и большой проникающей способностью",
                    "isTrue": false
                },
                {
                    "answer": "с малой длиной волны и большой проникающей способностью",
                    "isTrue": false
                },
                {
                    "answer": "с большой длиной волны и малой проникающей способностью",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "При прохождении через вещество интенсивность рентгеновского излучения",
            "answers": [
                {
                    "answer": "уменьшается",
                    "isTrue": true
                },
                {
                    "answer": "увеличивается",
                    "isTrue": false
                },
                {
                    "answer": "стабилизируется",
                    "isTrue": false
                },
                {
                    "answer": "не изменяется",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Компьютерная томография основана на использовании",
            "answers": [
                {
                    "answer": "альфа-излучения",
                    "isTrue": false
                },
                {
                    "answer": "бета-излучения",
                    "isTrue": false
                },
                {
                    "answer": "гамма-излучения",
                    "isTrue": false
                },
                {
                    "answer": "R-излучения",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Нестабильные химические элементы, способные к самопроизвольному распаду и осуществляющие его, называются",
            "answers": [
                {
                    "answer": "изотопами",
                    "isTrue": false
                },
                {
                    "answer": "радионуклидами",
                    "isTrue": true
                },
                {
                    "answer": "изомерами",
                    "isTrue": false
                },
                {
                    "answer": "квантами",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Число распадов радиоактивных ядер, происходящих за единицу времени называется",
            "answers": [
                {
                    "answer": "активностью радионуклида",
                    "isTrue": true
                },
                {
                    "answer": "поглощенной дозой",
                    "isTrue": false
                },
                {
                    "answer": "экспозиционной дозой",
                    "isTrue": false
                },
                {
                    "answer": "эквивалентной дозой",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Единицы измерения активности радионуклида",
            "answers": [
                {
                    "answer": "Генри",
                    "isTrue": false
                },
                {
                    "answer": "Беккерель",
                    "isTrue": true
                },
                {
                    "answer": "Грей",
                    "isTrue": false
                },
                {
                    "answer": "Рентген",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Для характеристики поглощенной энергии ионизирующего излучения единицей массы вещества используется понятие",
            "answers": [
                {
                    "answer": "экспозиционной дозы",
                    "isTrue": false
                },
                {
                    "answer": "поглощенной дозы",
                    "isTrue": true
                },
                {
                    "answer": "эквивалентной дозы",
                    "isTrue": false
                },
                {
                    "answer": "нет правильного ответа",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Для оценки поглощенной дозы служат следующие внесистемные единицы",
            "answers": [
                {
                    "answer": "Генри",
                    "isTrue": true
                },
                {
                    "answer": "Беккерель",
                    "isTrue": false
                },
                {
                    "answer": "Грей",
                    "isTrue": false
                },
                {
                    "answer": "Рентген",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какое излучение наименее опасно при внешнем облучении?",
            "answers": [
                {
                    "answer": "рентгеновское излучение",
                    "isTrue": false
                },
                {
                    "answer": "альфа-излучение",
                    "isTrue": false
                },
                {
                    "answer": "бета-излучение",
                    "isTrue": false
                },
                {
                    "answer": "поток фотонов",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Назовите единицы измерения эквивалентной дозы",
            "answers": [
                {
                    "answer": "Рентген",
                    "isTrue": false
                },
                {
                    "answer": "Бэр",
                    "isTrue": true
                },
                {
                    "answer": "Грэй",
                    "isTrue": false
                },
                {
                    "answer": "Беккерель",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Фотолюминесценция - это",
            "answers": [
                {
                    "answer": "излучение фотонов света",
                    "isTrue": false
                },
                {
                    "answer": "поглощение фотонов света",
                    "isTrue": true
                },
                {
                    "answer": "излучение альфа-частиц",
                    "isTrue": false
                },
                {
                    "answer": "поглощение бета-частиц",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Нейтральная фундаментальная частица с полуцелым спином, относящаяся к классу лептонов -",
            "answers": [
                {
                    "answer": "нейтрино",
                    "isTrue": true
                },
                {
                    "answer": "альфа-частица",
                    "isTrue": false
                },
                {
                    "answer": "протон",
                    "isTrue": false
                },
                {
                    "answer": "электрон",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Фотолюминесценция возникает за счет воздействия на вещество",
            "answers": [
                {
                    "answer": "фотонов света",
                    "isTrue": true
                },
                {
                    "answer": "потока электронов",
                    "isTrue": false
                },
                {
                    "answer": "потока нейтрино",
                    "isTrue": false
                },
                {
                    "answer": "потока альфа-частиц",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Катодолюминесценция возникает за счет воздействия на вещество",
            "answers": [
                {
                    "answer": "фотонов света",
                    "isTrue": true
                },
                {
                    "answer": "потока электронов",
                    "isTrue": false
                },
                {
                    "answer": "потока нейтрино",
                    "isTrue": false
                },
                {
                    "answer": "потока альфа-частиц",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Катодолюминесценция возникает за счет воздействия на вещество",
            "answers": [
                {
                    "answer": "фотонов света",
                    "isTrue": true
                },
                {
                    "answer": "потока электронов",
                    "isTrue": false
                },
                {
                    "answer": "потока нейтрино",
                    "isTrue": false
                },
                {
                    "answer": "потока альфа-частиц",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите, у какого из ионизирующих излучений ионизирующая способность больше?",
            "answers": [
                {
                    "answer": "альфа-излучение",
                    "isTrue": true
                },
                {
                    "answer": "бета-излучение",
                    "isTrue": false
                },
                {
                    "answer": "гамма-излучение",
                    "isTrue": false
                },
                {
                    "answer": "поток фотонов",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите, у какого из ионизирующих излучений проникающая способность больше?",
            "answers": [
                {
                    "answer": "альфа-излучение",
                    "isTrue": false
                },
                {
                    "answer": "бета-излучение",
                    "isTrue": false
                },
                {
                    "answer": "гамма-излучение",
                    "isTrue": true
                },
                {
                    "answer": "поток фотонов",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Для защиты от какого излучения человеку достаточно слоя воздуха, одежды?",
            "answers": [
                {
                    "answer": "альфа-излучение",
                    "isTrue": true
                },
                {
                    "answer": "бета-излучение",
                    "isTrue": false
                },
                {
                    "answer": "гамма-излучение",
                    "isTrue": false
                },
                {
                    "answer": "дельта-излучение",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Для защиты от какого излучения необходим толстый слой бетона, кирпича?",
            "answers": [
                {
                    "answer": "альфа-излучение",
                    "isTrue": false
                },
                {
                    "answer": "бета-излучение",
                    "isTrue": false
                },
                {
                    "answer": "гамма-излучение",
                    "isTrue": true
                },
                {
                    "answer": "дельта-излучение",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Для защиты от какого излучения необходим толстый слой бетона, кирпича?",
            "answers": [
                {
                    "answer": "альфа-излучение",
                    "isTrue": false
                },
                {
                    "answer": "бета-излучение",
                    "isTrue": false
                },
                {
                    "answer": "гамма-излучение",
                    "isTrue": true
                },
                {
                    "answer": "дельта-излучение",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какой из металлов хорошо поглощает ионизирующие излучения?",
            "answers": [
                {
                    "answer": "Al",
                    "isTrue": false
                },
                {
                    "answer": "Cu",
                    "isTrue": false
                },
                {
                    "answer": "Fe",
                    "isTrue": false
                },
                {
                    "answer": "Pb",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "При рентгеноскопии плотные ткани выглядят",
            "answers": [
                {
                    "answer": "более темными",
                    "isTrue": true
                },
                {
                    "answer": "более светлыми",
                    "isTrue": false
                },
                {
                    "answer": "не контрастными",
                    "isTrue": false
                },
                {
                    "answer": "нет правильного ответа",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "При рентгенографии плотные ткани на снимке выглядят",
            "answers": [
                {
                    "answer": "более светлыми",
                    "isTrue": true
                },
                {
                    "answer": "более темными",
                    "isTrue": false
                },
                {
                    "answer": "не контрастными",
                    "isTrue": false
                },
                {
                    "answer": "нет правильного ответа",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите единицу измерения экспозиционной дозы",
            "answers": [
                {
                    "answer": "Бэр",
                    "isTrue": false
                },
                {
                    "answer": "Грэй",
                    "isTrue": false
                },
                {
                    "answer": "Зиверт",
                    "isTrue": false
                },
                {
                    "answer": "Рентген",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Под действием переменного магнитного поля высоких частот лучше прогреваются",
            "answers": [
                {
                    "answer": "биоткани- проводники",
                    "isTrue": true
                },
                {
                    "answer": "биоткани- диэлектрики",
                    "isTrue": false
                },
                {
                    "answer": "тепловой эффект отсутствует",
                    "isTrue": false
                },
                {
                    "answer": "одинаково биоткани- проводники и диэлектрики",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Как изменяется электропроводность биотканей при увеличении частоты переменного тока?",
            "answers": [
                {
                    "answer": "увеличивается",
                    "isTrue": true
                },
                {
                    "answer": "уменьшается",
                    "isTrue": false
                },
                {
                    "answer": "не меняется",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Почему при увеличении частоты переменного тока электропроводность биотканей увеличивается?",
            "answers": [
                {
                    "answer": "уменьшается явление поляризации",
                    "isTrue": true
                },
                {
                    "answer": "увеличивается явление поляризации",
                    "isTrue": false
                },
                {
                    "answer": "меняется подвижность ионов",
                    "isTrue": false
                },
                {
                    "answer": "уменьшается омическое сопротивление биоткани",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Наблюдается ли дисперсия электропроводности у мертвых тканей?",
            "answers": [
                {
                    "answer": "да",
                    "isTrue": false
                },
                {
                    "answer": "нет",
                    "isTrue": true
                },
                {
                    "answer": "только при определённых условиях",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "В чем заключаются физические основы реографии?",
            "answers": [
                {
                    "answer": "в зависимости импеданса органа от его кровоснабжения",
                    "isTrue": true
                },
                {
                    "answer": "в зависимости импеданса органа от частоты переменного тока",
                    "isTrue": false
                },
                {
                    "answer": "в зависимости пороговой силы тока от длительности импульса",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Почему высокочастотные токи оказывают на ткани организма тепловое воздействие?",
            "answers": [
                {
                    "answer": "меняется подвижность ионов",
                    "isTrue": false
                },
                {
                    "answer": "увеличивается явление поляризации",
                    "isTrue": false
                },
                {
                    "answer": "уменьшается явление поляризации",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Электроды - это",
            "answers": [
                {
                    "answer": "диэлектрики",
                    "isTrue": false
                },
                {
                    "answer": "полупроводники",
                    "isTrue": false
                },
                {
                    "answer": "проводники для снятия сигнала электрической природы",
                    "isTrue": true
                },
                {
                    "answer": "проводники для снятия сигнала не электрической природы",
                    "isTrue": false
                },
                {
                    "answer": "преобразователи сигнала не электрической природы",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Датчики- это",
            "answers": [
                {
                    "answer": "проводники для снятия сигнала электрической природы",
                    "isTrue": false
                },
                {
                    "answer": "преобразователи сигнала не электрической природы",
                    "isTrue": true
                },
                {
                    "answer": "вольтметр и амперметр",
                    "isTrue": false
                },
                {
                    "answer": "гальванометр",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите устройство съема биосигнала электрической природы",
            "answers": [
                {
                    "answer": "электроды",
                    "isTrue": true
                },
                {
                    "answer": "датчики",
                    "isTrue": false
                },
                {
                    "answer": "тонометр",
                    "isTrue": false
                },
                {
                    "answer": "диэлектрики специальной формы",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Укажите устройство съема биосигнала неэлектрической природы с последующим преобразованием его в сигнал электрической природы.",
            "answers": [
                {
                    "answer": "электроды",
                    "isTrue": false
                },
                {
                    "answer": "датчики",
                    "isTrue": true
                },
                {
                    "answer": "амперметр и вольтметр",
                    "isTrue": false
                },
                {
                    "answer": "диэлектрики специальной формы",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Пьезодатчик - это датчик",
            "answers": [
                {
                    "answer": "параметрического типа",
                    "isTrue": false
                },
                {
                    "answer": "генераторного типа",
                    "isTrue": true
                },
                {
                    "answer": "смешанного типа",
                    "isTrue": false
                },
                {
                    "answer": "общего типа",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Реостатный датчик- это датчик",
            "answers": [
                {
                    "answer": "генераторного типа",
                    "isTrue": false
                },
                {
                    "answer": "параметрического типа",
                    "isTrue": true
                },
                {
                    "answer": "общего типа",
                    "isTrue": false
                },
                {
                    "answer": "смешанного типа",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какая электрическая величина измеряется в Вольтах?",
            "answers": [
                {
                    "answer": "электрическое сопротивление",
                    "isTrue": false
                },
                {
                    "answer": "электрическая мощность",
                    "isTrue": false
                },
                {
                    "answer": "электрическое напряжение",
                    "isTrue": true
                },
                {
                    "answer": "электрический импеданс",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Шкала электромагнитных волн – это: радиоволны, ИК-излучение, видимый свет, УФ-излучение, R-излучение,γ-излучение?",
            "answers": [
                {
                    "answer": "да",
                    "isTrue": true
                },
                {
                    "answer": "нет",
                    "isTrue": false
                },
                {
                    "answer": "перечисленные диапазоны не относятся к шкале электромагнитных волн",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Все ли диапазоны шкалы электромагнитных волн перечислены: радиоволны, ИК-излучение, видимый свет, R-излучение, γ-излучение?",
            "answers": [
                {
                    "answer": "да",
                    "isTrue": false
                },
                {
                    "answer": "нет",
                    "isTrue": true
                },
                {
                    "answer": "перечисленные диапазоны не относятся к шкале электромагнитных волн",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Распространяется ли электромагнитная волна в вакууме?",
            "answers": [
                {
                    "answer": "да",
                    "isTrue": true
                },
                {
                    "answer": "нет",
                    "isTrue": false
                },
                {
                    "answer": "только при определённых условиях",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Скорость распространения электромагнитной волны в вакууме – это самая большая скорость в природе?",
            "answers": [
                {
                    "answer": "нет",
                    "isTrue": false
                },
                {
                    "answer": "электромагнитные волны в вакууме не распространяются",
                    "isTrue": false
                },
                {
                    "answer": "да",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Чем больше плотность среды, тем скорость электромагнитной волны",
            "answers": [
                {
                    "answer": "больше",
                    "isTrue": false
                },
                {
                    "answer": "скорость волны не зависит от плотности среды",
                    "isTrue": false
                },
                {
                    "answer": "меньше",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Вектор Умова- Пойнтинга показывает",
            "answers": [
                {
                    "answer": "направление распространения звуковых волн",
                    "isTrue": false
                },
                {
                    "answer": "направление распространения электромагнитных волн",
                    "isTrue": true
                },
                {
                    "answer": "направление потока вязкой жидкости",
                    "isTrue": false
                },
                {
                    "answer": "направление потока нейтронов",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Единицы измерения электромагнитной энергии",
            "answers": [
                {
                    "answer": "Вольт",
                    "isTrue": false
                },
                {
                    "answer": "Ватт",
                    "isTrue": false
                },
                {
                    "answer": "Джоуль",
                    "isTrue": true
                },
                {
                    "answer": "Ампер",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Структурной единицей мембраны является фосфолипид, состоящий из",
            "answers": [
                {
                    "answer": "полярной головки и неполярного хвоста",
                    "isTrue": true
                },
                {
                    "answer": "гидрофобной головки и гидрофильного хвоста",
                    "isTrue": false
                },
                {
                    "answer": "неполярной головки и полярного хвоста",
                    "isTrue": false
                },
                {
                    "answer": "гидрофильной головки и гидрофильного хвоста",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Эффект Комптона описывает рассеяние",
            "answers": [
                {
                    "answer": "фотонов на свободных электронах",
                    "isTrue": true
                },
                {
                    "answer": "электронов на атомах",
                    "isTrue": false
                },
                {
                    "answer": "фотонов на ядрах атомов",
                    "isTrue": false
                },
                {
                    "answer": "фотонов на электронах внутренних оболочек",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Фотоэффект - это",
            "answers": [
                {
                    "answer": "упругое рассеянии фотонов свободными электронами",
                    "isTrue": false
                },
                {
                    "answer": "поглощение фотонов ядром атома",
                    "isTrue": false
                },
                {
                    "answer": "эмиссия электронов под действием фотонов",
                    "isTrue": true
                },
                {
                    "answer": "поглощение фотонов электронами внутренних оболочек",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Бета-излучение по своей природе - это",
            "answers": [
                {
                    "answer": "поток ядер атома гелия",
                    "isTrue": false
                },
                {
                    "answer": "поток фотонов",
                    "isTrue": false
                },
                {
                    "answer": "поток электронов или позитронов",
                    "isTrue": true
                },
                {
                    "answer": "поток нейтронов",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Гамма излучение - это",
            "answers": [
                {
                    "answer": "поток ядер атома гелия",
                    "isTrue": false
                },
                {
                    "answer": "поток фотонов",
                    "isTrue": true
                },
                {
                    "answer": "поток электронов или позитронов",
                    "isTrue": false
                },
                {
                    "answer": "поток нейтронов",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Изотопы отличаются друг от друга",
            "answers": [
                {
                    "answer": "числом протонов",
                    "isTrue": false
                },
                {
                    "answer": "числом нетронов",
                    "isTrue": true
                },
                {
                    "answer": "числом электронов",
                    "isTrue": false
                },
                {
                    "answer": "числом позитронов",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Толщина биологической мембраны",
            "answers": [
                {
                    "answer": "10 А",
                    "isTrue": false
                },
                {
                    "answer": "10 нм",
                    "isTrue": true
                },
                {
                    "answer": "0,5 мкм",
                    "isTrue": false
                },
                {
                    "answer": "10 мкм",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Жидкостно-мозаичная модель мембраны включает в себя",
            "answers": [
                {
                    "answer": "белковый слой, полисахариды и поверхностные липиды",
                    "isTrue": false
                },
                {
                    "answer": "липидный монослой и холестерин",
                    "isTrue": false
                },
                {
                    "answer": "липидный бислой, белки, микрофиломенты",
                    "isTrue": true
                },
                {
                    "answer": "липидный бислой",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Липидная часть биологической мембраны находится в следующем физическом состоянии",
            "answers": [
                {
                    "answer": "жидком аморфном",
                    "isTrue": false
                },
                {
                    "answer": "твердом кристаллическом",
                    "isTrue": false
                },
                {
                    "answer": "твердом аморфном",
                    "isTrue": false
                },
                {
                    "answer": "жидкокристаллическом",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Латеральная диффузия - это",
            "answers": [
                {
                    "answer": "переход липидов из одного слоя мембраны в другой",
                    "isTrue": false
                },
                {
                    "answer": "движение липидов вдоль слоя",
                    "isTrue": true
                },
                {
                    "answer": "транспорт веществ через мембрану",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Флип-флоп - это",
            "answers": [
                {
                    "answer": "движение липидов вдоль слоя",
                    "isTrue": false
                },
                {
                    "answer": "переход липидов из одного слоя мембраны в другой",
                    "isTrue": true
                },
                {
                    "answer": "транспорт веществ через мембрану",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Флип-флоп - это",
            "answers": [
                {
                    "answer": "движение липидов вдоль слоя",
                    "isTrue": false
                },
                {
                    "answer": "переход липидов из одного слоя мембраны в другой",
                    "isTrue": true
                },
                {
                    "answer": "транспорт веществ через мембрану",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Какая модель мембран используется в качестве новой лекарственной формы?",
            "answers": [
                {
                    "answer": "монослойная",
                    "isTrue": false
                },
                {
                    "answer": "бислойная",
                    "isTrue": false
                },
                {
                    "answer": "липосома",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Какая модель мембран используется в качестве новой лекарственной формы?",
            "answers": [
                {
                    "answer": "монослойная",
                    "isTrue": false
                },
                {
                    "answer": "бислойная",
                    "isTrue": false
                },
                {
                    "answer": "липосома",
                    "isTrue": true
                }
            ]
        },
        {
            "title": "Перенос ионов при пассивном транспорте происходит",
            "answers": [
                {
                    "answer": "из области меньшего электрохимического потенциала в область большего электрохимического потенциала",
                    "isTrue": false
                },
                {
                    "answer": "из области большего электрохимического потенциала в область меньшего электрохимического потенциала",
                    "isTrue": true
                },
                {
                    "answer": "пассивный транспорт не зависит от электрохимического потенциала",
                    "isTrue": false
                }
            ]
        },
        {
            "title": "Перенос незаряженных молекул при пассивном транспорте происходит",
            "answers": [
                {
                    "answer": "из области меньшей концентрации в область большей концентрации вещества",
                    "isTrue": false
                },
                {
                    "answer": "из области большей концентрации в область меньшей концентрации вещества ",
                    "isTrue": true
                },
                {
                    "answer": "пассивный транспорт не зависит от разности концентраций",
                    "isTrue": false
                }
            ]
        }
    ]
}