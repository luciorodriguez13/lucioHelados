let pagina = 1;

const pedido = {
  nombre: '',
  direccion: '',
  telefono:'',
  fecha: '',
  hora: '',
  gustos:[]
}

 document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {

  //Resalta el Div actual segun el tab al que se presiona

  mostrarSeccion();

  //Oculta o muestra una seccion segun el tab que se presiona

  cambiarSeccion();

  //Paginacion siguiente y anterior
  paginaSiguiente();

  paginaAnterior();

  botonesPaginador();

  //Muestra el resumen de la pedido (o mensaje de error en caso que no cumpla con el pedido)
  mostrarPedido();

  //Almacena el nombre del pedido en el objeto
  nombrePedido();

  //Almacena la direccion del pedido en el objeto
  direccionPedido();

  //Almacena el telefono del pedido en el objeto
  telefonoPedido();

  //Almacena la fecha del pedido en el objeto
  fechaPedido();

  //Deshabilitar fechas anteriores a la actual
  deshabilitarFechaAnterior();

  mostrarSabores();

  //Almacenar hora en el pedido
  horaPedido();

}

function mostrarSeccion() {

  // Eliminar mostrar-seccion de la sección anterior
  const seccionAnterior = document.querySelector('.mostrar-seccion');
  if( seccionAnterior ) {
      seccionAnterior.classList.remove('mostrar-seccion');
  }

  
  const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');
    

  // Eliminar la clase de actual en el tab anterior
  const tabAnterior = document.querySelector('.tabs .actual');
  if(tabAnterior) {
      tabAnterior.classList.remove('actual');
  }
 
  // Resalta el Tab Actual
  const tab = document.querySelector(`[data-paso="${pagina}"]`);
  tab.classList.add('actual');
}

function cambiarSeccion() {
  const enlaces = document.querySelectorAll('.tabs button');

  enlaces.forEach( enlace => {
      enlace.addEventListener('click', e => {
          e.preventDefault();
          pagina = parseInt(e.target.dataset.paso);

          // Llamar la función de mostrar sección
          mostrarSeccion();

          botonesPaginador();
      })
  })
}


async function mostrarSabores() {
  try {
    const resultado = await fetch("./sabores.json");
    const db = await resultado.json();
    const { sabores } = db;

    //Generar html

    sabores.forEach((sabor) => {
      const { id, nombre } = sabor;

      //DOM Scripting
      //Generar nombre sabor
      const nombreSabor = document.createElement("P");
      nombreSabor.textContent = nombre;
      nombreSabor.classList.add("nombre-sabor");

      //Generar div contenedor de Sabores
      const saboresDiv = document.createElement("DIV");
      saboresDiv.classList.add("sabor");
      saboresDiv.dataset.idSabor = id;

      //Selecciona un sabor para el pedido
      saboresDiv.onclick = seleccionarSabor;

      //Inyectar nombre al div de sabores
      saboresDiv.appendChild(nombreSabor);
      
      //Inyectarlo en el HTML
      document.querySelector("#sabores").appendChild(saboresDiv);
    });
  } catch (error) {
    console.log(error);
  }

  function seleccionarSabor(e) {
    let elemento;
    //Forzar que el elemento el cual le damos click sea el DIV

    if (e.target.tagName === "P") {
      elemento = e.target.parentElement;
    } else {
      elemento = e.target;
    }
    if (elemento.classList.contains("seleccionado")) {
      elemento.classList.remove("seleccionado");

      const id = parseInt( elemento.dataset.idSabor );

      eliminarSabor(id);
      
    } else {
      elemento.classList.add("seleccionado");

      const pedidoObj = {
        id: parseInt(elemento.dataset.idSabor),
        nombre: elemento.firstElementChild.textContent
      }

      agregarSabor(pedidoObj);
    }
  }
}


function eliminarSabor(id){
  const { gustos } = pedido;
  pedido.gustos = gustos.filter(gusto => gusto.id !== id);

  console.log(pedido);
};

function agregarSabor(pedidoObj) {
  const { gustos } = pedido;

  pedido.gustos = [...gustos, pedidoObj];
  
  console.log(pedido);
};

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener('click', () => {
    pagina++;
    botonesPaginador();
    
  });
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener('click', () => {
    pagina--;

    botonesPaginador();
  
  });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina  === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 4 ) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
 // Estamos en la página 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // Cambia la sección que se muestra por la de la página
}

function mostrarPedido(){
  //Destructuring
  const {nombre, direccion, telefono, fecha, hora } = pedido;
  
  //Seleccionar el pedido
  const pedidoDiv = document.querySelector('.contenido-pedido');
  
  //Limpiar HTML
  while ( pedidoDiv.firstChild )
  {
     pedidoDiv.removeChild( pedidoDiv.firstChild);
  }    
  
  //Validación de Objeto
  if(Object.values(pedido).includes('')) {
    const noPedido = document.createElement('P');
    noPedido.textContent = 'Faltan datos del pedido, nombre, direccion, fecha o hora';
    
    noPedido.classList.add('invalidar-pedido');

    //Agregar a pedidoDiv
    pedidoDiv.appendChild(noPedido);
    return;
  }

  const headingPedido = document.createElement('H3');
  headingPedido.textContent = 'Resumen del pedido';

  //Mostrar el pedido
  const nombrePedido = document.createElement('P');
  nombrePedido.innerHTML = `<span>Nombre:</span> ${nombre}`;

  const direccionPedido = document.createElement('P');
  direccionPedido.innerHTML = `<span>Direccion:</span> ${direccion}`;

  const telefonoPedido = document.createElement('P');
  telefonoPedido.innerHTML = `<span>Telefono:</span> ${telefono}`;

  const fechaPedido = document.createElement('P');
  fechaPedido.innerHTML = `<span>Fecha:</span> ${fecha}`;

  const horaPedido = document.createElement('P');
  horaPedido.innerHTML = `<span>Hora:</span> ${hora}`;

  const pedidoPedido = document.createElement('DIV');
  pedidoPedido.classList.add('pedido-pedido');

  const headingTotal = document.createElement('H3');
  headingTotal.textContent = 'Total';

  pedidoPedido.appendChild(headingTotal);

  let cantidad = 0;


  //Iterar sobre el arreglo pedido
  pedido.forEach(pedidos => {

    const { nombre, direccion, telefono } = pedidos;
    const contenedorPedido = document.createElement('DIV');
    contenedorPedido.classList.add('contenedor-pedido');
    
    const textoPedido = document.createElement('P');
    textoPedido.textContent = nombre;
    textoPedido.classList.add('nombre')
    textoPedido.textContent = direccion;
    textoPedido.classList.add('direccion')
    textoPedido.textContent = telefono;
    textoPedido.classList.add('telefono');

    //Colocar datos en el div
    contenedorPedido.appendChild(textoPedido);

    pedidoPedido.appendChild(contenedorPedido);
  })

  pedidoDiv.appendChild(headingPedido);
  pedidoDiv.appendChild(nombrePedido);
  pedidoDiv.appendChild(direccionPedido);
  pedidoDiv.appendChild(telefonoPedido);
  pedidoDiv.appendChild(fechaPedido);
  pedidoDiv.appendChild(horaPedido);

  pedidoDiv.appendChild(pedidoPedido)
}


function nombrePedido () {
  const nombreInput = document.querySelector('#nombre');
  
  nombreInput.addEventListener('input', e => {
    const nombreTexto = e.target.value.trim();

  
    //Validacion de que nombreTexto tiene que ser no NULL
    if (nombreTexto === '' || nombreTexto.lenght < 3) {
      console.log('Nombre no valido');
    } else {
      const alerta = document.querySelector('.alerta');
      if (alerta) {
        alerta.remove();
      }
      pedido.nombre = nombreTexto;
    }
  });
}

function direccionPedido () {
  const direccionInput = document.querySelector('#direccion');
  direccionInput.addEventListener('input', e => {
    const direccionTexto = e.target.value.trim();
    
    const alerta = document.querySelector('.alerta');
      if (alerta) {
        alerta.remove();
      }

    //Validacion de que direccionTexto tiene que ser no NULL
    if (direccionTexto === '') {
      console.log('Direccion no valido');
    } else {
      pedido.direccion = direccionTexto;
    }
    
  });
}

function telefonoPedido () {
  const telefonoInput = document.querySelector('#telefono');
  telefonoInput.addEventListener('input', e => {
    const telefonoTexto = e.target.value.trim();
  
    const alerta = document.querySelector('.alerta');
      if (alerta) {
        alerta.remove();
      }

    //Validacion de que direccionTexto tiene que ser no NULL
    if (telefonoTexto === '') {
      mostrarAlerta('Direccion no valido', 'error');
    } else {
      pedido.telefono = telefonoTexto;
    }
    
  });
}

function mostrarAlerta(mensaje, tipo){
  
  //Si hay una alerta abierta, no crear otra
  const alertaPrevia = document.querySelector('.alerta');
  if (alertaPrevia) {
    return;
  }

  const alerta = document.createElement('DIV');
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');

  if (tipo === 'error') {
    alerta.classList.add('error');
  } 

  //insertar en html
  const formulario = document.querySelector('.formulario');
  formulario.appendChild( alerta );

  //Eliminar la alerta despues de 3 segundos
  setTimeout(() => 
  {
    alerta.remove();
  }, 3000);

}

function fechaPedido(){
  const fechaInput = document.querySelector('#fecha');
  fechaInput.addEventListener('input', e => {
    
      //Retorna el numero del dia del 0 al 6, 0 domingo- 1 lunes - 2 martes ....
      const dia = new Date(e.target.value).getUTCDay(); 

      if ([1].includes(dia)) {
        e.preventDefault();
        fechaInput.value = '';
        mostrarAlerta('Lunes no trabajamos', 'error');
      } else {
        pedido.fecha = fechaInput.value;

        console.log(pedido);
      }
  })
}

function deshabilitarFechaAnterior(){
  const inputFecha = document.querySelector('#fecha');
  
  const fechaAhora = new Date();

  const year = fechaAhora.getFullYear();
  const mes = fechaAhora.getMonth() + 1;
  const dia = fechaAhora.getDay() + 1;
  
  //Formato deseo AAAA-MM-DD
  const fechaDeshabilitar = `${year}-${mes}-${dia}`;

  inputFecha.min = fechaDeshabilitar;
}

function horaPedido() {
  const inputHora = document.querySelector('#hora');
  inputHora.addEventListener('input', e => {

    const horaPedido = e.target.value;
    const hora = horaPedido.split(':');


    if (hora[0] > 00 , hora[0] < 12) {
      mostrarAlerta('Hora no valida', 'error');
      setTimeout(() => {
        inputHora.value = '';
      }, 3000)
    } else {
      pedido.hora = horaPedido;
      console.log(pedido);
    }
  });
}
