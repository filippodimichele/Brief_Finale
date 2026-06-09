import { jd } from "../jd.config";

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

  const onSubmit = () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Per favore, compila tutti i campi!");
      return;
    }

    if (email === "admin@example.com" && password === "admin") {
      window.location.href = "/preventivi"; 
    } else {
      window.location.href = "/homepage";
    }
  };

  return jd.div(
    {
      className: "min-h-screen w-full flex items-center justify-center p-4 bg-[length:100%_100%] bg-center bg-no-repeat",
      style: "background-image: url(/login-bg.png);",
    },
    [
      jd.fieldset(
        {
          className: "fieldset bg-black/70 backdrop-blur-md border-neutral-800 rounded-box w-full max-w-xs border p-6 shadow-2xl flex flex-col gap-4",
        },
        [
          jd.h2({ className: "text-white text-2xl font-bold text-center w-full mb-2" }, ["Login"]),
          
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