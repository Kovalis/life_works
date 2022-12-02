import $ from "jquery";
import "what-input";
import Inputmask from "inputmask";

// Foundation JS relies on a global variable. In ES6, all imports are hoisted
// to the top of the file so if we used `import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
require("foundation-sites");

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

$(document).foundation();

$(function () {
  const WIDTH_TABLET = 1199;

  let selector = document.getElementsByClassName("js-phone-mask");

  let im = new Inputmask("9-999-999-99");
  im.mask(selector);

  let selectorMail = document.getElementsByClassName("js-email-mask");
  let im2 = new Inputmask("*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]");
  im2.mask(selectorMail);

  const burger = document.querySelectorAll(".js-header__burger");
  if (burger) {
    const mainMenu = document.querySelector(".main-menu"),
      body = document.querySelector("body"),
      html = document.querySelector("html");
    burger.forEach(function (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        el.classList.toggle("header__burger_active");
        mainMenu.classList.toggle("main-menu_active");

        if (window.innerWidth < WIDTH_TABLET) {
          body.classList.toggle("body-hide");
          html.classList.toggle("active");
          if ($("body").hasClass("body-hide")) {
            //let hHeader = $(".header").outerHeight(true);
            $("body").css("height", "100vh");
            $("main").css("overflow-x", "initial");
          } else {
            $("body, .main-menu").css("height", "");
            $("main").css("overflow-x", "hidden");
          }
        }
      });
    });
  }

  $(window).resize(function () {
    if (window.innerWidth > WIDTH_TABLET) {
      $("body").removeClass("body-hide");
      $("html").removeClass("active");
      $("body").css("height", "");
      $("main").css("overflow-x", "hidden");
    }
  });

  const subMenuLink = document.querySelectorAll(".header__link");
  if (subMenuLink) {
    subMenuLink.forEach(function (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
      });
    });
  }

  //подставление высоты в li для услуг
  const serviceLi = document.querySelectorAll(".service-packages__li");

  if (serviceLi) {
    serviceLi.forEach(function (el, index) {
      const linkAccordion = el.querySelector(".js-service-packages__link-accordion");
      const height = el.offsetHeight;
      calcHeight(height, index);

      if (linkAccordion) {
        $(document).on("down.zf.accordionMenu", (element) => {
          //проверка is-active вложенного ul и расчет его высоты
          if ($(element.target).hasClass("service-packages__ul")) {
            const subMenu = el.querySelector(".submenu");
            if (subMenu.classList.contains("is-active")) {
              const heightMenu = el.offsetHeight;
              calcHeight(height, index, heightMenu);
            }
          }
        });
        $(document).on("up.zf.accordionMenu", (element) => {
          //проверка вложенного ul и расчет его высоты
          if ($(element.target).hasClass("service-packages__ul")) {
            const heightMenu = el.offsetHeight;
            calcHeight(height, index, heightMenu);
          }
        });
      }
    });

    function calcHeight(height, index, heightMenu = 0) {
      if (heightMenu > 0) {
        height = heightMenu;
      }
      const wrapUrl = document.querySelectorAll(".service-packages__ul_center");

      wrapUrl.forEach(function (elem) {
        const EL_LI = elem.querySelectorAll(".service-packages__li-check")[index];
        EL_LI.style.height = `${height}px`;
      });
    }
  }

  const tabLinksDetails = document.querySelectorAll(".form-block__bg-tabs-links-item");

  if (tabLinksDetails) {
    const tabDetails = document.querySelectorAll(".form-block__tabs .tabs-title");

    tabDetails.forEach(function (el, index) {
      el.addEventListener("click", () => {
        tabLinksDetails.forEach(function (elem) {
          elem.classList.remove("form-block__bg-tabs-links-item_active");
        });
        tabLinksDetails[index].classList.add("form-block__bg-tabs-links-item_active");
      });
    });
  }

  //выключаем скролл на верх страницы при открытие модалки
  const agreeStep = document.querySelectorAll(".form-block__agree-step label");

  // if (agreeStep) {
  //   agreeStep.forEach(function (el) {
  //     el.addEventListener("click", function (e) {
  //       e.preventDefault();
  //     });
  //   });
  // }

  // добавление текста изображения при загрузке input file
  const btnFile = document.querySelectorAll("[type='file']");

  if (btnFile) {
    btnFile.forEach(function (el) {
      el.addEventListener("change", (e) => {
        const textImg = el.closest(".js-wrap-input-file").querySelector(".js-input-file-text");
        textImg.innerHTML = e.target.files[0].name;
      });
    });
  }

  // имитация клика по наведению на страховой случай
  const caseItem = document.querySelectorAll(".insurance-case__item");

  if (caseItem) {
    caseItem.forEach(function (el) {
      el.addEventListener("mouseenter", () => {
        el.click();
      });
    });
  }

  // переключение на следующий таб
  const nextTab = document.querySelectorAll(".js-next-tab");

  if (nextTab) {
    nextTab.forEach(function (el) {
      el.addEventListener("click", (element) => {
        element.preventDefault();

        // проверка на заполнение полей перед переключением таба
        const $activeTabValid = $(".main-form__tabs-title.is-active");
        const $activeInnerTab = $activeTabValid.find(".tabs-title.is-active");
        if ($activeInnerTab) {
          const $tabPanel = $(".tabs-panel.is-active .tabs-panel.is-active [aria-describedby]");

          $tabPanel.each(function () {
            if ($(this).val() !== "") {
              $(this).trigger("valid.zf.abide");
            } else {
              $(this).trigger("invalid.zf.abide");
            }
          });

          if (
            $tabPanel.parents(".main-form-item").find(".form-error").hasClass("form-error_show")
          ) {
            console.log(
              $tabPanel.parents(".main-form-item").find(".form-error").hasClass("form-error_show")
            );
          } else {
            console.log("поля корректны, перешли на таб");
            clickNextTab();
          }
        } else {
          const $tabPanel = $(".tabs-panel.is-active [aria-describedby]");

          $tabPanel.each(function () {
            if ($(this).val() !== "") {
              $(this).trigger("valid.zf.abide");
            } else {
              $(this).trigger("invalid.zf.abide");
            }
          });

          if (
            $tabPanel.parents(".main-form-item").find(".form-error").hasClass("form-error_show")
          ) {
            console.log(
              $tabPanel.parents(".main-form-item").find(".form-error").hasClass("form-error_show")
            );
          } else {
            console.log("поля корректны, но не перешли на таб");
            console.log(
              "Для кнопок nextTab надо проверку сделать на незаполненные input(inputchange trigger) события вызвать"
            );
            clickNextTab();
          }
        }

        calcTrackTab();

        function clickNextTab() {
          const activeTab = document.querySelector(".main-form__tabs-title.is-active"),
            activeInnerTab = activeTab.querySelector(".main-form__inner-tabs");

          if (activeInnerTab) {
            const innerTab = activeInnerTab.querySelectorAll(".main-form__tabs-title-inner");
            if (innerTab[innerTab.length - 1].classList.contains("is-active")) {
              activeTab
                .querySelector(".main-form__track-inner")
                .classList.add("main-form__track-inner_complite");
              activeTab.nextElementSibling.click();
            } else {
              activeInnerTab
                .querySelector(".main-form__tabs-title-inner.is-active")
                .nextElementSibling.click();
            }
          } else {
            activeTab
              .querySelector(".main-form__track-inner")
              .classList.add("main-form__track-inner_complite");
            activeTab.nextElementSibling.click();
          }
        }

        //проверяем обязательные поля в активном табе
        // $("#main-form").foundation(
        //   "requiredCheck",
        //   $(".main-form .tabs-panel.is-active input[aria-describedby]")
        // );
      });
    });
  }

  $("[aria-describedby]").on("invalid.zf.abide", function () {
    $(this).parents(".main-form-item").find(".form-error").addClass("form-error_show");
    console.log("invalid input", $(this));
  });

  $("[aria-describedby]").on("valid.zf.abide", function () {
    $(this).parents(".main-form-item").find(".form-error").removeClass("form-error_show");
    //console.log("valid input", $(this));
  });

  // переключение на предидущий таб
  const prevTab = document.querySelectorAll(".js-prev-tab");

  if (prevTab) {
    prevTab.forEach(function (el) {
      el.addEventListener("click", (element) => {
        element.preventDefault();
        const activeTab = document.querySelector(".main-form__tabs-title.is-active"),
          activeInnerTab = activeTab.querySelector(".main-form__inner-tabs");

        if (activeInnerTab) {
          const innerTab = activeInnerTab.querySelectorAll(".main-form__tabs-title-inner");
          if (innerTab[0].classList.contains("is-active")) {
            return false;
          } else {
            activeInnerTab
              .querySelector(".main-form__tabs-title-inner.is-active")
              .previousElementSibling.click();
          }
        } else {
          if (activeTab.previousElementSibling.querySelector(".main-form__inner-tabs")) {
            activeTab
              .querySelector(".main-form__track-inner")
              .classList.remove("main-form__track-inner_complite");
            const innerTab = activeTab.previousElementSibling.querySelectorAll(
              ".main-form__tabs-title-inner"
            );
            activeTab.previousElementSibling
              .querySelector(".main-form__track-inner")
              .classList.remove("main-form__track-inner_complite");
            activeTab.previousElementSibling.click();
            innerTab[innerTab.length - 1].querySelector("a").click();
          } else {
            activeTab
              .querySelector(".main-form__track-inner")
              .classList.remove("main-form__track-inner_complite");
            activeTab.previousElementSibling.click();
          }
        }
        calcTrackTab();
      });
    });
  }

  // расчитываем ширину полоски для активных табов
  calcTrackTab();
  function calcTrackTab() {
    const auterTab = document.querySelector(".main-form__tabs-title.is-active");
    if (auterTab) {
      const innerTab = auterTab.querySelectorAll(".main-form__tabs-title-inner");

      innerTab.forEach(function (element, index) {
        if (element.classList.contains("is-active")) {
          const widthTrack = ((index + 1) / innerTab.length) * 100;
          auterTab
            .querySelector(".main-form__track-inner")
            .setAttribute("style", `width:${widthTrack}%`);
        }
      });
    }
  }

  //выбираем все checkbox
  const mainCheckbox = document.querySelector(".js-checked-all-checkbox");

  if (mainCheckbox) {
    mainCheckbox.addEventListener("change", () => {
      const checkboxItem = mainCheckbox
        .closest(".main-form__checkbox-list")
        .querySelectorAll("input");
      checkboxItem.forEach(function (el) {
        if (!el.classList.contains("js-checked-all-checkbox")) {
          if (mainCheckbox.checked === false) {
            el.checked = false;
          } else {
            el.checked = true;
          }
        }
      });
    });
  }
});
