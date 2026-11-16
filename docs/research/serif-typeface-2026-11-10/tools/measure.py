import json,sys
from lib import *
fonts=[('G Light',georgia('Light')),('G Regular',georgia('Regular')),('G SemiBold',georgia('SemiBold')),('G Bold',georgia('Bold')),('G Black',georgia('Black'))]+[('S %d'%w,serrif(w)) for w in (100,300,400,500,600,700,900)]
rows={}
for label,f in fonts:
    k=1000/f['head'].unitsPerEm; r={}
    x=g(f,'x'); o=g(f,'o'); H=g(f,'H'); O=g(f,'O'); n=g(f,'n'); l=g(f,'l'); I=g(f,'I'); e=g(f,'e'); c=g(f,'c'); a=g(f,'a'); p=g(f,'p'); d=g(f,'d'); z0=g(f,'0')
    xh=x.y1; cap=H.y1
    r['xh']=xh*k; r['cap']=cap*k; r['asc_l']=l.y1*k; r['asc_d']=d.y1*k; r['asc_f']=g(f,'f').y1*k; r['desc_p']=p.y0*k; r['desc_g']=g(f,'g').y0*k; r['desc_y']=g(f,'y').y0*k
    r['fig']=z0.y1*k; r['o_over_top']=(o.y1-xh)*k; r['o_over_bot']=-o.y0*k; r['O_over_top']=(O.y1-cap)*k; r['O_over_bot']=-O.y0*k
    r['xh/cap']=xh/cap; r['asc/xh']=l.y1/xh; r['cap/asc']=cap/l.y1
    ns=n.h(xh*0.35); r['n_stem']=(ns[0][1]-ns[0][0])*k; r['n_stem2']=(ns[-1][1]-ns[-1][0])*k; r['n_counter']=(ns[-1][0]-ns[0][1])*k
    r['n_lsb']=ns[0][0]*k; r['n_rsb']=(n.adv-ns[-1][1])*k; r['n_adv']=n.adv*k
    Hs=H.h(cap*0.3); r['H_stem']=(Hs[0][1]-Hs[0][0])*k; r['H_counter']=(Hs[-1][0]-Hs[0][1])*k; r['H_adv']=H.adv*k; r['H_lsb']=Hs[0][0]*k
    Hb=H.v((Hs[0][1]+Hs[-1][0])/2); r['H_bar']=(Hb[0][1]-Hb[0][0])*k; r['H_bar_center/cap']=((Hb[0][1]+Hb[0][0])/2)/cap
    os_=o.h(xh/2); r['o_thick']=(os_[0][1]-os_[0][0])*k; r['o_counter']=(os_[-1][0]-os_[0][1])*k; r['o_adv']=o.adv*k; r['o_lsb']=o.x0*k; r['o_rsb']=(o.adv-o.x1)*k
    ov=o.v((o.x0+o.x1)/2); r['o_thin']=(ov[0][1]-ov[0][0])*k; r['o_thin_top']=(ov[-1][1]-ov[-1][0])*k
    Os=O.h(cap/2); r['O_thick']=(Os[0][1]-Os[0][0])*k; Ov=O.v((O.x0+O.x1)/2); r['O_thin']=(Ov[0][1]-Ov[0][0])*k; r['O_adv']=O.adv*k; r['O_lsb']=O.x0*k
    r['contrast_o']=r['o_thick']/r['o_thin']; r['contrast_O']=r['O_thick']/r['O_thin']; r['cap/lc stem']=r['H_stem']/r['n_stem']
    ev=e.v((e.x0+e.x1)/2); r['e_bar']=(ev[1][1]-ev[1][0])*k if len(ev)>=3 else None; r['e_bar_y/xh']=((ev[1][1]+ev[1][0])/2)/xh if len(ev)>=3 else None
    # serif on I
    Is=I.h(cap/2); s0,s1=Is[0]; ft=I.h(3); x0,x1=ft[0][0],ft[-1][1]; pr=s0-x0
    r['I_stem']=(s1-s0)*k; r['I_serif_proj']=pr*k; r['I_serif_total']=(x1-x0)*k
    def th(xx):
        sp=I.v(xx); return (sp[0][1]-sp[0][0])*k if sp else None
    r['I_serif_tip']=th(x0+pr*0.12); r['I_serif_mid']=th(x0+pr*0.5); r['I_serif_near']=th(x0+pr*0.88)
    ls=l.h(xh*0.6); s0,s1=ls[0]; ft=l.h(3); x0,x1=ft[0][0],ft[-1][1]; pr=s0-x0
    r['l_stem']=(s1-s0)*k; r['l_serif_proj']=pr*k; 
    def th(xx):
        sp=l.v(xx); return (sp[0][1]-sp[0][0])*k if sp else None
    r['l_serif_tip']=th(x0+pr*0.12); r['l_serif_mid']=th(x0+pr*0.5); r['l_serif_near']=th(x0+pr*0.88); r['l_adv']=l.adv*k
    # apertures
    def ap(gl,side):
        w=gl.x1-gl.x0; xx=gl.x1-w*0.10 if side=='r' else gl.x0+w*0.10
        sp=gl.v(xx)
        return [(round(a_*k),round(b_*k)) for a_,b_ in sp]
    r['c_ap_spans']=ap(c,'r'); r['e_ap_spans']=ap(e,'r'); r['a_ap_spans']=ap(a,'l')
    r['space']=f['hmtx'][name(f,' ')][0]*k; r['zero_adv']=z0.adv*k; r['period_adv']=g(f,'.').adv*k
    lc='abcdefghijklmnopqrstuvwxyz'; uc=lc.upper()
    r['avg_lc_adv']=sum(f['hmtx'][name(f,ch)][0] for ch in lc)*k/26; r['avg_uc_adv']=sum(f['hmtx'][name(f,ch)][0] for ch in uc)*k/26
    rows[label]=r
keys=list(rows['G Regular'].keys())
print('%-18s'%''+''.join('%11s'%l for l in rows))
for kk in keys:
    if kk.endswith('spans'): continue
    print('%-18s'%kk+''.join(('%11.2f'%rows[l][kk] if abs(rows[l][kk] or 0)<10 else '%11.0f'%rows[l][kk]) if rows[l][kk] is not None else '%11s'%'-' for l in rows))
for kk in keys:
    if kk.endswith('spans'):
        for l in rows: print(kk,l,rows[l][kk])
json.dump(rows,open('metrics.json','w'),indent=1)
