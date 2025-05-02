// //  var

// let form2 = document.querySelector(".session");
// // inputs
// let name2 = document.querySelector(".session .name");
// let email2 = document.querySelector(".session .email");
// let pass2 = document.querySelector(".session .pass");
// // select
// let choseOP = document.querySelector(".session .chose-op");

// // function name
// name2.addEventListener("blur", function () {
//   // add value to session storage
//   window.sessionStorage.setItem("the name", name2.value);

//   // clear input
//   name2.value = "";
// });

// //  after loading add words if we have
// window.addEventListener("load", function () {
//   // check session
//   if (window.sessionStorage.getItem("the name")) {
//     name2.value = window.sessionStorage.getItem("the name");
//   } else {
//     console.log("not");
//   }
// });
// //

// // function email
// email2.addEventListener("blur", function () {
//   // add value to session storage
//   window.sessionStorage.setItem("the email", email2.value);

//   // clear input
//   email2.value = "";
// });

// //  after loading add words if we have
// window.addEventListener("load", function () {
//   // check session
//   if (window.sessionStorage.getItem("the email")) {
//     email2.value = window.sessionStorage.getItem("the email");
//   } else {
//     console.log("not");
//   }
// });
// //

// // function pass
// pass2.addEventListener("blur", function () {
//   // add value to session storage
//   window.sessionStorage.setItem("the pass", pass2.value);

//   // clear input
//   pass2.value = "";
// });

// //  after loading add words if we have
// window.addEventListener("load", function () {
//   // check session
//   if (window.sessionStorage.getItem("the pass")) {
//     pass2.value = window.sessionStorage.getItem("the pass");
//   } else {
//     console.log("not");
//   }
// });
// //

// // function select
// choseOP.addEventListener("blur", function () {
//   // add value to session storage
//   window.sessionStorage.setItem("the select", choseOP.value);

//   // clear input
//   choseOP.value = "";
// });

// //  after loading add words if we have
// window.addEventListener("load", function () {
//   // check session
//   if (window.sessionStorage.getItem("the select")) {
//     choseOP.value = window.sessionStorage.getItem("the select");

//     // loop find selected element and give it selected
//     for (let i = 0; i < choseOP.options.length; i++) {
//       // if we have in storage
//       if (
//         choseOP.options[i].value === window.sessionStorage.getItem("the select")
//       ) {
//         choseOP.options[i].setAttribute("selected", "selected");
//       } else {
//         // if we haven't in storage
//         choseOP.options[i].removeAttribute("selected");
//       }
//     }

//     // check session
//   } else {
//     console.log("no items");
//   }
// });

// // console.log(form2, name2, email2, pass2, choseOP);

// // Ai
// // let form2 = document.querySelector(".session");
// // let inputs = {
// //   name: document.querySelector(".session .name"),
// //   email: document.querySelector(".session .email"),
// //   pass: document.querySelector(".session .pass"),
// //   choseOP: document.querySelector(".session .chose-op")
// // };

// // function handleInputBlur(inputName) {
// //   let inputElement = inputs[inputName];
// //   window.sessionStorage.setItem(inputName, inputElement.value);
// //   // يمكنك اختيار مسح القيمة أو تركها كما هي
// //   // inputElement.value = "";
// // }

// // function loadInputValue(inputName) {
// //   let inputElement = inputs[inputName];
// //   if (window.sessionStorage.getItem(inputName)) {
// //     inputElement.value = window.sessionStorage.getItem(inputName);
// //   }
// // }

// // // إضافة الأحداث
// // for (let key in inputs) {
// //   inputs[key].addEventListener("blur", () => handleInputBlur(key));
// //   window.addEventListener("load", () => loadInputValue(key));
// // }

// // let form = form2.
