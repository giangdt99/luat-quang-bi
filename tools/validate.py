import json,sys,glob,re,os
def norm(s): return re.sub(r'\s+',' ',s.strip().lower())
base=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data','json')
files=sys.argv[1:] or sorted(glob.glob(base+'/[LC]*.json'))
bad=0
for f in files:
    d=json.load(open(f,encoding='utf8')); n=0; types={'s':0,'m':0,'f':0}
    seen=set()
    for k in('id','ten','so','mota','baihoc'):
        assert k in d,(f,'thiếu',k)
    for b in d['baihoc']:
        assert b.get('ten') and len(b.get('tomtat',[]))>=5,(f,b.get('id'),'tomtat<5')
        assert len(b['cauhoi'])>=15,(f,b['id'],'cauhoi<15',len(b['cauhoi']))
        for i,q in enumerate(b['cauhoi']):
            w=(f,b['id'],i+1)
            try:
                assert q['t'] in types; types[q['t']]+=1; n+=1
                assert q.get('q') and q.get('e') and q.get('r')
                assert q['q'] not in seen,'trùng câu'; seen.add(q['q'])
                if q['t'] in 'sm':
                    o=q['o']; assert 3<=len(o)<=6 and len(set(o))==len(o),'options'
                    assert all(0<=x<len(o) for x in q['a']) and len(set(q['a']))==len(q['a'])
                    if q['t']=='s': assert len(q['a'])==1
                    else: assert len(q['a'])>=2 and len(q['a'])<len(o),'multi cần >=2 đúng và <tổng'
                else:
                    nb=q['q'].count('____'); assert nb>=1 and nb==len(q['a']),'số chỗ trống'
                    assert all(isinstance(x,list) and x and all(isinstance(y,str) and y.strip() for y in x) for x in q['a'])
                    o=q.get('o'); k=q.get('k')
                    assert isinstance(o,list) and 3<=len(o)<=5,'f thiếu o (3-5 phương án)'
                    assert all(isinstance(c,list) and len(c)==nb and all(isinstance(y,str) and y.strip() for y in c) for c in o),'o sai cấu trúc'
                    assert len({tuple(c) for c in o})==len(o),'o trùng'
                    assert isinstance(k,int) and 0<=k<len(o),'k'
                    assert all(norm(o[k][i]) in [norm(z) for z in q['a'][i]] for i in range(nb)),'o[k] không khớp a'
                    for j,c in enumerate(o):
                        if j!=k: assert not all(norm(c[i]) in [norm(z) for z in q['a'][i]] for i in range(nb)),'phương án nhiễu cũng đúng'
            except AssertionError as e:
                bad+=1; print('LỖI',w,e,q.get('q','')[:60])
    print(os.path.basename(f),'bài:',len(d['baihoc']),'câu:',n,types)
print('TỔNG LỖI',bad); sys.exit(1 if bad else 0)
