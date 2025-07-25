let clients = [];
let currentSortColumn = "id";
let currentSortOrder = "asc"; // Сортировка по возрастанию по умолчанию
let editMode = false; // Переменная для отслеживания режима редактирования
let currentClientId = null; // Переменная для хранения ID редактируемого клиента

// Открытие модального окна для редактирования клиента
let editingClientId = null; // Для отслеживания ID клиента, который редактируется
let contacts = []; // Контакты клиента

// Открыть модалку для редактирования
function openEditClientModal(clientId) {
    const client = clients.find(client => client.id === clientId);
    if (!client) return;

    editingClientId = clientId;

    // Заполнить поля формы данными клиента
    document.getElementById('editFirstName').value = client.firstName;
    document.getElementById('editLastName').value = client.lastName;
    document.getElementById('editMiddleName').value = client.middleName;
    contacts = client.contacts;

    updateContactsList(); // Обновить список контактов
    $('#editClientModal').modal('show'); // Открыть модалку
}

// Удаление контакта
function removeContact(index) {
    contacts.splice(index, 1);
    updateContactsList();
}


// Сохранение изменений
document.getElementById('saveClientBtn').addEventListener('click', function () {
    const updatedClient = {
        id: editingClientId,
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        middleName: document.getElementById('editMiddleName').value,
        contacts: contacts
    };

    // Логика сохранения изменений (например, отправка на сервер или обновление в памяти)
    clients = clients.map(client => client.id === editingClientId ? updatedClient : client);
    updateClientTable();
    $('#editClientModal').modal('hide');
});

// Удаление клиента
document.getElementById('deleteClientBtn').addEventListener('click', function () {
    deleteClient(editingClientId);
    $('#editClientModal').modal('hide');
});

// Закрытие модальных окон
document.querySelectorAll(".cancel-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    $("#editClientModal").modal("hide");
    $("#deleteClientModal").modal("hide");
    resetModal(); // Сбросить форму и контакты
  });
});

// Обновление списка контактов в модалке
function updateContactsList() {
  const contactsList = document.getElementById("contactsList");
  contactsList.innerHTML = contacts
    .map((c) => `<p>${c.type}: ${c.value}</p>`)
    .join("");
}

// Открытие модального окна для удаления клиента
function openDeleteClientModal(clientId) {
  document.getElementById("deleteClientBtn").onclick = function () {
    deleteClient(clientId); // Удалить клиента
    $("#deleteClientModal").modal("hide");
  };
  $("#deleteClientModal").modal("show");
}

// Функция для отображения иконок контактов
function getContactIcon(type) {
  switch (type) {
      case 'phone':
          return '<img src="icons/phone.svg" alt="Телефон">';
      case 'email':
          return '<img src="icons/email.svg" alt="Email">';
      case 'vk':
          return '<img src="icons/vk.svg" alt="VK">';
      case 'facebook':
          return '<img src="icons/facebook.svg" alt="Facebook">';
      default:
          return '<img src="icons/logo.svg" alt="Контакт">';
  }
}

let nextClientId = 1;
// Сохранение клиента
document.getElementById("saveClient").addEventListener("click", function () {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const middleName = document.getElementById("middleName").value;

  const newClient = {
    id: nextClientId++, // Генерация уникального ID
    firstName,
    lastName,
    middleName,
    contacts: contacts,
    createdAt: new Date().toISOString(), // Указываем дату создания
    updatedAt: new Date().toISOString()  // Указываем дату последнего обновления

  };

  clients.push(newClient);
  updateClientTable();
  $("#clientModal").modal("hide");
});

// // Удаление клиента
function deleteClient(clientId) {
  clients = clients.filter((client) => client.id !== clientId);
  updateClientTable();
}

// Обновление таблицы клиентов
// Привязываем обработчики для кнопок в таблице после её обновления
function updateClientTable() {
  const tbody = document.querySelector("#client-table tbody");
  tbody.innerHTML = "";

  clients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${client.id}</td>
      <td>${client.lastName} ${client.firstName} ${client.middleName}</td>
      <td>${new Date(client.createdAt).toLocaleString()}</td>
      <td>${new Date(client.updatedAt).toLocaleString()}</td>
      <td>${client.contacts
        .map((contact) => `${getContactIcon(contact.type)} ${contact.value}`)
        .join(", ")}</td>
      <td>
        <button class="edit-btn" data-id="${client.id}">
          <img src="icons/edit.svg" alt="Изменить" width="16" height="16" />
          Изменить
        </button>
        <button class="delete-btn" data-id="${client.id}">
          <img src="icons/exit.svg" alt="Удалить" width="16" height="16" />
          Удалить
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Обновляем обработчики событий для редактирования и удаления
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const clientId = Number(button.getAttribute("data-id"));
      openEditClientModal(clientId);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const clientId = Number(button.getAttribute("data-id"));
      openDeleteClientModal(clientId);
    });
  });
}

  // Обновление события для кнопок редактирования и удаления
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const clientId = Number(button.getAttribute("data-id"));
      openEditClientModal(clientId);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const clientId = Number(button.getAttribute("data-id"));
      openDeleteClientModal(clientId);
    });
  });


// Сортировка таблицы
document.querySelectorAll("#client-table th[data-column]").forEach((th) => {
  th.addEventListener("click", function () {
    const column = th.getAttribute("data-column");
    currentSortOrder =
      currentSortColumn === column && currentSortOrder === "asc"
        ? "desc"
        : "asc";
    currentSortColumn = column;

    clients.sort((a, b) => {
      if (currentSortOrder === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    updateClientTable();
  });
});

// Добавление контактов в формах
const addNewBtn = document.getElementById("addNewContactBtn");
if (addNewBtn) {
  addNewBtn.addEventListener("click", () => {
    const type = document.getElementById("newContactType").value;
    const value = document.getElementById("newContactValue").value;
    if (value) {
      contacts.push({ type, value });
      updateContactsList();
      document.getElementById("newContactValue").value = "";
    }
  });
}

const addEditBtn = document.getElementById("addEditContactBtn");
if (addEditBtn) {
  addEditBtn.addEventListener("click", () => {
    const type = document.getElementById("editContactType").value;
    const value = document.getElementById("editContactValue").value;
    if (value) {
      contacts.push({ type, value });
      updateContactsList();
      document.getElementById("editContactValue").value = "";
    }
  });
}

// Сброс модалки
function resetModal() {
  document.getElementById("clientForm").reset();
  contacts = [];
  updateContactsList();
}

// // Загрузка данных (здесь можно добавить ваш API запрос)
// function loadClients() {
//   // Здесь вы можете добавить свой API-запрос для получения клиентов
//   // Например:
//   // fetch('https://api.example.com/clients')
//   // .then(response => response.json())
//   // .then(data => {
//   //     clients = data;
//   //     updateClientTable();
//   // });
//   $("#loading").hide(); // Скрыть индикатор загрузки после загрузки
// }

// // Вызов функции загрузки клиентов
// loadClients();

// Функция для отображения клиентов в таблице
function displayClients() {
  const tableBody = document.querySelector("#client-table tbody");
  const loadingSpinner = document.getElementById("loading");

  // Скрыть спиннер и показать таблицу после загрузки данных
  loadingSpinner.style.display = "none";
  tableBody.style.display = "table-row-group"; // Используйте display для tbody

  // Очищаем таблицу перед добавлением новых строк
  tableBody.innerHTML = "";

  // Сортировка данных
  const sortedClients = [...clients].sort((a, b) => {
    if (currentSortOrder === "asc") {
      return a[currentSortColumn] > b[currentSortColumn] ? 1 : -1;
    } else {
      return a[currentSortColumn] < b[currentSortColumn] ? 1 : -1;
    }
  });

  // Заполнение таблицы
  sortedClients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.lastName} ${client.firstName} ${
      client.middleName
    }</td>
                <td>${new Date(client.createdAt).toLocaleString()}</td>
                <td>${new Date(client.updatedAt).toLocaleString()}</td>
                <td>${client.contacts
                  .map((contact) => `${contact.type}: ${contact.value}`)
                  .join(", ")}</td>
                      <td>
                       ${client.contacts
                         .map(
                           (contact) => `
                          <span class="contact-tooltip">
                               <span class="contact-icon">
                                 ${getContactIcon(contact.type)}
                              </span>
                              <span class="tooltip-text">
                                  <strong>${
                                    contact.type.charAt(0).toUpperCase() +
                                    contact.type.slice(1)
                                  }:</strong> ${contact.value}
                              </span>
                           </span>
                       `
                         )
                         .join(" ")}
                    </td>
                    <td class="actions">
                    <button class="edit-btn" onclick="openEditClientModal(${
                      client.id
                    })">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.7" clip-path="url(#clip0_216_47)">
                    <path d="M2 11.5002V14.0002H4.5L11.8733 6.62687L9.37333 4.12687L2 11.5002ZM13.8067 4.69354C14.0667 4.43354 14.0667 4.01354 13.8067 3.75354L12.2467 2.19354C11.9867 1.93354 11.5667 1.93354 11.3067 2.19354L10.0867 3.41354L12.5867 5.91354L13.8067 4.69354Z" fill="#9873FF"/>
                    </g><defs><clipPath id="clip0_216_47"><rect width="16" height="16" fill="white"/></clipPath></defs>
                    </svg>
                    Изменить
                    </button>
                    <button class="delete-btn" onclick="deleteClientButton(${
                      client.id
                    })">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.7" clip-path="url(#clip0_216_224)">
                    <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_216_224">
                    <rect width="16" height="16" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                   Удалить</button>
                   </td>
            `;
    tableBody.appendChild(row);
  });
}

// Изначально показываем спиннер и скрываем таблицу
window.onload = function () {
  const tableBody = document.querySelector("#client-table tbody");
  const loadingSpinner = document.getElementById("loading");

  // Отображаем спиннер и скрываем таблицу
  tableBody.style.display = "none"; // Скрываем tbody
  loadingSpinner.style.display = "flex"; // Показываем спиннер

  // Имитация загрузки данных с задержкой
  setTimeout(() => {
    // После загрузки данных скрываем спиннер и показываем таблицу
    displayClients(); // Загружаем клиентов в таблицу
  }, 2000); // задержка для примера, можете заменить на реальную загрузку данных
};

// Функция для фильтрации клиентов по строке поиска
function filterClients() {
  const searchValue = document.querySelector("#search").value.toLowerCase();
  const filteredClients = clients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(searchValue) ||
      client.lastName.toLowerCase().includes(searchValue) ||
      client.middleName.toLowerCase().includes(searchValue)
  );
  const tableBody = document.querySelector("#client-table tbody");
  tableBody.innerHTML = "";

  filteredClients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${client.id}</td>
<td>${client.lastName} ${client.firstName} ${client.middleName}</td>  
<td>${new Date(client.createdAt).toLocaleString()}</td>  
<td>${new Date(client.updatedAt).toLocaleString()}</td>  
<td>${client.contacts  
      .map((contact) => `${getContactIcon(contact.type)} ${contact.value}`)  
      .join(", ")}</td>  
<td>  
  <button class="edit-btn" onclick="openEditClientModal(${client.id})">Изменить</button>  
  <button class="delete-btn" onclick="openDeleteClientModal(${client.id})">Удалить</button>  
</td>  
    `;  
    tableBody.appendChild(row);  
  });
}

