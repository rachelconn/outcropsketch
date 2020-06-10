let bean = document.getElementById('bean');
let ovalElongated = document.getElementById('ovalElongated');
let ovalRhomboda = document.getElementById('ovalRhomboda');
let subTriangular = document.getElementById('subTriangular');
let subRectangular = document.getElementById('subRectangular');

let beanLarge = document.getElementById('beanLarge');
let ovalMedium = document.getElementById('ovalMedium');
let ovalLarge = document.getElementById('ovalLarge');
let rhombodaMedium = document.getElementById('rhombodaMedium');
let triangularSmall = document.getElementById('triangularSmall');
let triangularMedium = document.getElementById('triangularMedium');
let rectangularMedium = document.getElementById('rectangularMedium');
let rectangularLarge = document.getElementById('rectangularLarge');

let beanSmooth = document.getElementById('beanSmooth');
let ovalMediumOrnamented = document.getElementById('ovalMediumOrnamented');
let ovalLargeOrnamented = document.getElementById('ovalLargeOrnamented');
let rhombodaOrnamented = document.getElementById('rhombodaOrnamented');
let rectangularMediumOrnamented = document.getElementById('rectangularMediumOrnamented');
let rectangularMediumOrnamented2 = document.getElementById('rectangularMediumOrnamented2');
let rectangularLargeOrnamented = document.getElementById('rectangularLargeOrnamented');
let rectangularLargeSmooth = document.getElementById('rectangularLargeSmooth');

let leaderLineOptions = {
  color: '#00aaaa',
  size: 3,
  path: 'fluid',
  startSocket: 'right', 
  endSocket: 'left'
}

//generateTreeEdges();

function generateTreeEdges() {
    new LeaderLine(bean, beanLarge, leaderLineOptions);
    new LeaderLine(ovalElongated, ovalMedium, leaderLineOptions);
    new LeaderLine(ovalElongated, ovalLarge, leaderLineOptions);
    new LeaderLine(ovalRhomboda, rhombodaMedium, leaderLineOptions);
    new LeaderLine(subTriangular, triangularSmall, leaderLineOptions);
    new LeaderLine(subTriangular, triangularMedium, leaderLineOptions);
    new LeaderLine(subRectangular, rectangularMedium, leaderLineOptions);
    new LeaderLine(subRectangular, rectangularLarge, leaderLineOptions);

    new LeaderLine(beanLarge, beanSmooth, leaderLineOptions);
    new LeaderLine(ovalMedium, ovalMediumOrnamented, leaderLineOptions);
    new LeaderLine(ovalLarge, ovalLargeOrnamented, leaderLineOptions);
    new LeaderLine(rhombodaMedium, rhombodaOrnamented, leaderLineOptions);
    new LeaderLine(rectangularMedium, rectangularMediumOrnamented, leaderLineOptions);
    new LeaderLine(rectangularMedium, rectangularMediumOrnamented2, leaderLineOptions);
    new LeaderLine(rectangularLarge, rectangularLargeOrnamented, leaderLineOptions);
    new LeaderLine(rectangularLarge, rectangularLargeSmooth, leaderLineOptions);
}
