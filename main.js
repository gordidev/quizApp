let index = 0 // Se establece el indice del array en 0
let selected = 0 // Respuesta selecionada
let points = 0 // Puntos
const resetCounter = 30 // Segundos del contador
let counter = resetCounter // Segundos que le quedan al contador para llegar a 0
let shuffleQuests = [] // Array donde se guardaran las preguntas desordenadas
let intervalo = null; // Variable para almacenar el intervalo actual

const questsDiv = document.querySelector("#quests") // Obtenemos el div donde se mostraran las preguntas
const counterElement = document.querySelector("#contadorid") // Obtenemos el H1 del contador

//fetch para obtener un array de datos desde una API
fetch('api.json')
  .then(response => response.json())
  .then(data => {
    // Desordenar el array de datos
    shuffleQuests = desordenarArray(data);
    //console.log(shuffleQuests);
  })
  .catch(error => console.error('Error al obtener los datos:', error));

// Función para desordenar el array
function desordenarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generar índice aleatorio
      [array[i], array[j]] = [array[j], array[i]]; // Intercambiar los elementos
    }
    return array;
  }
function restar(){
    clearInterval(intervalo)
    counterElement.innerHTML = counter
    intervalo = setInterval(contadorfunc, 1000)
}

function contadorfunc(){
    if(counter == 0){
        clearInterval(intervalo); // Detener el intervalo al llegar a 0
        statusQuest(0)
    }else{
    counter--
    counterElement.innerHTML = counter
    //console.log(counter)
    }
    
}
function statusQuest(stat){
    clearInterval(intervalo)
    counterElement.style.visibility = "hidden"
    if(stat == 0){
        questsDiv.innerHTML = `<h1 class="text-danger">Fallaste la respuesta era la ${shuffleQuests[index].correct}</h1><h1>Puntos: ${points}</h1><h1>Preguntas: ${index+1}/${shuffleQuests.length}</h1><input type="button" value="Siguiente" onclick="loadQuest()">`
    }else{
        points = points+counter
        questsDiv.innerHTML = `<h1 class="text-success">Acertaste la respuesta era la ${shuffleQuests[index].correct}</h1><h1>Puntos: ${points}</h1><h1>Preguntas: ${index+1}/${shuffleQuests.length}</h1><input type="button" value="Siguiente" onclick="loadQuest()">`
    }
}

function button(answer){
    selected = answer
    if(selected == shuffleQuests[index].correct){
        statusQuest(1)
        //console.log("acertaste");
    }else{
        //console.log("fallaste");
        statusQuest(0)
    }
    index++;
    //loadQuest()
}

let key = 0
function record(){
    questsDiv.innerHTML = `
    <input type="text" placeholder="Username: " id="username"><h2>Puntos: ${points}</h2>
    <button class="btn btn-primary" onclick="saveRecord()" id="remove">Guardar</button>
    <button class="btn btn-success" onclick="location.reload()">volver a inicio</button>
    <div id="records"></div>
    `
    const records = document.querySelector("#records")
    for(let i=0; i < localStorage.length; i++){
        key = localStorage.key(i)
        valor = localStorage.getItem(key)
        records.innerHTML += `<div id="recordContainer" class="bg-primary"><h1>Nombre: ${key}</h1><h1>Puntos: ${valor}</h1><div>`
    }
}
function saveRecord(){
    const records = document.querySelector("#records")
    const remove = document.querySelector("#remove")
    remove.style.display="none"
    let valor = 0
    let username = document.querySelector("#username")
    records.innerHTML = ""
    localStorage.setItem(username.value, points)
    for(let i=0; i < localStorage.length; i++){
        key = localStorage.key(i)
        valor = localStorage.getItem(key)
        records.innerHTML += `<div id="recordContainer" class="bg-primary"><h1>Nombre: ${key}</h1><br><h1>Puntos: ${valor}</h1><div>`
    }
}

function loadQuest(){
    counter=resetCounter
    if(index == shuffleQuests.length){
        questsDiv.innerHTML = `<h1>Terminaste</h1><h1>Puntos: ${points}/300</h1><button class="btn btn-primary" onclick="record()">Record</button><br><button class="btn btn-success" onclick="location.reload()">Volver a inicio</button>`
    }else{
        questsDiv.innerHTML = `
        <h1>${index+1}.-${shuffleQuests[index].title}</h1>
        <input type="button" value="${shuffleQuests[index].answer1}" onclick="button(1)">
        <input type="button" value="${shuffleQuests[index].answer2}" onclick="button(2)">
        <input type="button" value="${shuffleQuests[index].answer3}" onclick="button(3)">
        `
        restar()
        counterElement.style.visibility = "visible"
    }
}