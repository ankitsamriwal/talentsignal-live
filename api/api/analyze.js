export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Use POST'});
  const {role,candidates}=req.body||{};
  if(!role?.title||!role?.requirements||!Array.isArray(candidates)||!candidates.length) return res.status(400).json({error:'Add a role, requirements, and at least one candidate.'});
  if(candidates.length>8) return res.status(400).json({error:'Analyze up to 8 candidates at a time.'});
  const key=process.env.TYPESAFE_API_KEY;
  if(!key) return res.status(503).json({error:'Jev is not configured.'});
  const eligible=candidates.filter(c=>c.name?.trim()&&c.profile?.trim()&&c.openToWork===true);
  const excluded=candidates.filter(c=>c.name?.trim()&&c.openToWork!==true).map(c=>({name:c.name,reason:'Not marked open to work'}));
  if(!eligible.length) return res.status(200).json({eligible:[],excluded,meta:{message:'No eligible candidates. Open-to-work is enforced, not inferred.'}});
  const questions={
    market_tightness:{type:'score',instructions:'How difficult is this role likely to fill from the supplied role context?',criteria:['Broad candidate pool; likely quick fill','Moderate search effort','Specialist search; longer fill','Rare combination; very difficult fill']}
  };
  eligible.forEach((c,i)=>{
    questions[`fit_${i}`]={type:'score',instructions:{question:'How strongly does this candidate profile match the role requirements? Judge only supplied evidence.',role_title:role.title,role_requirements:role.requirements,candidate:c},criteria:['Major gaps','Partial match','Strong match','Exceptional direct match']};
    questions[`ready_${i}`]={type:'noul',instructions:{question:'Does the profile show evidence the candidate could credibly enter this role now without a major career-level or domain leap?',role_title:role.title,role_requirements:role.requirements,candidate:c},criteria:{true:'Evidence supports near-term readiness',false:'Major readiness gap or insufficient evidence'}};
    questions[`risk_${i}`]={type:'choice',instructions:{question:'What is the most important hiring concern visible in the supplied profile?',role_requirements:role.requirements,candidate:c},criteria:{'none-visible':'No material concern in supplied evidence','skills-gap':'Required skills or domain evidence is missing','seniority-gap':'Seniority scope does not align','stability-signal':'Short tenures or unexplained movement is visible','evidence-thin':'Profile lacks enough detail to judge'}};
  });
  const started=Date.now();
  const r=await fetch('https://api.typesafe.ai/v1/systemone',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:'jev-latest',state:{role,eligible_candidates:eligible},questions})});
  const data=await r.json();
  if(!r.ok) return res.status(502).json({error:'Jev analysis failed.',detail:data?.message||data?.error||'Upstream error'});
  const tight=data.answers.market_tightness;
  const baseDays=[18,32,52,78][Math.max(0,Math.min(3,Math.round(tight.score??tight.value??1)))]||32;
  const results=eligible.map((c,i)=>{
    const fit=data.answers[`fit_${i}`], ready=data.answers[`ready_${i}`], risk=data.answers[`risk_${i}`];
    const fitValue=fit.score??fit.value??0; const readyP=ready.noul??0;
    const fitPct=Math.round((fitValue/3)*100); const readiness=Math.round(readyP*100);
    const overall=Math.round(fitPct*.72+readiness*.28);
    const evidence=[];
    const text=(c.profile+' '+(c.notes||'')).toLowerCase();
    role.requirements.split(/[,;\n]/).map(x=>x.trim()).filter(x=>x.length>2).forEach(req=>{const toks=req.toLowerCase().split(/\W+/).filter(x=>x.length>3);if(toks.some(t=>text.includes(t))) evidence.push(req)});
    return {name:c.name,overall,fitPct,readiness,risk:risk.choice,riskProbabilities:risk.probabilities,fitDistribution:fit.probabilities,confidence:Math.round(((fit.confidence??0)+(risk.confidence??0))/2*100),evidence:evidence.slice(0,4),gap:evidence.length?'Jev matched supplied evidence; verify depth in interview.':'No direct requirement phrase found; inspect transferable evidence.',timeToFillDays:Math.max(10,Math.round(baseDays*(1.18-overall/250)))};
  }).sort((a,b)=>b.overall-a.overall);
  res.status(200).json({results,excluded,market:{predictedDays:baseDays,level:Math.round(tight.score??tight.value??1),confidence:Math.round((tight.confidence??0)*100),distribution:tight.probabilities},meta:{model:data.model,inputTokens:data.usage?.input_tokens,latencyMs:Date.now()-started,analyzedAt:new Date().toISOString(),policy:'Only candidates explicitly marked open to work were scored.'}});
}
