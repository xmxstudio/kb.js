// let kb = new keyboardGenerator('#keyboard', 'qwerty,asdf,zxcvbn,qwerty,qwerty');
let kb2 = new keyboardGenerator('#keyboard2','+,-,[enter][space]');


let hm = document.querySelector("#hangman");
let man = ['0','0<br/>|','0<br/>|<br/>/','0<br/>|<br/>/\\',' 0<br/>-|<br/>/\\',' 0<br/>-|-<br/>/\\'];
hm.gameover = false;
hm.wrong = 0;
fetch('https://random-word-api.herokuapp.com/word').then((response) => response.json()).then((data) =>{
  hm.word = [...data[0]];
  hm.guess = new Array(hm.word.length).fill("-");
  hm.innerHTML = hm.guess.join(' ');
} );



let kb = new keyboardGenerator('#keyboard');
kb.enableRGB()
kb.on('keyDown',k=>{  
  if(hm.gameover == true) return;
  if(kb.keys[k].disabled) return;
  let found = false;
  hm.word.forEach((l,i)=>{
    if(l==k){
      hm.guess[i]=k;
      found=true;
    }
  });
  if(!found) hm.wrong++;
  hm.innerHTML = `${hm.guess.join(' ')} wrong: ${hm.wrong}<br/>${man[hm.wrong]}`; 
  if(hm.wrong == 5){
    hm.gameover = true;
    hm.innerHTML+= `correct word was <strong>${hm.word.join('')}</strong>`;
    kb.disableRGB();
  }
  kb.disableKey(k);
})



//kb.on('keyClick',k=>{  kb.disableKey(k);})
kb2.on('keyDown',e=>{
  if(e == "-"){
    kb.disableRGB();
  }else if(e=="+"){
    kb.enableRGB();
  }
})



// setTimeout(function(){
//   kb.disableRGB();
// },5000);

// kb.on('keyDown',k=>{ console.log('down',k);})
// kb.on('keyUp',k=>{  console.log('up',k);})
