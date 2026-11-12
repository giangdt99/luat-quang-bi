import os,re,glob
b=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
h=open(b+'/index.html',encoding='utf8').read()
h=h.replace('<link rel="stylesheet" href="css/style.css">','<style>'+open(b+'/css/style.css',encoding='utf8').read()+'</style>')
def sub(m):
    return '<script>'+open(b+'/'+m.group(1),encoding='utf8').read().replace('</script>','<\\/script>')+'</script>'
h=re.sub(r'<script src="([^"]+)"></script>',sub,h)
open(b+'/Ôn luật Quảng Bị (1 file).html','w',encoding='utf8').write(h)
print(len(h))
