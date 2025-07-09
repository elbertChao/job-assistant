import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import undetected_chromedriver as uc
from readability import Document
from newspaper import Article
from goose3 import Goose

# ----------------------------------------
# 🔧 Selenium-based extractor (e.g., Indeed, Naukri, Foundit)
# ----------------------------------------
def selenium_extract(url, wait_by, wait_value):
    options = uc.ChromeOptions()
    # Disable headless for anti-bot sites
    # options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")

    try:
        driver_path = ChromeDriverManager().install()
        driver = uc.Chrome(options=options, executable_path=driver_path)
        driver.get(url)
        WebDriverWait(driver, 15).until(EC.presence_of_element_located((wait_by, wait_value)))

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        driver.quit()
        return soup
    except Exception as e:
        print("❌ Selenium error:", e)
        try:
            driver.quit()
        except:
            pass
        return None

# ----------------------------------------
# 🌐 Site-specific handlers
# ----------------------------------------
def extract_indeed(url):
    soup = selenium_extract(url, By.ID, "jobDescriptionText")
    if soup:
        block = soup.find("div", id="jobDescriptionText")
        if block:
            return block.get_text(separator="\n").strip()
    return None

def extract_naukri(url):
    soup = selenium_extract(url, By.CLASS_NAME, "jd-wrapper")
    if soup:
        block = soup.find("div", class_="jd-wrapper")
        if block:
            return block.get_text(separator="\n").strip()
    return None

def extract_foundit(url):
    soup = selenium_extract(url, By.ID, "JobDescription")
    if soup:
        block = soup.find("div", id="JobDescription")
        if block:
            return block.get_text(separator="\n").strip()
    return None

def extract_linkedin_with_goose(url):
    try:
        g = Goose()
        article = g.extract(url=url)
        if article.cleaned_text and len(article.cleaned_text.strip()) > 200:
            return article.cleaned_text.strip()
    except:
        pass
    return None

# ----------------------------------------
# 📚 Generic fallback extractors
# ----------------------------------------
def extract_with_tools(url):
    print("→ [fallback] trying newspaper")
    try:
        article = Article(url)
        article.download()
        article.parse()
        if len(article.text.strip()) > 200:
            print("↪ [debug] extracted page_text snippet:\n", article.text.strip()[:2000]) # FOR DEBUGGING
            print("↪ newspaper matched")
            return article.text.strip()
    except Exception as e:
        print("✖ newspaper failed:", e)

    print("→ [fallback] trying readability")
    try:
        res = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        doc = Document(res.text)
        soup = BeautifulSoup(doc.summary(), 'html.parser')
        text = soup.get_text(separator='\n').strip()
        print("↪ [debug] extracted page_text snippet:\n", text[:2000]) # FOR DEBUGGING
        if len(text) > 200:
            print("↪ readability matched")
            return text
    except Exception as e:
        print("✖ readability failed:", e)

    print("→ [fallback] trying raw-HTML search")
    try:
        res = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        soup = BeautifulSoup(res.content, 'html.parser')
        # first try finding job-blocks
        for tag in ['div', 'section', 'article']:
            for block in soup.find_all(tag):
                text = block.get_text().strip()
                if 'job' in text.lower() and len(text) > 300:
                    print("↪ raw-HTML job block matched")
                    return text
        # **catch-all** 
        page_text = soup.get_text(separator='\n').strip()
        print("↪ [debug] extracted page_text snippet:\n", page_text[:2000]) # FOR DEBUGGING
        if len(page_text) > 200:
            print("↪ raw-HTML catch-all matched")
            return page_text
    except Exception as e:
        print("✖ raw-HTML search failed:", e)

    print("↪ [fallback] nothing matched, returning None")
    return None

# ----------------------------------------
# 🚀 Main Controller
# ----------------------------------------
def extract_job_description(url):
    hostname = urlparse(url).hostname or ""

    # try site-specific first, but never let it throw
    try:
        if "linkedin.com" in hostname:
            jd = extract_linkedin_with_goose(url)
        elif "indeed.com" in hostname:
            jd = extract_indeed(url)
        elif "naukri.com" in hostname:
            jd = extract_naukri(url)
        elif "foundit" in hostname or "monsterindia" in hostname:
            jd = extract_foundit(url)
        else:
            jd = None
    except Exception:
        jd = None

    # fallback to generic extractor (newspaper / readability / requests)
    if not jd:
        jd = extract_with_tools(url)

    return jd

# PROBABLY WONT NEED THIS, it will be handled by the frontend
# ----------------------------------------
# 🧪 Run Script
# ----------------------------------------
if __name__ == "__main__":
    url = input("🔗 Enter job description URL: ").strip()
    jd = extract_job_description(url)
    if jd:
        print("\n📄 Extracted Job Description:\n")
        print(jd[:2000])
        with open("extracted_jd.txt", "w", encoding="utf-8") as f:
            f.write(jd)
        print("\n💾 Saved to 'extracted_jd.txt'")
    else:
        print("\n⚠️ Unable to extract JD from this site.")