import base64
import re
from bs4 import BeautifulSoup
from io import BytesIO
from PIL import Image, ImageColor
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from colorthief import ColorThief
from colorsys import rgb_to_hls


def download_image(url):
    response = requests.get(url)
    response.raise_for_status()
    image = Image.open(BytesIO(response.content))
    if image.mode in ('P', 'LA') or (image.mode == 'L' and 'transparency' in image.info):
        image = image.convert('RGBA')
    else:
        image = image.convert('RGB')
    return image


def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple."""
    return ImageColor.getcolor(hex_color, "RGB")


def rgb_to_hex(rgb):
    """Convert RGB tuple to hex string."""
    return '#{:02x}{:02x}{:02x}'.format(*rgb)


def rgb_to_hsl(r, g, b):
    """Convert RGB to HSL."""
    r /= 255.0
    g /= 255.0
    b /= 255.0
    h, l, s = rgb_to_hls(r, g, b)
    return h, s, l


def parse_html_and_extract_colors(html_text):
    soup = BeautifulSoup(html_text, 'html.parser')

    style_tags = soup.find_all('style')
    css_text = ' '.join(tag.text for tag in style_tags)

    inline_styles = ' '.join(tag.get('style', '')
                             for tag in soup.find_all(style=True))
    css_text += ' ' + inline_styles

    color_regex = re.compile(
        r'#[0-9a-fA-F]{3,6}|rgba?\(\d{1,3},\d{1,3},\d{1,3}(?:,\d(?:\.\d+)?)?\)')
    colors = color_regex.findall(css_text)

    return colors


def extract_rgb_from_color_string(color_string):
    if color_string.startswith('#'):
        return hex_to_rgb(color_string)
    elif color_string.startswith('rgb'):
        color_string = color_string.strip('rgba()')
        return tuple(map(int, color_string.split(',')[:3]))
    return None


def is_not_white_or_black(rgb):
    """Check if the color is not white or black."""
    return rgb != (255, 255, 255) and rgb != (0, 0, 0)


def find_most_vibrant_color(colors):
    max_saturation = 0
    most_vibrant_color = None

    for color in colors:
        rgb = extract_rgb_from_color_string(color)
        if rgb and is_not_white_or_black(rgb):
            _, saturation, lightness = rgb_to_hsl(*rgb)
            # We look for high saturation and moderate lightness for a background color
            if saturation > max_saturation and 0.2 < lightness < 0.8:
                max_saturation = saturation
                most_vibrant_color = color

    return most_vibrant_color


def extract_images_from_html(html_text):
    soup = BeautifulSoup(html_text, 'html.parser')

    img_tags = soup.find_all('img')

    img_urls = [img.get('src') for img in img_tags]

    return img_urls


def get_colors(image):
    image_io = BytesIO()
    image.save(image_io, format='PNG')
    image_io.seek(0)

    color_thief = ColorThief(image_io)
    palette = color_thief.get_palette(2)
    return palette


def get_colors_images(image_urls):
    all_colors = []

    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = [executor.submit(download_and_extract_colors, url)
                   for url in image_urls]
        for future in as_completed(futures):
            colors = future.result()
            if colors:
                all_colors.extend(colors)

    return set(all_colors)


def download_and_extract_colors(url):
    try:
        image = download_image(url)
        return get_colors(image)
    except Exception as e:
        return []


def get_ambient_color(encoded_html_text):
    try:
        html_text = base64.urlsafe_b64decode(
            encoded_html_text).decode('utf-8').replace('\n', '')
        colors = parse_html_and_extract_colors(html_text)

        images = extract_images_from_html(html_text)
        colors_images = get_colors_images(images)
        hex_strings = [rgb_to_hex(rgb) for rgb in colors_images]

        colors = colors + hex_strings

        most_vibrant = find_most_vibrant_color(colors)
        if not most_vibrant:
            return None
        rgb = hex_to_rgb(most_vibrant)
        return rgb
    except Exception as e:
        print(e)
        return None
