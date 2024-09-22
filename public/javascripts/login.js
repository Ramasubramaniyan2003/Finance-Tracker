const forms = document.querySelector(".forms"),
    pwShowHide = document.querySelectorAll(".eye-icon"),
    links = document.querySelectorAll(".link");

pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

        pwFields.forEach(password => {
            if (password.type === "password") {
                password.type = "text";
                eyeIcon.classList.replace("bx-hide", "bx-show");
                return;
            }
            password.type = "password";
            eyeIcon.classList.replace("bx-show", "bx-hide");
        })

    })
})

links.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault(); //preventing form submit
        forms.classList.toggle("show-signup");
    })
})

//signup
document.querySelector('#signup').addEventListener('submit',(e) => {
    e.preventDefault();
    const password = $('#signupPassword').val()
    const CnfrmPassword = $('#signupCnfrmPassword').val();
    if(password == CnfrmPassword) {
    const userName = $('#signupEmail').val();
    console.log(userName, password);
    $.ajax({
        type: 'POST',
        url: '/user/signup',
        data: {email: userName, password: password},
        headers: { 'X-AT-SessionToken': localStorage.sessionToken }
    }).done(function (response) {
        if (response.success === true) {
            console.log('msg send...');
            alert('msg send')
           } else {
            alert(response.error || 'Error saving data');
        };
    });
    } else {
        alert('Wrong Password');
    }
})

//login
document.querySelector('#login').addEventListener('submit',(e) => {
    e.preventDefault();

    const userName = $('#login').serialize();
    console.log(userName);
    $.ajax({
        type: 'POST',
        url: '/user/login',
        data: $('#login').serialize(),
    }).done(function (response) {
        
        if (response.success === true) {
            localStorage.setItem('sessionToken', response.token);
			localStorage.setItem('id', response.id);
			localStorage.setItem('email', response.email);
            window.location ='/transaction';
           } else {
            alert(response.error || 'Error Login');
        };
    });
})

// //continue with google
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // On page load, capture the token and store it
  window.onload = function() {
    const token = getQueryParam('token');
    const email = getQueryParam('email');
    const id = getQueryParam('id');

    if (token) {
      // Store the token in localStorage
      localStorage.setItem('sessionToken', token);
      localStorage.setItem('email', email);
      localStorage.setItem('id', id);
      // You can redirect the user to the home or profile page here
      window.location.href = '/dashboard'; //dashboard
    }
  }