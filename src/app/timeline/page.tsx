'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import WikiNavbar from '@/components/WikiNavbar';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllCharacters } from '@/lib/hamieverse/characters';
import {
  ButterflyIcon, LeafIcon, FactoryIcon, LightbulbIcon, TerminalIcon, MaskIcon,
  SeedlingIcon, SearchIcon, SwordIcon, SparkleIcon, QuestionIcon, RefreshIcon,
  ArrowRightIcon
} from '@/components/Icons';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  era: 'veynar_prologue' | 'before_city' | 'city_life' | 'awakening' | 'undercode' | 'conspiracy';
  type: 'origin' | 'discovery' | 'conflict' | 'transformation' | 'mystery' | 'turning_point';
  description: string;
  expandedContent: string;
  significance: string;
  characters: string[];
  leadsTo?: string[];
  triggeredBy?: string[];
}

const timelineEvents: TimelineEvent[] = [
  // Veynar Prologue Era
  {
    id: 'veynar-butterfly',
    title: 'The Butterfly Incident',
    date: 'Unknown Year',
    era: 'veynar_prologue',
    type: 'origin',
    description: 'A young Silas witnesses a butterfly in the Veynar estate. His father, Alistair, crushes it as a lesson.',
    expandedContent: `In the sterile halls of the Veynar manor, young Silas discovered a rare butterfly that had somehow found its way inside. Its wings shimmered with iridescent colors - a fragment of beauty in an otherwise cold world.

When Alistair Veynar found his son admiring the creature, he said nothing at first. Then, with calculated precision, he crushed it beneath his heel.

"Beauty is a distraction. Emotion is weakness. The Veynars do not indulge in either."

Silas learned that day to hide everything that made him feel alive.`,
    significance: 'This moment shaped Silas into the emotionally suppressed enforcer he would become, while planting seeds of silent rebellion.',
    characters: ['silas'],
    leadsTo: ['veynar-fall'],
  },
  {
    id: 'veynar-fall',
    title: 'Fall of House Veynar',
    date: 'Pre-Migration Era',
    era: 'veynar_prologue',
    type: 'conflict',
    description: 'The noble Veynar family loses everything. Silas is forced to become an enforcer to survive.',
    expandedContent: `The Veynar dynasty, once among the most powerful noble houses, collapsed almost overnight. Financial ruin, political enemies, and whispered accusations of sedition combined to destroy generations of accumulated power.

Alistair Veynar died - some say by his own hand, others whisper darker truths. Silas, barely an adult, found himself with nothing but his family name and the cold lessons his father had drilled into him.

The IronPaws offered him a choice: become an enforcer, or be forgotten. He chose survival. The butterfly boy was buried beneath layers of armor and duty.`,
    significance: 'The transformation of Silas from noble heir to IronPaw enforcer created one of the most conflicted figures in Aetherion.',
    characters: ['silas'],
    triggeredBy: ['veynar-butterfly'],
    leadsTo: ['section-9-rise'],
  },

  // Before the City Era
  {
    id: 'virella-childhood',
    title: 'Childhood in Virella',
    date: 'Year Unknown - Before Migration',
    era: 'before_city',
    type: 'origin',
    description: 'Hamie grows up in the rural Beyond with his grandmother, learning the old ways.',
    expandedContent: `Virella was a place outside Aetherion's surveillance grid - a patch of green in a world increasingly dominated by the city's expansion. Here, Hamie knew grass beneath his feet and stars without light pollution.

His grandmother taught him through stories and simple tasks. They roasted crickets over open fires and collected herbs from the forest edge. She spoke of a time before the city, when hamsters lived freely without numbers or surveillance.

"Remember this," she would say. "Remember that you are more than what they will try to make you."

He didn't understand then. He would later.`,
    significance: 'These formative memories of freedom became the foundation for Hamie\'s eventual rebellion against the system.',
    characters: ['hamie'],
    leadsTo: ['grandma-loss', 'migration'],
  },
  {
    id: 'grandma-loss',
    title: 'Loss of Grandmother',
    date: 'Pre-Migration',
    era: 'before_city',
    type: 'turning_point',
    description: 'Hamie\'s grandmother passes, leaving him alone and vulnerable to the city\'s reach.',
    expandedContent: `She passed quietly in her sleep, surrounded by the herbs she had spent her life cultivating. Hamie was too young to fully understand death, but he understood absence.

The Beyond couldn't protect a young hamster alone. Aetherion's migration officers found him within weeks, their Red Eyes scanning, cataloging, assigning.

"Orphan detected. Suitable for labor integration. Designation pending."

As they led him toward the city's glow, Hamie clutched the only thing he had left: a small pendant his grandmother had pressed into his hand on her final night.

"Keep this hidden," she had whispered. "When the time comes, you'll know."`,
    significance: 'The loss of his grandmother set Hamie on the path to becoming Worker #146B, while the pendant would later prove pivotal.',
    characters: ['hamie'],
    triggeredBy: ['virella-childhood'],
    leadsTo: ['migration'],
  },
  {
    id: 'migration',
    title: 'The Migration to Aetherion',
    date: 'Year 0 (Personal Timeline)',
    era: 'before_city',
    type: 'transformation',
    description: 'Hamie enters The City, leaving behind the world he knew.',
    expandedContent: `The city walls rose like metal cliffs, blocking out the sun Hamie had always known. Inside, everything was steel and glass and the constant hum of surveillance.

The migration processing center stripped away his name. "Emotional designations create inefficiency," the automated voice explained. "You are Worker #146B. Your function is production. Your purpose is compliance."

He was given a uniform, a bunk number, and a daily quota. The pendant remained hidden, tucked beneath his work clothes where the scanners somehow never detected it.

In the migration queue, he glimpsed others like him - hamsters from the Beyond, their eyes still holding traces of sky and grass. By month's end, those traces were gone from most of them.`,
    significance: 'The migration represented the complete transformation from free individual to numbered worker - the system Hamie would eventually challenge.',
    characters: ['hamie'],
    triggeredBy: ['grandma-loss'],
    leadsTo: ['worker-146b'],
  },

  // City Life Era
  {
    id: 'worker-146b',
    title: 'Life as Worker #146B',
    date: 'Years 0-3',
    era: 'city_life',
    type: 'origin',
    description: 'Hamie adapts to factory life under constant surveillance, learning to survive the system.',
    expandedContent: `Every day was identical. Wake at 0500. Report to Station 7. Meet quota. Avoid the Red Eyes. Sleep. Repeat.

Worker #146B became skilled at being invisible. He learned which supervisors to avoid, which hallways had blind spots in the surveillance, and how to appear compliant while holding onto something deeper.

The factory produced components for the city's infrastructure - ironic, given how that infrastructure was designed to control workers like him. Each piece he assembled was another link in Aetherion's chains.

Three years of this. Three years of watching others break down, disappear, or become truly empty. Three years of wondering if his grandmother's pendant was anything more than a cruel reminder of what he'd lost.`,
    significance: 'This period of oppression gave Hamie intimate knowledge of the system\'s weaknesses - knowledge he would later exploit.',
    characters: ['hamie'],
    triggeredBy: ['migration'],
    leadsTo: ['overpass-encounter'],
  },
  {
    id: 'section-9-rise',
    title: 'Formation of Section 9',
    date: 'Year 2',
    era: 'city_life',
    type: 'conflict',
    description: 'Aetherion creates an elite enforcement division. Silas rises through IronPaw ranks.',
    expandedContent: `The authorities needed more than standard IronPaws. They needed hunters who could operate in the shadows, who could find resistance cells before they formed and eliminate threats before they materialized.

Section 9 was born from this need - a covert unit answering only to Aetherion's inner council. They were given broad authority and limited oversight. Their methods were efficient and their results were undeniable.

Silas Veynar caught their attention. Here was an enforcer who showed neither hesitation nor remorse, whose noble training made him effective and whose personal losses made him loyal. They saw a weapon.

What they didn't see was the butterfly he sometimes glimpsed in his dreams.`,
    significance: 'Section 9\'s creation established the enforcement apparatus that would later hunt Hamie and threaten the Undercode.',
    characters: ['silas'],
    triggeredBy: ['veynar-fall'],
    leadsTo: ['section-9-cleanup'],
  },
  {
    id: 'overpass-encounter',
    title: 'The Overpass Encounter',
    date: 'Year 3, Month 7',
    era: 'city_life',
    type: 'discovery',
    description: 'Hamie meets a homeless man living beneath the overpass with a dog named Simba.',
    expandedContent: `He found them by accident - a detour to avoid an IronPaw checkpoint led Hamie beneath Overpass 17. There, in a forgotten corner of the city's infrastructure, lived an old hamster and his dog.

"Name's not important," the man said. "Names are what they use to control you. But this fellow here," he gestured to the mongrel beside him, "I call him Simba. Means lion. Because even small things can be fierce."

Over the following weeks, Hamie returned whenever he could. The old man spoke in riddles and fragments, but his words planted seeds.

"The city runs on more than power," he said once. "It runs on belief. Make them doubt their systems, and you shake the foundations."

Then he pressed something into Hamie's hand - a cracked pendant that looked ordinary but felt somehow significant.

"Hold onto this. And when the time comes, look deeper."`,
    significance: 'The homeless man\'s wisdom and the pendant set Hamie on the path to discovering the Undercode.',
    characters: ['hamie'],
    triggeredBy: ['worker-146b'],
    leadsTo: ['section-9-cleanup', 'pendant-discovery'],
  },

  // The Awakening Era
  {
    id: 'section-9-cleanup',
    title: 'Section 9 Cleanup Operation',
    date: 'Year 3, Month 8',
    era: 'awakening',
    type: 'conflict',
    description: 'IronPaw enforcers purge the underpass. The homeless man disappears. Hamie is questioned.',
    expandedContent: `They came at night - Section 9 operatives in dark armor, their movements precise and coordinated. Overpass 17 was deemed a "security concern" and scheduled for "remediation."

Hamie arrived the next day to find nothing. The old man, Simba, their meager shelter - all gone. In their place were scorch marks and warning signs.

Hours later, Worker #146B was pulled aside by a supervisor. "You've been observed deviating from approved routes," the voice said. "Explain your connection to Subject #101B."

He claimed ignorance. They seemed unconvinced but lacked evidence. A senior worker - #257A - intervened with bureaucratic misdirection that temporarily satisfied the interrogators.

But Hamie knew: they were watching him now. And somewhere in the city, an old man and his dog had either escaped or been silenced.`,
    significance: 'This event pushed Hamie from passive survival toward active rebellion, while introducing him to #257A.',
    characters: ['hamie'],
    triggeredBy: ['overpass-encounter'],
    leadsTo: ['pendant-discovery', '257a-intervention'],
  },
  {
    id: 'pendant-discovery',
    title: 'The Pendant\'s Secret',
    date: 'Year 3, Month 9',
    era: 'awakening',
    type: 'discovery',
    description: 'Hamie discovers the pendant contains a hidden bridge chip and USB drive.',
    expandedContent: `The pendant had always felt heavier than it should. After the overpass incident, Hamie finally understood the old man's words: "Look deeper."

Using tools borrowed from the factory floor, he carefully pried apart the pendant's casing. Inside, hidden within false compartments, he found two objects: a bridge chip capable of bypassing standard Aetherion security protocols, and a micro USB drive of a type he'd never seen.

The drive's contents were encrypted, but the bridge chip allowed him to access terminals without triggering surveillance. It was contraband of the highest order - possession alone meant memory erasure at minimum, termination at worst.

His grandmother had known. The old man had known. They had been preparing him for something he was only beginning to understand.`,
    significance: 'The pendant\'s contents gave Hamie the tools to access the Undercode, fundamentally changing his role in the city.',
    characters: ['hamie'],
    triggeredBy: ['overpass-encounter', 'section-9-cleanup'],
    leadsTo: ['undercode-entry'],
  },
  {
    id: '257a-intervention',
    title: '#257A Intervenes',
    date: 'Year 3, Month 9',
    era: 'awakening',
    type: 'turning_point',
    description: 'Senior worker #257A saves Hamie from self-termination protocol using Protocol Four-Seven-Grey.',
    expandedContent: `The pressure had become unbearable. Between increased surveillance, the loss of the old man, and the weight of his discoveries, Hamie made a desperate decision: he would trigger self-dismissal, removing himself from the system entirely.

He was mid-process when #257A appeared, speaking the words that froze the automated response: "Protocol Four-Seven-Grey. Supervisory override. This worker is under administrative review."

It was a lie - no such review existed. But #257A spoke with enough authority that the system paused, buying time.

"You're not the first to try this," #257A said quietly. "And you won't be the last. But you have something they want, which means you have leverage. Don't waste it by giving up."

#257A never revealed how much they knew. But from that day, Hamie understood he had an ally somewhere in the machine.`,
    significance: 'This intervention saved Hamie\'s life and proved that resistance existed within the system itself.',
    characters: ['hamie'],
    triggeredBy: ['section-9-cleanup'],
    leadsTo: ['undercode-entry'],
  },

  // The Undercode Era
  {
    id: 'undercode-entry',
    title: 'Welcome to the Undercode',
    date: 'Year 3, Month 10',
    era: 'undercode',
    type: 'discovery',
    description: 'Hamie accesses the shadow digital ecosystem beneath Aetherion\'s official networks.',
    expandedContent: `The bridge chip opened doors Hamie never knew existed. Beneath Aetherion's clean, monitored networks lay something else entirely: the Undercode.

It was chaos and order intertwined - hidden markets, encrypted communications, and digital spaces where surveillance couldn't reach. Here, identities were fluid, credits flowed through untraceable channels, and information was the ultimate currency.

His first hours were overwhelming. Echo raids, viral loops, echoloops that could crash markets - the terminology alone was foreign. But gradually, guided by cryptic messages from entities he couldn't verify, Hamie learned to navigate.

The USB drive's encryption finally yielded to Undercode tools. Inside: coordinates, access codes, and a single message.

"The game begins. Choose your alias."`,
    significance: 'Entering the Undercode transformed Hamie from victim to player, giving him access to tools that could challenge Aetherion.',
    characters: ['hamie'],
    triggeredBy: ['pendant-discovery', '257a-intervention'],
    leadsTo: ['simba-alias', 'aethercreed-operation'],
  },
  {
    id: 'simba-alias',
    title: 'Rise of "Simba"',
    date: 'Year 3, Month 11',
    era: 'undercode',
    type: 'transformation',
    description: 'Hamie adopts the alias "Simba" in honor of the old man\'s dog, becoming a figure in the Undercode.',
    expandedContent: `Every operator in the Undercode needed an alias - a name that couldn't be traced back to a worker number or residential file. Hamie thought of the old man's words: "Even small things can be fierce."

He became Simba.

The name spread through encrypted channels. Simba - the new operator who used old-model bridge tech. Simba - who somehow avoided the standard honeypots. Simba - whose origins no one could verify.

He kept his operations small at first: information trades, minor echo raids, testing the systems. Each success built confidence. Each close call taught caution.

Worker #146B still reported for duty, met quotas, avoided attention. But beneath that surface, Simba was learning to roar.`,
    significance: 'The creation of the Simba identity allowed Hamie to operate freely in the Undercode while maintaining his cover.',
    characters: ['hamie'],
    triggeredBy: ['undercode-entry'],
    leadsTo: ['aethercreed-operation'],
  },
  {
    id: 'aethercreed-operation',
    title: 'The Aethercreed Operation',
    date: 'Year 4, Day 1 - 13,000,000 AC',
    era: 'undercode',
    type: 'turning_point',
    description: 'A single click during a coordinated operation nets Simba 13 million Aetherion Credits.',
    expandedContent: `It was supposed to be a small operation - exploiting a temporary vulnerability in Aetherion's credit distribution system. Simba was one of dozens of operators participating in the coordinated strike.

But something went wrong. Or right. The vulnerability was larger than anyone anticipated, and the echoloop Simba deployed caught a cascade of misdirected funds.

When the dust settled, his anonymous account showed a balance that made no sense: +13,000,000 AC.

The Undercode erupted. Some operators wanted his head - that kind of haul drew attention. Others wanted to recruit him. The entity known only as "The Architect" sent a single message: "Impressive. Dangerous. We should talk."

Simba had become too visible. But he also had resources beyond anything he'd imagined.`,
    significance: 'The Aethercreed windfall made Simba a target but also gave him the resources to affect real change.',
    characters: ['hamie'],
    triggeredBy: ['simba-alias', 'undercode-entry'],
    leadsTo: ['doppel-protocol', 'respeculators-contact'],
  },
  {
    id: 'doppel-protocol',
    title: 'The Doppel Protocol',
    date: 'Year 4, Month 2',
    era: 'undercode',
    type: 'mystery',
    description: 'Hamie deploys the forbidden mimic-script to evade detection. The Red Eye in his ceiling goes dark.',
    expandedContent: `The increased surveillance following Aethercreed was suffocating. Simba needed to disappear, at least partially. The answer came from a forbidden corner of the Undercode: the Doppel Protocol.

It was a mimic-script - software that could duplicate a worker's biometric signatures and behavioral patterns, projecting them to surveillance systems while the real person moved freely. Its use was punishable by immediate termination.

The deployment was risky. One miscalculation and the Red Eye in his ceiling would alert Section 9. But Hamie had studied the systems for years. He understood their rhythms.

The script activated. For a moment, nothing happened. Then the Red Eye's perpetual glow flickered... and went dark.

For the first time since arriving in Aetherion, Worker #146B was invisible.`,
    significance: 'The Doppel Protocol gave Hamie complete freedom of movement, but also marked him as someone with access to forbidden technology.',
    characters: ['hamie'],
    triggeredBy: ['aethercreed-operation'],
    leadsTo: ['respeculators-contact'],
  },

  // The Conspiracy Era
  {
    id: 'respeculators-contact',
    title: 'The Respeculators Reach Out',
    date: 'Year 4, Month 3',
    era: 'conspiracy',
    type: 'mystery',
    description: 'Sam and Lira\'s shadow coalition identifies Simba as a potential asset - or threat.',
    expandedContent: `They called themselves the Respeculators - an elite coalition operating in the spaces between official power and underground resistance. Their methods were unknown, their goals unclear, but their influence was undeniable.

Sam and Lira ran operations from locations that didn't officially exist. They had watched Simba's rise with professional interest. The Aethercreed haul, the Doppel Protocol deployment - these weren't the actions of an amateur.

The message came through seven different relay points: "We know what you are. We know what you've done. We're not your enemy, but we could be. Let's talk."

For Simba, it was a crossroads. The Respeculators could be allies or executioners. Their rebellion might be genuine or a mask for something darker.

Either way, declining wasn't an option. They clearly knew too much already.`,
    significance: 'Contact with the Respeculators pulled Hamie into a larger conflict involving factions he didn\'t fully understand.',
    characters: ['hamie', 'sam', 'lira'],
    triggeredBy: ['aethercreed-operation', 'doppel-protocol'],
    leadsTo: ['neon-spire'],
  },
  {
    id: 'neon-spire',
    title: 'Neon Spire Invitation',
    date: 'Year 4, Month 4',
    era: 'conspiracy',
    type: 'mystery',
    description: 'A coded message with an ancient emblem arrives. The meeting point: Neon Spire, midnight.',
    expandedContent: `The invitation was unlike anything in Simba's experience. It bypassed every security protocol he had established, appearing directly in his most secure communication channel.

The message contained coordinates for Neon Spire - one of Aetherion's most visible landmarks, heavily surveilled and crawling with IronPaws. The meeting time was midnight, when security was theoretically at its peak.

Most tellingly, the message bore an emblem he recognized from his grandmother's stories: the mark of the Old Code, a symbol from before Aetherion's founding. Whoever sent this knew about the past in ways that shouldn't be possible.

"The game has just begun," the message concluded. "Choose your next move carefully. Not everyone at the table plays fair."

Simba prepared for the meeting, knowing that nothing would be the same afterward. The small hamster who had once roasted crickets in Virella was about to enter a conflict that would reshape the city itself.`,
    significance: 'The Neon Spire meeting represents the transition from Hamie\'s personal journey to his role in a larger conspiracy.',
    characters: ['hamie'],
    triggeredBy: ['respeculators-contact'],
  },
];

const eras = {
  veynar_prologue: { name: 'Veynar Prologue', color: 'var(--neutral-400)', icon: <ButterflyIcon size={16} /> },
  before_city: { name: 'Before the City', color: 'var(--brand-secondary)', icon: <LeafIcon size={16} /> },
  city_life: { name: 'City Life', color: 'var(--neutral-500)', icon: <FactoryIcon size={16} /> },
  awakening: { name: 'The Awakening', color: 'var(--brand-primary)', icon: <LightbulbIcon size={16} /> },
  undercode: { name: 'The Undercode', color: 'var(--brand-accent)', icon: <TerminalIcon size={16} /> },
  conspiracy: { name: 'The Conspiracy', color: 'var(--brand-purple)', icon: <MaskIcon size={16} /> },
};

const eventTypes = {
  origin: { name: 'Origin', color: 'var(--brand-secondary)', icon: <SeedlingIcon size={16} /> },
  discovery: { name: 'Discovery', color: 'var(--brand-primary)', icon: <SearchIcon size={16} /> },
  conflict: { name: 'Conflict', color: 'var(--brand-danger)', icon: <SwordIcon size={16} /> },
  transformation: { name: 'Transformation', color: 'var(--brand-purple)', icon: <SparkleIcon size={16} /> },
  mystery: { name: 'Mystery', color: 'var(--brand-accent)', icon: <QuestionIcon size={16} /> },
  turning_point: { name: 'Turning Point', color: '#FFD700', icon: <RefreshIcon size={16} /> },
};

export default function TimelinePage() {
  const allCharacters = getAllCharacters();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const eventRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Group events by era
  const groupedEvents = timelineEvents.reduce((acc, event) => {
    if (!acc[event.era]) acc[event.era] = [];
    acc[event.era].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const scrollToEvent = (eventId: string) => {
    const element = eventRefs.current[eventId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setExpandedEvent(eventId);
    }
  };

  const getCharacterName = (charId: string) => {
    const normalizedId = charId.toLowerCase();
    const char = allCharacters.find(c => c.id.toLowerCase() === normalizedId);
    return char?.displayName || charId;
  };

  const breadcrumbItems = [
    { label: 'Wiki', href: '/' },
    { label: 'Timeline' },
  ];

  return (
    <div className="wiki-container">
      <WikiNavbar currentPage="timeline" />

      {/* Header */}
      <header className="lore-timeline-header">
        <div className="lore-timeline-header-content">
          <Breadcrumb items={breadcrumbItems} />
          <div className="lore-timeline-title-row">
            <span className="lore-timeline-icon" aria-hidden="true">&#x1F4DC;</span>
            <h1>Hamieverse Lore Timeline</h1>
          </div>
          <p className="lore-timeline-subtitle">
            Explore the complete history of the Hamieverse - from the fall of House Veynar
            to Hamie's rise as Simba in the Undercode
          </p>
        </div>
      </header>

      {/* Timeline */}
      <main className="lore-timeline-main">
        {Object.entries(groupedEvents).map(([eraKey, events]) => {
          const era = eras[eraKey as keyof typeof eras];
          return (
            <section key={eraKey} className="lore-timeline-era">
              <div className="lore-era-header" style={{ '--era-color': era.color } as React.CSSProperties}>
                <span className="lore-era-icon">{era.icon}</span>
                <h2>{era.name}</h2>
                <span className="lore-era-count">{events.length} events</span>
              </div>

              <div className="lore-timeline-events">
                <div className="lore-timeline-line" style={{ '--line-color': era.color } as React.CSSProperties} />

                {events.map((event, index) => {
                  const eventType = eventTypes[event.type];
                  const isExpanded = expandedEvent === event.id;
                  const isEven = index % 2 === 0;

                  return (
                    <div
                      key={event.id}
                      ref={(el) => { eventRefs.current[event.id] = el; }}
                      className={`lore-event ${isExpanded ? 'expanded' : ''} ${isEven ? 'lore-event-left' : 'lore-event-right'}`}
                      style={{ '--event-color': eventType.color } as React.CSSProperties}
                    >
                      <div className="lore-event-connector">
                        <div className="lore-event-dot" />
                      </div>

                      <div
                        className="lore-event-card"
                        onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                      >
                        <div className="lore-event-header">
                          <span className="lore-event-type-badge">
                            {eventType.icon} {eventType.name}
                          </span>
                          <span className="lore-event-date">{event.date}</span>
                        </div>

                        <h3 className="lore-event-title">{event.title}</h3>
                        <p className="lore-event-description">{event.description}</p>

                        {/* Characters involved */}
                        {event.characters.length > 0 && (
                          <div className="lore-event-characters">
                            {event.characters.map(charId => (
                              <Link
                                key={charId}
                                href={`/character/${charId}`}
                                className="lore-character-chip"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {getCharacterName(charId)}
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Expand indicator */}
                        <div className="lore-event-expand-hint">
                          <span>{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
                          <span className={`lore-expand-arrow ${isExpanded ? 'rotated' : ''}`}>▼</span>
                        </div>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="lore-event-expanded">
                            <div className="lore-expanded-section">
                              <h4>Full Account</h4>
                              <div className="lore-expanded-content">
                                {event.expandedContent.split('\n\n').map((paragraph, i) => (
                                  <p key={i}>{paragraph}</p>
                                ))}
                              </div>
                            </div>

                            <div className="lore-expanded-section">
                              <h4>Historical Significance</h4>
                              <p className="lore-significance">{event.significance}</p>
                            </div>

                            {/* Event connections */}
                            {(event.triggeredBy || event.leadsTo) && (
                              <div className="lore-event-connections">
                                {event.triggeredBy && event.triggeredBy.length > 0 && (
                                  <div className="lore-connection-group">
                                    <span className="lore-connection-label">Triggered by:</span>
                                    <div className="lore-connection-links">
                                      {event.triggeredBy.map(eventId => {
                                        const linkedEvent = timelineEvents.find(e => e.id === eventId);
                                        return linkedEvent ? (
                                          <button
                                            key={eventId}
                                            className="lore-connection-link triggered-by"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              scrollToEvent(eventId);
                                            }}
                                          >
                                            ← {linkedEvent.title}
                                          </button>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                )}
                                {event.leadsTo && event.leadsTo.length > 0 && (
                                  <div className="lore-connection-group">
                                    <span className="lore-connection-label">Leads to:</span>
                                    <div className="lore-connection-links">
                                      {event.leadsTo.map(eventId => {
                                        const linkedEvent = timelineEvents.find(e => e.id === eventId);
                                        return linkedEvent ? (
                                          <button
                                            key={eventId}
                                            className="lore-connection-link leads-to"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              scrollToEvent(eventId);
                                            }}
                                          >
                                            {linkedEvent.title} <ArrowRightIcon size={12} />
                                          </button>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* To Be Continued */}
        <section className="lore-timeline-era lore-tbc">
          <div className="lore-era-header" style={{ '--era-color': 'var(--brand-purple)' } as React.CSSProperties}>
            <span className="lore-era-icon">🔮</span>
            <h2>To Be Continued...</h2>
          </div>
          <div className="lore-tbc-content">
            <p>The story continues as Hamie navigates the dangerous waters of the Conspiracy.</p>
            <p>What secrets will the Neon Spire meeting reveal? Who are the true powers behind Aetherion?</p>
            <p>Stay tuned for future chapters...</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">2024 Hamieverse Wiki - Part of the Hamie Saga</p>
          <div className="wiki-footer-links">
            <a href="https://x.com/hamieverse" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://discord.gg/XpheMErdk6" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
