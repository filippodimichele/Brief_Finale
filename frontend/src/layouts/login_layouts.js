const onSubmit = () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Per favore, compila tutti i campi!");
      return;
    }

    showLoader("Verifica credenziali...");

    setTimeout(() => {
      if (email === "admin@example.com" && password === "admin123") {
        localStorage.setItem("userRole", "admin");
        window.location.href = "/preventivi/admin"; 
      } else {
        localStorage.setItem("userRole", "user");
        window.location.href = "/preventivi"; 
      }
    }, 1500);
  };