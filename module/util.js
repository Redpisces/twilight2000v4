export const DIE_TYPES = { "A": 12, "B": 10, "C": 8, "D": 6, "F": 0, "-": 0 };

export function getItemHiddenFields(i) {
  let item = i;
  const data = item.data;

  if (item.type === "weapon") {
    function hideFields(fields) {
      for (let f of fields) {
        data[f].hidden = true;
      }
    }
    switch (data.type.value) {
      case "melee":
        hideFields(["ammo", "rel", "rof", "range", "blast", "mag"])
        break;
      case "bow_thrown":
        hideFields(["ammo", "rel", "rof", "blast", "mag"])
        break;
      case "grenade":
        hideFields(["ammo", "rel", "rof", "mag"])
        break;
      default:

        break;
    }
  }
  return item;
}

async function messageRollResult(html, data={}) {

  let weapon=data['weapon'];
  let actor=data['actor'];

  let capped = "";
  const singleSuccess = 6;
  const doubleSuccess = 10;

  var the_content = "";
  let title = "Number of Successes";
  var fails = 0;
  let sDice = 0;
  let weaponUpdate;
  if (weapon) {
    weaponUpdate = { '_id': weapon._id }
    title=`Attacks with ${weapon.name}`;
  }
  //BEGIN RANKS
  {
    let ranks = html.find('#num').val().toUpperCase();
    let dice = [];
    let symbols = "";

    for (let symbol of ranks) {
      if (['+', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(symbol)) {
        symbols += symbol;
      }
    }
    let mod = eval(symbols);


    for (let letter of ranks) {
      if (letter in DIE_TYPES) {
        dice.push(letter);
      }
    }
    dice.sort(function (a, b) {
      return a.localeCompare(b);
    });
    for (let i = 0; i < dice.length; i++) {
      loop1:
      while (mod > 0) {
        switch (dice[i]) {
          case "D":
            dice[i] = "C";
            mod--;
            break;
          case "C":
            dice[i] = "B";
            mod--;
            break;
          case "B":
            dice[i] = "A";
            mod--;
            break;
          default:
            break loop1;
        }
      }
    }
    for (let i = dice.length - 1; i >= 0; i--) {
      loop1:
      while (mod < 0) {
        switch (dice[i]) {
          case "D":
            dice[i] = "F";
            mod++;
            break;
          case "C":
            dice[i] = "D";
            mod++;
            break;
          case "B":
            dice[i] = "C";
            mod++;
            break;
          case "A":
            dice[i] = "B";
            mod++;
            break;
          default:
            break loop1;
        }
      }
    }
    let formula = "{";
    if (dice.length > 100) {
      capped += "CAPPED TO 100 SKILL DICE"
    }
    while (dice.length > 100) {
      dice.pop();
    }
    while (dice.length > 1) {
      sDice++;
      formula += `1d${DIE_TYPES[dice.pop()]},`;
    }
    if (dice.length == 1) {
      sDice++;
      formula += `1d${DIE_TYPES[dice.pop()]}}`;
    }

    let roll = new Roll(`${formula}cs>=${singleSuccess}`).roll();
    let bonus = "";
    let get_dice = "";
    for (let groups of roll.dice) {
      let dice_roll = groups.results;
      let dieNum = groups.faces;
      for (let dice of dice_roll) {
        // comment out if no double successes
        if (dice.result >= doubleSuccess) { bonus++; }
        if (dice.result >= singleSuccess) { get_dice += `<li class="roll die d${dieNum} success">${dice.result}</li>`; }
        else if (dice.result == 1) { get_dice += `<li class="roll die d${dieNum} failure">${dice.result}</li>`; fails++; }
        else { get_dice += `<li class="roll die d${dieNum}">${dice.result}</li>`; }
      }
    }
    // if no double success uncomment below and remove the entry below that.
    //let total = roll.total;
    let total = roll.total;
    if (bonus) total += bonus;
    the_content = `<div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div>Dice Roller - ${title}<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${html.find('#num').val().toUpperCase()}</div><div class="dice-tooltip"><div class="dice"><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total">${total} Succeses</h4></div></div></div></div></div></div>`;
  }
  //END RANKS
  //BEGIN AMMO
  {
    let dice = parseInt(html.find('#ammo').val());
    if (dice) {
      if (dice > 100) {
        dice = 100
        capped += "CAPPED TO 100 AMMO DICE"
      }
      let roll = new Roll(`${dice}d6cs>=${singleSuccess}`).roll();
      let get_dice = "";
      let shots = 0;
      for (let groups of roll.dice) {
        let dice_roll = groups.results;
        let dieNum = groups.faces;
        for (let dice of dice_roll) {
          shots += dice.result;
          if (dice.result >= singleSuccess) { get_dice += `<li class="roll die d${dieNum} success">${dice.result}</li>`; }
          else if (dice.result == 1) { get_dice += `<li class="roll die d${dieNum} failure">${dice.result}</li>`; fails++; }
          else { get_dice += `<li class="roll die d${dieNum}">${dice.result}</li>`; }
        }
      }
      let total = roll.total;

      the_content += `<div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div>Dice Roller - Number of Ammo Hits<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${shots} shots fired</div><div class="dice-tooltip"><div class="dice"><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total">${total} Extra Hits</h4></div></div></div></div></div></div>`;

      if (weapon) {
        if (shots > weapon.data.mag.value) {
          weaponUpdate['data.mag.value'] = 0;
        } else {
          weaponUpdate['data.mag.value'] = weapon.data.mag.value - shots;
        }
      }
    }
  }
  //END AMMO
  the_content += `<div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div class="dice-roll"><div class="dice-result"><h4 class="dice-total">${fails} Total Ones</h4></div></div></div></div></div></div>`;
  if (actor && weapon) {
    if (fails >= 2 || (fails >= 1 && sDice <= 1)) {

      switch (weapon.data.rel.value) {
        case 'A':
          weaponUpdate['data.rel.value'] = 'B';
          break;
        case 'B':
          weaponUpdate['data.rel.value'] = 'C';
          break;
        case 'C':
          weaponUpdate['data.rel.value'] = 'D';
          break;
        case 'D':
          weaponUpdate['data.rel.value'] = 'F';
          break;
        default:
          break;
      }

      let rel = DIE_TYPES[weapon.data.rel.value]
      let relRoll = new Roll(`2d${rel}cs>=6`).roll();
      let get_dice = "";
      for (let groups of relRoll.dice) {
        let dice_roll = groups.results;
        let dieNum = groups.faces;
        for (let dice of dice_roll) {
          if (dice.result >= singleSuccess) { get_dice += `<li class="roll die d${dieNum} success">${dice.result}</li>`; }
          else if (dice.result == 1) { get_dice += `<li class="roll die d${dieNum} failure">${dice.result}</li>`; }
          else { get_dice += `<li class="roll die d${dieNum}">${dice.result}</li>`; }
        }
      }

      if (relRoll.total == 0) {
        the_content += `<div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div>Dice Roller - Reliability Roll<div class="dice-roll"><div class="dice-result"><div class="dice-tooltip"><div class="dice"><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total">${relRoll.total} Successes, the weapon breaks</h4></div></div></div></div></div></div>`;
        weaponUpdate['data.rel.value'] = 'F';
      } else {
        the_content += `<div class="chat-card item-card"><div class="card-buttons"><div class="flexrow 1"><div>Dice Roller - Reliability Roll<div class="dice-roll"><div class="dice-result"><div class="dice-tooltip"><div class="dice"><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total">${relRoll.total} Successes</h4></div></div></div></div></div></div>`;
      }
    }
    await actor.updateEmbeddedEntity("OwnedItem", weaponUpdate);
  }

  let msg = { user: game.user._id, content: the_content, type: CONST.CHAT_MESSAGE_TYPES.ROLL };
  if (actor){
    msg['speaker']={_id:actor._id,alias:actor.name};
  }
  ChatMessage.create(msg);
  if (capped !== "") {
    ChatMessage.create({ user: game.user._id, content: `<div>${capped}</div>`, type: CONST.CHAT_MESSAGE_TYPES.EMOTE });
  }

}

//Data{actor,weapon,ranks,ammo}
export function skillroll(data={}) {
  if (data.weapon && data.weapon.data.type.value !== 'melee') {
    if (data.weapon.data.rel.value === 'F') {
      new Dialog({
        title: `Error`,
        content: '<div>Weapon Broken</div>',
        buttons: {
          cancel: { label: "Ok", callback: () => { } }
        }
      }).render(true);
      return;
    }
    if (data.weapon.data.mag.value === 0) {
      new Dialog({
        title: `Error`,
        content: '<div>Magazine Empty</div>',
        buttons: {
          cancel: { label: "Ok", callback: () => { } }
        }
      }).render(true);
      return;
    }
  }
  let ranks = (data.ranks) ? data.ranks : "";
  let ammo = (data.ammo) ? data.ammo : "";

  let roll_it = `<form autocomplete="off"><p>Enter Ranks [A,B,C,D,F]+-(mod) and number of ammo dice</p><div class="form-group"><label for="num">Ranks:</label><input id="num" type="num" value="${ranks}"/><img style="border:none;height:24px;" src="modules/game-icons-net/blacktransparent/rank-3.svg"/></div><div class="form-group"><label for="ammo">Ammo:</label><input id="ammo" type="num" value="${ammo}"/><img style="border:none;height:24px;" src="modules/game-icons-net/blacktransparent/heavy-bullets.svg"/></div></form>`;
  new Dialog({
    title: `Die  Roller`,
    content: roll_it,
    buttons: {
      roll: { label: "Roll it!", callback: (html) => messageRollResult(html,data) },
      cancel: { label: "Cancel", callback: () => { } }
    }
  }).render(true);

}