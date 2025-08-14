import { slug } from './slug'

const PREFIX = 'trial-draft'
export interface TrialDraft{userId:string;key:string;formData:Record<string,unknown>;lastSaved:string;currentStep:number}
export const keyForNew=(userId:string,brandId:number,name:string): string =>`${PREFIX}-${userId}-brand-${brandId}-name-${slug(name)}`
export const keyForExisting=(userId:string,trialProductId:number): string =>`${PREFIX}-${userId}-product-${trialProductId}`
export function saveTrialDraft(key:string,userId:string,formData:Record<string,unknown>,currentStep:number):void{try{const d:TrialDraft={userId,key,formData,lastSaved:new Date().toISOString(),currentStep};localStorage.setItem(key,JSON.stringify(d));cleanupOldTrialDrafts(userId);try{window.dispatchEvent(new CustomEvent('trial-draft-saved',{detail:{key,userId}}))}catch{ /* noop */ }}catch(e){throw new Error(`Failed to save trial draft: ${e instanceof Error?e.message:'Unknown error'}`)}}
export function loadTrialDraft(key:string):TrialDraft|null{const s=localStorage.getItem(key);if(!s)return null;try{return JSON.parse(s) as TrialDraft}catch{localStorage.removeItem(key);return null}}
export function deleteTrialDraft(key:string):void{localStorage.removeItem(key);try{window.dispatchEvent(new CustomEvent('trial-draft-deleted',{detail:{key}}))}catch{ /* noop */ }}
export function getAllTrialDrafts(userId:string):TrialDraft[]{const p=`${PREFIX}-${userId}-`;const out:TrialDraft[]=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(p)){const s=localStorage.getItem(k);if(s){try{out.push(JSON.parse(s) as TrialDraft)}catch{localStorage.removeItem(k)}}}}return out.sort((a,b)=>new Date(b.lastSaved).getTime()-new Date(a.lastSaved).getTime())}
const MAX_AGE=7*24*60*60*1000,MAX_COUNT=5
export function cleanupOldTrialDrafts(userId:string):void{const now=Date.now();const drafts=getAllTrialDrafts(userId);drafts.forEach(d=>{if(now-new Date(d.lastSaved).getTime()>MAX_AGE)deleteTrialDraft(d.key)});const valid=getAllTrialDrafts(userId);if(valid.length>MAX_COUNT){valid.slice(MAX_COUNT).forEach(d=>deleteTrialDraft(d.key))}
}
