const cfg=window.REDIRECTS||{};
const base=location.href.replace(/index\.html.*$/,"");
function render(){
 const el=document.getElementById("list");
 const keys=Object.keys(cfg);
 if(!keys.length){el.innerHTML='<div class="card">No redirects yet.</div>';return;}
 el.innerHTML=keys.map(k=>{
   const link=base+"go.html?id="+encodeURIComponent(k);
   return `<div class="row"><div><b>${escapeHtml(k)}</b><div class="dest">${escapeHtml(cfg[k])}</div><div class="link">${escapeHtml(link)}</div></div>
   <button onclick="edit('${encodeURIComponent(k)}')">Edit</button></div>`;
 }).join("");
}
function edit(k){
 k=decodeURIComponent(k);
 document.getElementById("slug").value=k;
 document.getElementById("url").value=cfg[k];
 window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
}
function save(){
 const slug=document.getElementById("slug").value.trim().replace(/[^a-zA-Z0-9_-]/g,"");
 const url=document.getElementById("url").value.trim();
 if(!slug){return msg("Enter a valid slug.");}
 try{new URL(url);}catch(e){return msg("Enter a valid full URL, e.g. https://example.com");}
 cfg[slug]=url;
 msg("Saved in this browser only. To make it live for everyone, copy the updated entry into config.js and commit it to GitHub.");
 render();
}
function clearForm(){document.getElementById("slug").value="";document.getElementById("url").value="";msg("");}
function msg(t){document.getElementById("msg").textContent=t;}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
render();
