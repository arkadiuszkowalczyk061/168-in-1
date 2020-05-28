function gameplayViewer(){
    let width = this.dataset.width;
    let height = this.dataset.height;
    let gif = this.dataset.gif;
    this.className = 'gameplayViewer';
    this.children[0].src= gif;
    this.style.marginTop = height;
    this.style.marginLeft = width;
}


function returnImage(){
    let width = this.dataset.width2;
    let height = this.dataset.height2;
    let image = this.dataset.image;
    this.className = 'returnImage';
    this.children[0].src = image;
    this.style.marginTop = height;
    this.style.marginLeft = width;
}

function cartrdigeHighlight(){
    this.className = 'highlightCartridge';
}

function cartridgeNormal(){
    this.className = 'cartridgeNormal';
}

containerId = document.querySelectorAll(".container>a");

for (element of containerId){
    element.addEventListener('mouseover', gameplayViewer);
    element.addEventListener('mouseout', returnImage);
}

cartridge = document.querySelector("#cartridgeTransparent>img");

cartridge.addEventListener('mouseover', cartrdigeHighlight);
cartridge.addEventListener('mouseout', cartridgeNormal);

