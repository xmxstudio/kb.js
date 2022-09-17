class keyboardGenerator{ 

  constructor(rootElement,keysString = 'qwertyuiop,|asdfghjkl, zxcvbnm'){
    this.rootElement = document.querySelector(rootElement);
    ["[space]","[enter]","[capslock]","[escape]"].forEach(rep=>keysString=keysString.replace(rep, '*')) //not implemented yet. fuck u later me.
    this.keysString = keysString;
    this.keys = [];
    this.maxRowCount = this.keysString.split(',').map(s=>s.length).sort((a,b)=>b-a)[0];
    this.palette = ['RED','ORANGE','YELLOW','GREEN','BLUE','FUSCHIA'];
    this.rgb;
    this.rgbIndex = 0;
    this.rgbspeed = 200;
    this._events = {}; 
    this.generateCSS();
    this.generateUI();
    this.setupHandlers();
  }
  on(name,listener){
    if(!this._events[name]){
      this._events[name] = [];
    }
    this._events[name].push(listener);
  }
  removeListener(name, listenerToRemove) {
    if (!this._events[name]) {
      throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
    }
    const filterListeners = (listener) => listener !== listenerToRemove;
    this._events[name] = this._events[name].filter(filterListeners);
  }
  emit(name, data) {
    if (!this._events[name]) {
      throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`);
    }
    const fireCallbacks = (callback) => {
      callback(data);
    };

    this._events[name].forEach(fireCallbacks);
  }

  enableRGB(){
    this.simulateRGB();
  }
  disableRGB(){
    clearInterval(this.rgb);
    this.rgb ='';
    Object.values(this.keys).forEach(key=>{
      key.style.backgroundColor = 'white';
    })
  }
  disableKey(key){
    this.keys[key].classList.add('disabled');
    this.keys[key].disabled = true;
    
  }
  enableKey(key){
    this.keys[key].classList.remove('disabled');
    this.keys[key].disabled = '';
  }
  generateCSS(){
    this.rootElement.style.display = 'flex';
    this.rootElement.style.flexDirection = 'column';
    this.rootElement.style.width = `${this.maxRowCount*24}px`
    this.rootElement.appendChild(Object.assign(document.createElement('style'),{type: 'text/css', innerHTML: `.kb-key,.kb-space,.kb-half{ 
        display: flex;
        float: left;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        border: solid 1px #666;
        height: 20px;
        width: 20px;
        margin: 1px;
        cursor: pointer;
        user-select: none;
        transition: all .75s;
      }
      .kb-key:hover{
        box-shadow: 0 0 3px rgba(0,0,50,0.5), inset 0 0 10px rgba(0,0,50,0.5);
      }
      .kb-key:active{
        box-shadow: 0 0 0px #000, inset 1px 2px 10px rgba(0,0,50,0.85);
      }
      .kb-space,.kb-half{
        border: none;
        opacity: 0;
      }
      .kb-half{
        width: 10px;
        opacity: 0
      }
      .disabled{
        color: rgba(0,0,0,0.2);
        border: solid 1px  rgba(0,0,0,0.2);
      }
      `})
    )
  }
  generateUI(){
    let tempRow;
    this.keysString.split(',').map((keyrow,i)=>{
      tempRow = Object.assign(document.createElement('div'),{id: `kbrow-${i}`, className:'kbrow'});
      [...keyrow].map(key=>{
        let newkey = Object.assign(document.createElement('span'),{id: `kb-${key}`, className: key===" "? 'kb-space': key==='|'? 'kb-half':'kb-key', innerText: key==='|'?'':key});
        this.keys[key] =newkey;
        tempRow.appendChild(newkey)
      })
      this.rootElement.appendChild(tempRow)
      })
  }

  setupHandlers(){
    document.addEventListener('keydown',this.onKeyDown);
    document.addEventListener('keyup',this.onKeyUp);
    document.addEventListener('keypress',this.onKeyPress);
    document.addEventListener('click',this.onClick);
  }

  simulateRGB=()=>{
    
    if(!this.rgb) {
      this.rgb = setInterval(this.simulateRGB,this.rgbspeed);
    }
    //ghetto rgb =)
    // Object.values(this.keys).forEach(key=>{
    //   if(key.innerText.length) key.style.backgroundColor = this.palette[~~(Math.random() * this.palette.length)];
    // })
    //basic bitch rgb
    this.rgbIndex+= this.rgbIndex >= this.maxRowCount ? -this.maxRowCount: 1;
    [...this.rootElement.querySelectorAll('.kbrow')].forEach((row,i)=>{
        for(let i = row.children.length ; i > 0;i--){
          try {
            row.children[i].style.backgroundColor = row.children[i-1].style.backgroundColor;
          } catch (error) {
          }
        }
        row.children[0].style.backgroundColor = this.palette[0];
    })
    this.palette.push(this.palette.shift());
  }
  onKeyDown=e=>{
    try {
      if(this.keys[e.key].isDown){
        return;
      }
      if(this.keys[e.key].disabled){
        return;
      }
      this.keys[e.key].isDown = true;
      this.keys[e.key].style.backgroundColor = "#263C6D";
      this.emit('keyDown',e.key);
    } catch (error) {
    }
  }
  onKeyUp=e=>{
    try {
      this.keys[e.key].isDown = false;
      this.keys[e.key].style.backgroundColor = "#fff";
      this.emit('keyUp',e.key);
    } catch (error) {
    }
  }
  onKeyPress=e=>{
    try {
      this.emit('keyPress',e.key);
    } catch (error) {
    }
  } 
  onClick=e=>{
    if(e.target.className != 'kb-key') return;
    try {
      this.emit('keyClick',e.target.id.split('-')[1]);
    } catch (error) {
    }
  }
}