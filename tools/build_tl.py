import json,glob,os
b=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data')
ds=[json.load(open(f,encoding='utf8')) for f in sorted(glob.glob(b+'/tuluan/De*.json'))]
open(b+'/TL.js','w',encoding='utf8').write('window.TL='+json.dumps(ds,ensure_ascii=False)+';')
print(len(ds),'đề')
