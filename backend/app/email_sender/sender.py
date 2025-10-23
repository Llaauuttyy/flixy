import time
import yagmail
from os import getenv

MAX_RETRIES = 3
DELAY = 5

class EmailSender:
    def __init__(self, max_retries: int = MAX_RETRIES, delay: int = DELAY):
        """
        sender_email: tu correo de Gmail
        app_password: app password de Gmail
        max_retries: cantidad de reintentos en caso de fallo
        delay: segundos a esperar entre reintentos
        """
        self.sender_email = getenv("EMAIL")
        self.app_password = getenv("EMAIL_APP_PASSWORD")
        self.max_retries = max_retries
        self.delay = delay
        self.yag = yagmail.SMTP(self.sender_email, self.app_password)

    def send_forgot_password_email(self, to_email: str, reset_link: str):
        return self.send_email(to_email, "Reset Your Password - Flixy", "forgot-password.html", {"link": reset_link})
    
    def prepare_email(self, template_path: str, variables: dict) -> str:
        """
        Carga una plantilla HTML y reemplaza las variables
        template_path: ruta al archivo HTML
        variables: diccionario con las variables a reemplazar
        """
        with open(template_path, "r", encoding="utf-8") as f:
            html_content = f.read()
            for key, value in variables.items():
                placeholder = f"{{{{{key}}}}}"
                html_content = html_content.replace(placeholder, value)

        return html_content

    def send_email(self, to_email: str, subject: str, html_file: str, variables: dict) -> bool:
        """
        Envía un correo HTML al destinatario con reintentos automáticos
        """
        attempt = 0
        while attempt < self.max_retries:
            try:
                email_content = self.prepare_email(html_file, variables)
                self.yag.send(to=to_email, subject=subject, contents=yagmail.raw(email_content))
                print(f"Correo enviado correctamente a {to_email}")
                return True
            except Exception as e:
                attempt += 1
                print(f"⚠️ Error enviando correo (intento {attempt}/{self.max_retries}): {e}")
                if attempt < self.max_retries:
                    print(f"Reintentando en {self.delay} segundos...")
                    time.sleep(self.delay)
                else:
                    print("No se pudo enviar el correo después de varios intentos.")
                    return False