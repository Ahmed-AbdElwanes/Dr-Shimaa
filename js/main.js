function all2() {
  function blockDevTool() {
    // block dev tools
    document.addEventListener("contextmenu", function (event) {
      event.preventDefault(); // منع القائمة الافتراضية من الظهور
      alert("الضغط بالزر الأيمن ممنوع!"); // رسالة اختيارية
    });
    document.addEventListener("keydown", function (event) {
      // منع Ctrl + Shift + I
      if (event.ctrlKey && event.shiftKey && event.key === "I") {
        event.preventDefault();
        alert("فتح أدوات المطورين ممنوع!");
      }

      // منع Ctrl + Shift + C
      if (event.ctrlKey && event.shiftKey && event.key === "C") {
        event.preventDefault();
        alert("فحص العناصر ممنوع!");
      }

      // منع Ctrl + Shift + J
      if (event.ctrlKey && event.shiftKey && event.key === "J") {
        event.preventDefault();
        alert("فتح وحدة التحكم ممنوع!");
      }

      // منع F12
      if (event.key === "F12") {
        event.preventDefault();
        alert("فتح أدوات المطورين ممنوع!");
      }

      // منع Cmd + Option + I (لنظام Mac)
      if (event.metaKey && event.altKey && event.key === "i") {
        event.preventDefault();
        alert("فتح أدوات المطورين ممنوع!");
      }

      // منع Cmd + Option + C (لنظام Mac)
      if (event.metaKey && event.altKey && event.key === "c") {
        event.preventDefault();
        alert("فحص العناصر ممنوع!");
      }
    });
    // block dev tools
  }
  // blockDevTool();

  // start varaibles
  let form = document.querySelector(".form");
  let section = document.querySelector(".record");
  let email = document.getElementById("email");
  let pass = document.getElementById("pass");
  let send = document.querySelector(".form button");
  const admin = document.querySelector(".admin");
  // gitenig email, pass from local to check
  // let storEmail = window.localStorage.getItem("email");
  // let storPass = window.localStorage.getItem("pass");

  let localStor = false;

  // start the door to go in records page
  // contact with Api LocalOpen
  async function getLocalOpen() {
    // debugger;
    try {
      const response = await fetch("https://apidemo.runasp.net/api/LocalOpen", {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error("فشل الطلب");
      }

      console.log(response);
      // console.error(response);
      const data = await response.json(); // إذا كانت الاستجابة JSON
      console.log("النتيجة:::", data);
      localStor = data;
      putInLocal(data);
      putt();
    } catch (error) {
      console.log(error);
    }
  }

  getLocalOpen();

  function putInLocal() {
    if (localStor == true) {
      window.localStorage.setItem("email", "Shamekh1@gmail");
      window.localStorage.setItem("pass", "Shamekh@10a");
      console.log("putten in Local");
    }
  }
  // putInLocal();

  // put the values
  function putt() {
    let Email = window.localStorage.getItem("email");
    let password = window.localStorage.getItem("pass");
    console.log("put in inputs 1");
    email.value = Email;
    pass.value = password;
    console.log("put in inputs 2");
  }

  putt();

  // checking login
  send.addEventListener("click", () => {
    let storEmail = window.localStorage.getItem("email");
    let storPass = window.localStorage.getItem("pass");
    if (
      email.value === storEmail ||
      email.value === storEmail + "admin!" ||
      (email.value === "shimaa!!!" && pass.value === storPass) ||
      pass.value === "pass!!!01"
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
}
all2();
