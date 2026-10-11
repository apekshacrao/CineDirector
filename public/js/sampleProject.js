/**
 * Pre-configured comprehensive sample project
 * Inspired by: "A young woman discovers that every dream she has predicts an event 24 hours before it happens."
 */
export const SAMPLE_PROJECT = {
  id: 'proj_sample_dreamechoes',
  lastModified: new Date().toISOString(),
  project: {
    title: 'Dream Echoes',
    genre: 'Psychological Sci-Fi / Neo-Noir',
    tone: 'Atmospheric, Haunting & Claustrophobic',
    logline: 'When an insomniac archivist realizes her nocturnal terrors precisely forecast catastrophic events 24 hours in advance, she must decipher a nightmare predicting her own assassination before tomorrow midnight.',
    runtimeMinutes: 110,
    language: 'English',
    theme: 'The agonizing burden of foresight vs. free will; whether knowing the future imprisons us in it.'
  },
  storyStructure: {
    actOne: {
      summary: 'Elena Vance, an audio archivist suffering from chronic sleep paralysis, notices mundane accidents in her neighborhood mirror details from her feverish sketches. The ordinary world unravels when an explosion at the city transit depot matches her nightmare down to the second hand on the station clock.',
      incitingIncident: 'Elena wakes with blood on her fingernails after dreaming of a fatal train derailment at 08:14. Twenty-four hours later, news reports confirm the disaster in horrific exactitude.',
      turningPoint: 'Confronted by Detective Marcus Cole, Elena attempts to explain her sketches. Realizing the police suspect her of complicity, she flees into the neon-slick city with only her dream journal.'
    },
    actTwo: {
      summary: 'Elena navigates an underground network of sleepless outcasts while struggling against relentless fatigue. Every time her eyes flutter shut, a fragmented 24-hour countdown triggers. She discovers an acoustic frequency in old broadcast tapes that induces targeted prophetic visions.',
      midpoint: 'Elena meets Dr. Sterling, a former government chronobiologist who reveals her sleep clinic as a child was an off-books DARPA precognition experiment. She is not predicting tragedies—her neural oscillations are synchronized to a decaying quantum feedback loop.',
      majorConflict: 'A shadowy corporate syndicate, Veritas Dynamics, begins hunting Elena to harvest her cortical data, while Cole closes in believing she is an eco-terrorist prophet.',
      turningPoint: 'Exhausted after 72 hours awake, Elena collapses in a subway sanctuary and dreams of a sniper taking aim through her apartment window at exactly 23:59 tomorrow night—and the shooter wears Cole’s police insignia.'
    },
    actThree: {
      summary: 'Elena must manipulate the events of the final 24 hours to alter the timeline without causing a fatal paradox. She lures both Cole and the syndicate operatives to the abandoned frequency broadcast tower above the foggy bay.',
      climax: 'In the glass-walled transmitter room as thunder strikes and midnight approaches, Elena uses recorded broadcast feedback to disorient the operatives. She confronts Cole, forcing him to choose between following syndicate orders or breaking the cycle of predestination.',
      resolution: 'Cole turns his weapon on the syndicate handler. The clock strikes midnight; the predicted fatal shot ricochets off the vintage tape console instead. Elena steps into the dawn light, embracing natural, dreamless sleep for the first time in her life.'
    }
  },
  characters: [
    {
      id: 'char_1',
      name: 'ELENA VANCE',
      role: 'Protagonist',
      age: '28',
      personality: 'Hyper-observant, hypervigilant, intellectually fierce yet emotionally exhausted; operates under constant sensory overload.',
      motivation: 'To break free from the terrifying prescience of her dreams and regain autonomy over her waking life.',
      backstory: 'Orphaned after a mysterious research facility fire; grew up believing her severe childhood insomnia was an incurable psychiatric anomaly.',
      characterArc: 'From a terrified victim desperately resisting sleep to a defiant master of her own destiny who rewrites the future.',
      physicalDescription: 'Lean, slight build with intense hazel eyes framed by dark exhaustion circles; cropped raven hair; ink-stained fingers.',
      costumeNotes: 'Oversized charcoal wool trench coat over a faded slate-grey cashmere turtleneck; heavy worn leather boots; vintage mechanical stopwatch on a brass chain.'
    },
    {
      id: 'char_2',
      name: 'DETECTIVE MARCUS COLE',
      role: 'Antagonist turned Ally',
      age: '44',
      personality: 'Methodical, morally conflicted, disillusioned by institutional corruption; struggles with suppressed grief.',
      motivation: 'To uncover the truth behind unexplained mass-casualty events while protecting his estranged daughter from syndicate retaliation.',
      backstory: 'Decorated homicide veteran whose partner vanished investigating Veritas Dynamics three years prior.',
      characterArc: 'Transforms from an unquestioning enforcer of evidence into a courageous protector willing to defy the system.',
      physicalDescription: 'Broad-shouldered, weathered face with salt-and-pepper stubble, piercing grey eyes, and a scarred left eyebrow.',
      costumeNotes: 'Faded navy precinct duster, scuffed oxblood wingtips, rumpled charcoal trousers, concealed shoulder holster.'
    },
    {
      id: 'char_3',
      name: 'DR. ARLO STERLING',
      role: 'Mentor',
      age: '62',
      personality: 'Eccentric, paranoid, intellectually brilliant, burdened with crushing remorse for past military research.',
      motivation: 'To atone for designing the neural temporal mapping project before Veritas silences him permanently.',
      backstory: 'Chief neuro-acoustician for Project Cassandra; spent twenty years living off-grid inside an abandoned radiotelescope relay.',
      characterArc: 'Finds redemption through sacrificing his research archives to arm Elena with the frequency key.',
      physicalDescription: 'Gaunt frame, disheveled silver hair, thick wire-rimmed tortoiseshell spectacles, trembling hands from heavy caffeine intake.',
      costumeNotes: 'Frayed tweed waistcoat over an unbuttoned denim shirt; pockets bulging with audio cassettes, miniature oscilloscopes, and brass tuning forks.'
    }
  ],
  scenes: [
    {
      sceneNumber: 1,
      heading: 'INT. ELENA\'S APARTMENT - DAWN',
      location: 'Elena\'s Cramped Studio Apartment, 4th Floor',
      timeOfDay: 'DAWN',
      charactersPresent: ['ELENA VANCE'],
      action: 'A single incandescent bulb buzzes overhead, shivering against cracked plaster. The room is a dense labyrinth of reel-to-reel tape decks, acoustic foam, and wall-to-wall charcoal sketches of crumbling bridges and shattered glass.\n\nELENA VANCE (28) gasps awake, violently twisting free of tangled linen. Sweat glistens on her collarbone. Her breath rasps in ragged, terrified bursts.\n\nHer trembling hands reach for a graphite stick on the nightstand. Without blinking, she claws frantic lines into a fresh sketchbook page: A RED COMMUTER BUS CRASHING INTO HARBOR DOCK 17. CLOCK AT 07:15.',
      dialogue: [
        {
          character: 'ELENA',
          direction: '(whispering, fingers bleeding graphite)',
          line: 'Twenty-four hours. Not twenty-five. Twenty-four...'
        }
      ],
      emotionalPurpose: 'Establish the suffocating dread of Elena\'s daily waking ritual and the undeniable countdown mechanism.',
      transition: 'SMASH CUT TO:'
    },
    {
      sceneNumber: 2,
      heading: 'EXT. HARBOR DOCK 17 - NEXT MORNING (07:14)',
      location: 'Industrial Pier 17, Waterfront',
      timeOfDay: 'DAWN (COLD MIST)',
      charactersPresent: ['ELENA VANCE', 'DETECTIVE MARCUS COLE'],
      action: 'Fog coils across oily black water like sulfurous steam. A lone foghorn groans in the distance.\n\nElena stands behind a rusted chain-link fence, shivering inside her charcoal trench coat. She clutches her sketchbook to her chest. Her eyes dart frantically to the pier entrance.\n\nDown the cobblestone hill, a RED COMMUTER BUS 42 approaches. The brake lines shriek. The driver swerves to avoid an oil slick—\n\nElena screams, lunging at the safety gate.',
      dialogue: [
        {
          character: 'ELENA',
          direction: '(screaming over engine roar)',
          line: 'GET OFF THE PIER! PULL THE EMERGENCY LEVER!'
        },
        {
          character: 'DETECTIVE MARCUS COLE',
          direction: '(stepping from an unmarked sedan, hand on holster)',
          line: 'Police! Step back from that barrier! How did you know that bus was turning here?'
        },
        {
          character: 'ELENA',
          direction: '(pale, staring at the shattered barricade)',
          line: 'Because I buried thirty people in my sleep last night, Detective.'
        }
      ],
      emotionalPurpose: 'Inciting incident where the nightmare intersects reality, drawing the law directly into Elena\'s temporal orbit.',
      transition: 'HARD CUT TO:'
    },
    {
      sceneNumber: 3,
      heading: 'INT. UNDERGROUND FREQUENCY RELAY - NIGHT',
      location: 'Abandoned Subterranean Bunker Beneath St. Jude Cemetery',
      timeOfDay: 'NIGHT',
      charactersPresent: ['ELENA VANCE', 'DR. ARLO STERLING'],
      action: 'Rows of vacuum tubes glow like amber embers along curved concrete walls. The rhythmic thrum of cooling fans reverberates through the damp floor.\n\nDR. ARLO STERLING (62) leans over a glowing oscilloscope, needle dancing violently across a green phosphor grid. Elena sits in an iron dentist chair, electrodes taped to her temples.',
      dialogue: [
        {
          character: 'DR. ARLO STERLING',
          direction: '(adjusting potentiometer with trembling tweezers)',
          line: 'You aren\'t psychic, Elena. That\'s the myth children tell to explain what terrifies them. Your brain is a resonator. You\'re intercepting quantum retro-causality waves.'
        },
        {
          character: 'ELENA',
          direction: '(voice strained, trembling from electrode pulses)',
          line: 'Then tell me how to turn it off. I don\'t want to be God\'s answering machine.'
        },
        {
          character: 'DR. ARLO STERLING',
          direction: '(solemn, meeting her eyes)',
          line: 'You don\'t turn off a tide, my dear. You learn to redirect the channel before it drowns you.'
        }
      ],
      emotionalPurpose: 'Scientific revelation of the precognition mechanism and shifting Elena from despair into tactical agency.',
      transition: 'DISSOLVE TO:'
    },
    {
      sceneNumber: 4,
      heading: 'INT. TRANSMISSION TOWER OBSERVATION DECK - MIDNIGHT',
      location: 'Top of Beacon Hill Microwave Spire',
      timeOfDay: 'NIGHT (LIGHTNING STORM)',
      charactersPresent: ['ELENA VANCE', 'DETECTIVE MARCUS COLE'],
      action: 'Sheets of rain hammer against 360-degree plate glass windows. Jagged lightning stabs through the storm, momentarily illuminating the sprawling city grid four hundred feet below.\n\nElena stands in the center of the flooded observation floor. An antique Nagra reel-to-reel sits on a rolling cart, playback heads spinning. 23:59:45 on the wall clock.\n\nCole stands in the doorway, rain dripping from his hat brim. His service weapon is drawn, aimed squarely at her heart.',
      dialogue: [
        {
          character: 'DETECTIVE MARCUS COLE',
          direction: '(voice raw with agonizing hesitation)',
          line: 'They have my daughter, Elena. If I don\'t deliver your journal by midnight, they wipe her out.'
        },
        {
          character: 'ELENA',
          direction: '(calm, stepping toward the barrel of the gun)',
          line: 'Look at the tape player, Marcus. In my dream, you shoot me at 23:59. But in my dream, you didn\'t hesitate. You hesitated.'
        },
        {
          character: 'DETECTIVE MARCUS COLE',
          direction: '(finger tightening on the trigger, breathing hard)',
          line: 'What difference does three seconds make?'
        },
        {
          character: 'ELENA',
          direction: '(softly, unwavering)',
          line: 'Three seconds is enough to choose who you are.'
        }
      ],
      emotionalPurpose: 'Climax confrontation: The collision of prophecy, moral free will, and systemic sacrifice.',
      transition: 'FADE OUT.'
    }
  ],
  shotLists: [
    {
      sceneNumber: 1,
      shots: [
        {
          shotNumber: 1,
          shotType: 'Extreme Close-Up (ECU)',
          cameraMovement: 'Static, Slow Macro Push-In',
          lens: '100mm Macro T2.8',
          framing: 'Tight on Elena\'s dilated pupil as she gasps awake, iris reflecting the buzzing tungsten filament.',
          lighting: 'Harsh single tungsten key light with deep charcoal shadows; high-contrast noir chiaroscuro.',
          visualDescription: 'Sweat bead rolling down her temple; hyper-detailed skin texture, breathless panic.',
          directorNotes: 'Sound begins as dead silence before sudden deafening intake of breath.'
        },
        {
          shotNumber: 2,
          shotType: 'Wide Shot (WS)',
          cameraMovement: 'Slow Crane Descent from ceiling',
          lens: '24mm Anamorphic Prime',
          framing: 'Symmetrical high angle looking down on the mattress engulfed by hundreds of graphite sketches.',
          lighting: 'Cold dawn blue rim light from window contrasting warm yellowish tungsten bulb.',
          visualDescription: 'The room looks like an autopsy of future horrors; visually overwhelming claustrophobia.',
          directorNotes: 'Keep depth of field deep to show the sheer volume of drawings.'
        },
        {
          shotNumber: 3,
          shotType: 'Close-Up (CU)',
          cameraMovement: 'Handheld Tracking',
          lens: '50mm f/1.2 at f/1.4',
          framing: 'Low angle over Elena\'s shoulder focusing on graphite snapping under intense pressure.',
          lighting: 'Side rake light catching the torn paper fibers and graphite dust in the air.',
          visualDescription: 'Fingers bleeding dark graphite dust; clock hands ticking relentlessly.',
          directorNotes: 'Sensory tactile focus: emphasize sound of graphite tearing into paper.'
        }
      ]
    },
    {
      sceneNumber: 2,
      shots: [
        {
          shotNumber: 1,
          shotType: 'Extreme Wide Shot (EWS)',
          cameraMovement: 'Slow Steadicam Lateral Dolly',
          lens: '35mm Anamorphic',
          framing: 'Harbor pier silhouette against freezing morning mist; industrial cranes like prehistoric monsters.',
          lighting: 'Soft diffused silver morning overcast; muted blue-grey palette with single pop of bus red.',
          visualDescription: 'Elena isolated, tiny figure behind rusty chain-link fence as the red bus enters frame.',
          directorNotes: 'Establish scale and Elena\'s complete vulnerability against the machine.'
        },
        {
          shotNumber: 2,
          shotType: 'Medium Close-Up (MCU)',
          cameraMovement: 'Rapid Push-In (Snap Zoom feel)',
          lens: '85mm T1.5',
          framing: 'Elena screaming behind wire mesh, diamond shadows cast across her frantic eyes.',
          lighting: 'Headlights of the skidding bus flare directly into the lens creating anamorphic amber streaks.',
          visualDescription: 'High adrenaline shutter angle (90 degrees) for crisp kinetic motion blur.',
          directorNotes: 'Cinematography should feel like immediate impending catastrophe.'
        }
      ]
    },
    {
      sceneNumber: 4,
      shots: [
        {
          shotNumber: 1,
          shotType: 'Medium Shot (MS)',
          cameraMovement: 'Circular Steadicam Orbit 360',
          lens: '35mm Cook Anamorphic',
          framing: 'Two-shot: Elena and Cole separated by the glowing tape reels, glass city backdrop behind them.',
          lighting: 'Periodic lightning flashes providing instantaneous blinding white rim lighting.',
          visualDescription: 'Rain streaks cascading down the glass like tears; reflections doubling both characters.',
          directorNotes: 'Visual metaphor of parallel realities collapsing into a single choice.'
        },
        {
          shotNumber: 2,
          shotType: 'Extreme Close-Up (ECU)',
          cameraMovement: 'Static',
          lens: '85mm Macro',
          framing: 'Tight profile on Cole\'s finger on the trigger as the wall clock second hand hits 59.',
          lighting: 'Amber vacuum tube glow reflected in the gun metal.',
          visualDescription: 'Micro-tremor in Cole\'s knuckle as his moral conscience overrules orders.',
          directorNotes: 'Hold this shot for an agonizing four beats.'
        }
      ]
    }
  ],
  imagePrompts: [
    {
      sceneNumber: 1,
      purpose: 'Concept Art Keyframe: The Insomniac Archivist Sanctuary',
      prompt: 'Cinematic keyframe of young exhausted female audio archivist gasping awake in a dark industrial studio loft, surrounded by thousands of charcoal sketches of prophetic disasters pinned to exposed brick walls, single warm tungsten bulb swinging overhead, volumetric dust rays, moody cold blue dawn light through rain-streaked skylight, Hasselblad 500C, Kodak Tri-X 400 grain, high contrast chiaroscuro, film still directed by Denis Villeneuve --ar 16:9 --style raw --v 6.1',
      negativePrompt: 'cartoon, 3d render, anime, saturated neon, blurry, watermark, smiling, low quality, oversaturated'
    },
    {
      sceneNumber: 2,
      purpose: 'Keyframe Concept: Harbor Fog Confrontation',
      prompt: 'Cinematic film still, freezing morning fog at industrial shipping harbor pier 17, young woman in charcoal trench coat clutching graphite sketchbook, facing weathered detective with trench coat and service weapon, red vintage transit bus skidding on wet cobblestones in background, anamorphic lens flare from headlights, wet asphalt reflections, Arri Alexa Mini LF, 35mm anamorphic prime lens, cinematic color grading --ar 16:9 --style raw --v 6.1',
      negativePrompt: 'sunny, bright cheerful, text, logo, illustration, extra limbs, bad anatomy, flat lighting'
    },
    {
      sceneNumber: 4,
      purpose: 'Climactic Atmosphere: Midnight Tower Confrontation',
      prompt: 'Cinematic film climax still, 360 glass observation tower high above foggy metropolis during severe thunderstorm, young woman facing a detective holding gun, vintage reel-to-reel audio recorder spinning between them, lightning flash through plate glass illuminating rain streaks, neon city lights below through fog, moody teal and gold color palette, master cinematography by Roger Deakins --ar 16:9 --style raw --v 6.1',
      negativePrompt: 'cgi, cartoon, plastic, bad face, text, signature, low resolution, overexposed'
    }
  ],
  videoPrompts: [
    {
      sceneNumber: 1,
      durationSeconds: 6,
      prompt: 'Extreme close up of a woman’s eye suddenly gasping open in dramatic chiaroscuro lighting, iris dilating as sweat glistens on her forehead, slow camera pull back revealing room covered in sketches, subtle film grain',
      cameraMotion: 'Slow Zoom Out 2, Pan Down 1, subtle handheld micro-shake',
      visualStyle: '35mm Kodak 5219 film stock, atmospheric fog, high dynamic range moody shadows'
    },
    {
      sceneNumber: 2,
      durationSeconds: 8,
      prompt: 'Thick harbor fog rolls across wet cobblestone pier, a woman in a dark trench coat runs toward a chain-link fence screaming warning, headlights flare anamorphic gold across the lens as a red bus skids sideways in slow motion',
      cameraMotion: 'Tracking Left 3, Crane Down 2, Motion Brush on rolling fog',
      visualStyle: 'Fincher-style desaturated cold steel palette with piercing golden headlights'
    },
    {
      sceneNumber: 4,
      durationSeconds: 8,
      prompt: 'Glass observation deck in thunderstorm, sudden flash of lightning illuminates sheets of rain running down window glass, man lowers handgun in slow motion as antique audio tape reels continue to spin with magnetic tape fluttering',
      cameraMotion: 'Orbit Right 2, Slow Push In 1.5',
      visualStyle: 'Blade Runner 2049 aesthetic, volumetric rain shadows, high contrast cinematic gold and cyan'
    }
  ],
  audioDesign: [
    {
      sceneNumber: 1,
      ambience: 'Low-frequency 40Hz room tone humming through vintage tube amplifier; dull patter of dawn drizzle against windowpane; faint distant city sirens muted through double glazing.',
      soundEffects: [
        'Sudden explosive intake of breath with close-mic vocal rasp',
        'Dry scraping sound of charcoal stick rapidly fracturing across rough cartridge paper',
        'Mechanical clock ticking with metallic resonance every precise second',
        'Humming tungsten filament with subtle 60Hz electrical buzz'
      ],
      musicCue: 'Sparse solo cello playing a discordant minor 2nd drone, accompanied by granular synth swells that mimic reverse time dilation.',
      emotionalIntent: 'Induce acute sensory claustrophobia and heart-rate elevation mirroring panic attacks.'
    },
    {
      sceneNumber: 2,
      ambience: 'Muffled harbor foghorn blowing every 12 seconds; gentle lapping of cold oily waves against concrete pier pilings; wind howling through chain link.',
      soundEffects: [
        'Distant air brakes shrieking in metallic agony',
        'Violent rubber hydroplaning squeal on wet cobblestones',
        'Heavy chain-link fence rattling as Elena impacts it',
        'Detective Cole\'s leather shoes clicking sharply on stone'
      ],
      musicCue: 'Low-register pulsating analog bass pulse building in tempo like a runaway metronome, cutting out dead on the gunshot warning.',
      emotionalIntent: 'Build inescapable dread leading up to the collision point.'
    },
    {
      sceneNumber: 4,
      ambience: 'Violent deluge of rain battering glass exterior; deep bass thunderclaps shaking the floorboards every 15 seconds; air-conditioning vent whispering cold air.',
      soundEffects: [
        'High-pitched magnetic tape whisper across vintage playback heads',
        'Sudden thunder strike with prolonged spatial acoustic decay',
        'Metallic hammer click of service weapon cocking back',
        'Wall clock second hand striking midnight with heavy hollow strike'
      ],
      musicCue: 'Melancholic, sweeping minimalist piano motif underlaid with warm analog synth strings—evoking emotional release and tragic resolve.',
      emotionalIntent: 'Cathartic release: tension dissolves into emotional epiphany as human choice triumphs over fate.'
    }
  ],
  productionSummary: {
    visualStyle: 'Neo-Noir psychological realism blending the clinical atmospheric dread of Denis Villeneuve\'s "Arrival" with the tactile acoustic shadows of Francis Ford Coppola\'s "The Conversation". Shot on 35mm Anamorphic with deliberate restraint in camera movement.',
    colorPalette: [
      '#670626 Velvet Cherry Noir',
      '#BAD797 Mist Matcha Sage',
      '#0E0308 Obsidian Void Black',
      '#D6EBC2 Pistachio Dawn Glow',
      '#3F0317 Deep Merlot Shadow'
    ],
    productionChallenges: [
      'Executing practical skidding bus stunts on wet cobblestone piers safely within city harbor limits.',
      'Maintaining consistent deep fog atmosphere across multi-day exterior shooting schedules.',
      'Sourcing and maintaining functional vintage 1970s reel-to-reel Nagra and Ampex tape equipment for tactile hero close-ups.',
      'Lighting the 360-degree glass observation deck during night storm scenes to eliminate unintended camera reflections.'
    ],
    keyCreativeDecisions: [
      'The precognition is never depicted with cheap digital CGI glow—it is visualized strictly through tactile physical sketches, audio recordings, and match-cuts.',
      'Audio design takes precedence over musical score; the sound of the ticking mechanical clock and tape hiss acts as the antagonist\'s heartbeat.',
      'The ending intentionally refuses a Hollywood action gunfight; the climax is a high-stakes psychological dialogue standoff decided by human mercy.'
    ]
  }
};
