/**
 * Scenes 10–18 of the abstract board (abstract/scene.tsx explains the method). Readings are in each reference's reading
 * copy; `b(...)` turns them into CSS px at the scene's zoom. Drawings that are pictures in the reference (a map, app
 * icons, a 3D calendar) are drawn here in Area's colours and strokes rather than made into components.
 */
import type { CSSProperties, ReactNode } from "react";
import { Badge, Button, Checkbox, NumberField, Stack, Surface, Switch } from "@area/react";
import {
  CalendarClockIcon, CalendarIcon, CornerBottomLeftIcon, CornerBottomRightIcon, CornerIcon, CornerTopRightIcon,
  CornersIcon, DismissIcon, FolderIcon, TableIcon, InboxIcon, LockFilledIcon, MaximizeIcon, MinusIcon, MoreHorizontalIcon,
  NavigationFilledIcon, OpacityIcon, PersonCheckIcon, PushpinFilledIcon, RepeatIcon, ScanTextIcon,
  SearchIcon, ShareIcon, SlidersIcon, StarFilledIcon, ComposeIcon, StickyNoteIcon, TagIcon, TrashIcon,
} from "@area/icons";
import { box, Scene } from "./scene.tsx";

/* 10 Box model (1400×1400, zoom 1.8 → 778×778; the margin label's 36 = Area's 20 badge). A near-white page (Light
   ground 97); a white bezel 17 thick round a grey well; in it the element's border box with a disc in each corner, the
   padding box in the measuring blue with its dark edge, and the dashed content box. Margins are drawn on their own
   axis: pink for top and bottom, blue for left and right, each label on a hairline from the well's edge. */
export const S10 = () => {
  const b = box(1.8);
  const pink = (top: number) => <span className="sc-bm__mark sc-bm__mark--v" style={b(699, top, undefined, 88)}><Badge variant="solid" tone="info" className="sc-pink">20</Badge></span>;
  const blue = (left: number) => <span className="sc-bm__mark sc-bm__mark--h" style={b(left, 700, 88)}><Badge variant="solid" tone="info">20</Badge></span>;
  return (
    <Scene view={[1400, 1400]} zoom={1.8} scope={{ "data-area-ground-light": "97", "data-area-type": "16" }} bg="var(--area-bg-page)">
      <div className="sc-bm" data-area-ground="raised" style={b(287, 422, 826, 556)} />
      <div className="sc-bm__well" style={b(304, 439, 792, 522)} />
      <div className="sc-bm__border" style={b(392, 527, 615, 345)}>
        {(["tl", "tr", "bl", "br"] as const).map(corner => <span key={corner} className={`sc-bm__corner sc-bm__corner--${corner}`}>28</span>)}
        <span className="sc-bm__dash" style={b(306, 33)}>–</span><span className="sc-bm__dash" style={b(306, 309)}>–</span>
        <span className="sc-bm__dash" style={b(35, 172)}>–</span><span className="sc-bm__dash" style={b(578, 172)}>–</span>
      </div>
      <div className="sc-bm__padding" style={b(463, 597, 474, 205)}>
        <span className="sc-bm__dash" style={b(237, 33)}>–</span><span className="sc-bm__dash" style={b(237, 170)}>–</span>
        <span className="sc-bm__side" style={b(33, 102)}>8</span><span className="sc-bm__side" style={b(437, 102)}>8</span>
      </div>
      <div className="sc-bm__content" style={b(532, 667, 335, 65)}>360 × 48</div>
      {pink(439)}{pink(872)}{blue(304)}{blue(1007)}
    </Scene>
  );
};

/* 11 Corner radius (1400×1400, zoom 2.44 → 574×574; the fields' 78 = Area's 32). A near-white page; a white card with a
   7 inset: opacity and the Mixed corner mode (its icon on the selection tint), a rule, the top corners, the preview
   well with each corner's radius drawn as a disc on the shape, a settings button in the well's corner, then the
   bottom corners. Corner radii read as plain numbers (the reference's "°" is an angle unit, wrong for a radius). */
export const S11 = () => {
  const b = box(2.44);
  const corner = (label: string, value: number, icon: ReactNode) => <NumberField variant="soft" fullWidth aria-label={label} defaultValue={value} scrub={icon} />;
  return (
    <Scene view={[1400, 1400]} zoom={2.44} scope={{ "data-area-ground-light": "97", "data-area-type": "14", "data-area-selection": "accent" }} bg="var(--area-bg-page)">
      {/* A Surface holding the preview well, so it sets it at its media inset (8, the shot's 7); the well is a soft Surface
          whose corner is the card's less that inset; the rows are a Stack at the related gap. */}
      <Surface style={b(287, 341, 826)}>
        <Stack gap="related">
          <div className="sc-grid sc-2">
            <NumberField variant="soft" fullWidth aria-label="Opacity" defaultValue={100} unit="%" scrub={<OpacityIcon />} />
            <div className="sc-field" role="button" aria-label="Corner radius: Mixed"><span className="sc-iconbox"><CornersIcon /></span>Mixed</div>
          </div>
          <hr className="sc-rule" />
          <div className="sc-grid sc-2">{corner("Top left", 20, <CornerIcon />)}{corner("Top right", 40, <CornerTopRightIcon />)}</div>
          <Surface variant="soft" className="sc-cornerwell" aria-label="Corner preview">
            <div className="sc-cornershape" style={b(88 - 17, 88 - 17, 615, 198)}>
              <span className="sc-disc sc-disc--tl">20</span><span className="sc-disc sc-disc--bl">20</span>
              <span className="sc-disc sc-disc--tr">40</span><span className="sc-disc sc-disc--br" aria-hidden="true" />
            </div>
            <Button size="sm" variant="outline" tone="neutral" iconOnly aria-label="Corner settings" icon={<SlidersIcon />} className="sc-cornerbtn" />
          </Surface>
          <div className="sc-grid sc-2">{corner("Bottom left", 20, <CornerBottomLeftIcon />)}{corner("Bottom right", 20, <CornerBottomRightIcon />)}</div>
        </Stack>
      </Surface>
    </Scene>
  );
};

/* 12 Appearance dialog in gold (1400×1400, zoom 2.4 → 583×583; the buttons' 96 = Area's 40). A blurred long-exposure
   sea behind; the dialog a gold layer (Area's yellow and brown ramps) with the Jelly material's lit edge: the title and
   a round close button, Theme and its three window previews (dark, light, gold; gold chosen, ringed), Sidebar with
   its switch at the row's end, a rule, then Cancel and Save across. Section labels in Area's mono face, as the shot. */
export const S12 = () => {
  const b = box(2.4);
  const preview = (theme: "dark" | "light" | "gold", left: number) => (
    <label className="sc-theme" data-theme={theme} style={b(left, 497 - 125, 325, 243)}>
      <input type="radio" name="sc12-theme" defaultChecked={theme === "gold"} aria-label={theme[0]!.toUpperCase() + theme.slice(1)} />
      <span className="sc-theme__window" {...(theme === "dark" ? { "data-area-theme": "dark" } : {})}>
        <span className="sc-theme__side"><i className="sc-theme__dots" /><i /><i /><i className="sc-theme__short" /><i className="sc-theme__me" /></span>
        <span className="sc-theme__main"><i /><i className="sc-theme__long" /><span className="sc-theme__tiles"><i /><i /><i /></span><i className="sc-theme__foot" /></span>
      </span>
    </label>
  );
  return (
    <Scene view={[1400, 1400]} zoom={2.4} className="sc-sea">
      <div className="sc-gold" data-area-material="jelly" data-area-accent="yellow" style={b(127, 125, 1146, 1152)}>
        <h3 className="sc-gold__title">Appearance</h3>
        <Button size="lg" variant="outline" tone="neutral" iconOnly pill aria-label="Close" icon={<DismissIcon />} className="sc-gold__close" />
        <div className="sc-gold__label" style={{ top: (375 - 125) / 2.4 }}><b>Theme</b><span>Customize UI colors</span></div>
        <div role="radiogroup" aria-label="Theme">{preview("dark", 186 - 127)}{preview("light", 537 - 127)}{preview("gold", 884 - 127)}</div>
        <div className="sc-gold__switch"><Switch size="lg" labelPosition="start" fullWidth label={<span className="sc-gold__label sc-gold__label--static"><b>Sidebar</b><span>Make the sidebar transparent</span></span>} /></div>
        <hr className="sc-gold__rule" />
        <div className="sc-gold__actions"><Button size="lg" variant="solid" tone="neutral" className="sc-gold__cancel">Cancel</Button><Button size="lg" variant="outline" tone="neutral" className="sc-gold__save">Save</Button></div>
      </div>
    </Scene>
  );
};

/* 13 Location card (1400×1050, zoom 2.6 → 538×404; the title's 30 cap = Area's 16 title). A white page; one card 235
   wide with Area's resting shadow: a map of the Channel coast in Area's blue and green, the pin (the info blue on a
   white ring), then the place in the title size with the Navigation glyph, and the note in muted text over a soft scrim
   that fades the map out below. */
export const S13 = () => {
  const b = box(2.6);
  return (
    <Scene view={[1400, 1050]} zoom={2.6} scope={{ "data-area-ground-light": "100", "data-area-type": "13" }} bg="var(--area-bg-page)">
      <div className="sc-map" style={b(397, 230, 610, 589)}>
        <div className="sc-map__clip">
          <FranceMap />
          <span className="sc-pin" style={b(632 - 397 - 27, 468 - 230 - 27, 54, 54)} />
          <div className="sc-map__text">
            <span className="sc-map__title"><NavigationFilledIcon />Based in France</span>
            <span className="sc-map__note">Working remotely</span>
          </div>
        </div>
      </div>
    </Scene>
  );
};
/** The map: water, the land traced from the reference's coastline (5px rows, merged by a soft threshold so the coast
    reads as one smooth edge), borders, roads and the towns where the shot labels them. */
const LAND = "M0 0h41v5h-41zM98 0h211v5h-211zM391 0h219v5h-219zM0 5h33v5h-33zM96 5h210v5h-210zM385 5h225v5h-225zM0 10h25v5h-25zM95 10h208v5h-208zM383 10h227v5h-227zM0 15h19v5h-19zM96 15h204v5h-204zM381 15h229v5h-229zM0 20h15v5h-15zM100 20h195v5h-195zM377 20h233v5h-233zM0 25h11v5h-11zM125 25h166v5h-166zM373 25h237v5h-237zM0 30h7v5h-7zM139 30h150v5h-150zM369 30h241v5h-241zM145 35h153v5h-153zM365 35h245v5h-245zM144 40h8v5h-8zM158 40h146v5h-146zM356 40h254v5h-254zM126 45h179v5h-179zM348 45h262v5h-262zM120 50h183v5h-183zM341 50h269v5h-269zM114 55h183v5h-183zM326 55h284v5h-284zM111 60h180v5h-180zM314 60h296v5h-296zM108 65h176v5h-176zM311 65h299v5h-299zM103 70h120v5h-120zM263 70h7v5h-7zM310 70h300v5h-300zM97 75h58v5h-58zM175 75h20v5h-20zM214 75h5v5h-5zM309 75h301v5h-301zM93 80h56v5h-56zM309 80h301v5h-301zM88 85h57v5h-57zM309 85h301v5h-301zM82 90h26v5h-26zM130 90h11v5h-11zM308 90h302v5h-302zM78 95h21v5h-21zM307 95h303v5h-303zM84 100h9v5h-9zM303 100h307v5h-307zM298 105h312v5h-312zM286 110h324v5h-324zM274 115h336v5h-336zM267 120h343v5h-343zM198 125h19v5h-19zM264 125h346v5h-346zM196 130h24v5h-24zM262 130h348v5h-348zM197 135h27v5h-27zM260 135h350v5h-350zM198 140h412v5h-412zM200 145h410v5h-410zM202 150h408v5h-408zM203 155h407v5h-407zM204 160h406v5h-406zM142 165h15v5h-15zM204 165h406v5h-406zM132 170h30v5h-30zM203 170h407v5h-407zM103 175h64v5h-64zM175 175h435v5h-435zM98 180h512v5h-512zM94 185h516v5h-516zM90 190h520v5h-520zM93 195h517v5h-517zM104 200h506v5h-506zM106 205h504v5h-504zM109 210h501v5h-501zM128 215h480v5h-480zM140 220h83v5h-83zM247 220h360v5h-360zM149 225h68v5h-68zM252 225h356v5h-356zM162 230h52v5h-52zM256 230h354v5h-354zM170 235h42v5h-42zM258 235h352v5h-352zM173 240h38v5h-38zM258 240h352v5h-352zM176 245h35v5h-35zM257 245h353v5h-353zM182 250h31v5h-31zM255 250h355v5h-355zM184 255h33v5h-33zM252 255h358v5h-358zM185 260h38v5h-38zM246 260h364v5h-364zM185 265h425v5h-425zM186 270h423v5h-423zM189 275h421v5h-421zM192 280h418v5h-418zM195 285h413v5h-413zM200 290h406v5h-406zM206 295h401v5h-401zM210 300h398v5h-398zM213 305h395v5h-395zM212 310h397v5h-397zM210 315h400v5h-400zM210 320h398v5h-398zM211 325h396v5h-396zM212 330h397v5h-397zM213 335h397v5h-397zM211 340h396v5h-396zM209 345h400v5h-400zM207 350h403v5h-403zM205 355h405v5h-405zM203 360h407v5h-407zM200 365h410v5h-410zM193 370h417v5h-417zM192 375h418v5h-418zM188 380h388v5h-388zM601 380h9v5h-9zM186 385h385v5h-385zM603 385h7v5h-7zM183 390h385v5h-385zM603 390h5v5h-5zM176 395h392v5h-392zM169 400h395v5h-395zM163 405h393v5h-393zM158 410h380v5h-380zM147 415h380v5h-380zM138 420h381v5h-381zM130 425h379v5h-379zM0 430h11v5h-11zM101 430h399v5h-399zM0 435h51v5h-51zM56 435h7v5h-7zM65 435h426v5h-426zM605 435h5v5h-5zM0 440h473v5h-473zM603 440h7v5h-7zM0 445h471v5h-471zM602 445h8v5h-8zM0 450h459v5h-459zM602 450h8v5h-8zM0 455h447v5h-447zM602 455h8v5h-8zM0 460h438v5h-438zM603 460h7v5h-7zM0 465h434v5h-434zM0 470h430v5h-430zM0 475h422v5h-422zM0 480h416v5h-416zM0 485h413v5h-413zM0 490h409v5h-409zM0 495h406v5h-406zM0 500h400v5h-400zM0 505h395v5h-395zM0 510h392v5h-392zM0 515h389v5h-389zM0 520h387v5h-387zM0 525h384v5h-384zM603 525h7v5h-7zM0 530h379v5h-379zM604 530h6v5h-6zM0 535h378v5h-378zM0 540h374v5h-374zM605 540h5v5h-5zM0 545h368v5h-368zM601 545h9v5h-9zM1 550h363v5h-363zM599 550h11v5h-11zM0 555h360v5h-360zM597 555h13v5h-13zM0 560h358v5h-358zM594 560h16v5h-16zM0 565h356v5h-356zM589 565h21v5h-21zM0 570h358v5h-358zM587 570h23v5h-23zM0 575h357v5h-357zM582 575h28v5h-28zM0 580h355v5h-355zM580 580h30v5h-30zM0 585h353v5h-353zM575 585h35v5h-35z";
const TOWNS: Array<[string, number, number]> = [
  ["Londres", 260, 27], ["Bruxelles", 439, 57], ["Amiens", 350, 109], ["Luxembourg", 488, 117], ["Rouen", 310, 132], ["Reims", 408, 138],
  ["Caen", 258, 147], ["Paris", 353, 159], ["Nancy", 480, 163], ["Strasbourg", 543, 163], ["Brest", 118, 182], ["Rennes", 218, 199],
  ["Le Mans", 283, 206], ["Orléans", 341, 210], ["Dijon", 445, 234], ["Tours", 297, 236], ["Poitiers", 287, 279], ["Lyon", 445, 314], ["Bordeaux", 261, 367],
];
const FranceMap = () => (
  <svg className="sc-map__art" viewBox="0 0 610 589" preserveAspectRatio="none" aria-hidden="true">
    <defs><filter id="sc-map-coast" x="0" y="0" width="1" height="1"><feGaussianBlur stdDeviation="3.5" /><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 14 -6" /></filter></defs>
    <rect width="610" height="589" className="sc-map__water" />
    <path d={LAND} className="sc-map__land" filter="url(#sc-map-coast)" />
    <path className="sc-map__border" d="M343 46 C362 60 380 74 402 88 C430 92 452 98 478 104 C500 112 512 118 524 122 M524 122 C534 140 540 160 556 176 C566 196 560 216 566 236 M566 236 C552 252 536 266 528 284 C536 300 548 312 556 330" />
    <path className="sc-map__road" d="M353 159 C320 180 290 196 258 200 M353 159 C368 200 400 250 445 314 M353 159 C390 150 440 160 480 163 M353 159 C340 130 330 120 310 132 M353 159 C380 140 400 140 408 138 M258 200 C276 230 282 260 287 279 C276 310 268 340 261 367 M353 159 C340 180 320 214 297 236" />
    {TOWNS.map(([name, x, y]) => <g key={name}><circle cx={x} cy={y} r="2.4" className="sc-map__dot" /><text x={x + 5} y={y + 3} className="sc-map__town">{name}</text></g>)}
  </svg>
);

/* 14 Note actions over a photo (1199×1400, zoom 3.25 → 369×431; Find in Note's 38 cap = Area's 16 text). A dark,
   blurred room; the note's glass bar with four round actions (More current, solid), and the glass menu below: an icon
   row (scan, pin, lock), a rule, then four commands with their icons at the row's end. Glass material, type 16 and
   Density 36, so the menu keeps Area's rows at the shot's reach. */
export const S14 = () => {
  const b = box(3.25);
  const round = (label: string, icon: ReactNode, solid?: boolean) => <Button size="lg" variant={solid ? "solid" : "soft"} tone="neutral" iconOnly pill aria-label={label} icon={icon} className={solid ? "sc-glass__on" : undefined} />;
  const item = (label: string, icon: ReactNode) => <button type="button" role="menuitem" className="sc-glass__item"><span>{label}</span>{icon}</button>;
  return (
    <Scene view={[1199, 1400]} zoom={3.25} scope={{ "data-area-theme": "dark", "data-area-type": "16", "data-area-density": "36" }} className="sc-room">
      <div className="sc-photo" style={b(-20, 320, 940, 1100)} />
      <div className="sc-glass sc-glass--bar" style={b(-80, 85, 1000, 240)}>
        <div className="sc-row" style={{ gap: 46 / 3.25, paddingInlineStart: (222 + 80) / 3.25, paddingBlockStart: (137 - 85) / 3.25 }}>
          {round("Collaborate", <PersonCheckIcon />)}{round("Share", <ShareIcon />)}{round("More", <MoreHorizontalIcon />, true)}{round("New note", <ComposeIcon />)}
        </div>
      </div>
      <div className="sc-glass sc-glass--menu" role="menu" aria-label="Note" style={b(228, 297, 812, 980)}>
        <div className="sc-glass__icons"><ScanTextIcon /><PushpinFilledIcon /><LockFilledIcon /></div>
        <hr className="sc-glass__rule" />
        {item("Find in Note", <SearchIcon />)}{item("Move Note", <FolderIcon />)}{item("Lines & Grids", <TableIcon />)}{item("Delete", <TrashIcon />)}
      </div>
    </Scene>
  );
};

/* 15 Week strip and events (1400×1400, zoom 2.6 → 538×538; the chosen day's 104 = Area's 40). A white page; a card on
   the subtle ground: the month in the title size, the week's letters and dates on a 40 pitch, today raised (an outline
   pill with the floating shadow), dots under days with events; then a white sheet of the day's events, each a title and
   its time, ruled, the last fading out. The pointer rests to the right. */
export const S15 = () => {
  const b = box(2.6);
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const dots = [1, 1, 0, 0, 1, 0, 1];
  return (
    <Scene view={[1400, 1400]} zoom={2.6} scope={{ "data-area-ground-light": "99", "data-area-type": "14", "data-area-pills": "button" }} bg="var(--area-bg-page)">
      <div className="sc-week" data-area-ground="recessed" style={b(306, 305, 790, 792)}>
        <h3 className="sc-week__month">Sep 2024</h3>
        <div className="sc-week__days" role="radiogroup" aria-label="Day">
          {days.map((day, index) => (
            <span key={index} className="sc-week__day">
              <span className="sc-muted">{day}</span>
              <Button size="lg" variant={index === 2 ? "outline" : "ghost"} tone="neutral" iconOnly role="radio" aria-checked={index === 2} aria-label={`September ${index + 1}`} icon={<span>{index + 1}</span>} className={index === 2 ? "sc-week__today" : undefined} />
              <i className="sc-week__dot" data-on={dots[index] ? "" : undefined} />
            </span>
          ))}
        </div>
        <div className="sc-events" data-area-ground="raised">
          {[["Project Review", "10:00 - 11:00 AM"], ["Lunch Break", "12:00 - 12:30 PM"], ["Code Review", "3:00 - 4:00 PM"]].map(([title, time]) => (
            <div key={title} className="sc-event"><b>{title}</b><span>{time}</span></div>
          ))}
        </div>
      </div>
      <Cursor style={b(1232, 893)} />
    </Scene>
  );
};

/** The system arrow pointer, as the shot shows it resting beside the card (not an icon: the OS cursor's own shape). */
const Cursor = ({ style }: { style: CSSProperties }) => (
  <svg className="sc-pointer" style={style} viewBox="0 0 14 21" aria-hidden="true"><path d="M1 1v16.2l3.9-3.8 2.6 6.1 2.9-1.2-2.6-6h5.5Z" /></svg>
);

/* 16 Window controls, close (1400×1400, zoom 4.7 → 298×298; the lights' 188 = Area's 40 button). A grey page; the
   window's white corner (radius 30, the card edge); on it the controls' pill in the Jelly material (a tone gradient and
   catch-light), holding close, minimise and full screen as solid danger, caution and success buttons with their
   glyphs cut in a darker ink, each casting its own coloured light. */
export const S16 = () => {
  const b = box(4.7);
  const light = (label: string, tone: "danger" | "caution" | "success", icon: ReactNode) =>
    <Button size="lg" variant="solid" tone={tone} iconOnly pill aria-label={label} icon={icon} className="sc-light" />;
  return (
    <Scene view={[1400, 1400]} zoom={4.7} scope={{ "data-area-ground-light": "96" }} bg="var(--area-bg-page)">
      <div className="sc-window sc-window--corner" data-area-ground="raised" style={b(236, 236, 1300, 1300)} />
      <div className="sc-lights" data-area-material="jelly" style={b(385, 384, 816, 357)}>
        {light("Close", "danger", <DismissIcon />)}{light("Minimise", "caution", <MinusIcon />)}{light("Full screen", "success", <MaximizeIcon />)}
      </div>
    </Scene>
  );
};

/* 17 To-do composition (1400×1190, zoom 1.4 → 1000×850, so the shot's labels land on Area's type 12 and its 30 checkbox on Area's 16 box). Three
   off-white panels on a grey page. Left: a day card with a caution-yellow date header, Today, five tasks (open, done,
   won't do) with their start and due dates in the caution and warning inks, and a note line. Top right: two app
   icons, each a stack of to-dos on a tinted base. Bottom right: four task rows as bordered plates, actions at the end.
   The checkbox sits on the label's first line (Area's multiline rule), not centred on label and dates; the round
   checked box in the shot is Area's one square box. Type 12, Density 28. */
export const S17 = () => {
  const b = box(1.4);
  const dates = <span className="sc-dates"><span className="sc-date sc-date--start"><CalendarIcon />Nov 29</span><span className="sc-date sc-date--due"><CalendarClockIcon />Dec 11</span></span>;
  const wont = (label: string) => <span className="sc-wont"><span className="sc-wont__box" role="checkbox" aria-checked="false" aria-label={`${label} (won't do)`}><DismissIcon /></span><s>{label}</s></span>;
  // Each row placed by its label's centre in the reference (y), relative to the day card's top (334).
  const task = (y: number, children: ReactNode) => <div className="sc-task" style={{ top: (y - 385) / 1.4 }}>{children}</div>;
  const actions = <span className="sc-taskrow__actions"><TagIcon /><RepeatIcon /><StickyNoteIcon /></span>;
  const app = (left: number, tone: "blue" | "grey", tasks: string[], mark: ReactNode) => (
    <div className={`sc-appicon sc-appicon--${tone}`} style={b(left, 212, 186, 186)}>
      <div className="sc-appicon__screen">{tasks.map((text, index) => <span key={text} className="sc-appicon__task" data-depth={tasks.length - 1 - index}><i />{text}</span>)}</div>
      <span className="sc-appicon__mark">{mark}</span>
    </div>
  );
  return (
    <Scene view={[1400, 1190]} zoom={1.4} scope={{ "data-area-ground-light": "99", "data-area-type": "12", "data-area-density": "28" }} bg="var(--_page)" className="sc-todo">
      {[[30, 30, 730, 1130], [790, 30, 580, 550], [790, 610, 580, 550]].map(([l, t, w, h], index) => <div key={index} className="sc-todo-panel" style={b(l!, t!, w!, h!)} />)}
      <div className="sc-day" style={b(183, 334, 424, 521)}>
        <div className="sc-day__date">Friday Mar 29th, 2025</div>
        <div className="sc-day__sheet">
          <h3 className="sc-day__title">Today</h3>
          {task(465, <><Checkbox label="Task not started / due today" />{dates}</>)}
          {task(536, <><Checkbox label="List Headline" defaultChecked />{dates}</>)}
          {task(615, wont("Won't do"))}
          {task(666, <><Checkbox label="Task not started / due today" />{dates}</>)}
          {task(745, <Checkbox label="Task Done" defaultChecked className="sc-done" />)}
          <div className="sc-day__note">Add a note</div>
        </div>
      </div>
      {app(877, "blue", ["Plan the Festival", "Buy a lamp", "Go to the gym"], <InboxIcon />)}
      {app(1096, "grey", ["Book the venue", "Write the album"], <StarFilledIcon />)}
      <div className="sc-taskrows" style={b(879, 740, 402, 290)}>
        <div className="sc-taskrow"><Checkbox label="Task not started" /></div>
        <div className="sc-taskrow"><Checkbox label="Done" defaultChecked className="sc-done" />{actions}</div>
        <div className="sc-taskrow">{wont("Won't Do")}{actions}</div>
        <div className="sc-taskrow"><Checkbox label="Text" /></div>
      </div>
    </Scene>
  );
};

/* 18 Add to My Calendar, close (1400×1400, zoom 4.8 → 292×292; "My Calendar" at Area's 32 title). A pale page; a
   large pill in the Soft material (embossed, lit from the top left) cropped by the frame: a white rim round a softly
   graded face, the calendar drawn in Area's caution-to-info gradient with a frosted page, then "Add to" over
   "My Calendar", pressed into the face. Not a button size: one hero action drawn at the shot's scale. */
export const S18 = () => {
  const b = box(4.8);
  return (
    <Scene view={[1400, 1400]} zoom={4.8} scope={{ "data-area-ground-light": "96", "data-area-neutral": "warm", "data-area-type": "16" }} bg="var(--area-bg-page)">
      <div className="sc-cta" role="button" tabIndex={0} aria-label="Add to My Calendar" style={b(150, 272, 1500, 826)}>
        <div className="sc-cta__face">
          <span className="sc-cal" aria-hidden="true"><i className="sc-cal__top" /><i className="sc-cal__ring" /><i className="sc-cal__ring" /><i className="sc-cal__page" /></span>
          <span className="sc-cta__text"><span className="sc-cta__small">Add to</span><span className="sc-cta__big">My Calendar</span></span>
        </div>
      </div>
    </Scene>
  );
};
