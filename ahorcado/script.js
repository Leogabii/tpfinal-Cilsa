// Crea un array vacío que luego se llenará con palabras extraídas del archivo JSON
let palabras = [];

// Variable que guardará la palabra actual que el jugador debe adivinar
let palabraActual = '';

// Contador de errores cometidos por el jugador
let errores = 0;

// Número máximo de errores permitidos antes de perder el juego
const maxErrores = 6;

// Array que se usará para mostrar qué letras han sido adivinadas correctamente
let letrasAdivinadas = [];

// Array que almacena las letras incorrectas que el jugador ha ingresado
let nocorrectas = [];

// Espera a que el contenido del documento HTML se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    // Realiza una solicitud para cargar el archivo 'ahorcado.json'
    fetch('./ahorcado.json')
        // Convierte la respuesta del archivo a un objeto JavaScript
        .then(response => response.json())
        // Guarda el array de palabras en la variable 'palabras'
        .then(data => {
            palabras = data.palabra;
        });
});

// Función que inicia una nueva partida del juego
function startGame() {
    // Reinicia la lista de letras incorrectas
    nocorrectas = [];

    // Obtiene un índice aleatorio para seleccionar una palabra del array
    const index = obtenerNumeroAleatorio();

    // Verifica que el índice sea válido (esté dentro del array)
    if (index >= 0 && index < palabras.length) {
        // Asigna la palabra seleccionada a la variable 'palabraActual'
        palabraActual = palabras[index];

        //muestro la palabra por consola
        console.log(palabraActual)

        // Llena el array 'letrasAdivinadas' con guiones bajos (uno por cada letra de la palabra)
        letrasAdivinadas = Array(palabraActual.length).fill('_');

        // Reinicia el contador de errores para el nuevo juego
        errores = 0;

        // Muestra los elementos del juego (entrada de letras, errores, chances)
        mostrarElemento('input-container');
        mostrarElemento('nocorrectas');
        mostrarElemento('chances');
        ocultarElemento('message'); // Oculta el mensaje anterior (ganar/perder)

        // Limpia el contenido de errores y chances anteriores
        document.getElementById('nocorrectas').textContent = '';
        document.getElementById('chances').textContent = '';

        // Muestra la palabra oculta con guiones bajos
        document.getElementById('word-display').textContent = letrasAdivinadas.join(' ');

        // Borra cualquier mensaje anterior
        document.getElementById('message').textContent = '';
    } else {
        // Si ocurre un error al obtener la palabra, muestra una alerta
        alert('Error al obtener la palabra. Intenta nuevamente.');
    }
}

// Variable donde se guarda la letra ingresada por el jugador
let letra = '';

// Función que verifica si la letra ingresada es correcta o no
function checkLetter() {
    // Captura la letra desde el input, la pasa a minúsculas
    letra = document.getElementById('letter-input').value.toLowerCase();

    // Limpia el input después de ingresar la letra
    document.getElementById('letter-input').value = '';

    // Verifica que se haya ingresado solo una letra
    if (letra && letra.length === 1) {
        // Si la letra está incluida en la palabra actual
        if (palabraActual.includes(letra)) {
            // Recorre cada letra de la palabra para descubrir coincidencias
            for (let i = 0; i < palabraActual.length; i++) {
                if (palabraActual[i] === letra) {
                    // Si coincide, reemplaza el guión por la letra correcta
                    letrasAdivinadas[i] = letra;
                }
            }
        } else {
            // Si la letra no está en la palabra, suma un error
            errores++;

            // Guarda la letra errada (en mayúscula) en el array de letras incorrectas
            nocorrectas.push(letra.toUpperCase());

            // Muestra las letras incorrectas acumuladas
            document.getElementById('nocorrectas').textContent = `Erradas: ${nocorrectas.join(', ')}`;

            // Muestra la cantidad de oportunidades restantes
            document.getElementById('chances').textContent = `Chances restantes: ${maxErrores - errores}`;
        }

        // Actualiza en pantalla la palabra con las letras descubiertas
        document.getElementById('word-display').textContent = letrasAdivinadas.join(' ');

        // Si no quedan guiones, significa que el jugador ganó
        if (!letrasAdivinadas.includes('_')) {
            document.getElementById('message').textContent = '¡Ganaste! Pulsa "Comenzar juego" para jugar otra vez.';
            mostrarElemento('message');
            ocultarControles();
        } 
        // Si se alcanzó el límite de errores, el jugador perdió
        else if (errores >= maxErrores) {
            document.getElementById('message').textContent = `¡Perdiste! La palabra era: ${palabraActual}.`;
            mostrarElemento('message');
            ocultarControles();
        }
    } else {
        // Si se ingresó más de una letra o nada, muestra una alerta
        alert('Por favor, ingresa una sola letra válida.');
    }
}

// Función que oculta los elementos de entrada cuando termina el juego
function ocultarControles() {
    ocultarElemento('input-container');
    ocultarElemento('nocorrectas');
    ocultarElemento('chances');
}

// Muestra un elemento HTML quitando la clase 'hidden'
function mostrarElemento(id) {
    document.getElementById(id).classList.remove('hidden');
}

// Oculta un elemento HTML agregando la clase 'hidden'
function ocultarElemento(id) {
    document.getElementById(id).classList.add('hidden');
}

// Devuelve un número aleatorio entre 0 y la cantidad de palabras disponibles
function obtenerNumeroAleatorio() {
    return Math.floor(Math.random() * palabras.length);
}
