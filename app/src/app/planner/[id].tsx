import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { groupById, ideasForGroup, PEOPLE } from '@/mock/data';
import { confirmLocalPlan } from '@/lib/plans';
import { colors } from '@/lib/theme';

export default function Planner() {
  const { id } = useLocalSearchParams<{id:string}>();
  const group = groupById(Number(id));
  const ideas = ideasForGroup(Number(id));
  const [selected, setSelected] = useState(0);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(1);
  const dates = useMemo(() => Array.from({length: 5}, (_,i) => { const d = new Date(); d.setDate(d.getDate()+i+1); return d; }), []);
  const times = ['12:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
  const idea = ideas[selected];
  if (!group || !idea) return <View style={s.screen}><Text style={s.heading}>Add an idea to this circle first.</Text><Pressable onPress={() => router.back()}><Text>Go back</Text></Pressable></View>;
  const names = group.memberIds.map(i => PEOPLE[i]?.name).filter(Boolean);
  return <ScrollView style={s.screen} contentContainerStyle={s.body}>
    <Pressable onPress={() => router.back()} style={s.back}><Text style={s.text}>‹  Back</Text></Pressable>
    <Text style={s.heading}>Find a time ✦</Text><Text style={s.sub}>A little adventure with {group.name}</Text>
    <View style={s.panel}><Text style={s.section}>Choose an idea</Text>{ideas.map((item,i) => <Pressable key={item.id} onPress={() => setSelected(i)} style={[s.option,selected===i&&s.active]}><Text style={s.text}>{selected===i?'◉':'○'}  {item.name}</Text><Text style={s.small}>{item.activityType} · {'$'.repeat(item.priceLevel||1)}</Text></Pressable>)}</View>
    <View style={s.panel}><Text style={s.section}>What day works?</Text><View style={s.wrap}>{dates.map((d,i) => <Pressable key={i} onPress={() => setDay(i)} style={[s.chip,day===i&&s.active]}><Text style={s.text}>{d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</Text></Pressable>)}</View><Text style={s.small}>Demo availability: choose a day that works for your circle.</Text></View>
    <View style={s.panel}><Text style={s.section}>Pick a time</Text><View style={s.wrap}>{times.map((t,i) => <Pressable key={t} onPress={() => setTime(i)} style={[s.chip,time===i&&s.active]}><Text style={s.text}>{t}</Text></Pressable>)}</View></View>
    <View style={s.panel}><Text style={s.section}>Why this works ✨</Text><Text style={s.text}>• Shared idea saved by your circle</Text><Text style={s.text}>• Estimated price: {'$'.repeat(idea.priceLevel||1)}</Text><Text style={s.text}>• Planning with {names.join(', ')}</Text><Text style={s.small}>Availability and dietary/accessibility checks are not connected to live services yet.</Text></View>
    <Pressable style={s.primary} onPress={() => { confirmLocalPlan({id:String(Date.now()),groupId:group.id,groupName:group.name,place:idea.name,address:idea.address,date:dates[day].toISOString(),time:times[time],price:idea.priceLevel||1}); Alert.alert('Plan confirmed!','Your event is now on Home. This demo confirmation is stored in memory.',[{text:'See my plans',onPress:()=>router.replace('/(tabs)')}]); }}><Text style={s.primaryText}>Confirm our plan  ✓</Text></Pressable>
  </ScrollView>;
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:colors.bg},body:{padding:20,paddingTop:62,paddingBottom:50,gap:16},back:{paddingVertical:8},heading:{fontSize:32,color:colors.ink,fontWeight:'500'},sub:{fontSize:15,color:colors.muted},panel:{backgroundColor:colors.card,borderColor:colors.line,borderWidth:1,borderRadius:20,padding:16,gap:12},section:{fontSize:19,fontWeight:'600',color:colors.ink},option:{borderWidth:1,borderColor:colors.lineSoft,borderRadius:12,padding:12,gap:4},active:{backgroundColor:colors.accentSoft,borderColor:colors.accent},text:{color:colors.ink,fontSize:15},small:{color:colors.muted,fontSize:12,lineHeight:18},wrap:{flexDirection:'row',flexWrap:'wrap',gap:8},chip:{paddingVertical:10,paddingHorizontal:12,borderWidth:1,borderRadius:22,borderColor:colors.line},primary:{backgroundColor:colors.accent,borderRadius:14,padding:18,alignItems:'center'},primaryText:{color:'#fff',fontSize:17,fontWeight:'700'}});
