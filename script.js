const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const toTop = document.querySelector(".to-top");
const form = document.querySelector(".contact-form");
const quoteEndpoint = "https://formsubmit.co/ajax/sevana.transp@gmail.com";

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a, .quote-button").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  if (data.get("_honey")) {
    form.reset();
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  const status = form.querySelector(".form-status");
  const originalButtonText = submitButton.textContent;

  data.set("_replyto", data.get("email") || "");
  status.textContent = "Enviando cotação...";
  status.className = "form-status";
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  try {
    const response = await fetch(quoteEndpoint, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === "false") {
      throw new Error(result.message || "Não foi possível enviar a cotação.");
    }

    form.reset();
    status.textContent = "Cotação enviada com sucesso. Em breve nossa equipe entrará em contato.";
    status.classList.add("is-success");
  } catch (error) {
    console.error(error);
    status.textContent = "Não foi possível enviar agora. Tente novamente ou chame a Sevana no WhatsApp.";
    status.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});
