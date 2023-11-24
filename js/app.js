const nombre = document.getElementById('nombre');
const dni = document.getElementById('dni');
const fechaNacimiento = document.getElementById('fecha')
const telefono = document.getElementById('telefono');
const form = document.getElementById('signup');
const userList = document.getElementById('userList');
const api = "http://localhost:3000/registros";


const showError = (input, message) => {
    // Obtener el elemento form-field
    const formField = input.parentElement;
    // Agregar la clase de error
    formField.classList.remove('success');
    formField.classList.add('error');
    // Mostrar el mensaje de error
    const error = formField.querySelector('small');
    error.textContent = message;
  };

  const showSuccess = (input) => {
    // Obtener el elemento form-field
    const formField = input.parentElement;
    // Eliminar la clase de error
    formField.classList.remove('error');
    formField.classList.add('success');
    // Ocultar el mensaje de error
    const error = formField.querySelector('small');
    error.textContent = '';
};

const isRequired = value => value === '' ? false : true;

const isBetween = (length, min, max) => length < min || length > max ? false : true;


function validarDNI(dni){
  const re = /(^([0-9]{8}[A-Z]{1})|^)$/
  return re.test(dni);
}


function isBefore(fecha) {
  let fechaN = new Date(fecha);
  return fechaN>Date.now()?false:true;
}

function validarTelefono(telefono){
  const re = /^[0-9]{8}$/;
  return re.test(telefono);
}

const checkName = () => {
  let valid = false;
  const min = 3, max = 25;
  const nombreV = nombre.value.trim();
  if (!isRequired(nombreV)) {
    showError(nombre, 'El nombre de usuario no puede estar en blanco.');
  } else if (!isBetween(nombreV.length, min, max)) {
    showError(nombre, `El nombre de usuario debe tener entre ${min} y ${max} caracteres.`);
  } else {
    showSuccess(nombre);
    valid = true;
  }
  return valid;
};

async function existDNI(dni){
  let exist = false;
  const response = await fetch(`${api}`)
  const registros = await response.json();
  await registros.forEach(element => {
      if (element.dni == dni){
        exist = true;
      }
    });
  return exist;
}

const checkDNI = async() => {
  let valid = false; 
  const dniV = dni.value.trim()
  if(!isRequired(dniV)){   
    showError(dni, 'El dni no puede estar en blanco')
  }else if (await existDNI(dniV)){
    showError(dni, 'El dni ya existe')
  }else {
    showSuccess(dni);
    valid = true;
  }
  return valid;
}


const checkFecha = () => {
  let valid = false; 
  const fechaV = fechaNacimiento.value;
  if (!isRequired(fechaV)){
    showError(fechaNacimiento, 'La fecha no puede estar en blanco')
  }else if(!isBefore(fechaV)){
    showError(fechaNacimiento, 'La fecha debe ser anterior a la actual')
  }else {
    showSuccess(fechaNacimiento);
    valid = true;
  }
  return valid;
}

const checkTelefono = () => {
  let valid = false; 
  const telefonoV = telefono.value;
  if (!isRequired(telefonoV)){
    showError(telefono, 'El telefono no puede estar en blanco')
  }else if(validarTelefono(telefonoV)){
    showError(telefono, 'El formato del teléfono no está correcto')
  }else {
    showSuccess(telefono);
    valid = true;
  }
  return valid;
}

nombre.addEventListener('change', checkName);
dni.addEventListener('change', checkDNI);
fechaNacimiento.addEventListener('change', checkFecha);
telefono.addEventListener('change', checkTelefono);

function addUserToList(user) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `${user.name} : ${user.dni} : ${user.fecha} : ${user.telefono} : <button class="edit">Editar</button><button class="remove">Borrar</button>`; 
  listItem.setAttribute("id", user.id);
  userList.appendChild(listItem);
}


async function getListUsersApi(){
  const response = await fetch(`${api}`)
  const users = await response.json();
  users.forEach(user => {
    addUserToList(user);
  });

}

getListUsersApi();

async function editUser(event) {
  if (event.target.classList.contains('edit')) {
      const listItem = event.target.parentElement;
      const idList = listItem.id;
      const userArray = listItem.textContent.split(" : ");
      const name = userArray[0];
      const dni = userArray[1];
      const fecha = userArray[2];
      const telefono = userArray[3];
      form.elements.nombre.value = name;
      form.elements.dni.value = dni;
      form.elements.fecha.value = fecha;
      form.elements.telefono.value = telefono;
      form.querySelector("input[type='submit']").value = "Editar";
      form.querySelector("input[type='submit']").setAttribute("id",idList);
      
  }else if (form.getElementsByTagName("input")[0].value == 'Editar'){
      const user = {
          name: form.elements.name.value,
          dni: form.elements.dni.value,
          fecha: form.elements.fechaN.value,
          telefono: form.elements.telefono.value
      }
      const id2 = form.querySelector("input[type='submit']").getAttribute("id");
      const response = await fetch(`${api}/${id2}`, {
          method: 'PUT',
          body: JSON.stringify(user),
          headers:{
              'Content-Type': 'application/json'
          }
      })
  }
}

function addUserApi(){
  const nombre = document.getElementById('nombre');
  const dni = document.getElementById('dni');
  const fechaNacimiento = document.getElementById('fecha')
  const telefono = document.getElementById('telefono');
  const newUser = {
    name: nombre.value,
    dni: dni.value,
    fecha: fechaNacimiento.value,
    telefono: telefono.value
  }
  fetch(`${api}`, {
    method: 'POST',
    headers: {
        'Content-Type':'application/json'
    },
    body: JSON.stringify(newUser)
})
.then((response)=> response.json())
alert("Enviado");
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  if (checkName && checkDNI && checkFecha && checkTelefono){
    if (form.getElementsByTagName("input")[0].value == 'Editar'){
      editUser(event);
    }else {
      addUserApi(event);
    }
  }
  form.reset();
});

userList.addEventListener('click', function(event){
  editUser(event);
})