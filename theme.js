/* رنگ‌بندی مشترک صفحه‌های داخلی (ورود، ثبت‌نام، پنل عضو، واریزی‌ها، تماس، مدیران)
   همان رنگ‌هایی را اعمال می‌کند که در پنل مدیر ← «متن صفحه اصلی» انتخاب شده. */
(function(){
  var K="tmpv_theme_vars", root=document.documentElement.style;
  function setv(k,v){
    if(/^--[a-z0-9-]+$/.test(k)&&typeof v==="string"&&!/url\(|expression|[<>{};]/i.test(v)) root.setProperty(k,v);
  }
  // ۱) فوراً از حافظه‌ی مرورگر (بدون چشمک زدن)
  try{ var t=JSON.parse(localStorage.getItem(K)||"null"); if(t) for(var k in t) setv(k,t[k]); }catch(e){}

  var MAP={theme_primary:"--primary",theme_primary_dark:"--primary-dark",theme_primary_light:"--primary-light",
    theme_hero_highlight:"--hero-highlight",theme_page_bg:"--page-bg",theme_alt_bg:"--alt-bg",theme_nav_bg:"--nav-bg",
    theme_nav_text:"--nav-text",theme_card_bg:"--card-bg",theme_footer_bg:"--footer-bg",theme_footer_text:"--footer-text"};
  function lum(hex){
    var m=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex||"").trim()); if(!m) return null;
    var x=m[1]; if(x.length===3) x=x.split("").map(function(c){return c+c;}).join("");
    return [0,2,4].map(function(i){var v=parseInt(x.substr(i,2),16)/255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}).reduce(function(a,v,i){return a+v*[0.2126,0.7152,0.0722][i];},0);
  }
  function con(a,b){var la=lum(a),lb=lum(b); if(la==null||lb==null) return 21; var h=Math.max(la,lb),l=Math.min(la,lb); return (h+0.05)/(l+0.05);}
  function auto(bg){return con(bg,"#10140f")>=con(bg,"#ffffff")?"#10140f":"#ffffff";}
  function rgb(hex){var x=String(hex||"").replace("#",""); if(x.length===3) x=x.split("").map(function(c){return c+c;}).join(""); if(!/^[0-9a-f]{6}$/i.test(x)) return null; return parseInt(x.slice(0,2),16)+","+parseInt(x.slice(2,4),16)+","+parseInt(x.slice(4,6),16);}
  function apply(c){
    for(var key in MAP) if(c[key]) setv(MAP[key],c[key]);
    var pr=c.theme_primary||"#2d7a3a", pg=c.theme_page_bg||"#f0f7f1", cd=c.theme_card_bg||"#ffffff";
    setv("--on-primary",auto(pr));
    var pt=(c.theme_text_color&&con(pg,c.theme_text_color)>=3.5)?c.theme_text_color:auto(pg);
    setv("--page-text",pt); setv("--card-text",auto(cd));
    var r=rgb(pr); if(r) setv("--primary-rgb",r);
    var nv=c.theme_nav_bg||"#e8f4ea";
    setv("--nav-on",auto(nv));
    var cands=[pr,c.theme_primary_light,c.theme_hero_highlight,c.theme_nav_text].filter(Boolean), acc=null;
    for(var j=0;j<cands.length&&!acc;j++){ if(con(cands[j],pg)>=4.5&&con(cands[j],cd)>=4.5&&con(cands[j],nv)>=4.5) acc=cands[j]; }
    setv("--accent-text",acc||auto(pg));
    // به‌روزرسانی حافظه (ادغام با آنچه صفحه‌ی اصلی ذخیره کرده)
    try{
      var cache={}; try{cache=JSON.parse(localStorage.getItem(K)||"{}")||{};}catch(e){}
      for(var i=0;i<root.length;i++){var n=root[i]; if(n.indexOf("--")===0) cache[n]=root.getPropertyValue(n);}
      localStorage.setItem(K,JSON.stringify(cache));
    }catch(e){}
  }
  // ۲) تازه‌ترین رنگ‌ها از پایگاه داده
  try{
    var KEY="sb_publishable_8duEw2Pj-B8fEupNzDzHag_CHN0riMC";
    fetch("https://gsqwuibzplwalrahevdc.supabase.co/rest/v1/site_content?id=eq.1&select=*",{headers:{apikey:KEY,Authorization:"Bearer "+KEY}})
      .then(function(r){return r.ok?r.json():null;})
      .then(function(rows){ if(rows&&rows[0]) apply(rows[0]); })
      .catch(function(){});
  }catch(e){}
})();
