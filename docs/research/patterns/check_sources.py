"""Recheck public URLs with the standard library; retain metadata, never page bodies."""
import concurrent.futures, datetime, hashlib, json, re, urllib.request
from pathlib import Path
from html.parser import HTMLParser
from sources import SOURCES
class Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip=0; self.parts=[]
    def handle_starttag(self, tag, attrs):
        if tag in ('script','style','svg'): self.skip+=1
    def handle_endtag(self,tag):
        if tag in ('script','style','svg'): self.skip=max(0,self.skip-1)
    def handle_data(self,data):
        if not self.skip and data.strip(): self.parts.append(data.strip())
def check(item):
    key,s=item; url=s.get('readable_url',s['url'])
    result=dict(id=key,requested_url=url,checked_on=datetime.datetime.now(datetime.timezone.utc).date().isoformat())
    try:
        with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Area-patterns-research/1.0'}),timeout=18) as r:
            raw=r.read(); result.update(http_status=r.status,final_url=r.url,bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())
        parser=Text(); parser.feed(raw.decode('utf-8',errors='replace')); txt=' '.join(parser.parts)
        result['result']='retrieved; HTTP status alone does not verify the authored finding'
        # An excerpt is only displayed locally for review, never written to the ledger.
        if key in {'primer-navigation','primer-degraded','primer-loading','carbon-table','polaris-resources','untitled-command','untitled-editor','untitled-upload','untitled-hero','untitled-faq'}:
            pos=max(txt.find(s['title'],max(0,len(txt)//5)),0)
            print(key+': '+txt[pos:pos+1700],flush=True)
    except Exception as e:result.update(result='not found by this retrieval',error=str(e))
    return key,result
if __name__=='__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: results=dict(pool.map(check,SOURCES.items()))
    Path(__file__).with_name('source-checks.json').write_text(json.dumps(results,indent=2)+'\n')
    print(json.dumps({k:v.get('http_status',v.get('error')) for k,v in results.items()},indent=2))
