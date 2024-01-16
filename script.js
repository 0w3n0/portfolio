// Initialisation de la scène
var scene = new THREE.Scene();

// Création de la caméra
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

var platformGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
var platformMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });
var platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.rotation.x = -Math.PI / 2; // Plateforme orientée vers le haut
scene.add(platform);

var mouseX = 0;
var windowHalfX = window.innerWidth / 2;

document.addEventListener('mousemove', function (event) {
    mouseX = (event.clientX - windowHalfX) / 2;
});

// Création du rendu
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);

    // Ajustement de l'inclinaison en fonction de la position du curseur
    platform.rotation.z = (mouseX / windowHalfX) * Math.PI / 4;

    // Rendu de la scène
    renderer.render(scene, camera);
}

// Appel de la fonction d'animation
animate();

// Gestion des redimensionnements de fenêtre
window.addEventListener('resize', function () {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};