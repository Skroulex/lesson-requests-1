/*
Виды запросов:
POST - добавление данных
PUT - полная замена данных
PATCH - частичная замена данных
DELETE - удаление
GET - получение данных
 */
/*
команда для запуска json-server
json-server -w db.json -p 8000
 */
/*
CRUD - Create(POST) Read(GET) Update(PUT,PATCH) Delete(DELETE)
 */
const API = "http://localhost:8000/todos";
// Create

// получаем нужные для добавления элементы
let inpAdd = document.getElementById('inp-add');
let btnAdd = document.getElementById('btn-add');
// console.log(inpAdd, btnAdd)

//навеили событие на кнопку "Сохранить"
btnAdd.addEventListener('click', async () => {
    // собираем объект для добавления в дб.жсон
    let newTodo = {
        todo: inpAdd.value,
    };
    // проверка на заполненность инпута и останавливаем код с помощью return, чтобы пост-запрос не выполнился
    if (newTodo.todo.trim() === "") {
        alert('Заполните поле!');
        return;
    }
    // запрос для добавления
    await fetch(API, {
        method: "POST", // указываем метод
        body: JSON.stringify(newTodo), // указываем что именно нужно запостить
            headers: {
            "Content-type": "application/json; charset = utf-8"
        },// кодировка
    });
    // очищаем инпут после добавления
    inpAdd.value = "";
    // чтобы добавленный таск сразу отобразился в листе вызываем функцию, которая выполняет отображение
    getTodos();
});

// Read
// получаем элемент, чтобы в нем отобразить все таски`
let list = document.getElementById('list')
//функция для получения всех тасков и отображения их в div#list
// async await нужен здесь, чтобы при отправке запроса мы сначала получили данные и только потом записали все в переменную response,
// иначе (если мы НЕ дождемся) туда запишется pending (состояние промиса, который еще не выполнен)
async function getTodos() {
    let response = await fetch(API)// если не указать метод запроса, то по умолчанию это GET запрос
        .then((res) => res.json()) // переводим все в json формат
        .catch(err => console.log(err)); // отловили ошибку
    console.log(response);
    // очищаем div#list, чтобы список тасков корректно отображался и не хранил там предыдущие html-элементы со старыми данными
    list.innerHTML = "";
    // перебираем полученный из дб.жсон массив и для каждого объекта из этого массива создаем div и задаем ему содержимое через метод innerHTML
    // каждый  созданный элемент аппендим в div#list
    response.forEach((item) => {
        let newElem = document.createElement("div");
        newElem.id = item.id;
        newElem.innerHTML = `<span>${item.todo}</span><button class="btn-delete">Delete</button>`
        list.append(newElem)
    })
    // console.log(list)
}

// вывзываем функцию, чтобы как только откроется страница что-то было отображено
getTodos()
document.addEventListener('click',async(e)=>{
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`,{
        method: "DELETE",
    });
    getTodos();
})
