const $ = id => document.getElementById(id);

window.addEventListener("DOMContentLoaded", () => {
  $("owner").value = localStorage.getItem("gh_owner") || "";
  $("repo").value = localStorage.getItem("gh_repo") || "";
  $("token").value = localStorage.getItem("gh_token") || "";
});

function saveSettings(){
  localStorage.setItem("gh_owner", $("owner").value.trim());
  localStorage.setItem("gh_repo", $("repo").value.trim());
  localStorage.setItem("gh_token", $("token").value.trim());
  status("GitHub settings saved in this browser.");
}

function status(message, error=false){
  $("status").textContent = message;
  $("status").style.color = error ? "#b42318" : "#176b3a";
}

function cleanSlug(value){
  return value.trim().replace(/\.html$/i,"").replace(/[^a-zA-Z0-9_-]/g,"");
}

function makeHtml(slug){
  const safe = JSON.stringify(slug);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex,nofollow">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Redirecting...</title>
</head>
<body>
<p id="s">Redirecting...</p>
<script>
(function(){
  const slug=${safe};
  const configUrl="config.js";
  fetch(configUrl,{cache:"no-store"})
    .then(r=>r.json())
    .then(data=>{
      const target=data[slug];
      if(target){ location.replace(target); }
      else { document.getElementById("s").textContent="Redirect destination not found."; }
    })
    .catch(()=>{ document.getElementById("s").textContent="Unable to load redirect configuration."; });
})();
<\/script>
</body>
</html>`;
}

async function github(path, options={}){
  const owner=$("owner").value.trim(), repo=$("repo").value.trim(), token=$("token").value.trim();
  const res=await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path}`,{
    ...options,
    headers:{
      "Accept":"application/vnd.github+json",
      "Authorization":"Bearer "+token,
      "X-GitHub-Api-Version":"2022-11-28",
      ...(options.headers||{})
    }
  });
  if(!res.ok){
    let detail="";
    try{detail=JSON.stringify(await res.json());}catch{}
    throw new Error(`${res.status} ${res.statusText} ${detail}`);
  }
  return res.json();
}

function b64encode(text){
  const bytes=new TextEncoder().encode(text);
  let binary="";
  for(const b of bytes) binary+=String.fromCharCode(b);
  return btoa(binary);
}

async function getFile(path){
  try{return await github(path);}
  catch(e){
    if(e.message.startsWith("404")) return null;
    throw e;
  }
}

async function publishRedirect(){
  const owner=$("owner").value.trim();
  const repo=$("repo").value.trim();
  const token=$("token").value.trim();
  const slug=cleanSlug($("slug").value);
  const destination=$("destination").value.trim();

  if(!owner||!repo||!token) return status("Please fill GitHub settings first.",true);
  if(!slug) return status("Enter a valid Slug, for example go1.",true);
  if(!/^https?:\/\/[^\s]+$/i.test(destination)) return status("Enter a valid destination URL starting with https:// or http://",true);

  try{
    status("Publishing to GitHub...");
    saveSettings();

    // Store destinations centrally in config.json.
    const configFile=await getFile("config.json");
    let config={};
    let configSha=null;
    if(configFile){
      configSha=configFile.sha;
      try{
        config=JSON.parse(decodeURIComponent(escape(atob(configFile.content.replace(/\n/g,"")))));
      }catch{
        config=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(configFile.content.replace(/\n/g,"")),c=>c.charCodeAt(0))));
      }
    }
    config[slug]=destination;

    const configBody={
      message:`Update redirect ${slug}`,
      content:b64encode(JSON.stringify(config,null,2)+"\n")
    };
    if(configSha) configBody.sha=configSha;

    await github("config.json",{
      method:"PUT",
      body:JSON.stringify(configBody)
    });

    const page=makeHtml(slug);
    const existing=await getFile(`${slug}.html`);
    const pageBody={
      message:`Create/update ${slug}.html`,
      content:b64encode(page)
    };
    if(existing) pageBody.sha=existing.sha;

    await github(`${slug}.html`,{
      method:"PUT",
      body:JSON.stringify(pageBody)
    });

    const pagesBase=location.origin+location.pathname.replace(/\/index\.html$/,"").replace(/\/$/,"/");
    status(`Success!\n\n${slug}.html has been created/updated in GitHub.\n\nLive URL after GitHub Pages deploy/update:\n${pagesBase}${slug}.html`);
  }catch(e){
    status("GitHub error:\n"+e.message+"\n\nCheck repository name, token permissions and GitHub Pages settings.",true);
  }
}
