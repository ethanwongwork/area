#!/usr/bin/env python3
"""Validate taxonomy coverage and render reviewable Markdown; no network dependencies."""
import argparse
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
EXPECTED = {
    'flat', 'paper', 'transparency', 'glassmorphism', 'acrylic', 'mica',
    'liquid-glass', 'neumorphism', 'claymorphism', 'skeuomorphism', 'aqua',
    'frutiger-aero', 'glow-neon', 'linear-gradient', 'radial-gradient',
    'conic-gradient', 'mesh-gradient', 'gradient-stroke', 'inner-shadow',
    'inner-glow', 'outer-glow', 'drop-shadow', 'bevel-emboss', 'letterpress', 'grain',
}
COLUMNS = ['fill', 'translucency', 'blur', 'stroke_model', 'highlight',
           'inner_shadow', 'drop_shadow', 'glow', 'grain', 'text_treatment',
           'depth', 'light_direction']


def render():
    assert (ROOT / 'docs/research/astra/README.md').is_file(), ROOT
    data = json.loads((HERE / 'taxonomy.json').read_text())
    rows, sources = data['styles'], data['sources']
    assert len(rows) == len(EXPECTED) and {r['id'] for r in rows} == EXPECTED
    assert data['columns'] == COLUMNS
    assert len(data['area_commit']) == 40
    for source in sources.values():
        assert source['url'].startswith('https://')
        assert source['checked'] == data['checked']
    for row in rows:
        assert list(row['ingredients']) == COLUMNS
        assert all(isinstance(v, str) and v for v in row['ingredients'].values())
        assert row['sources'] and set(row['sources']) <= sources.keys()
        assert row['definition'] and row['canonical_example'] and row['kind']

    def refs(row):
        return ', '.join(f"[{sources[s]['title']}]({sources[s]['url']})" for s in row['sources'])

    catalogue = ['# Sourced catalogue', '',
        'Read with the [shared layer model](layer-model.md) and [ingredient matrix](ingredient-matrix.md).', '',
        f"All public sources checked **{data['checked']}**. Definitions paraphrase their sources; matrix decompositions and classifications are Astra’s synthesis. Examples are source illustrations, documented effects or historical products, not new captures or measured presets.", '',
        'The requested “gradient fill” is one paint family with four separately indexed constructions below: linear, radial, conic and mesh. Mesh is not an assertion of a native CSS gradient function. A gradient stroke is the same kind of paint assigned to an edge mask.', '']
    for row in rows:
        catalogue += [f"<a id=\"{row['id']}\"></a>", f"## {row['name']}", '',
            f"**Kind:** {row['kind']}.", '', row['definition'], '',
            f"**Canonical reference:** {row['canonical_example']}", '',
            f"**Evidence:** {refs(row)} (checked {data['checked']}).", '']

    matrix = ['# Ingredient matrix', '',
        'All 25 entries use the same 12 fields. The matrix is split into three views of the same rows for readability; it is one dataset, not three separate taxonomies.', '',
        data['matrix_basis'], '',
        'Blur identifies **what is softened**: backdrop, shadow, bloom or texture. Smooth gradient interpolation is not a blur operation. Translucency applies to the body unless the cell specifies an effect. Stroke model describes decorative edges; required interaction edges are independent.', '',
        'Each row links to its definition and evidence. Public sources checked **2026-10-07**. No cell is a measured size, opacity, shader constant or rendering guarantee.', '']
    for title, cols in [('Body and boundary', COLUMNS[:4]), ('Light and shading', COLUMNS[4:8]), ('Texture, content and spatial model', COLUMNS[8:])]:
        matrix += [f'## {title}', '', '| Style | ' + ' | '.join(c.replace('_', ' ').title() for c in cols) + ' |', '| --- | ' + ' | '.join('---' for c in cols) + ' |']
        for row in rows:
            values = [row['ingredients'][c].replace('|', '\\|') for c in cols]
            matrix.append(f"| [{row['name']}](catalogue.md#{row['id']}) | " + ' | '.join(values) + ' |')
        matrix.append('')

    register = ['# Source register', '',
        'All public URLs checked **2026-10-07**. These are descriptive sources, not locally measured captures. Historical labels retain their original context; living vendor docs are identified by access date.', '']
    for key, source in sources.items():
        register += [f'## {key}', '', f"[{source['title']}]({source['url']})", '', source['scope'], '']
    return {'catalogue.md': '\n'.join(catalogue), 'ingredient-matrix.md': '\n'.join(matrix), 'sources.md': '\n'.join(register)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Check generated files without writing them')
    args = parser.parse_args()
    outputs = render()
    for name, body in outputs.items():
        assert len(body.encode()) < 1_000_000
        path = HERE / name
        if args.check:
            assert path.read_text() == body, f'{name} is stale; run {__file__}'
        else:
            path.write_text(body)
    print('Validated 25 requested entries × 12 ingredients; 22 sources; generated Markdown ' + ('matches.' if args.check else 'written.'))


if __name__ == '__main__':
    main()
