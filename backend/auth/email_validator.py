import re
import os

def is_valid_email(email):
    """Checks if the email follows a standard format."""
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return bool(re.match(pattern, email))

def is_disposable(email):
    """Checks if the email domain is in the disposable domains list."""
    try:
        domain = email.split("@")[1].lower()
        # Find the path to the disposable domains file relative to this script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "..", "utils", "disposable_domains.txt")
        
        with open(file_path, "r") as f:
            domains = [line.strip().lower() for line in f.readlines() if line.strip()]
        
        return domain in domains
    except (IndexError, FileNotFoundError):
        return False
