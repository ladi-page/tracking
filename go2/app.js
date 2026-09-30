const state={redirects:[],editing:null};

const $=id=>document.getElementById(id);
function toast(msg,error=false){const t=$("toast");t.textContent=msg;t.className="toast show"+(error?" error":"");setTimeout(()=>t.className="toast",3200)}
function loadSettings(){["owner","repo","token"].forEach(k=>$(k).value=localStorage.getItem("rp_"+k)||""); updateConnection()}
function saveLocal(){["owner","repo","token"].forEach(k=>localStorage.setItem("rp_"+k,$(k).value.trim()));}
function toggleToken(){const x=$("token");x.type=x.type==="password"?"text":"password"}
function baseUrl(){return location.origin+location.pathname.replace(/\/index\.html$/,"").replace(/\/$/,"/")}
function redirectUrl(slug){return baseUrl()+encodeURIComponent(slug)+".html"}
function updatePreview(){const slug=cleanSlug($("slug").value);$("previewUrl").textContent=slug?redirectUrl(slug):"—"}
$("slug").addEventListener("input",updatePreview)

function setView(view){
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
 document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));
 $(view+"View").classList.remove("hidden");
 $("pageTitle").textContent=view==="dashboard"?"Dashboard":view==="redirects"?"Redirects":"Settings";
 if(view==="redirects")renderRedirects();
}
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>setView(b.dataset.view));

async function api(path,options={}){
 const owner=$("owner").value.trim(),repo=$("repo").value.trim(),token=$("token").value.trim();
 if(!owner||!repo||!token)throw Error("Connect your GitHub repository in Settings first.");
 const r=await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path}`,{
  ...options,headers:{"Accept":"application/vnd.github+json","Authorization":"Bearer "+token,"X-GitHub-Api-Version":"2022-11-28",...(options.headers||{})}
 });
 if(!r.ok){let d="";try{d=JSON.stringify(await r.json())}catch{};throw Error(`${r.status}: ${d||r.statusText}`)}
 return r.json();
}
function b64(s){const bytes=new TextEncoder().encode(s);let bin="";bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin)}
function cleanSlug(s){return s.trim().replace(/\.html$/i,"").replace(/[^a-zA-Z0-9_-]/g,"")}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

async function connectGitHub(){
 saveLocal();
 try{
  const d=await api("");
  updateConnection(true);
  await loadRedirects();
  toast("GitHub connected successfully.");
 }catch(e){updateConnection(false);toast("Connection failed: "+e.message,true)}
}
function updateConnection(on){
 $("dot").classList.toggle("on",!!on);
 $("connectionText").textContent=on?"Connected":"Not connected";
 $("statRepo").textContent=on?($("repo").value.trim()||"—"):"—";
}
async function loadRedirects(){
 try{
  const d=await api("");
  const items=(d||[]).filter(x=>x.type==="file"&&x.name.endsWith(".html")&&x.name!=="index.html");
  state.redirects=items.map(x=>({name:x.name,slug:x.name.replace(/\.html$/i,""),sha:x.sha,size:x.size}));
  state.redirects.sort((a,b)=>a.slug.localeCompare(b.slug));
  $("statTotal").textContent=state.redirects.length;
  $("statActive").textContent=state.redirects.length;
  $("statSync").textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  renderRecent();renderRedirects();
 }catch(e){toast(e.message,true)}
}
function renderRecent(){
 const list=state.redirects.slice(0,6);
 $("recentList").innerHTML=list.length?table(list):emptyHtml();
}
function table(list){
 return `<table class="table"><thead><tr><th>Redirect</th><th>Destination</th><th>Status</th><th></th></tr></thead><tbody>${list.map(r=>`<tr>
<td><div class="slug-cell">${esc(r.slug)}.html</div><div class="link-cell">${esc(redirectUrl(r.slug))}</div></td>
<td><div class="dest">Click Edit to load the destination</div></td>
<td><span class="badge"><i></i>Active</span></td>
<td><div class="actions"><button class="icon-btn" title="Copy" onclick="copyText('${encodeURIComponent(redirectUrl(r.slug))}')">⧉</button><button class="icon-btn" title="Edit" onclick="editRedirect('${encodeURIComponent(r.slug)}')">✎</button><button class="icon-btn danger" title="Delete" onclick="deleteRedirect('${encodeURIComponent(r.slug)}')">⌫</button></div></td>
</tr>`).join("")}</tbody></table>`
}
function emptyHtml(){return `<div class="empty"><b>No redirects yet</b>Create your first redirect to get started.</div>`}
function renderRedirects(){
 const q=($("search")?.value||"").toLowerCase().trim();
 const list=state.redirects.filter(r=>!q||r.slug.toLowerCase().includes(q));
 $("allList").innerHTML=list.length?table(list):emptyHtml();
}
async function readRedirect(slug){
 const d=await api(slug+".html");
 const raw=atob(d.content.replace(/\n/g,""));
 const m=raw.match(/location\.replace\((["'])(.*?)\1\)/);
 return {data:d,destination:m?m[2]:""};
}
function openModal(slug=""){
 state.editing=slug||null;
 $("modalTitle").textContent=slug?"Edit redirect":"Create redirect";
 $("saveBtn").textContent=slug?"Save changes":"Create redirect";
 $("slug").value=slug;
 $("destination").value="";
 $("notes").value="";
 updatePreview();
 $("modal").classList.remove("hidden");
 if(slug)readRedirect(slug).then(x=>$("destination").value=x.destination).catch(e=>toast(e.message,true));
}
function closeModal(){$("modal").classList.add("hidden");state.editing=null}
async function editRedirect(enc){openModal(decodeURIComponent(enc))}
function makeHtml(destination){
 return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Redirecting...</title></head>
<body><script>(function(){location.replace(${JSON.stringify(destination)});})();<\/script></body></html>`;
}
async function saveRedirect(){
 const slug=cleanSlug($("slug").value),dest=$("destination").value.trim();
 if(!slug)return toast("Enter a valid slug.",true);
 if(!/^https?:\/\/\S+$/i.test(dest))return toast("Enter a valid http:// or https:// destination URL.",true);
 if(!localStorage.getItem("rp_token"))saveLocal();
 $("saveBtn").disabled=true;$("saveBtn").textContent="Publishing...";
 try{
  let existing=null;
  try{existing=await api(slug+".html")}catch(e){if(!e.message.startsWith("404"))throw e}
  const body={message:`${state.editing?"Update":"Create"} redirect ${slug}`,content:b64(makeHtml(dest))};
  if(existing)body.sha=existing.sha;
  await api(slug+".html",{method:"PUT",body:JSON.stringify(body)});
  toast(state.editing?"Redirect updated":"Redirect created");
  closeModal();await loadRedirects();
 }catch(e){toast("Publish failed: "+e.message,true)}
 finally{$("saveBtn").disabled=false;$("saveBtn").textContent=state.editing?"Save changes":"Create redirect"}
}
async function deleteRedirect(enc){
 const slug=decodeURIComponent(enc);
 if(!confirm(`Delete ${slug}.html from GitHub? This cannot be undone from this dashboard.`))return;
 try{
  const d=await api(slug+".html");
  await api(slug+".html",{method:"DELETE",body:JSON.stringify({message:`Delete redirect ${slug}`,sha:d.sha})});
  toast("Redirect deleted");await loadRedirects();
 }catch(e){toast("Delete failed: "+e.message,true)}
}
async function copyText(enc){await navigator.clipboard.writeText(decodeURIComponent(enc));toast("Redirect URL copied")}
async function copyPreview(){const u=$("previewUrl").textContent;if(u&&u!=="—"){await navigator.clipboard.writeText(u);toast("URL copied")}}
function showHelp(){alert("Create redirect: choose a Slug like offer1 and a destination URL. The dashboard uses GitHub's API to create offer1.html directly in your repository. Existing slugs are updated instead of creating duplicates. Your GitHub Pages URL is the final redirect URL.")}
loadSettings();
if(localStorage.getItem("rp_token"))connectGitHub();
