/**
 * The typeface library (docs/research/typefaces-2026-10-31): every face the owner kept on the review page (artifact
 * 42NXMyi3…, `verdicts`), as the Typography page lists them. Words are written here; measurements come from
 * generated/faces.json (scripts/typefaces.mjs) for faces Area ships, and from the Electron main process for faces
 * installed on the Mac (electron/main.cjs, "area:fonts-installed").
 *
 *   kind     text (UI and body), display (titles and display sizes only) or code
 *   tier     open (Google Fonts, OFL), libre (an independent foundry's repository, OFL), licensed (commercial: drawn
 *            only when installed), own-copy (free, but each user downloads it: Fontshare's FFL 2.0 §02 forbids offering
 *            it as a built-in choice) or system
 *   source   fontsource (an npm package), geist (the geist package's folder), files (assets/fonts/<id>), installed (the
 *            family names to look for on the Mac, retail then trial), system
 */
export const TYPEFACES = [
  {
    id: "geist",
    name: "Geist",
    kind: "text",
    tier: "open",
    foundry: "Vercel",
    designers: ["Andrés Briganti", "Mateo Zaragoza", "Guillermo Rauch", "Evil Rabbit", "José Rago", "Facundo Santana"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2024-10-01",
    about: "Vercel's grotesk and Area's default: precise and neutral, drawn for screens, with a Mono, a Serif and a Pixel.",
    family: ["geist-mono", "geist-serif", "geist-pixel"],
    source: {
      geist: "geist-sans"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Geist",
      foundry: "https://vercel.com/font"
    }
  },
  {
    id: "system",
    name: "System",
    kind: "text",
    tier: "system",
    foundry: "Apple, Microsoft",
    designers: [],
    licence: "Ships with the operating system",
    about: "SF Pro on Mac and Segoe UI on Windows: native rendering and no download, as Notion uses. It can't be size-matched, since each system ships a different face.",
    source: {
      system: true
    },
    links: {}
  },
  {
    id: "inter",
    name: "Inter",
    kind: "text",
    tier: "open",
    foundry: "Rasmus Andersson",
    designers: ["Rasmus Andersson"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2020-01-24",
    about: "The neutral standard and Figma's UI face. Largest x-height, so the clearest at 11–13; its optical size gives a display cut for titles.",
    source: {
      fontsource: "@fontsource-variable/inter"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Inter"
    }
  },
  {
    id: "ibm-plex-sans",
    name: "IBM Plex Sans",
    kind: "text",
    tier: "open",
    foundry: "IBM",
    designers: ["Mike Abbink", "Bold Monday"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2018-03-11",
    about: "Technical humanist grotesk. A superfamily (Serif, Mono, Condensed, CJK) for systems that want one family.",
    family: ["ibm-plex-mono"],
    source: {
      fontsource: "@fontsource-variable/ibm-plex-sans"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/IBM+Plex+Sans"
    }
  },
  {
    id: "source-sans-3",
    name: "Source Sans 3",
    kind: "text",
    tier: "open",
    foundry: "Adobe",
    designers: ["Paul D. Hunt"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2021-09-17",
    about: "Humanist and the narrowest here: fits dense tables. Reads 9% small at the same size, so it needs the x-height match.",
    family: ["source-serif-4"],
    source: {
      fontsource: "@fontsource-variable/source-sans-3"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Source+Sans+3"
    }
  },
  {
    id: "public-sans",
    name: "Public Sans",
    kind: "text",
    tier: "open",
    foundry: "USWDS",
    designers: ["USWDS", "Dan Williams", "Pablo Impallari", "Rodrigo Fuenzalida"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2019-06-07",
    about: "Civic and sturdy: the heaviest regular stem, so it holds on low-DPI screens and in dark mode.",
    source: {
      fontsource: "@fontsource-variable/public-sans"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Public+Sans"
    }
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    kind: "text",
    tier: "open",
    foundry: "Colophon Foundry",
    designers: ["Colophon Foundry"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2019-06-11",
    about: "Geometric and friendly, with optical sizes. Suits consumer products; Latin only.",
    source: {
      fontsource: "@fontsource-variable/dm-sans"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/DM+Sans"
    }
  },
  {
    id: "mona-sans",
    name: "Mona Sans",
    kind: "text",
    tier: "open",
    foundry: "GitHub",
    designers: ["Tobias Bjerrome Ahlin", "Github", "Degarism Studio", "Sebastian Carewe"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2024-11-04",
    about: "Industrial grotesk with widths 75 to 125: one family gives a condensed UI and a wide display.",
    source: {
      fontsource: "@fontsource-variable/mona-sans"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Mona+Sans"
    }
  },
  {
    id: "google-sans-flex",
    name: "Google Sans Flex",
    kind: "text",
    tier: "open",
    foundry: "Google",
    designers: ["Google"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2025-11-12",
    about: "Open since November 2025. Its Rounded axis is the only open match for SF Rounded, with optical size and width as well.",
    family: ["google-sans-code"],
    source: {
      fontsource: "@fontsource-variable/google-sans-flex"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Google+Sans+Flex"
    }
  },
  {
    id: "atkinson-hyperlegible-next",
    name: "Atkinson Hyperlegible Next",
    kind: "text",
    tier: "open",
    foundry: "Braille Institute",
    designers: ["Braille Institute", "Applied Design Works", "Elliott Scott", "Megan Eiswerth", "Letters From Sweden"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2025-01-06",
    about: "Drawn for low vision: I, l and 1 differ, as do 0 and O. The accessibility choice.",
    family: ["atkinson-hyperlegible-mono"],
    source: {
      fontsource: "@fontsource-variable/atkinson-hyperlegible-next"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next"
    }
  },
  {
    id: "noto-sans",
    name: "Noto Sans",
    kind: "text",
    tier: "open",
    foundry: "Google",
    designers: ["Google"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2013-02-27",
    about: "The widest script coverage of any open family: the choice for multilingual products.",
    source: {
      fontsource: "@fontsource-variable/noto-sans"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Noto+Sans"
    }
  },
  {
    id: "ronzino",
    name: "Ronzino",
    kind: "text",
    tier: "libre",
    foundry: "Collletttivo",
    designers: [],
    licence: "SIL Open Font License 1.1",
    about: "The closest open match to Areal's letters: flat-cut terminals, a compact a and t, the same quiet neo-grotesk. Static weights with drawn obliques. No mono of its own, so pair it with Chivo Mono or Geist Mono.",
    source: {
      files: "ronzino"
    },
    links: {
      source: "https://github.com/collletttivo/ronzino",
      foundry: "https://collletttivo.it"
    }
  },
  {
    id: "chivo",
    name: "Chivo",
    kind: "text",
    tier: "open",
    foundry: "Omnibus-Type",
    designers: ["Omnibus-Type"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2011-12-07",
    about: "A grotesk and a mono drawn together, as Areal and Areal Mono are. Slightly wider and warmer than Areal.",
    family: ["chivo-mono"],
    source: {
      fontsource: "@fontsource-variable/chivo"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Chivo"
    }
  },
  {
    id: "reddit-sans",
    name: "Reddit Sans",
    kind: "text",
    tier: "open",
    foundry: "Reddit",
    designers: ["Stephen Hutchings", "OrangeRed"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2023-10-10",
    about: "A clean pair with matched metrics: the mono sits on the sans's x-height exactly.",
    family: ["reddit-mono"],
    source: {
      fontsource: "@fontsource-variable/reddit-sans"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Reddit+Sans"
    }
  },
  {
    id: "sono",
    name: "Sono",
    kind: "text",
    tier: "open",
    foundry: "Tyler Finck",
    designers: ["Tyler Finck"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2022-07-29",
    about: "Proportional, semi-mono and mono in one variable file, which is Areal's Sans, Semi Mono and Mono as an axis.",
    source: {
      fontsource: "@fontsource-variable/sono"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Sono"
    }
  },
  {
    id: "recursive",
    name: "Recursive",
    kind: "text",
    tier: "open",
    foundry: "Arrow Type",
    designers: ["Arrow Type", "Stephen Nixon"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2019-06-28",
    about: "Sans to mono and linear to casual in one file. More technical than Areal.",
    source: {
      fontsource: "@fontsource-variable/recursive"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Recursive"
    }
  },
  {
    id: "geist-serif",
    name: "Geist Serif",
    kind: "display",
    tier: "open",
    foundry: "Vercel",
    designers: [],
    licence: "SIL Open Font License 1.1",
    about: "The serif in the Geist family, released in the geist package 1.9, with alternate cuts (Heart, Square, Triangle).",
    family: ["geist", "geist-mono", "geist-pixel"],
    source: {
      geist: "geist-serif"
    },
    links: {
      foundry: "https://vercel.com/font"
    }
  },
  {
    id: "geist-pixel",
    name: "Geist Pixel",
    kind: "display",
    tier: "open",
    foundry: "Vercel",
    designers: ["Andrés Briganti", "Evil Rabbit", "Guillermo Rauch"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2026-06-29",
    about: "Geist drawn on a pixel grid in five shapes: Square, Circle, Line, Grid and Triangle. Display only.",
    family: ["geist", "geist-mono", "geist-serif"],
    source: {
      geist: "geist-pixel"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Geist+Pixel",
      foundry: "https://vercel.com/font"
    }
  },
  {
    id: "instrument-serif",
    name: "Instrument Serif",
    kind: "display",
    tier: "open",
    foundry: "Instrument",
    designers: ["Rodrigo Fuenzalida", "Jordan Egstad"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2023-03-21",
    about: "Condensed editorial serif. Thin: keep it at 30 and up.",
    source: {
      fontsource: "@fontsource/instrument-serif"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Instrument+Serif"
    }
  },
  {
    id: "newsreader",
    name: "Newsreader",
    kind: "display",
    tier: "open",
    foundry: "Production Type",
    designers: ["Production Type"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2020-07-01",
    about: "Production Type's news serif. Optical sizes let it read at title sizes and as Articles' body.",
    source: {
      fontsource: "@fontsource-variable/newsreader"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Newsreader"
    }
  },
  {
    id: "fraunces",
    name: "Fraunces",
    kind: "display",
    tier: "open",
    foundry: "Undercase Type",
    designers: ["Undercase Type", "Phaedra Charles", "Flavia Zimbardi"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2020-07-23",
    about: "Warm old-style with a softness axis. The most character of the set.",
    source: {
      fontsource: "@fontsource-variable/fraunces"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Fraunces"
    }
  },
  {
    id: "source-serif-4",
    name: "Source Serif 4",
    kind: "display",
    tier: "open",
    foundry: "Adobe",
    designers: ["Frank Grießhammer"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2021-11-16",
    about: "Sturdy transitional serif with optical sizes. Pairs with any sans; also a reading body.",
    family: ["source-sans-3"],
    source: {
      fontsource: "@fontsource-variable/source-serif-4"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Source+Serif+4"
    }
  },
  {
    id: "playfair",
    name: "Playfair",
    kind: "display",
    tier: "open",
    foundry: "Claus Eggers Sørensen",
    designers: ["Claus Eggers Sørensen"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2023-04-12",
    about: "High-contrast didone, version 2 with optical sizes. Fashion and editorial.",
    source: {
      fontsource: "@fontsource-variable/playfair"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Playfair"
    }
  },
  {
    id: "young-serif",
    name: "Young Serif",
    kind: "display",
    tier: "open",
    foundry: "Noir Blanc Rouge",
    designers: ["Bastien Sozeau"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2023-09-26",
    about: "Heavy, friendly serif. One weight, so it suits a single display role.",
    source: {
      fontsource: "@fontsource/young-serif"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Young+Serif"
    }
  },
  {
    id: "bricolage-grotesque",
    name: "Bricolage Grotesque",
    kind: "display",
    tier: "open",
    foundry: "Mathieu Triay",
    designers: ["Mathieu Triay"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2023-06-14",
    about: "Quirky grotesk whose ink traps appear at display sizes.",
    source: {
      fontsource: "@fontsource-variable/bricolage-grotesque"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Bricolage+Grotesque"
    }
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    kind: "display",
    tier: "open",
    foundry: "Florian Karsten",
    designers: ["Florian Karsten"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2020-10-06",
    about: "Technical grotesk with odd details. Display only, since it has no italic.",
    family: ["space-mono"],
    source: {
      fontsource: "@fontsource-variable/space-grotesk"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Space+Grotesk"
    }
  },
  {
    id: "redaction",
    name: "Redaction",
    kind: "display",
    tier: "open",
    foundry: "MCKL",
    designers: ["MCKL"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2026-10-28",
    about: "Made with Titus Kaphar and Reginald Dwayne Betts for a work on criminal justice. Six cuts, 10 to 100, wear the letters down like a photocopy.",
    source: {
      fontsource: "@fontsource/redaction"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Redaction"
    }
  },
  {
    id: "hedvig-letters-serif",
    name: "Hedvig Letters Serif",
    kind: "display",
    tier: "open",
    foundry: "Kanon Foundry",
    designers: ["Kanon Foundry", "Alexander Örn", "Tor Weibull", "Hedvig"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2023-10-24",
    about: "A Stockholm foundry's crisp text serif with an optical-size axis. Quiet enough to pair with any sans.",
    source: {
      fontsource: "@fontsource-variable/hedvig-letters-serif"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Hedvig+Letters+Serif"
    }
  },
  {
    id: "roboto-serif",
    name: "Roboto Serif",
    kind: "display",
    tier: "open",
    foundry: "Commercial Type",
    designers: ["Commercial Type", "Greg Gazdowicz"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2022-02-10",
    about: "From Commercial Type, despite the name: a serif with optical size, width and grade, so one family runs from captions to headlines.",
    source: {
      fontsource: "@fontsource-variable/roboto-serif"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Roboto+Serif"
    }
  },
  {
    id: "brygada-1918",
    name: "Brygada 1918",
    kind: "display",
    tier: "open",
    foundry: "Capitalics",
    designers: ["Capitalics", "Mateusz Machalski", "Borys Kosmynka", "Ania Wieluńska", "Przemysław Hoffer"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2021-01-27",
    about: "A Polish foundry's revival of a 1918 face. Historical without being a costume.",
    source: {
      fontsource: "@fontsource-variable/brygada-1918"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Brygada+1918"
    }
  },
  {
    id: "piazzolla",
    name: "Piazzolla",
    kind: "display",
    tier: "open",
    foundry: "Huerta Tipográfica",
    designers: ["Juan Pablo del Peral", "HT Fonts"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2020-08-27",
    about: "Sharp, compact and dark, drawn for dense reading by the Argentine foundry behind Alegreya.",
    source: {
      fontsource: "@fontsource-variable/piazzolla"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Piazzolla"
    }
  },
  {
    id: "cormorant",
    name: "Cormorant",
    kind: "display",
    tier: "open",
    foundry: "Catharsis Fonts",
    designers: ["Christian Thalmann"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2016-06-15",
    about: "A display Garamond with very small x-height and long ascenders: elegant at 52 and up, never in UI.",
    source: {
      fontsource: "@fontsource-variable/cormorant"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Cormorant"
    }
  },
  {
    id: "geologica",
    name: "Geologica",
    kind: "display",
    tier: "open",
    foundry: "Monokrom",
    designers: ["Monokrom", "Sindre Bremnes", "Frode Helland"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2023-05-29",
    about: "Monokrom's sans with a sharpness axis: corners from soft to cut.",
    source: {
      fontsource: "@fontsource-variable/geologica"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Geologica"
    }
  },
  {
    id: "syne",
    name: "Syne",
    kind: "display",
    tier: "open",
    foundry: "Bonjour Monde",
    designers: ["Bonjour Monde", "Lucas Descroix", "George Triantafyllakos"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2020-08-25",
    about: "Made for the Synesthésies art centre. Its letters widen as they get bolder.",
    source: {
      fontsource: "@fontsource-variable/syne"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Syne"
    }
  },
  {
    id: "schibsted-grotesk",
    name: "Schibsted Grotesk",
    kind: "display",
    tier: "open",
    foundry: "Bakken & Bæck",
    designers: ["Bakken & Bæck", "Henrik Kongsvoll"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2023-03-02",
    about: "A news grotesk from a respected Oslo studio. Close to Areal in tone, with italics.",
    source: {
      fontsource: "@fontsource-variable/schibsted-grotesk"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Schibsted+Grotesk"
    }
  },
  {
    id: "familjen-grotesk",
    name: "Familjen Grotesk",
    kind: "display",
    tier: "open",
    foundry: "Familjen STHLM",
    designers: ["Familjen STHLM AB"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2022-03-02",
    about: "An agency's grotesk with ink traps and sharp joins.",
    source: {
      fontsource: "@fontsource-variable/familjen-grotesk"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Familjen+Grotesk"
    }
  },
  {
    id: "anybody",
    name: "Anybody",
    kind: "display",
    tier: "open",
    foundry: "Tyler Finck, ETC",
    designers: ["Tyler Finck"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2022-03-02",
    about: "One family from ultra-condensed to extra-wide, in every weight.",
    source: {
      fontsource: "@fontsource-variable/anybody"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Anybody"
    }
  },
  {
    id: "big-shoulders",
    name: "Big Shoulders",
    kind: "display",
    tier: "open",
    foundry: "Patric King",
    designers: ["Patric King"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2025-02-05",
    about: "Condensed and made for Chicago's signage. Optical sizes keep it readable small.",
    source: {
      fontsource: "@fontsource-variable/big-shoulders"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Big+Shoulders"
    }
  },
  {
    id: "unbounded",
    name: "Unbounded",
    kind: "display",
    tier: "open",
    foundry: "NaN",
    designers: ["NaN"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2022-11-07",
    about: "Wide and rounded at the corners, from the Berlin foundry NaN.",
    source: {
      fontsource: "@fontsource-variable/unbounded"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Unbounded"
    }
  },
  {
    id: "le-murmure",
    name: "Le Murmure",
    kind: "display",
    tier: "libre",
    foundry: "Velvetyne",
    designers: ["Jérémy Landes"],
    licence: "SIL Open Font License 1.1",
    about: "Made for the agency Murmure and a fixture of design-studio sites. Tall, condensed and sharp.",
    source: {
      files: "le-murmure"
    },
    links: {
      source: "https://gitlab.com/velvetyne/murmure",
      foundry: "https://velvetyne.fr"
    }
  },
  {
    id: "basteleur",
    name: "Basteleur",
    kind: "display",
    tier: "libre",
    foundry: "Velvetyne",
    designers: ["Keussel"],
    licence: "SIL Open Font License 1.1",
    about: "Drawn from the Tarot de Marseille. Moonlight is fine and sharp; Bold is heavy and medieval.",
    source: {
      files: "basteleur"
    },
    links: {
      source: "https://gitlab.com/velvetyne/basteleur",
      foundry: "https://velvetyne.fr"
    }
  },
  {
    id: "apfel-grotezk",
    name: "Apfel Grotezk",
    kind: "display",
    tier: "libre",
    foundry: "Collletttivo",
    designers: ["Luigi Gorlero"],
    licence: "SIL Open Font License 1.1",
    about: "A grotesk with odd, friendly details (the 1, the &). Five weights, so it can take the Title weight setting.",
    source: {
      files: "apfel-grotezk"
    },
    links: {
      source: "https://github.com/collletttivo/apfel-grotezk",
      foundry: "https://collletttivo.it"
    }
  },
  {
    id: "absans",
    name: "Absans",
    kind: "display",
    tier: "libre",
    foundry: "Collletttivo",
    designers: ["Valerio Monopoli"],
    licence: "SIL Open Font License 1.1",
    about: "A light, open sans with a hand-drawn edge. Calm at large sizes.",
    source: {
      files: "absans"
    },
    links: {
      source: "https://github.com/collletttivo/absans",
      foundry: "https://collletttivo.it"
    }
  },
  {
    id: "bluu-next",
    name: "Bluu Next",
    kind: "display",
    tier: "libre",
    foundry: "Velvetyne",
    designers: ["Jean-Baptiste Morizot"],
    licence: "SIL Open Font License 1.1",
    about: "A heavy serif with sharp wedges. Missing Polish and Czech letters.",
    englishOnly: true,
    source: {
      files: "bluu-next"
    },
    links: {
      source: "https://github.com/velvetyne/BluuNext",
      foundry: "https://velvetyne.fr"
    }
  },
  {
    id: "happy-times",
    name: "Happy Times at the IKOB",
    kind: "display",
    tier: "libre",
    foundry: "Velvetyne",
    designers: ["Lucas Le Bihan"],
    licence: "SIL Open Font License 1.1",
    about: "Times New Roman redrawn with ink-trap wit.",
    englishOnly: true,
    source: {
      files: "happy-times"
    },
    links: {
      source: "https://gitlab.com/velvetyne/Happy-Times-at-the-IKOB",
      foundry: "https://velvetyne.fr"
    }
  },
  {
    id: "sporting-grotesque",
    name: "Sporting Grotesque",
    kind: "display",
    tier: "libre",
    foundry: "Velvetyne",
    designers: ["Lucas Le Bihan"],
    licence: "SIL Open Font License 1.1",
    about: "A wide grotesk with odd details (the &).",
    englishOnly: true,
    source: {
      files: "sporting-grotesque"
    },
    links: {
      source: "https://gitlab.com/velvetyne/Sporting-Grotesque",
      foundry: "https://velvetyne.fr"
    }
  },
  {
    id: "compagnon",
    name: "Compagnon",
    kind: "display",
    tier: "libre",
    foundry: "Velvetyne",
    designers: ["Juliette Duhé", "Léa Pradine", "Valentin Papon", "Chloé Lozano", "Sébastien Riollier"],
    licence: "SIL Open Font License 1.1",
    about: "A typewriter family with a Roman, an Italic and three more weights.",
    englishOnly: true,
    source: {
      files: "compagnon"
    },
    links: {
      source: "https://gitlab.com/velvetyne/compagnon",
      foundry: "https://velvetyne.fr"
    }
  },
  {
    id: "bagnard",
    name: "Bagnard",
    kind: "display",
    tier: "libre",
    foundry: "Sébastien Sanfilippo",
    designers: ["Sébastien Sanfilippo"],
    licence: "SIL Open Font License 1.1",
    about: "A serif drawn from a prisoner's carved letters. Tiny character set.",
    englishOnly: true,
    source: {
      files: "bagnard"
    },
    links: {
      source: "https://github.com/sebsan/Bagnard"
    }
  },
  {
    id: "geist-mono",
    name: "Geist Mono",
    kind: "code",
    tier: "open",
    foundry: "Vercel",
    designers: ["Andrés Briganti", "Mateo Zaragoza", "Guillermo Rauch", "Evil Rabbit", "José Rago", "Facundo Santana"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2024-10-02",
    about: "Geist's mono and Area's default code face.",
    family: ["geist", "geist-serif", "geist-pixel"],
    source: {
      geist: "geist-mono"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Geist+Mono",
      foundry: "https://vercel.com/font"
    }
  },
  {
    id: "jetbrains-mono",
    name: "JetBrains Mono",
    kind: "code",
    tier: "open",
    foundry: "JetBrains",
    designers: ["JetBrains", "Philipp Nurullin", "Konstantin Bulenkov"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2020-11-18",
    about: "The tallest x-height here: reads largest at small sizes. Made for editors.",
    source: {
      fontsource: "@fontsource-variable/jetbrains-mono"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/JetBrains+Mono"
    }
  },
  {
    id: "ibm-plex-mono",
    name: "IBM Plex Mono",
    kind: "code",
    tier: "open",
    foundry: "IBM",
    designers: ["Mike Abbink", "Bold Monday"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2018-03-12",
    about: "Completes Plex as one family.",
    family: ["ibm-plex-sans"],
    source: {
      fontsource: "@fontsource/ibm-plex-mono"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/IBM+Plex+Mono"
    }
  },
  {
    id: "google-sans-code",
    name: "Google Sans Code",
    kind: "code",
    tier: "open",
    foundry: "Google",
    designers: ["Google", "Universal Thirst"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2025-02-26",
    about: "Wide script coverage; pairs with Google Sans Flex.",
    family: ["google-sans-flex"],
    source: {
      fontsource: "@fontsource-variable/google-sans-code"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Google+Sans+Code"
    }
  },
  {
    id: "atkinson-hyperlegible-mono",
    name: "Atkinson Hyperlegible Mono",
    kind: "code",
    tier: "open",
    foundry: "Braille Institute",
    designers: ["Braille Institute", "Applied Design Works", "Elliott Scott", "Megan Eiswerth", "Letters From Sweden"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2024-11-19",
    about: "Pairs with Atkinson for an accessible system. The widest.",
    family: ["atkinson-hyperlegible-next"],
    source: {
      fontsource: "@fontsource-variable/atkinson-hyperlegible-mono"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Atkinson+Hyperlegible+Mono"
    }
  },
  {
    id: "chivo-mono",
    name: "Chivo Mono",
    kind: "code",
    tier: "open",
    foundry: "Omnibus-Type",
    designers: ["Omnibus-Type"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2022-11-02",
    about: "Chivo's mono, drawn as a pair with the sans.",
    family: ["chivo"],
    source: {
      fontsource: "@fontsource-variable/chivo-mono"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Chivo+Mono"
    }
  },
  {
    id: "reddit-mono",
    name: "Reddit Mono",
    kind: "code",
    tier: "open",
    foundry: "Reddit",
    designers: ["Stephen Hutchings", "OrangeRed"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2024-03-20",
    about: "Reddit Sans's mono, on the same metrics.",
    family: ["reddit-sans"],
    source: {
      fontsource: "@fontsource-variable/reddit-mono"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Reddit+Mono"
    }
  },
  {
    id: "space-mono",
    name: "Space Mono",
    kind: "code",
    tier: "open",
    foundry: "Colophon Foundry",
    designers: ["Colophon Foundry"],
    licence: "SIL Open Font License 1.1",
    onGoogleFonts: "2016-06-15",
    about: "Colophon's mono. Space Grotesk was drawn from it.",
    family: ["space-grotesk"],
    source: {
      fontsource: "@fontsource/space-mono"
    },
    links: {
      googleFonts: "https://fonts.google.com/specimen/Space+Mono"
    }
  },
  {
    id: "sligoil",
    name: "Sligoil",
    kind: "code",
    tier: "libre",
    foundry: "Velvetyne",
    designers: ["Ariel Martín Pérez"],
    licence: "SIL Open Font License 1.1",
    about: "A mono with deep ink traps, drawn for small sizes. The niche choice for code.",
    source: {
      files: "sligoil"
    },
    links: {
      source: "https://gitlab.com/velvetyne/sligoil",
      foundry: "https://velvetyne.fr"
    }
  },
  {
    id: "sohne",
    name: "Söhne",
    kind: "text",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "Klim's Akzidenz-Grotesk, with Mono, Breit and Schmal widths. Used across OpenAI's products for years.",
    family: ["sohne-mono"],
    source: {
      installed: ["Söhne", "Test Söhne"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "untitled-sans",
    name: "Untitled Sans",
    kind: "text",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "A plain grotesk on purpose: no quirks, quiet at every size. Has an Untitled Serif.",
    family: ["untitled-serif"],
    source: {
      installed: ["Untitled Sans", "Test Untitled Sans VF", "Test Untitled Sans"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "calibre",
    name: "Calibre",
    kind: "text",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "Klim's geometric grotesk with a small x-height and tall caps: crisp, a little formal.",
    source: {
      installed: ["Calibre", "Test Calibre"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "die-grotesk",
    name: "Die Grotesk",
    kind: "text",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "A sturdy grotesk with an optical-size axis, so one file runs from captions to headlines.",
    source: {
      installed: ["Die Grotesk", "Test Die Grotesk VF", "Test Die Grotesk"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "saans",
    name: "Saans",
    kind: "text",
    tier: "licensed",
    foundry: "Displaay",
    designers: ["Martin Vácha"],
    licence: "Commercial",
    about: "Displaay's grotesk with a MONO axis from 0 to 100: proportional to mono in one file, the closest commercial match for Areal's build.",
    source: {
      installed: ["Saans", "Saans Collection VF", "Saans Collection VF-TRIAL"]
    },
    links: {
      foundry: "https://displaay.net"
    }
  },
  {
    id: "scto-grotesk",
    name: "Scto Grotesk",
    kind: "text",
    tier: "licensed",
    foundry: "Schick Toikka",
    designers: [],
    licence: "Commercial",
    about: "Schick Toikka's grotesk in two versions: A with plain forms, B with rounder alternates.",
    source: {
      installed: ["Scto Grotesk A", "Scto Grotesk A Trial"]
    },
    links: {
      foundry: "https://www.schick-toikka.com"
    }
  },
  {
    id: "abc-areal",
    name: "ABC Areal",
    kind: "text",
    tier: "licensed",
    foundry: "Dinamo",
    designers: [],
    licence: "Commercial",
    about: "Dinamo's quiet neo-grotesk, with Mono and Semi Mono siblings, a slant axis and a dark-mode weight axis.",
    family: ["abc-areal-mono"],
    source: {
      installed: ["ABC Areal", "ABC Areal Variable"]
    },
    links: {
      foundry: "https://abcdinamo.com"
    }
  },
  {
    id: "tiempos-headline",
    name: "Tiempos Headline",
    kind: "display",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "Klim's headline serif: dark, sharp and compact. One of the most used editorial faces.",
    family: ["tiempos-text"],
    source: {
      installed: ["Tiempos Headline", "Test Tiempos Headline VF", "Test Tiempos Headline"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "tiempos-text",
    name: "Tiempos Text",
    kind: "display",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "The text cut of Tiempos, sturdy at reading sizes. A serious choice for Articles' body.",
    family: ["tiempos-headline"],
    source: {
      installed: ["Tiempos Text", "Test Tiempos Text VF", "Test Tiempos Text"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "signifier",
    name: "Signifier",
    kind: "display",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "A sharp, high-contrast serif drawn from 17th-century type, rebuilt for screens.",
    source: {
      installed: ["Signifier", "Test Signifier VF", "Test Signifier"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "financier-text",
    name: "Financier Text",
    kind: "display",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "Drawn for the Financial Times. Small x-height, classical; best for headlines and long reads.",
    source: {
      installed: ["Financier Text", "Test Financier Text VF", "Test Financier Text"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "martina-plantijn",
    name: "Martina Plantijn",
    kind: "display",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "Klim's Plantin, warm and dense. Strong for book-like pages.",
    source: {
      installed: ["Martina Plantijn", "Test Martina Plantijn VF", "Test Martina Plantijn"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "family",
    name: "Family",
    kind: "display",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "A serif whose weights each have their own character, from thin and sharp to heavy and soft.",
    source: {
      installed: ["Family", "Test Family VF", "Test Family"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "untitled-serif",
    name: "Untitled Serif",
    kind: "display",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "The quiet serif twin of Untitled Sans.",
    family: ["untitled-sans"],
    source: {
      installed: ["Untitled Serif", "Test Untitled Serif VF", "Test Untitled Serif"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "serrif",
    name: "Serrif",
    kind: "display",
    tier: "licensed",
    foundry: "Displaay",
    designers: ["Martin Vácha"],
    licence: "Commercial",
    about: "Displaay's serif with a width axis (50 to 100) and a matching Serrif Mono.",
    family: ["serrif-mono"],
    source: {
      installed: ["Serrif", "Serrif Collection VF", "Serrif Collection VF-TRIAL"]
    },
    links: {
      foundry: "https://displaay.net"
    }
  },
  {
    id: "edict",
    name: "Edict",
    kind: "display",
    tier: "licensed",
    foundry: "Schick Toikka",
    designers: [],
    licence: "Commercial",
    about: "Schick Toikka's display serif: tall, narrow and sharp, with a separate Text cut.",
    source: {
      installed: ["Edict Display", "Edict Display Trial"]
    },
    links: {
      foundry: "https://www.schick-toikka.com"
    }
  },
  {
    id: "pp-kyoto",
    name: "PP Kyoto",
    kind: "display",
    tier: "licensed",
    foundry: "Pangram Pangram",
    designers: [],
    licence: "Commercial",
    about: "Pangram Pangram's serif, from Thin to Extrabold, with italics.",
    source: {
      installed: ["PP Kyoto"]
    },
    links: {
      foundry: "https://pangrampangram.com"
    }
  },
  {
    id: "sohne-mono",
    name: "Söhne Mono",
    kind: "code",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "Söhne's mono, from the same drawings.",
    family: ["sohne"],
    source: {
      installed: ["Söhne Mono", "Test Söhne Mono"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "abc-areal-mono",
    name: "ABC Areal Mono",
    kind: "code",
    tier: "licensed",
    foundry: "Dinamo",
    designers: [],
    licence: "Commercial",
    about: "Areal's mono. Semi Mono sits between it and the sans.",
    family: ["abc-areal"],
    source: {
      installed: ["ABC Areal Mono", "ABC Areal Mono Variable"]
    },
    links: {
      foundry: "https://abcdinamo.com"
    }
  },
  {
    id: "serrif-mono",
    name: "Serrif Mono",
    kind: "code",
    tier: "licensed",
    foundry: "Displaay",
    designers: ["Martin Vácha"],
    licence: "Commercial",
    about: "Serrif's mono, with the same width axis.",
    family: ["serrif"],
    source: {
      installed: ["Serrif Mono", "Serrif Mono Collection VF", "Serrif Mono Collection VF-TRIAL"]
    },
    links: {
      foundry: "https://displaay.net"
    }
  },
  {
    id: "pp-right-serif-mono",
    name: "PP Right Serif Mono",
    kind: "code",
    tier: "licensed",
    foundry: "Pangram Pangram",
    designers: [],
    licence: "Commercial",
    about: "A serifed mono from Pangram Pangram, in Fine, Regular and Dark.",
    source: {
      installed: ["PP Right Serif Mono"]
    },
    links: {
      foundry: "https://pangrampangram.com"
    }
  },
  {
    id: "satoshi",
    name: "Satoshi",
    kind: "text",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Deni Anggara"],
    licence: "ITF Free Font License 2.0",
    about: "The modernist grotesk Fontshare is known for. Light stems (0.82 of Geist).",
    source: {
      installed: ["Satoshi"],
      fontshare: "satoshi"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/satoshi"
    }
  },
  {
    id: "general-sans",
    name: "General Sans",
    kind: "text",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Frode Helland"],
    licence: "ITF Free Font License 2.0",
    about: "A geometric grotesk and a startup favourite. Light at regular.",
    source: {
      installed: ["General Sans"],
      fontshare: "general-sans"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/general-sans"
    }
  },
  {
    id: "switzer",
    name: "Switzer",
    kind: "text",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Jérémie Hornus"],
    licence: "ITF Free Font License 2.0",
    about: "A neo-grotesk in the Helvetica tradition, with Geist's x-height (0.531) and stem.",
    source: {
      installed: ["Switzer"],
      fontshare: "switzer"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/switzer"
    }
  },
  {
    id: "supreme",
    name: "Supreme",
    kind: "text",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Jérémie Hornus", "Ilya Naumoff"],
    licence: "ITF Free Font License 2.0",
    about: "Geometric with grotesk details. Wide range, 100 to 800.",
    source: {
      installed: ["Supreme"],
      fontshare: "supreme"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/supreme"
    }
  },
  {
    id: "synonym",
    name: "Synonym",
    kind: "text",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Hugo Dumont"],
    licence: "ITF Free Font License 2.0",
    about: "A soft humanist sans. The lightest stems here (0.80).",
    source: {
      installed: ["Synonym"],
      fontshare: "synonym"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/synonym"
    }
  },
  {
    id: "author",
    name: "Author",
    kind: "text",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Satya Rajpurohit"],
    licence: "ITF Free Font License 2.0",
    about: "A narrow sans with a small x-height: editorial rather than UI.",
    source: {
      installed: ["Author"],
      fontshare: "author"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/author"
    }
  },
  {
    id: "erode",
    name: "Erode",
    kind: "display",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Nikhil Ranganathan"],
    licence: "ITF Free Font License 2.0",
    about: "A soft, low-contrast serif with a small x-height.",
    source: {
      installed: ["Erode"],
      fontshare: "erode"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/erode"
    }
  },
  {
    id: "zodiak",
    name: "Zodiak",
    kind: "display",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Jérémie Hornus", "Gaetan Baehr", "Jean-Baptiste Morizot", "Alisa Nowak", "Theo Guillard"],
    licence: "ITF Free Font License 2.0",
    about: "A wide, sturdy serif that holds at text and title sizes.",
    source: {
      installed: ["Zodiak"],
      fontshare: "zodiak"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/zodiak"
    }
  },
  {
    id: "gambetta",
    name: "Gambetta",
    kind: "display",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Paul Troppmar"],
    licence: "ITF Free Font License 2.0",
    about: "A transitional serif with crisp joins.",
    source: {
      installed: ["Gambetta"],
      fontshare: "gambetta"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/gambetta"
    }
  },
  {
    id: "sentient",
    name: "Sentient",
    kind: "display",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Noopur Choksi"],
    licence: "ITF Free Font License 2.0",
    about: "A heavy, warm serif. The sturdiest Fontshare serif (stem 1.17).",
    source: {
      installed: ["Sentient"],
      fontshare: "sentient"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/sentient"
    }
  },
  {
    id: "boska",
    name: "Boska",
    kind: "display",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Barbara Bigosinska"],
    licence: "ITF Free Font License 2.0",
    about: "A high-contrast display serif. Thin at regular: headlines only.",
    source: {
      installed: ["Boska"],
      fontshare: "boska"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/boska"
    }
  },
  {
    id: "clash-display",
    name: "Clash Display",
    kind: "display",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["Indian Type Foundry"],
    licence: "ITF Free Font License 2.0",
    about: "A wide display grotesk with tight curves.",
    source: {
      installed: ["Clash Display"],
      fontshare: "clash-display"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/clash-display"
    }
  },
  {
    id: "cabinet-grotesk",
    name: "Cabinet Grotesk",
    kind: "display",
    tier: "own-copy",
    foundry: "Fontshare",
    designers: ["ITF"],
    licence: "ITF Free Font License 2.0",
    about: "A grotesk with quirky, compact forms; strongest at heavy weights.",
    source: {
      installed: ["Cabinet Grotesk"],
      fontshare: "cabinet-grotesk"
    },
    links: {
      foundry: "https://www.fontshare.com/fonts/cabinet-grotesk"
    }
  },
  {
    id: "pp-neue-montreal",
    name: "PP Neue Montreal",
    kind: "text",
    tier: "licensed",
    foundry: "Pangram Pangram",
    designers: [],
    licence: "Commercial",
    about: "Pangram Pangram's neo-grotesk, one of the most used faces on studio and product sites.",
    source: {
      installed: ["PP Neue Montreal"]
    },
    links: {
      foundry: "https://pangrampangram.com"
    }
  },
  {
    id: "pp-editorial-new",
    name: "PP Editorial New",
    kind: "display",
    tier: "licensed",
    foundry: "Pangram Pangram",
    designers: [],
    licence: "Commercial",
    about: "A sharp, high-contrast serif, often paired with Neue Montreal.",
    source: {
      installed: ["PP Editorial New"]
    },
    links: {
      foundry: "https://pangrampangram.com"
    }
  },
  {
    id: "pp-mori",
    name: "PP Mori",
    kind: "text",
    tier: "licensed",
    foundry: "Pangram Pangram",
    designers: [],
    licence: "Commercial",
    about: "A wide-set grotesk with soft curves.",
    source: {
      installed: ["PP Mori"]
    },
    links: {
      foundry: "https://pangrampangram.com"
    }
  },
  {
    id: "pp-neue-machina",
    name: "PP Neue Machina",
    kind: "display",
    tier: "licensed",
    foundry: "Pangram Pangram",
    designers: [],
    licence: "Commercial",
    about: "A geometric display grotesk with squared curves.",
    source: {
      installed: ["PP Neue Machina"]
    },
    links: {
      foundry: "https://pangrampangram.com"
    }
  },
  {
    id: "abc-diatype",
    name: "ABC Diatype",
    kind: "text",
    tier: "licensed",
    foundry: "Dinamo",
    designers: [],
    licence: "Commercial",
    about: "Dinamo's workhorse grotesk, with Mono, Semi Mono and Rounded: the family Areal follows in build.",
    source: {
      installed: ["ABC Diatype", "ABC Diatype Variable"]
    },
    links: {
      foundry: "https://abcdinamo.com"
    }
  },
  {
    id: "abc-favorit",
    name: "ABC Favorit",
    kind: "text",
    tier: "licensed",
    foundry: "Dinamo",
    designers: [],
    licence: "Commercial",
    about: "A grotesk with a typewriter's rhythm, and a Mono.",
    source: {
      installed: ["ABC Favorit", "ABC Favorit Variable"]
    },
    links: {
      foundry: "https://abcdinamo.com"
    }
  },
  {
    id: "abc-arizona",
    name: "ABC Arizona",
    kind: "display",
    tier: "licensed",
    foundry: "Dinamo",
    designers: [],
    licence: "Commercial",
    about: "A superfamily that runs from sans to serif: Sans, Mix, Serif and Flare.",
    source: {
      installed: ["ABC Arizona", "ABC Arizona Variable"]
    },
    links: {
      foundry: "https://abcdinamo.com"
    }
  },
  {
    id: "abc-monument-grotesk",
    name: "ABC Monument Grotesk",
    kind: "display",
    tier: "licensed",
    foundry: "Dinamo",
    designers: [],
    licence: "Commercial",
    about: "Dinamo's grotesk, with a Mono.",
    source: {
      installed: ["ABC Monument Grotesk", "ABC Monument Grotesk Variable"]
    },
    links: {
      foundry: "https://abcdinamo.com"
    }
  },
  {
    id: "aeonik",
    name: "Aeonik",
    kind: "text",
    tier: "licensed",
    foundry: "CoType Foundry",
    designers: [],
    licence: "Commercial",
    about: "CoType's geometric grotesk, one of the most used product faces, with Mono and Fono.",
    source: {
      installed: ["Aeonik"]
    },
    links: {
      foundry: "https://cotypefoundry.com"
    }
  },
  {
    id: "rm-neue",
    name: "RM Neue",
    kind: "text",
    tier: "licensed",
    foundry: "CoType Foundry",
    designers: [],
    licence: "Commercial",
    about: "CoType's neo-grotesk, with a matching RM Mono.",
    source: {
      installed: ["RM Neue"]
    },
    links: {
      foundry: "https://cotypefoundry.com"
    }
  },
  {
    id: "roobert",
    name: "Roobert",
    kind: "text",
    tier: "licensed",
    foundry: "Displaay",
    designers: [],
    licence: "Commercial",
    about: "Displaay's friendly geometric grotesk, a common product face.",
    source: {
      installed: ["Roobert"]
    },
    links: {
      foundry: "https://displaay.net"
    }
  },
  {
    id: "matter",
    name: "Matter",
    kind: "text",
    tier: "licensed",
    foundry: "Displaay",
    designers: [],
    licence: "Commercial",
    about: "Displaay's grotesk drawn for interfaces.",
    source: {
      installed: ["Matter"]
    },
    links: {
      foundry: "https://displaay.net"
    }
  },
  {
    id: "haffer",
    name: "Haffer",
    kind: "text",
    tier: "licensed",
    foundry: "Displaay",
    designers: [],
    licence: "Commercial",
    about: "Displaay's grotesk with a sharp, contemporary edge.",
    source: {
      installed: ["Haffer"]
    },
    links: {
      foundry: "https://displaay.net"
    }
  },
  {
    id: "reckless",
    name: "Reckless",
    kind: "display",
    tier: "licensed",
    foundry: "Displaay",
    designers: [],
    licence: "Commercial",
    about: "Displaay's display serif with soft, sculpted curves.",
    source: {
      installed: ["Reckless"]
    },
    links: {
      foundry: "https://displaay.net"
    }
  },
  {
    id: "national-2",
    name: "National 2",
    kind: "text",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "Klim's sturdy grotesk, a reliable product face, with narrow and condensed widths.",
    source: {
      installed: ["National 2", "Test National 2"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  },
  {
    id: "domaine-display",
    name: "Domaine Display",
    kind: "display",
    tier: "licensed",
    foundry: "Klim Type Foundry",
    designers: ["Kris Sowersby"],
    licence: "Commercial",
    about: "Klim's sharp, high-contrast display serif.",
    source: {
      installed: ["Domaine Display", "Test Domaine Display"]
    },
    links: {
      foundry: "https://klim.co.nz"
    }
  }
];
