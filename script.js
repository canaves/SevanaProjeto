const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const toTop = document.querySelector(".to-top");
const form = document.querySelector(".contact-form");

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

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const body = [
    "Nova solicitação de cotação pelo site da Sevana Transportes",
    "",
    `Nome: ${data.get("nome") || ""}`,
    `E-mail: ${data.get("email") || ""}`,
    `Telefone/WhatsApp: ${data.get("telefone") || ""}`,
    `Empresa: ${data.get("empresa") || ""}`,
    `Tipo de carga: ${data.get("tipo_carga") || ""}`,
    `Origem e destino: ${data.get("origem_destino") || ""}`,
    "",
    "Mensagem:",
    data.get("mensagem") || "",
  ].join("\n");

  const mailto = new URL("mailto:sevana.transp@gmail.com");
  mailto.searchParams.set("subject", "Solicitação de cotação - Sevana Transportes");
  mailto.searchParams.set("body", body);

  window.location.href = mailto.toString();
});
