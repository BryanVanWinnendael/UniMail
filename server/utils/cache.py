
from collections import OrderedDict
import json
import os


CACHE_DIR = 'email_cache'


def load_cache(mail):
    cache_file = os.path.join(CACHE_DIR, f'{mail}_cache.json')
    if os.path.exists(cache_file):
        with open(cache_file, 'r') as file:
            return json.load(file, object_pairs_hook=OrderedDict)
    return OrderedDict()


def save_cache(mail, cache):
    if not os.path.exists(CACHE_DIR):
        os.makedirs(CACHE_DIR)

    cache_file = os.path.join(CACHE_DIR, f'{mail}_cache.json')
    with open(cache_file, 'w') as file:
        json.dump(cache, file, default=str)
