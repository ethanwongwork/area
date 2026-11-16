// Copy for the text sections, each with its credit for the colophon.

// Joseph Moxon, Mechanick Exercises on the Whole Art of Printing (1683), §13 ¶1 "Of
// Letter-Cutting", from Theodore Low De Vinne's 1896 reprint. Public domain; text from
// Project Gutenberg ebook 72217, verbatim (italics dropped, spelling as printed).
export const MOXON = "By Body is meant, in Letter-Cutters, Founders and Printers Language, the Side of the Space contained between the Top and Bottom Line of a Long Letter. As in the Draft of Letters, the divided Line on the Left-Hand of A is divided into forty and two equal Parts; and that Length is the Body, thus: J being an Ascending and Descending Letter, viz. a long Letter, stands upon forty-two Parts, and therefore fills the whole Body. There is in common Use here in England, about eleven Bodies, as I shewed in §. 2. ¶. 2. of this Volumne. I told you even now, that all the Punches for the same Body must not have the same Heighth and Thickness: For some are Long; as, J j Q, and several others; as you may see in the Drafts of Letters: and these long Letters stand upon the whole Heighth of the Body. The Ascending and Descending Letters reach from the Foot-Line, up to the Top-Line; as all the Capital Letters are Ascending Letters, and so are many of the Lower-Case Letters; as, b d f, and several others. The Descending Letters are of the same Length with the Ascending Letters; as, g p q and several others. These are contained between the Head-Line and the Bottom-Line. The Short-Letters are contained between the Head-Line and the Bottom-line. These are three different Sizes of Heighth the Punches are made to, for Letters of the same Body. But in proper place I shall handle this Subject more large and distinctly. And as there is three Heighths or Sizes to be considered in Letters Cut to the same Body, so is there three Sizes to be considered, with respect to the Thicknesses of all these Letters, when the Punches are to be Forged: For some are m thick; by m thick is meant m Quadrat thick, which is just so thick as the Body is high: Some are n thick; that is to say, n Quadrat thick, viz. half so thick as the Body is high: And some are Space thick; that is, one quarter so thick as the Body is high; though Spaces are seldom Cast so thick, as shall be shewed when we come to Casting: and therefore, for distinction sake, we shall call these Spaces, Thick Spaces.";

// Original copy in hiragana and katakana (the font has both, no kanji), spaced by phrase.
export const KANA = `ひとつ ひとつの もじが シートの うえで じゅんばんを まって いる。 こすると のこる。 つよく おすと われる。 ちかく もっと ちかく ならべて いくと だれも かいて いない かたちが あらわれる。 ゆっくり よんで。 それから かぜの なかの くさのように ならぶ おなじ しるしの はらっぱとして よんで。`;

// Labels for a shop shelf, like tags on cards.
export const TAGS = `20% off · free · not for sale · last chance to buy · sold out · one each · while it lasts · no returns · new · hand made · ask inside · 2 for 1 · back soon · keep dry · this way up · handle with care`;

/** What each copy option is, for the colophon. */
export const CREDITS = {
  moxon: 'Joseph Moxon, Mechanick Exercises on the Whole Art of Printing (1683), “Of Letter-Cutting”, from the 1896 De Vinne reprint. Public domain, via Project Gutenberg.',
  kana: 'Original copy in hiragana and katakana: letters waiting their turn on a transfer sheet.',
  tags: 'Shop labels, as on price tags.',
  'glyph set': 'Every glyph in PP Kyoto, in the font’s own order.',
  none: 'No copy: patterns only.',
};
