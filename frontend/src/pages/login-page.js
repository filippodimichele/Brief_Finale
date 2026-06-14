import { jd } from "../jd.config";
import { showLoader, hideLoader } from "../components/loader";

export function LoginPage() {
  const emailInput = jd.input({
    type: "email",
    className: "input input-bordered w-full bg-neutral-900/80 text-white border-neutral-700 focus:border-primary focus:outline-none",
    placeholder: "Email",
  });

  const passwordInput = jd.input({
    type: "password",
    className: "input input-bordered w-full bg-neutral-900/80 text-white border-neutral-700 focus:border-primary focus:outline-none",
    placeholder: "Password",
  });

  const onSubmit = async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Per favore, compila tutti i campi!");
      return;
    }

    showLoader("Verifica credenziali...");

    try {
      // invio delle credenziali reali al database tramite flask
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      hideLoader();

      if (result.success) {
        const utente = result.utente;

        // salvataggio dei dati dinamici dell'utente restituiti dal database
        localStorage.setItem("userId", utente.id_utente);
        localStorage.setItem("userName", utente.nome);
        
        // mappatura del ruolo (1 per admin, 2 per cliente in base al seed)
        localStorage.setItem("userRole", utente.id_ruolo === 1 ? "admin" : "cliente");
        
        window.location.href = "/homepage"; 
      } else {
        alert("Accesso fallito: " + result.errore);
      }
    } catch (error) {
      hideLoader();
      console.error("Errore connessione login:", error);
      alert("Impossibile connettersi al server backend.");
    }
  };

  return jd.div(
    {
      className: "min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat",
      style: "background-image: url('/image/login-bg.png');"
    },
    [
      jd.fieldset(
        {
          className: "fieldset bg-black/70 backdrop-blur-md border-neutral-800 rounded-box w-full max-w-xs border p-6 shadow-2xl",
        },
        [
          jd.div({ className: "w-full flex justify-center mb-2" }, [
            jd.img({
              src: "/image/logo.png",
              alt: "Logo Fillantis",
              className: "h-50 w-70 "
            })
          ]),
          
          jd.div({ className: "form-control w-full" }, [
            jd.label({ className: "label text-neutral-200 text-sm mb-1" }, ["Email"]),
            emailInput
          ]),
          
          jd.div({ className: "form-control w-full" }, [
            jd.label({ className: "label text-neutral-200 text-sm mb-1" }, ["Password"]),
            passwordInput
          ]),
          
          jd.button(
            { 
              className: "btn btn-neutral mt-4 text-white w-full",
              onclick: onSubmit 
            }, 
            ["Login"]
          ),
        ]
      ),
    ]
  );
}