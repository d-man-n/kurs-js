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

    //Модальное окно подтверждение удаления
    const confirmDel = (id, element) => {
        const divBg = document.createElement('div');
        divBg.classList.add('confirm-bg');
        const divConfirm = document.createElement('div');
        divConfirm.classList.add('confirm');
        const confirmCloseContainer = document.createElement('div');
        confirmCloseContainer.classList.add('confirm__close-cont');
        const confirmClose = document.createElement('button');
        confirmClose.classList.add('btn-reset', 'confirm__close', 'cancel');
        confirmClose.innerHTML = "<span class='confirm__close-line'></span><span class='confirm__close-line'></span>";
        const confirmHeader = document.createElement('h2');
        confirmHeader.classList.add('confirm__header');
        confirmHeader.textContent = 'Удалить клиента';
        const confirmTitle = document.createElement('p');
        confirmTitle.classList.add('confirm__title');
        confirmTitle.textContent = 'Вы действительно хотите удалить данного клиента?';
        const delBtn = document.createElement('button');
        delBtn.classList.add('btn-reset', 'confirm__delete');
        delBtn.textContent = 'Удалить';
        const confirmCancel = document.createElement('button');
        confirmCancel.classList.add('btn-reset', 'confirm__cancel');
        confirmCancel.textContent = 'Отмена';

        confirmCloseContainer.append(confirmClose);
        divConfirm.append(confirmCloseContainer);
        divConfirm.append(confirmHeader);
        divConfirm.append(confirmTitle);
        divConfirm.append(delBtn);
        divConfirm.append(confirmCancel);
        divBg.append(divConfirm);
        document.querySelector('body').append(divBg);
        
        confirmClose.addEventListener('click', function(ev) {
            ev.preventDefault();
            divBg.remove();
        })

        confirmCancel.addEventListener('click', function(ev) {
            ev.preventDefault();
            divBg.remove();
        })

        delBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            onDelete(id, element);
            divBg.remove();
        })
    }

    //Модальное окно Добавить клиента/Изменить
    const openModal = (user, row) => {
        const divBg = document.createElement('div');
        divBg.classList.add('modal-bg');
        const divModal = document.createElement('div');
        divModal.classList.add('modal');
        const modalHeaderContainer = document.createElement('div');
        modalHeaderContainer.classList.add('modal__header-cont');
        const modalClose = document.createElement('button');
        modalClose.classList.add('btn-reset', 'modal__close');
        modalClose.innerHTML = "<span class='modal__close-line'></span><span class='modal__close-line'></span>";
        const modalHeader = document.createElement('h2');
        modalHeader.classList.add('modal__header');
        const modalForm = document.createElement('form');
        modalForm.classList.add('modal__form');
        const modalInputContainer = document.createElement('div');
        modalInputContainer.classList.add('modal__inputs');

        const modalSurnameContainer = document.createElement('div');
        modalSurnameContainer.classList.add('modal__placeholder-container');
        const modalSurname = document.createElement('input');
        modalSurname.classList.add('form__input');
        modalSurname.type = 'text';
        modalSurname.name = 'surName';
        modalSurname.id = 'surName';
        modalSurname.placeholder = ' ';
        const modalSurnameLabel = document.createElement('label');
        modalSurnameLabel.classList.add('modal__label');
        modalSurnameLabel.htmlFor = 'surName';
        modalSurnameLabel.innerHTML = 'Фамилия<span>*</span>';
        modalSurnameContainer.append(modalSurname);
        modalSurnameContainer.append(modalSurnameLabel);

        const modalNameContainer = document.createElement('div');
        modalNameContainer.classList.add('modal__placeholder-container');
        const modalName = document.createElement('input');
        modalName.classList.add('form__input');
        modalName.type = 'text';
        modalName.name = 'name';
        modalName.id = 'name';
        modalName.placeholder = ' ';
        const modalNameLabel = document.createElement('label');
        modalNameLabel.classList.add('modal__label');
        modalNameLabel.htmlFor = 'name';
        modalNameLabel.innerHTML = 'Имя<span>*</span>';
        modalNameContainer.append(modalName);
        modalNameContainer.append(modalNameLabel);

        const modalLastnameContainer = document.createElement('div');
        modalLastnameContainer.classList.add('modal__placeholder-container');
        const modalLastname = document.createElement('input');
        modalLastname.classList.add('form__input');
        modalLastname.type = 'text';
        modalLastname.name = 'lastName';
        modalLastname.id = 'lastName';
        modalLastname.placeholder = ' ';
        const modalLastnameLabel = document.createElement('label');
        modalLastnameLabel.classList.add('modal__label');
        modalLastnameLabel.htmlFor = 'lastName';
        modalLastnameLabel.textContent = 'Отчество';
        modalLastnameContainer.append(modalLastname);
        modalLastnameContainer.append(modalLastnameLabel);

        const modalFormContacts = document.createElement('div');
        modalFormContacts.classList.add('form__contacts-field');
        const modalFormAddContacts = document.createElement('div');
        modalFormAddContacts.classList.add('form__new-contacts');
        const modalBtnContact = document.createElement('button');
        modalBtnContact.classList.add('btn-reset', 'form__contact');
        modalBtnContact.innerHTML = "<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M7,0.3c-3.7,0-6.7,3-6.7,6.7c0,3.7,3,6.7,6.7,6.7s6.7-3,6.7-6.7C13.7,3.3,10.7,0.3,7,0.3z M7,12.3	c-2.9,0-5.3-2.4-5.3-5.3S4.1,1.7,7,1.7s5.3,2.4,5.3,5.3S9.9,12.3,7,12.3z' fill='#9873FF'/><circle cx='7' cy='7' r='6.8' fill='none'/><path d='M7,10.3c0.4,0,0.7-0.3,0.7-0.7v-2h2c0.4,0,0.7-0.3,0.7-0.7c0-0.4-0.3-0.7-0.7-0.7h-2v-2C7.7,4,7.4,3.7,7,3.7 C6.6,3.7,6.3,4,6.3,4.3v2h-2C4,6.3,3.7,6.6,3.7,7c0,0.4,0.3,0.7,0.7,0.7h2v2C6.3,10,6.6,10.3,7,10.3z' fill='#9873FF'/></svg>Добавить контакт";
        const modalTextError = document.createElement('div');
        modalTextError.classList.add('form__error');
        const modalBtnContainer = document.createElement('div');
        modalBtnContainer.classList.add('form__btn-field');

        divBg.append(divModal);
        modalHeaderContainer.append(modalHeader);
        modalHeaderContainer.append(modalClose);
        divModal.append(modalHeaderContainer);
        divModal.append(modalForm);
        modalInputContainer.append(modalSurnameContainer);
        modalInputContainer.append(modalNameContainer);
        modalInputContainer.append(modalLastnameContainer);
        modalForm.append(modalInputContainer);
        modalFormContacts.append(modalFormAddContacts);
        modalFormContacts.append(modalBtnContact);
        modalForm.append(modalFormContacts);
        modalForm.append(modalTextError);
        modalForm.append(modalBtnContainer);
        document.querySelector('body').append(divBg);

        const saveBtn = document.createElement('button');
        saveBtn.classList.add('btn-reset', 'form__save');
        saveBtn.innerHTML = "<svg class='form__save-load' width='13' height='13' viewBox='0 0 13 13' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M1.00008 6.03996C1.00008 8.82344 3.2566 11.08 6.04008 11.08C8.82356 11.08 11.0801 8.82344 11.0801 6.03996C11.0801 3.25648 8.82356 0.999956 6.04008 0.999956C5.38922 0.999956 4.7672 1.1233 4.196 1.348' stroke='#B89EFF' stroke-width='2' stroke-miterlimit='10' stroke-linecap='round'/></svg>Сохранить";
        const cancelBtn = document.createElement('button');
        cancelBtn.classList.add('btn-reset', 'form__cancel', 'cancel');

        if (user) {
            modalHeader.innerHTML = `Изменить данные <span>ID: ${user.id}</span>`;
            modalSurname.value = user.surname;
            modalName.value = user.name;
            modalLastname.value = user.lastName;

            for (let i = 0; i < user.contacts.length; i++) {
                modalFormAddContacts.append(createContactField(user.contacts[i].type, user.contacts[i].value).contactField);
                modalBtnContact.style.marginBottom = '15px';
            }
            //Кнопка Добавить контакт
            if (document.querySelectorAll('.form__contact-field').length === 10) {
                modalBtnContact.style.display = 'none';
            }
            //Кнопка Сохранить
            saveBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                this.classList.add('form__save_active');
                const modalData = getModalData(user);

                fetch(`http://localhost:3000/api/clients/${modalData.user.id}`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: modalData.name,
                        surname: modalData.surName,
                        lastName: modalData.lastName,
                        contacts: modalData.contacts
                     })
                })
                .then(() => {
                    setTimeout(function(){
                        saveBtn.classList.remove('form__save_active');
                    }, 1300);
                })
                .then(() => {
                    removeItems();
                    divBg.remove();
                    setTimeout(loadItems, 100, 'id', false);
                })
                .catch(err => {
                    document.querySelector('.form__error').textContent = 'Ошибка: новая модель организационной деятельности предполагает независимые способы реализации поставленных обществом задач!';
                })
            })

            //Кнопка Удалить клиента
            cancelBtn.textContent = 'Удалить клиента';
            cancelBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                divBg.remove();
                confirmDel(user.id, row);
            });
        }
        else {
            modalHeader.innerHTML = `Новый клиент`;
            //Кнопка Сохранить
            saveBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                const modalData = getModalData();
                createItem(modalData);
                removeItems();
                divBg.remove();
                setTimeout(loadItems, 100);
            })
            //Кнопка отмена
            cancelBtn.textContent = 'Отмена';
            cancelBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                divBg.remove();
            });
            //Кнопка Добавить контакт
            modalBtnContact.style.display = 'block';
        }

        modalBtnContainer.append(saveBtn);
        modalBtnContainer.append(cancelBtn);

        //Кнопка закрыть
        modalClose.addEventListener('click', function(ev) {
            ev.preventDefault();
            divBg.remove();
        });
        //Кнопка Добавить контакт
        modalBtnContact.addEventListener('click', function(ev) {
            ev.preventDefault();
            modalFormAddContacts.append(createContactField().contactField);
            if (document.querySelectorAll('.form__contact-field').length === 10) {
                this.style.display = 'none';
            }
            if (document.querySelectorAll('.form__contact-field').length > 0) {
                this.style.marginBottom = '15px';
            }
        });
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
        const button = document.createElement('button');
        button.classList.add('btn-reset', 'clients__add');
        button.textContent = 'Добавить клиента';

        const buttonContainer = document.createElement('div');
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
        tel.addEventListener('click', function(){
            alert('111')
        })
    
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

        const other = document.createElement('option');
        other.textContent = 'Другое';
        other.value = 'other';
        if (type === 'other' ) {
            other.selected = 'selected';
        }        
        contactType.append(other);
    
        const contactText = document.createElement('input');
        contactText.type='text';
        contactText.placeholder = 'Введите данные контакта';
        contactText.classList.add('form__contact-input');
        contactText.value = text;

        const contactDelBtn = document.createElement('button');
        contactDelBtn.classList.add('btn-reset', 'form__contact-del');
        contactDelBtn.innerHTML = "<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z' fill='#B0B0B0'/></svg><span class='contact__text'>Удалить контакт</span>";
        contactDelBtn.addEventListener('click', function(){
            contactField.remove();
            if (document.querySelectorAll('.form__contact-field').length < 10) {
                document.querySelector('.form__contact').style.display = 'block';
            }
            if (document.querySelectorAll('.form__contact-field').length === 0) {
                document.querySelector('.form__contact').style.marginBottom = '0';
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
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'DELETE',
        });
        if (element) element.remove();
    }

    //Загрузка таблицы клиентов
    async function loadItems(sort, rev = false, search) {
        const response = await fetch('http://localhost:3000/api/clients');
        const data = await response.json();
        const tab = document.querySelector('.clients__table');
  
        const contactIcon = new Map([
                ['phone', "<svg  class='contact__icon contact__icon_tel' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><g opacity='0.7'><circle cx='8' cy='8' r='8' fill='#9873FF'/><path d='M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z' fill='white'/></g></svg>"], 
                ['email', "<svg  class='contact__icon contact__icon_other' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><path opacity='0.7' fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z' fill='#9873FF'/></svg>"], 
                ['vk', "<svg  class='contact__icon contact__icon_other' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><g opacity='0.7'><path d='M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z' fill='#9873FF'/></g></svg>"], 
                ['fb', "<svg  class='contact__icon contact__icon_other' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><g opacity='0.7'><path d='M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z' fill='#9873FF'/></g></svg>"], 
                ['other', "<svg  class='contact__icon contact__icon_other' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><path opacity='0.7' fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z' fill='#9873FF'/></svg>"]
            ]);
        const contactName = new Map([['phone', 'Телефон'], ['email', 'Email'], ['vk', 'VK'], ['fb', 'FB'], ['other', 'Другое']]);
    
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
            id.textContent = dd.id.slice(8) + '...';
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
            
            let i = 0;
            const contact = [];
            const moreContactsBtn = document.createElement('button');
            moreContactsBtn.classList.add('btn-reset', 'contact__more');
            moreContactsBtn.textContent = `+${dd.contacts.length - 4}`;

            for (let cc of dd.contacts) {
                if (i === 4) contactsContainer.append(moreContactsBtn);
                contact[i] = document.createElement('div');
                contact[i].classList.add('contact__tooltip');
                if (i >= 4) contact[i].classList.add('contact__tooltip_hidden');
                contact[i].innerHTML = `${contactIcon.get(cc.type)}<span class="contact__text">${contactName.get(cc.type)}: ${cc.value}</span>`;
                contactsContainer.append(contact[i]);
                i++;
            }

            moreContactsBtn.addEventListener('click', function() {
                this.style.display = 'none';
                for (let i = 4; i < contact.length; i++) contact[i].classList.remove('contact__tooltip_hidden');
            })

            contacts.append(contactsContainer);
            row.append(contacts);
    
            const actions = document.createElement('td');
            actions.classList.add('clients__table-cell');

            const buttonGroup = document.createElement('div');
            const editButton = document.createElement('button');
            const deleteButton = document.createElement('button');
            buttonGroup.classList.add('btn-group');
            editButton.classList.add('btn-reset', 'clients__edit');
            editButton.innerHTML = "<svg  class='clients__edit-load'  width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3.00008 8.04008C3.00008 10.8236 5.2566 13.0801 8.04008 13.0801C10.8236 13.0801 13.0801 10.8236 13.0801 8.04008C13.0801 5.2566 10.8236 3.00008 8.04008 3.00008C7.38922 3.00008 6.7672 3.12342 6.196 3.34812' stroke='#9873FF' stroke-width='2' stroke-miterlimit='10' stroke-linecap='round'/></svg>Изменить";
            deleteButton.classList.add('btn-reset', 'clients__cancel');
            deleteButton.textContent = 'Удалить';
    
            editButton.addEventListener('click', function() {
                const promise = new Promise(function(resolve, reject) {
                    editButton.classList.add('clients__edit_active');
                    resolve();
                })
                promise.then(() => {
                    return new Promise((resolve, reject) => {
                        setTimeout(function(){
                            editButton.classList.remove('clients__edit_active');
                            resolve();
                        }, 500); 
                    })
                }).then(() => {
                    openModal(dd, row);
                })
            });
    
            deleteButton.addEventListener('click', function() {
                confirmDel(dd.id, row);
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
    }

    // //Изменить запись в базе
    // async function saveItem(user) {
    //     const response = await fetch(`http://localhost:3000/api/clients/${user.user.id}`, {
    //         method: 'PATCH',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({
    //             name: user.name,
    //             surname: user.surName,
    //             lastName: user.lastName,
    //             contacts: user.contacts
    //          })
    //     }).catch(err => {
    //         document.querySelector('.form__error').textContent = 'Ошибка: новая модель организационной деятельности предполагает независимые способы реализации поставленных обществом задач!';
    //     })
    // }

    document.addEventListener('DOMContentLoaded', function() {
        removeItems();
        document.querySelector('.cleints').append(buttonAdd().buttonContainer);
        setTimeout(loadItems, 1000, 'id', false);

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