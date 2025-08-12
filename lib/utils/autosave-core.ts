export type AutoStatus = 'idle'|'saving'|'saved'|'error'
export type Unsub = { unsubscribe: () => void }
export type Subscribe<T> = (cb:(data:T)=>void)=>Unsub
export interface Options<T extends Record<string,unknown>>{ getValues:()=>T; subscribe:Subscribe<T>; canSave:()=>boolean; saveFn:(data:T)=>void; onStatus?:(s:AutoStatus,e?:string)=>void; debounceMs?:number; savingMinMs?:number; savedHoldMs?:number }
export interface Engine{ forceSave:()=>void; clear:()=>void; dispose:()=>void }
export function createAutosaveEngine<T extends Record<string,unknown>>(o:Options<T>):Engine{
  const gv=o.getValues,on=o.onStatus
  const d=o.debounceMs??1000,min=o.savingMinMs??1000,hold=o.savedHoldMs??2000
  let snap=JSON.stringify(gv()),edited=false,t:number|null=null
  const attempt=():void=>{
    if(!o.canSave())return
    const data=gv(),str=JSON.stringify(data)
    if(str===snap)return
    try{ on?.('saving'); o.saveFn(data); snap=str; edited=true; window.setTimeout(()=>{ on?.('saved'); window.setTimeout(()=>on?.('idle'),hold)},min) }
    catch(e){ const msg=e instanceof Error?e.message:'Unknown error'; on?.('error',msg) }
  }
  const sub:Unsub=o.subscribe((data)=>{ if(!o.canSave())return; const s=JSON.stringify(data); if(!edited){ if(s!==snap){ edited=true; snap=s } return } if(t)window.clearTimeout(t); t=window.setTimeout(attempt,d) })
  return{ forceSave:attempt, clear:()=>{ edited=false; snap=JSON.stringify(gv()) }, dispose:()=>{ sub.unsubscribe(); if(t)window.clearTimeout(t) } }
}
