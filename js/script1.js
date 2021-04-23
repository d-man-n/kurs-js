const zeroDate = (num) => num < 10 ? '0' + num : num;

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

const clearModal = () => {
    document.querySelector('#surName').value = '';
    document.querySelector('#name').value = '';
    document.querySelector('#lastName').value = '';

    const contactFields = document.querySelectorAll('.form__contact-field');
    for (let i = 0; i < contactFields.length; i++) {
        contactFields[i].remove();
    }
}

async function loadItems() {
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();
    const tab = document.querySelector('.clients__table');

    const contactIcon = new Map([['phone', 'img/phone-icon.svg'], ['email', 'img/mail-icon.svg'], ['vk', 'img/vk-icon.svg'], ['fb', 'img/fb-icon.svg']]);

    for (let dd of data) {
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
        for (let cc of dd.contacts) {
            contacts.innerHTML += `<img src='${contactIcon.get(cc.type)}' class='contact__icon'>`;
        }
        row.append(contacts);

        const actions = document.createElement('td');
        actions.classList.add('clients__table-cell');
        actions.innerHTML = `<button class='btn-reset clients__edit'>Изменить</button><button class='btn-reset clients__cancel'>Удалить</button>`;
        row.append(actions);

        tab.append(row);
    }
    document.querySelector('.clients__table-row-loading').remove();
}

async function createItem(user) {
    console.log(user);
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

setTimeout(loadItems, 1000);
// loadItems();

const createContactField = (type = 1, text = '') => {
    const contactField = document.createElement('div');
    contactField.classList.add('form__contact-field');

    const contactType = document.createElement('select');
    contactType.classList.add('form__select');
    const tel = document.createElement('option');
    tel.textContent = 'Телефон';
    tel.value = 'phone';
    contactType.append(tel);

    const tel2 = document.createElement('option');
    tel2.textContent = 'Доп. телефон';
    tel2.value = 'phone2';
    contactType.append(tel2);

    const email = document.createElement('option');
    email.textContent = 'Email';
    email.value = 'email';
    contactType.append(email);

    const vk = document.createElement('option');
    vk.textContent = 'Vk';
    vk.value = 'vk';
    contactType.append(vk);

    const facebook = document.createElement('option');
    facebook.textContent = 'Facebook';
    facebook.value = 'fb'
    contactType.append(facebook);

    const contactText = document.createElement('input');
    contactText.type='text';
    contactText.placeholder = 'Введите данные контакта';
    contactText.classList.add('form__contact-input');

    contactField.append(contactType);
    contactField.append(contactText);

    return {
        contactField,
        contactType,
        contactText
    }
}

document.querySelector('.clients__add').addEventListener('click', function(ev) {
    ev.preventDefault();
    document.querySelector('.modal-bg').classList.add('modal-bg__showed');
});

document.querySelector('.form__contact').addEventListener('click', function(ev) {
    ev.preventDefault();
    const contacts = document.querySelector('.form__contacts-field');
    const contact = createContactField();
    contacts.append(contact.contactField);

});

const cancel = document.querySelectorAll('.cancel');

for (let i = 0; i < cancel.length; i++) {
    cancel[i].addEventListener('click', function(ev) {
        ev.preventDefault();
        document.querySelector('.modal-bg').classList.remove('modal-bg__showed');
    });
}

document.querySelector('.form__save').addEventListener('click', function(ev) {
    ev.preventDefault();
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

    createItem({name, surName, lastName, contacts});
    removeItems();
    document.querySelector('.modal-bg').classList.remove('modal-bg__showed');
    clearModal();
    setTimeout(loadItems, 1000);
})