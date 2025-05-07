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
      document.getElementById(
        "result"
      ).innerHTML = ` <i class="fa-solid fa-spinner"></i> <br/>
      ... يتم الرفع الان`;
      const response = await fetch("https://apidemo.runasp.net/api/Upload", {
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
      "https://apidemo.runasp.net/api/LocalOpen",
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
      `https://apidemo.runasp.net/api/LocalOpen/${boolea}`,
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

//
// delete
document.getElementById("delete").addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Deleting...");
  let teamNum = document.getElementById("teamInput-delete").value;
  const resultElement = document.getElementById("result-delete");

  try {
    // show loading massege
    resultElement.innerHTML = `<i class="fa-solid fa-spinner"></i><br/>يتم الحذف الآن...`;

    // get team data
    const response = await fetch(
      `https://apidemo.runasp.net/api/Upload/${teamNum}`,
      {
        method: "GET"
      }
    );

    if (!response.ok) {
      throw new Error(`فشل جلب البيانات: ${response.status}`);
    }

    const data = await response.json();
    console.log("البيانات المسترجعة:", data);

    // delete records In order
    const deletePromises = data.map(async (rec) => {
      const deleteResponse = await fetch(
        `https://apidemo.runasp.net/api/Upload/${rec.id}`,
        {
          method: "DELETE"
        }
      );

      if (!deleteResponse.ok) {
        throw new Error(`فشل حذف التسجيل ${rec.id}: ${deleteResponse.status}`);
      }

      return deleteResponse.text();
    });

    // wait all orders finish
    await Promise.all(deletePromises);

    // show success massege
    resultElement.innerText = "تم الحذف بنجاح";
    resultElement.classList.add("success");
    resultElement.classList.remove("error");
  } catch (error) {
    console.error("تفاصيل الخطأ:", error, error.stack);
    console.error("خطأ في عملية الحذف:", error);
    resultElement.innerText = `خطأ: ${error.message}`;
    resultElement.classList.add("error");
    resultElement.classList.remove("success");
  } finally {
    console.log("عملية حذف السجلات انتهت");
  }
});

// delete
