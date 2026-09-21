(function(){
  // ---------- helpers to build a flower's petals ----------
  function petalPath(){
    // a soft teardrop petal pointing up from center (50,50) toward (50,8)
    return "M50,50 C38,40 38,16 50,8 C62,16 62,40 50,50 Z";
  }

  function buildPetals(count, colorA, colorB){
    var group = document.createElementNS("http://www.w3.org/2000/svg","g");
    for(var i=0;i<count;i++){
      var angle = (360/count)*i;
      var p = document.createElementNS("http://www.w3.org/2000/svg","path");
      p.setAttribute("d", petalPath());
      p.setAttribute("fill", i % 2 === 0 ? colorA : colorB);
      p.setAttribute("class","petal");
      p.style.setProperty("--r", angle + "deg");
      p.style.setProperty("--i", i);
      p.setAttribute("transform","rotate(" + angle + " 50 50)");
      group.appendChild(p);
    }
    return group;
  }

  // ---------- hero flower (animated bloom) ----------
  var heroSvg = document.getElementById("hero-flower-svg");
  var heroPetals = buildPetals(12, "#F5B700", "#FFD75E");
  heroSvg.appendChild(heroPetals);
  var heroCenter = document.createElementNS("http://www.w3.org/2000/svg","circle");
  heroCenter.setAttribute("cx","50");
  heroCenter.setAttribute("cy","50");
  heroCenter.setAttribute("r","14");
  heroCenter.setAttribute("fill","#B5651D");
  heroCenter.setAttribute("class","center-dot");
  heroSvg.appendChild(heroCenter);

  // ---------- corner flowers (static, small) ----------
  document.querySelectorAll(".corner-flower").forEach(function(svg){
    // replace <use> with real generated petals so colors/vars resolve reliably
    svg.innerHTML = "";
    var petals = buildPetals(10, "#F5B700", "#E29400");
    petals.querySelectorAll(".petal").forEach(function(p){
      p.style.animation = "none";
      p.style.transform = p.getAttribute("transform").replace("rotate(","rotate(").concat("");
      p.style.opacity = 1;
      // force final scale without relying on bloom animation
      p.style.transformBox = "fill-box";
    });
    svg.appendChild(petals);
    var c = document.createElementNS("http://www.w3.org/2000/svg","circle");
    c.setAttribute("cx","50"); c.setAttribute("cy","50"); c.setAttribute("r","12");
    c.setAttribute("fill","#B5651D");
    svg.appendChild(c);
  });
  // fix hero petal transform (bloom keyframe expects rotate(var(--r)) scale(x))
  document.querySelectorAll(".hero-flower .petal").forEach(function(p){
    p.removeAttribute("transform");
  });

  // ---------- meadow of small swaying flowers ----------
  var meadow = document.getElementById("meadow");
  var meadowColors = [
    ["#F5B700","#FFD75E"],
    ["#E29400","#F5B700"],
    ["#FFD75E","#F5B700"]
  ];
  var count = window.innerWidth < 600 ? 9 : 15;
  for(var i=0;i<count;i++){
    var wrap = document.createElement("div");
    wrap.className = "stem-flower";
    var size = 34 + Math.round(Math.random()*22);
    var stemHeight = 40 + Math.round(Math.random()*50);
    var dur = (2.6 + Math.random()*1.8).toFixed(2);
    var delay = (Math.random()*2).toFixed(2);
    wrap.style.animationDuration = dur + "s";
    wrap.style.animationDelay = delay + "s";

    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("viewBox","0 0 100 100");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    var pair = meadowColors[i % meadowColors.length];
    var petals = buildPetals(9, pair[0], pair[1]);
    petals.querySelectorAll(".petal").forEach(function(p){ p.style.animation = "none"; });
    svg.appendChild(petals);
    var c = document.createElementNS("http://www.w3.org/2000/svg","circle");
    c.setAttribute("cx","50"); c.setAttribute("cy","50"); c.setAttribute("r","13");
    c.setAttribute("fill","#B5651D");
    svg.appendChild(c);

    var stem = document.createElement("div");
    stem.className = "stem-line";
    stem.style.height = stemHeight + "px";

    wrap.appendChild(svg);
    wrap.appendChild(stem);
    meadow.appendChild(wrap);

    // gentle bloom-in when scrolled into view
    wrap.style.opacity = 0;
    wrap.style.transform += " scale(.6)";
    wrap.style.transition = "opacity .6s ease, transform .6s ease";
  }

  var meadowObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        Array.from(meadow.children).forEach(function(el, idx){
          setTimeout(function(){
            el.style.opacity = 1;
            el.style.transform = el.style.transform.replace(" scale(.6)","");
          }, idx * 60);
        });
        meadowObserver.disconnect();
      }
    });
  }, {threshold:.3});
  meadowObserver.observe(meadow);

  // ---------- ambient falling petals (subtle) ----------
  var field = document.getElementById("petal-field");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!prefersReduced){
    for(var j=0;j<10;j++){
      spawnPetal(true);
    }
  }
  function spawnPetal(initial){
    var petal = document.createElement("div");
    petal.className = "falling-petal";
    var left = Math.random()*100;
    var fallDur = 9 + Math.random()*7;
    var swayDur = 2.5 + Math.random()*2;
    var delay = initial ? Math.random()*fallDur : 0;
    var hueColors = ["#F5B700","#FFD75E","#E29400"];
    petal.style.left = left + "vw";
    petal.style.background = hueColors[Math.floor(Math.random()*hueColors.length)];
    petal.style.animationDuration = fallDur + "s, " + swayDur + "s";
    petal.style.animationDelay = "-" + delay + "s, 0s";
    petal.style.transform = "rotate(" + Math.round(Math.random()*360) + "deg)";
    field.appendChild(petal);
  }

  // ---------- burst on button click ----------
  document.getElementById("sendBtn").addEventListener("click", function(){
    if(prefersReduced) return;
    for(var k=0;k<26;k++){
      setTimeout(function(){ spawnPetal(false); }, k*40);
    }
  });
})();
