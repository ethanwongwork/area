"""Check a declared paint scene, never CSS guessed from a screenshot.

python3 check_scene.py scene.json
Exit 0 = model PASS, 1 = FAIL, 2 = UNRESOLVED/invalid input. --example prints
the task-08 counterexample to stdout. JSON RGB coordinates use encoded [0,1].
"""
import json, sys
from paint import Paint, Stop, Unresolved, rgb, worst

EXAMPLE=dict(ink='#767676',threshold=4.5,body='#ffffff',alpha=.01,
             backdrop={'low':[0,0,0],'high':[1,1,1]},stops=[],space='srgb',blend='source-over')

def check(scene):
    expected={'ink','threshold','body','alpha','backdrop','stops','space','blend'}
    if set(scene)-expected: raise Unresolved('Unsupported fields: '+', '.join(sorted(set(scene)-expected)))
    backdrop=scene.get('backdrop',{'low':[0,0,0],'high':[1,1,1]})
    if set(backdrop)!={'low','high'}: raise Unresolved('Backdrop requires low/high RGB triples')
    stops=[]
    for s in scene.get('stops',[]):
        if set(s)!={'position','color','alpha'}: raise Unresolved('Each stop requires position/color/alpha')
        stops.append(Stop(s['position'],rgb(s['color']),s['alpha']))
    p=Paint(rgb(scene['body']),scene['alpha'],tuple(stops),tuple(backdrop['low']),tuple(backdrop['high']),
            scene.get('space','srgb'),scene.get('blend','source-over'))
    return worst(rgb(scene['ink']),p,scene['threshold'])

if __name__=='__main__':
    if sys.argv[1:]==['--example']:
        print(json.dumps(EXAMPLE,indent=2)); sys.exit(0)
    try:
        if len(sys.argv)!=2: raise Unresolved('Usage: check_scene.py scene.json')
        with open(sys.argv[1]) as file: result=check(json.load(file))
    except (Unresolved,ValueError,KeyError,TypeError,OSError) as error:
        result=dict(status='UNRESOLVED',reason=str(error))
    print(json.dumps(result,indent=2))
    sys.exit({'PASS':0,'FAIL':1,'UNRESOLVED':2}[result['status']])
