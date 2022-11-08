const checkboxIds = {
    updatePassword: 'updatePassword',
    updateEmail: 'updateEmail',
    updateUsername: 'updateUsername'
};

const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
const repeatNewPasswordInput = document.getElementById('repeatNewPassword');

document.addEventListener('click', (ev) => {
    const checked = ev.target.checked;
    const id = ev.target.id;

    function hideOrShow() {
        const updateSection = document.getElementById(id + 'Section')
        if (!checked) {
            updateSection.setAttribute('class', 'd-none');
        }
        if (checked) {
            updateSection.setAttribute('class', 'mb-3');
        }
    }

    switch (id) {
        case checkboxIds.updatePassword:
            hideOrShow();
            if (!checked) {
                currentPasswordInput.setAttribute('disabled', 'true')
                newPasswordInput.setAttribute('disabled', 'true')
                repeatNewPasswordInput.setAttribute('disabled', 'true')
            } else {
                currentPasswordInput.removeAttribute('disabled')
                newPasswordInput.removeAttribute('disabled')
                repeatNewPasswordInput.removeAttribute('disabled')
            }

            break;
        case checkboxIds.updateEmail:
            hideOrShow();
            if (!checked) {
                document.getElementById('email').setAttribute('disabled', 'true');
            } else {
                document.getElementById('email').removeAttribute('disabled');
            }
            break;
        case checkboxIds.updateUsername:
            hideOrShow();
            if (!checked) {
                document.getElementById('username').setAttribute('disabled', 'true');
            } else {
                document.getElementById('username').removeAttribute('disabled');
            }
            break;
    }

    if (document.getElementById(checkboxIds.updateUsername).checked || document.getElementById(checkboxIds.updateEmail).checked || document.getElementById(checkboxIds.updatePassword).checked || document.getElementById('userImage').files.length) {
        document.getElementById('submitUserUpdates').removeAttribute('disabled');
    } else {
        document.getElementById('submitUserUpdates').setAttribute('disabled', 'true');
    }
});



const newPasswordMatch = document.getElementById('passwords-match');
const newPasswordNotMatch = document.getElementById('passwords-not-match');
const submitBtn = document.getElementById('submitUserUpdates')

newPasswordInput.addEventListener('keyup', function () {
    if (newPasswordInput.value.length) {
        if (newPasswordInput.value === repeatNewPasswordInput.value) {
            newPasswordMatch.classList.remove('d-none');
            newPasswordNotMatch.classList.add('d-none');
            submitBtn.removeAttribute('disabled');
        } else {
            newPasswordMatch.classList.add('d-none');
            newPasswordNotMatch.classList.remove('d-none');

            if (!submitBtn.getAttribute('disabled')) {
                submitBtn.setAttribute('disabled', 'true');
            }
        }
    } else {
        newPasswordMatch.classList.add('d-none');
        newPasswordNotMatch.classList.add('d-none');
        repeatNewPasswordInput.value = '';
        submitBtn.removeAttribute('disabled');
    }
})

repeatNewPasswordInput.addEventListener('keyup', function () {
    if (repeatNewPasswordInput.value === newPasswordInput.value) {
        newPasswordMatch.classList.remove('d-none');
        newPasswordNotMatch.classList.add('d-none');
        submitBtn.removeAttribute('disabled');
    } else {
        newPasswordMatch.classList.add('d-none');
        newPasswordNotMatch.classList.remove('d-none');
        if (!submitBtn.getAttribute('disabled')) {
            submitBtn.setAttribute('disabled', 'true');
        }
    }
})

const imageInput = document.getElementById('userImage');
imageInput.addEventListener('change', function () {
    if (this.files.length) {
        submitBtn.removeAttribute('disabled');
    } else {
        submitBtn.setAttribute('disabled', 'true');
    }
})



