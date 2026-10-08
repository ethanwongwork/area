// Fillet the convex point of fill where two overlap-cut arcs (or a line and an arc) meet.
const f = n => +n.toFixed(3);
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]], add=(a,b)=>[a[0]+b[0],a[1]+b[1]], mul=(a,k)=>[a[0]*k,a[1]*k], len=a=>Math.hypot(a[0],a[1]), nrm=a=>mul(a,1/len(a));
// circle-circle: fillet centre at distance r1+p from C1 and r2+p from C2, nearest to junction P
function cc(C1,r1,C2,r2,p,P){
  const R1=r1+p,R2=r2+p,d=len(sub(C2,C1)),a=(R1*R1-R2*R2+d*d)/(2*d),h=Math.sqrt(R1*R1-a*a),u=nrm(sub(C2,C1)),m=add(C1,mul(u,a)),v=[-u[1],u[0]];
  const cands=[add(m,mul(v,h)),add(m,mul(v,-h))]; const F=cands.sort((x,y)=>len(sub(x,P))-len(sub(y,P)))[0];
  return {F:F.map(f),T1:add(C1,mul(nrm(sub(F,C1)),r1)).map(f),T2:add(C2,mul(nrm(sub(F,C2)),r2)).map(f)};
}
// line-circle: line through A with unit dir d, fill side normal n (unit), circle C r
function lc(A,d,n,C,r,p,P){
  // F = A + t d + p n ; |F-C| = r+p
  const B=add(A,mul(n,p)), w=sub(B,C), b=w[0]*d[0]+w[1]*d[1], c=w[0]*w[0]+w[1]*w[1]-(r+p)**2, disc=Math.sqrt(b*b-c);
  const Fs=[-b+disc,-b-disc].map(t=>add(B,mul(d,t))); const F=Fs.sort((x,y)=>len(sub(x,P))-len(sub(y,P)))[0];
  return {F:F.map(f),TL:sub(F,mul(n,p)).map(f),TC:add(C,mul(nrm(sub(F,C)),r)).map(f)};
}
const p=Number(process.argv[2]||0.75);
console.log("file-lock", JSON.stringify(cc([6.5,11],2.75,[5,9.5],3.25,p,[8.178,8.822])));
console.log("folder-lock", JSON.stringify(cc([10,10],2.75,[11.5,8.5],3.25,p,[8.322,7.822])));
console.log("cart-add", JSON.stringify(cc([10,4],2.25,[12,6],2.25,p,[9.76,6.237])));
const d=nrm([-1,-1]); console.log("file-search", JSON.stringify(lc([9.091,11.909],d,nrm([1,-1]),[4.5,10.5],4.25,p,[8.641,11.459])));
