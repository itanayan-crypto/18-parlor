import React, { useState, useEffect, useRef } from 'react';

/**
 * Parlor – English tutor component. Progress is saved in localStorage.
 */
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

.parlor-root{--bg:#120F26;--bg2:#1A1638;--card:#211D47;--line:#363066;--tx:#F3EFFF;--mute:#A49DD0;--ember:#FF9B54;--ember2:#FF5E7E;--aur:#7CE7FF;--vio:#8F7CFF;--ok:#6DF0B5;--bad:#FF7A90;color-scheme:dark;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);font-family:'DM Sans',system-ui,sans-serif;color:var(--tx);background:radial-gradient(900px 500px at 70% -10%,#2d2570,transparent 70%),radial-gradient(700px 500px at 0 100%,#4a1f5a55,transparent 70%),var(--bg);width:100%;min-height:100vh;min-height:100dvh}
.parlor-root {
*{box-sizing:border-box;margin:0}
html{height:100%;scroll-padding-top:env(safe-area-inset-top,0px)}
body{min-height:100%;background:radial-gradient(900px 500px at 70% -10%,#2d2570,transparent 70%),radial-gradient(700px 500px at 0 100%,#4a1f5a55,transparent 70%),var(--bg);color:var(--tx);font-family:'DM Sans',system-ui,sans-serif}
h1,h2,h3,.disp{font-family:'Bricolage Grotesque','DM Sans',system-ui,sans-serif;letter-spacing:-.02em}
button,input{font:inherit;color:inherit}
button{border:0;background:none;cursor:pointer}
button:disabled{opacity:.45;cursor:not-allowed}
*:focus-visible{outline:2px solid var(--aur);outline-offset:3px}
.shell{display:grid;grid-template-columns:240px minmax(0,1fr) 320px;width:100%;max-width:none;margin:0;min-height:100vh;min-height:100dvh}
.side{position:sticky;top:0;height:100vh;padding:26px 16px;display:flex;flex-direction:column;gap:6px;border-right:1px solid var(--line)}
.logo{display:flex;align-items:center;gap:10px;font-family:'Bricolage Grotesque';font-weight:800;font-size:24px;margin-bottom:22px;padding-left:6px}
.logo i{width:34px;height:34px;border-radius:12px;background:conic-gradient(var(--vio),var(--aur),var(--ember2),var(--vio));display:block}
.nb{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;color:var(--mute);font-weight:600;text-align:left}
.nb span{font-size:22px}.nb.on{background:var(--card);color:var(--tx)}
.sp{flex:1}
.main{padding:32px clamp(20px,4vw,56px) 60px;min-width:0}
.rail{position:sticky;top:0;height:100vh;overflow:auto;padding:30px 20px;display:flex;flex-direction:column;gap:14px;border-left:1px solid var(--line)}
.rail-in{display:none;margin-bottom:20px;flex-direction:column;gap:12px}
h1{font-size:34px;line-height:1.05;font-weight:800}
.sub{color:var(--mute);font-size:15px;margin-top:6px}
.card{background:var(--card);border-radius:22px;padding:16px 18px}
.flame{font-size:42px;filter:drop-shadow(0 0 14px var(--ember));animation:flick 1.6s ease-in-out infinite}
@keyframes flick{50%{transform:scale(1.08) rotate(-3deg)}}
.st{display:flex;gap:14px;align-items:center;background:linear-gradient(135deg,#3a2350,#5d3040);border:1px solid #6b3a62;border-radius:22px;padding:16px 18px}
.st b{font-family:'Bricolage Grotesque';font-size:30px;font-weight:800;line-height:1}
.ring{position:relative;width:70px;height:70px;flex:none}.ring svg{transform:rotate(-90deg)}
.ring span{position:absolute;inset:0;display:grid;place-items:center;font:800 24px 'Bricolage Grotesque'}
.row{display:flex;align-items:center;gap:14px}
.bar{height:8px;border-radius:9px;background:#ffffff18;margin-top:8px;overflow:hidden}
.bar i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,var(--vio),var(--aur));transition:width .8s}
.goal{display:flex;align-items:center;gap:10px;font-size:14px}
.goal i{width:22px;height:22px;border-radius:50%;border:2px solid var(--line);display:grid;place-items:center;font-style:normal;font-size:12px}
.goal.ok i{background:var(--ok);border-color:var(--ok);color:#06281a}
/* path */
.tier{margin-top:30px}
.th{padding:16px 18px;border-radius:22px;border:1px solid var(--c);background:linear-gradient(135deg,color-mix(in srgb,var(--c) 22%,var(--card)),var(--card))}
.th h2{font-size:22px}.th p{color:var(--mute);font-size:14px;margin-top:3px}
.lock .th{opacity:.55;border-color:var(--line)}
.nodes{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 0 4px}
.node{display:flex;flex-direction:column;align-items:center;gap:6px;width:200px;text-align:center}
.nd{width:84px;height:84px;border-radius:50%;display:grid;place-items:center;font-size:36px;background:var(--bg2);border:4px solid var(--line);position:relative;transition:transform .15s}
.node:hover:not(:disabled) .nd{transform:scale(1.07)}
.node.cur .nd{border-color:var(--c);box-shadow:0 0 0 8px color-mix(in srgb,var(--c) 25%,transparent),0 0 40px color-mix(in srgb,var(--c) 60%,transparent);animation:pl 2s ease-in-out infinite}
@keyframes pl{50%{transform:scale(1.06)}}
.node.done .nd{background:var(--c);border-color:var(--c)}
.node strong{font-size:15px}.node small{color:var(--mute);font-size:12.5px}
.node:disabled .nd{filter:grayscale(1);opacity:.55}
.stars{letter-spacing:2px;color:var(--ember);font-size:14px}
/* stage */
.stage{display:flex;flex-direction:column;height:calc(100dvh - 64px);max-height:none;max-width:980px;margin:0 auto;background:linear-gradient(var(--bg2),var(--bg));border:1px solid var(--line);border-radius:28px;overflow:hidden}
.sh{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line)}
.back{width:38px;height:38px;border-radius:12px;background:var(--card);font-size:18px}
.pips{display:flex;gap:6px;margin-left:auto}.pips i{width:26px;height:6px;border-radius:6px;background:#ffffff1f}.pips i.on{background:var(--c)}
.chip{padding:6px 12px;border-radius:99px;background:var(--card);font-weight:600;font-size:13.5px;white-space:nowrap}
.orbbox{display:grid;place-items:center;height:130px;position:relative;flex:none}
.orb{width:76px;height:76px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff9,transparent 35%),conic-gradient(from 0deg,var(--vio),var(--aur),var(--ember2),var(--vio));box-shadow:0 0 40px #8f7cff88;animation:breathe 3s ease-in-out infinite}
.orb.listen{box-shadow:0 0 70px #7ce7ffcc;animation:pulse .9s ease-in-out infinite}
.orb.speak{box-shadow:0 0 70px #ff9b54aa;animation:pulse 1.3s ease-in-out infinite}
@keyframes breathe{50%{transform:scale(1.05)}}@keyframes pulse{50%{transform:scale(1.16)}}
.chat{flex:1;overflow-y:auto;padding:6px 16px 14px;display:flex;flex-direction:column;gap:10px}
.msg{max-width:84%;padding:12px 14px;border-radius:18px;font-size:16px;line-height:1.45;animation:in .3s ease-out}
@keyframes in{from{transform:translateY(8px);opacity:0}}
.msg.ai{background:var(--card);border-bottom-left-radius:5px}
.msg.me{align-self:flex-end;background:#3b3487;border-bottom-right-radius:5px}
.fb{margin-top:10px;padding:10px 12px;border-radius:14px;background:#0f0c2299;font-size:14px;display:flex;flex-direction:column;gap:6px}
.fb s{color:var(--bad)}.fb b{color:var(--ok)}.fb p{color:var(--mute);font-size:13px}
.good{color:var(--ok);font-weight:600}.bonus{color:var(--ember);font-weight:600}
.dots{display:flex;gap:4px;padding:4px}.dots i{width:7px;height:7px;border-radius:50%;background:var(--mute);animation:bl 1s infinite}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}
@keyframes bl{50%{opacity:.25}}
.comp{display:flex;gap:8px;padding:12px 14px calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line);background:var(--bg)}
.comp input{flex:1;min-width:0;padding:14px 16px;border-radius:16px;border:1px solid var(--line);background:var(--card);outline-offset:2px}
.comp input:focus{border-color:var(--aur)}
.mic{width:50px;border-radius:16px;background:var(--card);font-size:20px}
.mic.on{background:var(--ember2);animation:pulse 1s infinite}
.send,.cta{padding:0 20px;border-radius:16px;font-weight:700;background:linear-gradient(90deg,var(--ember),var(--ember2));color:#2a1020}
.cta{padding:15px 24px;font-size:16px;box-shadow:0 10px 30px #ff5e7e44}
.ghost{padding:15px 22px;border-radius:16px;background:var(--card);font-weight:600}
.exb{padding:20px;display:flex;flex-direction:column;gap:16px;flex:1;overflow:auto}
.mode{align-self:flex-start;padding:6px 12px;border-radius:99px;background:var(--c);color:#1a0f24;font-weight:700;font-size:13px}
.q{font:700 26px/1.25 'Bricolage Grotesque';letter-spacing:-.01em}
.ban{padding:14px 16px;border-radius:16px;animation:in .25s}
.ban.ok{background:#6df0b522;border:1px solid var(--ok)}.ban.no{background:#ff7a9022;border:1px solid var(--bad)}
.toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:var(--card);border:1px solid var(--line);padding:12px 18px;border-radius:14px;z-index:30;max-width:90vw;font-size:14px;box-shadow:0 10px 40px #000a}
/* overlay */
.ov{position:fixed;inset:0;z-index:20;background:#0a0818ee;backdrop-filter:blur(8px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:30px;animation:in .4s}
.big{font:800 80px/1 'Bricolage Grotesque';color:var(--ember)}
.stats{display:flex;gap:10px;margin:22px 0;width:100%;max-width:360px}
.stats div{flex:1;padding:12px 6px;border-radius:16px;background:var(--card)}.stats b{display:block;font:700 20px 'Bricolage Grotesque'}.stats small{color:var(--mute);font-size:12px}
.badge{position:relative;width:170px;height:170px;display:grid;place-items:center;margin:10px 0 18px}
.rays{position:absolute;inset:-30px;border-radius:50%;background:repeating-conic-gradient(#ff9b5455 0 8deg,transparent 8deg 24deg);-webkit-mask:radial-gradient(circle,transparent 30%,#000 32%,transparent 70%);mask:radial-gradient(circle,transparent 30%,#000 32%,transparent 70%);animation:rot 12s linear infinite}
@keyframes rot{to{transform:rotate(360deg)}}
.hex{width:130px;height:130px;display:grid;place-items:center;border-radius:36px;background:linear-gradient(135deg,var(--ember),var(--ember2));color:#2a1020;font:800 64px 'Bricolage Grotesque';animation:slam .7s cubic-bezier(.2,1.6,.4,1) both;box-shadow:0 0 60px #ff5e7e88;transform:rotate(-6deg)}
@keyframes slam{from{transform:scale(0) rotate(-40deg)}}
.conf{position:absolute;top:30%;width:9px;height:14px;border-radius:2px;animation:conf 1.8s ease-out forwards;opacity:0}
@keyframes conf{0%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--r))}}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
.bd{padding:16px 8px;border-radius:18px;background:var(--card);text-align:center;font-size:13px;color:var(--mute)}.bd span{display:block;font-size:32px;margin-bottom:4px}.bd.lk{opacity:.4;filter:grayscale(1)}
.pr{margin-bottom:14px}.pr div:first-child{display:flex;justify-content:space-between;font-size:14px}
@media(max-width:1100px){.shell{grid-template-columns:84px minmax(0,1fr)}.rail{display:none}.rail-in{display:flex}.nb .lab,.logo .lab{display:none}.nb{justify-content:center}.side{padding:20px 10px}.logo{justify-content:center;padding:0}}
@media(max-width:700px){.shell{display:block}.side{position:fixed;z-index:15;bottom:0;left:0;right:0;top:auto;height:auto;flex-direction:row;justify-content:space-around;padding:8px 8px calc(8px + env(safe-area-inset-bottom,0px));background:#120F26ee;backdrop-filter:blur(14px);border:0;border-top:1px solid var(--line)}.logo,.sp{display:none}.main{padding:20px 16px 110px}h1{font-size:28px}.stage{height:calc(100dvh - 130px);border-radius:22px}.q{font-size:22px}}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01s!important;animation-iteration-count:1!important}}
body::before{content:'';position:fixed;inset:-20%;z-index:-1;background:radial-gradient(40% 40% at 20% 30%,#7ce7ff22,transparent),radial-gradient(35% 35% at 80% 70%,#ff5e7e22,transparent);animation:drift 20s ease-in-out infinite alternate}
@keyframes drift{to{transform:translate(4%,3%) scale(1.1)}}
.hero{display:flex;align-items:center;gap:14px;width:100%;margin-top:20px;padding:16px 18px;border-radius:24px;text-align:left;background:linear-gradient(120deg,color-mix(in srgb,var(--c) 45%,#1a1638),var(--card));border:1px solid var(--c);box-shadow:0 14px 50px color-mix(in srgb,var(--c) 25%,transparent);transition:transform .15s}
.hero:hover{transform:translateY(-2px)}.hero .em{font-size:38px}.hero small{display:block;color:#fffa;font-size:13px}.hero strong{font:700 22px 'Bricolage Grotesque'}.hero span{margin-left:auto;font-weight:700}
.nodes{position:relative}.nodes::before{content:'';position:absolute;top:30px;bottom:30px;left:50%;border-left:3px dashed var(--line)}.node{position:relative;z-index:1}
.fl{font-size:14px;margin-left:8px;letter-spacing:1px}
.chips{display:flex;flex-wrap:wrap;gap:8px;padding-top:4px}.chips button{padding:7px 12px;border-radius:99px;border:1px dashed var(--line);color:var(--mute);font-size:13.5px}.chips button:hover{border-color:var(--aur);color:var(--tx)}
.ban.no{animation:shake .35s}@keyframes shake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.wk{display:flex;align-items:flex-end;gap:10px;height:140px;padding:16px;border-radius:22px;background:var(--card);margin-top:14px}
.wk div{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:6px;height:100%;font-size:11px;color:var(--mute)}.wk i{width:100%;border-radius:8px 8px 3px 3px;background:linear-gradient(var(--aur),var(--vio));min-height:3px}
.lt{max-width:620px;margin:0 auto;text-align:center}.lt .tm{height:10px;border-radius:9px;background:#ffffff18;overflow:hidden;margin:18px 0}.lt .tm i{display:block;height:100%;background:linear-gradient(90deg,var(--ember),var(--ember2));transition:width 1s linear}
.lt .q{margin:22px 0}.lt input{width:100%;padding:16px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:18px;text-align:center}.lt input.ok{border-color:var(--ok)}.lt input.no{border-color:var(--bad)}.lt .stats{justify-content:center}
.vg{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:18px}
.vc{padding:16px;border-radius:20px;background:var(--card);border:1px solid var(--c);text-align:left}.vc.lk{border-color:var(--line);opacity:.45}.vc b{font:800 22px 'Bricolage Grotesque'}.vc small{display:block;color:var(--mute);margin-top:4px;font-size:13px}
.tier,.hero{max-width:760px;margin-left:auto;margin-right:auto}
.main>div>h1,.main>div>.sub{max-width:760px;margin-left:auto;margin-right:auto}
}
`;

const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const LV=150,KEY='parlor-v3';
/* task: [title,emoji,[3 tutor prompts],target word, [fill],[fix],[say]] */
const TIERS=[
{n:'Starter',c:'#BEF264',d:'Your very first English words',min:2,k:[
 ['Say hello','🙋',['Hello! How are you today?','What is your favorite color?','Do you like pizza?'],'hello',['I ___ happy.',['am'],'Use “to be” with I.'],['She are my friend.',['she is my friend'],'She goes with “is”.'],['Hello, how are you?']],
 ['Days and numbers','📅',['What day is it today?','How many people are in your family?','What is your favorite day?'],'today',['There are seven ___ in a week.',['days'],'Plural noun.'],['I has two brothers.',['i have two brothers'],'I goes with “have”.'],['Today is a good day.']]]},
{n:'Basic',c:'#4ADE80',d:'Short sentences and everyday words',min:3,k:[
 ['Meet someone','👋',['Hi! I’m Mia. What’s your name?','Nice to meet you! Where are you from?','Cool! What do you do every day?'],'from',['I ___ from India.',['am'],'Use the verb “to be”.'],['He go to school.',['he goes to school'],'He/she/it takes -s.'],['Nice to meet you, my name is Sam.']],
 ['Order a coffee','☕',['Welcome! What would you like to drink?','Anything to eat with that?','That’s five dollars. Cash or card?'],'please',['Can I ___ a coffee, please?',['have','get'],'A polite request verb.'],['I want a apple.',['i want an apple'],'“An” before vowel sounds.'],['Can I have a small coffee, please?']]]},
{n:'Elementary',c:'#2DD4BF',d:'Routines, shopping and simple past',min:5,k:[
 ['Daily routine','⏰',['What time do you wake up?','What do you usually do after work?','What did you do yesterday?'],'usually',['She ___ to work by bus every day.',['goes'],'Third person singular.'],['Yesterday I go to the market.',['yesterday i went to the market'],'Past tense of “go”.'],['I usually wake up at seven o’clock.']],
 ['Go shopping','🛍',['Hello! Are you looking for something?','This one is twenty dollars. Do you like it?','Would you like to pay now?'],'size',['How ___ is this jacket?',['much'],'Asking about price.'],['I need some informations.',['i need some information'],'Uncountable noun.'],['Do you have this shirt in a larger size?']]]},
{n:'Intermediate',c:'#60A5FA',d:'Work, health and longer explanations',min:7,k:[
 ['Job interview','💼',['Tell me about yourself and your last job.','What is your biggest strength?','Why do you want to join our team?'],'experience',['I have worked here ___ 2019.',['since'],'A point in time.'],['I am agree with your idea.',['i agree with your idea'],'“Agree” is a verb.'],['I have three years of experience in design.']],
 ['Doctor visit','🩺',['What brings you in today?','How long have you had these symptoms?','Have you taken any medicine?'],'symptoms',['I have had a headache ___ two days.',['for'],'A length of time.'],['Can you explain me the treatment?',['can you explain the treatment to me'],'Explain + to + person.'],['I have had a sore throat for three days.']]]},
{n:'Advanced',c:'#A78BFA',d:'Meetings, conditionals and problem solving',min:9,k:[
 ['Team meeting','📊',['We’re behind schedule. What’s your view?','How would you handle the budget gap?','Can you summarise your next steps?'],'deadline',['If we had more time, we ___ finish.',['would'],'Second conditional.'],['We discussed about the new plan.',['we discussed the new plan'],'No preposition needed.'],['I suggest we postpone the launch until we resolve the issues.']],
 ['Travel trouble','✈️',['Your flight is cancelled. How can I help?','The next seat is tomorrow. Is that acceptable?','Do you need a hotel voucher?'],'compensation',['I would have called earlier if I ___ known.',['had'],'Third conditional.'],['More better option is a refund.',['a better option is a refund'],'Don’t use “more” with -er.'],['I would like to be rebooked on the earliest flight, please.']]]},
{n:'Expert',c:'#FB923C',d:'Persuasion, nuance and formal register',min:11,k:[
 ['Negotiation','🤝',['Our price is firm. Convince me otherwise.','What can you offer in return?','What if we split the difference?'],'leverage',['Had I known the terms, I ___ have signed.',['would not','wouldnt'],'Inverted third conditional.'],['The peoples was unhappy with the deal.',['the people were unhappy with the deal'],'“People” is plural.'],['We are prepared to compromise provided that the terms are fair.']],
 ['Live debate','🎙',['Is remote work better for society? Argue your side.','Your opponent says productivity drops. Respond.','Give your closing statement.'],'evidence',['Not only ___ the plan fail, it cost millions.',['did'],'Inversion after “not only”.'],['Much people disagree.',['many people disagree'],'Countable → many.'],['The evidence suggests that flexibility outweighs the costs.']]]},
{n:'Extreme',c:'#F43F5E',d:'High-stakes speaking, no safety net',min:14,k:[
 ['Press crisis','🚨',['A product failure just hit the news. Address the press.','A journalist asks if you hid the defect. Reply.','Outline how you will rebuild trust.'],'accountability',['We take full ___ for the failure.',['responsibility','accountability'],'A noun for owning it.'],['He have already resigned.',['he has already resigned'],'Present perfect.'],['We are committed to transparency and to restoring public confidence.']],
 ['Keynote','🏆',['You have the stage. Open with a bold hook.','A heckler challenges your claim. Handle it gracefully.','Close with a call to action.'],'vision',['Rarely ___ a technology change so many lives so fast.',['does'],'Inversion after “rarely”.'],['The informations was not accurate.',['the information was not accurate'],'Uncountable noun.'],['Let us not merely imagine the future; let us build it together.']]]},
{n:'Legend',c:'#E879F9',d:'Abstract ideas, precise grammar, zero hesitation',min:16,k:[
 ['Philosophy salon','🧠',['Is free will an illusion? Take a position.','Challenge your own argument with a counterpoint.','Synthesize both views in one thesis.'],'paradox',['Were it not ___ the evidence, I would disagree.',['for'],'“Were it not for…”'],['Neither the manager nor the employees was ready.',['neither the manager nor the employees were ready'],'The verb agrees with the nearest subject.'],['The paradox dissolves once we distinguish freedom from randomness.']],
 ['Courtroom closing','⚖️',['Your Honor, open your closing argument.','Rebut the claim that the evidence is circumstantial.','Appeal to the jury in your final sentence.'],'beyond',['The defendant, ___ alibi collapsed, remained silent.',['whose'],'Possessive relative pronoun.'],['The evidences was overwhelming.',['the evidence was overwhelming'],'Uncountable noun.'],['The evidence places the defendant at the scene beyond any reasonable doubt.']]]},
{n:'Mythic',c:'#FACC15',d:'Diplomacy, lectures and legacy-level speech',min:20,k:[
 ['Diplomatic summit','🌍',['Open the summit with a statement on shared security.','A rival delegate rejects your terms. De-escalate.','Propose a binding framework.'],'sovereignty',['Should tensions ___, we will convene again.',['escalate'],'Should + base verb.'],['If I would be you, I would accept.',['if i were you i would accept'],'Use “were” in the second conditional.'],['We reaffirm our commitment to dialogue while respecting each nation’s sovereignty.']],
 ['Nobel lecture','🏛',['Introduce the discovery that changed your field.','Explain its limits to a skeptical audience.','End with a line people will quote.'],'discovery',['No sooner ___ we published than critics responded.',['had'],'“No sooner had…”'],['Hardly had he arrived when the lights goes out.',['hardly had he arrived when the lights went out'],'Past tense after “when”.'],['Knowledge advances not by certainty but by the courage to be proven wrong.']]]}];
const ALL=TIERS.flatMap((t,ti)=>t.k.map((k,i)=>({id:ti*2+i,ti,i,t:k[0],e:k[1],p:k[2],w:k[3],x:[k[4],k[5],k[6]],min:t.min,c:t.c})));
const MODES=['✍️ Fill the blank','🛠 Fix the sentence','🗣 Say it aloud'];
const PAST={go:'went',see:'saw',eat:'ate',have:'had',buy:'bought',come:'came',take:'took',make:'made'},S3={go:'goes',have:'has',do:'does'};
const RULES=[
 t=>/(^|\s)i(?=[\s'.,!?]|$)/.test(t)&&{w:'i',f:'I',y:'Write “I” with a capital letter.'},
 t=>{const m=t.match(/\b(he|she|it) (go|have|do|like|want|need|work|live|play|think)\b/i);return m&&{w:m[0],f:m[1]+' '+(S3[m[2].toLowerCase()]||m[2].toLowerCase()+'s'),y:'He, she and it take -s in the present simple.'}},
 t=>{const m=t.match(/\byesterday\b[^.!?]*?\b(go|see|eat|have|buy|come|take|make)\b/i);return m&&{w:m[1],f:PAST[m[1].toLowerCase()],y:'“Yesterday” needs the past tense.'}},
 t=>/\bi am agree\b/i.test(t)&&{w:'I am agree',f:'I agree',y:'“Agree” is a verb, so skip “am”.'},
 t=>{const m=t.match(/\bmore (better|easier|bigger|faster)\b/i);return m&&{w:m[0],f:m[1],y:'Don’t add “more” to an -er comparative.'}},
 t=>{const m=t.match(/\ba ([aeio]\w*)/i);return m&&{w:m[0],f:'an '+m[1],y:'Use “an” before a vowel sound.'}},
 t=>/\bdiscuss about\b/i.test(t)&&{w:'discuss about',f:'discuss',y:'“Discuss” needs no preposition.'},
 t=>{const m=t.match(/\b(informations|advices|furnitures|equipments)\b/i);return m&&{w:m[0],f:m[0].slice(0,-1),y:'Uncountable noun: no plural -s.'}},
 t=>/\bpeoples\b/i.test(t)&&{w:'peoples',f:'people',y:'“People” is already plural.'},
 t=>{const m=t.match(/\bmuch (people|friends|things)\b/i);return m&&{w:m[0],f:'many '+m[1],y:'Use “many” with countable nouns.'}},
 t=>/\bdepend of\b/i.test(t)&&{w:'depend of',f:'depend on',y:'We say “depend on”.'},
 t=>/\bexplain me\b/i.test(t)&&{w:'explain me',f:'explain to me',y:'Say “explain to me”.'},
 t=>{const m=t.match(/\b(didn'?t|did not) (went|saw|had|came)\b/i);return m&&{w:m[0],f:m[1]+' '+({went:'go',saw:'see',had:'have',came:'come'})[m[2].toLowerCase()],y:'After “did not”, use the base verb.'}}];
function analyze(text,k){
 const fixes=RULES.map(r=>r(text)).filter(Boolean),n=text.trim().split(/\s+/).length,short=n<k.min,bonus=text.toLowerCase().includes(k.w.toLowerCase()),clean=!fixes.length&&!short;
 return{fixes,short,bonus,clean,n,xp:10+(clean?5:0)+(bonus?10:0)}}
const beep=(f,d=.12)=>{if(beep.off)return;try{const a=beep.c||(beep.c=new (window.AudioContext||window.webkitAudioContext)()),o=a.createOscillator(),g=a.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+d)}catch(e){}};
const FREE=['Let’s just talk! What are you excited about this week?','Interesting! Why does that matter to you?','What was the hardest part, and how did you handle it?','If you could change one thing about it, what would it be?','Last question: what will you do next, and why?'];
const STARTS=[['I usually…','My name is…','Because…'],['I think that…','In my opinion…','On the other hand…'],['Had I known…','Not only…, but also…','That said…']];
const norm=s=>s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const overlap=(a,b)=>{const A=norm(a).split(' '),B=norm(b).split(' ');return B.filter(w=>A.includes(w)).length/B.length};
const speak=(t,on)=>{if(on&&window.speechSynthesis){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.95;speechSynthesis.speak(u)}catch(e){}}};
function useMic(cb){
 const [on,setOn]=useState(false),r=useRef();
 const start=()=>{if(!SR){cb(null,'Speech recognition isn’t supported in this browser. Type your answer instead.');return}
  try{const s=new SR();s.lang='en-US';s.interimResults=true;s.onresult=e=>cb([...e.results].map(x=>x[0].transcript).join(' '));s.onerror=()=>{setOn(false);cb(null,'Mic unavailable. Allow microphone access or type instead.')};s.onend=()=>setOn(false);r.current=s;s.start();setOn(true)}catch(e){cb(null,'Mic unavailable. Type instead.')}};
 return[on,on?()=>r.current&&r.current.stop():start]}
const day=d=>d.toISOString().slice(0,10);
const INIT={xp:0,done:[],stars:{},streak:0,last:'',best:0,xpLog:{}};
const load=()=>{try{return Object.assign({},INIT,JSON.parse(localStorage.getItem(KEY)))}catch(e){return INIT}};
const save=s=>{try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}};

function Ring({v}){const r=30,c=2*Math.PI*r;return (<><svg width="70" height="70"><circle cx="35" cy="35" r={r} fill="none" stroke="#ffffff18" strokeWidth="8"/><circle cx="35" cy="35" r={r} fill="none" stroke="#7CE7FF" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-v)} style={{transition:'strokeDashoffset .8s'}}/></svg></>)}
function Rail({st,cls}){
 const lv=Math.floor(st.xp/LV)+1,today=st.last===day(new Date()),wd=ALL[Math.floor(Date.now()/864e5)%ALL.length];
 return (<><div className={cls}>
  <div className="st"><div className="flame">🔥</div><div><b>{st.streak}-day streak</b><div className="sub" style={{marginTop:4,fontSize:13}}>{today?'Streak safe for today':'Finish a task to keep it'}</div></div></div>
  <div className="card row"><div className="ring"><Ring v={(st.xp%LV)/LV}/><span>{lv}</span></div><div style={{flex:1}}><div className="disp" style={{fontWeight:700,fontSize:18}}>Level {lv}</div><div className="sub" style={{marginTop:2,fontSize:13}}>{LV-st.xp%LV} XP to Level {lv+1}</div></div></div>
  <div className="card"><div className={'goal'+(today?' ok':'')}><i>{today?'✓':''}</i>Daily goal: complete 1 task</div><div className={'goal'+(st.done.length>=1?' ok':'')} style={{marginTop:10}}><i>{st.done.length>=1?'✓':''}</i>Unlock your first tier</div></div><div className="card"><div className="sub" style={{margin:0,fontSize:12.5}}>Word of the day</div><div className="disp" style={{fontSize:26,fontWeight:800,margin:'4px 0'}}>{wd.w}</div><p className="sub" style={{fontSize:13,marginTop:0}}>“{wd.x[2][0]}”</p><button className="ghost" style={{marginTop:10,padding:'8px 14px'}} onClick={()=>speak(wd.x[2][0],true)}>🔊 Hear it</button></div></div></>)}

function PathView({st,open,jump}){
 const cur=ALL.find(k=>!st.done.includes(k.id));
 return (<><div><h1>Your speaking path</h1><p className="sub">Start at Basic and climb to Extreme. Chat, then prove it with an exercise.</p>
 <Rail st={st} cls="rail-in" key="r"/>{cur&&(<><button className="hero" style={{'--c':cur.c}} onClick={()=>open(cur)}><div className="em">{cur.e}</div><div><small>Continue · {TIERS[cur.ti].n}</small><strong>{cur.t}</strong></div><span>Start →</span></button></>)}
 {TIERS.map((t,ti)=>{const ks=ALL.filter(k=>k.ti===ti),unlocked=ti===0||ALL.filter(k=>k.ti===ti-1).every(k=>st.done.includes(k.id));
  return (<><section className={'tier'+(unlocked?'':' lock')} style={{'--c':t.c}} key={ti}>
   <div className="th"><h2>{unlocked?'':'🔒 '}{t.n}<span className="fl">{'🔥'.repeat(Math.min(ti+1,5))}</span></h2><p>{t.d} · {ks.filter(k=>st.done.includes(k.id)).length}/2 done</p>{!unlocked&&(<><button className="ghost" style={{marginTop:10,padding:'8px 14px',fontSize:13}} onClick={()=>jump(ti)}>Skip ahead: start here</button></>)}</div>
   <div className="nodes">{ks.map((k,i)=>{const d=st.done.includes(k.id),isCur=cur&&cur.id===k.id,ok=unlocked&&(k.id===0||st.done.includes(k.id-1));
    return (<><button key={k.id} className={'node'+(d?' done':'')+(isCur?' cur':'')} style={{'--c':t.c,transform:'translateX('+(i?44:-44)+'px)'}} disabled={!ok} onClick={()=>open(k)}><div className="nd">{ok?k.e:'🔒'}</div><strong>{k.t}</strong>{d?(<><span className="stars">{'★'.repeat(st.stars[k.id]||1)}</span></>):(<><small>{ok?'Chat + exercise':'Locked'}</small></>)}</button></>)})}</div></section></>)})}</div></>)}

function Composer({v,set,send,ph,label,toast,off}){
 const [on,tog]=useMic((t,e)=>e?toast(e):set(t));
 return (<><div className="comp"><input value={v} onChange={e=>set(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder={ph} disabled={off} aria-label="Your answer"/><button className={'mic'+(on?' on':'')} onClick={tog} disabled={off} aria-label="Speak your answer">🎙</button><button className="send" onClick={send} disabled={off||!v.trim()}>{label}</button></div></>)}

function Chat({k,voice,toast,back,next}){
 const [m,setM]=useState([{r:'ai',t:k.p[0]}]),[turn,setTurn]=useState(0),[v,setV]=useState(''),[busy,setBusy]=useState(false),[xp,setXp]=useState(0),[orb,setOrb]=useState('speak'),end=useRef(),N=k.p.length;
 useEffect(()=>{speak(k.p[0],voice);const t=setTimeout(()=>setOrb('idle'),1500);return()=>clearTimeout(t)},[]);
 useEffect(()=>{end.current&&end.current.scrollIntoView({behavior:'smooth',block:'end'})},[m,busy]);
 const send=()=>{if(!v.trim()||busy||turn>=N)return;const a=analyze(v,k),n=turn+1;beep(a.clean?660:300);
  setXp(x=>x+a.xp);setM(c=>[...c,{r:'me',t:v,a}]);setV('');setBusy(true);setOrb('listen');setTurn(n);
  setTimeout(()=>{const t=n<N?k.p[n]:(k.id<0?'Nice chat! Collect your XP.':'Great work! Now lock it in with a quick exercise.');setM(c=>[...c,{r:'ai',t}]);speak(t,voice);setOrb('speak');setBusy(false);setTimeout(()=>setOrb('idle'),1500)},800)};
 return (<><div className="stage" style={{'--c':k.c}}>
  <div className="sh"><button className="back" onClick={back} aria-label="Back to path">←</button><div><strong>{k.e} {k.t}</strong><div className="sub" style={{margin:0,fontSize:12.5}}>Target word: <b style={{color:k.c}}>{k.w}</b> · aim for {k.min}+ words</div></div><div className="pips">{Array.from({length:N},(_,i)=>(<><i className={i<turn?'on':''}/></>))}</div><div className="chip">⚡ {xp} XP</div></div>
  <div className="orbbox"><div className={'orb '+orb}></div></div>
  <div className="chat">{m.map((x,i)=>(<><div key={i} className={'msg '+x.r}>{x.t}{x.a&&(<><div className="fb">
    {x.a.clean&&(<><span className="good">✓ Clean sentence · +15 XP</span></>)}
    {x.a.fixes.map((f,j)=>(<><div key={j}><s>{f.w}</s> → <b>{f.f}</b><p>{f.y}</p></div></>))}
    {x.a.short&&(<><p>Stretch it: use at least {k.min} words (you used {x.a.n}).</p></>)}
    {x.a.bonus&&(<><span className="bonus">★ Target word used · +10 XP</span></>)}</div></>)}</div></>))}
   {busy&&(<><div className="msg ai"><div className="dots"><i/><i/><i/></div></div></>)}{!busy&&turn<N&&(<><div className="chips"><button onClick={()=>setV(v+(v?' ':'')+k.w)}>Use “{k.w}”</button>{STARTS[k.ti==null?1:Math.floor(k.ti/3)].map(x=>(<><button key={x} onClick={()=>setV(x.replace('…','')+' ')}>{x}</button></>))}</div></>)}<div ref={end}></div></div>
  {turn>=N&&!busy?(<><div className="comp"><button className="cta" style={{flex:1}} onClick={()=>next(xp)}>{k.id<0?'Collect XP':'Start exercise →'}</button></div></>):(<><Composer v={v} set={setV} send={send} ph="Type here or tap the mic to speak…" label="Send" toast={toast} off={busy}/></>)}
 </div></>)}

function Exercise({k,voice,toast,back,done,chatXp}){
 const [i,setI]=useState(0),[v,setV]=useState(''),[s,setS]=useState(null),[ok,setOk]=useState(0),ex=k.x[i];
 const check=()=>{if(s||!v.trim())return;const good=i===2?overlap(v,ex[0])>=.75:ex[1].map(norm).includes(norm(v));setS(good?'ok':'no');beep(good?660:180);if(good)setOk(o=>o+1)};
 const nxt=()=>{if(i===2){done(chatXp+(ok)*10,ok);return}setI(i+1);setV('');setS(null)};
 const q=i===2?ex[0]:ex[0],ans=i===2?ex[0]:ex[1][0];
 return (<><div className="stage" style={{'--c':k.c}}>
  <div className="sh"><button className="back" onClick={back} aria-label="Back to path">←</button><div><strong>{k.e} {k.t}: exercise</strong><div className="sub" style={{margin:0,fontSize:12.5}}>Answer by typing or speaking</div></div><div className="pips">{[0,1,2].map(n=>(<><i className={n<i||(n===i&&s)?'on':''}/></>))}</div></div>
  <div className="exb"><span className="mode">{MODES[i]}</span>
   <div className="q">{i===0?q:i===1?'Fix this sentence: “'+q+'”':'Say: “'+q+'”'}</div>
   {i===2&&(<><button className="ghost" style={{alignSelf:'flex-start'}} onClick={()=>speak(q,true)}>🔊 Listen first</button></>)}
   {s&&(<><div className={'ban '+s}>{s==='ok'?(<><b className="good">Correct! +10 XP</b></>):(<><b style={{color:'var(--bad)'}}>Not quite.</b></>)}<p className="sub" style={{marginTop:4}}>{s==='no'?(i===2?'Aim for this: ':'Answer: ')+(i===1?ans.charAt(0).toUpperCase()+ans.slice(1)+'. ':ans+'. '):''}{i===2?'':ex[2]}</p></div></>)}
  </div>
  {s?(<><div className="comp"><button className="cta" style={{flex:1}} onClick={nxt}>{i===2?'Finish':'Next'}</button></div></>):(<><Composer v={v} set={setV} send={check} ph={i===2?'Tap 🎙 and say it, or type it':'Type or speak your answer'} label="Check" toast={toast}/></>)}
 </div></>)}

function Results({r,close,retry}){
 const [n,setN]=useState(0),[up,setUp]=useState(false);
 useEffect(()=>{let x=0;const t=setInterval(()=>{x+=Math.max(1,Math.ceil(r.gain/30));if(x>=r.gain){x=r.gain;clearInterval(t)}setN(x)},30);return()=>clearInterval(t)},[]);
 const cols=['#FF9B54','#FF5E7E','#7CE7FF','#8F7CFF','#6DF0B5'],reward=r.ok&&(r.up||r.tierUp);
 if(up)return (<><div className="ov">{Array.from({length:30}).map((_,i)=>(<><i key={i} className="conf" style={{left:(10+(i*3)%80)+'%',background:cols[i%5],'--x':((i%7)-3)*40+'px','--y':(120+(i%5)*40)+'px','--r':(i*57)+'deg',animationDelay:(i%6)*60+'ms'}}/></>))}
  <p className="sub">{r.up?'Level up!':'New tier unlocked'}</p><div className="badge"><div className="rays"/><div className="hex">{r.up?r.level:'🔓'}</div></div>
  <h1>{r.tierUp?r.tierUp+' unlocked':'Level '+r.level}</h1><p className="sub" style={{margin:'8px 0 24px'}}>{r.tierUp?'Harder conversations are waiting for you.':'Keep your streak going to climb faster.'}</p><button className="cta" onClick={close}>Continue</button></div></>);
 return (<><div className="ov"><p className="sub">{r.title||(r.ok?'Task complete':'Almost there')}</p><div className="big">+{n}</div><p className="sub">XP earned</p>
  {!r.free&&(<><div className="stars" style={{fontSize:34,margin:'12px 0'}}>{[1,2,3].map(s=>s<=r.stars?'★':'☆').join(' ')}</div></>)}
  <div className="stats">{(r.sts||[[r.correct+'/3','Exercises'],[r.ok?'Yes':'Not yet','Task unlocked']]).map(([a,b])=>(<><div key={b}><b>{a}</b><small>{b}</small></div></>))}</div>
  {!r.ok&&(<><p className="sub" style={{marginBottom:18}}>Get 2 of 3 correct to unlock the next task.</p></>)}
  <div className="row">{!r.ok&&(<><button className="ghost" onClick={retry}>Retry exercise</button></>)}<button className="cta" onClick={reward?()=>setUp(true):close}>{reward?'Claim reward':'Back to path'}</button></div></div></>)}

function Lightning({st,finish}){
 const top=Math.max(-1,...st.done)+1,pool=ALL.filter(k=>k.id<=top).flatMap(k=>[[k.x[0][0],k.x[0][1],'fill'],[k.x[1][0],k.x[1][1],'fix']]);
 const [on,setOn]=useState(false),[t,setT]=useState(60),[sc,setSc]=useState(0),[cb,setCb]=useState(0),[q,setQ]=useState(null),[v,setV]=useState(''),[fl,setFl]=useState('');
 const pick=()=>setQ(pool[Math.floor(Math.random()*pool.length)]);
 const begin=()=>{setOn(true);setT(60);setSc(0);setCb(0);setV('');pick()};
 useEffect(()=>{if(!on)return;if(t<=0){setOn(false);finish(sc);return}const i=setTimeout(()=>setT(t-1),1000);return()=>clearTimeout(i)},[on,t]);
 const sub=()=>{if(!v.trim())return;const good=q[1].map(norm).includes(norm(v));if(good){setSc(x=>x+1+(cb>=2?1:0));setCb(c=>c+1);setFl('ok');beep(660)}else{setCb(0);setFl('no');beep(180)}setV('');pick();setTimeout(()=>setFl(''),300)};
 return (<><div className="lt"><h1>⚡ Lightning round</h1>{!on?(<><p className="sub">60 seconds. Fix sentences and fill blanks from your unlocked tasks. Three right in a row doubles your points.</p><div className="stats" style={{margin:'24px auto'}}><div><b>{st.best||0}</b><small>Best score</small></div><div><b>{pool.length}</b><small>Questions</small></div></div><button className="cta" onClick={begin}>Start round</button></>):(<><div className="tm"><i style={{width:(t/60*100)+'%'}}/></div><div className="row" style={{justifyContent:'center',gap:12}}><span className="chip">⏱ {t}s</span><span className="chip">Score {sc}</span><span className="chip">🔥 Combo ×{cb}</span></div><div className="q">{q[2]==='fix'?'Fix: “'+q[0]+'”':q[0]}</div><input autoFocus className={fl} value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sub()} placeholder="Type and press Enter" aria-label="Answer"/></>)}</div></>)}
function Vocab({st}){return (<><div><h1>Word bank</h1><p className="sub">Target words from finished tasks unlock here. Tap a card to hear it in a sentence.</p><div className="vg">{ALL.map(k=>{const u=st.done.includes(k.id);return (<><button key={k.id} className={'vc'+(u?'':' lk')} style={{'--c':k.c}} disabled={!u} onClick={()=>speak(k.x[2][0],true)}><b>{u?k.w:'••••••'}</b><small>{u?'“'+k.x[2][0]+'”':TIERS[k.ti].n+' · '+k.t}</small></button></>)})}</div></div></>)}
function Progress({st}){
 const wk=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*864e5);return[d.toLocaleDateString('en',{weekday:'short'}),(st.xpLog||{})[day(d)]||0]}),mx=Math.max(30,...wk.map(x=>x[1]));
 const lv=Math.floor(st.xp/LV)+1,B=[['🎯','First task',st.done.length>=1],['🔥','3-day streak',st.streak>=3],['🌟','Level 3',lv>=3],['🧗','Advanced',st.done.some(i=>i>=8)],['🏅','Expert',st.done.some(i=>i>=10)],['💀','Extreme',st.done.some(i=>i>=12)],['👑','Legend',st.done.some(i=>i>=14)],['🐉','Mythic',st.done.length===ALL.length],['⚡','Speed demon',(st.best||0)>=10],['📚','10 words',st.done.length>=10]];
 return (<><div><h1>Your progress</h1><p className="sub">{st.xp} XP · Level {lv} · {st.done.length}/{ALL.length} tasks</p>
 <Rail st={st} cls="rail-in" key="r"/>
 <h2 style={{margin:'26px 0 0'}}>XP this week</h2><div className="wk">{wk.map(([d,x])=>(<><div key={d}>{x}<i style={{height:(x/mx*70)+'%'}}/>{d}</div></>))}</div><h2 style={{margin:'26px 0 14px'}}>Levels</h2>
 {TIERS.map((t,ti)=>{const d=ALL.filter(k=>k.ti===ti&&st.done.includes(k.id)).length;return (<><div className="pr" key={ti}><div><span>{t.n}</span><b>{d}/2</b></div><div className="bar"><i style={{width:d*50+'%',background:t.c}}/></div></div></>)})}
 <h2 style={{margin:'26px 0 14px'}}>Badges</h2><div className="grid">{B.map(([e,t,u])=>(<><div className={'bd'+(u?'':' lk')} key={t}><span>{e}</span>{t}</div></>))}</div></div></>)}

export default function Parlor(){
 const [st,setSt]=useState(load),[scr,setScr]=useState('path'),[k,setK]=useState(null),[chatXp,setChatXp]=useState(0),[res,setRes]=useState(null),[voice,setVoice]=useState(true),[tt,setTt]=useState('');
 beep.off=!voice;useEffect(()=>save(st),[st]);
 const toast=m=>{setTt(m);setTimeout(()=>setTt(''),3500)};
 const open=t=>{setK(t);setScr('chat')};
 const finish=(gain,correct)=>{
  const ok=correct>=2,stars=correct===3?3:correct===2?2:1;let{xp,streak,last}=st;let done=[...st.done];const sts={...st.stars};xp+=gain;let tierUp=null;
  if(ok){if(!done.includes(k.id)){done=[...done,k.id];if(k.ti<TIERS.length-1&&ALL.filter(x=>x.ti===k.ti).every(x=>done.includes(x.id)))tierUp=TIERS[k.ti+1].n}
   sts[k.id]=Math.max(sts[k.id]||0,stars);const td=day(new Date()),y=day(new Date(Date.now()-864e5));if(last!==td){streak=last===y?streak+1:1;last=td}}
  const up=Math.floor(xp/LV)>Math.floor(st.xp/LV);
  const tdd=day(new Date());setSt({...st,xp,done,stars:sts,streak,last,xpLog:{...st.xpLog,[tdd]:(st.xpLog[tdd]||0)+gain}});setRes({gain,stars:ok?stars:0,correct,ok,up,level:Math.floor(xp/LV)+1,tierUp});setScr('path')};
 const jump=ti=>{if(confirm('Start at '+TIERS[ti].n+'? Earlier tiers will count as skipped.'))setSt({...st,done:[...new Set([...st.done,...ALL.filter(x=>x.ti<ti).map(x=>x.id)])]})};
 const bump=(x,extra)=>{const current=st,td=day(new Date()),y=day(new Date(Date.now()-864e5));let{streak,last}=current;if(last!==td){streak=last===y?streak+1:1;last=td}const xp=current.xp+x;setSt({...current,...extra,xp,streak,last,xpLog:{...current.xpLog,[td]:(current.xpLog[td]||0)+x}});return{up:Math.floor(xp/LV)>Math.floor(current.xp/LV),level:Math.floor(xp/LV)+1}};
 const finishFree=x=>{const u=bump(x);setRes({gain:x,free:true,ok:true,title:'Chat complete',sts:[[x,'XP'],['Free','Mode']],tierUp:null,...u});setScr('path')};
 const finishLight=sc=>{const b=Math.max(st.best||0,sc),u=bump(sc*5,{best:b});setRes({gain:sc*5,free:true,ok:true,title:'Time’s up',sts:[[sc,'Correct'],[b,'Best score']],tierUp:null,...u})};
 const go=id=>{if(id==='free'){const c=ALL.find(x=>!st.done.includes(x.id)),ti=c?c.ti:TIERS.length-1;setK({id:-1,t:'Free talk',e:'💬',p:FREE,w:'because',min:Math.min(3+2*ti,20),c:'#7CE7FF',ti,x:[]});setScr('chat')}else setScr(id)};
 const nav=[['path','🗺','Path'],['free','💬','Free talk'],['light','⚡','Lightning'],['vocab','📚','Words'],['prog','📈','Progress']];
 return (<div className="parlor-root"><style>{CSS}</style><div className="shell">
  <aside className="side"><div className="logo"><i/><span className="lab">Parlor</span></div>
   {nav.map(([id,e,l])=>(<><button key={id} className={'nb'+(scr===id||(id==='path'&&(scr==='chat'||scr==='ex'))?' on':'')} onClick={()=>go(id)}><span>{e}</span><span className="lab">{l}</span></button></>))}
   <div className="sp"/><button className="nb" onClick={()=>{setVoice(!voice);if(voice&&window.speechSynthesis)speechSynthesis.cancel()}} aria-pressed={voice}><span>{voice?'🔊':'🔇'}</span><span className="lab">Tutor voice {voice?'on':'off'}</span></button>
   <button className="nb" onClick={()=>{if(confirm('Reset all progress?')){setSt(INIT);setScr('path')}}}><span>↺</span><span className="lab">Reset</span></button></aside>
  <main className="main">
   {scr==='path'&&(<><PathView st={st} open={open} jump={jump}/></>)}
   {scr==='prog'&&(<><Progress st={st}/></>)}
   {scr==='light'&&(<><Lightning st={st} finish={finishLight}/></>)}
   {scr==='vocab'&&(<><Vocab st={st}/></>)}
   {scr==='chat'&&(<><Chat key={k.id} k={k} voice={voice} toast={toast} back={()=>setScr('path')} next={x=>k.id<0?finishFree(x):(setChatXp(x),setScr('ex'))}/></>)}
   {scr==='ex'&&(<><Exercise key={k.id+'e'+(res?res.gain:0)} k={k} voice={voice} toast={toast} chatXp={chatXp} back={()=>setScr('path')} done={finish}/></>)}
  </main>
  <aside className="rail"><Rail st={st} cls="" key="r"/></aside>
  {res&&(<><Results r={res} close={()=>setRes(null)} retry={()=>{setRes(null);setScr('ex')}}/></>)}
  {tt&&(<><div className="toast" role="status">{tt}</div></>)}
 </div></div>)}