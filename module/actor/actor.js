/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class twilightActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
    if (actorData.type === 'npc') this._prepareNpcData(actorData);
	  if (actorData.type === 'vehicle') this._prepareVehicleData(actorData);
  }

  /**
   * Prepare Vehicle type specific data
   */
  
  _prepareVehicleData(actorData) {
    const data = actorData.data;
    console.log("ASDF",actorData);
    
    const gear=[];
    const weapons=[];
    
	  let cargoWeight=0.0;
    
    function countWeight(itemData){
      if (itemData.container!='none'){
        cargoWeight+=itemData.weight*itemData.quantity;
      }
    }
    
    for (let i of actorData.items){
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      
      switch (i.type){
        case 'gear':
          countWeight(i.data);
          gear.push(i);
          break;
        case 'weapon':
          countWeight(i.data);
          weapons.push(i);
          break;
		    default:
          break;
      }
    }
    actorData.gear=gear;
    actorData.weapons=weapons;
    
    actorData.weight={'cargo':cargoWeight,'max':data.cargo_cap};
    console.log(actorData.weight);
  }
  /**
   * Prepare NPC type specific data
   */
  _prepareNpcData(actorData) {
    const data = actorData.data;
    
    // Make modifications to data here. For example:
    const rankValues = {"A":12,"B":10,"C":8,"D":6,"F":0,"-":0};
    for (let [key, attribute] of Object.entries(data.attributes)) {
      // Calculate the modifier using d20 rules.
      attribute.base_die = rankValues[attribute.rating];
    }
    for (let [key, skill] of Object.entries(data.skills)) {
      // Calculate the modifier using d20 rules.
      skill.base_die = rankValues[skill.rating];
    }
    data.cuf.base_die=rankValues[data.cuf.rating];
    data.morale.base_die=rankValues[data.morale.rating];
    
    const gear=[];
    const weapons=[];
    const armor=[];
    
	  let parts= {"head":0,"arms":0,"torso":0,"legs":0};
    
    let carryWeight=0.0;
    let packWeight=0.0;
    
    function countWeight(itemData){
      if (itemData.container=='carried' || itemData.container=='equipped'){
        carryWeight+=itemData.weight*itemData.quantity;
      }
      else if (itemData.container=='packed'){
        packWeight+=itemData.weight*itemData.quantity;
      }
    }
    
    for (let i of actorData.items){
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      
      switch (i.type){
        case 'gear':
          countWeight(i.data);
          gear.push(i);
          break;
        case 'weapon':
          countWeight(i.data);
          weapons.push(i);
          break;
        case 'armor':
          countWeight(i.data);
          let d = i.data
          if (d.container=='equipped' && d.value > parts[d.location]){
            parts[d.location]=d.value;
          }
          armor.push(i);
          break;
        default:
          break;
      }
    }
    actorData.gear=gear;
    actorData.weapons=weapons;
    actorData.armors=armor;
    
    actorData.armorValue=parts;
    
    actorData.weight={'carried':carryWeight,'packed':packWeight,'max':data.attributes.str.base_die};
    console.log(actorData.weight);
    
    data.hits.max=Math.ceil((data.attributes.str.base_die+data.attributes.agi.base_die)/4);
    
    
  }
  
  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    
    // Make modifications to data here. For example:
    const rankValues = {"A":12,"B":10,"C":8,"D":6,"F":0,"-":0};
    for (let [key, attribute] of Object.entries(data.attributes)) {
      // Calculate the modifier using d20 rules.
      attribute.base_die = rankValues[attribute.rating];
    }
    for (let [key, skill] of Object.entries(data.skills)) {
      // Calculate the modifier using d20 rules.
      skill.base_die = rankValues[skill.rating];
    }
    data.cuf.base_die=rankValues[data.cuf.rating];
    data.morale.base_die=rankValues[data.morale.rating];
    
    const gear=[];
    const specialties = [];
    const injuries=[];
    const diseases=[];
    const weapons=[];
    const armor=[];
    
	  let parts= {"head":0,"arms":0,"torso":0,"legs":0};
    
    let carryWeight=0.0;
    let packWeight=0.0;
    
    function countWeight(itemData){
      if (itemData.container=='carried' || itemData.container=='equipped'){
        carryWeight+=itemData.weight*itemData.quantity;
      }
      else if (itemData.container=='packed'){
        packWeight+=itemData.weight*itemData.quantity;
      }
    }
    
    for (let i of actorData.items){
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      
      switch (i.type){
        case 'gear':
          countWeight(i.data);
          gear.push(i);
          break;
        case 'specialty':
          specialties.push(i);
          break;
        case 'injury':
          injuries.push(i);
          break;
        case 'disease':
          diseases.push(i);
          break;
        case 'weapon':
          countWeight(i.data);
          weapons.push(i);
          break;
        case 'armor':
          countWeight(i.data);
          let d = i.data
          if (d.container=='equipped' && d.value > parts[d.location]){
            parts[d.location]=d.value;
          }
          armor.push(i);
          break;
        default:
          break;
      }
    }
    actorData.gear=gear;
    actorData.specialties=specialties;
    actorData.injuries=injuries;
    actorData.diseases=diseases;
    actorData.weapons=weapons;
    actorData.armors=armor;
    
    actorData.armorValue=parts;
    
    actorData.weight={'carried':carryWeight,'packed':packWeight,'max':data.attributes.str.base_die};
    console.log(actorData.weight);
    
    data.hits.max=Math.ceil((data.attributes.str.base_die+data.attributes.agi.base_die)/4);
    data.stress.max=Math.ceil((data.attributes.int.base_die+data.attributes.emp.base_die)/4);
    
    
  }
  
  
  static skillroll (ranks="",ammo="",dialog=true){
    //Double Success counter by Crymic, Modified by Redpisces for Twilight 2000 v4
    const dieTypes={"A":12,"B":10,"C":8,"D":6,"F":0};

    let confirmed = false;
    // What number is starting number needed for a single success
    const singleSuccess = 6;
    // What number is starting number needed for a double success, set to 0 to disable
    const doubleSuccess = 10;
    let roll_it = `<form autocomplete="off"><p>Enter Ranks [A,B,C,D,F]+-(mod) and number of ammo dice</p><div class="form-group"><label for="num">Ranks:</label><input id="num" type="num" value="${ranks}"/><img style="border:none;height:24px;" src="systems/twilight2000v4/icons/rank-3.svg"/></div><div class="form-group"><label for="ammo">Ammo:</label><input id="ammo" type="num" value="${ammo}"/><img style="border:none;height:24px;" src="systems/twilight2000v4/icons/bullets.svg"/></div></form>`;
    new Dialog({
        title: `Die  Roller`,
        content: roll_it,
        buttons: {
            roll: { label: "Roll it!", callback: () => confirmed = true },
            cancel: { label: "Cancel", callback: () => confirmed = false }
        },
        close: html => {
            if (confirmed){
              var the_content = "";
              
              var fails = 0;
            //BEGIN RANKS
              {
                let ranks = html.find('#num').val().toUpperCase();
                let dice =[];
                let symbols="";
                
                for (let symbol of ranks){
                  if (['+','-','0','1','2','3','4','5','6','7','8','9'].includes(symbol)){
                    symbols+=symbol;
                  }
                }
                let mod=eval(symbols);
                
                
                for (let letter of ranks){
                  if (letter in dieTypes){
                    dice.push(letter);
                  }
                }
                dice.sort(function(a,b){
                  return a.localeCompare(b);
                });
                console.log(mod);
                for (let i=0;i<dice.length;i++){
                  loop1:
                  while(mod>0){
                    switch (dice[i]){
                      case "D":
                        dice[i]="C";
                        mod--;
                        break;
                      case "C":
                        dice[i]="B";
                        mod--;
                        break;
                      case "B":
                        dice[i]="A";
                        mod--;
                        break;
                      default:
                        break loop1;
                    }
                  }
                }
                for (let i=dice.length-1;i>=0;i--){
                  loop1:
                  while(mod<0){
                    switch (dice[i]){
                      case "D":
                        dice[i]="F";
                        mod++;
                        break;
                      case "C":
                        dice[i]="D";
                        mod++;
                        break;
                      case "B":
                        dice[i]="C";
                        mod++;
                        break;
                      case "A":
                        dice[i]="B";
                        mod++;
                        break;
                      default:
                        break loop1;
                    }
                  }
                }
                let formula="{";
                
                while (dice.length > 1){
                  formula+=`1d${dieTypes[dice.pop()]},`;
                }
                if (dice.length == 1){
                  formula+=`1d${dieTypes[dice.pop()]}}`;
                }
                
                let roll = new Roll(`${formula}cs>=${singleSuccess}`).roll();
                let bonus = "";
                let get_dice = "";
                for (let groups of roll.dice){
                  let dice_roll = groups.results;
                  let dieNum = groups.faces;
                  for (let dice of dice_roll){
                      // comment out if no double successes
                      if (dice.result >= doubleSuccess) { bonus ++; }
                      if (dice.result >= singleSuccess){ get_dice += `<li class="roll die d${dieNum} success">${dice.result}</li>`; }
                      else if (dice.result == 1){get_dice += `<li class="roll die d${dieNum} failure">${dice.result}</li>`;fails ++;}
                      else { get_dice += `<li class="roll die d${dieNum}">${dice.result}</li>`; }
                  }
                }
                // if no double success uncomment below and remove the entry below that.
                //let total = roll.total;
                let total = roll.total;
                if (bonus) total += bonus;
                the_content = `<div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div>Dice Roller - Number of Successes<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${html.find('#num').val().toUpperCase()}</div><div class="dice-tooltip"><div class="dice"><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total">${total} Succeses</h4></div></div></div></div></div></div>`;
              }
              //END RANKS
              //BEGIN AMMO
              {
                let dice = parseInt(html.find('#ammo').val());
                if (dice)
                {
                  let roll = new Roll(`${dice}d6cs>=${singleSuccess}`).roll();
                  let bonus = "";
                  let get_dice = "";
                  let shots=0;
                  for (let groups of roll.dice){
                    let dice_roll = groups.results;
                    let dieNum = groups.faces;
                    for (let dice of dice_roll){
                        shots+=dice.result;
                        if (dice.result >= singleSuccess){ get_dice += `<li class="roll die d${dieNum} success">${dice.result}</li>`; }
                        else if (dice.result == 1){get_dice += `<li class="roll die d${dieNum} failure">${dice.result}</li>`;fails ++;}
                        else { get_dice += `<li class="roll die d${dieNum}">${dice.result}</li>`; }
                    }
                  }
                  let total = roll.total;
                  
                  the_content += `<div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div>Dice Roller - Number of Ammo Hits<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${shots} shots fired</div><div class="dice-tooltip"><div class="dice"><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total">${total} Hits</h4></div></div></div></div></div></div>`;
                }
              }
              //END AMMO
              the_content+=`
              <div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div class="dice-roll"><div class="dice-result"><h4 class="dice-total">${fails} Total Ones</h4></div></div></div></div></div></div>`
              ChatMessage.create({ user: game.user._id, content: the_content, type: CONST.CHAT_MESSAGE_TYPES.OOC});
            }
          
          
        }}).render(true);

      }
}
