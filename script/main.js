// --- Helper Function ---
function showResults(containerSelector, displays = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const h3 = container.querySelector("h3");
  if (h3) h3.style.display = "block";

  Object.entries(displays).forEach(([selector, text]) => {
    const wrapper = container.querySelector(selector);
    if (!wrapper) return;

    wrapper.style.display = "flex";
    const innerSpan = wrapper.querySelector("span");
    if (innerSpan) {
      innerSpan.style.display = "block";
      if (text !== undefined) innerSpan.innerHTML = text;
    }
  });
}

// --- Dynamic Config ---
const title = "EverydayCalc";
document.title = title;
const titleEl = document.querySelector("header h2.title a");
if (titleEl) titleEl.textContent = title;

// Dynamic Footer Year
const footerYear = document.querySelector("footer span");
if (footerYear) footerYear.innerHTML = new Date().getFullYear();

// Flatpickr Setup
flatpickr("#start-date", { dateFormat: "Y-m-d", disableMobile: true });
flatpickr("#end-date", { dateFormat: "Y-m-d", disableMobile: true });

// --- Navbar Toggle ---
const navbarbtn = document.querySelector("header ul li i");
const navList = document.querySelector("header ul");
const navItems = document.querySelectorAll("header ul li");

if (navbarbtn) {
  navbarbtn.addEventListener("click", () => {
    if (window.innerWidth < 900) {
      const isActive = navbarbtn.classList.toggle("active");
      navList.classList.toggle("active");

      navItems.forEach((e) => (e.style.marginLeft = isActive ? "10px" : ""));
      navList.style.width = isActive ? "30%" : "30px";
      navList.style.backgroundColor = isActive ? "rgba(1, 21, 49, 0.57)" : "";
    }
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth >= 900 && navbarbtn) {
    navbarbtn.classList.remove("active");
    navList.classList.remove("active");
    navItems.forEach((e) => (e.style.marginLeft = ""));
    navList.style.width = "";
    navList.style.backgroundColor = "";
  }
});

// --- Standard Calculator Logic ---
const show_screen = document.querySelector(".normal output");
const nums = document.querySelector(".nums");

if (nums) {
  for (let i = 0; i < 10; i++) {
    const num = document.createElement("span");
    num.classList.add(`num${i + 1}`);
    num.textContent = i;
    nums.prepend(num);
  }
}

document.querySelectorAll(".normal span").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!show_screen) return;
    const content = show_screen.innerHTML;

    if (
      btn.querySelector(".fa-delete-left") ||
      btn.classList.contains("fa-delete-left")
    ) {
      show_screen.innerHTML = content.slice(0, -1);
    } else if (btn.innerHTML === "c") {
      show_screen.innerHTML = "";
    } else if (btn.innerHTML === "=") {
      try {
        const fixedEquation = content.replaceAll("x", "*").replaceAll("÷", "/");
        show_screen.innerHTML = content ? math.evaluate(fixedEquation) : "";
      } catch {
        show_screen.innerHTML = "Error";
      }
    } else if (btn.innerHTML === ".") {
      const parts = content.split(/[\+\-\*\/\x\÷]/);
      const lastChar = content.slice(-1);

      if (!content || ["+", "x", "÷", "-"].includes(lastChar)) {
        show_screen.innerHTML += "0.";
      } else if (!parts[parts.length - 1].includes(".")) {
        show_screen.innerHTML += ".";
      }
    } else {
      const lastChar = content.slice(-1);
      const isOp = ["+", "x", "÷", "-"].includes(lastChar);
      const btnIsOp = ["+", "x", "÷", "-"].includes(btn.innerHTML);

      if (isOp && btnIsOp) {
        show_screen.innerHTML = content.slice(0, -1) + btn.innerHTML;
      } else {
        if (["Error", "Infinity"].includes(content)) show_screen.innerHTML = "";
        show_screen.textContent += btn.textContent;
      }
    }
  });
});

// --- Discount Calculator ---
const discountbtn = document.querySelector(".discount .form button");
if (discountbtn) {
  discountbtn.onclick = () => {
    const priceVal = document
      .querySelector(".discount .form input[name='price']")
      .value.trim();
    const discountVal = document
      .querySelector(".discount .form input[name='discount']")
      .value.trim();

    if (priceVal && discountVal) {
      const price = Number.parseFloat(priceVal);
      const discount = Number.parseFloat(discountVal);

      if (!Number.isNaN(price) && !Number.isNaN(discount)) {
        const finalPrice = Math.max(0, price - price * (discount / 100));
        showResults(".discount", {
          span: finalPrice.toFixed(2),
        });
      } else {
        alert("Number is not correct");
      }
    } else {
      alert("Inputs Are Empty");
    }
  };
}

// --- Bill Calculator ---
const bill_calc = document.querySelector(".bill .bill-box button");
if (bill_calc) {
  bill_calc.addEventListener("click", () => {
    const total = Number.parseFloat(
      document.querySelector(
        ".bill input[placeholder='Please Enter Total Bill']",
      ).value,
    );
    const persons = Number.parseFloat(
      document.querySelector(
        ".bill input[placeholder='Please Enter Number Of People']",
      ).value,
    );
    const tip =
      Number.parseFloat(
        document.querySelector(
          ".bill input[placeholder='Please Enter Tip Percntage (%)']",
        ).value,
      ) || 0;

    if (!Number.isNaN(total) && !Number.isNaN(persons) && persons > 0) {
      const total_tip = total * (tip / 100);
      const grand_total = total_tip + total;

      showResults(".bill-box", {
        "span.result1": `Amount Per Person : ${(grand_total / persons).toFixed(2)}`,
        "span.result2": `Tip Per Person : ${(total_tip / persons).toFixed(2)}`,
        "span.result3": `Total Tip : ${total_tip.toFixed(2)}`,
        "span.result4": `Grand Total : ${grand_total.toFixed(2)}`,
      });
    } else {
      alert("Inputs Are Empty or Invalid");
    }
  });
}

// --- Date Calculator ---
const datecalc = document.querySelector(".time button");

if (datecalc) {
  datecalc.addEventListener("click", () => {
    const start = document.querySelector(".time #start-date").value;
    const end = document.querySelector(".time #end-date").value;

    if (start && end) {
      const startDateObj = new Date(`${start}T00:00:00`);
      const endDateObj = new Date(`${end}T00:00:00`);

      const diffInDays = Math.round((endDateObj - startDateObj) / 86400000);

      const text =
        diffInDays < 0
          ? `Before ${Math.abs(diffInDays)} Days`
          : `After ${diffInDays} Days`;

      const timeH3 = document.querySelector(".time h3");
      const timeContainer = document.querySelector(".time_calc > span");
      const resSpanCon = document.querySelector(".time_calc > span > span");

      if (timeH3) timeH3.style.display = "block";
      if (timeContainer) timeContainer.style.display = "flex";
      if (resSpanCon) {
        resSpanCon.style.display = "block";
        resSpanCon.innerHTML = text;
      }
    } else {
      alert("Please fill in both fields");
    }
  });
}

// --- Recipe Scaling ---
const scaling_btn = document.querySelector(".resize button");
if (scaling_btn) {
  scaling_btn.addEventListener("click", () => {
    const serving = document.querySelector(
      ".resize input[name='or-serving']",
    ).value;
    const quantities = document.querySelector(
      ".resize input[name='or-quantity']",
    ).value;
    const tar_serving = document.querySelector(
      ".resize input[name='tr-serving']",
    ).value;

    if (serving && quantities && tar_serving) {
      const factor = tar_serving / serving;
      const new_quantity = factor * quantities;

      showResults(".resize", {
        ".scaling-factor": `Scaling Factor : ${factor.toFixed(2)}`,
        ".scaled-quantities": `New Quantity : ${new_quantity.toFixed(2)}`,
      });
    } else {
      alert("Inputs Are Empty");
    }
  });
}

// --- Percentage Change ---
const percntage_btn = document.querySelector(".percntage_calc button");
if (percntage_btn) {
  percntage_btn.addEventListener("click", () => {
    const old_v = document.querySelector(
      ".percntage_calc input[name='old-value']",
    ).value;
    const new_v = document.querySelector(
      ".percntage_calc input[name='new-value']",
    ).value;

    if (old_v && new_v) {
      const diff = new_v - old_v;
      const pctChange = ((diff / old_v) * 100).toFixed(2);
      const typeText =
        diff === 0 ? "No Change" : diff < 0 ? "Decrease" : "Increase";

      showResults(".percntage_calc", {
        ".percentage-change": `${pctChange}%`,
        "span.change-type": `Change Type : ${typeText}`,
      });
    } else {
      alert("Inputs Are Empty");
    }
  });
}

// --- Global Handlers (Copy to Clipboard & Keydown) ---
document.querySelectorAll("main span i:not(.normal span i)").forEach((icon) => {
  icon.onclick = () => {
    navigator.clipboard.writeText(icon.parentElement.textContent.trim());
    const toast = document.querySelector("main .copied");
    if (toast) {
      toast.style.animationName = "showhide";
      setTimeout(() => (toast.style.animationName = ""), 2000);
    }
  };
});

document.querySelectorAll("input[type='number']").forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (["-", "+"].includes(e.key)) e.preventDefault();
    if (e.key === "Enter") {
      const btn = input.parentElement.querySelector("button");
      if (btn) btn.click();
    }
  });
});

// --- Theme Switcher ---
const themeBtn = document.querySelector("#theme-toggle");
const isDark = localStorage.getItem("theme") === "dark";

document.body.classList.toggle("dark", isDark);
document.body.classList.toggle("light", !isDark);

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const currentIsDark = document.body.classList.contains("dark");
    document.body.classList.toggle("dark", !currentIsDark);
    document.body.classList.toggle("light", currentIsDark);
    localStorage.setItem("theme", currentIsDark ? "light" : "dark");
  });
}
