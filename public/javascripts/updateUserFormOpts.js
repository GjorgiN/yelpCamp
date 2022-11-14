const checkboxIds = ['updateProfilePicture', 'updateUsername', 'updateEmail', 'updatePassword'];

const newPasswordInput = document.getElementById('newPassword');
const repeatNewPasswordInput = document.getElementById('repeatNewPassword');


const checkboxes = checkboxIds.map(checkboxId => document.getElementById(checkboxId));
const sections = checkboxIds.map(checkboxId => document.getElementById(`${checkboxId}Section`));

// const updateUsernameCheckbox = document.getElementById(checkboxIds.updateUsername);
// const updateEmailCheckbox = document.getElementById(checkboxIds.updateEmail);
// const updatePasswordCheckbox = document.getElementById(checkboxIds.updatePassword);

function hideOrShow(checkbox, section, inputs) {
    if (!checkbox.checked) {
        if (checkbox.id === 'updateProfilePicture') {
            currentUserImage.src = backUpUrl;
            userImageFileInput.value = null;
            removePicture.removeAttribute('checked');
        }

        section.setAttribute('class', 'd-none');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].setAttribute('disabled', 'true');
        }
    }
    if (checkbox.checked) {
        section.setAttribute('class', 'mb-3');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].removeAttribute('disabled')
        }
    }
}


function disableSubmitBtn() {
    if (userImageFileInput.files.length) {
        submitBtn.removeAttribute('disabled');
        return;
    }

    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            submitBtn.removeAttribute('disabled');
            return;
        }
    }

    submitBtn.setAttribute('disabled', 'true');
}

checkboxIds.forEach(checkboxId => {
    const checkbox = document.getElementById(checkboxId);
    checkbox.addEventListener('click', function () {
        const section = document.getElementById(`${checkboxId}Section`);
        const inputs = document.getElementsByClassName(`${checkboxId}Input`);
        console.log(inputs);
        hideOrShow(checkbox, section, inputs);

        disableSubmitBtn();



    });

})


// document.addEventListener('click', (ev) => {
//     const checked = ev.target.checked;
//     const id = ev.target.id;

//     switch (id) {
//         case checkboxIds.updatePassword:
//             hideOrShow();
//             if (!checked) {
//                 newPasswordInput.setAttribute('disabled', 'true')
//                 repeatNewPasswordInput.setAttribute('disabled', 'true')
//             } else {
//                 newPasswordInput.removeAttribute('disabled')
//                 repeatNewPasswordInput.removeAttribute('disabled')
//             }

//             break;
//         case checkboxIds.updateEmail:
//             hideOrShow();
//             if (!checked) {
//                 document.getElementById('email').setAttribute('disabled', 'true');
//             } else {
//                 document.getElementById('email').removeAttribute('disabled');
//             }
//             break;
//         case checkboxIds.updateUsername:
//             hideOrShow();
//             if (!checked) {
//                 document.getElementById('newUsername').setAttribute('disabled', 'true');
//             } else {
//                 document.getElementById('newUsername').removeAttribute('disabled');
//             }
//             break;
//     }

//     if (document.getElementById(checkboxIds.updateUsername).checked || document.getElementById(checkboxIds.updateEmail).checked || document.getElementById(checkboxIds.updatePassword).checked || document.getElementById('userImage').files.length) {
//         document.getElementById('submitUserUpdates').removeAttribute('disabled');
//     } else {
//         document.getElementById('submitUserUpdates').setAttribute('disabled', 'true');
//     }
// });



const newPasswordMatch = document.getElementById('passwords-match');
const newPasswordNotMatch = document.getElementById('passwords-not-match');
const submitBtn = document.getElementById('submitUserUpdates');

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
});

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
});

// const imageInput = document.getElementById('userImage');
// imageInput.addEventListener('change', function () {
//     if (this.files.length) {
//         submitBtn.removeAttribute('disabled');
//     } else {
//         submitBtn.setAttribute('disabled', 'true');
//     }
// });

const currentUserImage = document.getElementById('showUserImage');
const backUpUrl = currentUserImage.src;
const userImageFileInput = document.getElementById('userImage');
const removePicture = document.getElementById('removePicture');

userImageFileInput.addEventListener('change', function () {
    if (this.files.length) {
        URL.createObjectURL(this.files[0])
        currentUserImage.setAttribute('src', URL.createObjectURL(this.files[0]));
        removePicture.removeAttribute('checked')
        // document.getElementById('removePicture').setAttribute('disabled', 'true')
    } else {
        currentUserImage.src = backUpUrl;
    }
    disableSubmitBtn();
});

removePicture.addEventListener('click', function () {

    if (this.checked) {
        userImageFileInput.value = null;
        userImageFileInput.setAttribute('disabled', 'true');
        currentUserImage.src = 'https://res.cloudinary.com/dajdyiuip/image/upload/v1667840368/YelpCamp/users/defaultUser_nylqtn.svg';
    } else {
        userImageFileInput.removeAttribute('disabled');
        currentUserImage.src = backUpUrl;

    }

});

// document.getElementById('cancelNewImage').addEventListener('click', function () {
//     userImageFileInput.value = null;
//     currentUserImage.src = backUpUrl;
//     disableSubmitBtn();
// });
