import os
import json
import datetime
from jinja2 import Template
from github import Github

BASE_PATH = os.path.dirname(os.path.abspath(__file__))
KEYS_PATH = os.path.join(BASE_PATH, "keys.json")
TEMPLATE_PATH = os.path.join(BASE_PATH, "templates")
PUBLIC_PATH = os.path.join(BASE_PATH, "public")
DATA_REPOSITORY_NAME = "matorix/twitter_sentiment_analysis"
REPOSITORY_DATA_PATH = "/measured"
DATA_LENGTH = 7


def fetch_data(github_id, github_password):
    github_client = Github(github_id, github_password)
    data_repo = github_client.get_repo(DATA_REPOSITORY_NAME)
    themes = data_repo.get_contents(REPOSITORY_DATA_PATH)
    yesterday = datetime.date.today() - datetime.timedelta(1)
    dates = []
    for i in reversed(range(DATA_LENGTH)):
        dates.append((yesterday - datetime.timedelta(i)).strftime("%Y_%m_%d"))
    data = {}

    for theme in themes:
        print("\r{}/{}".format(themes.index(theme), len(themes)), end="")
        data[theme.name] = {}
        for date in dates:
            file_path = "/".join([REPOSITORY_DATA_PATH,
                                  theme.name, date + ".json"])
            try:
                response = data_repo.get_contents(file_path)
            except Exception as e:
                print(e)
                del data[theme.name]
                break
            data[theme.name][date] = json.loads(response.decoded_content)
    return data


def generate_index_page(data):
    template_path = os.path.join(TEMPLATE_PATH, "index.html.j2")
    result_path = os.path.join(PUBLIC_PATH, "index.html")
    with open(template_path, encoding="utf-8") as f:
        text = f.read()
    template = Template(text)
    generated_text = template.render(data)
    with open(result_path, "w", encoding="utf-8") as f:
        f.write(generated_text)


def generate_theme_pages(data):
    template_path = os.path.join(TEMPLATE_PATH, "theme.html.j2")
    with open(template_path, encoding="utf-8") as f:
        text = f.read()
    template = Template(text)
    for theme in data.keys():
        print(theme)

        result_dir = os.path.join(PUBLIC_PATH, theme)
        os.makedirs(result_dir, exist_ok=True)
        result_path = os.path.join(result_dir, "index.html")
        generated_text = template.render(
            {"data": json.dumps(data[theme]), "theme": theme})
        with open(result_path, "w", encoding="utf-8") as f:
            f.write(generated_text)


def main():
    # load keys
    with open(KEYS_PATH, encoding="utf-8") as f:
        keys = json.load(f)
    data = fetch_data(keys["github_id"], keys["github_password"])
    os.makedirs(PUBLIC_PATH, exist_ok=True)
    generate_index_page(data)
    generate_theme_pages(data)


if __name__ == "__main__":
    main()
