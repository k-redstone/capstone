# from tkinter import VERTICAL
import sql_config
from konlpy.tag import Okt
from collections import Counter
import nltk
import matplotlib
import matplotlib.pyplot as plt
from matplotlib import rc
import pandas as pd
rc('font', family='AppleGothic')
plt.rcParams['axes.unicode_minus'] = False
okt = Okt()


sql = "select content from article limit 0, 10000;"


sql_config.execute(sql)
res = [item[0] for item in sql_config.cursor.fetchall()]
print(res)

# from sklearn.feature_extraction.text import CountVectorizer
# from sklearn.feature_extraction.text import TfidfVectorizer

# vector = CountVectorizer()
# print(vector.fit_transform(res).toarray())
# print(vector.vocabulary_)
# tfidfv = TfidfVectorizer().fit(res)
# print(tfidfv.transform(res).toarray())
# print(tfidfv.vocabulary_)

# 토큰화

def tokenize(doc):
  return ['/'.join(t) for t in okt.pos(doc, norm = True, stem = True)]

docs = [ (tokenize(row)) for row in res ]

sentence_tag = []
for sentence in res:
  morph = okt.pos(sentence)
  sentence_tag.append(morph)
  # print(morph)
  # print('-'*30)

# print(sentence_tag)

tokens = [t for d in docs for t in d]
# print(tokens)

not_word = ['나', '오늘', '혹시', '왜', '뭐','진짜', '거', '분', '때', '지금', '요','안','내','좀','것','가요','수','그냥','건가']
noun_list = []
for sentence in sentence_tag:
  for word, tag in sentence:
    if tag in ['Noun']:
      if word not in not_word:
        noun_list.append(word)

counter = Counter(noun_list)
# print(counter.most_common(20))

text = nltk.Text(noun_list, name = 'NMSC')

text.plot(20)




# 감정분석

# from konlpy.tag import Kkma

# engine = Kkma()
# polarity_dic = pd.read_csv('corpus/kosac/polarity.csv')
# polarity_dic.set_index('ngram', inplace=True)

# def polarity_score(text):
#   pos_tags = engine.pos(text)
#   # n-gram
#   unigram = ['/'.join(p) for p in pos_tags]
#   bigram = [';'.join(z) for z in zip(unigram, unigram[1:])]
#   trigram = [';'.join(z) for z in zip(*[unigram[i:] for i in range(3)])]
  
#   p_score = 0
#   # polarity score = (p-n) / (p+n)
#   for ngram in [unigram, bigram, trigram]:
#     cond = polarity_dic.index.isin(ngram)
#     s = polarity_dic.loc[cond, :].sum()
#     if s['POS'] + s['NEG'] > 0: # div 0 방지
#       p_score += (s['POS'] - s['NEG']) / (s['POS'] + s['NEG'])
#       # print(p_score)
#   return p_score


# show = []
# for i in range (len(res) - 1):
#   show.append(polarity_score(res[i]))
# plt.hist(show)
# plt.show()