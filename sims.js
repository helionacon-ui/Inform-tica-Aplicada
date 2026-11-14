/* Figuras interactivas de Informática Aplicada. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};


/* 1 ciclo de la CPU (von Neumann) */
SIMS.vonneumann=el=>build(el,{sliders:[{k:'paso',l:'paso de la ejecución',v:0,min:0,max:11,step:1}],
  draw(a){a.clear();const s=a.st;const g=a.g;
    // programa de ejemplo: suma = 5 + 7
    const prog=[['0','LOAD 5','Acc ← 5'],['1','ADD 7','Acc ← Acc + 7'],['2','STORE 20','M[20] ← Acc'],['3','HALT','parar']];
    const fases=['fetch','decode','execute','write'];
    const instr=Math.floor(s.paso/4), fase=s.paso%4;
    // cajas
    const caja=(x,y,w,h,t,on)=>{g.strokeStyle=on?C.a:C.muted;g.lineWidth=on?3:1.5;g.fillStyle=on?'rgba(180,35,47,0.08)':C.bg;g.fillRect(x,y,w,h);g.strokeRect(x,y,w,h);a.txt(t,x+8,y+18,on?C.a:C.text,13);};
    caja(30,40,250,150,'CPU',fase!==0||true);
    caja(45,70,100,40,'UC',fase===1);a.txt('PC = '+Math.min(instr+(fase>0?1:0),3),50,100,C.text,11);
    caja(160,70,105,40,'IR',fase===1);a.txt(fase>0||instr>0?prog[Math.min(instr,3)][1]:'—',165,100,C.text,11);
    caja(45,130,100,40,'ALU',fase===2);
    caja(160,130,105,40,'Acc',fase===2||fase===3);const accv=[0,5,12,12][Math.min(instr+ (fase>=2?1:0),3)]; a.txt(String(instr===0&&fase<2?0:(instr===0?5:(instr>=1&&!(instr===1&&fase<2)?12:5))),165,160,C.text,12);
    caja(360,40,170,150,'MEMORIA',fase===0||fase===3);
    prog.forEach((p,i)=>{a.txt(p[0]+': '+p[1],370,70+i*22,i===instr&&fase<4?C.a:C.muted,11);});
    a.txt('20: '+(instr>=2&&(instr>2||fase>=3)?'12':'?'),370,165,instr>=2&&fase>=3?C.a:C.muted,11);
    caja(600,40,110,150,'E/S',false);a.txt('teclado',610,80,C.muted,11);a.txt('pantalla',610,100,C.muted,11);
    // bus
    a.line(280,115,360,115,C.b,4);a.line(530,115,600,115,C.b,4);a.txt('buses (datos, direcciones, control)',300,215,C.b,12);
    if(fase===0)a.arrow(360,100,280,100,C.d,3);if(fase===3&&instr===2)a.arrow(280,130,360,130,C.d,3);
    const desc=['fetch: el PC va al bus de direcciones, se lee la instrucción, PC+1 y la instrucción pasa al IR','decode: la UC interpreta la instrucción del IR','execute: la ALU opera (o se mueve el dato, o se salta)','write: el resultado se almacena en su destino'];
    a.html(`Instrucción <b>${prog[Math.min(instr,3)][1]}</b> (${prog[Math.min(instr,3)][2]}) · fase <b>${fases[fase]}</b>: ${desc[fase]}<br><span class="hint">Programa de ejemplo «suma = 5 + 7». La CPU es un autómata: interrupciones → fetch → decode → operandos → execute → write, y vuelta a empezar. Avanza el deslizador paso a paso.</span>`);}});

/* 2 conversor: binario, octal, hex, C2 e IEEE 754 */
SIMS.binario=el=>build(el,{sliders:[{k:'n',l:'número decimal',v:-15,min:-128,max:127,step:1},{k:'bits',l:'bits (para C2)',v:8,min:4,max:16,step:1}],
  draw(a){a.clear();const s=a.st,n=s.n,k=s.bits;const g=a.g;
    const abs=Math.abs(n);
    const bin=x=>x.toString(2), oct=x=>x.toString(8), hex=x=>x.toString(16).toUpperCase();
    const rango=n>=-(2**(k-1))&&n<=2**(k-1)-1;
    let c2='fuera de rango';
    if(rango){let u=n<0?(2**k+n):n;c2=u.toString(2).padStart(k,'0');}
    // dibujo de bits
    if(rango){const bw=Math.min(40,(a.W-80)/k);for(let i=0;i<k;i++){const x=40+i*bw;g.strokeStyle=i===0?C.d:C.muted;g.lineWidth=i===0?2.5:1.5;g.fillStyle=c2[i]==='1'?'rgba(180,35,47,0.15)':C.bg;g.fillRect(x,50,bw-4,44);g.strokeRect(x,50,bw-4,44);a.txt(c2[i],x+bw/2-8,80,c2[i]==='1'?C.a:C.muted,20);a.txt(String(2**(k-1-i)),x+4,110,C.muted,9);}
      a.txt(n<0?'bit de signo = 1 (negativo)':'bit de signo = 0 (positivo)',40,140,C.d,12);
      a.txt('valor = −b·'+2**(k-1)+' + resto de pesos = '+n,40,162,C.muted,12);}
    // IEEE 754
    const f=new Float32Array(1); f[0]=n===0?0:n+0.75*Math.sign(n); const dv=new DataView(new ArrayBuffer(4)); dv.setFloat32(0,f[0]);
    let u32=dv.getUint32(0).toString(2).padStart(32,'0');
    a.txt('IEEE 754 de '+f[0]+':  '+u32.slice(0,1)+' '+u32.slice(1,9)+' '+u32.slice(9),40,205,C.text,13);
    a.txt('signo    exponente+127      mantisa (sin el 1, normalizada)',40,225,C.muted,11);
    a.html(`${n} = <b>${n<0?'−':''}${bin(abs)}₂</b> = ${n<0?'−':''}${oct(abs)}₈ = ${n<0?'−':''}${hex(abs)}₁₆ · complemento a 2 con ${k} bits: <b>${c2}</b> ${rango&&n<0?'(invertir '+bin(abs).padStart(k,'0')+' y sumar 1)':''} · rango C2: [−${2**(k-1)}, ${2**(k-1)-1}]<br><span class="hint">Mueve el número y mira cómo cambia el bit de signo; prueba −15 con 8 bits (11110001, el del examen) y 7+1 con 4 bits (desbordamiento). El IEEE 754 mostrado añade 0,75 al número para que se vea la mantisa.</span>`);}});

/* 3 traza de un algoritmo: máximo común divisor y suma de dígitos */
SIMS.traza=el=>build(el,{selects:[{k:'alg',l:'algoritmo',v:'mcd',opts:[['mcd','mcd de Euclides (while)'],['dig','suma de dígitos (do-while)'],['pot','potencia por productos (for)']]}],sliders:[{k:'a',l:'a',v:36,min:1,max:200,step:1},{k:'b',l:'b / exponente',v:24,min:0,max:200,step:1},{k:'paso',l:'paso',v:0,min:0,max:30,step:1}],
  draw(a2){a2.clear();const s=a2.st;let rows=[],code='';
    if(s.alg==='mcd'){code='while (b != 0) { r = a % b; a = b; b = r; }';let x=s.a,y=s.b||1,r;rows.push([x,y,'-']);while(y!==0&&rows.length<40){r=x%y;x=y;y=r;rows.push([x,y,r]);}}
    else if(s.alg==='dig'){code='do { suma += n % 10; n /= 10; } while (n > 0);';let n=s.a,suma=0;rows.push([n,suma,'-']);do{suma+=n%10;n=Math.floor(n/10);rows.push([n,suma,n%10]);}while(n>0&&rows.length<40);}
    else{code='p = 1; for (i = 1; i <= e; i++) p = p * base;';let p=1;rows.push([0,1,'-']);for(let i=1;i<=Math.min(s.b,20);i++){p*=s.a;rows.push([i,p,'-']);}}
    const paso=Math.min(s.paso,rows.length-1);
    a2.txt(code,30,35,C.a,14);
    const hdr=s.alg==='mcd'?['a','b','r']:(s.alg==='dig'?['n','suma','dígito']:['i','p','']);
    for(let j=0;j<3;j++)a2.txt(hdr[j],60+j*120,70,C.muted,13);
    for(let i=0;i<=paso&&i<12;i++){const r=rows[Math.max(0,paso-11)+i];const y=95+i*22;const cur=(Math.max(0,paso-11)+i)===paso;
      for(let j=0;j<3;j++)a2.txt(String(r[j]),60+j*120,y,cur?C.a:C.text,cur?14:12);}
    const fin=paso===rows.length-1;
    a2.html(`Iteración ${paso} de ${rows.length-1} ${fin?'· <b>terminado</b>':''} · ${s.alg==='mcd'?`mcd(${s.a}, ${s.b}) = <b>${rows[rows.length-1][0]}</b>`:s.alg==='dig'?`suma de dígitos de ${s.a} = <b>${rows[rows.length-1][1]}</b>`:`${s.a}^${Math.min(s.b,20)} = <b>${rows[rows.length-1][1]}</b>`}<br><span class="hint">Esto es «trazar»: seguir el valor de cada variable iteración a iteración. Hazlo a mano en el examen con una tabla como esta antes de dar por bueno un bucle.</span>`);}});

/* 4 qué imprime: expresiones C */
SIMS.expresiones=el=>{el.classList.add('sim-box');paleta(el);
  const B=[
["int x = 7/2;","3","División entera: ambos operandos int."],
["double x = (double)(1/2);","0.0","1/2 ya es 0 antes del cast."],
["double x = (double)1/2;","0.5","El cast actúa antes de dividir."],
["int x = 17%5;","2","Resto de la división entera."],
["int a=5; printf(\"%d\", a++); ","5","a++ usa el valor y luego incrementa."],
["int a=5; printf(\"%d\", ++a);","6","++a incrementa antes de usar."],
["int a[3]={1,2,3}; printf(\"%d\", *(a+1));","2","*(a+i) equivale a a[i]."],
["int x=0; if (x=1) printf(\"si\"); else printf(\"no\");","si","= asigna (vale 1, verdadero); el error clásico por ==."],
["int i; for(i=0;i<3;i++); printf(\"%d\",i);","3","El ; tras el for es un bucle vacío; al salir i vale 3."],
["printf(\"%d\", 2+3*2);","8","Precedencia: * antes que +."],
["int x=5; printf(\"%d\", x>3 && x<10);","1","Las expresiones lógicas valen 1 (cierto) o 0."],
["char c='A'; printf(\"%c\", c+1);","B","Los char son enteros (ASCII)."],
["int v[5]={1,2,3,4,5}; int *p=v; printf(\"%d\", *p+2);","3","*p es v[0]=1; 1+2."],
["int v[5]={1,2,3,4,5}; int *p=v; printf(\"%d\", *(p+2));","3","p+2 apunta a v[2]."],
["int x=10, y=3; printf(\"%.1f\", (float)x/y);","3.3","El cast de x fuerza división real."],
["int x=6; switch(x%4){case 2: printf(\"dos\"); default: printf(\"otro\");}","dosotro","Sin break, cae al default."],
  ];
  let i=Math.floor(Math.random()*B.length),ok=0,tot=0;
  el.innerHTML='<div class="readout sim-out"><div class="qz"></div></div>';const out=el.querySelector('.qz');
  function show(rev){const [cod,res,exp]=B[i];
    out.innerHTML=`<p class="hint" style="margin-top:0">¿Qué imprime (o cuánto vale)?</p><pre class="code" style="margin:6px 0">${cod}</pre>${rev?`<p>Resultado: <b>${res}</b> — ${exp}</p><p><button class="qb" data-r="1">Acerté</button> <button class="qb" data-r="0">Fallé</button></p>`:`<p><button class="qb" data-s="1">Ver resultado</button></p>`}<p class="hint">Aciertos ${ok}/${tot}.</p>`;
    out.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.s)show(true);else{tot++;if(b.dataset.r==='1')ok++;i=(i+1+Math.floor(Math.random()*(B.length-1)))%B.length;show();}});}
  show();};

/* 5 trazador de bucles de validación / acumulación */
SIMS.bucles=el=>build(el,{selects:[{k:'t',l:'patrón',v:'val',opts:[['val','validación con do-while'],['acum','acumulador con centinela'],['anid','bucles anidados (tabla)']]}],sliders:[{k:'paso',l:'paso',v:0,min:0,max:25,step:1}],
  draw(a){a.clear();const s=a.st;let code,rows=[];
    if(s.t==='val'){code='do { printf("Edad: "); scanf(" %d", &edad); } while (edad <= 0 || edad > 110);';
      const ent=[-3,150,0,42];ent.forEach((e,k)=>{rows.push(['teclea '+e, e<=0||e>110?'inválida: repite':'válida: sale del bucle']);});}
    else if(s.t==='acum'){code='suma = 0; do { scanf(" %d", &x); suma += x; } while (x != 0);';
      const ent=[5,3,-2,7,0];let suma=0;ent.forEach(x=>{suma+=x;rows.push(['x = '+x+'  suma = '+suma, x!==0?'sigue':'centinela: termina']);});}
    else{code='for (i = 1; i <= 3; i++) { for (j = 1; j <= 4; j++) printf("%d·%d ", i, j); printf("\\n"); }';
      for(let i=1;i<=3;i++)for(let j=1;j<=4;j++)rows.push(['i = '+i+', j = '+j,'imprime '+i+'·'+j+(j===4?' y salto de línea':'')]);}
    a.txt(code,25,35,C.a,12.5);
    const paso=Math.min(s.paso,rows.length-1);
    for(let k=Math.max(0,paso-9);k<=paso;k++){const y=70+(k-Math.max(0,paso-9))*24;a.txt(rows[k][0],40,y,k===paso?C.a:C.text,k===paso?14:12);a.txt(rows[k][1],330,y,k===paso?C.d:C.muted,12);}
    a.html(`Paso ${paso+1} de ${rows.length}<br><span class="hint">${s.t==='val'?'La condición del while es la de REPETIR (dato inválido), no la de parar: el patrón de todos los exámenes.':s.t==='acum'?'El centinela (0) entra en el bucle una última vez: por eso aquí se suma antes de comprobar.':'El índice interior j completa sus 4 vueltas por cada valor de i: 3×4 = 12 iteraciones.'}</span>`);}});

/* 6 ordenación burbuja y búsqueda binaria */
SIMS.ordenacion=el=>build(el,{selects:[{k:'m',l:'algoritmo',v:'bur',opts:[['bur','burbuja (ordenar)'],['bin','búsqueda binaria']]}],sliders:[{k:'paso',l:'paso',v:0,min:0,max:40,step:1},{k:'x',l:'valor a buscar (binaria)',v:23,min:1,max:60,step:1}],
  draw(a){a.clear();const s=a.st,g=a.g;
    if(s.m==='bur'){let v=[42,7,31,5,18,25,3],hist=[{v:[...v],i:-1,sw:0}];
      for(let p=0;p<v.length-1;p++)for(let i=0;i<v.length-p-1;i++){const sw=v[i]>v[i+1];if(sw){const t=v[i];v[i]=v[i+1];v[i+1]=t;}hist.push({v:[...v],i,sw,p});}
      const st=hist[Math.min(s.paso,hist.length-1)];
      st.v.forEach((val,k)=>{const x=50+k*85,h=val*3;g.fillStyle=(k===st.i||k===st.i+1)?(st.sw?C.a:C.b):'rgba(120,120,120,0.35)';g.fillRect(x,230-h,60,h);a.txt(String(val),x+20,250,C.text,13);});
      a.html(`Paso ${Math.min(s.paso,hist.length-1)} de ${hist.length-1} ${st.i>=0?`· comparando posiciones ${st.i} y ${st.i+1}: ${st.sw?'<b>intercambio</b>':'ya en orden'}`:''} ${s.paso>=hist.length-1?'· <b>ordenado</b>':''}<br><span class="hint">Burbuja: n−1 pasadas; cada pasada «sube» el mayor pendiente hasta el final comparando vecinos (a[i] &gt; a[i+1] → intercambio con variable temporal). Coste n².</span>`);}
    else{const v=[3,5,7,18,23,25,31,42,47,51,56,60];let ini=0,fin=v.length-1,hist=[];
      while(ini<=fin){const m=Math.floor((ini+fin)/2);hist.push({ini,fin,m,hit:v[m]===s.x});if(v[m]===s.x)break;if(v[m]<s.x)ini=m+1;else fin=m-1;}
      if(!hist.length||!(hist[hist.length-1].hit))hist.push({ini,fin,m:-1,hit:false});
      const st=hist[Math.min(s.paso,hist.length-1)];
      v.forEach((val,k)=>{const x=30+k*58;const dentro=k>=st.ini&&k<=st.fin;g.fillStyle=k===st.m?C.a:(dentro?'rgba(180,35,47,0.18)':'rgba(120,120,120,0.15)');g.fillRect(x,120,50,50);g.strokeStyle=C.muted;g.strokeRect(x,120,50,50);a.txt(String(val),x+14,152,k===st.m?'#fff':C.text,14);a.txt(String(k),x+20,185,C.muted,10);});
      a.html(`Buscando <b>${s.x}</b> · intento ${Math.min(s.paso,hist.length-1)+1}: ${st.m>=0?`miro el centro v[${st.m}] = ${v[st.m]} → ${st.hit?'<b>encontrado</b>':(v[st.m]<s.x?'descarto la mitad izquierda':'descarto la mitad derecha')}`:'<b>no está</b> (ini &gt; fin)'}<br><span class="hint">Binaria sobre vector ordenado: máximo ⌈log₂ n⌉ comparaciones (12 elementos → 4). La lineal necesitaría de media n/2.</span>`);}}});

/* 7 pila de llamadas: factorial recursivo */
SIMS.pila=el=>build(el,{sliders:[{k:'n',l:'n',v:4,min:0,max:7,step:1},{k:'paso',l:'paso',v:0,min:0,max:16,step:1}],
  draw(a){a.clear();const s=a.st,g=a.g;
    a.txt('long fact(long n) {',30,30,C.a,13);a.txt('  if (n == 0) return 1;        /* caso base */',30,50,C.a,13);a.txt('  return n * fact(n-1);        /* problema mas pequeno */',30,70,C.a,13);a.txt('}',30,90,C.a,13);
    const total=2*s.n+1;                       // n+1 apilados y n+1 desapilados (el primero coincide con el caso base)
    const paso=Math.min(s.paso,total);
    const apilados=Math.min(paso,s.n);         // tras paso k<=n hay k+1 frames
    const devueltos=Math.max(0,paso-s.n);      // pops realizados
    const vivos=(Math.min(paso,s.n)+1)-devueltos;
    const x0=430,w=190;
    for(let k=0;k<vivos;k++){const nn=s.n-k;const y=260-k*38;g.fillStyle=k===vivos-1?'rgba(180,35,47,0.15)':C.bg;g.strokeStyle=C.a;g.lineWidth=1.5;g.fillRect(x0,y-26,w,32);g.strokeRect(x0,y-26,w,32);a.txt(`fact(${nn})${nn===0&&paso>=s.n?' = 1':''}`,x0+10,y-5,C.text,13);}
    a.txt('PILA (stack frames)',x0,292,C.muted,11);
    const fact=m=>{let f=1;for(let k=2;k<=m;k++)f*=k;return f;};
    let msg;
    if(paso<s.n)msg=`Apilando: llamada a fact(${s.n-paso-0}) → llama a fact(${s.n-paso-1})`;
    else if(paso===s.n)msg=`Caso base alcanzado: fact(0) devuelve 1`;
    else msg=`fact(${devueltos-1}) ha devuelto ${fact(devueltos-1)}; su frame se desapila y fact(${devueltos}) calcula ${devueltos} × ${fact(devueltos-1)} = ${fact(devueltos)}`;
    const fin=paso>=total;
    a.html(`${msg} ${fin?`· <b>fact(${s.n}) = ${fact(s.n)}</b>`:''}<br><span class="hint">Cada llamada crea un registro de activación en la pila (parámetros, dirección de retorno, locales); el caso base desencadena la devolución ascendente y cada return desapila su frame. Una recursión sin caso base agota la pila.</span>`);}});

/* 8 memoria: jerarquía y localidad */
SIMS.memoria=el=>build(el,{sliders:[{k:'hit',l:'tasa de acierto en caché (%)',v:90,min:0,max:100,step:1}],
  draw(a){a.clear();const s=a.st,g=a.g;
    const niveles=[['Registros','~0,3 ns','decenas',C.a],['Caché','~1-10 ns','MB',C.d],['RAM','~100 ns','GB',C.b],['Mem. virtual / SSD-HDD','~0,1-10 ms','TB',C.c]];
    niveles.forEach((n,k)=>{const w=120+k*120,x=(a.W-w)/2,y=40+k*58;g.fillStyle='rgba(120,120,120,0.12)';g.strokeStyle=n[3];g.lineWidth=2;g.fillRect(x,y,w,44);g.strokeRect(x,y,w,44);a.txt(n[0],x+12,y+18,n[3],13);a.txt(n[1]+' · '+n[2],x+12,y+36,C.muted,11);});
    a.txt('↑ velocidad',60,80,C.muted,12);a.txt('↓ capacidad y coste/bit',40,250,C.muted,12);
    const t=s.hit/100*10+(1-s.hit/100)*100; // ns medio con RAM a 100ns, cache 10ns
    a.html(`Tiempo medio de acceso con caché de 10 ns y RAM de 100 ns: t = ${s.hit}%·10 + ${100-s.hit}%·100 = <b>${F(t)} ns</b><br><span class="hint">El principio de localidad (espacial: direcciones próximas; temporal: lo recién usado) hace que la tasa de acierto real sea altísima: por eso la jerarquía funciona y la CPU casi siempre encuentra lo que busca en caché. La memoria virtual añade el disco como último escalón, mucho más lento.</span>`);}});

/* 9 SQL: consulta sobre la BD de ciclismo con resultado real */
SIMS.sql=el=>build(el,{selects:[{k:'q',l:'consulta (práctica ciclismo)',v:'0',opts:[['0','ciclistas con edad ≤ 25'],['1','COUNT, AVG de edad'],['2','join: puertos del Banesto'],['3','NOT IN: etapas sin puerto'],['4','subconsulta: puertos sobre la media'],['5','GROUP BY: ciclistas por equipo']]}],
  draw(a){a.clear();const g=a.g,s=a.st;
    const EQ=[['Banesto','Echávarri'],['Kelme','Piñón'],['Once','Saiz']];
    const CI=[[1,'Induráin',30,'Banesto'],[2,'Rominger',32,'Once'],[3,'Zülle',26,'Once'],[4,'Olano',24,'Banesto'],[5,'Pantani',23,'Kelme'],[6,'Jalabert',34,'Once']];
    const ET=[[1,180,'Valencia','Cuenca',1],[2,210,'Cuenca','Madrid',3],[3,160,'Madrid','Ávila',1],[4,145,'Ávila','Segovia',5]];
    const PU=[['Navacerrada',1860,'1',8,3,1],['Morcuera',1770,'2',7,3,5],['Cotos',1830,'E',9,4,1]];
    const Q=[
["SELECT dorsal, nombre FROM ciclista WHERE edad <= 25;", CI.filter(c=>c[2]<=25).map(c=>[c[0],c[1]]), ['dorsal','nombre']],
["SELECT COUNT(*), AVG(edad) FROM ciclista;", [[CI.length,(CI.reduce((t,c)=>t+c[2],0)/CI.length).toFixed(1)]], ['COUNT','AVG(edad)']],
["SELECT P.nompuerto, P.categoria\nFROM puerto P, ciclista C\nWHERE P.dorsal = C.dorsal AND C.nomeq = 'Banesto';", PU.filter(p=>{const c=CI.find(c=>c[0]===p[4]);return c&&c[3]==='Banesto';}).map(p=>[p[0],p[2]]), ['nompuerto','categoria']],
["SELECT netapa, salida FROM etapa\nWHERE netapa NOT IN (SELECT netapa FROM puerto);", ET.filter(e=>!PU.some(p=>p[5]===e[0])).map(e=>[e[0],e[2]]), ['netapa','salida']],
["SELECT nompuerto FROM puerto\nWHERE altura > (SELECT AVG(altura) FROM puerto);", PU.filter(p=>p[1]>PU.reduce((t,x)=>t+x[1],0)/PU.length).map(p=>[p[0]]), ['nompuerto']],
["SELECT nomeq, COUNT(*) FROM ciclista GROUP BY nomeq;", EQ.map(e=>[e[0],CI.filter(c=>c[3]===e[0]).length]), ['nomeq','COUNT']],
    ][+s.q];
    // tablas mini
    const tabla=(x,y,tit,hdr,rows)=>{a.txt(tit,x,y-6,C.a,12);hdr.forEach((h,j)=>a.txt(h,x+j*78,y+12,C.muted,10));rows.slice(0,6).forEach((r,i)=>r.forEach((v,j)=>a.txt(String(v),x+j*78,y+28+i*15,C.text,10)));};
    tabla(20,30,'ciclista',['dorsal','nombre','edad','nomeq'],CI);
    tabla(360,30,'etapa',['netapa','km','salida','llegada','dorsal'],ET.map(e=>e));
    tabla(20,160,'puerto',['puerto','altura','cat','pend','dorsal','netapa'],PU.map(p=>[p[0],p[1],p[2],p[3],p[4],p[5]]));
    tabla(500,160,'equipo',['nomeq','director'],EQ);
    a.html(`<pre class="code" style="margin:4px 0">${Q[0]}</pre>Resultado: <table style="margin-top:4px"><tr>${Q[2].map(h=>'<th style="text-align:left;padding:2px 10px 2px 0">'+h+'</th>').join('')}</tr>${Q[1].map(r=>'<tr>'+r.map(v=>'<td style="padding:2px 10px 2px 0">'+v+'</td>').join('')+'</tr>').join('')}</table><span class="hint">Datos de juguete de la práctica de ciclismo (el resultado está calculado de verdad sobre las tablas de arriba). Cambia de consulta y predícelo antes de mirar.</span>`);}});

/* test de examen: 4 opciones, resta 1/3 por fallo */
SIMS.testexamen=el=>{el.classList.add('sim-box');paleta(el);
  const B=window.TESTBANK||[];
  let orden=[...B.keys()].sort(()=>Math.random()-0.5),idx=0,ok=0,mal=0;
  el.innerHTML='<div class="readout sim-out"><div class="qz"></div></div>';const out=el.querySelector('.qz');
  function show(){if(idx>=orden.length){const nota=Math.max(0,(ok-mal/3)/orden.length*10);out.innerHTML=`<p><b>Fin del test.</b> Aciertos ${ok}, fallos ${mal} de ${orden.length}.</p><p>Nota con la regla del examen (cada fallo resta 1/3): <b>${nota.toFixed(2)} / 10</b> ${nota>=4?'— superas el mínimo de 4 en teoría ✓':'— por debajo del mínimo de 4'}</p><p><button class="qb" data-re="1">Repetir barajado</button></p>`;out.querySelector('button').onclick=()=>{orden.sort(()=>Math.random()-0.5);idx=0;ok=0;mal=0;show();};return;}
    const q=B[orden[idx]];const letras=['a','b','c','d'];
    const perm=[...q[1].keys()].sort(()=>Math.random()-0.5);
    out.innerHTML=`<p class="hint" style="margin-top:0">Pregunta ${idx+1} de ${orden.length} · aciertos ${ok} · fallos ${mal}</p><p style="font-size:1.1em"><b>${q[0]}</b></p><div class="qopts">${perm.map((p,k)=>`<button class="qb qo" data-p="${p}">${letras[k]}) ${q[1][p]}</button>`).join('')}</div><p class="qres"></p>`;
    out.querySelectorAll('.qo').forEach(b=>b.onclick=()=>{if(out.dataset.done)return;out.dataset.done='1';const good=+b.dataset.p===q[2];if(good)ok++;else mal++;
      out.querySelectorAll('.qo').forEach(x=>{if(+x.dataset.p===q[2])x.classList.add('ok');else if(x===b)x.classList.add('bad');x.disabled=true;});
      out.querySelector('.qres').innerHTML=(good?'<b>Correcto.</b> ':'<b>No.</b> ')+q[3]+' <button class="qb qn">Siguiente →</button>';
      out.querySelector('.qn').onclick=()=>{delete out.dataset.done;idx++;show();};});}
  show();};

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
