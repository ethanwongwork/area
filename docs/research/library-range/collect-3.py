#!/usr/bin/env python3
"""Fetch public docs for run 3. Raw reading cache is local-only, never a deliverable."""
import concurrent.futures, json, re, urllib.request
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
P=Path(__file__).resolve().parent
class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.out=[]; self.links=[]; self.headings=[]; self.skip=0; self.h=None
    def handle_starttag(self,t,a):
        d=dict(a)
        if t in ('script','style'): self.skip+=1
        if t=='a' and d.get('href'): self.links.append(d['href'])
        if t in ('h1','h2','h3','h4','p','li','tr','pre'): self.out.append('\n')
        if re.fullmatch('h[1-4]',t): self.h=[]
        if t in ('td','th'): self.out.append(' | ')
    def handle_endtag(self,t):
        if t in ('script','style'): self.skip=max(0,self.skip-1)
        if re.fullmatch('h[1-4]',t) and self.h is not None:
            self.headings.append(''.join(self.h)); self.h=None
    def handle_data(self,d):
        if not self.skip:
            self.out.append(d)
            if self.h is not None: self.h.append(d)
def fetch(item):
    key,url=item
    try:
        r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Area-public-catalogue-research/1.0'}),timeout=45)
        raw=r.read().decode(); h=Parser(); h.feed(raw)
        if '.json' in url:
            data=json.loads(raw)
            def walk(v):
                if isinstance(v,dict):
                    if 'text' in v and isinstance(v['text'],str): h.out.append('\n'+v['text'])
                    for k,x in v.items():
                        if k!='text': walk(x)
                elif isinstance(v,list):
                    for x in v: walk(x)
            h.out=[];walk(data)
        return key,dict(url=url,final_url=r.url,status=r.status,checked='2026-09-28',text=re.sub('[ \t]+',' ',''.join(h.out)),headings=h.headings,links=sorted(set(urljoin(r.url,x).split('#')[0] for x in h.links if not x.startswith(('mailto:','javascript:')))))
    except Exception as e:
        return key,dict(url=url,status='error',error=str(e),checked='2026-09-28',links=[],headings=[],text='')
def run(urls):
    dest=P/'.pages-cache-3.json';data=json.loads(dest.read_text()) if dest.exists() else {}
    missing={k:v for k,v in urls.items() if k not in data or data[k]['status']=='error'}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        for key,value in ex.map(fetch,missing.items()): data[key]=value
    dest.write_text(json.dumps(data));print('Read',len(missing),'pages; cache',len(data),'errors',sum(v['status']=='error' for v in data.values()))
    return data
if __name__=='__main__':
    catalogs=json.loads((P/'.research-cache-3.json').read_text());urls={}
    patterns={
      'Untitled UI':r'/react/(components|marketing)/[^/]+$',
      'Fluent 2':r'/components/web/react/core/[^/]+/usage$',
      'Primer':r'/product/(components|internal-components)/[^/]+/$',
      'Carbon':r'/components/[^/]+/usage/$',
      'Chakra/Ark':r'/docs/components/[^/]+$',
      'Atlassian':r'/components/(?:[^/]+|primitives/[^/]+)$',
      'GOV.UK':r'/components/[^/]+/$',
    }
    for system,pattern in patterns.items():
        for url in catalogs[system]['links']:
            if re.search(pattern,urlparse(url).path): urls[system+'|'+urlparse(url).path]=url
    urls.update({
      'Radix Themes|catalog':'https://www.radix-ui.com/themes/docs/overview/getting-started',
      'Mantine|catalog':'https://mantine.dev/core/package/',
      'React Aria|catalog':'https://react-aria.adobe.com/',
      'Polaris|catalog':'https://shopify.dev/docs/api/app-home/polaris-web-components',
      'Apple HIG|catalog':'https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json',
    })
    for name in ['sheets','date-pickers','pickers','search-fields','sidebars','lists-and-tables','text-fields','disclosure-controls','progress-indicators','ratings-and-reviews','page-controls','steppers','drag-and-drop','alerts','scroll-views','split-views','toolbars','popovers','context-menus','menus','text-editing','undo-and-redo','charts','live-activities','keyboards','color-wells','file-management','loading','accessibility','token-fields']:
        urls['Apple HIG|'+name]='https://developer.apple.com/tutorials/data/design/human-interface-guidelines/'+name+'.json'
    run(urls)
