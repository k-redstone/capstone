import numpy as np
import pandas as pd
from sklearn.datasets import make_classification

class FFMFormatPandas:
  def __init__(self):
    self.field_index_ = None
    self.feature_index_ = None
    self.y = None

  def fit(self, df, y=None):
    self.y = y
    df_ffm = df[df.columns.difference([self.y])]
    if self.field_index_ is None:
      self.field_index_ = {col: i for i, col in enumerate(df_ffm)}

    if self.feature_index_ is not None:
      last_idx = max(list(self.feature_index_.values()))

    if self.feature_index_ is None:
      self.feature_index_ = dict()
      last_idx = 0

    for col in df.columns:
      vals = df[col].unique()
      for val in vals:
        if pd.isnull(val):
          continue
        name = '{}_{}'.format(col, val)
        if name not in self.feature_index_:
          self.feature_index_[name] = last_idx
          last_idx += 1
      self.feature_index_[col] = last_idx
      last_idx += 1
    return self

  def fit_transform(self, df, y=None):
    self.fit(df, y)
    return self.transform(df)

  def transform_row_(self, row, t):
    ffm = []
    if self.y != None:
      ffm.append(str(row.loc[row.index == self.y][0]))
    if self.y is None:
      ffm.append(str(0))

    for col, val in row.loc[row.index != self.y].to_dict().items():
      col_type = t[col]
      name = '{}_{}'.format(col, val)
      if col_type.kind ==  'O':
        ffm.append('{}:{}:1'.format(self.field_index_[col], self.feature_index_[name]))
      elif col_type.kind == 'i':
        ffm.append('{}:{}:{}'.format(self.field_index_[col], self.feature_index_[col], val))
    return ' '.join(ffm)

  def transform(self, df):
    t = df.dtypes.to_dict()
    return pd.Series({idx: self.transform_row_(row, t) for idx, row in df.iterrows()})

########################### Lets build some data and test ############################

train, y = make_classification(n_samples=100, n_features=5, n_informative=2, n_redundant=2, n_classes=2, random_state=42)

train=pd.DataFrame(train, columns=['int1','int2','int3','s1','s2'])
train['int1'] = train['int1'].map(int)
train['int2'] = train['int2'].map(int)
train['int3'] = train['int3'].map(int)
train['s1'] = round(np.log(abs(train['s1'] +1 ))).map(str)
train['s2'] = round(np.log(abs(train['s2'] +1 ))).map(str)
train['clicked'] = y




ffm_train = FFMFormatPandas()
ffm_train_data = ffm_train.fit_transform(train, y='clicked')
print('Base data')
print(train[0:10])
print('FFM data')
print(ffm_train_data[0:10])


# import xlearn as xl

# # Training task
# ffm_model = xl.create_ffm()                # Use field-aware factorization machine (ffm)
# ffm_model.setTrain("./small_train.txt")    # Path of training data

# # param:
# #  0. task: binary classification
# #  1. learning rate : 0.2
# #  2. regular lambda : 0.002
# param = {'task':'binary', 'lr':0.2, 'lambda':0.002}

# # Train model
# ffm_model.fit(param, "./model.out")