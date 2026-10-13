import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const envelope=JSON.parse(await fs.readFile('floatdesk-update.json','utf8'));
const publicKey=await fs.readFile('release-public-key.pem','utf8');
const payloadBytes=Buffer.from(envelope.payload,'base64');
if(!crypto.verify(null,payloadBytes,publicKey,Buffer.from(envelope.signature,'base64')))throw new Error('Release signature invalid');
const payload=JSON.parse(payloadBytes.toString('utf8'));
if(payload.appId!=='app.floatdesk.desktop'||payload.version!=='0.2.2'||payload.platform!=='win32'||payload.arch!=='x64')throw new Error('Unexpected release');
const source="https://wmzsq9-ip-90-96-188-87.tunnelmole.net/5f4a10e65740e3820dffad5396459c28e4e647a0c7c63ab4d56b50e90732bd55/installer";
const sourceUrl=new URL(source);
if(sourceUrl.protocol!=='https:'||!/^(?:[a-z0-9-]+\.)+(?:tunnelmole\.net|tunnelmole\.com)$/.test(sourceUrl.hostname)||!/^\/[a-f0-9]{64}\/installer$/.test(sourceUrl.pathname)||sourceUrl.search||sourceUrl.hash||sourceUrl.username||sourceUrl.password)throw new Error('Unexpected bootstrap source');
const file='FloatDesk-0.2.2-win-x64.exe';
const chunk=8*1024*1024,total=payload.installer.size;
if(total!==278324837||payload.installer.sha256!=="c013324add29fde1db8ba032eac83be85b3c9d71f1ff9a5395cffe2780ea15e5")throw new Error('Unexpected signed installer');
const repo=process.env.GITHUB_REPOSITORY;
if(repo!=='hyperfloater/floatdesk-releases')throw new Error('Unexpected release repository');
const expected=`https://github.com/${repo}/releases/download/v${payload.version}/${file}`;
if(payload.installer.url!==expected)throw new Error('Release URL mismatch');
await fs.writeFile(file,Buffer.alloc(0),{flag:'wx'});
const hash=crypto.createHash('sha256');
for(let start=0;start<total;start+=chunk){
 const end=Math.min(total-1,start+chunk-1);let bytes;
 for(let attempt=0;attempt<3;attempt++){
  try{
   const response=await fetch(source,{redirect:'error',credentials:'omit',headers:{Range:`bytes=${start}-${end}`},signal:AbortSignal.timeout(90000)});
   if(response.status!==206||response.headers.get('Content-Range')!==`bytes ${start}-${end}/${total}`)throw new Error('Download range invalid');
   bytes=Buffer.from(await response.arrayBuffer());if(bytes.length!==end-start+1)throw new Error('Incomplete download');break;
  }catch(e){if(attempt===2)throw e;await new Promise(r=>setTimeout(r,1500*(attempt+1)));}
 }
 hash.update(bytes);await fs.appendFile(file,bytes);console.log(`Installer transfer ${Math.round(100*(end+1)/total)}%`);
}
if(hash.digest('hex')!==payload.installer.sha256)throw new Error('Installer hash mismatch');
await fs.writeFile('notes.md',payload.notes);
const result=spawnSync('gh',['release','create','v'+payload.version,file,'floatdesk-update.json','--repo',repo,'--title','FloatDesk '+payload.version,'--notes-file','notes.md'],{stdio:'inherit',shell:false});
if(result.status!==0)throw new Error('Release publish failed');
