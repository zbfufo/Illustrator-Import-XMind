#target illustrator
/* Import XMind 0.8.1 · 简约窗口 / 按需预览 / 多语言 / ©zbfufo
 * macOS 风格浅灰白界面；排版、外观两页；左下角预览开关及中英日韩界面语言。
 * 勾选预览后，选择完成自动刷新；输入字段在提交后刷新。无手动更新和细节模式。
 * 预览在独立临时文档中绘制，关闭后恢复原文档；确认才写入目标文档。
 * 按原图版面保留方向、顺序、已存坐标及宽度；无坐标节点按原结构补排，非像素级复刻。
 * 智能模式提供层级清晰、扁平分栏，按层级字号排版，完整保留父子关系。
 * 背景可选白色、黑色、透明或六位色号；实色创建独立底色层，透明不添加底色。
 * 保留自由主题独立性，重绘已有关系线及箭头。暂不还原图片、附件、边界和概要；局部富文本颜色不单独还原。
 * 导入为一个总组，内部按原父子关系嵌套主题组；背景和连线包含在总组中。
 */
/* Standalone ES3 ZIP/DEFLATE and JSON reader for Adobe ExtendScript. */
var XMindAIReader = (function () {
  var LIMIT = 64 * 1024 * 1024;
  function fail(s) { throw new Error(s); }
  function u16(s, p) { return octet(s, p) + octet(s, p + 1) * 256; }
  function u32(s, p) { return u16(s, p) + u16(s, p + 2) * 65536; }
  function octet(s, p) { if (p < 0 || p >= s.length) fail('XMind ZIP 数据不完整。'); return s.charCodeAt(p) & 255; }
  function binary(a) {
    var parts = [], i, j, end, chunk;
    for (i = 0; i < a.length; i += 4096) {
      chunk = ''; end = Math.min(a.length, i + 4096);
      for (j = i; j < end; j++) chunk += String.fromCharCode(a[j]);
      parts.push(chunk);
    }
    return parts.join('');
  }
  function inflate(s, expected) {
    var pos = 0, buffer = 0, available = 0, out = [];
    function bits(n) {
      while (available < n) { buffer |= octet(s, pos++) << available; available += 8; }
      var value = buffer & ((1 << n) - 1);
      buffer >>>= n; available -= n; return value;
    }
    function tree(lengths) {
      var counts = [], next = [], root = [], code = 0, i, j, n, node, b, left = 1;
      for (i = 0; i <= 15; i++) counts[i] = 0;
      for (i = 0; i < lengths.length; i++) { if (lengths[i] < 0 || lengths[i] > 15) fail('无效的压缩码长。'); counts[lengths[i]]++; }
      counts[0] = 0;
      for (i = 1; i <= 15; i++) { left = left * 2 - counts[i]; if (left < 0) fail('无效的压缩编码。'); code = (code + counts[i - 1]) * 2; next[i] = code; }
      for (i = 0; i < lengths.length; i++) {
        n = lengths[i]; if (!n) continue;
        code = next[n]++; node = root;
        for (j = n - 1; j >= 0; j--) {
          b = (code >>> j) & 1;
          if (j === 0) node[b] = i;
          else { if (typeof node[b] === 'number') fail('无效的压缩树。'); if (!node[b]) node[b] = []; node = node[b]; }
        }
      }
      return root;
    }
    function symbol(t) {
      var node = t, i;
      for (i = 0; i < 16; i++) { node = node[bits(1)]; if (typeof node === 'number') return node; if (!node) fail('压缩数据已损坏。'); }
      fail('无效的压缩符号。');
    }
    function push(v) { if (out.length >= expected || out.length >= LIMIT) fail('解压大小与文件声明不符。'); out.push(v); }
    var lb = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
    var le = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
    var db = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
    var de = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
    var last, type, len, inv, i, lengths, distances, lt, dt, c, n, d, repeat, value;
    do {
      last = bits(1); type = bits(2);
      if (type === 0) {
        buffer = 0; available = 0; len = bits(16); inv = bits(16);
        if ((len ^ inv) !== 65535) fail('未压缩数据块已损坏。');
        for (i = 0; i < len; i++) push(bits(8));
        continue;
      }
      lengths = []; distances = [];
      if (type === 1) {
        for (i = 0; i < 288; i++) lengths[i] = i < 144 ? 8 : i < 256 ? 9 : i < 280 ? 7 : 8;
        for (i = 0; i < 32; i++) distances[i] = 5;
      } else if (type === 2) {
        var nl = bits(5) + 257, nd = bits(5) + 1, nc = bits(4) + 4;
        if (nl > 286 || nd > 32) fail('无效的压缩头。');
        var order = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
        var cl = [], all = [];
        for (i = 0; i < 19; i++) cl[i] = 0;
        for (i = 0; i < nc; i++) cl[order[i]] = bits(3);
        var ct = tree(cl);
        while (all.length < nl + nd) {
          c = symbol(ct);
          if (c < 16) all.push(c);
          else {
            if (c === 16) { if (!all.length) fail('无效的重复编码。'); repeat = bits(2) + 3; value = all[all.length - 1]; }
            else if (c === 17) { repeat = bits(3) + 3; value = 0; }
            else if (c === 18) { repeat = bits(7) + 11; value = 0; }
            else fail('无效的码长符号。');
            if (all.length + repeat > nl + nd) fail('码长数量不符。');
            while (repeat--) all.push(value);
          }
        }
        lengths = all.slice(0, nl); distances = all.slice(nl);
        if (!lengths[256]) fail('压缩数据缺少结束符号。');
      } else fail('不支持的压缩数据块。');
      lt = tree(lengths); dt = tree(distances);
      while (true) {
        c = symbol(lt);
        if (c < 256) push(c);
        else if (c === 256) break;
        else {
          if (c < 257 || c > 285) fail('无效的匹配长度。');
          n = lb[c - 257] + bits(le[c - 257]); d = symbol(dt);
          if (d > 29) fail('无效的匹配距离。');
          d = db[d] + bits(de[d]); if (d > out.length) fail('匹配距离超出解压数据。');
          for (i = 0; i < n; i++) push(out[out.length - d]);
        }
      }
    } while (!last);
    if (out.length !== expected) fail('解压后的文件长度不符。');
    return binary(out);
  }
  function crc32(s) {
    var table = [], i, j, n, crc = -1;
    for (i = 0; i < 256; i++) { n = i; for (j = 0; j < 8; j++) n = (n >>> 1) ^ ((n & 1) ? 0xEDB88320 : 0); table[i] = n; }
    for (i = 0; i < s.length; i++) crc = (crc >>> 8) ^ table[(crc ^ s.charCodeAt(i)) & 255];
    return (crc ^ -1) >>> 0;
  }
  function unzip(s) {
    var end = -1, i, min = Math.max(0, s.length - 65557);
    for (i = s.length - 22; i >= min; i--) if (u32(s, i) === 0x06054b50 && i + 22 + u16(s, i + 20) === s.length) { end = i; break; }
    if (end < 0) fail('这不是完整的 XMind ZIP 文件。');
    if (u16(s, end + 4) || u16(s, end + 6)) fail('暂不支持分卷 ZIP。');
    var count = u16(s, end + 10), p = u32(s, end + 16), flags, method, crc, packed, size, nameLen, extra, comment, local, name, start, data, xml = false;
    if (count === 65535 || p === 0xffffffff) fail('暂不支持 ZIP64 文件。');
    for (i = 0; i < count; i++) {
      if (u32(s, p) !== 0x02014b50) fail('XMind ZIP 目录已损坏。');
      flags = u16(s, p + 8); method = u16(s, p + 10); crc = u32(s, p + 16);
      packed = u32(s, p + 20); size = u32(s, p + 24); nameLen = u16(s, p + 28); extra = u16(s, p + 30); comment = u16(s, p + 32); local = u32(s, p + 42);
      name = s.substring(p + 46, p + 46 + nameLen);
      if (name === 'content.xml') xml = true;
      if (name === 'content.json') {
        if (flags & 1) fail('不支持加密的 XMind 文件。');
        if (size > LIMIT || packed > LIMIT || local === 0xffffffff) fail('XMind 主题数据超过 64 MB 或使用了 ZIP64。');
        if (u32(s, local) !== 0x04034b50) fail('XMind 文件头已损坏。');
        start = local + 30 + u16(s, local + 26) + u16(s, local + 28);
        if (start + packed > s.length) fail('XMind 数据不完整。');
        data = s.substring(start, start + packed);
        if (method === 8) data = inflate(data, size);
        else if (method !== 0) fail('不支持 ZIP 压缩方法 ' + method + '。');
        if (data.length !== size || crc32(data) !== crc) fail('XMind 主题数据校验失败，请重新保存文件。');
        return data;
      }
      p += 46 + nameLen + extra + comment;
    }
    fail(xml ? '此文件只有旧版 content.xml。请用 XMind 打开后另存为新版 .xmind。' : 'XMind 中未找到 content.json。');
  }
  function utf8(s) {
    var parts = [], chunk = '', i = 0, a, b, n, c, needed;
    while (i < s.length) {
      a = octet(s, i++);
      if (a < 128) c = a;
      else {
        if (a >= 194 && a <= 223) { c = a & 31; needed = 1; n = 128; }
        else if (a >= 224 && a <= 239) { c = a & 15; needed = 2; n = 2048; }
        else if (a >= 240 && a <= 244) { c = a & 7; needed = 3; n = 65536; }
        else fail('主题数据不是有效的 UTF-8。');
        while (needed--) { b = octet(s, i++); if ((b & 192) !== 128) fail('UTF-8 字符不完整。'); c = c * 64 + (b & 63); }
        if (c < n || c > 0x10ffff || (c >= 0xd800 && c <= 0xdfff)) fail('无效的 UTF-8 字符。');
      }
      if (c > 65535) { c -= 65536; chunk += String.fromCharCode(0xd800 + (c >>> 10), 0xdc00 + (c & 1023)); }
      else chunk += String.fromCharCode(c);
      if (chunk.length > 4096) { parts.push(chunk); chunk = ''; }
    }
    parts.push(chunk); return parts.join('').replace(/^\uFEFF/, '');
  }
  function parse(text) {
    /* Illustrator versions without a global JSON object use this strict parser. */
    var p = 0, depth = 0;
    function error() { fail('JSON 数据格式错误，位置 ' + p + '。'); }
    function space() { while (p < text.length && /[\x20\t\r\n]/.test(text.charAt(p))) p++; }
    function string() {
      var out = '', c, esc, hex;
      if (text.charAt(p++) !== '"') error();
      while (p < text.length) {
        c = text.charAt(p++); if (c === '"') return out;
        if (c === '\\') {
          esc = text.charAt(p++);
          if (esc === 'u') { hex = text.substr(p, 4); if (!/^[0-9a-fA-F]{4}$/.test(hex)) error(); out += String.fromCharCode(parseInt(hex, 16)); p += 4; }
          else if (esc === '"' || esc === '\\' || esc === '/') out += esc;
          else if (esc === 'b') out += '\b'; else if (esc === 'f') out += '\f'; else if (esc === 'n') out += '\n'; else if (esc === 'r') out += '\r'; else if (esc === 't') out += '\t'; else error();
        } else { if (c.charCodeAt(0) < 32) error(); out += c; }
      }
      error();
    }
    function value() {
      space(); if (++depth > 512) fail('JSON 嵌套层级过深。');
      var c = text.charAt(p), result, key, m;
      if (c === '"') result = string();
      else if (c === '[') {
        result = []; p++; space();
        if (text.charAt(p) !== ']') while (true) { result.push(value()); space(); if (text.charAt(p) !== ',') break; p++; }
        if (text.charAt(p++) !== ']') error();
      } else if (c === '{') {
        result = {}; p++; space();
        if (text.charAt(p) !== '}') while (true) { space(); if (text.charAt(p) !== '"') error(); key = string(); space(); if (text.charAt(p++) !== ':') error(); result[key] = value(); space(); if (text.charAt(p) !== ',') break; p++; }
        if (text.charAt(p++) !== '}') error();
      } else if (text.substr(p, 4) === 'true') { result = true; p += 4; }
      else if (text.substr(p, 5) === 'false') { result = false; p += 5; }
      else if (text.substr(p, 4) === 'null') { result = null; p += 4; }
      else { m = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/.exec(text.substring(p)); if (!m) error(); result = Number(m[0]); p += m[0].length; }
      depth--; return result;
    }
    text = text.replace(/^\uFEFF/, ''); var data = value(); space(); if (p !== text.length) error(); return data;
  }
  return { read: function (binaryText) { return parse(utf8(unzip(binaryText))); }, parse: parse, unzip: unzip, utf8: utf8 };
})();

/* ES3 color resolution: explicit node style > theme > branch palette. */
var XMindAIColors = (function () {
  function rgba(r,g,b,a){return {r:r,g:g,b:b,a:a===undefined?1:a};}
  function parse(value){
    if(value===undefined || value===null)return null;
    var s=String(value).replace(/^\s+|\s+$/g,''), m, a=1;
    if(/^(none|transparent)$/i.test(s))return rgba(0,0,0,0);
    if((m=/^#([0-9a-f]{3,8})$/i.exec(s))){
      s=m[1];if(s.length===3 || s.length===4){var full='',i;for(i=0;i<s.length;i++)full+=s.charAt(i)+s.charAt(i);s=full;}
      if(s.length!==6 && s.length!==8)return null;
      if(s.length===8)a=parseInt(s.substr(6,2),16)/255;
      return rgba(parseInt(s.substr(0,2),16),parseInt(s.substr(2,2),16),parseInt(s.substr(4,2),16),a);
    }
    if((m=/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(s)))return rgba(Math.min(255,+m[1]),Math.min(255,+m[2]),Math.min(255,+m[3]),m[4]===undefined?1:Math.min(1,+m[4]));
    return null;
  }
  function properties(obj){return obj && obj.properties ? obj.properties : {};}
  function merge(a,b){var o={},k;for(k in a)if(a.hasOwnProperty(k))o[k]=a[k];for(k in b)if(b.hasOwnProperty(k))o[k]=b[k];return o;}
  function hex(c){function h(n){var s=Math.round(n).toString(16);return s.length<2?'0'+s:s;}return (h(c.r)+h(c.g)+h(c.b)).toUpperCase();}
  function contrast(c){var l=(c.r*0.299+c.g*0.587+c.b*0.114)/255;return l>0.6?darkText(c):rgba(255,255,255);}
  function darkText(c){
    /* XMind Energy theme automatic text colors, checked against the saved preview. */
    var energy={'F22816':'#600C05','F2B807':'#634B02','233ED9':'#0E1957'};
    var known=energy[hex(c)];if(known)return parse(known);
    return rgba(Math.round(c.r*0.4),Math.round(c.g*0.4),Math.round(c.b*0.4));
  }
  function apply(root,sheet){
    var theme=sheet.theme||{},map=merge(properties(theme.map),properties(sheet.style));
    var palette=String(map['multi-line-colors']||'').match(/#[0-9a-fA-F]{3,8}\b/g)||[];
    var central=properties(theme.centralTopic),defaultBase=parse(central['line-color'])||rgba(51,51,51);
    function visit(n,depth,base,inFloating){
      var src=n._source||{},local=properties(src.style);
      var role=depth===0?'centralTopic':n._floating?'floatingTopic':depth===1?'mainTopic':'subTopic';
      var style=merge(properties(theme.global),properties(theme[role]));
      style=merge(style,local);
      var explicitFill=parse(style['svg:fill']),fill;
      if(depth===0)fill=explicitFill||rgba(13,13,13);
      else if(n._floating)fill=explicitFill||base;
      else if(explicitFill)fill=explicitFill;
      else fill=rgba(base.r,base.g,base.b,depth===1?1:0.2);
      if(style['fill-pattern']==='none')fill=rgba(fill.r,fill.g,fill.b,0);
      if(depth===1 && !n._floating && explicitFill)base=rgba(explicitFill.r,explicitFill.g,explicitFill.b);
      var line=parse(style['line-color'])||base;
      var text=parse(style['fo:color']);
      if(!text){
        if(depth===0 || depth===1)text=contrast(fill);
        else if(inFloating)text=rgba(51,51,51);
        else text=darkText(base);
      }
      var border=parse(style['border-line-color'])||line;
      var bw=parseFloat(style['border-line-width']);if(!isFinite(bw))bw=0;
      var lw=parseFloat(style['line-width']);if(!isFinite(lw))lw=1.5;
      n._color={fill:fill,text:text,line:line,border:border,borderWidth:Math.max(0,bw),lineWidth:Math.max(0,lw)};
      var i,child,next,branchIndex=0;
      for(i=0;i<n.children.length;i++){
        child=n.children[i];next=base;
        if(depth===0){
          if(child._floating)next=parse(properties(theme.floatingTopic)['line-color'])||rgba(51,51,51);
          else{next=parse(palette[branchIndex%Math.max(1,palette.length)])||defaultBase;branchIndex++;}
        }
        visit(child,depth+1,next,inFloating||child._floating);
      }
    }
    visit(root,0,defaultBase,false);
  }
  return {apply:apply,parse:parse};
})();

/* ES3 layout and hierarchy-aware typography for editable XMind imports. */
var XMindAILayout=(function(){
  function props(o){return o&&o.properties?o.properties:{};}
  function sourcePoint(n){var p=n._source.position;if(p&&isFinite(p.x)&&isFinite(p.y))return p;return null;}
  function kids(n){var a=[],i;for(i=0;i<n.children.length;i++)if(!n.children[i]._floating)a.push(n.children[i]);return a;}
  function collect(n,a){a.push(n);for(var i=0;i<n.children.length;i++)collect(n.children[i],a);return a;}
  function wrap(text,units){
    var paragraphs=String(text).replace(/\r\n?/g,'\n').split('\n'),lines=[],p,i,c,line,count,cost,s,tokens,t,j;
    for(p=0;p<paragraphs.length;p++){
      s=paragraphs[p].replace(/\t/g,'  ').replace(/[ ]+$/,'');line='';count=0;
      tokens=s.match(/[A-Za-z0-9][A-Za-z0-9_.,:%\u00d7\/\u2013\u2014+\-]*|[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g)||[];
      for(t=0;t<tokens.length;t++){
        c=tokens[t];cost=0;for(j=0;j<c.length;j++){cost+=c.charCodeAt(j)>255?1:.58;if(c.charCodeAt(j)>=0xd800&&c.charCodeAt(j)<=0xdbff)j++;}
        if(cost<=units){if(count+cost>units&&line.length){lines.push(line);line='';count=0;}line+=c;count+=cost;}
        else for(i=0;i<c.length;i++){var ch=c.charAt(i),v=c.charCodeAt(i)>255?1:.58;if(count+v>units&&line.length){lines.push(line);line='';count=0;}line+=ch;count+=v;if(c.charCodeAt(i)>=0xd800&&c.charCodeAt(i)<=0xdbff&&i+1<c.length)line+=c.charAt(++i);}
      }
      lines.push(line);
    }
    return lines.join('\r');
  }
  function configure(n,sheet,opts){
    var theme=sheet.theme||{},role='subTopic';
    if(n._depth===0)role='centralTopic';else if(n._floating)role='floatingTopic';else if(n._depth===1)role='mainTopic';
    var local=props(n._source.style),style=props(theme[role]),body=parseFloat(props(theme.subTopic)['fo:font-size'])||14;
    var original=parseFloat(local['fo:font-size'])||parseFloat(style['fo:font-size'])||body;
    var scale=opts.size/body,raw=n._source.title||n._source.plainTitle||n.title;
    if(opts.layoutMode===0){
      n.fontSize=original*scale;n.padX=14*scale;n.padY=10*scale;
      var width=Number(n._source.customWidth);if(!(width>0)){width=300;if(n._depth===0)width=600;else if(n._depth===1)width=360;}
      n.maxWidth=Math.max(n.fontSize*4,width*scale);n.leading=1.25;
    }else{
      n.fontSize=opts.size;if(n._depth===0)n.fontSize=opts.size*1.8;else if(n._depth===1)n.fontSize=opts.size*1.4;else if(kids(n).length)n.fontSize=opts.size*1.12;
      n.padX=18;n.padY=12;n.leading=1.35;
      n.maxWidth=opts.size*32;if(n._depth<2)n.maxWidth=opts.size*28;
      if(opts.smartStyle===1&&n._depth>=2)n.maxWidth=Math.max(opts.size*10,opts.size*30-Math.max(0,n._depth-2)*18);
    }
    n.units=Math.max(4,(n.maxWidth-n.padX)/n.fontSize);n.rawTitle=String(raw);n.label=wrap(n.rawTitle,n.units);n._scale=scale;
    n.leftAlign=opts.layoutMode===1&&(opts.smartStyle===1||n._depth>=2);
  }
  function directions(model,attached){
    var result=[],root=model.root,ext=(root._source.extensions||[]).concat(model.sheet.extensions||[]),rightCount=-1,i,j,structure=root._source.structureClass||'',p;
    for(i=0;i<ext.length;i++)for(j=0;j<(ext[i].content||[]).length;j++)if(ext[i].content[j].name==='right-number')rightCount=parseInt(ext[i].content[j].content,10);
    if(rightCount<0)rightCount=Math.ceil(attached.length/2);
    if(/logic\.right/.test(structure))rightCount=attached.length;if(/logic\.left/.test(structure))rightCount=0;
    var usedRight=0,usedLeft=0;
    for(i=0;i<attached.length;i++){p=sourcePoint(attached[i]);if(p&&Math.abs(Number(p.x))>.01){result[i]=p.x<0?-1:1;if(result[i]>0)usedRight++;else usedLeft++;}}
    for(i=0;i<attached.length;i++)if(!result[i]){if(usedRight<rightCount){result[i]=1;usedRight++;}else{result[i]=-1;usedLeft++;}}
    return result;
  }
  function treePosition(model){
    var root=model.root,original=model.opts.layoutMode===0,scale=root._scale||model.opts.size/14,gap=48,vgap=10,points=[],all=collect(root,[]),floating=[],attached=kids(root),i;
    if(original){gap=28*scale;vgap=8*scale;}
    function span(n){var a=kids(n),total=0,j;for(j=0;j<a.length;j++)total+=span(a[j]);if(a.length>1)total+=vgap*(a.length-1);n.span=Math.max(n.h,total);return n.span;}
    for(i=0;i<all.length;i++)if(all[i]!==root&&all[i]._floating)floating.push(all[i]);
    span(root);for(i=0;i<floating.length;i++)span(floating[i]);
    var dirs=directions(model,attached),left=[],right=[],lh=0,rh=0;
    for(i=0;i<attached.length;i++){
      var dir=dirs[i];
      if(!original){if(model.opts.direction===2)dir=1;else if(model.opts.direction===1){dir=rh<=lh?1:-1;}}
      if(dir>0){right.push(attached[i]);rh+=attached[i].span+vgap;}else{left.push(attached[i]);lh+=attached[i].span+vgap;}
    }
    function place(n,dir,y,edge){
      n.x=edge+dir*(gap+n.w/2);n.y=y;n.dir=dir;n._flow='tree';points.push(n);
      var a=kids(n),total=0,j,cursor;for(j=0;j<a.length;j++)total+=a[j].span;total+=vgap*Math.max(0,a.length-1);cursor=y+total/2;
      for(j=0;j<a.length;j++){place(a[j],dir,cursor-a[j].span/2,n.x+dir*n.w/2);cursor-=a[j].span+vgap;}
    }
    function shift(n,dx,dy){n.x+=dx;n.y+=dy;var a=kids(n);for(var j=0;j<a.length;j++)shift(a[j],dx,dy);}
    function side(a,dir){
      var total=0,j,cursor,offsets=[],offset=0,p;for(j=0;j<a.length;j++)total+=a[j].span;total+=vgap*Math.max(0,a.length-1);cursor=total/2;
      for(j=0;j<a.length;j++){place(a[j],dir,cursor-a[j].span/2,dir*root.w/2);cursor-=a[j].span+vgap;if(original){p=sourcePoint(a[j]);if(p)offsets.push(-Number(p.y)*scale-a[j].y);}}
      if(offsets.length){offsets.sort(function(x,y){return x-y;});offset=offsets[Math.floor(offsets.length/2)];for(j=0;j<a.length;j++)shift(a[j],0,offset);}
    }
    root.x=0;root.y=0;root.dir=0;root._flow='tree';points.push(root);side(right,1);side(left,-1);
    var maxX=root.w/2,maxY=root.h/2;for(i=0;i<points.length;i++){maxX=Math.max(maxX,points[i].x+points[i].w/2);maxY=Math.max(maxY,points[i].y+points[i].h/2);}
    for(i=0;i<floating.length;i++){
      var f=floating[i];f.x=maxX+100+f.w/2;f.y=maxY-f.h/2;f.dir=1;f._flow='tree';points.push(f);
      var a=kids(f),block=0,j,cursor;for(j=0;j<a.length;j++)block+=a[j].span;block+=vgap*Math.max(0,a.length-1);cursor=f.y+block/2;
      for(j=0;j<a.length;j++){place(a[j],1,cursor-a[j].span/2,f.x+f.w/2);cursor-=a[j].span+vgap;}
      maxX=f.x+f.w/2+400;
    }
    model.savedPositions=0;
    if(original){
      var rootPoint=sourcePoint(root),rx=rootPoint?Number(rootPoint.x):0,ry=rootPoint?Number(rootPoint.y):0;
      function anchors(n){var p=sourcePoint(n),j;if(p&&n!==root){shift(n,(Number(p.x)-rx)*scale-n.x,-(Number(p.y)-ry)*scale-n.y);model.savedPositions++;}for(j=0;j<n.children.length;j++)anchors(n.children[j]);}
      anchors(root);
      /* Keep saved anchors fixed; gently move inferred nodes when font metrics cause overlaps. */
      var lookup={},pass,changed,mover,blocker,ax,ay,bx,by,candidates,best,cost,bestCost,q,z,candidate,valid;
      for(i=0;i<points.length;i++)lookup[points[i]._key]=points[i];model.positionAdjustments=0;
      function overlaps(n,x,y,o){return Math.min(x+n.w/2,o.x+o.w/2)-Math.max(x-n.w/2,o.x-o.w/2)>1&&Math.min(y+n.h/2,o.y+o.h/2)-Math.max(y-n.h/2,o.y-o.h/2)>1;}
      for(pass=0;pass<80;pass++){
        changed=false;
        for(i=0;i<points.length&&!changed;i++)for(j=i+1;j<points.length&&!changed;j++){
          ax=points[i];ay=points[j];if(!overlaps(ax,ax.x,ax.y,ay))continue;mover=null;blocker=null;
          if(ax!==root&&!sourcePoint(ax)){mover=ax;blocker=ay;}if(ay!==root&&!sourcePoint(ay)&&(!mover||ay._depth>=mover._depth)){mover=ay;blocker=ax;}if(!mover)continue;
          var parent=lookup[mover._parent],space=5*scale;
          candidates=[[mover.x,blocker.y+(blocker.h+mover.h)/2+space],[mover.x,blocker.y-(blocker.h+mover.h)/2-space],[blocker.x+(blocker.w+mover.w)/2+space,mover.y],[blocker.x-(blocker.w+mover.w)/2-space,mover.y]];best=null;bestCost=Infinity;
          for(q=0;q<candidates.length;q++){
            candidate=candidates[q];valid=true;if(parent&&mover.dir>0&&candidate[0]-mover.w/2<parent.x+parent.w/2+5)valid=false;if(parent&&mover.dir<0&&candidate[0]+mover.w/2>parent.x-parent.w/2-5)valid=false;
            if(valid)for(z=0;z<points.length;z++)if(points[z]!==mover&&overlaps(mover,candidate[0],candidate[1],points[z])){valid=false;break;}
            if(valid){cost=Math.abs(candidate[0]-mover.x)*1.2+Math.abs(candidate[1]-mover.y);if(cost<bestCost){best=candidate;bestCost=cost;}}
          }
          if(best){mover.x=best[0];mover.y=best[1];model.positionAdjustments++;changed=true;}
        }
        if(!changed)break;
      }
    }
    return points;
  }
  function flatPosition(model){
    var root=model.root,sections=root.children.slice(0),points=[root],i,j,k,indent=18,cardGap=30,sectionGap=70,cardWidth=model.opts.size*30,sectionModels=[],maxWidth=0;
    var all=collect(root,[]);for(i=0;i<all.length;i++)if(all[i]!==root&&all[i]._floating&&all[i]._parent!==root._key)sections.push(all[i]);
    function card(n){
      var a=[],cursor=0,max=0,depth=n._depth;
      function walk(item){item.x=(item._depth-depth)*indent+item.w/2;item.y=-cursor-item.h/2;item.dir=1;item._flow='outline';a.push(item);max=Math.max(max,item.x+item.w/2);cursor+=item.h+8;var ch=kids(item);for(var q=0;q<ch.length;q++)walk(ch[q]);}
      walk(n);return {nodes:a,width:max,height:Math.max(0,cursor-8)};
    }
    for(i=0;i<sections.length;i++){
      var n=sections[i],children=kids(n),cards=[],cw=cardWidth;
      for(j=0;j<children.length;j++){var c=card(children[j]);cards.push(c);cw=Math.max(cw,c.width);}
      var cols=Math.min(3,Math.max(1,cards.length)),section={root:n,nodes:[n],height:n.h,width:Math.max(n.w,cols*cw+(cols-1)*cardGap)};
      n.x=n.w/2;n.y=-n.h/2;n.dir=1;n._flow='section';var columnHeights=[];for(k=0;k<cols;k++)columnHeights[k]=n.h+30;
      for(j=0;j<cards.length;j++){
        var target=0;for(k=1;k<cols;k++)if(columnHeights[k]<columnHeights[target])target=k;
        c=cards[j];var cx=target*(cw+cardGap),rowTop=-columnHeights[target];
        for(var q=0;q<c.nodes.length;q++){var item=c.nodes[q];item.x+=cx;item.y+=rowTop;section.nodes.push(item);}
        c.nodes[0]._flow='card';c.nodes[0]._railX=cx-12;c.nodes[0]._busY=-n.h-12;columnHeights[target]+=c.height+26;
      }
      if(cards.length){section.height=0;for(k=0;k<cols;k++)section.height=Math.max(section.height,columnHeights[k]-26);}maxWidth=Math.max(maxWidth,section.width);sectionModels.push(section);
    }
    var heights=[0,0],columnCount=sections.length>1?2:1;
    for(i=0;i<sectionModels.length;i++){
      var s=sectionModels[i],col=0;if(columnCount>1&&heights[1]<heights[0])col=1;
      var sx=col*(maxWidth+sectionGap),sy=-heights[col];
      s.root._rootRail=sx-32;s.root._sectionLeft=sx;
      for(j=0;j<s.nodes.length;j++){n=s.nodes[j];n.x+=sx;n.y+=sy;if(n._flow==='card'){n._railX+=sx;n._busY+=sy;}points.push(n);}
      heights[col]+=s.height+44;
    }
    root.x=(columnCount*maxWidth+(columnCount-1)*sectionGap)/2;root.y=root.h/2+54;root.dir=0;root._flow='header';
    model.savedPositions=0;return points;
  }
  function position(model){if(model.opts.layoutMode===1&&model.opts.smartStyle===1&&!model.detail)return flatPosition(model);return treePosition(model);}
  function color(c){var v=new RGBColor();v.red=c.r;v.green=c.g;v.blue=c.b;return v;}
  function drawLinks(layer,model,points){
    var lookup={},ids={},i,n,a,b,p,sp,dir,x0,x1,d;
    for(i=0;i<points.length;i++){n=points[i];lookup[n._key]=n;if(n._source.id)ids['id_'+n._source.id]=n;}
    for(i=1;i<points.length;i++){
      b=points[i];if(b._floating)continue;a=lookup[b._parent];if(!a)continue;dir=b.dir||1;
      p=layer.pathItems.add();p.name='层级：'+a.title+' → '+b.title;p.note='XMind parent='+String(a._source.id||a._key)+';child='+String(b._source.id||b._key);
      if(b._flow==='outline'){
        x0=a.x-a.w/2+8;sp=[[x0,a.y-a.h/2],[x0,b.y],[b.x-b.w/2,b.y]];
      }else if(b._flow==='card'){
        var outside=a._sectionLeft-14;sp=[[a.x-a.w/2,a.y],[outside,a.y],[outside,b._busY],[b._railX,b._busY],[b._railX,b.y],[b.x-b.w/2,b.y]];
      }else if(b._flow==='section'){
        var bus=model.root.y-model.root.h/2-18;sp=[[a.x,a.y-a.h/2],[a.x,bus],[b._rootRail,bus],[b._rootRail,b.y],[b.x-b.w/2,b.y]];
      }else{
        x0=a.x+a.w/2*dir;x1=b.x-b.w/2*dir;
        if(model.opts.layoutMode===0&&a!==model.root){var mid=(x0+x1)/2;sp=[[x0,a.y],[mid,a.y],[mid,b.y],[x1,b.y]];}
        else sp=[[x0,a.y],[x1,b.y]];
      }
      p.setEntirePath(sp);p.closed=false;p.filled=false;p.stroked=b._color.line.a>0&&b._color.lineWidth>0;p.strokeColor=color(b._color.line);p.strokeWidth=Math.max(.1,b._color.lineWidth);p.opacity=b._color.line.a*100;
      if(sp.length===2){d=Math.max(15,Math.abs(sp[1][0]-sp[0][0])*.48);p.pathPoints[0].leftDirection=sp[0];p.pathPoints[0].rightDirection=[sp[0][0]+dir*d,sp[0][1]];p.pathPoints[1].leftDirection=[sp[1][0]-dir*d,sp[1][1]];p.pathPoints[1].rightDirection=sp[1];}
    }
    model.relationshipCount=0;var relationships=model.sheet.relationships||[],theme=props((model.sheet.theme||{}).relationship),scale=model.opts.size/(parseFloat(props((model.sheet.theme||{}).subTopic)['fo:font-size'])||14);
    for(i=0;i<relationships.length;i++){
      var rel=relationships[i];a=ids['id_'+rel.end1Id];b=ids['id_'+rel.end2Id];if(!a||!b)continue;
      var local=props(rel.style),lc=XMindAIColors.parse(local['line-color'])||XMindAIColors.parse(theme['line-color'])||{r:51,g:51,b:51,a:1};
      dir=b.x>=a.x?1:-1;var start=[a.x+dir*a.w/2,a.y],end=[b.x-dir*b.w/2,b.y],delta=(end[0]-start[0])*.45,c0=[start[0]+delta,start[1]],c1=[end[0]-delta,end[1]],cp=rel.controlPoints;
      if(model.opts.layoutMode===0&&cp&&cp['0']&&cp['1']){c0=[start[0]+Number(cp['0'].x)*scale,start[1]-Number(cp['0'].y)*scale];c1=[end[0]+Number(cp['1'].x)*scale,end[1]-Number(cp['1'].y)*scale];}
      p=layer.pathItems.add();p.name='关系：'+a.title+' → '+b.title;p.setEntirePath([start,end]);p.closed=false;p.filled=false;p.stroked=true;p.strokeWidth=parseFloat(local['line-width'])||parseFloat(theme['line-width'])||1.5;p.strokeColor=color(lc);p.opacity=lc.a*100;
      if((local['line-pattern']||theme['line-pattern'])==='dash')p.strokeDashes=[5,3];p.pathPoints[0].leftDirection=start;p.pathPoints[0].rightDirection=c0;p.pathPoints[1].leftDirection=c1;p.pathPoints[1].rightDirection=end;
      var arrowClass=local['arrow-end-class']||theme['arrow-end-class']||'';
      if(/triangle/.test(arrowClass)){
        var angle=Math.atan2(end[1]-c1[1],end[0]-c1[0]),len=7*Math.max(.7,model.opts.size/14),wide=len*.5,ux=Math.cos(angle),uy=Math.sin(angle),arrow=layer.pathItems.add();arrow.name='关系箭头';arrow.setEntirePath([end,[end[0]-len*ux+wide*uy,end[1]-len*uy-wide*ux],[end[0]-len*ux-wide*uy,end[1]-len*uy+wide*ux]]);arrow.closed=true;arrow.stroked=false;arrow.filled=true;arrow.fillColor=color(lc);arrow.opacity=lc.a*100;
      }
      model.relationshipCount++;
    }
  }
  return {configure:configure,wrap:wrap,position:position,drawLinks:drawLinks,sourcePoint:sourcePoint};
})();

/* Four interface languages; source topic text is never translated. */
var XMindAILocale=(function(){
  var data={
    zh:{title:'Import XMind',subtitle:'可编辑导图，按你的方式呈现。',file:'文件',choose:'选择…',chooseFile:'选择 XMind 文件',emptyFile:'尚未选择 .xmind 文件',sheet:'工作表',layoutTab:'排版',styleTab:'外观',font:'字体',search:'输入字体名称进行筛选',bodySize:'正文字号',sizeHint:'标题按层级放大',layout:'版面',layoutItems:['原图版面','智能排版'],smart:'智能样式',smartItems:['层级清晰','扁平分栏'],direction:'方向',directionItems:['沿用原图','左右均衡','全部向右'],originalHelp:'保留方向和已存坐标；无坐标部分按原结构补排。',flatHelp:'分栏阅读，按层级缩进，加宽长文字。',treeHelp:'层级字号、宽文本与紧凑间距。',palette:'节点配色',paletteItems:['保留原色','蓝色','绿色','橙色','紫色','灰色','自定义'],text:'文字颜色',textItems:['自动 / 保留原色','深灰','黑色','白色'],background:'背景',backgroundItems:['白色','黑色','透明','输入色号'],pick:'选色',hex:'六位色号，例如 #3366CC',backgroundHex:'六位色号，例如 #F5F5F5',previewTitle:'预览',preview:'预览',language:'语言',cancel:'取消',importButton:'导入',chooseHint:'选择一个 XMind 文件即可开始。',disabledPreview:'预览已关闭',disabledHelp:'左下角勾选“预览”后，设置会自动更新。',emptyPreview:'选择 XMind 文件',loading:'正在生成预览…',ready:'{count} 个主题 · {size} pt · {layout}',loaded:'{count} 个主题已加载',dirty:'设置已更改',invalid:'请检查设置：{error}',previewFailed:'预览暂不可用：{error}',readFailed:'无法读取 XMind 文件。',noFonts:'没有匹配的字体，请调整筛选。',sizeError:'字号请输入 6–72 之间的数值。',colorError:'主色请输入六位色号，例如 #3366CC。',bgError:'背景请输入六位色号，例如 #202020。',fontError:'请选择可用字体。',noSheet:'请先选择 XMind 文件。',cacheError:'无法创建预览缓存。',pickerError:'请直接输入六位色号。',groupHint:'导入为一个总组，内部保留主题层级。',transparentHint:'棋盘格仅表示透明，不会导入。',success:'已导入 {count} 个主题，保存在一个总组中。',failed:'导入失败：{error}',group:'主题层级',content:'主题内容',links:'连接线与关系',bgGroup:'背景',bgItem:'导图底色',close:'关闭',sourceError:'文件中没有可导入的工作表。'},
    en:{title:'Import XMind',subtitle:'Editable maps, arranged your way.',file:'File',choose:'Choose…',chooseFile:'Choose an XMind file',emptyFile:'No .xmind file selected',sheet:'Sheet',layoutTab:'Layout',styleTab:'Appearance',font:'Font',search:'Filter fonts by name',bodySize:'Body size',sizeHint:'Headings scale by level',layout:'Layout',layoutItems:['Original layout','Smart layout'],smart:'Smart style',smartItems:['Clear hierarchy','Compact columns'],direction:'Direction',directionItems:['Follow original','Balanced','Rightward'],originalHelp:'Keeps directions and saved positions. Topics without coordinates follow the original structure.',flatHelp:'Wider text in columns, with indented levels.',treeHelp:'Layered type sizes, wider text and tighter spacing.',palette:'Topic colors',paletteItems:['Original colors','Blue','Green','Orange','Purple','Gray','Custom'],text:'Text color',textItems:['Auto / original','Dark gray','Black','White'],background:'Background',backgroundItems:['White','Black','Transparent','Hex color'],pick:'Color',hex:'Six-digit hex, e.g. #3366CC',backgroundHex:'Six-digit hex, e.g. #F5F5F5',previewTitle:'Preview',preview:'Preview',language:'Language',cancel:'Cancel',importButton:'Import',chooseHint:'Choose an XMind file to get started.',disabledPreview:'Preview is off',disabledHelp:'Enable Preview at the bottom left for automatic updates.',emptyPreview:'Choose an XMind file',loading:'Updating preview…',ready:'{count} topics · {size} pt · {layout}',loaded:'{count} topics loaded',dirty:'Settings changed',invalid:'Check settings: {error}',previewFailed:'Preview unavailable: {error}',readFailed:'Unable to read this XMind file.',noFonts:'No matching font. Adjust the filter.',sizeError:'Enter a font size from 6 to 72.',colorError:'Enter a six-digit topic color, e.g. #3366CC.',bgError:'Enter a six-digit background color, e.g. #202020.',fontError:'Choose an installed font.',noSheet:'Choose an XMind file first.',cacheError:'Unable to create the preview cache.',pickerError:'Enter a six-digit hex color directly.',groupHint:'One import group, with the topic hierarchy preserved inside.',transparentHint:'The checkerboard indicates transparency and is not imported.',success:'Imported {count} topics into one group.',failed:'Import failed: {error}',group:'Topic hierarchy',content:'Topic content',links:'Connections and relationships',bgGroup:'Background',bgItem:'Map background',close:'Close',sourceError:'No supported sheet was found.'},
    ja:{title:'Import XMind',subtitle:'編集できるマップを、見やすいレイアウトで。',file:'ファイル',choose:'選択…',chooseFile:'XMind ファイルを選択',emptyFile:'.xmind ファイルが未選択です',sheet:'シート',layoutTab:'レイアウト',styleTab:'外観',font:'フォント',search:'フォント名で絞り込み',bodySize:'本文サイズ',sizeHint:'見出しは階層に応じて拡大',layout:'配置',layoutItems:['元のレイアウト','スマート配置'],smart:'スタイル',smartItems:['階層を明確に','コンパクトな段組み'],direction:'方向',directionItems:['元の方向に従う','左右に均等','右方向'],originalHelp:'方向と保存済み座標を保持。座標のない項目は元の構造に沿って配置します。',flatHelp:'階層を字下げで示し、長文を段組みで配置します。',treeHelp:'階層別の文字サイズ、広い本文、狭い間隔。',palette:'トピックの色',paletteItems:['元の色','青','緑','オレンジ','紫','グレー','カスタム'],text:'文字色',textItems:['自動 / 元の色','濃いグレー','黒','白'],background:'背景',backgroundItems:['白','黒','透明','色コード'],pick:'色を選択',hex:'6桁の色コード（例：#3366CC）',backgroundHex:'6桁の色コード（例：#F5F5F5）',previewTitle:'プレビュー',preview:'プレビュー',language:'言語',cancel:'キャンセル',importButton:'読み込む',chooseHint:'XMind ファイルを選択してください。',disabledPreview:'プレビューはオフです',disabledHelp:'左下のプレビューをオンにすると、自動で更新されます。',emptyPreview:'XMind ファイルを選択',loading:'プレビューを更新中…',ready:'{count} トピック · {size} pt · {layout}',loaded:'{count} トピックを読み込み済み',dirty:'設定を変更しました',invalid:'設定を確認：{error}',previewFailed:'プレビューを表示できません：{error}',readFailed:'XMind ファイルを読み込めません。',noFonts:'一致するフォントがありません。絞り込みを変更してください。',sizeError:'文字サイズは 6～72 で入力してください。',colorError:'6桁のトピック色を入力してください（例：#3366CC）。',bgError:'6桁の背景色を入力してください（例：#202020）。',fontError:'使用するフォントを選択してください。',noSheet:'先に XMind ファイルを選択してください。',cacheError:'プレビュー用のキャッシュを作成できません。',pickerError:'6桁の色コードを直接入力してください。',groupHint:'全体を1つのグループにまとめ、内部の階層を保持します。',transparentHint:'市松模様は透明の目印で、読み込まれません。',success:'{count} トピックを1つのグループに読み込みました。',failed:'読み込みに失敗しました：{error}',group:'トピック階層',content:'トピックの内容',links:'接続線と関連線',bgGroup:'背景',bgItem:'マップの背景',close:'閉じる',sourceError:'対応するシートが見つかりません。'},
    ko:{title:'Import XMind',subtitle:'편집 가능한 맵을 보기 좋게 배치하세요.',file:'파일',choose:'선택…',chooseFile:'XMind 파일 선택',emptyFile:'선택한 .xmind 파일이 없습니다',sheet:'시트',layoutTab:'레이아웃',styleTab:'모양',font:'글꼴',search:'글꼴 이름으로 검색',bodySize:'본문 크기',sizeHint:'제목은 계층에 따라 확대',layout:'배치',layoutItems:['원본 레이아웃','스마트 배치'],smart:'스타일',smartItems:['명확한 계층','간결한 다단 배치'],direction:'방향',directionItems:['원본 방향 유지','좌우 균형','오른쪽으로'],originalHelp:'방향과 저장된 좌표를 유지합니다. 좌표가 없으면 원본 구조에 맞춰 배치합니다.',flatHelp:'계층은 들여쓰기로 구분하고 긴 글은 다단으로 배치합니다.',treeHelp:'계층별 글자 크기, 넓은 본문, 좁은 간격.',palette:'주제 색상',paletteItems:['원본 색상','파랑','초록','주황','보라','회색','사용자 지정'],text:'글자 색상',textItems:['자동 / 원본','진한 회색','검정','흰색'],background:'배경',backgroundItems:['흰색','검정','투명','색상 코드'],pick:'색상',hex:'6자리 색상 코드, 예: #3366CC',backgroundHex:'6자리 색상 코드, 예: #F5F5F5',previewTitle:'미리 보기',preview:'미리 보기',language:'언어',cancel:'취소',importButton:'가져오기',chooseHint:'XMind 파일을 선택하여 시작하세요.',disabledPreview:'미리 보기가 꺼져 있습니다',disabledHelp:'왼쪽 아래 미리 보기를 켜면 설정이 자동으로 반영됩니다.',emptyPreview:'XMind 파일 선택',loading:'미리 보기 업데이트 중…',ready:'주제 {count}개 · {size} pt · {layout}',loaded:'주제 {count}개를 불러왔습니다',dirty:'설정이 변경되었습니다',invalid:'설정 확인: {error}',previewFailed:'미리 보기를 표시할 수 없습니다: {error}',readFailed:'XMind 파일을 읽을 수 없습니다.',noFonts:'일치하는 글꼴이 없습니다. 검색어를 변경하세요.',sizeError:'글자 크기는 6~72 사이로 입력하세요.',colorError:'6자리 주제 색상을 입력하세요. 예: #3366CC',bgError:'6자리 배경 색상을 입력하세요. 예: #202020',fontError:'사용할 글꼴을 선택하세요.',noSheet:'먼저 XMind 파일을 선택하세요.',cacheError:'미리 보기 캐시를 만들 수 없습니다.',pickerError:'6자리 색상 코드를 직접 입력하세요.',groupHint:'하나의 전체 그룹 안에 주제 계층을 유지합니다.',transparentHint:'체크무늬는 투명 표시이며 가져오지 않습니다.',success:'주제 {count}개를 하나의 그룹으로 가져왔습니다.',failed:'가져오기 실패: {error}',group:'주제 계층',content:'주제 내용',links:'연결선과 관계선',bgGroup:'배경',bgItem:'맵 배경',close:'닫기',sourceError:'지원하는 시트를 찾을 수 없습니다.'}
  };
  function text(lang,key,vars){var value=(data[lang]||data.zh)[key];if(value===undefined)value=data.zh[key];if(vars&&typeof value==='string')for(var k in vars)if(vars.hasOwnProperty(k))value=value.split('{'+k+'}').join(String(vars[k]));return value;}
  function error(lang,message){var map={'字号请输入 6–72 之间的数值。':'sizeError','自定义颜色请输入六位色号，例如 #3366CC。':'colorError','背景颜色请输入六位色号，例如 #202020 或 F5F5F5。':'bgError','请选择可用字体。':'fontError','没有匹配的字体，请修改或清空字体筛选。':'noFonts','文件中没有可导入的工作表。':'sourceError'};return map[message]?text(lang,map[message]):String(message);}
  return {text:text,error:error,data:data,codes:['zh','en','ja','ko'],names:['简体中文','English','日本語','한국어']};
})();

/* Light macOS-inspired ScriptUI. Native dialog remains owned by Illustrator. */
var XMindAIDialog=(function(){
  var colors={window:[.961,.961,.969,1],card:[1,1,1,1],ink:[.114,.114,.122,1],muted:[.49,.49,.51,1],line:[.89,.89,.91,1],accent:[0,.478,1,1],soft:[.93,.95,.98,1],disabled:[.85,.88,.92,1]};
  function font(control,size,bold,lang){
    // Keep button captions on the host's native font and baseline.
    if(control.type==='button')return;
    try{control.graphics.font=ScriptUI.newFont('dialog',bold?ScriptUI.FontStyle.BOLD:ScriptUI.FontStyle.REGULAR,size);}catch(e){}
  }
  function paintText(control,muted){try{var g=control.graphics;g.foregroundColor=g.newPen(g.PenType.SOLID_COLOR,muted?colors.muted:colors.ink,1);g.disabledForegroundColor=g.newPen(g.PenType.SOLID_COLOR,colors.muted,1);}catch(e){}}
  // Container onDraw runs over native descendants in some Illustrator versions.
  // Let ScriptUI paint panels, tabs and buttons; custom painting is for the preview leaf only.
  function card(group){try{var g=group.graphics;g.backgroundColor=g.newBrush(g.BrushType.SOLID_COLOR,colors.card);}catch(e){}}
  function button(parent,text,kind,width,name){
    var b=parent.add('button',undefined,text,name?{name:name}:undefined);b.preferredSize=[width||86,32];b.minimumSize.width=width||86;b.maximumSize.width=width||86;b.alignment=['left','center'];b._kind=kind;
    return b;
  }
  function visible(group,on){group.visible=on;group.maximumSize.height=on?10000:0;group.minimumSize.height=0;group.preferredSize.height=on?-1:0;}
  function create(engine){
    var lang='zh',fontList=engine.fonts(),selectedFont=engine.defaultFont(fontList),filtered=[],sheets=[],source=null,revision=0,topicCount=0,accepted=null;
    var images=null,files=[],serial=0,lastKey='',suppress=0,updating=false,renderCount=0,activePage=0,validSettings=true,statusKind='chooseHint',statusVars={},registry=[],menuRegistry=[];
    var folder=new Folder(Folder.temp.fsName+'/xmai_preview_'+new Date().getTime()+'_'+Math.round(Math.random()*100000));
    function t(key,vars){return XMindAILocale.text(lang,key,vars);}
    function label(parent,key,muted,size,bold){var c=parent.add('statictext',undefined,t(key));registry.push({control:c,key:key,muted:!!muted,size:size||11,bold:!!bold});font(c,size||11,!!bold,lang);paintText(c,muted);return c;}
    function menu(parent,key,width){var m=parent.add('dropdownlist',undefined,t(key));m.selection=0;if(width)m.preferredSize.width=width;menuRegistry.push({control:m,key:key});paintText(m,false);return m;}
    function stackRow(parent){var row=parent.add('group');row.orientation='row';row.alignChildren=['left','center'];row.spacing=8;return row;}
    function registerButton(control,key){registry.push({control:control,key:key,muted:false,size:11,bold:control._kind==='primary'});font(control,11,control._kind==='primary',lang);}
    var dlg=new Window('dialog',t('title'));dlg.orientation='column';dlg.alignChildren='fill';dlg.margins=20;dlg.spacing=14;
    dlg.graphics.backgroundColor=dlg.graphics.newBrush(dlg.graphics.BrushType.SOLID_COLOR,colors.window);
    var header=dlg.add('group');header.orientation='column';header.alignChildren='fill';header.spacing=4;
    label(header,'title',false,20,true);label(header,'subtitle',true,11,false);
    var body=dlg.add('group');body.orientation='row';body.alignChildren=['fill','top'];body.spacing=14;
    var sidebar=body.add('group');sidebar.orientation='column';sidebar.alignChildren='fill';sidebar.preferredSize.width=324;sidebar.minimumSize.width=324;sidebar.maximumSize.width=324;sidebar.spacing=12;
    var fileCard=sidebar.add('panel');fileCard.orientation='column';fileCard.alignChildren='fill';fileCard.margins=14;fileCard.spacing=8;card(fileCard);
    var fileTop=stackRow(fileCard);label(fileTop,'file',false,11,true);var fileSpacer=fileTop.add('group');fileSpacer.alignment=['left','center'];
    var browse=button(fileTop,t('choose'),'secondary',82);registerButton(browse,'choose');
    var fileName=fileCard.add('statictext',undefined,t('emptyFile'),{multiline:true});fileName.preferredSize=[288,34];font(fileName,11,false,lang);paintText(fileName,true);
    var sheetRow=stackRow(fileCard);label(sheetRow,'sheet',true);var sheetMenu=sheetRow.add('dropdownlist',undefined,[]);sheetMenu.preferredSize.width=215;sheetMenu.enabled=false;visible(sheetRow,false);
    var settingCard=sidebar.add('panel');settingCard.orientation='column';settingCard.alignChildren='fill';settingCard.margins=10;settingCard.spacing=10;card(settingCard);
    var pages=settingCard.add('tabbedpanel');pages.alignChildren='fill';pages.preferredSize=[300,366];pages.minimumSize=[300,366];pages.maximumSize=[300,366];
    var layoutPage=pages.add('tab',undefined,t('layoutTab'));layoutPage.orientation='column';layoutPage.alignChildren='fill';layoutPage.spacing=7;layoutPage.margins=8;
    var layoutTab=layoutPage;registry.push({control:layoutTab,key:'layoutTab',muted:false,size:11,bold:false});
    label(layoutPage,'font',true);var search=layoutPage.add('edittext',undefined,'');search.preferredSize.width=288;search.helpTip=t('search');
    var fontMenu=layoutPage.add('dropdownlist',undefined,[]);fontMenu.preferredSize.width=288;
    var sizeRow=stackRow(layoutPage);var sizeLabel=label(sizeRow,'bodySize',true);sizeLabel.preferredSize.width=92;var size=sizeRow.add('edittext',undefined,'12');size.characters=5;sizeRow.add('statictext',undefined,'pt');
    var hintSize=label(layoutPage,'sizeHint',true,10,false);
    var layoutRow=stackRow(layoutPage);var layoutLabel=label(layoutRow,'layout',true);layoutLabel.preferredSize.width=92;var layout=menu(layoutRow,'layoutItems',160);
    var smartRow=stackRow(layoutPage);var smartLabel=label(smartRow,'smart',true);smartLabel.preferredSize.width=92;var smartStyle=menu(smartRow,'smartItems',160);smartStyle.selection=1;
    var directionRow=stackRow(layoutPage);var directionLabel=label(directionRow,'direction',true);directionLabel.preferredSize.width=92;var direction=menu(directionRow,'directionItems',160);
    var layoutHelp=layoutPage.add('statictext',undefined,t('originalHelp'),{multiline:true});layoutHelp.preferredSize=[288,54];font(layoutHelp,10,false,lang);paintText(layoutHelp,true);
    var stylePage=pages.add('tab',undefined,t('styleTab'));stylePage.orientation='column';stylePage.alignChildren='fill';stylePage.spacing=8;stylePage.margins=8;
    var styleTab=stylePage;registry.push({control:styleTab,key:'styleTab',muted:false,size:11,bold:false});pages.selection=layoutPage;
    label(stylePage,'palette',true);var palette=menu(stylePage,'paletteItems',288);
    var customRow=stackRow(stylePage);var custom=customRow.add('edittext',undefined,'#3366CC');custom.preferredSize.width=178;custom.helpTip=t('hex');var picker=button(customRow,t('pick'),'secondary',78);registerButton(picker,'pick');
    label(stylePage,'text',true);var textMode=menu(stylePage,'textItems',288);
    label(stylePage,'background',true);var bgMode=menu(stylePage,'backgroundItems',288);
    var bgCustomRow=stackRow(stylePage);var bgColor=bgCustomRow.add('edittext',undefined,'#F5F5F5');bgColor.preferredSize.width=178;bgColor.helpTip=t('backgroundHex');var bgPicker=button(bgCustomRow,t('pick'),'secondary',78);registerButton(bgPicker,'pick');
    var groupHint=stylePage.add('statictext',undefined,t('groupHint'),{multiline:true});groupHint.preferredSize=[288,38];registry.push({control:groupHint,key:'groupHint',muted:true,size:10,bold:false});font(groupHint,10,false,lang);paintText(groupHint,true);
    var previewCard=body.add('panel');previewCard.orientation='column';previewCard.alignChildren='fill';previewCard.margins=14;previewCard.spacing=10;card(previewCard);
    label(previewCard,'previewTitle',false,11,true);
    var canvasFrame=previewCard.add('group');canvasFrame.orientation='stack';canvasFrame.alignChildren=['center','center'];canvasFrame.preferredSize=[560,420];canvasFrame.minimumSize=[560,420];canvasFrame.maximumSize=[560,420];
    var image=canvasFrame.add('image');image.preferredSize=[560,420];font(image,12,false,lang);
    var emptyState=canvasFrame.add('group');emptyState.orientation='column';emptyState.alignChildren=['center','center'];emptyState.alignment=['center','center'];emptyState.spacing=12;
    var emptyTitle=emptyState.add('statictext',undefined,t('disabledPreview'));emptyTitle.preferredSize=[520,28];emptyTitle.justify='center';font(emptyTitle,12,false,lang);paintText(emptyTitle,true);
    var emptyHelp=emptyState.add('statictext',undefined,t('disabledHelp'),{multiline:true});emptyHelp.preferredSize=[520,48];emptyHelp.justify='center';font(emptyHelp,11,false,lang);paintText(emptyHelp,true);
    var status=previewCard.add('statictext',undefined,t('chooseHint'),{multiline:true});status.preferredSize=[560,36];font(status,10,false,lang);paintText(status,true);
    var footer=dlg.add('group');footer.orientation='column';footer.alignChildren='fill';footer.spacing=10;
    var optionRow=stackRow(footer);optionRow.spacing=10;
    var previewCheck=optionRow.add('checkbox',undefined,t('preview'));previewCheck.value=false;registry.push({control:previewCheck,key:'preview',muted:false,size:11,bold:false});font(previewCheck,11,false,lang);paintText(previewCheck,false);
    var languageLabel=label(optionRow,'language',true,11,false);
    var language=optionRow.add('dropdownlist',undefined,XMindAILocale.names);language.selection=0;language.preferredSize=[134,28];language.minimumSize.width=134;language.maximumSize.width=134;
    var actionRow=stackRow(footer);actionRow.spacing=10;
    var footerSpacer=actionRow.add('group');footerSpacer.alignment=['left','center'];
    var cancel=button(actionRow,t('cancel'),'secondary',104,'cancel'),confirm=button(actionRow,t('importButton'),'primary',112,'ok');registerButton(cancel,'cancel');registerButton(confirm,'importButton');confirm.enabled=false;
    var author=dlg.add('statictext',undefined,'©zbfufo');author.alignment=['right','center'];font(author,10,false,lang);paintText(author,true);
    function setStatus(key,vars,error){statusKind=key;statusVars=vars||{};status.text=t(key,statusVars);paintText(status,true);if(error)try{status.graphics.foregroundColor=status.graphics.newPen(status.graphics.PenType.SOLID_COLOR,[.8,.18,.18,1],1);}catch(e){}}
    image.onDraw=function(){
      var g=this.graphics,w=this.size[0],h=this.size[1],c=[.975,.975,.982,1],x,y,sz=16,enabled=previewCheck.value;
      if(enabled&&images&&images.background)c=[images.background.r/255,images.background.g/255,images.background.b/255,1];
      g.newPath();g.rectPath(0,0,w,h);g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR,c));
      if(enabled&&images){
        if(images.transparent){g.newPath();g.rectPath(0,0,w,h);g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR,[1,1,1,1]));var gray=g.newBrush(g.BrushType.SOLID_COLOR,[.88,.88,.90,1]);for(y=0;y<h;y+=sz)for(x=0;x<w;x+=sz)if((Math.floor(x/sz)+Math.floor(y/sz))%2===0){g.newPath();g.rectPath(x,y,Math.min(sz,w-x),Math.min(sz,h-y));g.fillPath(gray);}}
        var iw=images.overview.size[0],ih=images.overview.size[1];g.drawImage(images.overview,Math.round((w-iw)/2),Math.round((h-ih)/2));
      }
    };
    var lastExpanded=null;
    function arrange(){
      var expanded=!!previewCheck.value,bodyWidth=expanded?930:324;
      previewCard.visible=expanded;previewCard.minimumSize=[expanded?592:0,0];previewCard.maximumSize=[expanded?592:0,expanded?10000:0];previewCard.preferredSize=[expanded?592:0,expanded?-1:0];
      body.spacing=expanded?14:0;body.minimumSize.width=bodyWidth;body.maximumSize.width=bodyWidth;body.preferredSize.width=bodyWidth;
      dlg.minimumSize.width=0;dlg.maximumSize.width=10000;dlg.preferredSize.width=bodyWidth+40;dlg.size=[bodyWidth+40,dlg.size?dlg.size[1]:720];
      image.visible=expanded&&!!images;emptyState.visible=expanded&&!images;
      emptyTitle.text=t(expanded?'emptyPreview':'disabledPreview');emptyHelp.text=t(expanded?'chooseHint':'disabledHelp');
      font(emptyTitle,12,false,lang);font(emptyHelp,11,false,lang);
      // Native controls cache their initial text width across language changes.
      // Measure the current caption and reserve the checkbox glyph separately.
      var previewWidth=Math.max(84,Math.ceil(previewCheck.graphics.measureString(previewCheck.text,previewCheck.graphics.font)[0])+32);
      previewCheck.minimumSize.width=previewWidth;previewCheck.maximumSize.width=previewWidth;previewCheck.preferredSize.width=previewWidth;
      var languageWidth=Math.max(30,Math.ceil(languageLabel.graphics.measureString(languageLabel.text,languageLabel.graphics.font)[0])+8);
      languageLabel.minimumSize.width=languageWidth;languageLabel.maximumSize.width=languageWidth;languageLabel.preferredSize.width=languageWidth;
      footerSpacer.minimumSize.width=0;footerSpacer.maximumSize.width=0;footerSpacer.preferredSize.width=0;
      fileSpacer.minimumSize.width=0;fileSpacer.maximumSize.width=0;fileSpacer.preferredSize.width=0;
      dlg.layout.layout(true);
      // ScriptUI does not reliably allocate horizontal fill space in rows.
      var footerGap=Math.max(0,bodyWidth-104-112-actionRow.spacing*2);
      footerSpacer.minimumSize.width=footerGap;footerSpacer.maximumSize.width=footerGap;footerSpacer.preferredSize.width=footerGap;
      var fileGap=Math.max(0,fileTop.size[0]-fileTop.children[0].size[0]-browse.size[0]-fileTop.spacing*2);
      fileSpacer.minimumSize.width=fileGap;fileSpacer.maximumSize.width=fileGap;fileSpacer.preferredSize.width=fileGap;
      dlg.layout.layout(true);
      var totalHeight=header.size[1]+body.size[1]+footer.size[1]+author.size[1]+dlg.spacing*3+40;
      dlg.size=[bodyWidth+40,totalHeight];dlg.layout.resize();
      if(lastExpanded!==expanded){dlg.center();lastExpanded=expanded;}
      dlg.update();
    }
    function updateVisibility(){visible(smartRow,layout.selection.index===1);visible(directionRow,layout.selection.index===1&&smartStyle.selection.index===0);visible(customRow,palette.selection.index===6);visible(bgCustomRow,bgMode.selection.index===3);if(layout.selection.index===0)layoutHelp.text=t('originalHelp');else layoutHelp.text=t(smartStyle.selection.index===1?'flatHelp':'treeHelp');}
    function setPage(index){activePage=index===1?1:0;pages.selection=activePage===0?layoutPage:stylePage;arrange();}
    function options(){if(!filtered.length)throw new Error(t('noFonts'));return engine.validate({size:Number(size.text),fontName:selectedFont,layoutMode:layout.selection.index,smartStyle:smartStyle.selection.index,direction:direction.selection.index,palette:palette.selection.index,custom:custom.text,textMode:textMode.selection.index,bgMode:bgMode.selection.index,bgColor:bgColor.text,lang:lang});}
    function sheet(){if(!sheetMenu.selection||!sheets.length)throw new Error(t('noSheet'));return sheets[sheetMenu.selection.index];}
    function key(opts){return [revision,sheetMenu.selection.index,opts.fontName,opts.size,opts.layoutMode,opts.smartStyle,opts.direction,opts.palette,opts.custom,opts.textMode,opts.bgMode,opts.bgColor].join('|');}
    function busy(on){sidebar.enabled=!on;previewCheck.enabled=!on;language.enabled=!on;cancel.enabled=!on;confirm.enabled=!on&&!!source&&validSettings;}
    function goodStatus(opts){var vars={count:topicCount,size:opts.size,layout:t('layoutItems')[opts.layoutMode]};if(previewCheck.value){setStatus('ready',vars);if(opts.bgMode===2)status.text+='\n'+t('transparentHint');}else setStatus('loaded',{count:topicCount});}
    function requestPreview(force){
      if(suppress||updating)return false;var opts;
      try{opts=options();validSettings=true;confirm.enabled=!!source;}catch(e){validSettings=false;confirm.enabled=false;if(source)setStatus('invalid',{error:XMindAILocale.error(lang,e.message)},true);return false;}
      if(!source){setStatus('chooseHint');arrange();return true;}
      if(!previewCheck.value){goodStatus(opts);arrange();return true;}
      var current=key(opts);if(!force&&images&&lastKey===current){goodStatus(opts);arrange();return true;}
      updating=true;busy(true);setStatus('loading');dlg.update();
      try{
        if(!folder.exists&&!folder.create())throw new Error(t('cacheError'));
        var model=engine.makeModel(sheet(),opts),next=engine.preview(model,folder,++serial);
        images=next;files=files.concat(next.files);image.image=next.overview;lastKey=current;renderCount++;topicCount=model.count;goodStatus(opts);return true;
      }catch(e){setStatus('previewFailed',{error:XMindAILocale.error(lang,e.message)},true);return false;}
      finally{updating=false;busy(false);arrange();}
    }
    function updateFonts(){
      var query=search.text.toLowerCase(),i,index=-1;suppress++;fontMenu.removeAll();filtered=[];
      for(i=0;i<fontList.length;i++)if(!query||fontList[i].label.toLowerCase().indexOf(query)>=0){if(fontList[i].name===selectedFont)index=filtered.length;filtered.push(fontList[i]);fontMenu.add('item',fontList[i].label);}
      if(filtered.length){if(index<0)index=0;fontMenu.selection=index;selectedFont=filtered[index].name;fontMenu.enabled=true;}else fontMenu.enabled=false;suppress--;
    }
    function countTopics(n){var count=1,ch=n.children||{},a=ch instanceof Array?ch:(ch.attached||[]).concat(ch.detached||[]);for(var i=0;i<a.length;i++)count+=countTopics(a[i]);return count;}
    function load(file){
      var next=engine.readFile(file),i;suppress++;sheets=next;source=file;revision++;lastKey='';images=null;
      fileName.text=File.decode(file.name);fileName.helpTip=file.fsName;paintText(fileName,false);sheetMenu.removeAll();
      for(i=0;i<sheets.length;i++)sheetMenu.add('item',(i+1)+'. '+(sheets[i].title||(sheets[i].rootTopic||sheets[i].root).title));sheetMenu.selection=0;sheetMenu.enabled=true;visible(sheetRow,sheets.length>1);topicCount=countTopics(sheets[0].rootTopic||sheets[0].root);suppress--;
      requestPreview(true);return true;
    }
    function change(){if(suppress)return;updateVisibility();requestPreview(false);}
    function fillMenu(m,items){var selected=m.selection?m.selection.index:0;m.removeAll();for(var i=0;i<items.length;i++)m.add('item',items[i]);m.selection=Math.min(selected,items.length-1);}
    function localize(code){
      if(!XMindAILocale.data[code])code='zh';suppress++;lang=code;dlg.text=t('title');var i,r;
      for(i=0;i<registry.length;i++){
        r=registry[i];r.control.text=t(r.key);font(r.control,r.size,r.bold,lang);paintText(r.control,r.muted);
        if(r.control.type==='statictext'&&r.key!=='groupHint'&&r.control!==sizeLabel&&r.control!==layoutLabel&&r.control!==smartLabel&&r.control!==directionLabel){
          r.control.preferredSize.width=Math.ceil(r.control.graphics.measureString(r.control.text,r.control.graphics.font)[0])+6;
        }
      }
      for(i=0;i<menuRegistry.length;i++)fillMenu(menuRegistry[i].control,t(menuRegistry[i].key));
      if(!source)fileName.text=t('emptyFile');font(fileName,11,false,lang);font(layoutHelp,10,false,lang);font(status,10,false,lang);font(image,12,false,lang);
      search.helpTip=t('search');custom.helpTip=t('hex');bgColor.helpTip=t('backgroundHex');language.helpTip=t('language');
      for(i=0;i<XMindAILocale.codes.length;i++)if(XMindAILocale.codes[i]===lang)language.selection=i;
      updateVisibility();suppress--;
      if(source){try{goodStatus(options());}catch(e){setStatus('invalid',{error:XMindAILocale.error(lang,e.message)},true);}}else setStatus('chooseHint');arrange();
    }
    function pickColor(edit){if(typeof $.colorPicker!=='function'){alert(t('pickerError'));return;}var value=$.colorPicker();if(value>=0){var h=value.toString(16);while(h.length<6)h='0'+h;edit.text='#'+h.toUpperCase();requestPreview(false);}}
    browse.onClick=function(){var file=File.openDialog(t('chooseFile'),'XMind:*.xmind');if(file)try{load(file);}catch(e){alert(t('readFailed')+'\n'+XMindAILocale.error(lang,e.message));}};
    sheetMenu.onChange=function(){if(!suppress&&source&&sheetMenu.selection){topicCount=countTopics(sheet().rootTopic||sheet().root);requestPreview(false);}};
    search.onChanging=updateFonts;search.onChange=function(){requestPreview(false);};
    fontMenu.onChange=function(){if(!suppress&&fontMenu.selection&&filtered[fontMenu.selection.index]){selectedFont=filtered[fontMenu.selection.index].name;requestPreview(false);}};
    size.onChange=change;layout.onChange=change;smartStyle.onChange=change;direction.onChange=change;palette.onChange=change;textMode.onChange=change;bgMode.onChange=change;custom.onChange=change;bgColor.onChange=change;
    picker.onClick=function(){pickColor(custom);};bgPicker.onClick=function(){pickColor(bgColor);};
    previewCheck.onClick=function(){requestPreview(false);};language.onChange=function(){if(!suppress&&language.selection)localize(XMindAILocale.codes[language.selection.index]);};
    pages.onChange=function(){activePage=pages.selection===stylePage?1:0;};
    confirm.onClick=function(){try{var result={sheet:sheet(),opts:options()};engine.makeModel(result.sheet,result.opts);accepted=result;dlg.close(1);}catch(e){alert(XMindAILocale.error(lang,e.message));}};
    function cleanup(){image.visible=false;images=null;for(var i=0;i<files.length;i++)try{files[i].remove();}catch(e){}if(folder.exists)try{folder.remove();}catch(e){}}
    updateFonts();updateVisibility();font(cancel,11,false,lang);font(confirm,11,true,lang);paintText(search,false);paintText(size,false);paintText(custom,false);paintText(bgColor,false);paintText(fontMenu,false);paintText(sheetMenu,false);paintText(language,false);arrange();dlg.center();
    return {window:dlg,load:load,cleanup:cleanup,getResult:function(){return accepted;},getLanguage:function(){return lang;},setLanguage:localize,setPage:setPage,fontList:fontList,previewFolder:folder,previewStats:function(){return {renders:renderCount,enabled:previewCheck.value,lastKey:lastKey,language:lang};},controls:{browse:browse,fileName:fileName,sheet:sheetMenu,font:fontMenu,search:search,size:size,layout:layout,smartStyle:smartStyle,direction:direction,palette:palette,custom:custom,picker:picker,textMode:textMode,bgMode:bgMode,bgColor:bgColor,bgPicker:bgPicker,preview:previewCheck,languageLabel:languageLabel,language:language,confirm:confirm,cancel:cancel,image:image,status:status,previewPanel:previewCard,previewMessage:emptyTitle,previewHelp:emptyHelp,layoutTab:layoutTab,styleTab:styleTab,layoutHelp:layoutHelp,author:author}};
  }
  return {create:create,colors:colors};
})();

/* XMind import settings, native Illustrator rendering and isolated previews. ES3. */
var XMindAIImporter = (function () {
  function readFile(file){
    if(file.length>128*1024*1024)throw new Error('此版本支持 128 MB 以内的 XMind 文件。');
    file.encoding='BINARY';if(!file.open('r'))throw new Error('无法读取所选文件。');
    var bytes;try{bytes=file.read();}finally{file.close();}
    var sheets=XMindAIReader.read(bytes),valid=[],i;
    if(!(sheets instanceof Array))sheets=[sheets];
    for(i=0;i<sheets.length;i++)if(sheets[i]&&(sheets[i].rootTopic||sheets[i].root))valid.push(sheets[i]);
    if(!valid.length)throw new Error('文件中没有可导入的工作表。');return valid;
  }
  function clean(s){return String(s||'未命名主题').replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ');}
  function wrap(s){var lines=[],line='',units=0,i,ch,cost;for(i=0;i<s.length;i++){ch=s.charAt(i);cost=s.charCodeAt(i)>255?1:0.58;if(units+cost>14&&line.length){lines.push(line);line='';units=0;}line+=ch;units+=cost;if(s.charCodeAt(i)>=0xd800&&s.charCodeAt(i)<=0xdbff&&i+1<s.length)line+=s.charAt(++i);}if(line.length)lines.push(line);return lines.join('\r');}
  function rgba(r,g,b,a){return {r:r,g:g,b:b,a:a===undefined?1:a};}
  function rgb(c){var value=new RGBColor();value.red=c.r;value.green=c.g;value.blue=c.b;return value;}
  function contrast(c){if(c.r*.299+c.g*.587+c.b*.114>153)return rgba(40,40,40);return rgba(255,255,255);}
  function backgroundColor(opts){if(opts.bgMode===2)return null;if(opts.bgMode===1)return rgba(0,0,0);if(opts.bgMode===3)return XMindAIColors.parse(opts.bgColor);return rgba(255,255,255);}
  function validate(opts){
    if(!isFinite(opts.size)||opts.size<6||opts.size>72)throw new Error('字号请输入 6–72 之间的数值。');
    if(opts.palette===6&&!/^#[0-9a-fA-F]{6}$/.test(opts.custom))throw new Error('自定义颜色请输入六位色号，例如 #3366CC。');
    if(opts.bgMode===undefined)opts.bgMode=0;
    if(opts.bgColor===undefined)opts.bgColor='#F5F5F5';
    opts.bgColor=String(opts.bgColor).replace(/^\s+|\s+$/g,'');
    if(/^[0-9a-fA-F]{6}$/.test(opts.bgColor))opts.bgColor='#'+opts.bgColor;
    if(opts.bgMode===3&&!/^#[0-9a-fA-F]{6}$/.test(opts.bgColor))throw new Error('背景颜色请输入六位色号，例如 #202020 或 F5F5F5。');
    if(opts.layoutMode===undefined)opts.layoutMode=0;if(opts.smartStyle===undefined)opts.smartStyle=1;if(opts.direction===undefined)opts.direction=0;
    if(!opts.fontName)throw new Error('请选择可用字体。');return opts;
  }
  function makeModel(sheet,opts){
    validate(opts);var count=0;
    function normalize(src,depth,floating,parent){
      if(depth>200)throw new Error('主题层级超过 200 层。');
      if(++count>5000)throw new Error('此版本一次最多导入 5000 个主题。');
      var n={title:clean(src.title||src.plainTitle),children:[],_source:src,_key:'n'+count,_parent:parent,_floating:!!floating,_depth:depth},i,ch=src.children||{},a;
      if(ch instanceof Array){for(i=0;i<ch.length;i++)n.children.push(normalize(ch[i],depth+1,false,n._key));}
      else{
        a=ch.attached||[];for(i=0;i<a.length;i++)n.children.push(normalize(a[i],depth+1,false,n._key));
        a=ch.detached||[];for(i=0;i<a.length;i++)n.children.push(normalize(a[i],depth+1,true,n._key));
      }
      XMindAILayout.configure(n,sheet,opts);return n;
    }
    var root=normalize(sheet.rootTopic||sheet.root,0,false,null);
    XMindAIColors.apply(root,sheet);
    var accents=['','#3366CC','#38965A','#DE7B22','#8055B5','#444444',opts.custom];
    var accent=null;if(opts.palette>0)accent=XMindAIColors.parse(accents[opts.palette]);
    function recolor(n){
      if(accent){
        var solid=n._depth<2,fill=rgba(accent.r,accent.g,accent.b,solid?1:.16);
        n._color={fill:fill,line:accent,border:accent,borderWidth:0,lineWidth:1.5,text:solid?contrast(accent):rgba(40,40,40)};
      }
      if(opts.textMode===1)n._color.text=rgba(51,51,51);
      if(opts.textMode===2)n._color.text=rgba(0,0,0);
      if(opts.textMode===3)n._color.text=rgba(255,255,255);
      for(var j=0;j<n.children.length;j++)recolor(n.children[j]);
    }
    recolor(root);return {root:root,count:count,opts:opts,sheet:sheet,title:sheet.title||root.title};
  }
  function allNodes(root){var a=[];function walk(n){a.push(n);for(var i=0;i<n.children.length;i++)walk(n.children[i]);}walk(root);return a;}
  function position(model){
    return XMindAILayout.position(model);
  }
  function render(doc,model){
    var base=doc.layers.add();base.name='XMind · '+model.root.title;
    try{
      var lang=model.opts.lang||'zh',main=base.groupItems.add();main.name='XMind · '+model.root.title;main.note='XMind import group';
      var bg=backgroundColor(model.opts),bgLayer=null;if(bg){bgLayer=main.groupItems.add();bgLayer.name=XMindAILocale.text(lang,'bgGroup');}
      var lines=main.groupItems.add();lines.name=XMindAILocale.text(lang,'links');var nodes=main.groupItems.add();nodes.name=XMindAILocale.text(lang,'group');
      model.container=main;model.linkGroup=lines;model.topicGroup=nodes;model.backgroundGroup=bgLayer;
      var list=allNodes(model.root),i,n,grp,tf,color,rect,border,font=app.textFonts.getByName(model.opts.fontName),lookup={};
      for(i=0;i<list.length;i++){
        n=list[i];var parentGroup=nodes;if(n._parent&&!n._floating&&lookup[n._parent])parentGroup=lookup[n._parent]._branchGroup;
        var branchGroup=parentGroup.groupItems.add();branchGroup.name=n.title;branchGroup.note='XMind topic='+String(n._source.id||n._key);n._branchGroup=branchGroup;
        grp=branchGroup.groupItems.add();grp.name=XMindAILocale.text(lang,'content');grp.note='XMind topic-content='+String(n._source.id||n._key);
        tf=grp.textFrames.add();tf.name=n.title;tf.contents=n.label;
        tf.textRange.characterAttributes.textFont=font;tf.textRange.characterAttributes.size=n.fontSize;
        tf.textRange.characterAttributes.autoLeading=false;tf.textRange.characterAttributes.leading=n.fontSize*n.leading;
        tf.textRange.characterAttributes.fillColor=rgb(n._color.text);tf.opacity=n._color.text.a*100;
        tf.textRange.paragraphAttributes.justification=n.leftAlign?Justification.LEFT:Justification.CENTER;
        var attempts=0;while(tf.width+n.padX>n.maxWidth+1&&n.units>4&&attempts++<8){n.units*=.90;n.label=XMindAILayout.wrap(n.rawTitle,n.units);tf.contents=n.label;}
        n.w=tf.width+n.padX;n.h=tf.height+n.padY;
        n._group=grp;n._text=tf;lookup[n._key]=n;
      }
      var points=position(model),ab=doc.artboards[doc.artboards.getActiveArtboardIndex()].artboardRect,dx=(ab[0]+ab[2])/2,dy=(ab[1]+ab[3])/2;
      for(i=0;i<points.length;i++){
        n=points[i];n.x+=dx;n.y+=dy;if(n._railX!==undefined)n._railX+=dx;if(n._busY!==undefined)n._busY+=dy;if(n._rootRail!==undefined)n._rootRail+=dx;if(n._sectionLeft!==undefined)n._sectionLeft+=dx;color=n._color;grp=n._group;tf=n._text;
        rect=grp.pathItems.roundedRectangle(n.y+n.h/2,n.x-n.w/2,n.w,n.h,8,8);rect.name='节点背景';rect.stroked=false;rect.filled=color.fill.a>0;rect.fillColor=rgb(color.fill);rect.opacity=color.fill.a*100;
        if(color.borderWidth>0&&color.border.a>0){border=grp.pathItems.roundedRectangle(n.y+n.h/2,n.x-n.w/2,n.w,n.h,8,8);border.name='节点边框';border.filled=false;border.stroked=true;border.strokeWidth=color.borderWidth;border.strokeColor=rgb(color.border);border.opacity=color.border.a*100;}
        tf.left=n.x-tf.width/2;tf.top=n.y+tf.height/2;tf.zOrder(ZOrderMethod.BRINGTOFRONT);
      }
      XMindAILayout.drawLinks(lines,model,points);
      model.points=points;
      var minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
      for(i=0;i<points.length;i++){n=points[i];minX=Math.min(minX,n.x-n.w/2);maxX=Math.max(maxX,n.x+n.w/2);minY=Math.min(minY,n.y-n.h/2);maxY=Math.max(maxY,n.y+n.h/2);}
      for(i=0;i<lines.pathItems.length;i++){var lb=lines.pathItems[i].visibleBounds;minX=Math.min(minX,lb[0]);maxX=Math.max(maxX,lb[2]);minY=Math.min(minY,lb[3]);maxY=Math.max(maxY,lb[1]);}
      model.bounds=[minX-24,maxY+24,maxX+24,minY-24];
      if(bg){
        var back=bgLayer.pathItems.rectangle(maxY+24,minX-24,maxX-minX+48,maxY-minY+48);back.name=XMindAILocale.text(lang,'bgItem');back.stroked=false;back.filled=true;back.fillColor=rgb(bg);back.opacity=100;
      }
      return base;
    }catch(e){try{base.remove();}catch(cleanErr){}throw e;}
  }
  function fonts(){
    var a=[],i,f,label;for(i=0;i<app.textFonts.length;i++){f=app.textFonts[i];label=f.name;try{label=f.family+' · '+f.style+'  ['+f.name+']';}catch(e){}a.push({name:f.name,label:label});}
    a.sort(function(x,y){var a=x.label.toLowerCase(),b=y.label.toLowerCase();if(a<b)return -1;if(a>b)return 1;return 0;});return a;
  }
  function defaultFont(list){var wanted=['MicrosoftYaHei','MicrosoftYaHeiUI','SimHei','SimSun','PingFangSC-Regular','ArialMT'],i,j;for(i=0;i<wanted.length;i++)for(j=0;j<list.length;j++)if(list[j].name===wanted[i])return list[j].name;return list.length?list[0].name:'';}
  function exportPreview(doc,base,file,opts){
    var b=doc.visibleBounds,pad=0;if(opts.bgMode===2)pad=24;
    var w=b[2]-b[0]+pad*2,h=b[1]-b[3]+pad*2;
    if(w>16000||h>16000)throw new Error('当前导图预览范围过大，请减小字号。');
    doc.artboards[0].artboardRect=[b[0]-pad,b[1]+pad,b[2]+pad,b[3]-pad];
    var scale=Math.min(560/w,390/h,2)*100,p=new ExportOptionsPNG24();p.artBoardClipping=true;p.transparency=opts.bgMode===2;p.antiAliasing=true;p.horizontalScale=scale;p.verticalScale=scale;
    if(opts.bgMode===2)p.matte=false;else{p.matte=true;p.matteColor=rgb(backgroundColor(opts));}
    doc.exportFile(file,ExportType.PNG24,p);
    if(!file.exists)throw new Error('预览图片未生成。');return ScriptUI.newImage(file);
  }
  function preview(model,folder,serial){
    var original=null,doc=null,files=[],result,overview;
    if(app.documents.length)original=app.activeDocument;
    try{
      doc=app.documents.add(DocumentColorSpace.RGB,1200,900);
      var base=render(doc,model);overview=new File(folder.fsName+'/overview_'+serial+'.png');files.push(overview);
      var fullImage=exportPreview(doc,base,overview,model.opts);
      result={overview:fullImage,files:files,background:backgroundColor(model.opts),transparent:model.opts.bgMode===2};
    }catch(e){for(var i=0;i<files.length;i++)try{files[i].remove();}catch(cleanErr){}throw e;}
    finally{if(doc)try{doc.close(SaveOptions.DONOTSAVECHANGES);}catch(closeErr){}if(original)try{original.activate();}catch(activateErr){}}
    return result;
  }
  function createDialog(){
    return XMindAIDialog.create({fonts:fonts,defaultFont:defaultFont,readFile:readFile,validate:validate,makeModel:makeModel,preview:preview});
  }
  function run(){
    var target=null;if(app.documents.length)target=app.activeDocument;
    var ui;try{ui=createDialog();ui.window.show();var chosen=ui.getResult();if(!chosen)return;
      var model=makeModel(chosen.sheet,chosen.opts),doc=target;if(!doc)doc=app.documents.add(DocumentColorSpace.RGB,1200,900);else doc.activate();
      render(doc,model);doc.selection=null;model.container.selected=true;
      try{var view=doc.views[0],vb=view.bounds,oldZoom=view.zoom,bb=model.bounds,width=bb[2]-bb[0],height=bb[1]-bb[3];view.centerPoint=[(bb[0]+bb[2])/2,(bb[1]+bb[3])/2];view.zoom=Math.max(.01,Math.min(64,oldZoom*Math.min((vb[2]-vb[0])/width,(vb[1]-vb[3])/height)*.9));}catch(viewErr){}
      app.redraw();alert(XMindAILocale.text(chosen.opts.lang||'zh','success',{count:model.count}));
    }catch(e){var lang=ui?ui.getLanguage():'zh';alert(XMindAILocale.text(lang,'failed',{error:XMindAILocale.error(lang,e.message)}));}finally{if(ui)ui.cleanup();}
  }
  return {run:run,createDialog:createDialog,readFile:readFile,makeModel:makeModel,render:render,preview:preview,fonts:fonts,defaultFont:defaultFont,validate:validate,position:position};
})();
XMindAIImporter.run();

