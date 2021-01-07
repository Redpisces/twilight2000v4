//Double Success counter by Crymic, Modified by Redpisces for Twilight 2000 v4
const dieTypes={"A":12,"B":10,"C":8,"D":6,"F":0};

let confirmed = false;
// What number is starting number needed for a single success
const singleSuccess = 6;
// What number is starting number needed for a double success, set to 0 to disable
const doubleSuccess = 10;
let roll_it = `<form autocomplete="off"><p>Enter Ranks [A,B,C,D,F]+-(mod) and number of ammo dice</p><div class="form-group"><label for="num">Ranks:</label><input id="num" type="num"/><img style="border:none;height:24px;" src="systems/twilight2000v4/icons/rank-3.svg"/></div><div class="form-group"><label for="ammo">Ammo:</label><input id="ammo" type="num"/><img style="border:none;height:24px;" src="systems/twilight2000v4/icons/bullets.svg"/></div></form>`;
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
            the_content = `<div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div>Dice Roller - Number of Successes<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${roll.formula}</div><div class="dice-tooltip"><div class="dice"><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total">${total} Succeses</h4></div></div></div></div></div></div>`;
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
              for (let groups of roll.dice){
                let dice_roll = groups.results;
                let dieNum = groups.faces;
                for (let dice of dice_roll){
                    if (dice.result >= singleSuccess){ get_dice += `<li class="roll die d${dieNum} success">${dice.result}</li>`; }
                    else if (dice.result == 1){get_dice += `<li class="roll die d${dieNum} failure">${dice.result}</li>`;fails ++;}
                    else { get_dice += `<li class="roll die d${dieNum}">${dice.result}</li>`; }
                }
              }
              let total = roll.total;
              
              the_content += `<div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div>Dice Roller - Number of Ammo Hits<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${roll.formula}</div><div class="dice-tooltip"><div class="dice"><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total">${total} Hits</h4></div></div></div></div></div></div>`;
            }
          }
          //END AMMO
          the_content+=`
          <div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div class="dice-roll"><div class="dice-result"><h4 class="dice-total">${fails} Total Ones</h4></div></div></div></div></div></div>`
          ChatMessage.create({ user: game.user._id, speaker: ChatMessage.getSpeaker({token: actor}), content: the_content, type: CONST.CHAT_MESSAGE_TYPES.OOC});
        }
      
      
    }}).render(true);
