from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

class Moderator:
    def __init__(self):
        self.client = genai.Client(api_key=os.environ["AI_API_KEY"])
        self.model = "gemini-2.5-flash"
        self.behavior = "I need you to be a moderator to filter insulting reviews to movies. So you are going to read a review and tell me if " \
            "it is insulting or not. If it is insulting, you will return 'insulting', otherwise you will return 'not insulting'. Here is the review: "

    def is_review_insulting(self, review: str) -> bool:
        response = self.client.models.generate_content(
            model=self.model,
            contents=self.behavior + review,
        )

        return True if response.text == "insulting" else False
