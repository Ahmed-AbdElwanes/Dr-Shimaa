// start Upload audio
document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Loading...");
    const formData = new FormData();
    formData.append("Team", document.getElementById("teamInput").value);
    formData.append("File", document.getElementById("fileInput").files[0]);

    try {
      // ملاحظة: الخادم لا يدعم HTTPS، لذا نستخدم وكيل CORS Anywhere كحل مؤقت
      // للإنتاج، يجب تمكين HTTPS على الخادم أو استخدام وكيل مخصص (مثل Cloudflare Workers)
      const response = await fetch("http://apidemo.runasp.net/api/Upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("فشل الرفع");

      const result = await response.text(); // أو response.json() إذا كان الـ API يُرجع JSON
      document.getElementById("result").innerText = "تم الرفع بنجاح: " + result;
      document.getElementById("result").classList.add("success");
      document.getElementById("result").classList.remove("error");
    } catch (error) {
      document.getElementById("result").innerText = "خطأ: " + error.message;
      document.getElementById("result").classList.add("error");
      document.getElementById("result").classList.remove("success");
    } finally {
      console.log("upload audio func ended");
    }
  });
// end Upload audio
// // start ubdate boolean value to open
// let updateButn = document.querySelector(".updateBool button");
// let dorState = document.querySelector(".updateBool .state");
// let booleRespons = false;

// // contact with Api LocalOpen

// async function getLocalOpen() {
//   // debugger;
//   try {
//     const response = await fetch("http://apidemo.runasp.net/api/LocalOpen", {
//       method: "GET"
//     });

//     if (!response.ok) {
//       throw new Error("فشل الطلب");
//     }

//     console.log(response);
//     // console.error(response);
//     const data = await response.json(); // إذا كانت الاستجابة JSON
//     console.log("النتيجة:", data);
//     booleRespons = data;
//     localStor = data;
//   } catch (error) {
//     console.log(error);
//   }
// }
// console.log("tttttt", booleRespons);

// // contact with Api to update LocalOpen
// async function updateBoolValue(boolea) {
//   console.log("جارٍ إرسال الطلب...");
//   try {
//     const response = await fetch(
//       `http://apidemo.runasp.net/api/LocalOpen/${boolea}`,
//       {
//         method: "PUT"
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`فشل الطلب: ${response.status}`);
//     }

//     const result = await response.text(); // أو response.json() إذا كان الـ API يُرجع JSON
//     dorState.innerText = boolea ? "البوابة مفتوحة" : "البوابة مغلقة";
//     dorState.classList.add(boolea ? "open" : "closed");
//     dorState.classList.remove(boolea ? "closed" : "open");
//     console.log("تم تحديث القيمة بنجاح:", result);
//     console.log("ppppp", booleRespons);
//   } catch (error) {
//     console.error("خطأ في تحديث القيمة:", error);
//     dorState.innerText = "خطأ: فشل التحديث";
//     dorState.classList.add("error");
//     dorState.classList.remove("open", "closed");
//   }
// }

// updateButn.addEventListener("click", () => {
//   getLocalOpen();
//   updateBoolValue(!booleRespons);
// });

// // مستمع الحدث للنقر على الزر
// updateButn.addEventListener("click", async () => {
//   try {
//     const currentState = await getLocalOpen(); // انتظار جلب الحالة
//     await updateBoolValue(!currentState); // تحديث الحالة المعاكسة
//     updateButn.innerText = !currentState ? "إغلاق الباب" : "فتح الباب"; // تحديث نص الزر
//   } catch (error) {
//     // الأخطاء تُعالج في getLocalOpen و updateBoolValue
//   }
// });

// // end ubdate boolean value to open
// getLocalOpen();

// Ai
//
//
// اختيار العناصر
let updateButn = document.querySelector(".updateBool button");
let dorState = document.querySelector(".updateBool .state");
let booleRespons = false;

// جلب الحالة الحالية من الـ API
async function getLocalOpen() {
  try {
    const response = await fetch(
      // استخدام وكيل CORS Anywhere لحل مشكلة المحتوى المختلط مؤقتًا
      "http://apidemo.runasp.net/api/LocalOpen",
      {
        method: "GET"
      }
    );

    if (!response.ok) {
      throw new Error(`فشل الطلب: ${response.status}`);
    }

    const data = await response.json();
    console.log("النتيجة:", data);
    booleRespons = data; // تحديث القيمة المنطقية
    dorState.innerText = data ? "البوابة مفتوحة" : "البوابة مغلقة";
    dorState.classList.add(data ? "open" : "closed");
    dorState.classList.remove(data ? "closed" : "open");
    return data; // إرجاع القيمة للاستخدام في مستمع الحدث
  } catch (error) {
    console.error("خطأ في جلب الحالة:", error);
    dorState.innerText = "خطأ: فشل جلب الحالة";
    dorState.classList.add("error");
    dorState.classList.remove("open", "closed");
    throw error; // إعادة رمي الخطأ لمعالجته في مستمع الحدث
  }
}

// تحديث القيمة المنطقية
async function updateBoolValue(boolea) {
  console.log("جارٍ إرسال الطلب...");
  try {
    const response = await fetch(
      // استخدام وكيل CORS Anywhere
      `http://apidemo.runasp.net/api/LocalOpen/${boolea}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isOpen: boolea }) // إرسال القيمة المنطقية
      }
    );

    if (!response.ok) {
      throw new Error(`فشل الطلب: ${response.status}`);
    }

    const result = await response.text(); // أو response.json() إذا كان الـ API يُرجع JSON
    booleRespons = boolea; // تحديث القيمة المنطقية محليًا
    dorState.innerText = boolea ? "البوابة مفتوحة" : "البوابة مغلقة";
    dorState.classList.add(boolea ? "open" : "closed");
    dorState.classList.remove(boolea ? "closed" : "open");
    console.log("تم تحديث القيمة بنجاح:", result);
  } catch (error) {
    console.error("خطأ في تحديث القيمة:", error);
    dorState.innerText = "خطأ: فشل التحديث";
    dorState.classList.add("error");
    dorState.classList.remove("open", "closed");
  }
}

// مستمع الحدث للنقر على الزر
updateButn.addEventListener("click", async () => {
  try {
    const currentState = await getLocalOpen(); // انتظار جلب الحالة
    await updateBoolValue(!currentState); // تحديث الحالة المعاكسة
    updateButn.innerText = !currentState ? "إغلاق الباب" : "فتح الباب"; // تحديث نص الزر
  } catch (error) {
    // الأخطاء تُعالج في getLocalOpen و updateBoolValue
  }
});

// جلب الحالة عند تحميل الصفحة
getLocalOpen();
