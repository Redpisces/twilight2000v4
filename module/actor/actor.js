import { getItemHiddenFields, DIE_TYPES } from "../util.js";
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
    if (actorData.type === 'place') this._preparePlaceData(actorData);

    return data;
  }

  /**
  * Prepare Place type specific data
  */
  _preparePlaceData(actorData) {
    const data = actorData.data;

    this._prepareVehicleData(actorData);

    data.water['tprod'] = data.water.prod - data.water.cons;

    data.food['tprod'] = data.food.prod - data.food.cons;

    data.fuel['tprod'] = data.fuel.prod - data.fuel.cons;
  }

  /**
  * Prepare Vehicle type specific data
  */
  _prepareVehicleData(actorData) {
    const data = actorData.data;
    const gear = [];
    const weapons = [];

    let cargoWeight = 0.0;

    function countWeight(itemData) {
      if (itemData.container.value != 'none') {
        cargoWeight += itemData.weight.value * itemData.quantity.value;
      }
    }
    let items = actorData.items.sort(function (a, b) {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    })
    for (let i of items) {
      let item = getItemHiddenFields(i);
      item.img = item.img || DEFAULT_TOKEN;
      if (item.type === 'weapon' && item.data.equipped.value) {
        countWeight(item.data);
        weapons.push(item);
      } else {
        countWeight(item.data);
        gear.push(item);
      }

    }
    actorData.gear = gear;
    actorData.weapons = weapons;

    actorData.weight = { 'cargo': cargoWeight, 'max': data.cargo_cap };
  }

  /**
  * Prepare data specific to the human template used by npcs and characters
  */
  _prepareHumanData(actorData) {
    const data = actorData.data;
    for (let [key, attribute] of Object.entries(data.attributes)) {
      attribute.base_die = DIE_TYPES[attribute.rating];
    }
    for (let [key, skill] of Object.entries(data.skills)) {
      skill.base_die = DIE_TYPES[skill.rating];
    }
    data.cuf.base_die = DIE_TYPES[data.cuf.rating];
    data.morale.base_die = DIE_TYPES[data.morale.rating];

    const gear = [];
    const specialties = [];
    const injuries = [];
    const diseases = [];
    const weapons = [];
    const armor = [];

    let parts = {};

    let carryWeight = 0.0;
    let packWeight = 0.0;

    function countWeight(itemData) {
      if (itemData.container.value == 'carried') {
        carryWeight += itemData.weight.value * itemData.quantity.value;
      }
      else if (itemData.container.value == 'packed') {
        packWeight += itemData.weight.value * itemData.quantity.value;
      }
    }
    let items = actorData.items.sort(function (a, b) {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    })
    for (let i of items) {
      let item = getItemHiddenFields(i);
      item.img = item.img || DEFAULT_TOKEN;

      switch (item.type) {
        case 'gear':
          countWeight(item.data);
          gear.push(item);
          break;
        case 'specialty':
          specialties.push(item);
          break;
        case 'injury':
          injuries.push(item);
          break;
        case 'disease':
          diseases.push(item);
          break;
        case 'weapon':

          if (item.data.equipped.value && actorData.primaryWeapon === undefined) {
            actorData.primaryWeapon = item;
          }

          countWeight(item.data);
          weapons.push(item);
          break;
        case 'armor':
          countWeight(item.data);
          let d = item.data;
          armor.push(item);
          if (!d.equipped.value) {
            break;
          }
          if (parts[d.location.value] === undefined) {
            parts[d.location.value] = item;
          }
          else if (d.equipped.value && d.value.value > parts[d.location.value].data.value.value) {
            parts[d.location.value] = item;
          }
          break;
        default:
          break;
      }
    }
    actorData.gear = gear;
    actorData.specialties = specialties;
    actorData.injuries = injuries;
    actorData.diseases = diseases;
    actorData.weapons = weapons;
    actorData.armors = armor;

    actorData.armorValue = parts;

    actorData.weight = { 'carried': carryWeight, 'packed': packWeight, 'max': data.attributes.str.base_die };

    data.hits.max = Math.ceil((data.attributes.str.base_die + data.attributes.agi.base_die) / 4);
  }

  /**
   * Prepare NPC type specific data
   */
  _prepareNpcData(actorData) {
    this._prepareHumanData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    this._prepareHumanData(actorData);
    const data = actorData.data;
    data.stress.max = Math.ceil((data.attributes.int.base_die + data.attributes.emp.base_die) / 4);
  }

}
