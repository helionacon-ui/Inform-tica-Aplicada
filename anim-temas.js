/* Informática Aplicada: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
function box(D,x,y,w,h,txt,col,fill,sz){D.rect(x,y,w,h,col||C.w,fill||null,2);if(txt!==undefined)D.text(String(txt),x+w/2,y+h/2+(sz||18)*0.36,{s:sz||18,a:'center',c:col||C.w,mono:true});}

/* T1 arquitectura de Von Neumann */
M.reg('inf-t1',M.base({title:'Von Neumann: el ciclo de instrucción',H:540,dur:16,caps:[[5,'La CPU, la memoria y la entrada/salida se comunican por el <b>bus</b>. Programa y datos están en la misma memoria.'],[11,'Ciclo de instrucción: la CPU <b>busca</b> la instrucción en memoria, la <b>decodifica</b> y la <b>ejecuta</b>, y vuelve a empezar.'],[99,'Todo pasa por el mismo bus, de uno en uno: es el «cuello de botella de Von Neumann». Las cachés existen para aliviarlo.']]},
 function(D,t){box(D,60,110,180,150,undefined,C.m,RG(C.m,.12));D.text('CPU',150,140,{s:20,a:'center',c:C.m,bold:true});box(D,80,160,140,36,'UC',C.m,null,16);box(D,80,206,140,36,'ALU',C.m,null,16);
  box(D,400,110,180,150,undefined,C.f,RG(C.f,.12));D.text('Memoria',490,140,{s:20,a:'center',c:C.f,bold:true});
  var ph=Math.floor(t/1.6)%3,lines=['0: LOAD  A','1: ADD   B','2: STORE C','3: JMP   0'],pc=Math.floor(t/4.8)%4;
  lines.forEach(function(l,i){D.text(l,420,170+i*22,{s:15,mono:true,c:i===pc?C.hl:C.w});});
  box(D,230,330,180,70,undefined,C.g,RG(C.g,.12));D.text('E/S',320,372,{s:20,a:'center',c:C.g,bold:true});
  D.rect(60,295,520,14,null,RG(C.mut,.35));D.text('bus del sistema',320,290,{s:14,a:'center',c:C.mut});
  D.line(150,260,150,295,C.mut,3);D.line(490,260,490,295,C.mut,3);D.line(320,309,320,330,C.mut,3);
  var u=(t%1.6)/1.6,x=ph===0?lerp(490,150,u):(ph===1?150:lerp(150,490,u));if(ph!==1){D.dot(x,302,8,C.hl);}else{D.ring(150,225,26+6*Math.sin(t*10),C.hl,2);}
  D.text(['1. búsqueda (fetch): la instrucción viaja de memoria a la CPU','2. decodificación y ejecución en la UC y la ALU','3. escritura del resultado en memoria'][ph],W/2,450,{s:20,a:'center',c:C.hl,bold:true});
  D.text('contador de programa PC = '+pc,W/2,488,{s:18,a:'center',mono:true});}));

/* T2 binario y complemento a 2 */
M.reg('inf-t2',M.base({title:'Contar en binario con 8 bits',H:540,dur:24,caps:[[8,'Cada bit vale el doble que el de su derecha: 1, 2, 4, 8… Sumando los pesos de los bits a 1 se obtiene el valor.'],[16,'Al pasar de 127 (0111 1111) a 128 (1000 0000) el bit de más peso se enciende. Sin signo es 128; en <b>complemento a 2</b> es −128.'],[99,'Con 8 bits: sin signo 0…255; con signo (C2) −128…127. El hexadecimal agrupa los bits de 4 en 4.']]},
 function(D,t){var seq=[0,1,2,3,5,10,42,100,126,127,128,129,200,254,255],k=Math.min(seq.length-1,Math.floor(t/1.55)),n=seq[k],x0=80,w=58;
  for(var b=7;b>=0;b--){var on=(n>>b)&1,x=x0+(7-b)*w;box(D,x,150,w-6,64,on,on?(b===7?C.g:C.m):C.mut,on?RG(b===7?C.g:C.m,.25):null,30);D.text(String(1<<b),x+(w-6)/2,236,{s:14,a:'center',c:C.mut});}
  D.text(b7(n),W/2,120,{s:16,a:'center',c:C.mut,mono:true});
  var sgn=n>127?n-256:n,hx=n.toString(16).toUpperCase();if(hx.length<2)hx='0'+hx;
  D.text('sin signo: '+n,W/2,300,{s:26,a:'center',c:C.m,bold:true});D.text('complemento a 2: '+sgn,W/2,344,{s:24,a:'center',c:n>127?C.g:C.w});D.text('hexadecimal: 0x'+hx,W/2,386,{s:22,a:'center',mono:true});
  function b7(n){var s='';for(var i=7;i>=0;i--){s+=(n>>i)&1;if(i===4)s+=' ';}return s;}
  if(n>127)D.text('−128 + '+(n-128)+' = '+sgn,W/2,428,{s:18,a:'center',c:C.mut});}));

/* T3 ordenación de burbuja */
var bub=(function(){var a=[5,2,8,1,9,3,7,4],st=[];for(var i=0;i<a.length;i++)for(var j=0;j<a.length-1-i;j++){var sw=a[j]>a[j+1];st.push({a:a.slice(),j:j,sw:sw,done:a.length-i});if(sw){var x=a[j];a[j]=a[j+1];a[j+1]=x;}}st.push({a:a.slice(),j:-1,sw:false,done:0});return st;})();
M.reg('inf-t3',M.base({title:'Ordenación por burbuja',H:540,dur:30,caps:[[10,'Se recorre el vector comparando cada pareja de vecinos (en amarillo). Si están desordenados se intercambian.'],[20,'Tras cada pasada, el mayor de los que quedan «sube» hasta su sitio al final (en verde): de ahí el nombre.'],[99,'Para n elementos hacen falta hasta n(n−1)/2 comparaciones: el algoritmo es O(n²). Sencillo, pero lento para vectores grandes.']]},
 function(D,t){var k=Math.min(bub.length-1,Math.floor(t/(28/bub.length))),s=bub[k],n=s.a.length,x0=90,w=56;
  s.a.forEach(function(v,i){var h=v*32,col=i>=s.done?C.ok:(i===s.j||i===s.j+1?(s.sw?C.g:C.hl):C.m);D.rect(x0+i*w,420-h,w-10,h,col,RG(col,.3),2);D.text(String(v),x0+i*w+(w-10)/2,440,{s:18,a:'center',mono:true});});
  D.text(s.j<0?'¡ordenado!':'comparo a['+s.j+'] = '+s.a[s.j]+' con a['+(s.j+1)+'] = '+s.a[s.j+1]+(s.sw?'  → intercambio':'  → bien'),W/2,488,{s:20,a:'center',c:s.sw?C.g:C.m,mono:true});
  D.text('comparaciones: '+Math.min(k,bub.length-1),W/2,520,{s:16,a:'center',c:C.mut});}));

/* T4 desbordamiento de enteros */
M.reg('inf-t4',M.base({title:'Desbordamiento de un entero de 8 bits',H:540,dur:18,caps:[[6,'Un <code>signed char</code> guarda valores de −128 a 127. Los 256 valores posibles forman un círculo.'],[12,'Si a 127 le sumamos 1 no sale 128: el contador da la vuelta y aparece −128. Es el <b>desbordamiento</b> (overflow).'],[99,'El compilador no avisa en tiempo de ejecución: hay que elegir un tipo con rango suficiente (int, long) o comprobar los límites.']]},
 function(D,t){var cx=230,cy=280,R=150,v=Math.round(lerp(100,160,ease(seg(t,1,15)))),sv=v>127?v-256:v;
  D.ring(cx,cy,R,C.grid,10);for(var k=-128;k<128;k+=32){var a=Math.PI/2-(k+128)/256*2*Math.PI;D.text(String(k),cx+(R+28)*Math.cos(a),cy-(R+28)*Math.sin(a)+5,{s:14,a:'center',c:C.mut});}
  var a127=Math.PI/2-(255)/256*2*Math.PI;D.line(cx+(R-14)*Math.cos(Math.PI/2),cy-(R-14),cx+(R+14)*Math.cos(Math.PI/2),cy-(R+14),C.bad,3);
  var a=Math.PI/2-((sv+128)%256)/256*2*Math.PI;D.arrow(cx,cy,cx+(R-6)*Math.cos(a),cy-(R-6)*Math.sin(a),sv<0?C.g:C.m,3.4);D.dot(cx,cy,6,C.w);
  D.text('x = '+sv,480,220,{s:30,a:'center',c:sv<0?C.g:C.m,bold:true,mono:true});D.text('bits: '+('00000000'+(v&255).toString(2)).slice(-8),480,264,{s:18,a:'center',mono:true});
  D.text(v>127&&v<132?'¡127 + 1 = −128!':(v>127?'ha dado la vuelta':'x++'),480,306,{s:20,a:'center',c:v>127?C.bad:C.mut});D.text('salto 127 → −128',cx+110,cy-R-30,{s:13,a:'center',c:C.bad});}));

/* T5 bucle for paso a paso */
var code=['int suma = 0;','for (int i = 1; i <= 5; i++) {','    suma = suma + i;','}','printf("%d", suma);'];
var tr5=(function(){var s=[],suma=0;s.push({l:0,i:'–',s:0});for(var i=1;i<=5;i++){s.push({l:1,i:i,s:suma});suma+=i;s.push({l:2,i:i,s:suma});}s.push({l:1,i:6,s:suma});s.push({l:4,i:'–',s:suma});return s;})();
M.reg('inf-t5',M.base({title:'Un bucle for, instrucción a instrucción',H:540,dur:24,caps:[[8,'La flecha marca la instrucción que se ejecuta. Antes de cada vuelta se evalúa la condición <code>i &lt;= 5</code>.'],[18,'En cada vuelta se ejecuta el cuerpo y luego <code>i++</code>. La variable <code>suma</code> acumula 1 + 2 + 3 + 4 + 5.'],[99,'Cuando <code>i</code> vale 6 la condición es falsa y el bucle termina: se imprime 15.']]},
 function(D,t){var k=Math.min(tr5.length-1,Math.floor(t/(22/tr5.length))),s=tr5[k];
  code.forEach(function(l,i){if(i===s.l)D.rect(50,92+i*40,360,34,null,RG(C.y,.15));D.text(l,64,116+i*40,{s:18,mono:true,c:i===s.l?C.y:C.w});});D.text('▶',36,116+s.l*40,{s:18,c:C.y});
  box(D,450,100,140,60,undefined,C.f);D.text('i',520,124,{s:16,a:'center',c:C.mut,mono:true});D.text(String(s.i),520,150,{s:24,a:'center',c:C.f,mono:true});
  box(D,450,180,140,60,undefined,C.m);D.text('suma',520,204,{s:16,a:'center',c:C.mut,mono:true});D.text(String(s.s),520,230,{s:24,a:'center',c:C.m,mono:true});
  if(s.l===1)D.text('¿'+s.i+' <= 5? '+(s.i<=5?'sí':'no'),520,280,{s:18,a:'center',c:s.i<=5?C.ok:C.bad,mono:true});
  if(s.l===4)D.text('salida: 15',W/2,400,{s:24,a:'center',c:C.ok,mono:true,bold:true});}));

/* T6 búsqueda binaria */
var arr=[2,5,8,12,16,23,38,45,56,67,72,81,90,94,97,99],tg=72;
var bs=(function(){var lo=0,hi=15,st=[];while(lo<=hi){var mid=Math.floor((lo+hi)/2);st.push({lo:lo,hi:hi,mid:mid});if(arr[mid]===tg)break;if(arr[mid]<tg)lo=mid+1;else hi=mid-1;}return st;})();
M.reg('inf-t6',M.base({title:'Búsqueda binaria en un vector ordenado',H:500,dur:16,caps:[[6,'Buscamos 72 en un vector <b>ordenado</b> de 16 elementos. Miramos el elemento central.'],[11,'Si es menor que lo buscado, descartamos la mitad izquierda; si es mayor, la derecha. El intervalo [lo, hi] se reduce a la mitad cada vez.'],[99,'Como mucho log₂(16) = 4 comparaciones, frente a las 16 de una búsqueda secuencial: O(log n).']]},
 function(D,t){var k=Math.min(bs.length-1,Math.floor(t/3.2)),s=bs[k],x0=32,w=36;
  arr.forEach(function(v,i){var inr=i>=s.lo&&i<=s.hi,col=i===s.mid?(arr[i]===tg?C.ok:C.hl):(inr?C.m:C.mut);box(D,x0+i*w,180,w-4,46,v,col,inr?RG(col,.18):null,15);D.text(String(i),x0+i*w+(w-4)/2,246,{s:12,a:'center',c:C.mut});});
  D.text('lo',x0+s.lo*w+16,160,{s:15,a:'center',c:C.f});D.text('hi',x0+s.hi*w+16,160,{s:15,a:'center',c:C.f});D.text('mid',x0+s.mid*w+16,282,{s:15,a:'center',c:C.hl});
  var v=arr[s.mid];D.text('paso '+(k+1)+':  a['+s.mid+'] = '+v+(v===tg?'  → ¡encontrado!':(v<tg?' < 72 → lo = mid + 1':' > 72 → hi = mid − 1')),W/2,350,{s:20,a:'center',c:v===tg?C.ok:C.m,mono:true});}));

/* T7 recursividad: pila de llamadas */
var fr7=(function(){var st=[],stack=[];for(var n=4;n>=1;n--){stack.push('fact('+n+')');st.push({s:stack.slice(),r:null});}var r=1;for(var m=1;m<=4;m++){r*=m;stack.pop();st.push({s:stack.slice(),r:'fact('+m+') = '+r});}return st;})();
M.reg('inf-t7',M.base({title:'Recursividad: la pila de llamadas',H:540,dur:18,caps:[[7,'<code>fact(n) = n · fact(n − 1)</code>. Cada llamada se apila encima de la anterior y espera a que termine la de arriba.'],[11,'<code>fact(1)</code> es el <b>caso base</b>: devuelve 1 sin llamar a nadie. Ahí empieza la vuelta.'],[99,'Al desapilar, cada llamada multiplica: 1, 2, 6, 24. Sin caso base la pila crecería hasta desbordarse (stack overflow).']]},
 function(D,t){var k=Math.min(fr7.length-1,Math.floor(t/(17/fr7.length))),s=fr7[k];
  s.s.forEach(function(f,i){var n=4-i;box(D,200,420-i*62,240,52,undefined,i===s.s.length-1?C.hl:C.m,RG(i===s.s.length-1?C.hl:C.m,.15));D.text(f+(n===1?'  → return 1':'  → '+n+' · fact('+(n-1)+')'),320,452-i*62,{s:17,a:'center',mono:true});});
  D.text('pila',160,452,{s:16,c:C.mut,a:'right'});D.line(190,476,450,476,C.w,2);if(s.r)D.text('devuelve: '+s.r,W/2,140,{s:22,a:'center',c:C.ok,mono:true,bold:true});}));

/* T8 planificación Round Robin */
var GT=[['P1',0,2],['P2',2,4],['P3',4,6],['P1',6,8],['P2',8,9],['P3',9,11],['P1',11,12]];
M.reg('inf-t8',M.base({title:'Planificación Round Robin (q = 2)',H:520,dur:16,caps:[[6,'Tres procesos listos: P1 necesita 5 unidades de CPU, P2 3 y P3 4. Cada uno usa la CPU como mucho un <b>quantum</b> de 2.'],[12,'Si no termina en su quantum, vuelve al final de la cola de listos y entra el siguiente: todos avanzan por turnos.'],[99,'Así ningún proceso acapara la CPU y el sistema responde rápido. Un quantum muy pequeño, en cambio, gasta mucho tiempo en cambios de contexto.']]},
 function(D,t){var now=lerp(0,12,seg(t,1,14)),x0=60,sc=42,y=200,cols={P1:C.m,P2:C.f,P3:C.g},rem={P1:5,P2:3,P3:4};
  GT.forEach(function(g){if(now<=g[1])return;var e=Math.min(now,g[2]);D.rect(x0+g[1]*sc,y,(e-g[1])*sc,50,cols[g[0]],RG(cols[g[0]],.3),2);D.text(g[0],x0+(g[1]+e)/2*sc,y+31,{s:16,a:'center',c:cols[g[0]],mono:true});rem[g[0]]-=e-g[1];});
  for(var k=0;k<=12;k+=2){D.text(String(k),x0+k*sc,y+72,{s:14,a:'center',c:C.mut});D.line(x0+k*sc,y+50,x0+k*sc,y+56,C.mut,1);}D.line(x0+now*sc,y-20,x0+now*sc,y+60,C.hl,2);D.text('t = '+nf(now,1),x0+now*sc,y-26,{s:15,a:'center',c:C.hl});
  ['P1','P2','P3'].forEach(function(p,i){D.text(p+' resta '+nf(Math.max(0,rem[p]),1),120+i*200,360,{s:18,a:'center',c:cols[p],mono:true});});
  D.text('tiempo total = 12 · fin: P2 en 9, P3 en 11, P1 en 12',W/2,420,{s:17,a:'center',c:C.mut});}));

/* T9 JOIN en SQL */
var AL=[[1,'Ana',10],[2,'Luis',20],[3,'Eva',10],[4,'Raúl',30]],DP=[[10,'Física'],[20,'Química'],[30,'Mates']];
M.reg('inf-t9',M.base({title:'SQL: cómo funciona un JOIN',H:560,dur:18,caps:[[6,'<code>SELECT a.nombre, d.nombre FROM alumno a JOIN dpto d ON a.dpto = d.id;</code>'],[13,'Para cada fila de <code>alumno</code> se busca la fila de <code>dpto</code> cuya clave primaria coincide con la clave ajena <code>a.dpto</code>.'],[99,'El resultado combina las columnas de las dos tablas. La clave ajena es lo que relaciona las tablas en el modelo relacional.']]},
 function(D,t){var k=Math.min(4,Math.floor((t-1)/3));D.text('alumno',120,100,{s:16,a:'center',c:C.m,bold:true});D.text('dpto',470,100,{s:16,a:'center',c:C.f,bold:true});
  AL.forEach(function(r,i){var on=i===k;box(D,40,112+i*40,160,34,undefined,on?C.hl:C.m,on?RG(C.hl,.15):null);D.text(r[0]+'  '+r[1]+'  '+r[2],120,135+i*40,{s:16,a:'center',mono:true});});
  DP.forEach(function(r,j){var on=k>=0&&k<4&&AL[k][2]===r[0];box(D,400,112+j*40,140,34,undefined,on?C.hl:C.f,on?RG(C.hl,.15):null);D.text(r[0]+'  '+r[1],470,135+j*40,{s:16,a:'center',mono:true});
   if(on)D.arrow(200,129+k*40,400,129+j*40,C.hl,2.4);});
  D.text('resultado',W/2,320,{s:16,a:'center',c:C.ok,bold:true});for(var i=0;i<=Math.min(k,3);i++){if(t<1+i*3+1.5)break;var dn=DP.filter(function(d){return d[0]===AL[i][2];})[0][1];box(D,190,332+i*38,260,32,undefined,C.ok,RG(C.ok,.12));D.text(AL[i][1]+'  |  '+dn,320,354+i*38,{s:16,a:'center',mono:true});}}));
})();
