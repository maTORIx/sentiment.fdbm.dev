import os
import json
import datetime
from jinja2 import Template

BASE_PATH = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(BASE_PATH, "templates")
PUBLIC_PATH = os.path.join(BASE_PATH, "public")
DATA_DIR = "../twitter_sentiment_analysis/measured"
DATA_LENGTH = 90


def get_data():
    themes = os.listdir(os.path.join(BASE_PATH, DATA_DIR))
    yesterday = datetime.date.today() - datetime.timedelta(days=1)
    dates = []
    for i in reversed(range(DATA_LENGTH)):
        dates.append((yesterday - datetime.timedelta(days=i)).strftime("%Y_%m_%d"))
    data = {}

    for theme in themes:
        print("\r{}/{}".format(themes.index(theme), len(themes)), end="")
        data[theme] = {}
        for date in dates:
            file_path = os.path.join(BASE_PATH, DATA_DIR, theme, date + ".json")
            try:
                with open(file_path, encoding="utf-8") as f:
                    data[theme][date] = json.loads(f.read())
            except:
                if dates.index(date) == 0:
                    del data[theme]
                    break
                else:
                    data[theme][date] = data[theme][dates[dates.index(date) - 1]]
                    print("none data {}".format(date))
    return data


def generate_index_page(data):
    template_path = os.path.join(TEMPLATE_PATH, "index.html.j2")
    result_path = os.path.join(PUBLIC_PATH, "index.html")
    with open(template_path, encoding="utf-8") as f:
        text = f.read()
    template = Template(text)
    generated_text = template.render({"data": json.dumps(data)})
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
            {"data": json.dumps(data[theme]), "theme": theme, "range": DATA_LENGTH})
        with open(result_path, "w", encoding="utf-8") as f:
            f.write(generated_text)


def main(from_cache=False):
    if from_cache:
        with open("data.json", "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = get_data()
        with open("data.json", "w", encoding="utf-8") as f:
            f.write(json.dumps(data, indent=4))
    os.makedirs(PUBLIC_PATH, exist_ok=True)
    generate_index_page(data)
    generate_theme_pages(data)


if __name__ == "__main__":
    main()
