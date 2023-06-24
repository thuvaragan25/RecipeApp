from flask import Flask, jsonify, request
from flask_cors import CORS

import torch
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

import requests
import random

food_categories = requests.get("https://gist.githubusercontent.com/peterdemin/920ec3eaaa0a9f3cafd3a855557f5e0c/raw/9c7337d7f6274de704f9018ed363d51dd7a0b128/food.txt").text.lower().split('\n')
negative = ["bowl"]

app = Flask(__name__)
CORS(app)

model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

def predict(img):
    # get predictions that are only foods
    out = model([img]).pandas().xyxy[0]
    results = out.loc[out['name'].isin(food_categories)]
    # return unique ingredients
    ingredients = list(set(results['name']))
    return ingredients

def parse_ingredients(raw_ingredients):
    ingredients = []
    for ingredient in raw_ingredients:
        for word in ingredient.split(' '):
            if word in food_categories:
                ingredients.append(word)
    ingredients = list(set(ingredients))
    return ingredients
    
def recipe(ingredients):
    prompt = "Recipe with "
    for ingredient in ingredients:
        if ingredient in food_categories and ingredient not in negative:
            prompt+=ingredient+","
    out = requests.get(f"https://recipes.eerieemu.com/api/recipe/?search={prompt}").json()["results"]
    print(prompt)
    random.shuffle(out)
    print(out)
    if len(out) != 0:
        dish = out[0]
        name = dish["name"]
        ingredients = parse_ingredients(dish["ingredients"])
        description = dish["description"]
        instructions = dish["instructions"]
        if  dish["image_path"] is not None:
            image = "https://recipes.eerieemu.com"+ dish["image_path"]
            return name, ingredients, description, instructions, image
        else:
            image = -1
            return name, ingredients, description, instructions, -1
    else:
        return -1, -1, -1, -1, -1
    
@app.route('/recommend', methods=['POST'])
def recommend():
    url = request.json["link"]
    name, ingredients, description, instructions, image = recipe(predict(url))
    if name != -1:
        return jsonify({'name': name, 'description': description, 'ingredients': ingredients, 'instructions': instructions, 'image' : image if image == -1 else None})
    else:
        return jsonify({'error': 'no dishes found' })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)