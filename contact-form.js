document.addEventListener("submit", async function (e) {
    if (e.target && e.target.id === "contactForm") {
        e.preventDefault();

        const form = e.target;

        const data = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        const res = await fetch("/submit-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        const msg = document.getElementById("responseMsg");

        if (result.success) {
            msg.innerText = "✅ संदेश यशस्वीरित्या पाठवला!";
            msg.style.color = "green";
            form.reset();
        } else {
            msg.innerText = "❌ काहीतरी चूक झाली!";
            msg.style.color = "red";
        }
    }
});
