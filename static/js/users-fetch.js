const BASEURL = 'http://127.0.0.1:5000';
// ----------------------------------------------------------------------------------------------------------------
/**
* Función para realizar una petición fetch con JSON.
* @param {string} url - La URL a la que se realizará la petición.
* @param {string} method - El método HTTP a usar (GET, POST, PUT, DELETE, etc.).
* @param {Object} [data=null] - Los datos a enviar en el cuerpo de la petición.
* @returns {Promise<Object>} - Una promesa que resuelve con la respuesta en formato JSON.
*/
async function fetchData(url, method, data = null) {
  const options = {
  method: method,
  headers: {
    'Content-Type': 'application/json',
  },
  body: data ? JSON.stringify(data) : null, // Si hay datos, los convierte a JSON y los incluye en el cuerpo
  };
  try {
    const response = await fetch(url, options); // Realiza la petición fetch
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json(); // Devuelve la respuesta en formato JSON
  } catch (error) {
    console.error('Fetch error:', error);
    alert('An error occurred while fetching data. Please try again.');
  }
}
// ----------------------------------------------------------------------------------------------------------------
/**
* Funcion que permite crear un elemento <tr> para la tabla de peliculas
* por medio del uso de template string de JS.
*/
async function showUsers(){
  let users = await fetchData(BASEURL+'/api/user/', 'GET');
  const tableUsers = document.querySelector('#user-table tbody');
  tableUsers.innerHTML='';
  users.forEach((user, index) => {
    let tr = `<tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.telephone}</td>
        <td>${user.password}</td>
        <td>${user.role}</td>
        <td class="text-center">
          <button class="btn btn-transparent ml-2" onclick='updateUser(${user.id})'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-pencil" viewBox="0 0 16 16" title="Editar">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
            </svg>
          </button>
          <button class="btn btn-transparent ml-2" onclick='deleteUser(${user.id})'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash" viewBox="0 0 16 16" title="Borrar">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
        </td>
      </tr>`;
    tableUsers.insertAdjacentHTML("beforeend",tr);
    });
  }
// ----------------------------------------------------------------------------------------------------------------
/**
* Función para comunicarse con el servidor para poder Crear o Actualizar
* un registro de Usuario
* @returns
*/
async function saveUser(){
  const userId = document.querySelector('#user-id').value;  
  const userName = document.querySelector('#user-name').value;  
  const userEmail = document.querySelector('#user-email').value;
  const userTelephone = document.querySelector('#user-telephone').value;
  const userPassword = document.querySelector('#user-password').value;
  const userRole = document.querySelector('#user-role').value;
 
  //VALIDACION DE FORMULARIO
  if (!userName || !userEmail || !userTelephone || !userPassword) {
  Swal.fire({
    title: 'Error!',
    text: 'Por favor completa todos los campos.',
    icon: 'error',
    confirmButtonText: 'Cerrar'
    });
    return;
  }
 
  // Crea un objeto con los datos del usuario
  const userData = {
    name: userName,
    email: userEmail,
    telephone: userTelephone,
    password: userPassword,
    role: userRole
  };
  let result = null;
  // Si hay un userId, realiza una petición PUT para actualizar el usuario existente
  if(userId!==""){
    result = await fetchData(`${BASEURL}/api/user/${userId}`, 'PUT', userData);
  }else{
    // Si no hay userId, realiza una petición POST para crear un nuevo usuario
    result = await fetchData(`${BASEURL}/api/user/`, 'POST', userData);
  }
const formUser = document.querySelector('#user-data-form');
formUser.reset(); //No borra los inputs del tipo "hidden", entonces hay que borrarlo a mano
const idField = document.querySelector('#user-id');
idField.value = null;
alert(idField, userId);
Swal.fire({
  title: 'Exito!',
  text: result.message,
  icon: 'success',
  confirmButtonText: 'Cerrar'
})
showUsers();
}
// ----------------------------------------------------------------------------------------------------------------
/**
* Función que permite eliminar un usuario de la base de datos
* de acuerdo al índice del mismo
* @param {number} id posición de la DB que se va a eliminar
*/
function deleteUser(id){
  Swal.fire({
    title: "Esta seguro de eliminar el usuario?",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "No, cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let response = await fetchData(`${BASEURL}/api/user/${id}`, 'DELETE');
      showUsers();
      Swal.fire(response.message, "", "success");
    }
  });
  }
// ----------------------------------------------------------------------------------------------------------------
/**
* Función que permite cargar el formulario con los datos del usuario
* para su edición
* @param {number} id Id del usuario que se quiere editar
*/
async function updateUser(id){
  //Buscamos en el servidor el usuario de acuerdo al id
  let response = await fetchData(`${BASEURL}/api/user/${id}`, 'GET');
  
  const userId = document.querySelector('#user-id');
  const userName = document.querySelector('#user-name');
  const userEmail = document.querySelector('#user-email');
  const userTelephone = document.querySelector('#user-telephone');
  const userPassword = document.querySelector('#user-password');
  const userRole = document.querySelector('#user-role');
  
  userId.value = response.id;
  userName.value = response.name;
  userEmail.value = response.email;
  userTelephone.value = response.telephone;
  userPassword.value = response.password;
  userRole.value = response.role; 
}

// Escuchar el evento 'DOMContentLoaded' que se dispara cuando el
// contenido del DOM ha sido completamente cargado y parseado.
document.addEventListener('DOMContentLoaded',function(){
  const btnSaveUser = document.querySelector('#user-save-btn');
  //ASOCIAR UNA FUNCION AL EVENTO CLICK DEL BOTON
  btnSaveUser.addEventListener('click',saveUser);
  // const formTarget = document.querySelector('#user-data-form');
  // formTarget.addEventListener('submit', saveUser);
  showUsers();
});