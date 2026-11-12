import json,glob,os
b=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data')
idx=[]
for f in sorted(glob.glob(b+'/json/L*.json')):
    d=json.load(open(f,encoding='utf8'))
    s='window.LAWS=window.LAWS||[];window.LAWS.push('+json.dumps(d,ensure_ascii=False)+');'
    open(b+'/'+os.path.basename(f)[:-5]+'.js','w',encoding='utf8').write(s); idx.append(os.path.basename(f)[:-5]+'.js')
open(b+'/files.json','w').write(json.dumps(idx))
print(idx)
