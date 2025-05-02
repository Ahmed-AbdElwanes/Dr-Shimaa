// start varaibles
let form = document.querySelector(".form");
let section = document.querySelector(".record");
let email = document.getElementById("email");
let pass = document.getElementById("pass");
let send = document.querySelector(".form button");
const admin = document.querySelector(".admin");

const localStor = false;

// start the door to go in records page
// contact with Api LocalOpen
async function getLocalOpen() {
  // debugger;
  try {
    const response = await fetch("http://apidemo.runasp.net/api/LocalOpen", {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error("فشل الطلب");
    }

    console.log(response);
    // console.error(response);
    const data = await response.json(); // إذا كانت الاستجابة JSON
    console.log("النتيجة:", data);
    localStor = data;
  } catch (error) {
    console.log(error);
  }
}

getLocalOpen();

if (localStor == true) {
  window.localStorage.setItem("email", "Shamekh1@gmail");
  window.localStorage.setItem("pass", "Shamekh@10c");
}

// gitenig email, pass from local to check
let storEmail = window.localStorage.getItem("email");
let storPass = window.localStorage.getItem("pass");

// put the values
function putt(Email, password) {
  console.log();
  email.value = Email;
  pass.value = password;
}

putt(storEmail, storPass);

// checking login
send.addEventListener("click", () => {
  if (
    email.value === storEmail ||
    (email.value === storEmail + "admin!" && pass.value === storPass)
  ) {
    console.log("loged");
    form.style.display = "none";
    section.style.display = "block";
    if (email.value === storEmail + "admin!") {
      admin.style.display = "block";
      console.log("admin in");
    }
  } else {
    console.log("did't loged");
  }
});
// End the door to go in records page
