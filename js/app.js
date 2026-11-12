(function(){
'use strict';
var LAWS=(window.LAWS||[]).slice().sort(function(a,b){return a.id.localeCompare(b.id,'en',{numeric:true})});
var app=document.getElementById('app');
var EXAM_N=50, EXAM_MIN=60, MIX_COUNT=30;

/* ---------- tiện ích ---------- */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function fmt(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>')}
function el(html){var d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild}
function norm(s){return String(s).normalize('NFC').toLowerCase().replace(/\s+/g,' ').trim()}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuffle(arr,rnd){var a=arr.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
var store={load:function(){try{return JSON.parse(localStorage.getItem('lqb1'))||{res:{},mix:{}}}catch(e){return{res:{},mix:{}}}},
  save:function(){try{localStorage.setItem('lqb1',JSON.stringify(S))}catch(e){}}};
var S=store.load(); S.res=S.res||{}; S.mix=S.mix||{};
function setRes(key,ok){S.res[key]=ok?1:0;store.save()}

/* ---------- ngân hàng ---------- */
var POOL=[],BYKEY={};
LAWS.forEach(function(L){L.baihoc.forEach(function(b){b.cauhoi.forEach(function(q,i){
  var o=Object.assign({},q,{key:L.id+'|'+b.id+'|'+i,law:L.id,lawTen:L.ten,bai:b.ten});
  if(o.t==='f'){ /* điền chỗ trống -> chọn phương án */
    var n=0;o.q=o.q.replace(/____/g,function(){n++;return '【'+(n>1||o.q.split('____').length>2?'('+n+') ':'')+'……】'});
    o.o=o.o.map(function(c){return c.length>1?c.map(function(x,j){return '('+(j+1)+') '+x}).join('   ·   '):c[0]});
    o.a=[o.k];
  }
  POOL.push(o);BYKEY[o.key]=o;b.cauhoi[i]=o})})});
function lawStats(L){var t=0,ok=0,bad=0;L.baihoc.forEach(function(b){b.cauhoi.forEach(function(q){t++;var r=S.res[q.key];if(r===1)ok++;else if(r===0)bad++})});return{t:t,ok:ok,bad:bad}}
function baiStats(b){var t=b.cauhoi.length,ok=0,bad=0;b.cauhoi.forEach(function(q){var r=S.res[q.key];if(r===1)ok++;else if(r===0)bad++});return{t:t,ok:ok,bad:bad}}

/* ---------- chấm ---------- */
function grade(q,ans){
  if(q.t!=='m')return ans.length===1&&ans[0]===q.a[0];
  if(q.t==='m'){var x=ans.slice().sort().join(),y=q.a.slice().sort().join();return x===y}
  return q.a.every(function(acc,i){var v=norm(ans[i]||'');return v&&acc.some(function(c){return norm(c)===v})});
}
function answered(q,ans){
  return ans.length>0;
}

/* ---------- vẽ 1 câu hỏi ----------
 opts: {no, order, ans, locked, show (hiện đáp án), onChange(ans), check (hiện nút kiểm tra), onCheck(ok)} */
function renderQ(q,opts){
  var ans=opts.ans||[];
  var order=opts.order||(q.o?q.o.map(function(_,i){return i}):[]);
  var card=el('<div class="q"></div>');
  var tag={s:'Chọn 1',m:'Chọn nhiều',f:'Điền vào chỗ trống'}[q.t];
  var head='<span class="no">'+opts.no+'</span><span class="tag '+q.t+'">'+tag+'</span>';
  var locked=!!opts.locked;
  var body=el('<div></div>');
  card.innerHTML=head;
  card.appendChild(body);
  var fbox=el('<div></div>');
  var state={locked:locked};

  function paint(){
    body.innerHTML='';
    if(false){
      var parts=q.q.split('____'),h='<div class="fillq">';
      parts.forEach(function(p,i){h+=fmt(p);if(i<parts.length-1)h+='<input class="fill" data-i="'+i+'" autocomplete="off" spellcheck="false">'});
      body.appendChild(el(h+'</div>'));
      Array.prototype.forEach.call(body.querySelectorAll('input.fill'),function(inp){
        var i=+inp.dataset.i;inp.value=ans[i]||'';inp.disabled=state.locked;
        inp.addEventListener('input',function(){ans[i]=inp.value;opts.onChange&&opts.onChange(ans)});
        if(state.locked&&(opts.show||state.checked)){
          var acc=q.a[i];var good=acc.some(function(c){return norm(c)===norm(ans[i]||'')});inp.classList.add(good?'ok':'bad');
          if(!good)inp.title='Đáp án: '+acc[0];
        }
      });
    }else{
      body.appendChild(el('<div class="qt">'+fmt(q.q)+'</div>'));
      order.forEach(function(oi,pos){
        var sel=ans.indexOf(oi)>=0,cls='opt';
        if(sel)cls+=' sel';
        var isRight=q.a.indexOf(oi)>=0;
        if(state.locked&&(opts.show||state.checked)){
          if(sel&&isRight)cls+=' ok';else if(sel&&!isRight)cls+=' bad';else if(!sel&&isRight)cls+=' miss'}
        var d=el('<div class="'+cls+'"><b>'+String.fromCharCode(65+pos)+'</b><span>'+fmt(q.o[oi])+'</span></div>');
        d.addEventListener('click',function(){
          if(state.locked)return;
          if(q.t!=='m'){ans.length=0;ans.push(oi)}
          else{var k=ans.indexOf(oi);if(k>=0)ans.splice(k,1);else ans.push(oi)}
          opts.onChange&&opts.onChange(ans);paint();
        });
        body.appendChild(d);
      });
    }
  }
  function feedback(){
    fbox.innerHTML='';
    var ok=grade(q,ans);
    var txt=ok?'✔ Chính xác.':'✘ Chưa đúng.';
    var da='';
    if(!ok)da='<div><b>Đáp án đúng:</b> '+q.a.slice().sort().map(function(i){return String.fromCharCode(65+order.indexOf(i))}).join(', ')+'</div>';
    fbox.appendChild(el('<div class="exp '+(ok?'ok':'bad')+'"><b>'+txt+'</b>'+da+'<div>'+fmt(q.e)+'</div><div class="r">📌 '+esc(q.r)+'</div></div>'));
    return ok;
  }
  paint();card.appendChild(fbox);
  if(opts.show&&state.locked)feedback();
  if(opts.check){
    var bar=el('<div class="row" style="margin-top:8px"></div>');
    var b1=el('<button class="btn blue">Kiểm tra</button>'),b2=el('<button class="btn gray" style="display:none">Làm lại câu</button>');
    b1.addEventListener('click',function(){
      if(!answered(q,ans)){alert('Hãy chọn / điền đáp án trước.');return}
      state.locked=true;state.checked=true;paint();var ok=feedback();setRes(q.key,ok);
      b1.style.display='none';b2.style.display='';opts.onCheck&&opts.onCheck(ok);
    });
    b2.addEventListener('click',function(){
      ans.length=0;state.locked=false;state.checked=false;
      fbox.innerHTML='';paint();b1.style.display='';b2.style.display='none';
    });
    bar.appendChild(b1);bar.appendChild(b2);card.appendChild(bar);
  }
  card._ans=ans;
  return card;
}

/* ---------- danh sách luyện tập (dưới bài, câu sai...) ---------- */
function practiceList(qs,titleEl){
  var box=el('<div></div>');
  var sum=el('<div class="sum"><div class="row"><b id="sc">Đã làm 0/'+qs.length+'</b><span id="sc2" style="color:#6b7280"></span><span style="flex:1"></span><button class="btn gray" id="rs">Làm lại bài</button></div></div>');
  var list=el('<div></div>');
  function update(){
    var n=0,ok=0;qs.forEach(function(q){var r=S.res[q.key];if(list._done&&list._done[q.key]!==undefined){n++;if(list._done[q.key])ok++}});
    sum.querySelector('#sc').textContent='Đã làm '+n+'/'+qs.length;
    sum.querySelector('#sc2').textContent=n?('Đúng '+ok+' · Sai '+(n-ok)):'';
  }
  function build(){
    list.innerHTML='';list._done={};
    qs.forEach(function(q,i){
      list.appendChild(renderQ(q,{no:i+1,check:true,onCheck:function(ok){list._done[q.key]=ok;update()}}));
    });update();
  }
  build();
  sum.querySelector('#rs').addEventListener('click',function(){build();window.scrollTo({top:box.offsetTop-60,behavior:'smooth'})});
  box.appendChild(list);box.appendChild(sum);return box;
}

/* ---------- trang chủ ---------- */
function pageHome(){
  var tot=POOL.length,ok=0;POOL.forEach(function(q){if(S.res[q.key]===1)ok++});
  var h='<div class="hero"><h1>Ôn thi viên chức giáo viên THCS – Phần Luật</h1><p>'+LAWS.length+' văn bản · '+tot+' câu hỏi · chọn 1 đáp án, chọn nhiều đáp án, điền chỗ trống</p></div><div class="wrap">';
  h+='<div class="row" style="margin-bottom:16px"><a class="btn blue" href="#/mix">📝 Làm đề mix ('+MIX_COUNT+' đề)</a><a class="btn amber" href="#/wrong">🔁 Ôn câu làm sai</a><span style="color:#6b7280">Đã đúng '+ok+'/'+tot+' câu</span></div><div class="grid">';
  LAWS.forEach(function(L){
    var s=lawStats(L),p=Math.round(100*s.ok/s.t);
    h+='<a class="card" href="#/law/'+L.id+'"><h3>'+esc(L.ten)+'</h3><div class="meta">'+esc(L.so)+(L.hieuluc?' · hiệu lực '+esc(L.hieuluc):'')+'</div><div style="font-size:14px;margin-bottom:6px">'+esc(L.mota||'')+'</div><span class="pill">'+L.baihoc.length+' bài</span><span class="pill">'+s.t+' câu</span><div class="bar"><i style="width:'+p+'%"></i></div><div class="meta" style="margin:0">Đúng '+s.ok+'/'+s.t+(s.bad?' · sai '+s.bad:'')+'</div></a>';
  });
  app.innerHTML=h+'</div></div>';
}

/* ---------- trang văn bản ---------- */
function pageLaw(id){
  var L=LAWS.filter(function(x){return x.id===id})[0];if(!L)return notFound();
  var h='<div class="wrap"><div class="crumb"><a href="#/">Trang chủ</a> / '+esc(L.ten)+'</div><div class="sec"><h2>'+esc(L.ten)+'</h2><div>'+esc(L.so)+(L.hieuluc?' · hiệu lực '+esc(L.hieuluc):'')+'</div><div style="margin-top:6px">'+esc(L.mota||'')+'</div></div><div class="grid">';
  L.baihoc.forEach(function(b,i){var s=baiStats(b),p=Math.round(100*s.ok/s.t);
    h+='<a class="card" href="#/law/'+L.id+'/'+b.id+'"><h3>Bài '+(i+1)+'. '+esc(b.ten)+'</h3><span class="pill">'+(b.tomtat||[]).length+' ý chính</span><span class="pill">'+s.t+' câu luyện tập</span><div class="bar"><i style="width:'+p+'%"></i></div><div class="meta" style="margin:0">Đúng '+s.ok+'/'+s.t+(s.bad?' · sai '+s.bad:'')+'</div></a>'});
  app.innerHTML=h+'</div></div>';
}

/* ---------- trang bài học + luyện tập ---------- */
function pageBai(lid,bid){
  var L=LAWS.filter(function(x){return x.id===lid})[0];if(!L)return notFound();
  var bi=-1;L.baihoc.forEach(function(b,i){if(b.id===bid)bi=i});if(bi<0)return notFound();
  var b=L.baihoc[bi];
  var tabs='<div class="tabs">';L.baihoc.forEach(function(x,i){tabs+='<a class="'+(i===bi?'act':'')+'" href="#/law/'+L.id+'/'+x.id+'">Bài '+(i+1)+'</a>'});tabs+='</div>';
  var h='<div class="wrap"><div class="crumb"><a href="#/">Trang chủ</a> / <a href="#/law/'+L.id+'">'+esc(L.ten)+'</a> / Bài '+(bi+1)+'</div>'+tabs;
  h+='<div class="sec"><h2>Bài '+(bi+1)+'. '+esc(b.ten)+'</h2>';
  if(b.ynho&&b.ynho.length)h+='<div class="ynho"><b>⭐ Cần nhớ nhất</b><ol>'+b.ynho.map(function(t){return'<li>'+fmt(t)+'</li>'}).join('')+'</ol></div>';
  h+='<h3 class="sh">📖 Nội dung chi tiết</h3><ul>'+(b.tomtat||[]).map(function(t){return'<li>'+fmt(t)+'</li>'}).join('')+'</ul></div>';
  (b.bang||[]).forEach(function(t){
    h+='<div class="sec"><h3 class="sh" style="margin-top:0">📊 '+esc(t.tieu_de||'Bảng tóm tắt')+'</h3><div class="tw"><table><thead><tr>'+t.cot.map(function(c){return'<th>'+fmt(c)+'</th>'}).join('')+'</tr></thead><tbody>'+t.dong.map(function(r){return'<tr>'+r.map(function(c){return'<td>'+fmt(c)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div></div>'});
  if(b.vidu&&b.vidu.length)h+='<div class="sec"><h3 class="sh" style="margin-top:0">💡 Ví dụ minh hoạ</h3>'+b.vidu.map(function(v,i){return'<div class="vd"><div><b>Ví dụ '+(i+1)+'.</b> '+fmt(v.tinh_huong)+'</div><div class="kl">'+fmt(v.ket_luan)+'</div></div>'}).join('')+'</div>';
  if(b.nho&&b.nho.length)h+='<div class="sec nho"><h3 class="sh" style="margin-top:0">🧠 Mẹo ghi nhớ</h3><ul>'+b.nho.map(function(t){return'<li>'+fmt(t)+'</li>'}).join('')+'</ul></div>';
  if(b.bay&&b.bay.length)h+='<div class="sec bay"><h2>⚠ Chỗ hay bị đánh lừa</h2><ul>'+b.bay.map(function(t){return'<li>'+fmt(String(t).replace(/^\s*⚠️?\s*/,''))+'</li>'}).join('')+'</ul></div>';
  h+='<h2 style="margin:18px 0 10px">✍ Luyện tập ('+b.cauhoi.length+' câu)</h2><div id="pl"></div>';
  var nx='<div class="nvg">'+(bi>0?'<a class="btn gray" href="#/law/'+L.id+'/'+L.baihoc[bi-1].id+'">← Bài trước</a>':'<span></span>')+(bi<L.baihoc.length-1?'<a class="btn blue" href="#/law/'+L.id+'/'+L.baihoc[bi+1].id+'">Bài sau →</a>':'<a class="btn blue" href="#/law/'+L.id+'">Về danh sách bài</a>')+'</div>';
  app.innerHTML=h+nx+'</div>';
  document.getElementById('pl').appendChild(practiceList(b.cauhoi));
}

/* ---------- câu làm sai ---------- */
function pageWrong(){
  var qs=POOL.filter(function(q){return S.res[q.key]===0});
  var h='<div class="wrap"><div class="crumb"><a href="#/">Trang chủ</a> / Câu làm sai</div><h2>🔁 Ôn câu làm sai ('+qs.length+')</h2>';
  if(!qs.length){app.innerHTML=h+'<div class="empty">Chưa có câu sai nào. Hãy luyện tập hoặc làm đề mix!</div></div>';return}
  h+='<div id="pl"></div></div>';app.innerHTML=h;
  document.getElementById('pl').appendChild(practiceList(qs));
}

/* ---------- đề mix ---------- */
var MIX=(function(){
  var r=mulberry(20260101),pool=POOL.slice(),seq=[];
  for(var p=0;p<4;p++)seq=seq.concat(shuffle(pool,r));
  var des=[],pos=0;
  for(var d=0;d<MIX_COUNT;d++){
    var picked=[],used={};
    while(picked.length<EXAM_N){var q=seq[pos%seq.length];pos++;if(!used[q.key]){used[q.key]=1;picked.push(q)}}
    des.push(picked);
  }
  return des;
})();
function pageMix(){
  var h='<div class="wrap"><div class="crumb"><a href="#/">Trang chủ</a> / Đề mix</div><h2>📝 Đề mix – '+MIX_COUNT+' đề ('+EXAM_N+' câu / '+EXAM_MIN+' phút)</h2><p style="color:#6b7280">Mỗi đề trộn ngẫu nhiên các văn bản và dạng câu. Thứ tự đáp án được xáo trộn trong từng đề.</p><div class="grid">';
  MIX.forEach(function(d,i){var best=S.mix[i+1];
    var cnt={s:0,m:0,f:0};d.forEach(function(q){cnt[q.t]++});
    h+='<a class="card" href="#/mix/'+(i+1)+'"><h3>Đề số '+(i+1)+'</h3><div class="meta">'+EXAM_N+' câu · 1 đáp án '+cnt.s+' · nhiều đáp án '+cnt.m+' · điền từ '+cnt.f+'</div>'+(best!=null?'<span class="pill">Điểm cao nhất: '+best+'/'+EXAM_N+'</span>':'<span class="pill" style="background:#f3f4f6;color:#6b7280">Chưa làm</span>')+'</a>'});
  app.innerHTML=h+'</div></div>';
}
var timerId=null;
function stopTimer(){if(timerId){clearInterval(timerId);timerId=null}}
function pageExam(n){
  n=+n;var qs=MIX[n-1];if(!qs)return notFound();
  var rnd=mulberry(1000+n);
  var orders=qs.map(function(q){return q.o?shuffle(q.o.map(function(_,i){return i}),rnd):null});
  var answers=qs.map(function(){return []});
  var flags={},cur=0,left=EXAM_MIN*60,submitted=false;
  app.innerHTML='<div class="wrap"><div class="crumb"><a href="#/">Trang chủ</a> / <a href="#/mix">Đề mix</a> / Đề '+n+'</div><div class="card" style="text-align:center"><h2 style="margin-top:0">Đề mix số '+n+'</h2><p>'+EXAM_N+' câu · '+EXAM_MIN+' phút · không hiện đáp án cho tới khi nộp bài.<br>Câu khó có thể đánh dấu ⚑ để quay lại sau.</p><button class="btn" id="go">Bắt đầu</button></div></div>';
  document.getElementById('go').addEventListener('click',start);

  function start(){
    var w=app.querySelector('.wrap');
    w.innerHTML='<div class="crumb"><a href="#/mix">← Đề mix</a> / Đề '+n+'</div><div class="exam"><div><div id="qa"></div><div class="nvg"><button class="btn gray" id="pv">← Câu trước</button><button class="btn amber" id="fl">⚑ Đánh dấu</button><button class="btn blue" id="nx">Câu sau →</button></div></div><div class="side"><div style="text-align:center;color:#0369a1">Thời gian còn lại</div><div class="timer" id="tm"></div><div class="pal" id="pal"></div><div class="leg"><span>🟩 Đã làm</span><span>⬜ Chưa làm</span><span>🟨 Đánh dấu</span></div><div style="text-align:center;margin-top:14px"><button class="btn red" id="sub">Nộp bài</button></div></div></div>';
    document.getElementById('pv').onclick=function(){go(cur-1)};
    document.getElementById('nx').onclick=function(){go(cur+1)};
    document.getElementById('fl').onclick=function(){flags[cur]=!flags[cur];pal()};
    document.getElementById('sub').onclick=function(){
      var un=answers.filter(function(a,i){return !answered(qs[i],a)}).length;
      if(confirm(un?'Còn '+un+' câu chưa làm. Nộp bài?':'Nộp bài?'))finish();
    };
    stopTimer();tick();timerId=setInterval(tick,1000);go(0);
  }
  function tick(){
    if(submitted)return;
    var m=Math.floor(left/60),s=left%60,t=document.getElementById('tm');
    if(!t){stopTimer();return}
    t.textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;t.className='timer'+(left<300?' low':'');
    if(left--<=0){alert('Hết giờ! Hệ thống tự nộp bài.');finish()}
  }
  function pal(){
    var p=document.getElementById('pal');if(!p)return;p.innerHTML='';
    qs.forEach(function(q,i){
      var c='';if(answered(q,answers[i]))c='done';if(flags[i])c='flag';if(i===cur)c+=' cur';
      var s=el('<span class="'+c+'">'+(i+1)+'</span>');s.onclick=function(){go(i)};p.appendChild(s)});
    var fl=document.getElementById('fl');if(fl)fl.textContent=flags[cur]?'⚑ Bỏ đánh dấu':'⚑ Đánh dấu';
  }
  function go(i){
    if(i<0||i>=qs.length)return;cur=i;
    var qa=document.getElementById('qa');qa.innerHTML='';
    qa.appendChild(renderQ(qs[i],{no:i+1,order:orders[i],ans:answers[i],onChange:function(){pal()}}));
    pal();window.scrollTo({top:0,behavior:'smooth'});
  }
  function finish(){
    if(submitted)return;submitted=true;stopTimer();
    var ok=0,res=qs.map(function(q,i){var g=grade(q,answers[i]);if(g)ok++;setRes(q.key,g);return g});
    if(S.mix[n]==null||ok>S.mix[n])S.mix[n]=ok;store.save();
    var w=app.querySelector('.wrap');
    var h='<div class="crumb"><a href="#/mix">← Đề mix</a> / Đề '+n+' / Kết quả</div><div class="card"><div class="score">'+ok+'/'+qs.length+' câu đúng</div><div style="text-align:center;font-size:18px">Điểm: <b>'+(Math.round(ok*100/qs.length)/10).toFixed(1)+'/10</b></div><div class="pal" style="grid-template-columns:repeat(10,1fr)">';
    res.forEach(function(g,i){h+='<span class="'+(g?'ok':'bad')+'" data-i="'+i+'">'+(i+1)+'</span>'});
    h+='</div><div class="row" style="justify-content:center"><button class="btn gray" id="fw">Chỉ xem câu sai</button><a class="btn blue" href="#/mix/'+n+'" onclick="location.reload()">Làm lại đề</a><a class="btn" href="#/mix">Đề khác</a></div></div><div id="rv" style="margin-top:14px"></div>';
    w.innerHTML=h;
    var rv=document.getElementById('rv'),only=false;
    function draw(){rv.innerHTML='';qs.forEach(function(q,i){if(only&&res[i])return;
      var c=renderQ(q,{no:i+1,order:orders[i],ans:answers[i],locked:true,show:true});
      var lw=el('<div style="font-size:12px;color:#6b7280;margin-bottom:6px">'+esc(q.lawTen)+' – '+esc(q.bai)+'</div>');c.insertBefore(lw,c.children[2]);c.id='rq'+i;rv.appendChild(c)})}
    draw();
    document.getElementById('fw').onclick=function(){only=!only;this.textContent=only?'Xem tất cả':'Chỉ xem câu sai';draw()};
    Array.prototype.forEach.call(w.querySelectorAll('.pal span'),function(s){s.onclick=function(){var t=document.getElementById('rq'+s.dataset.i);if(t)t.scrollIntoView({behavior:'smooth'})}});
    window.scrollTo({top:0});
  }
}

function notFound(){app.innerHTML='<div class="wrap"><div class="empty">Không tìm thấy trang. <a href="#/" style="color:#2aa7e0">Về trang chủ</a></div></div>'}

/* ---------- router ---------- */
function route(){
  stopTimer();
  var h=(location.hash||'#/').replace(/^#\/?/,'').split('/');
  ['home','mix','wrong'].forEach(function(k){var a=document.getElementById('n-'+k);a&&a.classList.remove('act')});
  var act=h[0]==='mix'?'mix':h[0]==='wrong'?'wrong':'home';document.getElementById('n-'+act).classList.add('act');
  if(h[0]==='law'&&h[1]&&h[2])pageBai(h[1],h[2]);
  else if(h[0]==='law'&&h[1])pageLaw(h[1]);
  else if(h[0]==='mix'&&h[1])pageExam(h[1]);
  else if(h[0]==='mix')pageMix();
  else if(h[0]==='wrong')pageWrong();
  else pageHome();
  if(!(h[0]==='mix'&&h[1]))window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);
route();
})();
