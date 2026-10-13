import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const envelope=JSON.parse(await fs.readFile('floatdesk-update.json','utf8'));
const publicKey=await fs.readFile('release-public-key.pem','utf8');
const payloadBytes=Buffer.from(envelope.payload,'base64');
if(!crypto.verify(null,payloadBytes,publicKey,Buffer.from(envelope.signature,'base64')))throw new Error('Release signature invalid');
const payload=JSON.parse(payloadBytes.toString('utf8'));
if(payload.appId!=='app.floatdesk.desktop'||payload.version!=='0.2.1'||payload.platform!=='win32'||payload.arch!=='x64')throw new Error('Unexpected release');
const source="https://wdgkdr-ip-90-96-188-87.tunnelmole.net/839665abecd6a347cff44194a6ddfc938a8cc9050d1b163eb8b7e04a1bb5b970/installer";
const file='FloatDesk-0.2.1-win-x64.exe';
const chunk=8*1024*1024,total=payload.installer.size;
if(total!==278321917||payload.installer.sha256!=='d821cfde70fc0de44495483b3349e19776e51ee53b7027240dda808af4d2ecf5')throw new Error('Unexpected signed installer');
await fs.writeFile(file,Buffer.alloc(0),{flag:'wx'});
const hash=crypto.createHash('sha256');
for(let start=0;start<total;start+=chunk){
 const end=Math.min(total-1,start+chunk-1);let bytes;
 for(let attempt=0;attempt<3;attempt++){
  try{
   const response=await fetch(source,{headers:{Range:`bytes=${start}-${end}`},signal:AbortSignal.timeout(90000)});
   if(response.status!==206||response.headers.get('Content-Range')!==`bytes ${start}-${end}/${total}`)throw new Error('Download range invalid');
   bytes=Buffer.from(await response.arrayBuffer());if(bytes.length!==end-start+1)throw new Error('Incomplete download');break;
  }catch(e){if(attempt===2)throw e;await new Promise(r=>setTimeout(r,1500*(attempt+1)));}
 }
 hash.update(bytes);await fs.appendFile(file,bytes);console.log(`Installer transfer ${Math.round(100*(end+1)/total)}%`);
}
if(hash.digest('hex')!==payload.installer.sha256)throw new Error('Installer hash mismatch');
const repo=process.env.GITHUB_REPOSITORY;
const expected=`https://github.com/${repo}/releases/download/v${payload.version}/${file}`;
if(payload.installer.url!==expected)throw new Error('Release URL mismatch');
await fs.writeFile('notes.md',payload.notes);
const result=spawnSync('gh',['release','create','v'+payload.version,file,'floatdesk-update.json','--repo',repo,'--title','FloatDesk '+payload.version,'--notes-file','notes.md'],{stdio:'inherit',shell:false});
if(result.status!==0)throw new Error('Release publish failed');
