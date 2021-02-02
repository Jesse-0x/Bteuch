//this is some stuff I put here intersiting.

var racolor
racolor = Math.floor(Math.random()*(2<<23)).toString(16);
var radcolor= "#" + racolor
document.getElementById("colorStyle").value = radcolor;
// set up the base pattern
window.onclick = function() {
while(document.getElementById('htmleaf-content').firstChild){
document.getElementById('htmleaf-content').removeChild(document.getElementById('htmleaf-content').firstChild);
}
var pattern = Trianglify({
height: window.innerHeight,
width: window.innerWidth,
x_colors: ['rgba(150, 150, 150, 0.1)', 'rgba(100, 100, 100, 1)'],
stroke_width: 0.1,
cell_size: Math.ceil(window.innerWidth / (Math.floor(Math.random() * (15 - 5)) + 5))})
var svg = pattern.svg()
svg.id = 'trianglify-overlay'
document.getElementById('htmleaf-content').appendChild(svg)
}