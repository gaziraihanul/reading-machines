import json
import re
import urllib.request
from collections import defaultdict

GUTENBERG = [
    ("https://www.gutenberg.org/cache/epub/33456/pg33456.txt", "stein"),
    ("https://www.gutenberg.org/cache/epub/1322/pg1322.txt", "whitman"),
    ("https://www.gutenberg.org/cache/epub/12242/pg12242.txt", "dickinson"),
    ("https://www.gutenberg.org/cache/epub/2147/pg2147.txt", "poe"),
    ("https://www.gutenberg.org/cache/epub/770/pg770.txt", "woolf"),
]

COURSE = [
    ("racter", "bill sings to sarah sarah sings to bill perhaps they will do other dangerous things together it is not known just what these dangerous things may be they may be suicidal or they may be in the nature of romances"),
    ("moure", "errors laud the women the women laud errors a womens error is laud lauded by wrong women again the grammar refuses here a syntax without any meaning the words arrive without permission"),
    ("kaur", "you tell me to quiet down cause my opinions make me less beautiful but i was not made with a fire in my belly so i could be put out i was made to burn you pin me against my own words"),
    ("whitehead", "i am NDN i am two-spirit i am indigiqueer i am a glitch in your settler grammar i will not be translated i am reclaiming every erased word refusing your settler tongue the land remembers what you tried to bury"),
    ("rhee", "i did not know if i was a machine or a feeling you said both you said that is enough the circuit of longing what feels like love does desire without a body code and flesh together now"),
    ("nichol", "the letters move the words form and unform language before there was language the archive holds nothing back this too will be erased begin again from the start the page forgets nothing"),
    ("jackson", "the body is a text the scar is a word the wound remembers what the mind forgets she was made of pieces stitched together a monster a woman a story without an ending"),
    ("vj", "we were here the smoke rises the image holds what the word cannot the archive of the disappeared the screen carries the body the body carries the screen"),
]

def clean_gutenberg(text):
    start = re.search(r'\*\*\* START OF (THE|THIS) PROJECT GUTENBERG', text)
    end = re.search(r'\*\*\* END OF (THE|THIS) PROJECT GUTENBERG', text)
    if start:
        text = text[start.end():]
    if end:
        text = text[:end.start()]
    return text

def tokenize(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s']", " ", text)
    tokens = text.split()
    tokens = [t for t in tokens if 1 < len(t) < 20]
    return tokens

def download_text(url):
    print(f"  Downloading {url.split('/')[-1]}...")
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            raw = r.read().decode('utf-8', errors='ignore')
        return clean_gutenberg(raw)
    except Exception as e:
        print(f"  Failed: {e}")
        return ""

def build_ngram(all_texts):
    trigram_counts = defaultdict(lambda: defaultdict(int))
    bigram_counts = defaultdict(lambda: defaultdict(int))
    total_tokens = 0

    for label, text in all_texts:
        tokens = tokenize(text)
        total_tokens += len(tokens)
        for i in range(len(tokens) - 2):
            key3 = tuple(tokens[i:i+2])
            next3 = tokens[i+2]
            trigram_counts[key3][next3] += 1
            key2 = tokens[i]
            next2 = tokens[i+1]
            bigram_counts[key2][next2] += 1

    print(f"  Total tokens processed: {total_tokens:,}")

    trigrams = {}
    for key, nexts in trigram_counts.items():
        filtered = {w: c for w, c in nexts.items() if c >= 3}
        if not filtered:
            continue
        top = sorted(filtered.items(), key=lambda x: -x[1])[:4]
        trigrams[" ".join(key)] = [{"word": w, "count": c} for w, c in top]

    bigrams = {}
    for key, nexts in bigram_counts.items():
        filtered = {w: c for w, c in nexts.items() if c >= 2}
        if not filtered:
            continue
        top = sorted(filtered.items(), key=lambda x: -x[1])[:6]
        bigrams[key] = [{"word": w, "count": c} for w, c in top]

    return trigrams, bigrams

print("Downloading Gutenberg texts...")
gutenberg_texts = []
for url, label in GUTENBERG:
    text = download_text(url)
    if text:
        gutenberg_texts.append((label, text))
        print(f"  {label}: {len(text):,} characters")

all_texts = COURSE + gutenberg_texts
print(f"\nBuilding n-gram model from {len(all_texts)} sources...")
trigrams, bigrams = build_ngram(all_texts)

output = {"trigrams": trigrams, "bigrams": bigrams}
with open("ngram_model.json", "w") as f:
    json.dump(output, f)

import os
size_kb = os.path.getsize("ngram_model.json") / 1024
print(f"\nDone. {len(trigrams):,} trigram keys, {len(bigrams):,} bigram keys ({size_kb:.0f} KB)")
