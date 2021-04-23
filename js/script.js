(function() {
    const input = document.querySelector('.header__query');

    //Преобразовать 9 в 09
    const zeroDate = (num) => num < 10 ? '0' + num : num;

    //Добавление - Удаление классов сортировки
    const sortClass = (cell) => {
        let rev = false;
        if (cell.classList.contains('clients__table-header-cell_usort')) {
            cell.classList.remove('clients__table-header-cell_usort');
            cell.classList.add('clients__table-header-cell_dsort');
            rev = true;
        }
        else if (cell.classList.contains('clients__table-header-cell_dsort')) {
            cell.classList.remove('clients__table-header-cell_dsort');
            cell.classList.add('clients__table-header-cell_usort');
        }
        else {
            const cellHeader = document.querySelectorAll('.clients__table-header-cell');
            for (let i = 0; i < cellHeader.length; i++) {
                cellHeader[i].classList.remove('clients__table-header-cell_usort');
                cellHeader[i].classList.remove('clients__table-header-cell_dsort');
            }
            cell.classList.add('clients__table-header-cell_usort');
        }
        return rev;
    }

    //Очистить таблицу и добавить индикатор загрузки
    const removeItems = () => {
        const oldData = document.querySelectorAll('.clients__table-row');
        for (let i = 0; i < oldData.length; i++) {
            oldData[i].remove();
        }
    
        const loadingRow = document.createElement('tr');
        loadingRow.classList.add('clients__table-row', 'clients__table-row-loading');
        const loadingColl = document.createElement('td');
        loadingColl.classList.add('clients__table-cell', 'clients__table-cell-loading');
        loadingColl.colSpan = 6;
        const loadingContainer = document.createElement('div');
        loadingContainer.classList.add('clients__test');
        const loadingImg = document.createElement('div');
        loadingImg.classList.add('clients__loading');
    
        loadingContainer.append(loadingImg);
        loadingColl.append(loadingContainer);
        loadingRow.append(loadingColl);
    
        document.querySelector('.clients__table').append(loadingRow);
    }

    //Кнопка добавить клиента
    const buttonAdd = () => {
        button = document.createElement('button');
        button.classList.add('btn-reset', 'clients__add');
        button.textContent = 'Добавить клиента';

        buttonContainer = document.createElement('div');
        buttonContainer.classList.add('clients__add-container');
        buttonContainer.append(button);

        button.addEventListener('click', function(ev) {
            ev.preventDefault();
            openModal();
        });

        return {
            buttonContainer,
            button
        };
    }

    //Получение данных с формы
    const getModalData = (user) => {
        const name = document.querySelector('#name').value;
        const surName = document.querySelector('#surName').value;
        const lastName = document.querySelector('#lastName').value;
    
        const contactType = document.querySelectorAll('.form__select');
        const contactText = document.querySelectorAll('.form__contact-input');
    
        let contactTypeValue = [];
        for (let i = 0; i < contactType.length; i++) {
            contactTypeValue[i] = contactType[i].value;
        }
    
        let contacts = [];
        for (let i = 0; i < contactText.length; i++) {
            contacts[i] = {'type': contactTypeValue[i], 'value': contactText[i].value};
        }

        return {user, name, surName, lastName, contacts};
    }

    //Показ модального окна
    const openModal = (user) => {
        const saveBtn = document.createElement('button');
        saveBtn.classList.add('btn-reset', 'form__save');
        saveBtn.textContent = 'Сохранить';
        const cancelBtn = document.createElement('button');
        cancelBtn.classList.add('btn-reset', 'form__cancel', 'cancel');

        if (user) {
            document.querySelector('.modal__title').innerHTML = `Изменить данные <span>ID: ${user.id}</span>`;
            document.querySelector('#surName').value = user.surname;
            document.querySelector('#name').value = user.name;
            document.querySelector('#lastName').value = user.lastName;

            for (let i = 0; i < user.contacts.length; i++) {
                document.querySelector('.form__contacts-field').append(createContactField(user.contacts[i].type, user.contacts[i].value).contactField);
            }
            //Кнопка Сохранить
            saveBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                const modalData = getModalData(user);
                saveItem(modalData);
                removeItems();
                document.querySelector('.modal-bg').classList.remove('modal-bg__showed');
                clearModal();
                setTimeout(loadItems, 100);
            })
            //Кнопка Удалить клиента
            cancelBtn.textContent = 'Удалить клиента';
            cancelBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                clearModal();
                document.querySelector('.modal-bg').classList.remove('modal-bg__showed');
                onDelete(user.id);
                removeItems();
                setTimeout(loadItems, 100);
            });
            //Кнопка Добавить контакт
            if (document.querySelectorAll('.form__contact-field').length === 10) {
                document.querySelector('.form__contact').style.display = 'none';
            }
        }
        else {
            document.querySelector('.modal__title').innerHTML = `Новый клиент`;
            //Кнопка Сохранить
            saveBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                const modalData = getModalData();
                createItem(modalData);
                removeItems();
                document.querySelector('.modal-bg').classList.remove('modal-bg__showed');
                clearModal();
                setTimeout(loadItems, 100);
            })
            //Кнопка отмена
            cancelBtn.textContent = 'Отмена';
            cancelBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                clearModal();
                document.querySelector('.modal-bg').classList.remove('modal-bg__showed');
            });
            //Кнопка Добавить контакт
            document.querySelector('.form__contact').style.display = 'block';
        }

        document.querySelector('.form__btn-field').append(saveBtn);
        document.querySelector('.form__btn-field').append(cancelBtn);
        document.querySelector('.modal-bg').classList.add('modal-bg__showed');
    }

    //Очистка модального окна
    const clearModal = () => {
        document.querySelector('.modal__title').innerHTML = '';

        document.querySelector('#surName').value = '';
        document.querySelector('#name').value = '';
        document.querySelector('#lastName').value = '';
    
        const contactFields = document.querySelectorAll('.form__contact-field');
        for (let i = 0; i < contactFields.length; i++) {
            contactFields[i].remove();
        }
        document.querySelector('.form__save').remove();
        document.querySelector('.form__cancel').remove();
    }

    //Создание полей ввода контактов
    const createContactField = (type = 1, text = '') => {
        const contactField = document.createElement('div');
        contactField.classList.add('form__contact-field');
    
        const contactType = document.createElement('select');
        contactType.classList.add('form__select');
        const tel = document.createElement('option');
        tel.textContent = 'Телефон';
        tel.value = 'phone';
        if (type === 'phone' ) {
            tel.selected = 'selected';
        }
        contactType.append(tel);
    
        const tel2 = document.createElement('option');
        tel2.textContent = 'Доп. телефон';
        tel2.value = 'phone2';
        if (type === 'phone2' ) {
            tel2.selected = 'selected';
        }        
        contactType.append(tel2);
    
        const email = document.createElement('option');
        email.textContent = 'Email';
        email.value = 'email';
        if (type === 'email' ) {
            email.selected = 'selected';
        }
        contactType.append(email);
    
        const vk = document.createElement('option');
        vk.textContent = 'Vk';
        vk.value = 'vk';
        if (type === 'vk' ) {
            vk.selected = 'selected';
        }
        contactType.append(vk);
    
        const facebook = document.createElement('option');
        facebook.textContent = 'Facebook';
        facebook.value = 'fb'
        if (type === 'fb' ) {
            facebook.selected = 'selected';
        }
        contactType.append(facebook);
    
        const contactText = document.createElement('input');
        contactText.type='text';
        contactText.placeholder = 'Введите данные контакта';
        contactText.classList.add('form__contact-input');
        contactText.value = text;

        const contactDelBtn = document.createElement('button');
        contactDelBtn.classList.add('btn-reset', 'form__contact-del');
        contactDelBtn.addEventListener('click', function(){
            contactField.remove();
            if (document.querySelectorAll('.form__contact-field').length < 10) {
                document.querySelector('.form__contact').style.display = 'block';
            }
        })

        contactField.append(contactType);
        contactField.append(contactText);
        contactField.append(contactDelBtn);
    
        return {
            contactField,
            contactType,
            contactText
        }
    }

    //Удалить запись
    async function onDelete(id, element) {
        if (!confirm('Вы уверены?')) {
            return;
        }
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'DELETE',
        });
        if (element) element.remove();
    }

    //Редактирование записи
    const onEdit = (user) => {
        openModal(user)
    }

    //Загрузка таблицы клиентов
    async function loadItems(sort, rev = false, search) {
        const response = await fetch('http://localhost:3000/api/clients');
        const data = await response.json();
        const tab = document.querySelector('.clients__table');
    
        const contactIcon = new Map([['phone', 'img/phone-icon.svg'], ['phone2', 'img/phone-icon.svg'], ['email', 'img/mail-icon.svg'], ['vk', 'img/vk-icon.svg'], ['fb', 'img/fb-icon.svg']]);
        const contactName = new Map([['phone', 'Телефон'], ['phone2', 'Доп. телефон'], ['email', 'Email'], ['vk', 'VK'], ['fb', 'FB']]);
    
        let sortData = data;
        if (sort === 'name') {
            sortData = data.sort((prev, next) => {
                if ( prev.surname + ' ' + prev.name + ' ' + prev.lastName < next.surname + ' ' + next.name + ' ' + next.lastName ) return -1;
                if ( prev.surname + ' ' + prev.name + ' ' + prev.lastName > next.surname + ' ' + next.name + ' ' + next.lastName ) return 1;  
            })
        }
        else if (sort === 'id') {
            sortData = data.sort((prev, next) => prev.id - next.id)
        }
        else if (sort === 'createdAt') {
            sortData = data.sort((prev, next) => prev.createdAt - next.createdAt)
        }
        else if (sort === 'updatedAt') {
            sortData = data.sort((prev, next) => prev.updatedAt - next.updatedAt)
        }

        if (rev) sortData.reverse();

        if (search) {
            sortData = sortData.filter((el) => {
                if (`${el.surname} ${el.name} ${el.lastName}`.toUpperCase().includes(search.toUpperCase())) return el;    
            })
        }

        for (let dd of sortData) {
            const row = document.createElement('tr');
            row.classList.add('clients__table-row');
    
            const id = document.createElement('td');
            id.classList.add('clients__table-cell');
            id.classList.add('clients__table-cell_id');
            id.textContent = dd.id;
            row.append(id);
    
            const fio = document.createElement('td');
            fio.classList.add('clients__table-cell');
            fio.textContent = dd.surname +  ' ' + dd.name + ' ' + dd.lastName;
            row.append(fio);
    
            const dat = new Date(dd.createdAt);
            const cdate = document.createElement('td');
            cdate.classList.add('clients__table-cell');
            cdate.innerHTML = zeroDate(dat.getDate()) + '.' + zeroDate(dat.getMonth()) + '.' + dat.getUTCFullYear() + " <span class='clients__time'>" + dat.getHours() + ':' + zeroDate(dat.getMinutes()) + '</span>';
            row.append(cdate);
    
            const dat2 = new Date(dd.updatedAt);
            const mdate = document.createElement('td');
            mdate.classList.add('clients__table-cell');
            mdate.innerHTML = zeroDate(dat2.getDate()) + '.' + zeroDate(dat2.getMonth()) + '.' + dat2.getUTCFullYear() + " <span class='clients__time'>" + dat2.getHours() + ':' + zeroDate(dat2.getMinutes()) + '</span>';
            row.append(mdate);
    
            const contacts = document.createElement('td');
            contacts.classList.add('clients__table-cell');
            const contactsContainer = document.createElement('div');
            contactsContainer.classList.add('clients__contacts', 'contacts');
            
            for (let cc of dd.contacts) {
                contactsContainer.innerHTML += `<div class="contact__tooltip"><img src='${contactIcon.get(cc.type)}' class='contact__icon'><span class="contact__text">${contactName.get(cc.type)}: ${cc.value}</span></div>`;
            }

            contacts.append(contactsContainer);
            row.append(contacts);
    
            const actions = document.createElement('td');
            actions.classList.add('clients__table-cell');

            const buttonGroup = document.createElement('div');
            const editButton = document.createElement('button');
            const deleteButton = document.createElement('button');
            buttonGroup.classList.add('btn-group');
            editButton.classList.add('btn-reset', 'clients__edit');
            editButton.textContent = 'Изменить';
            deleteButton.classList.add('btn-reset', 'clients__cancel');
            deleteButton.textContent = 'Удалить';
    
            editButton.addEventListener('click', function() {
                onEdit(dd);
            });
    
            deleteButton.addEventListener('click', function() {
                onDelete(dd.id, row);
            });
    
            buttonGroup.append(editButton);
            buttonGroup.append(deleteButton);
            actions.append(buttonGroup);
            row.append(actions);
    
            tab.append(row);
        }
        document.querySelector('.clients__table-row-loading').remove();
    }

    //Новая запись в базе
    async function createItem(user) {
        const response = await fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: user.name,
                surname: user.surName,
                lastName: user.lastName,
                contacts: user.contacts
             })
        });
        return response.status;
    }

    //Изменить запись в базе
    async function saveItem(user) {
        const response = await fetch(`http://localhost:3000/api/clients/${user.user.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: user.name,
                surname: user.surName,
                lastName: user.lastName,
                contacts: user.contacts
             })
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        removeItems();
        document.querySelector('.cleints').append(buttonAdd().buttonContainer);
        setTimeout(loadItems, 1000, 'id', false);

        //Кнопка Добавить контакт
        document.querySelector('.form__contact').addEventListener('click', function(ev) {
            ev.preventDefault();
            document.querySelector('.form__contacts-field').append(createContactField().contactField);
            if (document.querySelectorAll('.form__contact-field').length === 10) {
                this.style.display = 'none';
            }
        });
    
        //Кнопка Отмена, либо крестик
        const cancel = document.querySelectorAll('.cancel');
        for (let i = 0; i < cancel.length; i++) {
            cancel[i].addEventListener('click', function(ev) {
                ev.preventDefault();
                clearModal();
                document.querySelector('.modal-bg').classList.remove('modal-bg__showed');
            });
        }

        //Кнопки сортировки
        //Сортировка по id
        document.querySelector('#id').addEventListener('click', function() {
            removeItems();
            setTimeout(loadItems, 100, 'id', sortClass(this), input.value);
        })

        //Сортировка по ФИО
        document.querySelector('#fio').addEventListener('click', function() {
            removeItems();
            setTimeout(loadItems, 100, 'name', sortClass(this), input.value);
        })
        
        //Сортировка по дате создания
        document.querySelector('#createdAt').addEventListener('click', function() {
            removeItems();
            setTimeout(loadItems, 100, 'createdAt', sortClass(this), input.value);
        })
        
        //Сортировка по дате изменения
        document.querySelector('#updatedAt').addEventListener('click', function() {
            removeItems();
            setTimeout(loadItems, 100, 'updatedAt', sortClass(this), input.value);
        })

        //поиск
        let timeoutID;
        input.addEventListener('input', function(){
            clearTimeout(timeoutID);
            timeoutID = setTimeout(function(){
                removeItems();
                setTimeout(loadItems, 300, 'id', false, input.value); 
            }, 500);
        })

    });
})();