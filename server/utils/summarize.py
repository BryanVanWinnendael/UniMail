from bs4 import BeautifulSoup
from groq import Groq


def extract_text_from_html(html_string):
    soup = BeautifulSoup(html_string, 'html.parser')
    body = soup.body
    return body.get_text(separator='\n', strip=True) if body else ""


def summarize(html, key):
    try:
        text = extract_text_from_html(html)
        client = Groq(
            api_key=key,
        )

        text = "Summarize this html body text in 1 or couple sentences amd give me only the summary back in your response dont write 'here is your summary:' only give me the answer: " + text

        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": text}],
        )
        return response.choices[0].message.content
    except Exception as e:
        raise e
