(function(){
  const svg = document.getElementById('journeySvg');
  const scene = document.getElementById('journeyScene');
  const marker = document.getElementById('trailMarker');
  const VBW = 1000;
  const WAVES = 3;

  function xUnits(t){
    return 500 + 260 * Math.sin(t * Math.PI * 2 * WAVES);
  }

  let H = 0;

  function buildScene(){
    H = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    scene.style.height = H + 'px';
    svg.setAttribute('viewBox', `0 0 ${VBW} ${H}`);
    svg.innerHTML = '';

    const NS = 'http://www.w3.org/2000/svg';
    function el(tag, attrs){
      const e = document.createElementNS(NS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }

    const defs = el('defs', {});
    const grad = el('linearGradient', { id:'sky', x1:'0', y1:'0', x2:'0', y2:'1' });
    const stops = [['0%', '#FBF7F0'], ['28%', '#F6E3BE'], ['52%', '#E3A374'], ['76%', '#6E4F63'], ['100%', '#1C1A17']];
    stops.forEach(([off,col]) => grad.appendChild(el('stop', { offset:off, 'stop-color':col })));
    defs.appendChild(grad);
    svg.appendChild(defs);
    svg.appendChild(el('rect', { x:0, y:0, width:VBW, height:H, fill:'url(#sky)' }));

    function addIcon(type, cx, cy, tone){
      const stroke = `rgba(28,26,23,${(0.16 + tone*0.10).toFixed(3)})`;
      const accent = `rgba(182,92,54,${(0.22 + tone*0.10).toFixed(3)})`;
      const g = el('g', { transform:`translate(${cx},${cy})`, fill:'none', stroke:stroke, 'stroke-width':3, 'stroke-linecap':'round', 'stroke-linejoin':'round' });

      if (type === 'lens'){
        g.appendChild(el('circle', { cx:-10, cy:-10, r:70 }));
        g.appendChild(el('circle', { cx:-10, cy:-10, r:26, stroke:accent }));
        g.appendChild(el('line', { x1:40, y1:40, x2:95, y2:95 }));
        [0,60,120,180,240,300].forEach(a=>{
          const r1=34, r2=44, rad=a*Math.PI/180;
          g.appendChild(el('line', { x1:-10+r1*Math.cos(rad), y1:-10+r1*Math.sin(rad), x2:-10+r2*Math.cos(rad), y2:-10+r2*Math.sin(rad) }));
        });
      } else if (type === 'cap'){
        g.appendChild(el('path', { d:'M -90 -10 L 0 -50 L 90 -10 L 0 30 Z' }));
        g.appendChild(el('path', { d:'M -45 8 L -45 45 Q 0 68 45 45 L 45 8', stroke:stroke }));
        g.appendChild(el('line', { x1:78, y1:-3, x2:78, y2:40, stroke:accent }));
        g.appendChild(el('circle', { cx:78, cy:46, r:5, fill:accent, stroke:'none' }));
      } else if (type === 'grid'){
        const s=54, gap=10;
        [[-s-gap/2,-s-gap/2],[gap/2,-s-gap/2],[-s-gap/2,gap/2],[gap/2,gap/2]].forEach((p,i)=>{
          g.appendChild(el('rect', { x:p[0], y:p[1], width:s, height:s, rx:8, stroke: i===3?accent:stroke, fill: i===3? accent.replace(/[\d.]+\)$/,'0.12)') : 'none' }));
        });
      } else if (type === 'nodes'){
        g.appendChild(el('circle', { cx:-55, cy:0, r:20 }));
        g.appendChild(el('circle', { cx:55, cy:0, r:20 }));
        g.appendChild(el('circle', { cx:0, cy:-60, r:20, stroke:accent }));
        g.appendChild(el('line', { x1:-38, y1:0, x2:38, y2:0, 'stroke-dasharray':'2 8' }));
        g.appendChild(el('line', { x1:-45, y1:-15, x2:-13, y2:-48, 'stroke-dasharray':'2 8' }));
        g.appendChild(el('line', { x1:45, y1:-15, x2:13, y2:-48, 'stroke-dasharray':'2 8' }));
      } else if (type === 'rebuild'){
        g.appendChild(el('rect', { x:-90, y:-70, width:110, height:75, rx:10 }));
        g.appendChild(el('rect', { x:-20, y:0, width:110, height:75, rx:10, stroke:accent }));
        g.appendChild(el('path', { d:'M 10 -20 Q 40 -20 40 10', 'marker-end':'none' }));
        g.appendChild(el('path', { d:'M 34 2 L 40 12 L 48 4', fill:'none' }));
      } else if (type === 'trophy'){
        g.appendChild(el('path', { d:'M -45 -70 L 45 -70 L 30 20 Q 0 35 -30 20 Z', stroke:accent }));
        g.appendChild(el('line', { x1:-50, y1:-70, x2:-50, y2:-20, stroke:stroke }));
        g.appendChild(el('path', { d:'M -50 -20 Q -80 -10 -75 10', stroke:stroke }));
        g.appendChild(el('line', { x1:50, y1:-70, x2:50, y2:-20, stroke:stroke }));
        g.appendChild(el('path', { d:'M 50 -20 Q 80 -10 75 10', stroke:stroke }));
        g.appendChild(el('line', { x1:-30, y1:20, x2:-30, y2:55, stroke:stroke }));
        g.appendChild(el('line', { x1:30, y1:20, x2:30, y2:55, stroke:stroke }));
        g.appendChild(el('line', { x1:-45, y1:55, x2:45, y2:55, stroke:accent }));
      } else if (type === 'envelope'){
        g.appendChild(el('rect', { x:-90, y:-55, width:180, height:110, rx:10 }));
        g.appendChild(el('path', { d:'M -90 -55 L 0 15 L 90 -55', stroke:accent }));
        g.appendChild(el('line', { x1:95, y1:60, x2:130, y2:70, 'stroke-dasharray':'2 8' }));
        g.appendChild(el('line', { x1:100, y1:78, x2:128, y2:82, 'stroke-dasharray':'2 8' }));
      }
      svg.appendChild(g);
    }

    const iconMap = [
      ['hero','lens'], ['ch1','cap'], ['work','grid'],
      ['experience','nodes'], ['ch4','rebuild'], ['ch5','trophy'], ['closing','envelope']
    ];
    iconMap.forEach(([id,type]) => {
      const secEl = document.getElementById(id);
      if (!secEl) return;
      const rect = secEl.getBoundingClientRect();
      const cy = rect.top + window.scrollY + rect.height/2;
      const t = Math.min(1, Math.max(0, cy / H));
      const isReverse = secEl.classList.contains('reverse');
      const cx = isReverse ? VBW*0.20 : VBW*0.80;
      addIcon(type, cx, cy, t);
    });

    const steps = 240;
    let d = '';
    for (let i = 0; i <= steps; i++){
      const t = i / steps;
      const x = xUnits(t);
      const y = t * H;
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    svg.appendChild(el('path', { d:d, fill:'none', stroke:'rgba(255,255,255,0.55)', 'stroke-width':4, 'stroke-linecap':'round', 'stroke-dasharray':'2 14' }));
    svg.appendChild(el('path', { d:d, fill:'none', stroke:'rgba(28,26,23,0.18)', 'stroke-width':1.5 }));
  }

  function updateMarker(){
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const t = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const containerW = scene.clientWidth || window.innerWidth;
    const xPx = (xUnits(t) / VBW) * containerW;
    const yPx = t * H;
    marker.style.left = xPx + 'px';
    marker.style.top = yPx + 'px';
    marker.classList.toggle('night', t > 0.72);
  }

  let resizeTimer;
  function onResize(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildScene(); updateMarker(); }, 150);
  }

  window.addEventListener('scroll', updateMarker, { passive:true });
  window.addEventListener('resize', onResize);
  window.addEventListener('load', () => { buildScene(); updateMarker(); });
  if (document.fonts && document.fonts.ready){
    document.fonts.ready.then(() => { buildScene(); updateMarker(); });
  }
  buildScene();
  updateMarker();
})();

const chapters = document.querySelectorAll('.chapter');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.3 });
chapters.forEach(c => io.observe(c));
