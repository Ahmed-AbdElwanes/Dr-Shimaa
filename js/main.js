// start varaibles
let form = document.querySelector(".form");
let section = document.querySelector(".record");
let email = document.getElementById("email");
let pass = document.getElementById("pass");
let send = document.querySelector(".form button");

const localStor = false;

if (localStor == true) {
  window.localStorage.setItem("email", "Shamekh1@gmail");
  window.localStorage.setItem("pass", "Shamekh@10c");
}

// gitenig from local
let storEmail = window.localStorage.getItem("email");
let storPass = window.localStorage.getItem("pass");

console.log(email.innerText);
console.log(pass);

// put the values
function putt(Email, password) {
  console.log();
  email.value = Email;
  pass.value = password;
}

putt(storEmail, storPass);

// checking login
send.addEventListener("click", () => {
  if (email.value === storEmail && pass.value === storPass) {
    console.log("loged");
    form.style.display = "none";
    section.style.display = "block";
  } else {
    console.log("did't loged");
  }
});

// try
// https://github.com/Ahmed-AbdElwanes/Abd-Elwanes/blob/main/imgs/awesome-video.mp4
// async function fetchRecord(recordId) {
//   const response = await fetch(`https://example.com/records/record_${recordId}.json`);
//   const data = await response.json();
//   return data;
// }

// // استخدام الدالة
// fetchRecord(1).then(record => console.log(record));

// Table Of Records
let tbody = document.querySelector(".table tbody");
const subjecName = document.createElement("p");
subjecName.className = "subjecName";
subjecName.innerText = "administrative";
tbody.appendChild(subjecName);
for (rec of allRecord) {
  console.log(rec);
  let tr = document.createElement("tr");
  let tdRec = document.createElement("td");
  let tdName = document.createElement("td");
  tdRec.innerText = rec.artist;
  tdName.innerText = rec.name;

  tr.appendChild(tdRec);
  tr.appendChild(tdName);
  tbody.appendChild(tr);
}

console.log(tbody);
