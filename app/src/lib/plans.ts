import { useSyncExternalStore } from 'react';
export type LocalPlan = { id: string; groupId: number; groupName: string; place: string; address: string; date: string; time: string; price: number; };
let plans: LocalPlan[] = [];
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const snapshot = () => plans;
export function useLocalPlans() { return useSyncExternalStore(subscribe, snapshot, snapshot); }
export function confirmLocalPlan(plan: LocalPlan) { plans = [plan, ...plans]; listeners.forEach(fn => fn()); }
