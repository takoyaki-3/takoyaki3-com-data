# Python dataframe におけるapply,mapメモ

次のような関数を予め定義。

```python
def time2unix(x):
  if(x==None):
    return -1
  x = str(x)
  return int(x[0:2])*3600+int(x[3:5])*60

def time2unix_row(row):
  if(row['hhmmss']==None):
    return -1
  x = str(row['hhmmss'])
  return int(x[0:2])*3600+int(x[3:5])*60
```

## 各行に対して行う場合

```python
df['unixtime'] = df['hhmmss'].map(time2unix)
```

## 各行の特定列を引数として行う場合

```python
df['unixtime'] = row['hhmmss'].apply(time2unix_row, axis=1)
```