const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const toTop = document.querySelector(".to-top");
const form = document.querySelector(".contact-form");
const quoteEndpoint = "https://formsubmit.co/ajax/sevana.transp@gmail.com";

const getFormSubmitErrorMessage = (message = "") => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("confirm") || normalizedMessage.includes("activate")) {
    return "Falta confirmar o e-mail da Sevana no FormSubmit. Verifique a caixa de entrada ou spam de sevana.transp@gmail.com e confirme a ativação.";
  }

  if (normalizedMessage.includes("web server") || window.location.protocol === "file:") {
    return "Para enviar a cotação, acesse o site publicado ou abra por um servidor local. O envio automático não funciona abrindo o arquivo HTML direto.";
  }

  return "Não foi possível enviar agora. Tente novamente ou chame a Sevana no WhatsApp.";
};

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

  const formData = new FormData(form);

  const submitButton = form.querySelector("button[type='submit']");
  const status = form.querySelector(".form-status");
  const originalButtonText = submitButton.textContent;

  const data = Object.fromEntries(formData.entries());
  data._replyto = data.email || "";
  data._url = window.location.href;

  status.textContent = "Enviando cotação...";
  status.className = "form-status";
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  try {
    const response = await fetch(quoteEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
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
    status.textContent = getFormSubmitErrorMessage(error.message);
    status.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});
